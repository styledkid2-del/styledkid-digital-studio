const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");

if (nav) {
  // Mark the current page for assistive technology and make navigation easier to scan.
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  nav.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#") && href.split("?")[0].split("#")[0] === currentPage) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if (menuButton && nav) {
  const closeMenu = () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
      menuButton.focus();
    }
  });
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

if (form && preview && status) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (String(data.get("_gotcha") || "").trim()) return;
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
    status.classList.remove("is-error", "is-success");
    status.classList.add("is-pending");
    status.textContent = "Sending your enquiry securely through our form provider…";
    // FormSubmit accepts native FormData and returns a JSON acknowledgement.
    // Preserve the visible form fields, while adding the composed enquiry and spam-check timestamp.
    const payload = new FormData(form);
    payload.set("name", String(data.get("name") || "").trim());
    payload.set("email", String(data.get("email") || "").trim());
    payload.set("business", String(data.get("business") || "").trim());
    payload.delete("need");
    payload.set("service", String(data.get("need") || "").trim());
    payload.set("budget", String(data.get("budget") || "Not sure yet").trim());
    payload.set("message", message);
    payload.set("_subject", "New Kioo Studio enquiry");
    // Keep the timestamp created when the form page loaded so the spam timing check is meaningful.
    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 15000);
      let response;
      let result;
      try {
        response = await fetch("https://formsubmit.app/f/6jnzxw4btk", {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: payload,
          signal: controller.signal
        });
        result = await response.json();
      } finally {
        window.clearTimeout(timeoutId);
      }
      if (!response.ok || !result || result.ok !== true) {
        throw new Error((result && result.error && result.error.message) || "The form provider did not confirm receipt.");
      }
      status.classList.remove("is-pending", "is-error");
      status.classList.add("is-success");
      status.textContent = "FormSubmit confirmed your submission, but this does not confirm the notification email reached the studio. We aim to reply by email within 2 business days. If you have not heard back, contact us on WhatsApp.";
      form.reset();
      if (output) output.hidden = true;
      if (detailsCount) detailsCount.textContent = "0 / 800 characters";
      if (submitButton) submitButton.textContent = "Enquiry sent ✓";
    } catch (error) {
      if (output) output.hidden = false;
      status.classList.remove("is-pending", "is-success");
      status.classList.add("is-error");
      status.textContent = error && error.name === "AbortError"
        ? "The form provider took too long to respond. We couldn't confirm delivery. Your details are still available below—try again or use email or WhatsApp."
        : "We couldn't confirm your enquiry was sent. Your details are still available below—try again or use email or WhatsApp to send them.";
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

if (form) {
  const renderedAtField = form.querySelector('input[name="_ts"]');
  if (renderedAtField) renderedAtField.value = String(Date.now());
}

if (detailsField && detailsCount) {
  const updateCount = () => {
    detailsCount.textContent = detailsField.value.length + " / 800 characters";
  };
  detailsField.addEventListener("input", updateCount);
  updateCount();
}

document.querySelectorAll("[data-enquiry-value]").forEach(function (link) {
  link.addEventListener("click", function () {
    const field = document.getElementById("need");
    const value = link.getAttribute("data-enquiry-value");
    if (field && value) field.value = value;
  });
});

/* Let package and service links open the contact page with the right choice selected. */
if (form) {
  const requestedService = new URLSearchParams(window.location.search).get("service");
  const serviceField = document.getElementById("need");
  if (requestedService && serviceField) {
    const normaliseService = (value) => value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
    const requested = normaliseService(requestedService);
    const matchingOption = Array.from(serviceField.options).find((option) => {
      const label = normaliseService(option.text);
      return label === requested || label.startsWith(requested) || requested.startsWith(label);
    });
    if (matchingOption) serviceField.value = matchingOption.value;
  }
}


/* Keep a direct-contact route available, but never cover the enquiry form while it is in view. */
const floatingWhatsApp = document.createElement("a");
floatingWhatsApp.className = "floating-whatsapp";
floatingWhatsApp.href = "https://wa.me/254740354169";
floatingWhatsApp.target = "_blank";
floatingWhatsApp.rel = "noopener noreferrer";
floatingWhatsApp.setAttribute("aria-label", "Chat with Kioo Studio on WhatsApp");
floatingWhatsApp.innerHTML = 'Chat on WhatsApp <span aria-hidden="true">↗</span>';
document.body.append(floatingWhatsApp);

const enquiryForm = document.querySelector("#project-form, .contact-form");
if (enquiryForm && "IntersectionObserver" in window) {
  const contactVisibility = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      floatingWhatsApp.hidden = entry.isIntersecting;
    });
  }, { threshold: 0.08 });
  contactVisibility.observe(enquiryForm);
}
