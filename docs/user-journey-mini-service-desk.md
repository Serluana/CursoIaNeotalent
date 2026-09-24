# User Journey — Mini Service Desk

## Visión general
Este recorrido describe cómo una persona que triaja incidencias de seguridad física y control de accesos revisa, valida y resuelve tickets con ayuda de IA, manteniendo la decisión final bajo su control.

## Opción elegida
### Flujo de cola por urgencia
Este recorrido prioriza el riesgo y la rapidez de revisión. La bandeja presenta los tickets ordenados por urgencia para que el operador atienda primero los casos más críticos y valore la recomendación de la IA antes de cerrar el triaje.

## Pantalla 1 — Panel principal de cola
### Objetivo
Dar una visión inmediata del volumen y la urgencia de los tickets pendientes para que el operador empiece por los casos más relevantes.

### Elementos clave
- Resumen ejecutivo:
  - tickets nuevos
  - tickets urgentes
  - tickets sin clasificar
  - tickets incompletos
- Colombia o zonas por prioridad:
  - crítico
  - alto
  - medio
  - bajo
  - revisión manual
- Tarjetas de ticket con:
  - identificador
  - resumen breve
  - categoría sugerida
  - prioridad sugerida
  - estado
  - tiempo desde la entrada

### Acción principal
Seleccionar un ticket para abrir su detalle y revisarlo.

## Pantalla 2 — Detalle del ticket
### Objetivo
Conseguir que el operador tenga toda la información necesaria para decidir sin perder contexto ni tiempo.

### Elementos clave
- Bloque de resumen:
  - referencia
  - origen
  - fecha de entrada
  - área o zona afectada
- Bloque de descripción:
  - texto del incidente
  - datos clave del caso
  - información relevante del acceso, alarma, identidad o guardia
- Bloque de IA:
  - categoría sugerida
  - prioridad sugerida
  - motivo principal de la recomendación
  - evidencia disponible o nivel de confianza
- Bloque de acciones:
  - confirmar
  - corregir
  - marcar como incompleto
  - marcar como duplicado
  - derivar a responsable

### Acción principal
Validar si la clasificación y la prioridad recomendadas son correctas.

## Pantalla 3 — Revisión y corrección
### Objetivo
Permitir al operador ajustar la recomendación cuando la IA no tenga suficiente evidencia o el caso requiera matices humanos.

### Elementos clave
- Campos editables:
  - categoría
  - prioridad
  - responsable o continuación del flujo
  - observaciones del operador
- Estados posibles:
  - triajeado
  - pendiente de información
  - duplicado
  - en espera
- Aviso de control humano:
  - la decisión final la toma la persona operativa

### Acción principal
Guardar la corrección o confirmación definitiva del triaje.

## Pantalla 4 — Confirmación y cierre
### Objetivo
Registrar la decisión final con trazabilidad para que la resolución quede documentada.

### Elementos clave
- Resumen de la decisión:
  - categoría final
  - prioridad final
  - responsable asignado
  - fecha y usuario que la validó
- Opciones:
  - confirmar cierre
  - volver a la cola
  - abrir siguiente ticket

### Acción principal
Cerrar la revisión y volver al flujo de trabajo.

## Pantalla 5 — Auditoría e historial
### Objetivo
Mantener una trazabilidad clara del proceso de triaje, sin complicar la jornada operativa.

### Elementos clave
- Historial del ticket:
  - sugerencia inicial de IA
  - correcciones del operador
  - decisión final
  - responsable
  - fecha de cada cambio
- Estado final del caso:
  - completado
  - pendiente
  - duplicado
  - incompleto

### Acción principal
Consultar la trazabilidad del caso en cualquier momento.

## Flujo recomendado
1. El operador entra en la cola de prioridad.
2. Revisa el ticket más urgente.
3. Consulta la sugerencia de IA y su explicación.
4. Confirma, corrige o marca el caso como incompleto o duplicado.
5. Asigna responsable o flujo.
6. Guarda la decisión final.
7. Regresa a la cola para seguir trabajando.

## Regla de negocio del recorrido
La IA no sustituye al operador: su papel es sugerir, apoyar y acelerar la decisión; la persona valida y registra la resolución final.

## Criterios de aceptación del recorrido
- La persona puede ver la cola de tickets por prioridad y urgencia desde la pantalla principal.
- Cada ticket muestra información suficiente para decidir sin abrir demasiados contextos.
- La sugerencia de IA incluye una explicación comprensible.
- El operador puede confirmar, corregir, marcar como incompleto o como duplicado.
- La decisión final queda registrada con trazabilidad.
- Ningún caso se da por resuelto sin la validación humana.

## Diseño de pantallas y estructura de contenido

### Pantalla 1 — Panel principal de cola
```
+--------------------------------------------------------------+
| Mini Service Desk            [Filtros] [Buscar] [Resumen]     |
+--------------------------------------------------------------+
| CRÍTICO | ALTO | MEDIO | BAJO | REVISIÓN MANUAL              |
| 12      | 8    | 15    | 20   | 6                            |
+--------------------------------------------------------------+
| Ticket | Resumen                 | Cat. | Prioridad | Estado |
| T-104  | Puerta 7 cerrada      | Acceso | Crítica | Nuevo  |
| T-109  | Alarmas activadas     | Alarma | Alta    | Nuevo  |
| T-112  | Credencial bloqueada  | Ident. | Media   | Nuevo  |
| T-118  | Guardia no confirma   | Guardia| Baja    | Pend.  |
+--------------------------------------------------------------+
```

### Pantalla 2 — Detalle del ticket
```
+--------------------------------------------------------------+
| T-104 | Puerta 7 cerrada | Estado: Nuevo | [Confirmar] [Corregir] |
+--------------------------------------------------------------+
| Origen: Panel de accesos   | Fecha: 22/09/2026 09:15            |
| Área: Edificio Norte       | Responsable sugerido: Seguridad     |
+--------------------------------------------------------------+
| Descripción del incidente: ...                                |
| Persona afectada: ...                                          |
| Sistema implicado: ...                                         |
+--------------------------------------------------------------+
| Sugerencia IA:                                                |
| Categoría: Acceso                                             |
| Prioridad: Crítica                                            |
| Motivo: puerta cerrada durante horario activo y posible riesgo |
| Evidencia: 3 señales de acceso + 2 incidencias previas        |
+--------------------------------------------------------------+
| [Confirmar] [Corregir] [Duplicado] [Incompleto] [Derivar]     |
+--------------------------------------------------------------+
```

### Pantalla 3 — Revisión y corrección
```
+--------------------------------------------------------------+
| Corrección del triaje del ticket T-104                        |
+--------------------------------------------------------------+
| Categoría: [Acceso   v]                                        |
| Prioridad: [Crítica v]                                        |
| Responsable: [Seguridad  v]                                   |
| Observaciones: _____________________________________________ |
|                                                             |
| [Guardar decisión] [Cancelar]                                 |
+--------------------------------------------------------------+
```

### Pantalla 4 — Confirmación y cierre
```
+--------------------------------------------------------------+
| Decisión final del ticket T-104                               |
+--------------------------------------------------------------+
| Categoría final: Acceso                                        |
| Prioridad final: Crítica                                      |
| Responsable: Seguridad                                         |
| Validado por: Operador A | 22/09/2026 09:42                    |
+--------------------------------------------------------------+
| [Volver a la bandeja] [Abrir siguiente ticket]               |
+--------------------------------------------------------------+
```

### Pantalla 5 — Auditoría e historial
```
+--------------------------------------------------------------+
| Historial del ticket T-104                                     |
+--------------------------------------------------------------+
| 09:15 - IA sugirió: Acceso / Crítica                          |
| 09:20 - Operador corrigió: Acceso / Alta                      |
| 09:30 - Operador confirmó: Acceso / Crítica                   |
| 09:42 - Ticket cerrado por Operador A                         |
+--------------------------------------------------------------+
```

## Patrones de interacción

### 1. IA como sugerencia, no como decisión final
- La IA muestra una recomendación de categoría y prioridad.
- El operador debe confirmar, corregir o rechazar antes de cerrar el triaje.
- La decisión final se guarda siempre con la huella del usuario.

### 2. Revisión por urgencia
- La pantalla principal presenta primero los casos más críticos.
- La prioridad visual guía la atención del agente sin ocultar el resto de la cola.
- Los tickets incompletos o ambiguos quedan en una sección de revisión dedicada.

### 3. Trazabilidad constante
- Cada cambio de categoría, prioridad o responsable debe quedarse registrado.
- El historial es visible para el operador y para la auditoría posterior.

### 4. Separación clara entre contenido y operación
- La información del ticket se presenta con el texto principal y los datos relevantes.
- Las decisiones del operador se gestionan en un bloque de acción explícito.
- La lógica de negocio no se mezcla con la estética ni con la representación visual.

## Estados del ticket

### Estado 1 — Nuevo
- El ticket acaba de llegar y todavía no ha sido revisado.
- La IA puede sugerir categoría y prioridad, pero la persona debe validarlo.

### Estado 2 — En revisión
- El ticket tiene una sugerencia de IA visible y requiere decisión del operador.
- El operador puede corregirlo, añadir contexto o marcarlo como incompleto.

### Estado 3 — Incompleto
- Faltan datos esenciales para categorizar o priorizar con seguridad.
- El ticket no se puede cerrar como resuelto.

### Estado 4 — Duplicado
- Los datos o referencias apuntan a que es una repetición del mismo caso.
- Debe confirmarse manualmente antes de consolidar o descartar.

### Estado 5 — Triajeado
- La decisión final está registrada.
- El ticket tiene categoría, prioridad, responsable y trazabilidad.

## Reglas de contenido por pantalla
- La pantalla de cola debe priorizar urgencia y volumen del trabajo.
- La pantalla de detalle debe mostrar la información mínima necesaria para decidir.
- La pantalla de corrección debe enfocarse en decisiones y observaciones, no en decoración ni detalles visuales superfluos.
- La pantalla de cierre debe dejar claro qué se ha decidido y quién lo ha validado.
- La pantalla de historial debe ser legible en segundos y no reemplazar la decisión del operador.

## Criterios de aceptación del diseño
- La pantalla principal permite identificar el ticket más urgente en menos de tres segundos.
- El detalle del ticket expone la sugerencia de IA junto con la información del caso.
- El operador puede confirmar o corregir la decisión sin salir del flujo principal.
- La decisión final queda registrada y visible con fecha y responsable.
- Los tickets incompletos, duplicados y sin categoría clara no se cierran como resueltos sin revisión humana.
