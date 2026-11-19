/* Google Analytics 4, loaded only after the visitor accepts analytics cookies. */
(() => {
  const MEASUREMENT_ID = 'G-4L1MER2L5D';
  const STORAGE_KEY = 'lw-analytics-consent';
  let loaded = false;
  let banner = null;

  const readChoice = () => { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } };
  const saveChoice = value => { try { localStorage.setItem(STORAGE_KEY, value); } catch { /* storage blocked: ask again next visit */ } };

  function loadAnalytics() {
    window[`ga-disable-${MEASUREMENT_ID}`] = false;
    if (loaded) { window.gtag('consent', 'update', { analytics_storage: 'granted' }); return; }
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID);
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.append(script);
  }

  function stopAnalytics() {
    window[`ga-disable-${MEASUREMENT_ID}`] = true;
    if (loaded) window.gtag('consent', 'update', { analytics_storage: 'denied' });
    const host = location.hostname;
    const domains = ['', host, `.${host}`, `.${host.replace(/^www\./, '')}`];
    document.cookie.split(';').map(part => part.split('=')[0].trim()).filter(name => /^_ga/.test(name)).forEach(name => {
      domains.forEach(domain => { document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`; });
    });
  }

  function cookiePolicyHref() {
    const link = document.querySelector('a[href*="cookie-policy.html"]');
    return link ? link.getAttribute('href') : '/Policies/cookie-policy.html';
  }

  function choose(value) {
    saveChoice(value);
    if (value === 'granted') loadAnalytics(); else stopAnalytics();
    if (banner) { banner.remove(); banner = null; }
  }

  function showBanner() {
    if (banner) return;
    banner = document.createElement('section');
    banner.className = 'consent-banner';
    banner.setAttribute('aria-label', 'Cookie choice');
    banner.innerHTML = `
      <p>We’d like to use Google Analytics cookies to understand how people use this website, so we can improve it. They are not used for advertising. <a href="${cookiePolicyHref()}">Cookie policy</a></p>
      <div class="consent-actions">
        <button type="button" class="consent-button" data-consent="denied">Reject</button>
        <button type="button" class="consent-button" data-consent="granted">Accept</button>
      </div>`;
    banner.addEventListener('click', event => {
      const button = event.target.closest('[data-consent]');
      if (button) choose(button.dataset.consent);
    });
    document.body.append(banner);
  }

  function addSettingsLinks() {
    const nav = document.querySelector('.footer-bottom nav');
    if (nav && !nav.querySelector('[data-cookie-settings]')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'footer-cookie-settings';
      button.dataset.cookieSettings = '';
      button.textContent = 'Cookie settings';
      nav.append(button);
    }
    document.addEventListener('click', event => {
      if (event.target.closest('[data-cookie-settings]')) { showBanner(); banner.querySelector('button').focus(); }
    });
  }

  const choice = readChoice();
  if (choice === 'granted') loadAnalytics();

  const start = () => { addSettingsLinks(); if (choice !== 'granted' && choice !== 'denied') showBanner(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
