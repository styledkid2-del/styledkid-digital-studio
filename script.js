/* Privacy-notice-covered Vercel Web Analytics. Enable Web Analytics in the Vercel dashboard to collect events. */
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
const analyticsScript = document.createElement("script");
analyticsScript.defer = true;
analyticsScript.src = "/_vercel/insights/script.js";
analyticsScript.onerror = () => {};
document.head.append(analyticsScript);

function trackStudioEvent(name, data = {}) {
  try {
    if (typeof window.va === "function") window.va("event", { name, data });
  } catch {
    // Analytics must never interrupt an enquiry.
  }
}

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

/* Guided service picker: recommend a realistic starting point without promising a quote. */
const pickerForm = document.querySelector("#service-picker-form");
if (pickerForm) {
  pickerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const goal = pickerForm.querySelector('input[name="picker-goal"]:checked')?.value || "unsure";
    const budget = pickerForm.querySelector('input[name="picker-budget"]:checked')?.value || "unsure";
    const result = document.querySelector("#picker-result");
    const title = document.querySelector("#picker-result-title");
    const copy = document.querySelector("#picker-result-copy");
    const link = document.querySelector("#picker-result-link");
    const choices = {
      brand: { service: "Brand basics", package: "The Essentials", price: "The Essentials starts at KSh 1,500.", desc: "A clearer business bio, offer wording and brand direction can help you make a more confident first impression." },
      social: { service: "Social content", package: "The Content Kit", price: "The Content Kit starts at KSh 3,500.", desc: "Start with practical post ideas, captions and content direction you can use to show up more consistently." },
      website: { service: "Digital launch kit / simple website", package: "The Digital Starter", price: "The Digital Starter starts at KSh 7,500.", desc: "A focused one-page website with a clear contact path may be a good fit when people need one place to understand your business." },
      "custom-website": { service: "Website / web development", package: "A tailored website quote", price: "Custom website projects are quoted after we understand the scope.", desc: "Tell us about the pages, features and customer journey you have in mind. We’ll confirm what we can deliver, the timeline and a tailored price before work begins. The Digital Starter price applies only to the defined one-page offer." },
      unsure: { service: "I'm not sure yet", package: "Let's discuss the scope first", price: "You do not need to choose a package yet.", desc: "Tell us what your business does, what feels difficult and what you can comfortably invest. We can help you choose a sensible first step." }
    };
    let choice = choices[goal];
    let note = choice.price;
    if (budget === "under" && goal !== "brand" && goal !== "unsure" && goal !== "custom-website") {
      choice = choices.brand;
      note = "With a budget under KSh 2,000, consider starting with the essentials (from KSh 1,500) and building from there.";
    } else if (budget === "mid" && goal === "website") {
      note = "A full Digital Starter begins at KSh 7,500, above this budget. We can discuss a smaller first step or help you plan toward it.";
    } else if (budget === "under" && goal === "unsure") {
      choice = choices.brand;
      note = "The Essentials starts at KSh 1,500 and may be a manageable first step while you clarify your wider goals.";
    }
    title.textContent = choice.package;
    copy.textContent = choice.desc + " " + note;
    link.href = "contact.html?service=" + encodeURIComponent(choice.service) + "&budget=" + encodeURIComponent(budget === "under" ? "Under KSh 2,000" : budget === "mid" ? "KSh 2,000–5,000" : budget === "high" ? "KSh 5,000–10,000" : "Not sure yet") + "#project-form";
    result.hidden = false;
    trackStudioEvent("Service Picker Completed", { goal, budget, recommendation: choice.service });
    result.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
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

// Give the form a page-load timestamp for the provider’s spam-timing check.
const formTimestamp = form?.querySelector('input[name="_ts"]');
if (formTimestamp) formTimestamp.value = String(Date.now());

if (form && preview && status) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (String(data.get("_gotcha") || "").trim()) return;
    const referenceDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const reference = "KIOO-" + referenceDate + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    const message = [
      "Hello Kioo Studio,",
      "",
      "I'd like to enquire about your services.",
      "",
      "Enquiry reference: " + reference,
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
      status.textContent = "FormSubmit confirmed receipt. Your enquiry reference is " + reference + ". Keep it for your records. This does not confirm the notification email reached the studio. We aim to reply by email within 2 business days; if you have not heard back, contact us on WhatsApp.";
      form.reset();
      const timestampField = form.querySelector('input[name="_ts"]');
      if (timestampField) timestampField.value = String(Date.now());
      if (output) output.hidden = true;
      if (detailsCount) detailsCount.textContent = "0 / 800 characters";
      trackStudioEvent("Enquiry Submitted", { service: String(data.get("need") || "unspecified") });
      if (submitButton) submitButton.textContent = "Enquiry sent ✓";
    } catch (error) {
      if (output) output.hidden = false;
      status.classList.remove("is-pending", "is-success");
      status.classList.add("is-error");
      trackStudioEvent("Enquiry Submit Error");
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
    const requestedBudget = new URLSearchParams(window.location.search).get("budget");
  const budgetField = document.getElementById("budget");
  if (requestedBudget && budgetField) {
    const normaliseBudget = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
    const requested = normaliseBudget(requestedBudget);
    const matchingBudget = Array.from(budgetField.options).find((option) => normaliseBudget(option.text) === requested);
    if (matchingBudget) budgetField.value = matchingBudget.value;
  }
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
floatingWhatsApp.setAttribute("aria-label", "Chat on WhatsApp");
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


/* Track enquiry actions without collecting names, email addresses or enquiry text. */
document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  const href = link.getAttribute("href") || "";
  const label = (link.getAttribute("data-enquiry-value") || link.textContent || link.getAttribute("aria-label") || "unlabelled")
    .trim().replace(/\s+/g, " ").slice(0, 80);
  if (href.startsWith("https://wa.me/")) {
    trackStudioEvent("WhatsApp Click", { placement: link.classList.contains("floating-whatsapp") ? "floating" : "page", label });
  } else if (href.startsWith("mailto:")) {
    trackStudioEvent("Email Click", { placement: "page" });
  } else if (href.includes("contact.html") || href === "#contact" || href === "#project-form") {
    trackStudioEvent("Enquiry CTA Click", { label, destination: href.startsWith("#") ? "homepage_form" : "contact_page" });
  }
});
document.addEventListener("change", (event) => {
  if (event.target && event.target.id === "need" && event.target.value) {
    trackStudioEvent("Service Selected", { service: event.target.value });
  }
});
