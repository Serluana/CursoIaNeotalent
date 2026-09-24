---
name: auditoria-antes-de-publicar
description: "Audita una app estática antes de publicarla en Surge. Usar cuando se pida una auditoría previa a despliegue, revisión antes de Surge o auditoría de seguridad, responsive, rutas, archivos públicos y arquitectura. Escribe el informe completo en docs/auditoria.md y no publica ni modifica la aplicación."
---

# Auditoría antes de publicar

## Objetivo

Audita el repositorio real antes de subirlo a Surge. La fuente de verdad es el código que existe en el workspace: no deduzcas comportamiento por nombres de archivos, README o estructura declarada si no lo confirma una referencia ejecutable.

El único entregable que esta skill puede crear o modificar es:

```text
docs/auditoria.md
```

No publiques nada, no ejecutes `surge`, no crees `.surgeignore` y no modifiques HTML, CSS, JavaScript, datos, tests o documentación existente. El `.surgeignore` se puede proponer dentro del informe, pero no se crea durante esta auditoría.

Esta skill solo cubre la **Fase 1: auditoría**. La **Fase 2** es una acción separada y requiere una petición posterior explícita: aplicar los arreglos críticos y altos, crear `.surgeignore` y publicar con el dominio indicado por la persona, por ejemplo `servicedesk-grupo-N.surge.sh`. No anticipes esa fase aunque el repositorio ya tenga una sesión de Surge iniciada.

## Método obligatorio

1. Lee primero `AGENTS.md`, `.github/copilot-instructions.md` si existe, `README.md`, `docs/constitution.md`, `docs/spec.md` y `docs/diseno.md`.
2. Identifica los puntos de entrada reales: HTML servido, scripts importados, hojas CSS, datos cargados y tests relevantes.
3. Sigue cada dato desde su origen hasta la pantalla o almacenamiento. Busca especialmente `innerHTML`, `textContent`, `fetch`, `localStorage`, `eval`, scripts externos, formularios y rutas relativas.
4. Enumera todos los archivos del repositorio que podrían publicarse si se sirve la raíz completa. Distingue lo que la app necesita de lo que solo es documentación, test, instrucción, prototipo o material de referencia.
5. Revisa los breakpoints CSS y calcula el espacio mínimo de grids, flexbox, botones, formularios y texto para 375 px, 768 px y 1440 px. Si hay navegador disponible, valida también con una comprobación visual. Si no lo hay, decláralo y no presentes una inferencia CSS como observación de pantalla.
6. Comprueba por HTTP las rutas esenciales cuando sea posible: `index.html`, CSS, JavaScript, `data/tickets.json` y recursos referenciados. Distingue `file://` de HTTP publicado.
7. Ejecuta el test o validación relevante que ya exista. Si no puede ejecutarse, explica por qué.
8. Redacta `docs/auditoria.md` en español. No finalices hasta que incluya todos los apartados obligatorios.

## Apartados obligatorios del informe

### 1. Método y límites

Explica:

- fecha y alcance;
- qué significa **Comprobado**: evidencia directa del código, test, inventario o respuesta HTTP;
- qué significa **Interpretación**: conclusión razonable que no se observó directamente;
- comandos o validaciones ejecutados;
- limitaciones, por ejemplo ausencia de Chromium o imposibilidad de ejecutar Surge.

### 2. Resumen ejecutivo

Incluye una tabla con hallazgo, severidad y decisión antes de publicar. Usa únicamente estas severidades:

- **Crítico**: impide publicar o puede causar daño grave inmediato.
- **Alto**: debe corregirse antes de publicar.
- **Medio**: riesgo relevante o deuda que debe decidirse conscientemente.
- **Bajo**: mejora o riesgo limitado.

### 3. Seguridad

Comprueba y documenta con archivo y línea:

- si la entrada del usuario y el contenido del dataset se escapan antes de llegar al DOM;
- si se usa `innerHTML` con valores de tickets;
- si existen claves, contraseñas, tokens, secretos, cabeceras de autorización o datos personales;
- si `localStorage` contiene datos accesibles sin autenticación;
- qué información del dataset queda descargable públicamente;
- qué marca, logos o material de terceros se publican;
- qué archivos no hacen falta para ejecutar la app.

Si no encuentras secretos, dilo como comprobación de texto y aclara que no es una garantía criptográfica ni una revisión de historial Git.

### 4. Responsive

Analiza por separado 375 px, 768 px y 1440 px. Revisa breakpoints existentes y reporta:

- desbordamiento horizontal;
- solapamiento o compresión de barra superior, formularios y botones;
- grids con mínimos mayores que el ancho disponible;
- texto largo sin wrapping;
- `overflow: hidden` que pueda ocultar contenido.

Distingue siempre entre un resultado observado en navegador y un riesgo deducido estáticamente del CSS.

### 5. Despliegue

Revisa:

- rutas relativas y sensibilidad a mayúsculas/minúsculas;
- carga de `data/tickets.json`;
- diferencia entre abrir con `file://` y servir por HTTP;
- comprobación de `response.ok` y errores de carga;
- persistencia y errores de `localStorage`;
- rutas o configuraciones que dependan de estar en la raíz;
- cualquier cosa que funcione localmente y pueda fallar publicada.

### 6. Arquitectura y flujo

Explica para alguien nuevo:

- responsabilidad comprobada de cada archivo relevante;
- imports y referencias reales;
- relación entre HTML, CSS, JavaScript y datos;
- recorrido de un dato desde JSON o formulario hasta DOM y almacenamiento;
- separación real o ausencia de separación entre dominio y presentación;
- diferencias entre `README.md`/spec y el comportamiento implementado.

Incluye fragmentos breves de HTML, CSS y JavaScript realmente presentes, comentados en español, cuando ayuden a entender el comportamiento o el riesgo. No inventes fragmentos ni los presentes como arreglos ya aplicados.

### 7. Archivos publicables

Incluye dos listas:

1. mínimo necesario para que la app funcione;
2. documentación interna, tests, instrucciones, `CLAUDE.md`, material de referencia, mockups, skills y assets no referenciados que deberían excluirse.

Comprueba por referencias e imports; no excluyas un archivo solo por su nombre si la app lo necesita.

### 8. Arreglos rápidos

Termina con una lista ordenada por impacto. Debe incluir, cuando proceda:

- escape seguro de datos;
- corrección de responsive en tablet y móvil;
- paquete mínimo o `.surgeignore` propuesto;
- confirmación de que el dataset es sintético;
- robustez de `fetch` y `localStorage`;
- alineación entre documentación y comportamiento real;
- revisión de marcas o assets de terceros.

Incluye un bloque `gitignore` con el `.surgeignore` recomendado, pero escribe explícitamente que el archivo no se ha creado.

## Reglas de evidencia

- Cada hallazgo debe tener severidad, archivo y línea cuando el formato lo permita.
- Usa enlaces Markdown relativos con ancla de línea para archivos del workspace.
- No presentes una descripción del README como comportamiento comprobado si el código no la confirma.
- No llames "IA" a una heurística local ni "persistente" a un cambio que solo vive en memoria.
- No ocultes fallos de validación: regístralos junto con el alcance que sí se pudo comprobar.
- No publiques ni ejecutes credenciales. Si una herramienta solicita contraseña, detente y deja que la persona la introduzca en su terminal.

## Criterio de finalización

La skill está completa cuando `docs/auditoria.md` contiene las cuatro revisiones solicitadas, distingue hechos de interpretaciones, clasifica hallazgos por severidad con referencias, explica la arquitectura para una persona nueva, incluye fragmentos comentados y termina con arreglos rápidos y `.surgeignore` propuesto. La aplicación y el proceso de publicación deben permanecer sin cambios.

## Invocación

En Claude Code puede invocarse explícitamente con:

```text
/auditoria-antes-de-publicar
```

También debe activarse al pedir en lenguaje natural una auditoría antes de publicar en Surge que mencione seguridad, responsive, despliegue o arquitectura.

Después de revisar el informe, la segunda fase se solicita por separado con una instrucción explícita del tipo:

```text
Aplica los arreglos críticos y altos de la auditoría, crea el .surgeignore y publica en surge con el dominio servicedesk-grupo-N.surge.sh.
```

El valor `N` debe conservarse literalmente como el número indicado por la persona. Si el dominio no se proporciona, pregunta antes de publicar; no inventes uno.
