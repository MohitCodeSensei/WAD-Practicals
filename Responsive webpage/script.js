
(function () {
  'use strict';

  // helpers
  function debounce(fn, wait = 120) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  }

  // menu toggle + accessibility
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.getElementById('nav-links');
  const nav = document.querySelector('.nav');

  function setMenuOpen(open) {
    if (!navLinks || !menuBtn) return;
    navLinks.classList.toggle('show', open);
    navLinks.setAttribute('aria-hidden', (!open).toString());
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setMenuOpen(!navLinks.classList.contains('show'));
    });

    // close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) setMenuOpen(false);
    });

    // close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    });

    // close when link clicked (mobile)
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 640) setMenuOpen(false);
      });
    });
  }

  // lazy-load logos
  const imgs = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window && imgs.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        img.src = img.dataset.src;
        img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
        obs.unobserve(img);
      });
    }, { rootMargin: '120px 0px', threshold: 0.01 });
    imgs.forEach(i => io.observe(i));
  } else {
    imgs.forEach(img => {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }

  // toggle compact-nav class on html for CSS hooks
  const setCompact = () => {
    const compact = window.innerWidth < 640;
    document.documentElement.classList.toggle('compact-nav', compact);
  };
  const onResize = debounce(setCompact, 120);
  setCompact();
  window.addEventListener('resize', onResize);

  // optional: simple service worker registration (safe fail)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker?.register('sw.js').catch(()=>{ /* ignore for demo */ });
  }

})();