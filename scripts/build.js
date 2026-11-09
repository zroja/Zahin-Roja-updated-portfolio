const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const required = ["index.html", "404.html", "src/styles.css", "src/app.js"];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length > 0) {
  console.error(`Build failed. Missing required files: ${missing.join(", ")}`);
  process.exit(1);
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const localRefs = [...html.matchAll(/(?:src|href)\s*=\s*"(src\/[^"]+)"/g)].map((m) => m[1]);
const brokenRefs = localRefs.filter((ref) => !fs.existsSync(path.join(root, decodeURI(ref))));
if (brokenRefs.length > 0) {
  console.error(`Build failed. index.html references missing files: ${brokenRefs.join(", ")}`);
  process.exit(1);
}

console.log(`Build OK. Checked ${required.length} required files and ${localRefs.length} local references.`);
