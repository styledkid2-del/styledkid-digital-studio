# Kioo Studio website

A mobile-first static website concept for a digital studio serving small businesses in Kenya.

## Website files
- `index.html` — landing page, service cards, starter packages and enquiry form
- `privacy.html` — plain-language notice explaining the enquiry form and third-party processing
- `404.html` — branded not-found page
- `styles.css` — responsive visual design and mobile navigation styles
- `script.js` — accessible mobile menu, FormSubmit enquiry submission, email-app and WhatsApp handoff, copy fallback, optional native device sharing, and local text-file download
- `favicon.svg` — simple brand icon
- `.github/workflows/quality.yml` — automated static-site and JavaScript checks

## Hosting
The production site is deployed on Vercel and connected to this repository's `main` branch: [https://kioo-studio.vercel.app](https://kioo-studio.vercel.app). Updates pushed to `main` can trigger a new deployment. The site is plain HTML, CSS and JavaScript and does not require a build command.

Vercel is the production host. The unused GitHub Pages deployment workflow has been removed so it no longer creates a misleading failed deployment check.

## Before accepting customers
- **Confirm the business name.** “Kioo Studio” is a working name and should be checked before investing in branding.
- **Test enquiry delivery end-to-end.** The primary enquiry button submits the form to FormSubmit at `https://formsubmit.app/f/6jnzxw4btk`. Confirm the FormSubmit notification settings and complete a real test submission before relying on email delivery. Email and WhatsApp remain fallbacks; visitors must press Send in the chosen app.
- Review package prices, deliverables and turnaround times before advertising them.
- Confirm which services can reliably be delivered, and do not promise custom AI features or integrations that have not been built.
- Test all links, the enquiry form, mobile layout and keyboard navigation on the published version.
- Confirm the privacy notice matches any real services, tools or data collection added before launch.

## Domain safety
The existing `styledkid.co.ke` WordPress site is a separate project. Do not overwrite it or change DNS until the owner decides whether to keep the current website and use a subdomain such as `studio.styledkid.co.ke`, or intentionally replace the root-domain website. A root domain cannot point to both hosting destinations at once.

## Costs and limits
The current site is static and can be hosted on Vercel's free tier subject to its current limits. The enquiry form uses FormSubmit as a third-party processing service. No OpenAI API key, paid AI integration, customer database, booking system or payment processing is included in this starter website. Confirm FormSubmit notification settings and test real delivery before launch.
