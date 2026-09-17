/* Anchor links work without JavaScript. Enhancement shows one centre/activity. */
(() => {
  'use strict';
  const browser = document.querySelector('[data-hours-browser]');
  if (!browser) return;
  const centres = [...browser.querySelectorAll('.hours-centre')];
  if (!centres.length) return;
  const centreLinks = [...browser.querySelectorAll('[data-centre-link]')];
  const status = browser.querySelector('[data-hours-status]');
  let activeCentre = centres[0];
  let activeActivity = 'swimming';

  const show = (centre, activity, announce = false) => {
    const panels = [...centre.querySelectorAll('[data-activity]')];
    const panel = panels.find(item => item.dataset.activity === activity) || panels[0];
    if (!panel) return;
    activeCentre = centre;
    activeActivity = panel.dataset.activity;
    centres.forEach(item => { item.hidden = item !== centre; });
    panels.forEach(item => { item.hidden = item !== panel; });
    centreLinks.forEach(link => {
      if (link.dataset.centreLink === centre.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    centre.querySelectorAll('[data-activity-link]').forEach(link => {
      if (link.dataset.activityLink === activeActivity) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    if (announce) status.textContent = `${centre.querySelector('h2').textContent}: ${panel.querySelector('h3').textContent}`;
  };

  const readHash = () => {
    try { return document.getElementById(decodeURIComponent(location.hash.slice(1))); }
    catch { return null; }
  };
  const followHash = (scroll = true) => {
    const target = readHash();
    const centre = target?.closest('.hours-centre');
    if (centre) {
      show(centre, target.closest('[data-activity]')?.dataset.activity || 'swimming');
      if (scroll) requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'instant', block: 'start' });
        // Focus the destination's label instead of outlining an entire timetable.
        const label = target.querySelector('h2, h3, caption') || target;
        label.setAttribute('tabindex', '-1');
        label.focus({ preventScroll: true });
      });
    } else if (!location.hash) show(centres[0], 'swimming');
  };

  browser.addEventListener('click', event => {
    const link = event.target.closest('[data-centre-link], [data-activity-link]');
    // Retain normal open-in-new-tab and copy-link behavior.
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const centre = link.dataset.centreLink
      ? centres.find(item => item.id === link.dataset.centreLink)
      : link.closest('.hours-centre');
    if (!centre) return;
    event.preventDefault();
    show(centre, link.dataset.activityLink || activeActivity, true);
    const hash = `#${centre.id}-${activeActivity}`;
    if (location.hash !== hash) history.pushState(null, '', hash);
  });

  show(activeCentre, activeActivity);
  browser.classList.add('hours-enhanced');
  followHash();
  window.addEventListener('hashchange', () => followHash());
  window.addEventListener('popstate', () => followHash());
})();
