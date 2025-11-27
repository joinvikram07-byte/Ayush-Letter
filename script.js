// Simple demo submit handler
document.getElementById("leadForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = this.name.value || "Friend";
  alert(
    "Thank you, " +
      name +
      "! Your AYUSH visa enquiry has been received. We will contact you shortly."
  );
  this.reset();
});

// WhatsApp button handler
function openWhatsApp() {
  // Replace with your real WhatsApp number in international format (no +, spaces, or leading zeros)
  const phone = "919999999999"; // example - REPLACE THIS with your number
  const msg = encodeURIComponent(
    "Hello, I would like help with an AYUSH Medical Visa Invitation Letter."
  );
  window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
}
