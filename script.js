/* Optional analytics load only after a visitor explicitly accepts it. */
const COOKIE_CONSENT_KEY = "kioo-cookie-consent";
let cookieConsent = "unset";

try {
  cookieConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY) || "unset";
} catch {
  // If storage is unavailable, keep consent in memory for this page only.
}

function loadOptionalAnalytics() {
  if (cookieConsent !== "accepted" || document.querySelector('script[data-kioo-analytics="true"]')) return;
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  const analyticsScript = document.createElement("script");
  analyticsScript.defer = true;
  analyticsScript.dataset.kiooAnalytics = "true";
  analyticsScript.src = "/_vercel/insights/script.js";
  analyticsScript.onerror = () => {};
  document.head.append(analyticsScript);
}

function saveCookieConsent(choice) {
  cookieConsent = choice;
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, choice);
  } catch {
    // Consent still applies for this page view if storage is unavailable.
  }
  if (choice === "accepted") loadOptionalAnalytics();
}

function initialiseCookieConsent() {
  if (document.querySelector(".cookie-consent")) return;
  const panel = document.createElement("section");
  panel.className = "cookie-consent";
  panel.setAttribute("aria-label", "Cookie and analytics choices");
  panel.setAttribute("aria-describedby", "cookie-consent-copy");
  panel.innerHTML = `
    <div class="cookie-consent-copy">
      <p class="cookie-consent-eyebrow">A SMALL CHOICE, WITH CONTROL</p>
      <h2>Your privacy matters</h2>
      <p id="cookie-consent-copy">Optional analytics helps us understand which pages are useful. It stays off unless you allow it. Change your choice anytime in Cookie settings. <a href="/cookie-policy">Cookie notice</a>.</p>
    </div>
    <div class="cookie-consent-actions">
      <button type="button" class="cookie-consent-reject">Reject optional</button>
      <button type="button" class="cookie-consent-accept">Allow analytics</button>
    </div>`;
  const settings = document.createElement("button");
  settings.type = "button";
  settings.className = "cookie-settings-trigger";
  settings.textContent = "Cookie settings";
  settings.setAttribute("aria-label", "Reopen cookie and analytics choices");
  settings.addEventListener("click", () => {
    panel.hidden = false;
    panel.querySelector(".cookie-consent-accept").focus();
  });
  panel.querySelector(".cookie-consent-accept").addEventListener("click", () => {
    saveCookieConsent("accepted");
    panel.hidden = true;
    settings.hidden = false;
  });
  panel.querySelector(".cookie-consent-reject").addEventListener("click", () => {
    saveCookieConsent("rejected");
    panel.hidden = true;
    settings.hidden = false;
  });
  document.body.append(panel);
  const footerSettingsHost =
    document.querySelector(".site-footer .footer-links-group:last-child") ||
    document.querySelector(".site-footer .footer-bottom") ||
    document.querySelector(".site-footer");
  if (footerSettingsHost) {
    footerSettingsHost.append(settings);
  } else {
    settings.hidden = true;
  }
  if (cookieConsent === "unset") {
    panel.hidden = false;
    settings.hidden = true;
  } else {
    panel.hidden = true;
    settings.hidden = false;
    if (cookieConsent === "accepted") loadOptionalAnalytics();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialiseCookieConsent, { once: true });
} else {
  initialiseCookieConsent();
}

function trackStudioEvent(name, data = {}) {
  if (cookieConsent !== "accepted") return;
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
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  nav.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href.startsWith("#")) {
      link.removeAttribute("aria-current");
      return;
    }
    let linkPath = "";
    try {
      linkPath = new URL(href, window.location.origin).pathname.replace(/\/+$/, "") || "/";
    } catch {
      link.removeAttribute("aria-current");
      return;
    }
    if (linkPath === currentPath) {
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

  // Close the mobile menu when a visitor clicks outside it.
  document.addEventListener("click", (event) => {
    if (
      nav.classList.contains("open") &&
      !nav.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // Avoid carrying an open mobile-menu state across desktop/mobile resizing.
  const mobileNavigation = window.matchMedia("(max-width: 680px)");
  const resetNavigationOnResize = (event) => {
    if (!event.matches && nav.classList.contains("open")) closeMenu();
  };
  if (typeof mobileNavigation.addEventListener === "function") {
    mobileNavigation.addEventListener("change", resetNavigationOnResize);
  } else if (typeof mobileNavigation.addListener === "function") {
    mobileNavigation.addListener(resetNavigationOnResize);
  }
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
    link.href = "/contact?service=" + encodeURIComponent(choice.service) + "&budget=" + encodeURIComponent(budget === "under" ? "Under KSh 2,000" : budget === "mid" ? "KSh 2,000–5,000" : budget === "high" ? "KSh 5,000–10,000" : "Not sure yet") + "#project-form";
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
      "Preferred reply method: " + (data.get("reply_preference") || "No preference"),
      "WhatsApp number for reply (if provided): " + (data.get("whatsapp_number") || "Not provided"),
      "Audiences, languages, access needs, cultural details or contact preferences: " + (data.get("audience_considerations") || "Not provided"),
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
        response = await fetch("https://formsubmit.app/f/92dess2wnx", {
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
      status.textContent = "FormSubmit confirmed receipt. Your enquiry reference is " + reference + ". Keep it for your records. This does not confirm the notification email reached the studio. We aim to reply within 2 business days using your preferred contact method. If you have not heard back, contact us by email or WhatsApp.";
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
    window.location.href = "mailto:hello.kioostudio@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
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
floatingWhatsApp.innerHTML = '<span class="floating-whatsapp-label">Chat on WhatsApp</span><svg class="floating-whatsapp-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.1 11.8a8.1 8.1 0 0 1-12 7.1L3 20l1.2-4.9a8.1 8.1 0 1 1 15.9-3.3Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.1 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .3.1.4.4l.7 1.7c.1.2 0 .4-.1.6l-.5.6c-.2.2-.2.3 0 .5.5.8 1.1 1.4 2 1.9.2.1.4.1.5-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.3.2.5-.1.7-.5 1.2-1.1 1.4-.7.3-1.6.1-2.6-.4-1.4-.7-2.6-1.9-3.3-3.2-.5-.9-.7-1.8-.4-2.5.1-.4.4-.7.7-.9Z" fill="currentColor"/></svg><span class="floating-whatsapp-arrow" aria-hidden="true">↗</span>';
document.body.append(floatingWhatsApp);

const enquiryForm = document.querySelector("#project-form, .contact-form");
const heroSection = document.querySelector(".hero, .inner-hero");
const smallScreenQuery = window.matchMedia("(max-width: 680px)");
let heroIsVisible = Boolean(heroSection);
let enquiryIsVisible = false;

const syncFloatingWhatsApp = () => {
  // Mobile visitors have persistent, non-floating WhatsApp links in the page/footer.
  // On larger screens, keep the floating action away from both the hero artwork and form.
  floatingWhatsApp.hidden = smallScreenQuery.matches || heroIsVisible || enquiryIsVisible;
};

if ("IntersectionObserver" in window && heroSection) {
  const heroVisibility = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { heroIsVisible = entry.isIntersecting; });
    syncFloatingWhatsApp();
  }, { threshold: 0.01 });
  heroVisibility.observe(heroSection);

  if (enquiryForm) {
    const contactVisibility = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { enquiryIsVisible = entry.isIntersecting; });
      syncFloatingWhatsApp();
    }, { threshold: 0.01 });
    contactVisibility.observe(enquiryForm);
  }
} else {
  // If visibility cannot be tracked reliably, prefer the always-available in-page links.
  floatingWhatsApp.hidden = true;
}

if (typeof smallScreenQuery.addEventListener === "function") {
  smallScreenQuery.addEventListener("change", syncFloatingWhatsApp);
} else if (typeof smallScreenQuery.addListener === "function") {
  smallScreenQuery.addListener(syncFloatingWhatsApp);
}
syncFloatingWhatsApp();


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
  } else if (href.startsWith("/contact") || href.includes("contact.html") || href === "#contact" || href === "#project-form") {
    trackStudioEvent("Enquiry CTA Click", { label, destination: href.startsWith("#") ? "homepage_form" : "contact_page" });
  }
});
document.addEventListener("change", (event) => {
  if (event.target && event.target.id === "need" && event.target.value) {
    trackStudioEvent("Service Selected", { service: event.target.value });
  }
});
