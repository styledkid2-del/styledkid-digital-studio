# Kioo Studio website

A mobile-first static website concept for an AI-assisted digital studio serving small businesses in Kenya.

## Website files
- `index.html` — landing page, service cards, starter packages and enquiry form
- `privacy.html` — plain-language notice explaining the static form's current behaviour
- `404.html` — branded not-found page
- `styles.css` — responsive visual design and mobile navigation styles
- `script.js` — accessible mobile menu, enquiry preview, copy fallback, and local text-file download
- `favicon.svg` — simple brand icon
- `.github/workflows/pages.yml` — GitHub Pages deployment workflow

## Hosting
The live site is deployed on Vercel and connected to this repository's `main` branch: [https://kioo-studio.vercel.app](https://kioo-studio.vercel.app). Updates pushed to `main` can trigger a new deployment. The site is plain HTML, CSS and JavaScript and does not require a build command.

The GitHub Pages workflow remains in the repository from the earlier setup, but GitHub Pages is not the current production host.

## Before accepting customers
- **Confirm the business name.** “Kioo Studio” is a working name and should be checked before investing in branding.
- **Configure a real enquiry destination before launch.** The current form only prepares an enquiry for copying or downloading; it does not send or store submissions. Choose and test a receiving email, form provider, or backend before advertising the form as a way to contact the studio.
- Review package prices, deliverables and turnaround times before advertising them.
- Confirm which services you can reliably deliver, and do not promise custom AI features or integrations that have not been built.
- Test all links, the enquiry form, mobile layout and keyboard navigation on the published version.
- Confirm the privacy notice matches any real services, tools or data collection added before launch.

## Domain safety
The existing `styledkid.co.ke` WordPress site is a separate project. Do not overwrite it or change DNS until the owner decides whether to keep the current website and use a subdomain such as `studio.styledkid.co.ke`, or intentionally replace the root-domain website. A root domain cannot point to both hosting destinations at once.

## Costs and limits
The static files and GitHub Pages hosting can be free. A custom domain is already owned by the user, but email, paid tools, advertising and third-party services may cost money. No OpenAI API key, paid AI integration, customer database, booking system or payment processing is included in this starter website.
