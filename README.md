# Inllobsa · Landing page corporativa (CA / ES)

Landing page corporativa d'Inllobsa, immobiliària de Manresa des de 1977.
Presenta l'empresa, els serveis, l'equip i els canals de contacte. **No és un portal d'immobles**:
no mostra pisos, preus ni cercadors.

- Català (idioma per defecte): `/`
- Castellà: `/es/`

## Veure-la

- **Ràpid, sense instal·lar res:** descarregueu la carpeta `public/` i arrossegueu-la a https://app.netlify.com/drop.
  En pocs segons tindreu una URL pública de prova.
- **Desplegament continu:** a Netlify, *Add new site → Import an existing project → GitHub*, trieu aquest repositori
  i la branca. El fitxer `netlify.toml` ja indica l'ordre de build (`node build.mjs`) i la carpeta que es publica (`public`).
- **En local:** `node build.mjs && cd public && python3 -m http.server`, i obriu http://localhost:8000.

## Estructura

```
src/
  template.html     Plantilla única (mateixa estructura per a tots dos idiomes)
  i18n/ca.json      Tots els textos en català
  i18n/es.json      Tots els textos en castellà
  site.json         Dades corporatives: telèfons, WhatsApp, correu, adreça, NIF, URL…
  team.json         Equip: foto, nom, càrrec (CA/ES), correu i telèfon
  reviews.json      Ressenyes reals de clients (buit per defecte; vegeu més avall)
build.mjs           Genera public/index.html i public/es/index.html (sense dependències)
public/             Web publicable (CSS, JS, imatges optimitzades en WebP + JPEG)
netlify.toml        Configuració de desplegament a Netlify
```

Per canviar un text, editeu `src/i18n/*.json` o `src/*.json` i executeu `node build.mjs`.
No editeu directament `public/**/index.html`, perquè es regeneren.
El build falla si les dues llengües no tenen exactament les mateixes claus.

## Seccions

Capçalera amb barra superior (adreça, horari, telèfon, correu) · Hero amb carrusel de fotos de l'equip ·
Xifres animades · Avantatges · Som Inllobsa · Serveis (6) · Valoració per a propietaris (`#valoracio`) ·
Màrqueting (4) · Valors (4, amb il·lustracions animades) · Equip (8 persones amb correu i WhatsApp) · Ressenyes · Territori ·
Solvia Store Vic · Contacte (WhatsApp, telèfon, correu, visita, horari) · Peu de pàgina · Botó flotant de WhatsApp.

## Funcionalitats

- **WhatsApp:** botó a la capçalera, botó flotant, bloc de valoració, targeta de contacte i un enllaç per a cada servei
  i per a cada persona de l'equip. Tots porten un missatge predefinit en l'idioma de la pàgina.
- **Correu i telèfon:** enllaços `mailto:` i `tel:` a la barra superior, a les targetes de l'equip i al contacte.
- **Carrusel del hero:** passa sol cada 4 s des que s'obre la pàgina, sense controls visibles.
- **Animacions:** les xifres compten fins al seu valor quan apareixen, i les targetes i els números
  apareixen de manera esglaonada en fer scroll.
- **Selector CA/ES:** conserva la secció on es troba l'usuari.
- **SEO:** `title` i `description` per idioma, `canonical`, `hreflang`, Open Graph, JSON-LD (`RealEstateAgent`, amb horari),
  `sitemap.xml` i `robots.txt`.
- **Accessibilitat:** HTML semàntic, enllaç «Salta al contingut», focus visible i textos alternatius a totes les fotos.

## Ressenyes

- Resum: **+250 ressenyes** amb comptador animat i estrelles que s'omplen, i el segell «Verificades per Google». Cada ressenya enllaça a Google Maps (`reviewsUrl` a `src/site.json`).
- Un carrusel continu de dues files (en sentits oposats) mostra les ressenyes de `src/reviews.json`.
  S'atura en passar-hi el cursor i té un botó de pausa. Les ressenyes llargues es retallen i tenen el botó «Llegeix-la sencera».
- Hi ha 28 ressenyes reals de 5 estrelles, amb el text literal i l'idioma original. Quan se n'ha escurçat una, s'hi ha posat «[…]».
  No s'hi han inclòs la ressenya marcada per revisar («La Maravillosa VIDA»), la que no és de la immobiliària (Jose Antonio Reina)
  ni la que menciona comentaris negatius sobre els lloguers (Diego Ramírez).
- Per afegir-ne o treure'n, editeu `src/reviews.json` (`name`, `lang`, `text`) i executeu `node build.mjs`.

## Equip

Les persones apareixen en ziga-zaga, alternant a banda i banda d'un eix central. En passar el cursor per sobre de la foto
(o en tocar-la, al mòbil, o en activar-la amb el teclat), la foto s'amplia i surt la frase de la persona, en cursiva i entre cometes.
Mentre no s'hi passa el cursor, es veuen el nom, el càrrec, el correu i el WhatsApp. Les frases són a `src/team.json` (`quote.ca` i `quote.es`).

## Fonts del contingut

- Brief de la web de referència https://inllobsa.netlify.app/, facilitat per Inllobsa: textos, serveis, valors,
  equip, horari, territori i Solvia Store Vic.
- Brief i captures de https://www.mgo.cat/, facilitats per Inllobsa: referència de disseny.
- Logotip, fotos de l'equip (també la de grup a l'aire lliure) i ressenyes de Google facilitats per Inllobsa. Els colors de marca s'han extret del logotip.
- Dades legals (Inmobiliaria Llobsa, SA, NIF A08469967) i història: www.inllobsa.com i Ajuntament de Manresa.

Des de l'entorn de desenvolupament no s'ha pogut accedir directament a cap d'aquestes webs, perquè la xarxa les bloqueja.

## Pendent de revisar o aportar

1. **Text del valor «Formació»:** està redactat a partir del nom del valor. Reviseu-lo a `src/i18n/*.json` (`values.items`).
2. **Frases de l'equip:** les de `src/team.json` són **propostes redactades a partir del càrrec**. Cal validar-les amb cada persona abans de publicar.
3. **Fotos ↔ noms de l'equip:** s'han assignat per semblança amb les fotos de la web de Netlify. Reviseu-les a `src/team.json` (camp `photo`).
4. **Novena persona:** la de la foto `public/assets/img/team/equip-01-*` (cabell llarg castany, braços creuats) surt a les fotos de grup,
   però no a la llista de l'equip. Si cal, afegiu-la a `src/team.json` amb el nom, el càrrec i el contacte.
5. **Avís legal, política de privacitat i cookies:** cal enllaçar-los al peu de pàgina quan tingueu les URL.
6. **Instagram:** no hi ha cap URL verificada. Només s'enllaça Facebook.
7. **WhatsApp de Solvia Store Vic:** només es coneix el telèfon (621 234 741), així que només hi ha botó de trucada.
8. **URL definitiva** del web: actualitzeu `url` a `src/site.json` (canonical, hreflang i sitemap).
