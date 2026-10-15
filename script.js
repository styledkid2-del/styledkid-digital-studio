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
const shareButton = document.querySelector("#share-enquiry");
const whatsappButton = document.querySelector("#whatsapp-enquiry");
const downloadButton = document.querySelector("#download-enquiry");
const detailsField = document.querySelector("#details");
const detailsCount = document.querySelector("#details-count");

if (form && output && preview) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
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
    if (submitButton) submitButton.disabled = true;
    if (status) status.textContent = "Sending your enquiry by email…";
    const payload = {
      name: data.get("name") || "",
      business: data.get("business") || "",
      service: data.get("need") || "",
      budget: data.get("budget") || "Not sure yet",
      details: data.get("details") || "Not provided",
      message: preview.value,
      _subject: "New Kioo Studio enquiry",
      _template: "table",
      _captcha: "false",
      _honey: ""
    };
    try {
      const response = await fetch("https://formsubmit.co/ajax/doreennkonge81@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || result.success === false || result.success === "false") {
        throw new Error("Email service did not confirm the submission.");
      }
      if (status) status.textContent = "Email service accepted the enquiry request. If this is the first submission, check the studio inbox for FormSubmit's activation email. You can also send the message on WhatsApp below.";
    } catch {
      if (status) status.textContent = "Email delivery could not be confirmed. Use Send on WhatsApp below, or copy/download the message as a backup.";
    } finally {
      if (submitButton) submitButton.disabled = false;
      output.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
    }
  });
}

if (whatsappButton && preview && status) {
  whatsappButton.addEventListener("click", () => {
    const phone = "254740354169";
    const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(preview.value);
    window.open(url, "_blank", "noopener,noreferrer");
    status.textContent = "WhatsApp opened with your enquiry. Review the message and tap Send in WhatsApp to deliver it.";
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

if (shareButton && preview && status) {
  if (typeof navigator.share === "function") {
    shareButton.hidden = false;
    shareButton.addEventListener("click", async () => {
      try {
        await navigator.share({
          title: "Kioo Studio enquiry",
          text: preview.value
        });
        status.textContent = "Your device opened its share options. Check the app you chose to finish sending the enquiry.";
      } catch (error) {
        if (error && error.name !== "AbortError") {
          status.textContent = "Sharing wasn't available. You can copy the enquiry or download it instead.";
        }
      }
    });
  }
}

if (downloadButton && preview && status) {
  downloadButton.addEventListener("click", () => {
    const file = new Blob([preview.value + "\n"], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kioo-studio-enquiry.txt";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    status.textContent = "Your enquiry file has been prepared for download. Remember, it has not been sent to the studio.";
  });
}

if (detailsField && detailsCount) {
  const updateCount = () => {
    detailsCount.textContent = detailsField.value.length + " / 800 characters";
  };
  detailsField.addEventListener("input", updateCount);
  updateCount();
}

if (menuButton && nav) {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
      menuButton.focus();
    }
  });
}


document.querySelectorAll("[data-enquiry-value]").forEach(function (link) {
  link.addEventListener("click", function () {
    const field = document.getElementById("need");
    const value = link.getAttribute("data-enquiry-value");
    if (field && value) field.value = value;
  });
});
