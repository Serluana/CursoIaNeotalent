function normalizeText(value) {
  return String(value || "").toLowerCase();
}

export function prioritizeTicket(ticket) {
  const text = normalizeText(`${ticket.titulo} ${ticket.descripcion}`);

  if (text.includes("alarma") || text.includes("cerrada") || text.includes("sin respuesta") || text.includes("puerta de emergencia") || text.includes("sin alarma")) {
    return "Crítica";
  }

  if (text.includes("bloqueada") || text.includes("duplicado") || text.includes("sin sincronizar") || text.includes("sin registrar") || text.includes("sin causa aparente")) {
    return "Alta";
  }

  if (text.includes("lento") || text.includes("histórico") || text.includes("cambio de horario") || text.includes("acceso temporal")) {
    return "Media";
  }

  return "Baja";
}