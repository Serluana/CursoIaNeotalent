import { createTicket } from "./ticket-service.js";
import { classifyTicket } from "./classify.js";
import { prioritizeTicket } from "./prioritize.js";

const priorityOrder = ["Crítica", "Alta", "Media", "Baja", "Pendiente"];
const priorityColumnMap = {
  Crítica: "critical",
  Alta: "high",
  Media: "medium",
  Baja: "low",
  Pendiente: "review"
};

const ticketState = {
  tickets: [],
  selectedId: null,
  search: ""
};

const summaryEl = document.getElementById("summary");
const queueEl = document.getElementById("queue");
const detailEl = document.getElementById("detail-panel");
const searchInput = document.getElementById("search-input");
const newTicketButton = document.getElementById("new-ticket-button");
const newTicketDialog = document.getElementById("new-ticket-dialog");
const newTicketForm = document.getElementById("new-ticket-form");
const closeTicketDialog = document.getElementById("close-ticket-dialog");
const cancelTicketButton = document.getElementById("cancel-ticket-button");

const localTicketsKey = "mini-service-desk-tickets";

function normalizeText(value) {
  return String(value || "").toLowerCase();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function computePriorityRank(priority) {
  return priorityOrder.indexOf(priority);
}

function getPriorityBadge(priority) {
  const lookup = {
    Crítica: "critical",
    Alta: "high",
    Media: "medium",
    Baja: "low",
    Pendiente: "review"
  };
  return lookup[priority] || "low";
}

function enrichTicket(ticket) {
  const category = classifyTicket(ticket);
  const priority = prioritizeTicket(ticket);

  return {
    ...ticket,
    category,
    priority,
    state: ticket.estado === "cerrado"
      ? "Cerrado"
      : ticket.estado === "incompleto"
        ? "Incompleto"
        : "Nuevo",
    decision: "Pendiente",
    history: [
      `${ticket.fecha} — IA sugirió ${category} / ${priority}`
    ]
  };
}

function loadLocalTickets() {
  try {
    return JSON.parse(localStorage.getItem(localTicketsKey) || "[]");
  } catch (error) {
    console.error(error);
    return [];
  }
}

function saveLocalTicket(ticket) {
  const localTickets = loadLocalTickets();
  localTickets.push(ticket);
  localStorage.setItem(localTicketsKey, JSON.stringify(localTickets));
}

function closeNewTicketDialog() {
  newTicketForm.reset();
  newTicketDialog.close();
}

function renderSummary(tickets) {
  const counts = {
    nuevos: tickets.filter((ticket) => ticket.state !== "Cerrado").length,
    urgentes: tickets.filter((ticket) => ticket.priority === "Crítica" || ticket.priority === "Alta").length,
    sinClasificar: tickets.filter((ticket) => ticket.category === "Sin clasificar").length,
    incompletos: tickets.filter((ticket) => ticket.decision === "Incompleto").length
  };

  summaryEl.innerHTML = `
    <div class="stat">
      <div class="stat-label">Nuevos</div>
      <div class="stat-value">${counts.nuevos}<small>pendientes</small></div>
    </div>
    <div class="stat">
      <div class="stat-label">Urgentes</div>
      <div class="stat-value">${counts.urgentes}<small>alta prioridad</small></div>
    </div>
    <div class="stat">
      <div class="stat-label">Sin clasificar</div>
      <div class="stat-value">${counts.sinClasificar}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Incompletos</div>
      <div class="stat-value">${counts.incompletos}</div>
    </div>
  `;
}

function filterTickets() {
  const query = normalizeText(ticketState.search);

  return ticketState.tickets.filter((ticket) => {
    if (!query) return true;

    const haystack = normalizeText(`${ticket.id} ${ticket.titulo} ${ticket.zona} ${ticket.category} ${ticket.priority}`);
    return haystack.includes(query);
  });
}

function renderQueue() {
  const visible = filterTickets();
  const columns = {
    Crítica: [],
    Alta: [],
    Media: [],
    Baja: [],
    Pendiente: []
  };

  visible.forEach((ticket) => {
    const priority = columns[ticket.priority] ? ticket.priority : "Pendiente";
    columns[priority].push(ticket);
  });

  const order = ["Crítica", "Alta", "Media", "Baja", "Pendiente"];

  queueEl.innerHTML = order
    .map((priority) => {
      const cards = columns[priority]
        .sort((a, b) => computePriorityRank(a.priority) - computePriorityRank(b.priority))
        .map((ticket) => {
          const isActive = ticket.id === ticketState.selectedId ? "active" : "";
          const badgeClass = getPriorityBadge(ticket.priority);

          return `
            <div class="ticket-card ${isActive}" data-ticket-id="${escapeHtml(ticket.id)}">
              <div class="ticket-top">
                <span class="ticket-id">${escapeHtml(ticket.id)}</span>
                <span class="badge ${badgeClass}">${escapeHtml(ticket.priority)}</span>
              </div>
              <div class="ticket-title">${escapeHtml(ticket.titulo)}</div>
              <div class="ticket-meta">
                <span>${escapeHtml(ticket.category)}</span>
                <span>${escapeHtml(ticket.fecha)}</span>
              </div>
            </div>
          `;
        })
        .join("") || '<div class="empty-state">Sin tickets</div>';

      return `
        <div class="priority-column">
          <div class="priority-header ${priorityColumnMap[priority] || "review"}">${priority}</div>
          <div class="ticket-list">${cards}</div>
        </div>
      `;
    })
    .join("");

  queueEl.querySelectorAll(".ticket-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.ticketId;
      ticketState.selectedId = id;
      renderQueue();
      renderDetail();
    });
  });
}

function renderDetail() {
  const selectedTicket = ticketState.tickets.find((ticket) => ticket.id === ticketState.selectedId) || ticketState.tickets[0];

  if (!selectedTicket) {
    detailEl.innerHTML = '<div class="empty-state">No hay tickets para mostrar.</div>';
    return;
  }

  ticketState.selectedId = selectedTicket.id;

  const aiReason = {
    Crítica: "Se detecta riesgo inmediato y la situación exige revisión inmediata del área afectada.",
    Alta: "Existe impacto real en la operación o en el acceso, pero requiere validación humana antes de cerrar el caso.",
    Media: "La incidencia es relevante pero no plantea una interrupción inmediata del servicio.",
    Baja: "La incidencia requiere seguimiento, pero no afecta de forma crítica a la operación ni a la seguridad."
  };

  const history = selectedTicket.history ? selectedTicket.history : [
    `${selectedTicket.fecha} — IA sugirió ${selectedTicket.category} / ${selectedTicket.priority}`
  ];

  detailEl.innerHTML = `
    <div class="detail-head">
      <h2>${escapeHtml(selectedTicket.id)}</h2>
      <span class="mini-tag">${escapeHtml(selectedTicket.category)}</span>
    </div>

    <div class="info-block">
      <span class="label">Resumen</span>
      <div class="value">${escapeHtml(selectedTicket.titulo)}</div>
    </div>

    <div class="meta-grid">
      <div class="info-block">
        <span class="label">Origen</span>
        <div class="value">${escapeHtml(selectedTicket.reportado_por)}</div>
      </div>
      <div class="info-block">
        <span class="label">Fecha</span>
        <div class="value">${escapeHtml(selectedTicket.fecha)}</div>
      </div>
    </div>

    <div class="status-box">
      <strong>Estado</strong>
      ${escapeHtml(selectedTicket.state)} / ${escapeHtml(selectedTicket.decision)}
    </div>

    <div class="ai-block">
      <span class="label">Sugerencia de IA</span>
      <div class="value">Categoría: ${escapeHtml(selectedTicket.category)}</div>
      <div class="value">Prioridad: ${escapeHtml(selectedTicket.priority)}</div>
      <p style="margin: 10px 0 0; color: var(--muted); line-height: 1.5;">${aiReason[selectedTicket.priority] || aiReason.Baja}</p>
    </div>

    <div class="action-row">
      <button class="btn primary" data-action="confirm">Confirmar</button>
      <button class="btn warn" data-action="correct">Corregir</button>
      <button class="btn danger" data-action="duplicate">Duplicado</button>
      <button class="btn success" data-action="incomplete">Incompleto</button>
    </div>

    <div class="history-block">
      <span class="label">Historial</span>
      <ul class="timeline">
        ${history.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
  `;

  detailEl.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const ticket = ticketState.tickets.find((item) => item.id === selectedTicket.id);

      if (!ticket) return;

      if (action === "confirm") {
        ticket.decision = "Confirmado";
        ticket.state = "Triajeado";
        ticket.history.push(`${new Date().toLocaleString()} — Operador confirmó la sugerencia`);
      }

      if (action === "correct") {
        ticket.decision = "Corregido";
        ticket.state = "Triajeado";
        ticket.priority = ticket.priority === "Crítica" ? "Alta" : ticket.priority;
        ticket.history.push(`${new Date().toLocaleString()} — Operador corrigió la decisión`);
      }

      if (action === "duplicate") {
        ticket.decision = "Duplicado";
        ticket.state = "Pendiente";
        ticket.history.push(`${new Date().toLocaleString()} — Ticket marcado como duplicado`);
      }

      if (action === "incomplete") {
        ticket.decision = "Incompleto";
        ticket.state = "Pendiente";
        ticket.history.push(`${new Date().toLocaleString()} — Ticket marcado como incompleto`);
      }

      renderSummary(ticketState.tickets);
      renderQueue();
      renderDetail();
    });
  });
}

function initializeApp() {
  fetch("data/tickets.json")
    .then((response) => response.json())
    .then((tickets) => {
      const localTickets = loadLocalTickets();
      ticketState.tickets = [...tickets, ...localTickets].map((ticket) => enrichTicket(ticket));
      ticketState.selectedId = ticketState.tickets[0]?.id || null;
      renderSummary(ticketState.tickets);
      renderQueue();
      renderDetail();
    })
    .catch((error) => {
      console.error(error);
      detailEl.innerHTML = '<div class="empty-state">No se pudo cargar el dataset de tickets.</div>';
      queueEl.innerHTML = '<div class="empty-state">No hay datos disponibles.</div>';
    });
}

newTicketButton.addEventListener("click", () => {
  newTicketDialog.showModal();
});

closeTicketDialog.addEventListener("click", closeNewTicketDialog);
cancelTicketButton.addEventListener("click", closeNewTicketDialog);

newTicketForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(newTicketForm);
  const ticket = createTicket(Object.fromEntries(formData.entries()));

  saveLocalTicket(ticket);
  ticketState.tickets.push(enrichTicket(ticket));
  ticketState.selectedId = ticket.id;
  renderSummary(ticketState.tickets);
  renderQueue();
  renderDetail();
  closeNewTicketDialog();
});

searchInput.addEventListener("input", (event) => {
  ticketState.search = event.target.value;
  renderQueue();
});

initializeApp();
