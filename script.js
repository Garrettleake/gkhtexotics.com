/* ============================================
   GKHT Exotics — Global Scripts
   ============================================ */

/* ---- Local preview shim ----
   Links are extensionless (/fleet, /cars/az-gkht-bmw-m4) because GitHub Pages
   resolves those to the .html file. Opening the files directly with file://
   has no server to do that, so rewrite the links to real filenames.
   Completely inert on the live site. */
(function () {
  if (window.location.protocol !== 'file:') return;

  function toFile(u) {
    if (!u) return u;
    if (/^(https?:|mailto:|tel:|sms:|data:|javascript:|#)/i.test(u)) return u;
    var hash = '', i = u.indexOf('#');
    if (i > -1) { hash = u.slice(i); u = u.slice(0, i); }
    if (u === '') return u + hash;
    if (u.slice(-1) === '/') return u + 'index.html' + hash;   // "../"  -> "../index.html"
    if (/\.[a-z0-9]+$/i.test(u)) return u + hash;              // already has an extension
    return u + '.html' + hash;                                 // "../fleet" -> "../fleet.html"
  }

  function patch() {
    document.querySelectorAll('a[href]').forEach(function (a) {
      a.setAttribute('href', toFile(a.getAttribute('href')));
    });
    document.querySelectorAll('[data-href]').forEach(function (el) {
      el.setAttribute('data-href', toFile(el.getAttribute('data-href')));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patch);
  } else {
    patch();
  }
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Nav: scroll class ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Nav: active link ----
     Normalise both sides to a bare page name so it works for extensionless
     URLs (/fleet), the served .html file, and local file:// previews. */
  const pageName = p => {
    const last = p.split('/').filter(Boolean).pop() || 'index';
    return last.replace(/\.html$/, '').toLowerCase();
  };
  const current = pageName(window.location.pathname);
  document.querySelectorAll('.nav__link').forEach(link => {
    const target = pageName(link.getAttribute('href') || '');
    if (target === current) link.classList.add('active');
  });

  /* ---- Mobile menu ---- */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Fade-in on scroll ---- */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeEls.forEach(el => observer.observe(el));
  }

  /* ---- Hero parallax (home only) ---- */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY;
      heroBg.style.transform = `translateY(${offset * 0.4}px)`;
    }, { passive: true });
  }

  /* ---- Ticker animation (home only) ---- */
  const ticker = document.querySelector('.ticker__track');
  if (ticker) {
    // Clone the content for seamless loop
    ticker.innerHTML += ticker.innerHTML;
  }

});
