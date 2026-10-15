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
const output = document.querySelector("#enquiry-output");
const preview = document.querySelector("#enquiry-preview");
const copyButton = document.querySelector("#copy-enquiry");
const emailButton = document.querySelector("#email-enquiry");
const enquirySubject = "New project enquiry — Kioo Studio";

if (form && output && preview) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    preview.value = [
      "Hello Kioo Studio,",
      "",
      "I'd like to enquire about your services.",
      "",
      "Name: " + (data.get("name") || ""),
      "Business / idea: " + (data.get("business") || ""),
      "What I need: " + (data.get("need") || ""),
      "Budget: " + (data.get("budget") || "Not sure yet"),
      "Details: " + (data.get("details") || "Not provided"),
      "",
      "Please let me know the next steps."
    ].join("\n");
    output.hidden = false;
    if (status) status.textContent = "Your enquiry is prepared below. Copy it or open an email draft after checking the destination address.";
    output.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

if (copyButton && preview && status) {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(preview.value);
      status.textContent = "Enquiry copied. You can paste it into an email or message.";
    } catch {
      preview.focus();
      preview.select();
      status.textContent = "The enquiry is selected. Press Ctrl+C to copy it.";
    }
  });
}

if (emailButton && preview) {
  emailButton.addEventListener("click", () => {
    const subject = encodeURIComponent(enquirySubject);
    const body = encodeURIComponent(preview.value);
    window.location.href = "mailto:hello@styledkid.co.ke?subject=" + subject + "&body=" + body;
  });
}
