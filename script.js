const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

(() => {
  const form = document.getElementById('leadForm');
  const msgEl = document.getElementById('msg');
  const submitBtn = document.getElementById('submitBtn');

  const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbw22mcUfepc4dgRPL3WDH5mFq-2AHl8J4OSTmpPH-JyUOg2tBuldeFcKFVf7Ye4oPkl/exec";
  const SUPPORT_WA = "919266023555";

  function showMessage(text, color = '') {
    if (!msgEl) return;
    msgEl.style.color = color;
    msgEl.textContent = text;
  }

  if (!form) return;

  function openWhatsApp(prefillText = '') {
    const text = prefillText ? encodeURIComponent(prefillText) : '';
    const waUrl = `https://wa.me/${SUPPORT_WA}${text ? '?text=' + text : ''}`;
    window.open(waUrl, '_blank');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage('', '');

    const fullName = (document.getElementById('fullName') || {}).value?.trim() || '';
    const countryCode = (document.getElementById('countryCode') || {}).value || '';
    const whatsapp = (document.getElementById('whatsapp') || {}).value?.trim() || '';
    const hospital = (document.getElementById('hospital') || {}).value || '';
    const city = (document.getElementById('city') || {}).value || '';
    const secretKey = (document.getElementById('secretKey') || {}).value || '';

    if (!fullName || !whatsapp) {
      showMessage('Please fill your name and WhatsApp number.', 'red');
      return;
    }

    const payload = {
      secret: secretKey,
      fullName,
      countryCode,
      whatsapp,
      hospital,
      city,
      source: window.location.hostname || 'website',
      timestamp: new Date().toISOString()
    };

    if (submitBtn) {
      submitBtn.disabled = true;
    }
    const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';
    if (submitBtn) submitBtn.textContent = 'Sending...';
    showMessage('Sending...', '');

    try {
      const resp = await fetch(WEBAPP_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store'
      });

      if (!resp.ok) {
        let text = await resp.text().catch(() => '');
        try {
          const j = text ? JSON.parse(text) : null;
          console.warn('Server responded not ok:', j || text);
        } catch (err) {
          console.warn('Non-JSON response or empty body on non-ok status.');
        }
        throw new Error('Non-OK response from server');
      }

      const json = await resp.json().catch(() => null);

      if (json && (json.status === 'success' || json.result === 'success')) {
        showMessage('Thank you! We have received your inquiry. Our team will contact you shortly.', 'green');
        form.reset();
      } else {
        console.warn('Server response (no success flag):', json);
        showMessage('Submission received but server did not confirm success. Check sheet & email.', 'orange');
        form.reset();
      }
    } catch (err) {
      console.warn('Primary POST failed, attempting no-cors fallback. Error:', err);

      try {
        await fetch(WEBAPP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          cache: 'no-store'
        });

        showMessage('Thank you! Your inquiry was sent (fallback). If you do not see a confirmation, please contact us on WhatsApp.', 'green');
        form.reset();
      } catch (err2) {
        console.error('Fallback no-cors failed too:', err2);
        showMessage('Network error. Please try again or contact us on WhatsApp.', 'red');
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });

  const waLink = document.getElementById('waChat');
  if (waLink) {
    waLink.addEventListener('click', (ev) => {});
  }
})();

(function() {
  const navToggle = document.getElementById('navToggle');
  if (!navToggle) return;

  navToggle.addEventListener('click', function() {
    const isOpen = document.body.classList.toggle('mobile-nav-open');
    this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', function(e) {
    if (!document.body.classList.contains('mobile-nav-open')) return;
    const header = document.querySelector('.site-header .header-inner');
    if (header && !header.contains(e.target)) {
      document.body.classList.remove('mobile-nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }, true);
})();
