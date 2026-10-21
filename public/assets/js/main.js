(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  /* Capçalera: línia inferior en desplaçar */
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
  matchMedia('(min-width: 1181px)').addEventListener('change', (e) => e.matches && setMenu(false));

  /* Secció activa al menú */
  const sections = $$('main section[id]');
  const links = $$('[data-nav-link]');
  if (hasIO) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('is-active', a.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  /* Canvi d'idioma conservant la secció on es troba l'usuari */
  const sectionInView = () => {
    const line = innerHeight * 0.4;
    const passed = sections.filter((s) => s.getBoundingClientRect().top <= line);
    return passed.length ? passed[passed.length - 1].id : '';
  };
  $$('[data-lang-switch]').forEach((a) => a.addEventListener('click', () => {
    const id = sectionInView();
    a.hash = id && id !== 'top' ? id : '';
  }));

  /* Carrusel del hero */
  const carousel = $('[data-carousel]');
  if (carousel) {
    const slides = $$('[data-slide]', carousel);
    const dots = $$('[data-dot]', carousel);
    const toggleBtn = $('[data-carousel-toggle]', carousel);
    const DELAY = 6500;
    let index = 0, timer = null, paused = reduceMotion;

    const slidesWrap = slides[0].parentElement;
    const show = (i) => {
      if (i !== index) slidesWrap.classList.add('has-moved');
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => {
        const active = n === index;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach((d, n) => d.setAttribute('aria-current', String(n === index)));
    };
    const stop = () => { clearInterval(timer); timer = null; };
    const play = () => { stop(); if (!paused) timer = setInterval(() => show(index + 1), DELAY); };
    const setPaused = (p) => {
      paused = p;
      toggleBtn.classList.toggle('is-paused', p);
      toggleBtn.setAttribute('aria-label', p ? toggleBtn.dataset.labelPlay : toggleBtn.dataset.labelPause);
      play();
    };

    $('[data-carousel-prev]', carousel).addEventListener('click', () => { show(index - 1); play(); });
    $('[data-carousel-next]', carousel).addEventListener('click', () => { show(index + 1); play(); });
    dots.forEach((d) => d.addEventListener('click', () => { show(Number(d.dataset.dot)); play(); }));
    toggleBtn.addEventListener('click', () => setPaused(!paused));
    // Pausa mentre el ratolí o el focus són dins del carrusel
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', play);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', play);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));

    show(0);
    slidesWrap.classList.add('is-ready');
    setPaused(paused);
  }

  /* Comptadors animats de les xifres */
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    if (!target || reduceMotion) return;
    const from = target > 1000 ? target - 60 : 0;   // els anys compten només els últims anys
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(from + (target - from) * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    el.textContent = String(from);
    requestAnimationFrame(step);
  };

  /* Aparició esglaonada dels elements i arrencada dels comptadors */
  const revealables = $$('[data-reveal]');
  if (hasIO && !reduceMotion) {
    const groups = new Map();
    revealables.forEach((el) => {
      const siblings = groups.get(el.parentElement) || [];
      siblings.push(el);
      groups.set(el.parentElement, siblings);
      el.style.transitionDelay = `${Math.min(siblings.length - 1, 5) * 80}ms`;
    });
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible');
      $$('[data-count]', el).forEach(countUp);
      // Un cop ha aparegut, treu el retard perquè no afecti els efectes en passar-hi per sobre
      setTimeout(() => { el.style.transitionDelay = ''; }, 1200);
      io.unobserve(entry.target);
    }), { rootMargin: '0px 0px -8% 0px' });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add('is-visible'));
  }

  /* Any actual al peu */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
