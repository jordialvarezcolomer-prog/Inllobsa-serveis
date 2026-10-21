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

  /* Comptadors animats de les xifres (admeten decimals: data-decimals) */
  const decimalSep = (0.5).toLocaleString(root.lang).charAt(1);
  const format = (n, decimals) => n.toFixed(decimals).replace('.', decimalSep);
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    if (!target || reduceMotion) return;
    const from = target > 1000 ? target - 60 : 0;   // els anys compten només els últims anys
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(from + (target - from) * eased, decimals);
      if (t < 1) requestAnimationFrame(step);
    };
    el.textContent = format(from, decimals);
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

  /* Blocs que s'animen en entrar a la pantalla sense amagar-se abans (p. ex. la línia del màrqueting) */
  if (hasIO) {
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }), { rootMargin: '0px 0px -15% 0px' });
    $$('[data-animate]').forEach((el) => io.observe(el));
  } else {
    $$('[data-animate]').forEach((el) => el.classList.add('is-in'));
  }

  /* Targetes de serveis i màrqueting: llum que segueix el cursor i una lleugera inclinació 3D */
  if (!reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('[data-spotlight]').forEach((card) => {
      const tilt = card.classList.contains('service-card');
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        if (tilt) {
          card.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
          card.style.setProperty('--ry', `${(x - 0.5) * 6}deg`);
        }
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* Equip: en tocar o activar la foto amb el teclat, s'amplia i mostra la frase */
  const people = $$('.person');
  people.forEach((person) => {
    const photo = $('[data-person-photo]', person);
    const toggle = () => {
      const open = !person.classList.contains('is-open');
      people.forEach((p) => {
        p.classList.remove('is-open');
        $('[data-person-photo]', p).setAttribute('aria-pressed', 'false');
      });
      person.classList.toggle('is-open', open);
      photo.setAttribute('aria-pressed', String(open));
    };
    photo.addEventListener('click', toggle);
    photo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  /* Ressenyes: carrusel continu en dues files */
  const marquee = $('[data-marquee]');
  if (marquee) {
    const tracks = $$('[data-marquee-track]', marquee);
    const toggleBtn = $('[data-marquee-toggle]', marquee);

    // "Llegeix-la sencera" només quan el text queda retallat
    const setupReadMore = (scope) => $$('.review', scope).forEach((review) => {
      const text = $('[data-review-text] p', review);
      const btn = $('[data-review-more]', review);
      if (!btn) return;
      const more = btn.textContent;
      btn.hidden = text.scrollHeight <= text.clientHeight + 2;
      btn.onclick = () => {
        const open = review.classList.toggle('is-open');
        btn.textContent = open ? btn.dataset.less : more;
        btn.setAttribute('aria-expanded', String(open));
      };
    });

    if (!reduceMotion) {
      tracks.forEach((track) => {
        // Es dupliquen les targetes perquè el moviment sigui continu; la còpia queda oculta per als lectors de pantalla
        [...track.children].forEach((item) => {
          const clone = item.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          $$('button, a', clone).forEach((el) => el.setAttribute('tabindex', '-1'));
          track.appendChild(clone);
        });
      });
      marquee.classList.add('is-ready');
      const setDuration = () => tracks.forEach((track) => {
        track.style.setProperty('--marquee-duration', `${Math.round(track.scrollWidth / 2 / 38)}s`); // ~38 px/s
      });
      setDuration();
      addEventListener('resize', setDuration);
      toggleBtn.addEventListener('click', () => {
        const paused = marquee.classList.toggle('is-paused');
        toggleBtn.setAttribute('aria-label', paused ? marquee.dataset.labelPlay : marquee.dataset.labelPause);
      });
    }
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => setupReadMore(marquee));
  }

  /* Any actual al peu */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
