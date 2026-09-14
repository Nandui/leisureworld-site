/* A small decision aid. The full activity directory works without JavaScript. */
(() => {
  'use strict';
  const finder = document.querySelector('[data-activity-finder]');
  if (!finder) return;
  const choices = [...finder.querySelectorAll('[data-activity-choice]')];
  const panels = [...finder.querySelectorAll('[data-activity-result]')];
  const status = finder.querySelector('[data-activity-status]');
  choices.forEach(button => button.addEventListener('click', () => {
    choices.forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
    panels.forEach(panel => {
      panel.hidden = panel.dataset.activityResult !== button.dataset.activityChoice;
      if (!panel.hidden) status.textContent = panel.querySelector('h3').textContent + ' ' + panel.querySelector('h3 + p').textContent;
    });
  }));
  finder.hidden = false;
})();
