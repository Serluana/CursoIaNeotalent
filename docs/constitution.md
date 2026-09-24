# Constitution — Mini Service Desk
Este documento define las reglas innegociables que toda especificación futura del proyecto debe respetar; si una especificación y este documento discrepan, este documento prevalece.

## 1. Stack mínimo
El proyecto usa HTML, CSS y JavaScript vanilla sin framework, sin bundler y sin dependencias adicionales salvo que esta misma constitución sea modificada formalmente y la necesidad quede justificada por escrito en el repositorio. 
**Por qué:** un Mini Service Desk de ~60 tickets y alcance acotado no justifica la complejidad operativa y de mantenimiento de capas extra de tooling.

## 2. Relación entre la especificación y el código
La especificación del proyecto es la fuente de verdad del comportamiento esperado y el código debe cumplirla exactamente; si una especificación y el código difieren, la especificación actualizada manda y el código debe corregirse antes de cerrar cualquier tarea. 
**Por qué:** sin esta regla, el desarrollo y la IA pueden producir implementaciones válidas según el código pero no según la intención del proyecto.

## 3. Separación entre lógica e interfaz
La lógica de clasificación de tickets vive en módulos de dominio o servicios y no puede importar ni depender de DOM, componentes, plantillas ni estilos; la interfaz solo puede invocar la lógica y nunca la inversa. 
**Por qué:** permite cambiar la presentación visual o el flujo de la pantalla sin reescribir la lógica de decisión del sistema.

## 4. Política de tests
Antes de cerrar cualquier tarea, debe ejecutarse al menos un test que compruebe el comportamiento afectado y cualquier test fallido bloquea el cierre de la tarea hasta que se corrija o se reconsidere la modificación. 
**Por qué:** en un proyecto pequeño, la regla útil es simple: no se acepta una tarea cerrada si la evidencia del comportamiento no la respalda.

## 5. Persistencia de los datos
El dataset `data/tickets.json` se usa como carga inicial de demostración y solo se lee desde la aplicación. Los tickets creados por el operador se guardan en el `localStorage` del navegador y deben recuperarse al volver a abrir la aplicación. La capa de acceso a datos no debe depender de un motor de base de datos ni de un servicio externo si el tamaño del proyecto no lo exige.
**Por qué:** el volumen y la complejidad del proyecto no justifican una base de datos relacional ni un acoplamiento persistente que aumente la carga de mantenimiento, y `localStorage` permite conservar las altas realizadas durante el uso local de la herramienta sin modificar el dataset de ejemplo.

## 6. Idioma y convenciones
Todo el código, nombres de variables, funciones, comentarios y mensajes visibles para el usuario se escriben en español; los términos técnicos internacionales solo se usan cuando no existe un equivalente claro en español. 
**Por qué:** un Mini Service Desk con usuarios locales necesita un lenguaje consistente, legible y verificable para evitar ambigüedad y facilitar el mantenimiento.

## Modificación de este documento
Cualquier cambio en este documento requiere aprobación explícita del responsable técnico del proyecto y constancia formal del cambio en el historial del repositorio con un mensaje de commit que describa la modificación aprobada.
