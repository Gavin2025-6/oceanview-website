const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll("[data-request]").forEach((button) => {
  button.addEventListener("click", () => {
    const request = button.getAttribute("data-request");
    const field = document.querySelector("#vehicle-request");
    if (field) field.value = request || "";
  });
});

const whatsappLink = document.createElement("a");
whatsappLink.className = "whatsapp-float";
whatsappLink.href = "https://wa.me/19058693666";
whatsappLink.target = "_blank";
whatsappLink.rel = "noopener";
whatsappLink.setAttribute("aria-label", "Contact Oceanview Auto on WhatsApp");
whatsappLink.innerHTML = '<span class="whatsapp-mark">WA</span><span>WhatsApp</span>';
document.body.appendChild(whatsappLink);
