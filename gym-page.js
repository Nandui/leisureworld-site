/* Class discovery stays readable when JavaScript is unavailable. */
(() => {
  'use strict';
  const filters = document.querySelector('.class-filters');
  const list = document.getElementById('class-list');
  const count = document.getElementById('class-count');
  if (!filters || !list || !count) return;

  const buttons = [...filters.querySelectorAll('[data-filter]')];
  const classes = [...list.querySelectorAll('[data-category]')];
  const selectCategory = (button) => {
    const category = button.dataset.filter;
    let total = 0;
    classes.forEach((item) => {
      item.hidden = category !== 'all' && item.dataset.category !== category;
      if (!item.hidden) total += 1;
    });
    buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    const label = category === 'agewell' ? 'AgeWell' : category === 'teens' ? 'teen' : category;
    count.textContent = category === 'all'
      ? `${total} classes & programmes`
      : `${total} ${label} ${category === 'teens' || category === 'wellbeing' ? 'programmes' : 'classes'}`;
  };

  buttons.forEach((button) => button.addEventListener('click', () => selectCategory(button)));
  selectCategory(buttons.find((button) => button.getAttribute('aria-pressed') === 'true') || buttons[0]);
  filters.hidden = false;
})();
