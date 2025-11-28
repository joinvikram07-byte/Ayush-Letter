// script.js — cleaned & ready to paste
document.getElementById('year').textContent = new Date().getFullYear();

(() => {
  const form = document.getElementById('leadForm');
  const msgEl = document.getElementById('msg');
  const submitBtn = document.getElementById('submitBtn');

  // NEW Web App URL (you provided)
  const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbw22mcUfepc4dgRPL3WDH5mFq-2AHl8J4OSTmpPH-JyUOg2tBuldeFcKFVf7Ye4oPkl/exec";

  // Support WhatsApp number (no +)
  const SUPPORT_WA = "919266023555";

  // Helper: show status message
  function showMessage(text, color = '') {
    msgEl.style.color = color;
    msgEl.textContent = text;
  }

  // Helper: open whatsapp chat in new tab with optional prefilled text
  function openWhatsApp(prefillText = '') {
    const text = prefillText ? encodeURIComponent(prefillText) : '';
    const waUrl = `https://wa.me/${SUPPORT_WA}${text ? '?text=' + text : ''}`;
    window.open(waUrl, '_blank');
  }

  // Actual submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage('', '');

    const fullName = (document.getElementById('fullName') || {}).value?.trim() || '';
    const countryCode = (document.getElementById('countryCode') || {}).value || '';
    const whatsapp = (document.getElementById('whatsapp') || {}).value?.trim() || '';
    const hospital = (document.getElementById('hospital') || {}).value || '';
    const city = (document.getElementById('city') || {}).value || '';
    const secretKey = (document.getElementById('secretKey') || {}).value || '';

    // Basic validation
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

    // UI: disable button while sending
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    showMessage('Sending...', '');

    // Try normal CORS request first (so we can read JSON response)
    try {
      const resp = await fetch(WEBAPP_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store'
      });

      // If server returned a non-JSON or blocked by CORS, resp.ok may be false or json() may throw
      if (!resp.ok) {
        // Try to parse JSON error if available; else throw to go to fallback
        let text = await resp.text().catch(() => '');
        try {
          const j = text ? JSON.parse(text) : null;
          console.warn('Server responded not ok:', j || text);
        } catch (err) {
          console.warn('Non-JSON response or empty body on non-ok status.');
        }
        throw new Error('Non-OK response from server');
      }

      // parse JSON response
      const json = await resp.json().catch(() => null);

      if (json && (json.status === 'success' || json.result === 'success')) {
        showMessage('Thank you! We have received your inquiry. Our team will contact you shortly.', 'green');
        form.reset();
        // Optionally open WhatsApp after success (comment out if not required)
        // openWhatsApp(`Hello, I would like help with an AYUSH Letter. Name: ${fullName}; City: ${city}; Hospital: ${hospital}`);
      } else {
        // server responded but did not explicitly confirm success
        console.warn('Server response (no success flag):', json);
        showMessage('Submission received but server did not confirm success. Check sheet & email.', 'orange');
        form.reset();
      }
    } catch (err) {
      // Most common reason: CORS/preflight blocked the request — attempt no-cors fallback
      console.warn('Primary POST failed, attempting no-cors fallback. Error:', err);

      try {
        // no-cors: sends the request but response will be opaque; we can't read it
        await fetch(WEBAPP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          cache: 'no-store'
        });

        // If no network exception thrown, assume the request reached Apps Script
        showMessage('Thank you! Your inquiry was sent (fallback). If you do not see a confirmation, please contact us on WhatsApp.', 'green');
        form.reset();
      } catch (err2) {
        console.error('Fallback no-cors failed too:', err2);
        showMessage('Network error. Please try again or contact us on WhatsApp.', 'red');
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });

  // Optionally attach WhatsApp chat button behaviour if you want to open with prefill
  const waLink = document.getElementById('waChat');
  if (waLink) {
    waLink.addEventListener('click', (ev) => {
      // default anchor will open anyway; keep this in case you want to add prefill logic later
    });
  }
})();
