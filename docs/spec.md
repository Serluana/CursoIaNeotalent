## Contexto
El sistema debe ayudar a una persona que triaja incidencias de seguridad física y control de accesos a clasificar, priorizar y decidir el siguiente paso de cada ticket con apoyo de IA, sin sustituir la responsabilidad final del operador humano.

## Historias de usuario
- Como operador de triaje diario, quiero ver una bandeja con los tickets entrantes ordenados por urgencia y riesgo para identificar rápidamente qué casos requieren atención inmediata.
- Como operador de triaje diario, quiero recibir una sugerencia de categoría y prioridad para cada ticket para decidir con más rapidez si se trata de acceso, identidad, alarma o guardia.
- Como operador de triaje diario, quiero entender por qué el sistema sugiere una categoría o prioridad para poder validar la recomendación antes de cerrar o derivar el ticket.
- Como operador de triaje diario, quiero poder corregir una sugerencia equivocada y dejar constancia de la decisión final para mantener trazabilidad del triaje.
- Como responsable del proceso, quiero que los tickets ambiguos o incompletos no queden ocultos ni se resuelvan sin revisión para evitar errores en seguridad física.
- Como operador de triaje diario, quiero crear un ticket nuevo desde la bandeja para registrar una incidencia que acaba de comunicarse.

## Requisitos funcionales
- ### Requisito: Bandeja de entrada de tickets
  El sistema debe mostrar una bandeja de trabajo con todos los tickets pendientes, identificados por su origen, su resumen y su estado actual.
  - Criterio de aceptación: desde la vista principal, cada ticket pendiente aparece en la bandeja con un identificador único, un resumen legible y un estado inicial de “nuevo” o equivalente; no puede haber un ticket sin registro visible.

- ### Requisito: Creación y persistencia local de tickets
  La bandeja debe ofrecer una acción “Nuevo ticket” para que el operador registre una incidencia con sus datos básicos. Los tickets creados durante el uso de la aplicación deben guardarse en el `localStorage` del navegador y no modificar `data/tickets.json`, que actúa únicamente como dataset inicial de demostración.
  - Criterio de aceptación: al completar y guardar un ticket nuevo, el sistema genera un identificador único, lo muestra en la bandeja con estado inicial “nuevo” o equivalente y conserva sus datos en `localStorage`.
  - Criterio de aceptación: al recargar o volver a abrir la aplicación en el mismo navegador, los tickets creados por el operador siguen visibles junto al dataset inicial.
  - Criterio de aceptación: la creación de un ticket no escribe ni altera el contenido de `data/tickets.json`.

- ### Requisito: Clasificación automática por categoría
  El sistema debe asignar a cada ticket una categoría dentro del catálogo del dominio de seguridad física: accesos, identidades, alarmas, guardias u otra categoría definida por la especificación del proyecto.
  - Criterio de aceptación: cuando se procesa un ticket, el sistema genera una categoría sugerida y la muestra junto al ticket; si la categoría no tiene suficiente evidencia, el sistema debe marcarlo como “sin clasificar” en vez de forzar una elección.

- ### Requisito: Priorización sugerida
  El sistema debe sugerir una prioridad o nivel de urgencia para cada ticket según el riesgo, la afectación y la necesidad de respuesta.
  - Criterio de aceptación: cada ticket con información suficiente muestra una prioridad sugerida y un motivo breve asociado; si faltan datos para priorizar, el sistema debe indicar que la prioridad está pendiente de revisión.

- ### Requisito: Explicación de la sugerencia
  El sistema debe exponer la base de la sugerencia en términos entendibles para el operador, sin revelar detalles técnicos internos ni decisiones opacas.
  - Criterio de aceptación: cada sugerencia de categoría, prioridad o triaje incluye una explicación legible del motivo principal que la sustenta, y esa explicación resulta comprensible para una persona que trabaja a diario con tickets de seguridad física.

- ### Requisito: Confirmación humana antes de cerrar el triaje
  La persona que revisa el ticket debe confirmar, corregir o rechazar la sugerencia de la IA antes de que el ticket quede triajeado de forma definitiva.
  - Criterio de aceptación: un ticket solo puede pasar a un estado finalizado de triaje si la persona ha realizado una acción explícita de confirmación o corrección; el sistema no admite “aceptar automáticamente” sin intervención del operador.

- ### Requisito: Derivación a responsable o flujo de seguimiento
  El sistema debe permitir que el operador asigne el ticket a un responsable, equipo o flujo de seguimiento según la categoría y la prioridad sugeridas.
  - Criterio de aceptación: una vez revisado el ticket, el sistema muestra al menos una opción de asignación válida y permite registrar la decisión final; si no existe responsable, el ticket queda en espera para revisión manual.

- ### Requisito: Revisión de tickets ambiguos o incompletos
  Cuando un ticket no aporta suficiente información, el sistema debe señalarlo claramente y pedir la información que falta antes de considerarlo triajeado.
  - Criterio de aceptación: si el ticket carece de datos esenciales para clasificar o priorizar, se marca como incompleto y aparece en una cola de revisión; no puede quedar resuelto como si estuviera completo.

- ### Requisito: Detección de duplicados y candidatos de coincidencia
  El sistema debe detectar si un ticket podría duplicar otro ya existente o corresponder al mismo evento, con señalización para revisión humana.
  - Criterio de aceptación: cuando dos o más tickets comparten los mismos datos clave o referencias equivalentes, el sistema los marca como potencialmente duplicados y exige que el operador confirme o descarte la duplicidad.

- ### Requisito: Registro de la decisión final
  Cada ticket debe conservar la decisión final de clasificación, prioridad y responsable para que pueda auditarse y revisarse más adelante.
  - Criterio de aceptación: al cerrar la revisión de un ticket, el sistema registra de forma permanente la categoría final, la prioridad final, la persona o equipo asignado y la fecha de la decisión, sin perder la trazabilidad del cambio.

- ### Requisito: No automatización de acciones físicas
  El sistema no debe ejecutar ni sugerir como finalizada una acción que altere físicamente el acceso, la alarma o la seguridad sin confirmación humana explícita.
  - Criterio de aceptación: cualquier acción con efecto físico o de seguridad necesita un paso explícito de confirmación por parte del operador; si falta esa confirmación, la acción no se ejecuta ni se marca como realizada.

## Requisitos no funcionales
- ### Requisito: Tiempo de respuesta de la bandeja
  La bandeja de trabajo debe permitir que el operador visualice y revisar tickets de forma fluida en un conjunto de aproximadamente 60 incidencias.
  - Criterio de aceptación: con 60 tickets cargados, la pantalla de triaje responde en tiempo razonable para la operación diaria y no requiere recarga manual para consultar el estado actualizado de los tickets.

- ### Requisito: Claridad para el operador humano
  La interfaz y los mensajes deben estar redactados en español y expresados con un lenguaje comprensible para un perfil de triaje operativo, sin jerga técnica innecesaria.
  - Criterio de aceptación: cualquier etiqueta, aviso o mensaje visible para el usuario usa un vocabulario claro, en español, y evita términos ambiguos para la operación diaria.

- ### Requisito: Seguridad del manejo de información sensible
  La información relativa a accesos, identidades, alarmas o guardias debe manejarse con restricciones de acceso y sin exposición innecesaria.
  - Criterio de aceptación: el sistema no muestra a usuarios no autorizados datos que no correspondan a su rol de triaje; cualquier dato sensible requiere visualizarse solo en el contexto del ticket y no como información pública general.

- ### Requisito: Trazabilidad de decisiones
  La revisión humana debe quedar registrada para poder comprobar quién tomó la decisión final y cuándo.
  - Criterio de aceptación: cada ticket finalizado conserva un historial mínimo con la sugerencia de IA, la corrección o confirmación del operador y la fecha de la decisión final.

## Casos límite
- ### Caso: Ticket con categoría no clara
  Cuando un ticket no encaja de forma inequívoca en una categoría del dominio, el sistema debe marcarlo como “sin clasificar” y dejarlo visible para revisión humana.
  - Criterio de aceptación: un ticket sin categoría clara no se cierra ni se deriva automáticamente como si estuviera resuelto; queda en revisión y requiere decisión manual.

- ### Caso: Ticket duplicado
  Cuando varios tickets describen el mismo hecho o hacen referencia al mismo acceso, alarma o incidente, el sistema debe avisar de posible duplicidad sin cerrar ninguno por sí solo.
  - Criterio de aceptación: el sistema marca los relacioneS sospechosos y exige confirmación del operador antes de considerar uno como duplicado o consolidado.

- ### Caso: Ticket con datos incompletos
  Cuando falta información esencial como ubicación, persona implicada, tipo de evento o hora, el ticket debe quedar en estado incompleto.
  - Criterio de aceptación: el sistema identifica los campos faltantes y bloquea la resolución como completa hasta que el operador complete o revalide la información.

- ### Caso: Ticket con riesgo alto y poca información
  Cuando el ticket indica un riesgo elevado pero los datos no son suficientes para decidir la prioridad, el sistema debe priorizar la revisión humana y no asumir una clasificación definitiva.
  - Criterio de aceptación: en ese escenario, el sistema conserva una prioridad provisional y pone el ticket en revisión manual si la información disponible es insuficiente para una decisión segura.

## Fuera de alcance
- Esta primera versión no incluye la automatización completa del flujo operativo de atención a incidencias ni la ejecución directa de acciones físicas de seguridad.
- Esta primera versión no incluye la gestión de inventario de accesos, credenciales, alarmas o personal de seguridad como sistema operativo de negocio completo.
- Esta primera versión no incluye la personalización avanzada del modelo de IA ni la configuración administrativa del sistema por parte del operador diario.
- Esta primera versión no incluye diseño visual ni decisiones de layout, estilos o componentes de interfaz.
- Esta primera versión no incluye integración con sistemas externos ni sincronización automatizada con bases de datos o plataformas de terceros.

## Criterios de finalización
- El sistema se considera finalizado cuando la bandeja de tickets puede procesar un lote de prueba de aproximadamente 60 incidencias y cada ticket queda con una categoría, una prioridad y un estado de revisión claramente visibles.
- La revisión manual queda validada si, para cada ticket, la decisión final de la persona es persistente y puede consultarse posteriormente sin perder la trazabilidad.
- La supervisión humana queda validada si ningún ticket se acepta como resuelto sin intervención explícita del operador.
- La gestión de casos límite queda validada si los tickets sin categoría clara, duplicados e incompletos quedan marcados con una conducta explícita de revisión y no se resuelven automáticamente.
- La especificación queda validada si un stakeholder no técnico puede seguir el flujo del sistema y comprobar, con los datos de prueba, que cada decisión final del triaje se explica y se registra de forma comprensible.
