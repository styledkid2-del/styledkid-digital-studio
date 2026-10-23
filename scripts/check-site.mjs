import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const htmlFiles = ["index.html", "services.html", "work.html", "about.html", "packages.html", "resources.html", "contact.html", "privacy.html", "404.html"];
const errors = [];
const pass = (message) => console.log("PASS  " + message);
const fail = (message) => errors.push(message);
const pages = new Map();

for (const file of htmlFiles) {
  const fullPath = resolve(root, file);
  if (!existsSync(fullPath)) {
    fail("Missing required page: " + file);
    continue;
  }

  const html = readFileSync(fullPath, "utf8");
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
  pages.set(file, { html, ids: new Set(ids) });

  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) fail(file + ": duplicate ID(s): " + [...new Set(duplicates)].join(", "));
  else pass(file + ": no duplicate IDs");

  if (!/<title>\s*[^<]+\s*<\/title>/i.test(html)) fail(file + ": missing or empty page title");
  else pass(file + ": page title is present");
  if (!/<meta\s+name=["']description["']\s+content=["'][^"']+["']/i.test(html)) fail(file + ": missing meta description");
  else pass(file + ": meta description is present");
  if (!/<h1\b/i.test(html)) fail(file + ": missing main heading (h1)");
  else pass(file + ": main heading is present");

  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    const value = match[1].trim();
    if (!value || /^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(value)) continue;
    const [pathAndQuery, fragment] = value.split("#", 2);
    const targetPath = (pathAndQuery || "").split("?")[0];
    const routeFiles = {
      "/": "index.html", "/services": "services.html", "/work": "work.html",
      "/about": "about.html", "/packages": "packages.html", "/contact": "contact.html",
      "/resources": "resources.html", "/website-care": "website-care.html",
      "/privacy": "privacy.html", "/cookie-policy": "cookie-policy.html", "/terms": "terms.html",
      "/index.html": "index.html", "/services.html": "services.html", "/work.html": "work.html",
      "/about.html": "about.html", "/packages.html": "packages.html", "/contact.html": "contact.html",
      "/resources.html": "resources.html", "/website-care.html": "website-care.html",
      "/privacy.html": "privacy.html", "/cookie-policy.html": "cookie-policy.html", "/terms.html": "terms.html"
    };
    const targetFile = targetPath.startsWith("/") ? routeFiles[targetPath] : (targetPath || file);
    const localPath = targetFile || targetPath;
    if (targetPath && !existsSync(resolve(root, localPath))) {
      fail(file + ": missing local asset/link target \"" + value + "\");
      continue;
    }
    if (fragment && targetFile && pages.has(targetFile) && !pages.get(targetFile).ids.has(decodeURIComponent(fragment))) {
      fail(file + ": link \"" + value + "\" points to missing ID #" + fragment + " in " + targetFile);
    }
  }

  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
      pass(file + ": valid JSON-LD block");
    } catch (error) {
      fail(file + ": invalid JSON-LD: " + error.message);
    }
  }
}

// Validate all local anchor links once every page's IDs have been collected.
for (const [file, page] of pages) {
  for (const match of page.html.matchAll(/\bhref=["']([^"']*#[^"']+)["']/g)) {
    const value = match[1].trim();
    if (/^(?:https?:|\/\/)/i.test(value)) continue;
    const [pathAndQuery, fragment] = value.split("#", 2);
    const targetPath = (pathAndQuery || "").split("?")[0];
    const routeFiles = {
      "/": "index.html", "/services": "services.html", "/work": "work.html",
      "/about": "about.html", "/packages": "packages.html", "/contact": "contact.html",
      "/resources": "resources.html", "/website-care": "website-care.html",
      "/privacy": "privacy.html", "/cookie-policy": "cookie-policy.html", "/terms": "terms.html"
    };
    const targetFile = targetPath.startsWith("/") ? routeFiles[targetPath] : (targetPath || file);
    if (!pages.has(targetFile)) continue;
    if (!pages.get(targetFile).ids.has(decodeURIComponent(fragment))) {
      fail(file + ": link \"" + value + "\" points to missing ID #" + fragment + " in " + targetFile);
    }
  }
}

const index = pages.get("index.html")?.html ?? "";
const contact = pages.get("contact.html")?.html ?? "";
const jsPath = resolve(root, "script.js");
const cssPath = resolve(root, "styles.css");
const js = existsSync(jsPath) ? readFileSync(jsPath, "utf8") : "";
const css = existsSync(cssPath) ? readFileSync(cssPath, "utf8") : "";

for (const id of ["project-form", "form-status", "enquiry-output", "enquiry-preview", "email-enquiry", "whatsapp-enquiry", "copy-enquiry", "download-enquiry", "details", "details-count", "main-nav", "year"]) {
  if (index.includes('id="' + id + '"') && !js.includes(id)) fail("script.js is missing an expected interaction/reference for #" + id);
}

if (!index.includes('id="project-form"') || !contact.includes('id="project-form"') || !js.includes('querySelector("#project-form")')) {
  fail("Homepage/contact enquiry form wiring is missing");
} else pass("Homepage and contact enquiry forms are wired to the shared JavaScript handler");

for (const id of ["form-status", "enquiry-output", "enquiry-preview", "email-enquiry", "whatsapp-enquiry", "copy-enquiry", "download-enquiry"]) {
  if (!contact.includes('id="' + id + '"')) fail("contact.html is missing expected fallback element #" + id);
}

const sitemapPath = resolve(root, "sitemap.xml");
const robotsPath = resolve(root, "robots.txt");
if (existsSync(sitemapPath)) {
  const sitemap = readFileSync(sitemapPath, "utf8");
  for (const page of ["/services</loc>", "/work</loc>", "/about</loc>", "/packages</loc>", "/contact</loc>", "/privacy</loc>"]) {
    if (!sitemap.includes(page)) fail("sitemap.xml is missing clean URL " + page.replace("</loc>", ""));
  }
  pass("Sitemap includes the dedicated studio pages");
} else fail("Missing sitemap.xml");

if (existsSync(robotsPath) && readFileSync(robotsPath, "utf8").includes("sitemap.xml")) pass("robots.txt points crawlers to sitemap.xml");
else fail("robots.txt is missing or does not reference sitemap.xml");

if (!/href=["'](?:\.\/)?styles\.css(?:\?[^"']*)?["']/i.test(index) || !css.length) fail("Stylesheet link or styles.css is missing");
else pass("Stylesheet is present");
if (!/href=["'](?:\.\/)?favicon\.svg(?:\?[^"']*)?["']/i.test(index) || !existsSync(resolve(root, "favicon.svg"))) fail("Favicon reference or favicon.svg is missing");
else pass("Favicon is present");

const workflowDir = resolve(root, ".github/workflows");
if (!existsSync(workflowDir)) {
  fail("Missing .github/workflows directory");
} else {
  const workflowFiles = readdirSync(workflowDir).filter((file) => file.endsWith(".yml") || file.endsWith(".yaml"));
  if (!workflowFiles.length) fail("No GitHub Actions workflow files found");
  else pass("Found " + workflowFiles.length + " GitHub Actions workflow file(s)");
}

if (errors.length) {
  console.error("\nSite checks failed:");
  for (const error of errors) console.error("- " + error);
  process.exitCode = 1;
} else {
  console.log("\nAll static site checks passed.");
}
