/* Progressive enhancement: links and centre details also work without JavaScript. */
(() => {
  'use strict';
  const menu = document.getElementById('site-menu');
  const menuToggle = document.getElementById('menu-toggle');
  if (menu && menuToggle && typeof menu.showModal === 'function') {
    menuToggle.hidden = false;
    menuToggle.addEventListener('click', () => {
      menu.showModal();
      document.body.classList.add('menu-open');
      menuToggle.setAttribute('aria-expanded', 'true');
    });
    menu.addEventListener('close', () => {
      document.body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) menu.close();
      if (event.target === menu) {
        const bounds = menu.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) menu.close();
      }
    });
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!reducedMotion.matches) entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  }
  const hero = document.querySelector('.home-hero');
  const heroImage = document.getElementById('hero-image');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const resetHero = () => {
    if (!heroImage) return;
    heroImage.style.removeProperty('--hero-x');
    heroImage.style.removeProperty('--hero-y');
  };
  if (hero && heroImage) {
    hero.addEventListener('pointermove', (event) => {
      if (reducedMotion.matches || !finePointer.matches) return;
      const bounds = hero.getBoundingClientRect();
      heroImage.style.setProperty('--hero-x', `${((event.clientX - bounds.left) / bounds.width - .5) * -10}px`);
      heroImage.style.setProperty('--hero-y', `${((event.clientY - bounds.top) / bounds.height - .5) * -8}px`);
    });
    hero.addEventListener('pointerleave', resetHero);
    reducedMotion.addEventListener('change', resetHero);
    finePointer.addEventListener('change', resetHero);
  }
})();
