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
