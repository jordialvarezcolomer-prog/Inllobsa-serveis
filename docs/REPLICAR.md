# Cómo replicar la landing de Inllobsa

Este documento describe la landing completa de Inllobsa para poder reproducirla en otra conversación o proyecto,
ya sea igual o adaptada a otra empresa. Va acompañado de:

- `inllobsa-ca.html` e `inllobsa-es.html`: la web terminada, **cada idioma en un solo archivo** (estilos, JavaScript,
  logotipo, fotos e iconos incluidos). Es la forma más rápida de replicarla: basta con publicar los dos archivos juntos.
- `inllobsa-proyecto-completo.zip`: el proyecto fuente entero (plantilla, textos, imágenes y scripts de generación).

## Cómo pedirlo en otra conversación

**Para tener la misma web:** adjunta el zip y escribe: «Descomprime este proyecto, ejecuta `node build.mjs` y
`node tools/standalone.mjs`, y respeta el diseño y las animaciones tal como están descritos en `docs/REPLICAR.md`».

**Para hacer una igual para otra empresa:** adjunta el zip y este documento, y pide: «Replica esta landing con la misma
estructura, el mismo sistema visual y las mismas animaciones, pero con los textos, el logotipo, los colores y las fotos de
[empresa]. Cambia solo los archivos de `src/` y las imágenes de `public/assets/img/`».

## Tecnología

- HTML, CSS y JavaScript sin frameworks ni dependencias. Solo hace falta Node 18 o superior para generar las páginas.
- Una **plantilla única** (`src/template.html`) con marcadores `{{clave}}` (texto escapado), `{{{clave}}}` (HTML),
  `{{#each lista}}…{{/each}}` (con `{{this}}`, `{{@num}}` = 01, 02… y `{{@i}}` = 0, 1…) y `{{#if clave}}…{{/if}}`. Se pueden anidar.
- `build.mjs` combina la plantilla con los datos y genera `public/index.html` (catalán) y `public/es/index.html` (castellano),
  además de `sitemap.xml` y `robots.txt`. Falla si las dos lenguas no tienen las mismas claves.
- `tools/standalone.mjs` genera la versión de un solo archivo por idioma (incrusta CSS, JS e imágenes en WebP como data URI).
- `netlify.toml`: publicación en Netlify (comando `node build.mjs`, carpeta `public`).

```
src/template.html        estructura de toda la página
src/i18n/ca.json, es.json todos los textos (mismas claves en ambos)
src/site.json            datos de empresa: teléfonos, WhatsApp, email, dirección, NIF, URLs
src/team.json            equipo: foto, nombre, cargo (ca/es), email, teléfono, frase (ca/es)
src/reviews.json         reseñas reales de Google (nombre, idioma, texto literal)
src/art/*.svg            ilustraciones animadas: canasta, ruta Manresa–Vic, birrete de Formación
public/assets/css/styles.css   todo el estilo y las animaciones
public/assets/js/main.js       toda la interacción
public/assets/img/       logo, fotos (WebP + JPEG), equipo, iconos del catálogo (máscaras PNG)
```

## Sistema visual

- **Inspiración:** la inmobiliaria MGO (mgo.cat): titulares grandes y finos (Mulish 300), botones en forma de cápsula en
  mayúsculas, secciones que se encadenan con esquinas superiores redondeadas de 32 px y diseño plano, sin sombras fuertes.
- **Tipografía:** Mulish (Google Fonts), pesos 300–800 y cursiva 300/400.
- **Colores:**
  - `#30425F`: azul marino del logotipo (titulares y secciones oscuras); `#1B2638` es su variante más oscura.
  - `#1C62B2`: azul corporativo de la web de Inllobsa (botones, enlaces y detalles).
  - `#C9482F`: naranja del tejado del logotipo, solo como acento (puntos, líneas finas, subrayados).
  - `#EEF3F9`: azul muy claro para los fondos suaves.
  - `#25D366`: verde de WhatsApp. `#FBBF24`: amarillo de las estrellas. Texto `#1E293B`, gris `#5B6474`, líneas `#DDE4EE`.
- **Medidas:** contenedor de 1200 px, radio de 20 px en tarjetas y 32 px en bloques, márgenes laterales `clamp(16px, 4vw, 40px)`.
- **Patrones repetidos:**
  - antetítulo en mayúsculas precedido de una raya naranja;
  - numeración «● 01» con punto naranja;
  - listas con check azul y etiquetas tipo píldora.

## Estructura y animaciones, sección a sección

1. **Barra superior** (azul marino, se oculta en móvil): dirección, horario, teléfono y email, todos clicables.
2. **Cabecera fija:** logotipo; menú (Servicios, Marketing, Valores, Equipo, Reseñas, Contacto); selector CA/ES;
   botón verde de WhatsApp; botón azul «Valoración gratuita». La sección visible se subraya en naranja. En móvil hay un menú
   desplegable. Al cambiar de idioma se mantiene la sección en la que está el usuario.
3. **Portada (`#top`):**
   - Carrusel de 3 fotos del equipo dentro de un bloque redondeado, con fundido y un zoom lento. Pasa solo cada 4 s desde el
     primer momento, sin flechas, puntos ni botón de pausa.
   - Encima, degradado oscuro con: antetítulo, titular grande y fino («Trobem la llar dels teus somnis»), subtítulo, texto
     («Amb 50 anys d'experiència…») y dos botones.
   - En móvil, la foto queda arriba y el texto debajo, sobre fondo azul.
4. **Cifras con contador animado:** 50 años de experiencia, 100 % gestión transparente, 1977 año de fundación y
   10 profesionales. Los años cuentan solo los últimos 60.
5. **Tres ventajas** en tarjetas suaves con icono.
6. **Somos Inllobsa (`#nosaltres`):** historia, con una cronología 1977 → 1993 → Hoy.
7. **Servicios (`#serveis`)**, seis tarjetas con los iconos del catálogo:
   - Al aparecer, el icono se revela de abajo arriba y los checks entran escalonados.
   - Al pasar el cursor, la tarjeta se llena de azul marino desde abajo, se inclina en 3D hacia el cursor con una luz
     que lo sigue, el icono se vuelve naranja y gira, y un número grande de fondo sube.
   - El enlace «Pide información» abre WhatsApp con el nombre del servicio escrito.
8. **Bloque para propietarios (`#valoracio`):**
   - Foto panorámica de toda la plantilla, que entra con una cortina de arriba abajo. Encima, un sello circular giratorio
     «Valoració gratuïta · Sense compromís» con una llave.
   - Debajo, una cinta de conceptos en movimiento continuo.
   - Titular que entra palabra a palabra, con «vendre» y «llogar» subrayados en naranja.
   - Texto con los conceptos clave en negrita (valoración gratuita, reportaje fotográfico, asesoramiento fiscal,
     trámites notariales) y checks que se dibujan.
   - Recorrido de 4 pasos con un punto que circula, y botones de WhatsApp (con reflejo de luz) y de llamada.
   - Fondo con luces de color que se desplazan.
9. **Marketing (`#marketing`)**, cinco fases; la quinta es «Expertos en inteligencia artificial»:
   - **Escritorio:** 3 tarjetas arriba y 2 abajo, con el icono en el borde de cada tarjeta. Una línea en «W» las une
     (arriba-izquierda → abajo → arriba-centro → abajo → arriba-derecha). La calcula `main.js` con las posiciones reales y
     se dibuja de azul a naranja, con puntos naranja que circulan y cada icono iluminándose cuando llega la línea.
   - **Móvil y tableta:** icono a la izquierda y línea vertical que une las cinco tarjetas.
10. **Valores (`#valors`, fondo azul marino):** cuatro valores (Excelencia, Originalidad, Familia y Formación) con los iconos
    del catálogo, aplicados como máscara y teñidos de blanco:
    - Excelencia: reflejo dorado.
    - Originalidad: la bombilla se enciende.
    - Familia: late.
    - Formación: birrete dibujado en SVG que se balancea.
11. **Equipo (`#equip`):**
    - Personas en zigzag, a ambos lados de un eje central con puntos naranja.
    - Se ve el nombre, el cargo, el email y el WhatsApp. Al pasar el cursor por la foto (o tocarla en móvil), la foto se
      amplía y aparece una frase en cursiva entre comillas con el nombre.
12. **Reseñas (`#ressenyes`):**
    - Resumen con «+250» (contador) y cuatro estrellas y media que se llenan, y un sello verde «Verificadas por Google» con
      escudo y check.
    - Botón a Google Maps.
    - Debajo, dos filas de reseñas reales en movimiento continuo y en sentidos opuestos. Se paran con el cursor y tienen
      botón de pausa; las largas tienen «Leer entera» y cada una enlaza a Google.
13. **Territorio (`#territori`):**
    - Cultura: ecualizador musical con notas que flotan.
    - Deporte: lanzamiento a canasta en SVG, con la red que se mueve.
    - Cada entidad tiene su icono y aparecen escalonadas.
14. **Solvia Store Vic (`#solvia-vic`):**
    - La foto empieza totalmente en negro y el negro se encoge en 1,1 s hasta coincidir con la «o» del rótulo de Solvia
      (posición 29,5 % / 39,7 % de la foto).
    - Mapa «Del Bages a Osona» con la ruta Manresa → Vic, que se dibuja con un punto que la recorre.
    - Tarjetas que entran desde el lado, y un teléfono que vibra en el botón de llamada.
15. **Contacto (`#contacte`, fondo azul marino):** cuatro canales (WhatsApp, teléfono, email y visita), y la oficina,
    el horario y la atención con cita previa.
16. **Pie** con logotipo, enlaces y datos legales. **Botón flotante de WhatsApp** abajo a la derecha, con pulso, elevado
    96 px para no quedar debajo de la insignia de Netlify.

## Comportamientos generales

- Los elementos con `data-reveal` aparecen escalonados al hacer scroll. Los bloques con `data-animate` reciben `is-in`
  cuando entran en pantalla, sin ocultarse antes.
- Las animaciones SVG (canasta y ruta) se pausan cuando no son visibles.
- Si el usuario tiene activado «reducir movimiento», todo se muestra sin animaciones (salvo el carrusel, que pasa sin fundido).
- Todos los enlaces de WhatsApp llevan un mensaje predefinido en el idioma de la página.
- SEO por idioma: `title`, `description`, `canonical`, `hreflang`, Open Graph y JSON-LD `RealEstateAgent` con horario.

## Contenido y decisiones a respetar

- No es un portal de inmuebles: no se muestran pisos, precios ni buscadores.
- Las reseñas son reales y literales; donde se ha acortado una, aparece «[…]».
- Revisar antes de publicar: las frases del equipo, el texto de Formación y el de la tarjeta de IA son propuestas
  redactadas. Además, faltan los enlaces del aviso legal, la privacidad y las cookies.
