# Copilot instructions

## Proyecto
Este repositorio es un Mini Service Desk de triaje de incidencias de seguridad física y control de accesos.

## Referencias clave
- [README.md](../README.md)
- [docs/constitution.md](../docs/constitution.md)
- [docs/spec.md](../docs/spec.md)
- [docs/diseno.md](../docs/diseno.md)

## Principios
- Mantener el stack mínimo: HTML, CSS y JavaScript plano, sin frameworks ni dependencias innecesarias.
- La especificación es la fuente de verdad del comportamiento esperado.
- La lógica de clasificación no debe depender de la interfaz ni del DOM.
- Los tickets se guardan localmente en un archivo plano, preferiblemente JSON.
- Los mensajes visibles para el usuario y el código deben estar en español.
- La validación y los tests del comportamiento afectado son obligatorios antes de cerrar una tarea.

## Buenas prácticas
- Priorizar cambios pequeños y verificables.
- No introducir funcionalidad fuera del alcance definido en la especificación.
- Guardar el dato en la carpeta [data/](../data/). 
- Mantener una clara separación entre lógica de negocio, utilidades y presentación.
- Cuando el código y la especificación entren en conflicto, resolverlo según la especificación y no por improvisación.
