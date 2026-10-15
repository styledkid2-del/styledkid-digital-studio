import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const htmlFiles = ["index.html", "privacy.html", "404.html"];
const errors = [];
const pass = (message) => console.log(`PASS  ${message}`);
const fail = (message) => errors.push(message);
const pages = new Map();

for (const file of htmlFiles) {
  const fullPath = resolve(root, file);
  if (!existsSync(fullPath)) {
    fail(`Missing required page: ${file}`);
    continue;
  }

  const html = readFileSync(fullPath, "utf8");
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
  pages.set(file, { html, ids: new Set(ids) });

  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) fail(`${file}: duplicate id(s): ${[...new Set(duplicates)].join(", ")}`);
  else pass(`${file}: no duplicate IDs`);

  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    const value = match[1].trim();
    if (!value || /^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(value)) continue;

    const [pathAndQuery, fragment] = value.split("#", 2);
    const targetPath = (pathAndQuery || "").split("?")[0];
    const targetFile = targetPath || file;
    if (targetPath && !existsSync(resolve(root, targetPath))) {
      fail(`${file}: missing local asset/link target "${value}"`);
      continue;
    }

    if (match[0].startsWith("href=") && fragment) {
      const page = pages.get(targetFile);
      if (page && !page.ids.has(decodeURIComponent(fragment))) {
        fail(`${file}: link "${value}" points to missing ID #${fragment} in ${targetFile}`);
      }
    }
  }

  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
      pass(`${file}: valid JSON-LD block`);
    } catch (error) {
      fail(`${file}: invalid JSON-LD: ${error.message}`);
    }
  }
}

// Check local fragment links after all page IDs have been collected.
for (const [file, page] of pages) {
  for (const match of page.html.matchAll(/\bhref=["']([^"']*#[^"']+)["']/g)) {
    const value = match[1].trim();
    if (/^(?:https?:|\/\/)/i.test(value)) continue;
    const [pathAndQuery, fragment] = value.split("#", 2);
    const targetPath = (pathAndQuery || "").split("?")[0];
    const targetFile = targetPath || file;
    if (!pages.has(targetFile)) continue;
    if (!pages.get(targetFile).ids.has(decodeURIComponent(fragment))) {
      fail(`${file}: link "${value}" points to missing ID #${fragment} in ${targetFile}`);
    }
  }
}

const index = pages.get("index.html")?.html ?? "";
const jsPath = resolve(root, "script.js");
const cssPath = resolve(root, "styles.css");
const js = existsSync(jsPath) ? readFileSync(jsPath, "utf8") : "";
const css = existsSync(cssPath) ? readFileSync(cssPath, "utf8") : "";

for (const id of ["project-form", "form-status", "enquiry-output", "enquiry-preview", "email-enquiry", "whatsapp-enquiry", "copy-enquiry", "download-enquiry", "details", "details-count", "main-nav", "year"]) {
  if (index.includes(`id="${id}"`) && !js.includes(id)) {
    fail(`script.js is missing an expected interaction/reference for #${id}`);
  }
}

if (!index.includes('id="project-form"') || !js.includes('querySelector("#project-form")')) fail("Enquiry form wiring is missing");
else pass("Enquiry form markup and JavaScript hook are present");
if (!index.includes('href="styles.css"') || !css.length) fail("Stylesheet link or styles.css is missing");
else pass("Stylesheet is present");
if (!index.includes('href="favicon.svg"') || !existsSync(resolve(root, "favicon.svg"))) fail("Favicon reference or favicon.svg is missing");
else pass("Favicon is present");

const workflowDir = resolve(root, ".github/workflows");
if (!existsSync(workflowDir)) {
  fail("Missing .github/workflows directory");
} else {
  const workflowFiles = readdirSync(workflowDir).filter((file) => file.endsWith(".yml") || file.endsWith(".yaml"));
  if (!workflowFiles.length) fail("No GitHub Actions workflow files found");
  else pass(`Found ${workflowFiles.length} GitHub Actions workflow file(s)`);
}

if (errors.length) {
  console.error("\nSite checks failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("\nAll static site checks passed.");
}
