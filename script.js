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
const submitEnquiryButton = document.querySelector("#submit-enquiry");
const detailsField = document.querySelector("#details");
const detailsCount = document.querySelector("#details-count");

if (form && preview && status) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = [
      "Hello Kioo Studio,",
      "",
      "I'd like to enquire about your services.",
      "",
      "Name: " + (data.get("name") || ""),
      "Email: " + (data.get("email") || ""),
      "Business / idea: " + (data.get("business") || ""),
      "What I need: " + (data.get("need") || ""),
      "Budget: " + (data.get("budget") || "Not sure yet"),
      "Details: " + (data.get("details") || "Not provided"),
      "",
      "Please let me know the next steps."
    ].join("\n");
    preview.value = message;
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending enquiry…";
    }
    status.textContent = "Sending your enquiry securely through our form provider…";
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      business: String(data.get("business") || "").trim(),
      service: String(data.get("need") || "").trim(),
      budget: String(data.get("budget") || "Not sure yet").trim(),
      message,
      _subject: "New Kioo Studio enquiry",
      _gotcha: ""
    };
    try {
      const response = await fetch("https://formsubmit.app/f/6jnzxw4btk", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error((result && result.error && result.error.message) || "The form provider did not accept the enquiry.");
      }
      status.textContent = "Thank you — your enquiry has been submitted. If you don't hear back, please contact us on WhatsApp.";
      form.reset();
      if (detailsCount) detailsCount.textContent = "0 / 800 characters";
      if (submitButton) submitButton.textContent = "Enquiry sent ✓";
    } catch (error) {
      status.textContent = "We couldn't confirm your enquiry was sent. Please try again or use WhatsApp below. " + (error && error.message ? error.message : "");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Try sending again ↗";
      }
    }
  });
}
const emailButton = document.querySelector("#email-enquiry");
if (emailButton && preview && status) {
  emailButton.addEventListener("click", () => {
    const subject = "Kioo Studio enquiry";
    const body = preview.value;
    window.location.href = "mailto:doreennkonge81@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    status.textContent = "Your email app should open with the enquiry addressed to the studio. Review it and press Send to deliver it.";
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
