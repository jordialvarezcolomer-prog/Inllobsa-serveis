/* Immobles: cercador, destacats, llistat i fitxa. Llegeix /api/immobles (XML d'Inmovilla). */
(() => {
  'use strict';
  const dataEl = document.getElementById('il-data');
  if (!dataEl) return;
  const { lang, p: T, site, urls } = JSON.parse(dataEl.textContent);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const nf = new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'ca-ES');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

  /* ---- Dades ---------------------------------------------------------------- */
  let promise;
  const load = () => (promise ||= fetch('/api/immobles').then((r) => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }).then((j) => j.items));

  const GROUPS = { habitatge: ['pis', 'casa'], 'local-nau': ['local', 'nau'] };
  const isRentMode = (op) => op === 'llogar';
  const price = (p, op) => {
    const rent = isRentMode(op) || (!p.sell && p.rent);
    const v = rent ? p.preuA : p.preuV;
    if (p.consultar || !v) return T.onRequest;
    return `${nf.format(v)} €${rent ? ` <small>${esc(T.perMonth)}</small>` : ''}`;
  };
  const typeName = (p) => T.typeNames[p.tipo] || p.tipo;
  const title = (p) => `${typeName(p)} – ${p.ciutat}`;
  const detailHref = (p) => `${urls.detail}?ref=${encodeURIComponent(p.ref)}${p._op ? '' : ''}`;
  const num = (n) => (n ? nf.format(n) : '0');

  const specs = (p) => `
    <dl class="prop-specs">
      <div><dt>${esc(T.ref)}</dt><dd>${esc(p.ref)}</dd></div>
      <div><dt>${esc(T.m2).replace('M²', 'M<sup>2</sup>')}</dt><dd>${num(p.m2)}</dd></div>
      <div><dt>${esc(T.hab)}</dt><dd>${num(p.hab)}</dd></div>
      <div><dt>${esc(T.wc)}</dt><dd>${num(p.banys)}</dd></div>
    </dl>`;

  const card = (p, op, tag = 'li') => `
    <${tag} class="prop">
      <a class="prop-link" href="${detailHref(p)}" aria-label="${esc(title(p))} · ${esc(T.ref)} ${esc(p.ref)}">
        <span class="prop-media">
          <img src="${esc(p.fotos[0])}" alt="" loading="lazy" decoding="async" width="640" height="480">
          <span class="prop-more">${esc(T.moreInfo)}</span>
        </span>
        <span class="prop-title serif">${esc(title(p))}</span>
        <span class="prop-price serif">${price(p, op)}</span>
      </a>
      ${specs(p)}
    </${tag}>`;

  /* ---- Interruptor Comprar / Llogar ----------------------------------------- */
  const setupToggle = (root, onChange) => {
    const btn = $('.op-switch', root);
    const input = $('input[name="op"]', root);
    const set = (op, silent) => {
      input.value = op;
      btn.setAttribute('aria-checked', String(op === 'llogar'));
      root.dataset.op = op;
      if (!silent && onChange) onChange(op);
    };
    btn.addEventListener('click', () => set(input.value === 'llogar' ? 'comprar' : 'llogar'));
    $('.op-buy', root).addEventListener('click', () => set('comprar'));
    $('.op-rent', root).addEventListener('click', () => set('llogar'));
    set(input.value, true);
    return set;
  };

  const fillCities = (select, items, selected) => {
    const counts = {};
    items.forEach((p) => { counts[p.ciutat] = (counts[p.ciutat] || 0) + 1; });
    Object.keys(counts).sort((a, b) => a.localeCompare(b, lang)).forEach((c) => {
      const o = document.createElement('option');
      o.value = c; o.textContent = c; select.appendChild(o);
    });
    if (selected) select.value = selected;
  };

  /* ---- Cercador de la portada ------------------------------------------------ */
  const finder = $('[data-finder]');
  if (finder) {
    setupToggle($('[data-op-toggle]', finder));
    load().then((items) => fillCities($('[data-city-select]', finder), items)).catch(() => {});
    finder.addEventListener('submit', () => {
      // No s'envien camps buits perquè la URL quedi neta
      $$('select, input[name="ref"]', finder).forEach((el) => { if (!el.value) el.disabled = true; });
    });
  }

  /* ---- Destacats (carrusel) -------------------------------------------------- */
  const featured = $('[data-featured]');
  if (featured) {
    const track = $('[data-track]', featured);
    load().then((items) => {
      const pool = items.filter((p) => p.fotos.length >= 1 && (p.preuV || p.preuA));
      const picked = [...pool].sort((a, b) => (b.destacat - a.destacat) || String(b.data).localeCompare(String(a.data))).slice(0, 9);
      track.innerHTML = picked.map((p) => card(p, p.sell ? 'comprar' : 'llogar')).join('');
      const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 17 : 360);
      const update = () => {
        $('[data-prev]', featured).disabled = track.scrollLeft < 4;
        $('[data-next]', featured).disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      };
      $('[data-prev]', featured).addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
      $('[data-next]', featured).addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
      track.addEventListener('scroll', update, { passive: true });
      addEventListener('resize', update);
      update();
    }).catch(() => { track.innerHTML = `<li class="carousel-msg">${esc(T.error)}</li>`; });
  }

  /* ---- Llistat ---------------------------------------------------------------- */
  const listing = $('[data-listing]');
  const form = $('[data-listing-form]');
  if (listing && form) {
    const grid = $('[data-grid]', listing);
    const countEl = $('[data-count]', listing);
    const none = $('[data-none]', listing);
    const moreBtn = $('[data-more]', listing);
    const PAGE = 12;
    let items = [];
    let shown = PAGE;
    const state = { op: 'comprar', tipus: '', poblacio: '', ref: '', sup: '', hab: '', banys: '', car: [] };

    // Característiques (casella per cadascuna)
    const featBox = $('[data-features]', form);
    featBox.innerHTML = Object.entries(T.featureNames).map(([k, label]) =>
      `<label class="check"><input type="checkbox" value="${esc(k)}"><span>${esc(label)}</span></label>`).join('');

    const setChips = (name, v) => $$(`[data-chips="${name}"] button`, form).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === String(v))));

    // Llegeix l'estat de la URL
    const qs = new URLSearchParams(location.search);
    ['op', 'tipus', 'poblacio', 'ref', 'sup', 'hab', 'banys'].forEach((k) => { if (qs.get(k)) state[k] = qs.get(k); });
    if (qs.get('car')) state.car = qs.get('car').split(',');
    if (state.op !== 'llogar') state.op = 'comprar';

    const setOp = setupToggle($('[data-op-toggle]', form), (op) => { state.op = op; apply(); });
    setOp(state.op, true);

    const toForm = () => {
      form.tipus.value = state.tipus; form.ref.value = state.ref; form.sup.value = state.sup;
      form.poblacio.value = state.poblacio;
      setChips('hab', state.hab); setChips('banys', state.banys);
      $$('input[type=checkbox]', featBox).forEach((c) => { c.checked = state.car.includes(c.value); });
    };
    const fromForm = () => {
      state.tipus = form.tipus.value; state.poblacio = form.poblacio.value;
      state.ref = form.ref.value.trim(); state.sup = form.sup.value;
      state.car = $$('input[type=checkbox]:checked', featBox).map((c) => c.value);
    };

    const matches = (p) => {
      if (state.op === 'llogar' ? !p.rent : !p.sell) return false;
      if (state.tipus) {
        const list = GROUPS[state.tipus] || [state.tipus];
        if (!list.includes(p.tipus)) return false;
      }
      if (state.poblacio && p.ciutat !== state.poblacio) return false;
      if (state.ref && !String(p.ref).toLowerCase().includes(state.ref.toLowerCase())) return false;
      if (state.sup && p.m2 < Number(state.sup)) return false;
      if (state.hab && p.hab < Number(state.hab)) return false;
      if (state.banys && p.banys < Number(state.banys)) return false;
      return state.car.every((f) => p.features.includes(f));
    };

    const render = () => {
      const result = items.filter(matches)
        .sort((a, b) => (b.destacat - a.destacat) || String(b.data).localeCompare(String(a.data)));
      countEl.textContent = result.length === 1 ? T.results1 : fill(T.resultsN, { n: nf.format(result.length) });
      grid.innerHTML = result.slice(0, shown).map((p) => card(p, state.op)).join('');
      none.hidden = result.length > 0;
      moreBtn.hidden = result.length <= shown;
    };

    const syncUrl = () => {
      const q = new URLSearchParams();
      Object.entries(state).forEach(([k, v]) => { if (k === 'op' ? v === 'llogar' : (Array.isArray(v) ? v.length : v)) q.set(k, Array.isArray(v) ? v.join(',') : v); });
      history.replaceState(null, '', q.toString() ? `?${q}` : location.pathname);
    };
    function apply() { shown = PAGE; fromForm(); syncUrl(); render(); }

    form.addEventListener('submit', (e) => { e.preventDefault(); apply(); $('.results', document)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    form.addEventListener('change', apply);
    let t; form.ref.addEventListener('input', () => { clearTimeout(t); t = setTimeout(apply, 250); });
    $$('[data-chips] button', form).forEach((b) => b.addEventListener('click', () => {
      const name = b.closest('[data-chips]').dataset.chips;
      state[name] = state[name] === b.dataset.v ? '' : b.dataset.v;
      setChips(name, state[name]); apply();
    }));
    moreBtn.addEventListener('click', () => { shown += PAGE; render(); });
    $('[data-clear]', listing).addEventListener('click', () => {
      Object.assign(state, { tipus: '', poblacio: '', ref: '', sup: '', hab: '', banys: '', car: [] });
      toForm(); apply();
    });

    load().then((data) => {
      items = data;
      fillCities(form.poblacio, items, state.poblacio);
      toForm(); render();
    }).catch(() => { countEl.textContent = T.error; });
  }

  /* ---- Fitxa ------------------------------------------------------------------ */
  const detail = $('[data-detail]');
  if (detail) {
    const body = $('[data-detail-body]', detail);
    const ref = new URLSearchParams(location.search).get('ref');
    const notFound = () => {
      body.innerHTML = `<div class="results-none"><p>${esc(T.detail.notFound)}</p><a class="btn btn-primary btn-sm" href="${urls.list}">${esc(T.detail.other)}</a></div>`;
    };
    load().then((items) => {
      const p = items.find((x) => String(x.ref) === ref);
      if (!p) return notFound();
      const op = p.sell ? 'comprar' : 'llogar';
      document.title = `${title(p)} · ${T.ref} ${p.ref} | Inllobsa`;
      const rows = [
        [T.ref, p.ref],
        [T.detail.built, p.m2 && `${num(p.m2)} m²`],
        [T.detail.usable, p.m2u && p.m2u !== p.m2 && `${num(p.m2u)} m²`],
        [T.detail.plot, p.parcela && `${num(p.parcela)} m²`],
        [T.hab, p.hab || ''], [T.wc, p.banys || ''],
        [T.detail.floor, p.planta], [T.detail.year, p.any], [T.detail.state, p.estat],
        [T.detail.energy, p.energia && p.energia !== '0' && p.energia],
      ].filter(([, v]) => v);
      const prices = [];
      if (p.sell) prices.push(`<p class="detail-price serif"><span class="detail-label">${esc(T.detail.salePrice)}</span> ${price(p, 'comprar')}</p>`);
      if (p.rent) prices.push(`<p class="detail-price serif"><span class="detail-label">${esc(T.detail.rentPrice)}</span> ${price(p, 'llogar')}</p>`);
      const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(fill(T.detail.waMsg, { ref: p.ref, title: title(p) }))}`;
      const mail = `mailto:${site.email}?subject=${encodeURIComponent(fill(T.detail.mailSubject, { ref: p.ref }))}`;
      const map = p.lat && p.lng ? `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}` : '';
      const desc = (p.desc || '').split(/\n+/).filter(Boolean).map((l) => `<p>${esc(l)}</p>`).join('');
      body.innerHTML = `
        <div class="detail-grid">
          <div class="gallery" data-gallery>
            <div class="gallery-main">
              <img src="${esc(p.fotos[0])}" alt="${esc(title(p))}" data-main>
              <button class="carousel-arrow carousel-prev" type="button" aria-label="${esc(T.prev)}" data-gprev></button>
              <button class="carousel-arrow carousel-next" type="button" aria-label="${esc(T.next)}" data-gnext></button>
              <span class="gallery-count" data-gcount></span>
            </div>
            <ul class="gallery-thumbs">${p.fotos.map((f, i) => `<li><button type="button" data-i="${i}" aria-label="${esc(T.detail.openPhoto)} ${i + 1}"><img src="${esc(f)}" alt="" loading="lazy"></button></li>`).join('')}</ul>
          </div>
          <aside class="detail-side">
            <p class="kicker">${esc(p.zona)}${p.zona ? ' · ' : ''}${esc(p.ciutat)}</p>
            <h1 class="detail-title serif">${esc(title(p))}</h1>
            ${prices.join('')}
            <div class="detail-contact">
              <h2 class="serif">${esc(T.detail.contactTitle)}</h2>
              <p>${esc(T.detail.contactText)}</p>
              <a class="btn btn-wa btn-block" href="${wa}" target="_blank" rel="noopener">${esc(T.detail.whatsapp)}</a>
              <a class="btn btn-primary btn-block" href="tel:${esc(site.phoneHref)}">${esc(T.detail.call)} · ${esc(site.phone)}</a>
              <a class="text-link" href="${mail}">${esc(T.detail.email)}</a>
            </div>
          </aside>
        </div>
        <div class="detail-info">
          <section>
            <h2 class="serif">${esc(T.detail.data)}</h2>
            <dl class="data-list">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
            ${p.features.length ? `<ul class="tags">${p.features.map((f) => `<li class="tag">${esc(T.featureNames[f] || f)}</li>`).join('')}</ul>` : ''}
          </section>
          ${desc ? `<section><h2 class="serif">${esc(T.detail.description)}</h2><div class="detail-desc">${desc}</div></section>` : ''}
          ${map ? `<p><a class="text-link" href="${map}" target="_blank" rel="noopener">${esc(T.detail.map)}</a></p>` : ''}
        </div>`;

      // Galeria
      let i = 0;
      const main = $('[data-main]', body);
      const count = $('[data-gcount]', body);
      const thumbs = $$('.gallery-thumbs button', body);
      const go = (n) => {
        i = (n + p.fotos.length) % p.fotos.length;
        main.src = p.fotos[i];
        count.textContent = `${i + 1} / ${p.fotos.length}`;
        thumbs.forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
        thumbs[i]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      };
      $('[data-gprev]', body).addEventListener('click', () => go(i - 1));
      $('[data-gnext]', body).addEventListener('click', () => go(i + 1));
      thumbs.forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.i))));
      if (p.fotos.length < 2) $$('.carousel-arrow, .gallery-thumbs', body).forEach((el) => { el.hidden = true; });
      go(0);
    }).catch(() => { body.innerHTML = `<p class="results-count serif">${esc(T.error)}</p>`; });
  }
})();
