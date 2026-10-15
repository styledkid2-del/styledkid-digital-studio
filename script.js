const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");
if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
  }));
}
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const form = document.querySelector("#project-form");
const status = document.querySelector("#form-status");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent("New project enquiry — Kioo Studio");
    const body = encodeURIComponent(
      "Hello Kioo Studio,\n\nI'd like to enquire about your services.\n\n" +
      "Name: " + (data.get("name") || "") + "\n" +
      "Business / idea: " + (data.get("business") || "") + "\n" +
      "What I need: " + (data.get("need") || "") + "\n" +
      "Budget: " + (data.get("budget") || "Not sure yet") + "\n" +
      "Details: " + (data.get("details") || "Not provided") + "\n\n" +
      "Please let me know the next steps."
    );
    if (status) status.textContent = "Your email app should open with the enquiry ready to review. Add the studio's confirmed email address before launch.";
    window.location.href = "mailto:hello@styledkid.co.ke?subject=" + subject + "&body=" + body;
  });
}