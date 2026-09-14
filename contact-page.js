(() => {
  'use strict';
  const form = document.getElementById('contact-form');
  if (!form) return;
  const feedback = document.getElementById('form-feedback');
  const submit = document.getElementById('send-message');
  const fields = [...form.querySelectorAll('[required]')];
  const labels = {fname:'Enter your first name.',lname:'Enter your last name.',email:'Enter a valid email address.',centre:'Choose a centre.',enquiry:'Choose an enquiry topic.','message-text':'Enter your message.'};
  form.noValidate = true;
  const topic = new URLSearchParams(location.search).get('topic');
  const topicSelect = document.getElementById('enquiry');
  if ([...topicSelect.options].some(option => option.value === topic)) topicSelect.value = topic;
  const centre = new URLSearchParams(location.search).get('centre');
  const centreSelect = document.getElementById('centre');
  if ([...centreSelect.options].some(option => option.value === centre)) centreSelect.value = centre;
  const errorFor = input => document.getElementById((input.name === 'message' ? 'message' : input.id) + '-error');
  const clearError = input => {
    input.removeAttribute('aria-invalid');
    const error = errorFor(input);
    if (error) {error.textContent = '';error.hidden = true;}
  };
  fields.forEach(input => input.addEventListener('input', () => {if (input.validity.valid) clearError(input);}));
  const showFeedback = (heading, message, error=false) => {
    feedback.replaceChildren();
    const title = document.createElement('h3');title.textContent = heading;
    const copy = document.createElement('p');copy.textContent = message;
    feedback.append(title,copy);
    feedback.classList.toggle('error',error);
    feedback.hidden = false;
    feedback.focus();
  };
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;
    const invalid = fields.filter(input => !input.validity.valid || !input.value.trim());
    fields.forEach(clearError);
    if (invalid.length) {
      showFeedback('Check your details', 'Please correct the following fields before sending your message.',true);
      const list = document.createElement('ul');
      invalid.forEach(input => {
        input.setAttribute('aria-invalid','true');
        const text = labels[input.id];
        const error = errorFor(input);error.textContent=text;error.hidden=false;
        const item = document.createElement('li');const a=document.createElement('a');a.href='#'+input.id;a.textContent=text;
        a.addEventListener('click',event=>{event.preventDefault();input.focus();});item.append(a);list.append(item);
      });
      feedback.append(list);
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Sending…';
    form.setAttribute('aria-busy','true');
    showFeedback('Sending your message','Please wait for confirmation before leaving this page.');
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(),15000);
    try {
      const response = await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'},signal:controller.signal});
      const json = response.headers.get('Content-Type')?.includes('application/json') ? await response.json() : null;
      if (!response.ok || json?.success !== true) throw new Error('Message not confirmed');
      showFeedback('Message sent','Thank you for contacting LeisureWorld. Our team will respond using the email address you provided.');
      form.reset();
    } catch {
      showFeedback('Your message could not be confirmed','Your details are still here. Please try again, or email info@leisureworldcork.com. If you already received confirmation elsewhere, contact reception before resending.',true);
      const email=document.createElement('a');email.href='mailto:info@leisureworldcork.com';email.textContent='Email reception';feedback.append(email);
    } finally {
      clearTimeout(timeout);submit.disabled=false;submit.textContent='Send message';form.removeAttribute('aria-busy');
    }
  });
})();
