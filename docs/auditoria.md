# Auditoría previa a publicación en Surge

**Fecha de revisión:** 24/09/2026  
**Alcance:** revisión del repositorio que hay en el workspace, antes de publicar.  
**Decisión:** no se ha publicado nada y no se han modificado archivos distintos de este documento.

## Cómo leer este informe

Una afirmación **comprobada** sale directamente del código, de una respuesta HTTP, de un test o de un inventario de archivos. Una afirmación **interpretada** es una conclusión razonable basada en esos hechos; se marca como tal para no confundirla con una prueba. Las líneas citadas son líneas 1-based del archivo revisado.

La comprobación dinámica se hizo sirviendo el directorio con `python -m http.server`. `index.html`, `data/tickets.json` y `css/styles.css` respondieron `200`, y `node --test test/crear-ticket.test.js` terminó con 2 tests pasados. No se pudo ejecutar un navegador automatizado porque este entorno no tiene Chromium instalado; por eso las conclusiones de responsive son inspección del CSS y no una captura real en tres dispositivos.

## Resumen ejecutivo

| Severidad | Hallazgo principal | Estado antes de publicar |
|---|---|---|
| **Alto** | Datos de tickets se interpolan sin escapar en `innerHTML`; un ticket manipulado puede convertirse en HTML o JavaScript. | Corregir antes de publicar. |
| **Alto** | A 768 px la cola conserva cinco columnas de mínimo 150 px y desborda horizontalmente. | Corregir antes de publicar. |
| **Medio** | Surge serviría como archivos públicos también `docs/`, tests, instrucciones, mockup y material de referencia si se publica la carpeta completa. | Excluir con `.surgeignore` o publicar un directorio mínimo. |
| **Medio** | Los 60 tickets del JSON se descargan íntegramente y quedan visibles para cualquiera; además se guardan altas en `localStorage`, sin control de acceso. | Aceptable solo si todos los datos siguen siendo de demostración. |
| **Medio** | El código contradice la especificación en clasificación, asignación, persistencia de decisiones y descripción del ticket. | Revisar antes de presentar la app como completa. |
| **Medio** | La carga relativa funciona en HTTP desde la raíz de Surge, pero abrir `index.html` directamente puede fallar por `fetch`/CORS y los errores de carga son poco diagnósticos. | Documentar o validar el modo de apertura. |

No he encontrado claves, contraseñas, tokens ni cabeceras de autorización en la búsqueda literal del repositorio. Esto es una comprobación de texto, no una garantía criptográfica ni un análisis de historial Git.

## 1. Arquitectura comprobada

### Qué hace cada archivo

| Archivo o carpeta | Hecho comprobado | ¿Necesario para la app publicada? |
|---|---|---|
| [`index.html`](../index.html#L1-L86) | Define la estructura inicial, enlaza CSS, carga el módulo `js/app.js` y referencia el icono y wordmark de Verisure. | Sí. |
| [`css/styles.css`](../css/styles.css#L1-L934) | Contiene todos los estilos. Hay una primera definición de varios bloques y otra definición posterior que los sobrescribe desde la línea 637; no es una hoja pequeña ni modular. | Sí. |
| [`js/app.js`](../js/app.js#L1-L375) | Orquesta carga, clasificación heurística, búsqueda, renderizado, diálogo y acciones. También contiene la lógica de dominio. | Sí. |
| [`js/ticket-service.js`](../js/ticket-service.js#L1-L14) | Crea el identificador, fecha y estado inicial de un ticket. No renderiza ni clasifica. | Sí. |
| [`data/tickets.json`](../data/tickets.json#L1-L8) | Dataset inicial con 60 tickets; sus campos son `id`, `titulo`, `descripcion`, `sistema_afectado`, `reportado_por`, `zona`, `fecha` y `estado`. | Sí para esta demo. Es público. |
| `assets/verisure/verisure-official-icon.ico` y `assets/verisure/verisure-official-wordmark.png` | Son los dos recursos que realmente referencia `index.html` en sus líneas 30-31. | Sí si se mantiene esa identidad y hay autorización. |
| `assets/verisure/verisure-logo-1.svg`, `verisure-logo-2.svg` | Existen, pero no tienen referencias desde la app ejecutable comprobada. | No. |
| [`test/crear-ticket.test.js`](../test/crear-ticket.test.js#L1-L27) | Test unitario de `createTicket`; no se carga desde la web. | No. |
| [`mockup-mini-service-desk.html`](../mockup-mini-service-desk.html#L1-L12) | Mockup autónomo con CSS y JavaScript propios; no está enlazado desde `index.html`. | No. |
| [`README.md`](../README.md#L1-L73), `docs/`, `AGENTS.md`, `.github/`, `.agents/`, `.claude/`, `skills-lock.json` | Documentación, instrucciones, investigación, skills y metadatos de trabajo. Ninguno es importado por el navegador. | No. |
| `js/components/` y `js/utils/` | En el inventario solo hay `README.md`; `app.js` no importa módulos de esas carpetas. | No. |

La explicación de arquitectura del [`README.md`](../README.md#L47-L53) describe `components/` y `utils/` como piezas que usa `app.js`, pero eso no coincide con los imports reales: el único import de la aplicación es `./ticket-service.js` en [`js/app.js`](../js/app.js#L1).

### Recorrido de un dato hasta la pantalla

1. Al cargar, `initializeApp` hace `fetch("data/tickets.json")` en [`js/app.js`](../js/app.js#L334-L340).
2. Lee además la clave `mini-service-desk-tickets` del `localStorage` en [`js/app.js`](../js/app.js#L105-L117), concatena ambos conjuntos y aplica `enrichTicket`.
3. `enrichTicket` calcula categoría y prioridad con búsquedas de palabras, no llama a una IA ni a una API, en [`js/app.js`](../js/app.js#L34-L63) y [`js/app.js`](../js/app.js#L85-L102).
4. `renderSummary`, `renderQueue` y `renderDetail` generan HTML mediante `innerHTML`. Los valores del ticket entran en esas plantillas en [`js/app.js`](../js/app.js#L133-L151), [`js/app.js`](../js/app.js#L181-L200) y [`js/app.js`](../js/app.js#L245-L290).
5. Al crear un ticket, `FormData` recoge los inputs, `createTicket` lo transforma, se persiste en `localStorage` y se vuelve a pintar en [`js/app.js`](../js/app.js#L358-L369).

Fragmento relevante, comentado:

```js
// La entrada del formulario termina en el almacenamiento persistente del origen.
const ticket = createTicket(Object.fromEntries(formData.entries()));
saveLocalTicket(ticket);

// Esta plantilla inserta título, origen y otros campos como HTML, no como texto.
detailEl.innerHTML = `
  <div class="value">${selectedTicket.titulo}</div>
  <div class="value">${selectedTicket.reportado_por}</div>
`;
```

El HTML que proporciona esos puntos de entrada es este fragmento real de [`index.html`](../index.html#L25-L85):

```html
<!-- Comprobado: estos contenedores empiezan vacíos y app.js los rellena después. -->
<section id="summary" class="summary"></section>
<main class="board">
  <aside id="detail-panel" class="detail-panel" aria-live="polite"></aside>
  <section id="queue" class="queue" aria-live="polite"></section>
</main>

<!-- Comprobado: los datos escritos por la persona llegan a FormData en app.js. -->
<dialog id="new-ticket-dialog" class="new-ticket-dialog">
  <form id="new-ticket-form" method="dialog">
    <label for="ticket-title">Título</label>
    <input id="ticket-title" name="titulo" type="text" required />
    <label for="ticket-description">Descripción</label>
    <textarea id="ticket-description" name="descripcion" rows="3" required></textarea>
    <label for="ticket-system">Sistema afectado</label>
    <input id="ticket-system" name="sistema_afectado" type="text" required />
    <label for="ticket-reporter">Reportado por</label>
    <input id="ticket-reporter" name="reportado_por" type="text" required />
    <label for="ticket-zone">Zona</label>
    <input id="ticket-zone" name="zona" type="text" required />
    <button type="submit">Guardar ticket</button>
  </form>
</dialog>

<!-- Comprobado: el módulo arranca initializeApp() al final de app.js. -->
<script type="module" src="js/app.js"></script>
```

**Interpretación:** el HTML no contiene tickets ni clasificación. Solo define los destinos (`summary`, `detail-panel` y `queue`) y el formulario; la información se incorpora posteriormente mediante JavaScript. Por eso el riesgo de inyección descrito arriba se produce en el paso de renderizado con `innerHTML`, no en estas etiquetas vacías.

**Interpretación:** el navegador confía en que tanto el JSON publicado como el contenido de `localStorage` sean benignos. En una aplicación estática cualquiera puede descargar el JSON y cualquier script con acceso al mismo origen puede escribir `localStorage`; no existe servidor que valide o filtre los tickets.

## 2. Seguridad y exposición

### Hallazgos

#### ALTO — XSS almacenado o inyección de HTML

**Comprobado:** los valores de tickets se interpolan directamente en `innerHTML` en [`js/app.js`](../js/app.js#L181-L200) y [`js/app.js`](../js/app.js#L245-L290). Los campos del formulario llegan sin sanitización en [`js/app.js`](../js/app.js#L358-L364), se guardan en `localStorage` en [`js/app.js`](../js/app.js#L114-L117) y después se vuelven a renderizar. También el dataset publicado es una entrada que el navegador trata como confiable.

**Interpretación:** un título como `<img src=x onerror=alert(1)>` podría ejecutarse al seleccionar o mostrar el ticket. En esta app no hay sesión ni backend que robe por sí mismo el dato, pero el script tendría el contexto del origen y podría leer otros tickets del `localStorage`. Es un riesgo de publicación porque el contenido publicado y las altas locales no pasan por una frontera de confianza.

**Arreglo rápido:** construir nodos con `textContent` para todos los campos de datos, o aplicar una función de escape HTML antes de cada interpolación. No basta con validar `required`: eso comprueba presencia, no seguridad.

#### MEDIO — Todo el dataset inicial es público

**Comprobado:** `fetch` carga los 60 tickets del archivo público [`data/tickets.json`](../data/tickets.json#L1-L8); el servidor HTTP devolvió `200`. Los textos incluyen zonas, tipos de sistemas de seguridad, cámaras, alarmas y controles de acceso.

**Comprobado:** el [`README.md`](../README.md#L17-L18) afirma que los datos son inventados y sin relación con clientes reales.

**Interpretación:** si esa garantía sigue siendo cierta, la exposición es principalmente de contexto de demo. Si se sustituyera el JSON por datos reales, Surge no sería un mecanismo de control de acceso: cualquier visitante podría descargarlo y las URLs no deberían tratarse como privadas.

#### MEDIO — Persistencia local sin autenticación ni aislamiento funcional

**Comprobado:** los tickets creados se guardan en `localStorage` bajo una única clave y se recuperan para el mismo origen en [`js/app.js`](../js/app.js#L105-L117). No hay login, roles ni servidor.

**Interpretación:** cualquier usuario del navegador que abra la URL comparte ese espacio local; no es una persistencia multiusuario ni una auditoría fiable. No debe almacenarse aquí información real de personas, credenciales o accesos.

#### BAJO — No hay secretos detectados; hay una marca de terceros

**Comprobado:** no aparecen coincidencias literales de `password`, `secret`, claves API, tokens o `Authorization` en los archivos revisados. Sí se publican los recursos de marca de Verisure referenciados en [`index.html`](../index.html#L29-L31).

**Interpretación:** la ausencia de una clave no demuestra que el uso de la marca esté autorizado. Antes de una publicación pública conviene confirmar permiso o sustituirla por una identidad propia de la demo. Los SVG de la misma carpeta no son necesarios porque no están referenciados.

## 3. Responsive: 375, 768 y 1440 px

### Reglas que realmente existen

- A partir de 1100 px, el bloque `.board` pasa a una columna en [`css/styles.css`](../css/styles.css#L924-L926).
- Hasta 760 px, la primera definición cambia `.app-shell` a una columna, y la definición posterior cambia resumen, cola y barra superior en [`css/styles.css`](../css/styles.css#L614-L624) y [`css/styles.css`](../css/styles.css#L928-L934).
- La cola tiene cinco columnas con `minmax(150px, 1fr)` en [`css/styles.css`](../css/styles.css#L671-L673), y el resumen móvil tiene dos columnas de mínimo 140 px en [`css/styles.css`](../css/styles.css#L929-L930).
- La hoja contiene definiciones duplicadas desde la línea 637. La segunda versión es la que prevalece cuando los selectores tienen la misma especificidad; esto complica mantener y razonar los breakpoints.

| Viewport | Resultado comprobado por CSS | Severidad |
|---|---|---|
| **375 px** | Se activa `max-width: 760px`: sidebar apilada, cola de una columna, resumen 2x2 y formulario de diálogo en una columna. El ancho útil queda reducido además por `padding: 0 24px`; el resumen cabe por cálculo (`140 + 140 + 16`), pero la barra superior mezcla un buscador y un botón ambos declarados `width: 100%` con iconos y perfil en la misma fila de `.top-actions` ([`css/styles.css`](../css/styles.css#L614-L623)). | **Medio**: probable compresión/solapamiento visual de acciones; requiere prueba en navegador. |
| **768 px** | No se activa `max-width: 760px`. Sí se activa `max-width: 1100px`, pero la cola sigue siendo de cinco columnas de mínimo 150 px: `5*150 + 4*12 = 798 px`, antes de padding y bordes. El contenido disponible es menor que eso. | **Alto**: overflow horizontal de la cola. |
| **1440 px** | La app limita el contenedor a 1580 px y usa un tablero de dos columnas; la cola dispone de espacio suficiente para sus cinco columnas mínimas. No se observa por CSS un desbordamiento estructural en este ancho. | **Bajo**: pendiente de comprobación visual real. |

La comprobación de Chromium no pudo ejecutarse por falta del binario (`chrome-headless-shell.exe`). Por tanto, no afirmo que el solapamiento de 375 px se haya observado en pantalla; afirmo que el CSS lo hace plausible y que el caso de 768 px se deduce directamente de las dimensiones mínimas declaradas.

Otros detalles responsive comprobados:

- `overflow: hidden` en `.app-shell` y `.priority-column` puede ocultar contenido en vez de resolverlo ([`css/styles.css`](../css/styles.css#L69-L70) y [`css/styles.css`](../css/styles.css#L694-L695)).
- Los títulos y metadatos no tienen `overflow-wrap` o `word-break`; un valor largo pegado puede ampliar visualmente una tarjeta.
- El botón “Nuevo ticket” se hace `width: 100%` dentro de una fila que también contiene buscador, dos pills y perfil; esa combinación necesita un layout móvil explícito.

## 4. Despliegue en Surge

### Lo que funciona y lo que puede fallar

#### MEDIO — Apertura local y publicación no son el mismo escenario

**Comprobado:** [`index.html`](../index.html#L7-L7) usa rutas relativas correctas para CSS, y [`js/app.js`](../js/app.js#L334-L334) usa `data/tickets.json`; servidos desde la raíz HTTP, los tres recursos comprobados respondieron `200`.

**Comprobado:** el README indica que se puede abrir `index.html` directamente ([`README.md`](../README.md#L55-L58)).

**Interpretación:** al abrir con `file://`, los módulos ES y el `fetch` de JSON pueden estar sujetos a restricciones CORS/origen opaco del navegador, aunque en Surge se sirvan por HTTP y funcionen. La instrucción de uso local debería ser un servidor HTTP o una comprobación separada.

#### MEDIO — Errores de carga no distinguen 404 de JSON inválido

**Comprobado:** la cadena de promesas llama a `response.json()` sin comprobar `response.ok` en [`js/app.js`](../js/app.js#L334-L346). Un 404 que devuelva HTML, una ruta mal escrita o JSON inválido acaba en el mismo mensaje genérico.

**Arreglo rápido:** comprobar `if (!response.ok) throw new Error(...)` antes de `response.json()` y mostrar un diagnóstico operativo no sensible.

#### MEDIO — `localStorage.setItem` no está protegido

**Comprobado:** la lectura está dentro de `try/catch`, pero la escritura de [`js/app.js`](../js/app.js#L114-L117) no lo está.

**Interpretación:** una cuota llena, el modo privado o una política del navegador pueden lanzar una excepción al guardar y dejar el formulario en un estado inesperado. En una demo publicada conviene mostrar que el ticket no pudo persistirse.

#### BAJO — Publicar en la raíz es un requisito implícito

**Comprobado:** todas las referencias son relativas (`css/...`, `assets/...`, `js/...`, `data/...`) y no hay router ni rutas internas.

**Interpretación:** el despliegue previsto en `https://servicedesk-grupo-N.surge.sh/` debería resolverlas. Si se alojara bajo un subdirectorio distinto, habría que revisar el `base path`; no es un problema del dominio raíz pedido.

## 5. Qué se publicaría y qué no hace falta

Surge publica archivos estáticos del directorio que se le entregue. Si se ejecuta el despliegue desde la raíz actual sin filtro, también quedarían potencialmente accesibles URLs como `/docs/spec.md`, `/README.md`, `/test/crear-ticket.test.js`, `/mockup-mini-service-desk.html` y los directorios de instrucciones. Durante la prueba HTTP, `/docs/spec.md` respondió `200`, lo que confirma la exposición cuando se sirve la raíz completa.

### Mínimo necesario

```text
index.html
css/styles.css
js/app.js
js/ticket-service.js
data/tickets.json
assets/verisure/verisure-official-icon.ico
assets/verisure/verisure-official-wordmark.png
```

### Prescindible o interno para esta app

```text
README.md
AGENTS.md
.github/
.agents/
.claude/
skills-lock.json
docs/
test/
mockup-mini-service-desk.html
js/components/README.md
js/utils/README.md
assets/dribble/
assets/verisure/verisure-logo-1.svg
assets/verisure/verisure-logo-2.svg
```

La lista anterior está basada en imports y referencias observados, no en nombres de archivos: las carpetas de `components` y `utils` existen, pero no contienen módulos usados por el flujo ejecutable.

## 6. Diferencias entre la documentación y el código real

Estas diferencias no son todos problemas de Surge, pero sí afectan a qué se está publicando:

- **Clasificación:** [`js/app.js`](../js/app.js#L34-L63) usa reglas `includes`; el README dice que la clasificación la hace Claude Code y la especificación habla de IA. No hay llamada a Claude ni API en el navegador.
- **Descripción:** `descripcion` se recoge y se usa para clasificar en [`js/app.js`](../js/app.js#L35-L53), pero no se pinta en el detalle; el usuario no puede consultar el contenido que explica la sugerencia.
- **Asignación:** la especificación exige responsable o equipo, pero el HTML solo tiene campos básicos y las acciones no registran ningún responsable ([`docs/spec.md`](../docs/spec.md#L40-L43), [`index.html`](../index.html#L62-L80)).
- **Persistencia de decisión:** confirmar, corregir, duplicar o marcar incompleto muta el objeto en memoria y añade historial en [`js/app.js`](../js/app.js#L297-L326), pero no llama a `saveLocalTicket`; al recargar se pierde esa decisión.
- **Estado incompleto:** `createTicket` solo considera incompleto un ticket sin zona en [`js/ticket-service.js`](../js/ticket-service.js#L3-L10), aunque la especificación enumera más datos esenciales.
- **Sin clasificar y revisión:** `getSuggestedCategory` siempre devuelve `Accesos` como último caso en [`js/app.js`](../js/app.js#L34-L49); por eso la cola “Sin clasificar” no recibe tickets por esta ruta.
- **Detección de duplicados:** el botón solo cambia `decision` a `Duplicado`; no compara tickets ni detecta candidatos.

**Interpretación:** la pantalla es una demo funcional de cola y triaje heurístico, no la implementación completa descrita por `spec.md` y `user-journey-mini-service-desk.md`. Publicarla como demo está bien si se etiqueta como tal; presentarla como cumplimiento completo sería engañoso.

## 7. Arreglos rápidos antes de publicar

Orden recomendado para una ventana corta de 30 minutos:

1. **Eliminar la inyección HTML:** renderizar campos de datos con `textContent`/nodos DOM o escape HTML centralizado; cubrirlo con un test que cree un título con `<img ...>` y compruebe que se ve como texto.
2. **Corregir tablet:** aplicar el cambio a cola de una columna o scroll horizontal controlado hasta al menos 900 px, y rehacer `.top-actions` como columnas en móvil; probar exactamente 375, 768 y 1440.
3. **Publicar un directorio mínimo o añadir `.surgeignore`:** no enviar documentación interna, tests, instrucciones, skills, mockup ni referencias visuales.
4. **Mantener el JSON como demo sintética:** confirmar que no contiene datos reales y advertir que cualquier persona puede descargarlo; no subir datos reales a Surge.
5. **Robustecer carga y guardado:** comprobar `response.ok`, capturar errores de `localStorage.setItem` y conservar decisiones en la misma clave si la persistencia de triaje es requisito.
6. **Alinear el mensaje de producto:** describirlo como clasificación heurística local mientras no exista una integración de IA, y no prometer asignación, duplicados o auditoría persistente que el código no implementa.
7. **Confirmar el uso de la marca Verisure:** si no existe autorización, retirar los logos y usar una identidad propia de la demo.

### `.surgeignore` propuesto (todavía no creado)

```gitignore
# Documentación interna y material de formación
README.md
AGENTS.md
CLAUDE.md
.github/
.agents/
.claude/
skills-lock.json
docs/

# Tests y prototipos no usados por la app publicada
test/
mockup-mini-service-desk.html
js/components/
js/utils/

# Recursos visuales no referenciados por index.html
assets/dribble/
assets/verisure/verisure-logo-1.svg
assets/verisure/verisure-logo-2.svg
```

`CLAUDE.md` no existe en el inventario actual; se incluye el patrón en el ejemplo para que una futura creación accidental tampoco se publique. `.surgeignore` solo evita archivos del despliegue; no convierte en privados los archivos que sí se suban, especialmente `data/tickets.json`.

## Conclusión

La app puede servirse como demo estática desde la raíz de Surge y la ruta HTTP de datos está bien formada en ese escenario. No debería publicarse aún sin corregir el renderizado sin escape y el overflow de tablet. El resto de documentación, tests y material de trabajo debe quedar fuera del paquete público, y los 60 tickets solo deben mantenerse si siguen siendo datos sintéticos. Esta auditoría queda preparada para revisión humana; no se ha creado `.surgeignore` ni se ha ejecutado `surge`.
