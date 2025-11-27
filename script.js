// script.js
document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('leadForm');
const msgEl = document.getElementById('msg');

// Updated Google Apps Script Web App URL
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbw_pZf0VgNVHafTEAFCcEa-NirOHjDlh_5WS8VTaWiAGC2ZXkUK-GTrga96xG9lDjKKJQ/exec";

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();
  const countryCode = document.getElementById('countryCode').value;
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const hospital = document.getElementById('hospital').value;
  const city = document.getElementById('city').value;
  const secretKey = document.getElementById('secretKey').value;

  if(!fullName || !whatsapp){
    msgEl.textContent = "Please fill your name and WhatsApp number.";
    return;
  }

  const payload = {
    secret: secretKey,
    fullName,
    countryCode,
    whatsapp,
    hospital,
    city,
    source: window.location.hostname,
    timestamp: new Date().toISOString()
  };

  msgEl.textContent = "Sending...";

  try {
    const resp = await fetch(WEBAPP_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });

    const res = await resp.json();
    if(res && res.status === 'success') {
      msgEl.style.color = 'green';
      msgEl.textContent = "Thank you! We have received your inquiry. Our team will contact you shortly.";
      form.reset();
    } else {
      msgEl.style.color = 'red';
      msgEl.textContent = "There was an error submitting your form. Try again or contact us on WhatsApp.";
    }
  } catch (err) {
    console.error(err);
    msgEl.style.color = 'red';
    msgEl.textContent = "Network error. Please try again or contact us on WhatsApp.";
  }
});
