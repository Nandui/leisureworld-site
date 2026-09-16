(() => {
  'use strict';
  const emailLink = document.getElementById('email-reception');
  if (!emailLink) return;
  const params = new URLSearchParams(location.search);
  const centres = {
    Bishopstown: { phone: '+353214346505', label: '021 434 6505' },
    Churchfield: { phone: '+353214397868', label: '021 439 7868' },
    Douglas: { phone: '+353214293073', label: '021 429 3073' },
  };
  const topics = new Set(['Membership & Pricing', 'Swimming Lessons', 'Fitness Classes', 'Astro Pitch Hire', 'Summer Camps', 'Health Programmes', 'Lifeguard Training', 'Swim Teacher Training', 'Gift Vouchers', 'Accessibility', 'General Enquiry', 'Teen Gym', 'Careers']);
  const requestedCentre = params.get('centre');
  const centre = Object.hasOwn(centres, requestedCentre) ? requestedCentre : '';
  const topic = topics.has(params.get('topic')) ? params.get('topic') : '';
  const subject = [topic || 'Website enquiry', centre].filter(Boolean).join(' — ');
  emailLink.href = `mailto:info@leisureworldcork.com?subject=${encodeURIComponent(subject)}`;
  if (topic || centre) {
    const context = document.getElementById('contact-context');
    context.textContent = `Enquiry: ${subject}`;
    context.hidden = false;
  }
  if (centre) {
    const selected = document.getElementById('contact-selected-centre');
    const call = document.createElement('a');
    call.href = `tel:${centres[centre].phone}`;
    call.textContent = `${centre} reception: ${centres[centre].label}`;
    selected.replaceChildren(call);
    selected.hidden = false;
  }
})();
