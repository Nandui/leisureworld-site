/* Native controls stay usable without enhancement; no visitor tracking. */
(() => {
  'use strict';
  // Keep long document contents available without making phone readers scroll past them.
  const contents = document.querySelector('.policy-contents');
  if (contents) {
    const wide = window.matchMedia('(min-width: 851px)');
    contents.open = wide.matches;
    wide.addEventListener('change', event => { contents.open = event.matches; });
  }
  const finder = document.querySelector('[data-faq-finder]');
  if (finder) {
    const input = finder.querySelector('input[type="search"]');
    const filters = [...finder.querySelectorAll('[data-faq-category]')];
    const questions = [...finder.querySelectorAll('details[data-topic]')];
    const count = finder.querySelector('[data-results]');
    const empty = finder.querySelector('[data-empty]');
    let category = 'all';
    const update = () => {
      const query = input.value.trim().toLocaleLowerCase('en-IE');
      let total = 0;
      questions.forEach(question => {
        const match = (category === 'all' || category === question.dataset.topic) && question.textContent.toLocaleLowerCase('en-IE').includes(query);
        question.hidden = !match;
        if (match) total++;
      });
      filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.faqCategory === category)));
      count.textContent = `${total} ${total === 1 ? 'question' : 'questions'}${query ? ' matching your search' : ''}`;
      empty.hidden = total > 0;
    };
    finder.querySelector('[data-search-controls]').hidden = false;
    input.addEventListener('input', update);
    filters.forEach(button => button.addEventListener('click', () => {category = button.dataset.faqCategory; update();}));
    finder.querySelector('[data-clear-search]').addEventListener('click', () => {input.value = '';category = 'all';update();input.focus();});
    update();
  }
})();
