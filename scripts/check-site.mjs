import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const htmlFiles = ["index.html", "privacy.html", "404.html"];
const errors = [];
const pass = (message) => console.log(`PASS  ${message}`);
const fail = (message) => errors.push(message);

for (const file of htmlFiles) {
  const fullPath = resolve(root, file);
  if (!existsSync(fullPath)) {
    fail(`Missing required page: ${file}`);
    continue;
  }
  const html = readFileSync(fullPath, "utf8");
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) fail(`${file}: duplicate id(s): ${[...new Set(duplicates)].join(", ")}`);
  else pass(`${file}: no duplicate IDs`);

  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    const value = match[1].trim();
    if (!value || /^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(value)) continue;
    const target = value.split("#")[0].split("?")[0];
    if (!target) continue;
    if (!existsSync(resolve(root, target))) fail(`${file}: missing local asset/link target "${value}"`);
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

const index = existsSync(resolve(root, "index.html")) ? readFileSync(resolve(root, "index.html"), "utf8") : "";
const js = existsSync(resolve(root, "script.js")) ? readFileSync(resolve(root, "script.js"), "utf8") : "";
const css = existsSync(resolve(root, "styles.css")) ? readFileSync(resolve(root, "styles.css"), "utf8") : "";

for (const id of ["project-form", "form-status", "enquiry-output", "enquiry-preview", "email-enquiry", "whatsapp-enquiry", "copy-enquiry", "download-enquiry", "details", "details-count", "main-nav", "year"]) {
  if (index.includes(`id="${id}"`) && !js.includes(`#${id}`) && id !== "main-nav") {
    fail(`script.js does not reference expected interactive element #${id}`);
  }
}
for (const id of ["project-form", "form-status", "enquiry-output", "enquiry-preview", "email-enquiry", "whatsapp-enquiry", "copy-enquiry", "download-enquiry", "details", "details-count", "year"]) {
  if (index.includes(`id="${id}"`) && !js.includes(id)) fail(`script.js is missing expected interaction for #${id}`);
}
if (!index.includes('id="project-form"') || !js.includes('querySelector("#project-form")')) fail("Enquiry form wiring is missing");
else pass("Enquiry form markup and JavaScript hook are present");
if (!index.includes('href="styles.css"') || !css.length) fail("Stylesheet link or styles.css is missing");
else pass("Stylesheet is present");
if (!index.includes('href="favicon.svg"') || !existsSync(resolve(root, "favicon.svg"))) fail("Favicon reference or favicon.svg is missing");
else pass("Favicon is present");

const workflowFiles = readdirSync(resolve(root, ".github/workflows")).filter((file) => file.endsWith(".yml") || file.endsWith(".yaml"));
if (!workflowFiles.length) fail("No GitHub Actions workflow files found");
else pass(`Found ${workflowFiles.length} GitHub Actions workflow file(s)`);

if (errors.length) {
  console.error("\nSite checks failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("\nAll static site checks passed.");
}
