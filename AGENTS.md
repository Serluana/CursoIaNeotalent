# AGENTS.md

## Propósito
Este repositorio es un Mini Service Desk estático para triaje de incidencias de seguridad física. La función principal del agente es ayudar a mantener el proyecto conforme a la especificación y a la constitución del proyecto, sin introducir complejidad innecesaria.

## Documentos de referencia
- [README.md](README.md)
- [docs/constitution.md](docs/constitution.md)
- [docs/spec.md](docs/spec.md)
- [docs/diseno.md](docs/diseno.md)

## Convenciones obligatorias
- Mantener el proyecto en HTML + CSS + JavaScript plano. No añadir frameworks, bundlers ni dependencias nuevas salvo que la constitución lo apruebe expresamente.
- Tratar [docs/spec.md](docs/spec.md) como fuente de verdad del comportamiento esperado. Si el código y la especificación discrepan, la especificación actualizada manda.
- Separar claramente la lógica de negocio y la interfaz. La lógica de clasificación y triaje debe vivir en módulos de dominio o servicios, no depender del DOM ni de la representación visual.
- Mantener los datos en un archivo local plano, preferiblemente JSON, en la carpeta [data/](data/).
- Escribir en español los mensajes visibles para el usuario, los comentarios y los nombres que se expongan al código por conveniencia del proyecto.
- Antes de cerrar una tarea, ejecutar la prueba o validación pertinente del comportamiento afectado; un test fallido bloquea el cierre de la tarea.

## Estructura del proyecto
- [index.html](index.html): entrada principal de la app.
- [css/](css/): estilos de la interfaz.
- [js/](js/): lógica de la interfaz y utilidades.
- [data/](data/): conjunto de tickets de prueba.
- [docs/](docs/): especificación, diseño y constitución.

## Reglas de edición
- No introducir arquitectura nueva ni infraestructura de compilación sin justificación explícita.
- No crear nuevos nombres de archivo ni patrones de carpetas salvo que el problema lo exija claramente.
- Mantener las decisiones de producto alineadas con la especificación; no improvisar funcionalidades que no estén cubiertas por la documentación del proyecto.
- Probar los cambios relevantes antes de declarar la tarea terminada.
- Si una modificación afecta a la lógica de triaje, comprobar que no se ha mezclado con reglas de presentación ni con detalles de interfaz.

## Cómo operar en este repo
- El proyecto se abre directamente en el navegador sin instalación previa.
- Preferir cambios pequeños y verificables sobre refactorizaciones grandes.
- Cuando se añadan tickets o datos, respetar la intención del dominio de seguridad física y control de accesos sin inventar requisitos ajenos al proyecto.
- Mantener la documentación existente como punto de consulta; no duplicar contenido ni reescribir lo que ya está en los documentos del repositorio.
