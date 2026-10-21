(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Capçalera: ombra en desplaçar */
  const header = $('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menú mòbil */
  const nav = $('[data-nav]');
  const toggle = $('[data-menu-toggle]');
  const toggleLabel = $('[data-menu-label]');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggleLabel.textContent = open ? toggle.dataset.labelClose : toggle.dataset.labelOpen;
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  matchMedia('(min-width: 961px)').addEventListener('change', (e) => e.matches && setMenu(false));

  /* Secció activa al menú */
  const sections = $$('main section[id]');
  const links = $$('[data-nav-link]');
  let current = '';
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) current = entry.target.id; });
      links.forEach((a) => a.classList.toggle('is-active', a.hash === `#${current}`));
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  /* Canvi d'idioma conservant la secció on es troba l'usuari */
  const sectionInView = () => {
    const line = innerHeight * 0.4;
    const visible = sections.filter((s) => s.getBoundingClientRect().top <= line);
    return visible.length ? visible[visible.length - 1].id : '';
  };
  $$('[data-lang-switch]').forEach((a) => a.addEventListener('click', () => {
    const id = sectionInView();
    a.hash = id && id !== 'top' ? id : '';
  }));

  /* Enllaços "Demana informació": preselecciona el servei al formulari */
  const serviceSelect = $('#f-service');
  $$('[data-service]').forEach((a) => a.addEventListener('click', () => {
    if (serviceSelect) serviceSelect.value = a.dataset.service;
  }));

  /* Aparició subtil d'elements */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const targets = $$('.service-card, .why-item, .timeline-item');
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    targets.forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      el.style.transitionDelay = `${(i % 3) * 70}ms`;
      io.observe(el);
    });
  }

  /* Formulari de contacte */
  const form = $('[data-contact-form]');
  if (form) {
    const msg = form.dataset;
    const status = $('[data-form-status]', form);
    const submit = $('[data-submit]', form);
    const submitText = submit.textContent;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRe = /^\+?[\d\s().-]{9,20}$/;

    const fields = {
      nom: (v) => (v.trim() ? '' : msg.msgRequired),
      email: (v) => (!v.trim() ? msg.msgRequired : emailRe.test(v.trim()) ? '' : msg.msgEmail),
      telefon: (v) => (!v.trim() || phoneRe.test(v.trim()) ? '' : msg.msgPhone),
      missatge: (v) => (v.trim() ? '' : msg.msgRequired),
      consentiment: (_, el) => (el.checked ? '' : msg.msgConsent),
    };

    const check = (name) => {
      const el = form.elements[name];
      const error = fields[name](el.value, el);
      const out = document.getElementById(`${el.id}-err`);
      out.textContent = error;
      if (error) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
      return !error;
    };

    Object.keys(fields).forEach((name) => {
      const el = form.elements[name];
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'blur', () => check(name));
      el.addEventListener('input', () => el.hasAttribute('aria-invalid') && check(name));
    });

    const setStatus = (text, type) => {
      status.textContent = text;
      status.className = `form-status${type ? ` is-${type}` : ''}`;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const invalid = Object.keys(fields).filter((name) => !check(name));
      if (invalid.length) {
        setStatus(msg.msgSummary, 'error');
        form.elements[invalid[0]].focus();
        return;
      }
      submit.disabled = true;
      submit.textContent = msg.msgSending;
      setStatus('', '');
      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString(),
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        setStatus(msg.msgSuccess, 'success');
      } catch {
        setStatus(msg.msgError, 'error');
      } finally {
        submit.disabled = false;
        submit.textContent = submitText;
      }
    });
  }

  /* Any actual al peu */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
