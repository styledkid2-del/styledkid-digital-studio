# Kioo Studio website

A mobile-first static website concept for an AI-assisted digital studio serving small businesses in Kenya.

## Website files
- `index.html` — landing page, service cards, starter packages and enquiry form
- `privacy.html` — plain-language notice explaining the static form's current behaviour
- `404.html` — branded not-found page
- `styles.css` — responsive visual design and mobile navigation styles
- `script.js` — menu behaviour and enquiry email draft
- `favicon.svg` — simple brand icon
- `.github/workflows/pages.yml` — GitHub Pages deployment workflow

## Hosting
This project is plain HTML, CSS and JavaScript; it does not require a build command or paid hosting.

1. Open **Settings → Pages** in this repository.
2. Set the source to **GitHub Actions**.
3. Open **Actions** and check the deployment workflow.
4. After a successful run, use the Pages URL shown by GitHub to test the site.

## Before accepting customers
- **Confirm the business name.** “Kioo Studio” is a working name and should be checked before investing in branding.
- **Confirm the contact address.** The enquiry form currently opens an email draft addressed to `hello@styledkid.co.ke`. Verify that this mailbox exists and can receive messages, or change the address in `script.js`. The form does not send email automatically and this static site has no form-processing backend.
- Review package prices, deliverables and turnaround times before advertising them.
- Confirm which services you can reliably deliver, and do not promise custom AI features or integrations that have not been built.
- Test all links, the enquiry form, mobile layout and keyboard navigation on the published version.
- Confirm the privacy notice matches any real services, tools or data collection added before launch.

## Domain safety
The existing `styledkid.co.ke` WordPress site is a separate project. Do not overwrite it or change DNS until the owner decides whether to keep the current website and use a subdomain such as `studio.styledkid.co.ke`, or intentionally replace the root-domain website. A root domain cannot point to both hosting destinations at once.

## Costs and limits
The static files and GitHub Pages hosting can be free. A custom domain is already owned by the user, but email, paid tools, advertising and third-party services may cost money. No OpenAI API key, paid AI integration, customer database, booking system or payment processing is included in this starter website.
