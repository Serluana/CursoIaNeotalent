function normalizeText(value) {
  return String(value || "").toLowerCase();
}

export function classifyTicket(ticket) {
  const text = normalizeText(`${ticket.titulo} ${ticket.descripcion} ${ticket.sistema_afectado} ${ticket.zona}`);

  if (text.includes("alarma") || text.includes("cámara") || text.includes("perimetral") || text.includes("movimiento")) {
    return "Alarmas";
  }

  if (text.includes("guardia") || text.includes("ronda") || text.includes("cuadrante") || text.includes("fichar") || text.includes("turno")) {
    return "Guardias";
  }

  if (text.includes("credencial") || text.includes("identidad") || text.includes("perfil") || text.includes("sailpoint") || text.includes("historico de accesos")) {
    return "Identidades";
  }

  return "Accesos";
}