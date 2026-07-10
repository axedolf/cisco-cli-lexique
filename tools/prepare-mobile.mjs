import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const target = path.join(root, "web");
const files = [
  "index.html",
  "styles.css",
  "app.js",
  "data.js",
  "manifest.webmanifest",
  "sw.js",
  "icon.svg"
];

fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(target, file));
}

fs.cpSync(path.join(root, "icons"), path.join(target, "icons"), { recursive: true });
console.log(`Assets mobiles prepares dans ${target}`);
