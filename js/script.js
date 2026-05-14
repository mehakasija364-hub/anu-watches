/* ANU WATCHES — Interaction layer */
(() => {
  'use strict';

  /* Loader */
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader')?.classList.add('gone'), 1200);
  });

  /* Year */
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* Custom cursor */
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  let mx = 0, my = 0, cx = 0, cy = 0;
  const isMobile = matchMedia('(max-width: 900px)').matches;

  if (!isMobile) {
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
    });
    (function tick() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      if (cursor) { cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'; }
      requestAnimationFrame(tick);
    })();
    document.querySelectorAll('[data-cursor="link"], a, button, input, select, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => cursor?.classList.add('is-link'));
      el.addEventListener('mouseleave', () => cursor?.classList.remove('is-link'));
    });
  }

  /* Nav scroll state */
  const nav = document.getElementById('nav');
  const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Reveal observer */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const siblings = el.parentElement?.querySelectorAll('.reveal') || [];
        const idx = Array.from(siblings).indexOf(el);
        setTimeout(() => el.classList.add('in'), Math.max(0, idx) * 110);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* Hero word stagger */
  document.querySelectorAll('.hero-title .word').forEach((w, i) => {
    setTimeout(() => w.classList.add('in'), 1500 + i * 180);
  });

  /* Particles */
  const particles = document.getElementById('particles');
  if (particles) {
    const COUNT = 28;
    for (let i = 0; i < COUNT; i++) {
      const s = document.createElement('span');
      s.style.left = Math.random() * 100 + '%';
      s.style.bottom = '-10px';
      s.style.animationDelay = (Math.random() * 14) + 's';
      s.style.animationDuration = (10 + Math.random() * 10) + 's';
      s.style.opacity = (0.3 + Math.random() * 0.6).toFixed(2);
      particles.appendChild(s);
    }
  }

  /* Parallax + rotation */
  const heroWatch = document.getElementById('heroWatch');
  const showcaseImg = document.getElementById('showcaseImg');
  const parallaxes = document.querySelectorAll('.parallax-bg');
  let ticking = false;

  function rafScroll() {
    const y = window.scrollY;
    if (heroWatch) heroWatch.style.transform = `rotate(${y * 0.04}deg) translateY(${y * 0.08}px)`;
    if (showcaseImg) {
      const rect = showcaseImg.getBoundingClientRect();
      const offset = (rect.top - window.innerHeight / 2) * -0.05;
      showcaseImg.style.transform = `translateY(${offset}px) scale(1.02)`;
    }
    parallaxes.forEach(p => {
      const rect = p.parentElement.getBoundingClientRect();
      const offset = (rect.top - window.innerHeight / 2) * -0.15;
      p.style.transform = `translateY(${offset}px) scale(1.1)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(rafScroll); ticking = true; }
  }, { passive: true });

  /* 3D tilt on hero watch */
  if (!isMobile) {
    const visual = document.querySelector('.hero-visual');
    if (visual && heroWatch) {
      visual.addEventListener('mousemove', (e) => {
        const r = visual.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        heroWatch.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 14}deg) translateZ(20px)`;
      });
      visual.addEventListener('mouseleave', () => {
        heroWatch.style.transform = '';
      });
    }
  }

  /* Counters */
  const counters = document.querySelectorAll('[data-count]');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.dataset.count, 10);
      const dur = 1800; const start = performance.now();
      const fmt = (n) => n >= 1000 ? (n/1000).toFixed(1).replace(/\.0$/,'') + 'K' : n.toString();
      function step(t) {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countObs.observe(c));

  /* Order form → WhatsApp */
  const form = document.getElementById('orderForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const watch = (data.get('watch') || '').toString().trim();
      const city = (data.get('city') || '').toString().trim();
      const msg = (data.get('msg') || '').toString().trim();

      if (!name || !phone || !watch || !city) {
        alert('Please fill name, phone, watch and city.');
        return;
      }
      if (!/^[0-9+ ]{8,15}$/.test(phone)) {
        alert('Please enter a valid phone number.');
        return;
      }

      const text =
        `*New Order — Anu Watches*%0A%0A` +
        `*Name:* ${encodeURIComponent(name)}%0A` +
        `*Phone:* ${encodeURIComponent(phone)}%0A` +
        `*Watch:* ${encodeURIComponent(watch)}%0A` +
        `*City:* ${encodeURIComponent(city)}%0A` +
        (msg ? `*Notes:* ${encodeURIComponent(msg)}%0A` : '');

      window.open(`https://wa.me/919920381060?text=${text}`, '_blank');
      form.reset();
    });
  }
})();
