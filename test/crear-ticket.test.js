import test from "node:test";
import assert from "node:assert/strict";
import { createTicket } from "../js/ticket-service.js";
import { classifyTicket } from "../js/classify.js";
import { prioritizeTicket } from "../js/prioritize.js";

test("clasifica tickets según las palabras clave del dominio", () => {
  assert.equal(classifyTicket({ titulo: "Alarma perimetral" }), "Alarmas");
  assert.equal(classifyTicket({ titulo: "Ronda de guardia" }), "Guardias");
  assert.equal(classifyTicket({ sistema_afectado: "SailPoint" }), "Identidades");
  assert.equal(classifyTicket({ titulo: "Lector de tarjetas" }), "Accesos");
});

test("prioriza tickets según las señales de riesgo y afectación", () => {
  assert.equal(prioritizeTicket({ titulo: "Puerta de emergencia abierta sin alarma" }), "Crítica");
  assert.equal(prioritizeTicket({ titulo: "Cuadrante sin sincronizar" }), "Alta");
  assert.equal(prioritizeTicket({ titulo: "Lector biométrico lento" }), "Media");
  assert.equal(prioritizeTicket({ titulo: "Solicitud de tarjeta" }), "Baja");
});

test("crea un ticket nuevo con estado y trazabilidad inicial", () => {
  const ticket = createTicket({
    titulo: "Puerta de emergencia abierta sin alarma",
    descripcion: "La puerta permanece abierta en el edificio B.",
    sistema_afectado: "Central de alarmas",
    reportado_por: "Guardia de seguridad",
    zona: "Edificio B"
  });

  assert.ok(ticket.id, "el ticket debe tener un identificador");
  assert.ok(ticket.fecha, "el ticket debe tener una fecha");
  assert.equal(ticket.estado, "abierto");
  assert.equal(ticket.decision, "Pendiente");
  assert.equal(ticket.titulo, "Puerta de emergencia abierta sin alarma");
  assert.equal(ticket.zona, "Edificio B");
});

test("marca como incompleto un ticket sin zona", () => {
  const ticket = createTicket({
    titulo: "Puerta de emergencia abierta sin alarma",
    descripcion: "La puerta permanece abierta, pero no se conoce la ubicación.",
    sistema_afectado: "Central de alarmas",
    reportado_por: "Guardia de seguridad"
  });

  assert.equal(ticket.estado, "incompleto");
  assert.equal(ticket.decision, "Pendiente");
});