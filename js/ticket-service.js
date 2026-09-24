export function createTicket(data) {
  const timestamp = Date.now();
  const estaIncompleto = !String(data.zona || "").trim();

  return {
    ...data,
    id: `SVD-${timestamp}`,
    fecha: new Date(timestamp).toISOString().slice(0, 10),
    estado: estaIncompleto ? "incompleto" : "abierto",
    decision: "Pendiente"
  };
}