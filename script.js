/* ==========================================================================
   LeisureWorld Cork — Site-wide JavaScript
   --------------------------------------------------------------------------
   One file used by every page. All handlers detect their own elements, so
   pages without (e.g.) a contact form simply skip that block. Nothing in
   here ever throws if an element is missing.
   ========================================================================== */

(function () {
  'use strict';


  /* ── Custom cursor ──────────────────────────────────────────────────────
     Replaces the native cursor with the floating dot defined by `#cur` in
     the CSS. Skips on touch devices, since they don't have a cursor. */
  function initCustomCursor() {
    const cur = document.getElementById('cur');
    if (!cur) return;
    if (window.matchMedia('(hover: none)').matches) return;

    document.addEventListener('mousemove', (e) => {
      cur.style.left = e.clientX + 'px';
      cur.style.top  = e.clientY + 'px';
    });

    const hoverables = 'a, button, .loc-card, .ed-item, .acc-trigger, .acc-cell, ' +
                       '.cloc, .price-row, .hours-card, .ctc-card, .cform, .btn-submit';
    document.querySelectorAll(hoverables).forEach((el) => {
      el.addEventListener('mouseenter', () => cur.classList.add('big'));
      el.addEventListener('mouseleave', () => cur.classList.remove('big'));
    });
  }


  /* ── Sticky nav ─────────────────────────────────────────────────────────
     Adds `.stuck` to the nav after the user scrolls past 30px so the nav
     can change its background/shadow via CSS. */
  function initStickyNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      nav.classList.toggle('stuck', window.scrollY > 30);
    }, { passive: true });
  }


  /* ── Mobile menu ────────────────────────────────────────────────────────
     Hamburger button opens the slide-over menu; the close button and any
     link inside close it again. */
  function initMobileMenu() {
    const mob   = document.getElementById('mob');
    const ham   = document.getElementById('ham');
    const close = document.getElementById('mob-close');
    if (!mob || !ham) return;

    ham.addEventListener('click', () => mob.classList.add('open'));
    if (close) close.addEventListener('click', () => mob.classList.remove('open'));

    document.querySelectorAll('.mlink').forEach((a) => {
      a.addEventListener('click', () => mob.classList.remove('open'));
    });
  }


  /* ── Scroll-reveal ──────────────────────────────────────────────────────
     Any element with class `.r` fades/slides into view (rule defined in
     the CSS) the first time it enters the viewport. */
  function initScrollReveal() {
    const targets = document.querySelectorAll('.r');
    if (!targets.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('on'); });
    }, { threshold: 0.1 });

    targets.forEach((el) => io.observe(el));
  }


  /* ── Doc-page sidebar scrollspy ─────────────────────────────────────────
     Used on policy pages: highlights the matching `.doc-nav a` link as the
     reader scrolls through the corresponding section. We accept any of the
     section-like containers used across the policy pages. */
  function initDocScrollspy() {
    const navLinks = document.querySelectorAll('.doc-nav a');
    if (!navLinks.length) return;

    const sectionSelectors = '.doc-section, .rules-group, .charter-item';
    const sections = document.querySelectorAll(sectionSelectors);
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.remove('active'));
        const active = document.querySelector(`.doc-nav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      });
    }, { threshold: 0.3 });

    sections.forEach((s) => observer.observe(s));

    // Also reveal-on-scroll for these sections, matching the original behaviour.
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('on'); });
    }, { threshold: 0.08 });
    sections.forEach((el) => reveal.observe(el));
  }


  /* ── Activities accordion (home page) ───────────────────────────────────
     Exposed globally because the markup uses inline `onclick="accToggle(this)"`. */
  window.accToggle = function (btn) {
    const item = btn.closest('.acc-item');
    if (!item) return;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.acc-item').forEach((i) => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  };


  /* ── Pricing tabs (home page) ───────────────────────────────────────────
     The home-page pricing strip uses `onclick="showTab('payg', this)"`. */
  window.showTab = function (id, btn) {
    document.querySelectorAll('.price-panel').forEach((p) => p.classList.remove('show'));
    document.querySelectorAll('.ptab').forEach((b) => b.classList.remove('active'));
    const panel = document.getElementById('tab-' + id);
    if (panel) panel.classList.add('show');
    if (btn) btn.classList.add('active');
  };


  /* ── Pricing-page centre tabs ───────────────────────────────────────────
     pricing.html uses `onclick="showCentre('btown', this)"` to switch
     between Bishopstown / Churchfield / Douglas panels. */
  window.showCentre = function (id, btn) {
    document.querySelectorAll('.centre-panel').forEach((p) => p.classList.remove('show'));
    document.querySelectorAll('.ctab').forEach((b) => b.classList.remove('active'));
    const panel = document.getElementById('panel-' + id);
    if (panel) panel.classList.add('show');
    if (btn) btn.classList.add('active');
  };


  /* ── Live-chat status indicator (contact page) ──────────────────────────
     Shows a green pulsing dot during live-chat hours, red otherwise. The
     hours: Mon–Thu 09:00–17:00, Fri 09:00–16:30. Re-checks every minute. */
  function initChatStatus() {
    const dot = document.getElementById('chat-dot');
    const txt = document.getElementById('chat-status-text');
    if (!dot || !txt) return;

    function update() {
      const now  = new Date();
      const day  = now.getDay();        // 0 = Sun … 6 = Sat
      const time = now.getHours() + now.getMinutes() / 60;

      let online = false;
      if (day >= 1 && day <= 4 && time >= 9 && time < 17)   online = true;
      if (day === 5            && time >= 9 && time < 16.5) online = true;

      dot.style.background = online ? '#22c55e' : '#d93025';
      dot.style.animation  = online ? '' : 'none';
      txt.textContent      = online ? 'Online Now' : 'Currently Offline';
    }

    update();
    setInterval(update, 60000);
  }


  /* ── Contact form ───────────────────────────────────────────────────────
     Posts the form to send-mail.php. Exposed globally because the markup
     uses inline `onclick="handleForm()"`. */
  window.handleForm = async function () {
    const fname   = document.getElementById('cf-fname');
    const lname   = document.getElementById('cf-lname');
    const email   = document.getElementById('cf-email');
    const centre  = document.getElementById('cf-loc');
    const enquiry = document.getElementById('cf-topic');
    const message = document.getElementById('cf-msg');
    const errEl   = document.getElementById('formError');
    const btn     = document.getElementById('submitBtn');
    if (!fname || !lname || !email || !centre || !enquiry || !message || !errEl || !btn) return;

    const data = {
      fname:   fname.value.trim(),
      lname:   lname.value.trim(),
      email:   email.value.trim(),
      centre:  centre.value,
      enquiry: enquiry.value,
      message: message.value.trim(),
    };

    if (!data.fname || !data.lname || !data.email || !data.centre || !data.enquiry || !data.message) {
      errEl.textContent   = 'Please fill in all fields before sending.';
      errEl.style.display = 'block';
      return;
    }
    errEl.style.display = 'none';

    // Save the original button content so we can restore it on error.
    const originalBtn = btn.innerHTML;
    btn.disabled  = true;
    btn.innerHTML = 'Sending…';

    try {
      const res  = await fetch('send-mail.php', { method: 'POST', body: new URLSearchParams(data) });
      const json = await res.json();

      if (json.success) {
        const wrap = document.getElementById('formWrap');
        const ok   = document.getElementById('formOk');
        if (wrap) wrap.style.display = 'none';
        if (ok)   ok.style.display   = 'block';
      } else {
        errEl.textContent   = json.error || 'Something went wrong. Please try again.';
        errEl.style.display = 'block';
        btn.disabled  = false;
        btn.innerHTML = originalBtn;
      }
    } catch (err) {
      errEl.textContent   = 'Could not reach the server. Please try again later.';
      errEl.style.display = 'block';
      btn.disabled  = false;
      btn.innerHTML = originalBtn;
    }
  };


  /* ── Boot ──────────────────────────────────────────────────────────────
     Run everything once the DOM is parsed. We run the universal pieces on
     every page; page-specific helpers (showTab, accToggle, handleForm)
     are exposed on `window` so inline onclick attributes can find them. */
  function boot() {
    initCustomCursor();
    initStickyNav();
    initMobileMenu();
    initScrollReveal();
    initDocScrollspy();
    initChatStatus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
