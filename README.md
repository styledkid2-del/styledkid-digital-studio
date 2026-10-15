# Kioo Studio website

A mobile-first static website concept for an AI-assisted digital studio serving small businesses in Kenya.

## Website files
- `index.html` — landing page, service cards, starter packages and enquiry form
- `privacy.html` — plain-language notice explaining the static form's current behaviour
- `404.html` — branded not-found page
- `styles.css` — responsive visual design and mobile navigation styles
- `script.js` — accessible mobile menu, enquiry email submission through FormSubmit, WhatsApp handoff, enquiry preview, copy fallback, optional native device sharing, and local text-file download
- `favicon.svg` — simple brand icon
- `.github/workflows/pages.yml` — GitHub Pages deployment workflow

## Hosting
The live site is deployed on Vercel and connected to this repository's `main` branch: [https://kioo-studio.vercel.app](https://kioo-studio.vercel.app). Updates pushed to `main` can trigger a new deployment. The site is plain HTML, CSS and JavaScript and does not require a build command.

The GitHub Pages workflow remains in the repository from the earlier setup, but GitHub Pages is not the current production host.

## Before accepting customers
- **Confirm the business name.** “Kioo Studio” is a working name and should be checked before investing in branding.
- **Activate and test enquiry delivery.** Email is configured through FormSubmit to `doreennkonge81@gmail.com`; the recipient must open FormSubmit’s activation email before normal delivery can be relied on. The WhatsApp handoff is configured for `+254740354169` and requires the visitor to review and press Send in WhatsApp. Do not claim delivery is verified until both paths have been tested end-to-end.
- Review package prices, deliverables and turnaround times before advertising them.
- Confirm which services you can reliably deliver, and do not promise custom AI features or integrations that have not been built.
- Test all links, the enquiry form, mobile layout and keyboard navigation on the published version.
- Confirm the privacy notice matches any real services, tools or data collection added before launch.

## Domain safety
The existing `styledkid.co.ke` WordPress site is a separate project. Do not overwrite it or change DNS until the owner decides whether to keep the current website and use a subdomain such as `studio.styledkid.co.ke`, or intentionally replace the root-domain website. A root domain cannot point to both hosting destinations at once.

## Costs and limits
The static files and GitHub Pages hosting can be free. A custom domain is already owned by the user, but email, paid tools, advertising and third-party services may cost money. No OpenAI API key, paid AI integration, customer database, booking system or payment processing is included in this starter website.
