// script.js
document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('leadForm');
const msgEl = document.getElementById('msg');

// Updated Google Apps Script Web App URL
const WEBAPP_URL = "https://script.google.com/a/macros/medcaretrust.com/s/AKfycbwUTA_PxAXn_-4fwBlN8uE9uVcwqpqVnCoL2sRLY0qhHAPCVJJjQdabzNaTwBL7QU2vNA/exec";

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
// Replace with your deployed Google Apps Script web app URL
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw_pZf0VgNVHafTEAFCcEa-NirOHjDlh_5WS8VTaWiAGC2ZXkUK-GTrga96xG9lDjKKJQ/exec";

// Support/WhatsApp number to open after successful submit (no +, country code included)
const SUPPORT_WA = "919266023555";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("leadForm");
  const msg = document.createElement("div");
  msg.id = "formMessage";
  msg.style.marginTop = "12px";
  form.appendChild(msg);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    msg.style.color = "";

    const data = {
      name: form.name.value.trim(),
      country: form.country.value,
      whatsapp: form.whatsapp.value.trim(),
      hospital: form.hospital.value,
      city: form.city.value,
      secret: "SHer@1307" // must match Apps Script secret
    };

    // Basic validation
    if (!data.name || !data.whatsapp) {
      msg.style.color = "red";
      msg.textContent = "Please fill in required fields.";
      return;
    }

    // Show loading
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Network response was not OK");

      const json = await res.json();

      if (json && json.result === "success") {
        msg.style.color = "green";
        msg.textContent = "Thank you — your enquiry was submitted.";

        // Open WhatsApp in new tab with prefilled support message
        const waText = encodeURIComponent(`Hello, I would like help with an AYUSH Letter. Name: ${data.name}; City: ${data.city}; Hospital: ${data.hospital}`);
        const waUrl = `https://wa.me/${SUPPORT_WA}?text=${waText}`;
        window.open(waUrl, "_blank");

        form.reset();
      } else {
        // Apps Script returned failure or unknown response
        msg.style.color = "red";
        msg.textContent = "Submission failed. Please try again or contact us on WhatsApp.";
      }
    } catch (err) {
      console.error(err);
      msg.style.color = "red";
      msg.textContent = "Network error. Please try again or contact us on WhatsApp.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Inquiry";
}
  } catch (err) {
    console.error(err);
    msgEl.style.color = 'red';
    msgEl.textContent = "Network error. Please try again or contact us on WhatsApp.";
  }
  });
});

function openWhatsApp() {
  const wa = "919266023555";
  const text = encodeURIComponent("Hello, I would like help with an AYUSH Letter");
  window.open(`https://wa.me/${wa}?text=${text}`, "_blank");
}
