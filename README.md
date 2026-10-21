# INLLOBSA · Landing page corporativa (CA / ES)

Landing page corporativa d'INLLOBSA, immobiliària de Manresa des de 1977.
Presenta l'empresa, els seus serveis i la manera de treballar. **No és un portal d'immobles**:
no mostra pisos, preus ni cercadors.

- Català (idioma per defecte): `/`
- Castellà: `/es/`

## Estructura

```
src/
  template.html     Plantilla única de la pàgina (mateixa estructura per a tots dos idiomes)
  i18n/ca.json      Tots els textos en català
  i18n/es.json      Tots els textos en castellà
  site.json         Dades corporatives compartides (contacte, NIF, URL del web…)
build.mjs           Genera public/index.html i public/es/index.html (sense dependències)
public/             Web publicable
  assets/css/styles.css
  assets/js/main.js
  assets/img/logo/  ← aquí va el logotip oficial (vegeu-ne el README)
netlify.toml        Configuració de desplegament a Netlify
```

## Treballar-hi

```bash
node build.mjs                          # regenera les pàgines (Node 18+)
cd public && python3 -m http.server     # vista prèvia a http://localhost:8000
```

Per canviar un text, editeu `src/i18n/*.json` i torneu a executar `node build.mjs`.
No editeu directament `public/**/index.html`, perquè es regeneren.
El build falla si les dues llengües no tenen exactament les mateixes claus.

## Funcionalitats

- Capçalera fixa, menú adaptat a mòbil i enllaç actiu segons la secció visible.
- Selector CA/ES: en canviar d'idioma, conserva la secció on es troba l'usuari (`#services`, `#contact`…).
- Els enllaços «Demana informació» de cada servei porten al formulari amb el servei ja seleccionat.
- Formulari de contacte amb validació accessible i missatges en tots dos idiomes.
  Funciona amb **Netlify Forms** quan el web es desplega a Netlify. Les consultes apareixen al tauler de Netlify
  (Forms → `contacte`), on es poden configurar avisos per correu. En un altre allotjament, cal connectar-lo a un altre servei d'enviament.
- SEO: `title` i `description` per idioma, `canonical`, `hreflang`, Open Graph, JSON-LD (`RealEstateAgent`),
  `sitemap.xml` i `robots.txt`.
- Accessibilitat: HTML semàntic, enllaç «Salta al contingut», focus visible, `prefers-reduced-motion`.

## Fonts del contingut

| Font | Estat |
| --- | --- |
| https://inllobsa.netlify.app/ | **No s'ha pogut consultar.** La xarxa de l'entorn de desenvolupament la bloqueja. |
| https://www.inllobsa.com/ | No s'ha pogut obrir directament. S'ha consultat a través de cercadors (pàgina «Empresa / Qui som», avís legal i dades de contacte). |
| https://www.mgo.cat/ | **No s'ha pogut consultar.** L'estructura s'ha definit amb criteris propis de web corporativa. |
| Fitxa de l'Ajuntament de Manresa i directori municipal d'immobiliàries (2024) | Consultats a través de cercadors. Confirmen els serveis i les dades de contacte. |

Contingut verificat que s'ha fet servir: fundació el 1977 per José Salido Chimeno per promoure edificis a Manresa;
direcció de Sita Salido des del 1993 i orientació a la comercialització al Bages; més de 40 anys d'experiència;
assessorament i gestió administrativa en compravenda i lloguer d'habitatges, locals, naus industrials i oficines;
gestió de les formalitats legals; publicació d'immobles al portal propi; assessor de venda, assessor de lloguer
i departament d'administració de finques; assessorament d'un membre API; Passeig de Pere III, 49, baixos,
08242 Manresa; 938 362 030; inllobsa@inllobsa.com; Facebook; Inmobiliaria Llobsa, SA, NIF A08469967.

## Pendent de revisar o aportar

1. **Logotip oficial**: deseu-lo a `public/assets/img/logo/` (vegeu-ne el README). Fins aleshores, només es mostra el nom en text.
2. **Blau corporatiu exacte**: s'ha fet servir `#0b3d6e`, perquè no s'ha pogut mostrejar el color de la web.
   Es canvia a les variables `--blue-*` de `public/assets/css/styles.css`, i el taronja d'accent a `--orange`.
3. **Valors i textos de inllobsa.netlify.app**: la secció «Per què INLLOBSA» s'ha construït només amb fets verificats.
   Si la web de referència defineix valors propis, cal substituir-los a `src/i18n/*.json`.
4. **Política de privacitat i avís legal**: el formulari demana consentiment, però no hi ha cap URL verificada de la política.
   Cal afegir-ne l'enllaç abans de publicar.
5. **Horari d'atenció i Instagram**: no s'han pogut verificar i no s'hi han inclòs.
6. **URL definitiva** del web: actualitzeu `url` a `src/site.json` (canonical, hreflang i sitemap).
7. Imatge del hero: és una il·lustració vectorial. Es pot substituir per una fotografia real de l'oficina o de Manresa.
