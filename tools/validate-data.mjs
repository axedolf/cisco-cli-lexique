import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync("data.js", "utf8");
const context = {};
vm.runInNewContext(`${source}; result = CISCO_DATA;`, context);

const data = context.result;
const themeIds = new Set(data.themes.map((theme) => theme.id));
const errors = [];

for (const [index, item] of data.commands.entries()) {
  for (const key of ["theme", "type", "level", "title", "summary", "commands", "notes"]) {
    if (!item[key] || (Array.isArray(item[key]) && item[key].length === 0)) {
      errors.push(`commands[${index}] ${item.title || "(sans titre)"}: champ manquant ${key}`);
    }
  }
  if (!themeIds.has(item.theme)) {
    errors.push(`commands[${index}] ${item.title}: theme inconnu ${item.theme}`);
  }
  if (item.platforms && !Array.isArray(item.platforms)) {
    errors.push(`commands[${index}] ${item.title}: platforms doit etre un tableau`);
  }
}

const requiredSearches = [
  ["bgp", "BGP voisin eBGP minimal"],
  ["qos", "QoS MQC simple avec class-map et policy-map"],
  ["policy-map", "QoS MQC simple avec class-map et policy-map"]
];

function normalize(value) {
  return value.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function commandText(item) {
  return [
    item.title,
    item.summary,
    item.theme,
    item.type,
    item.level,
    item.commands.join(" "),
    item.notes.join(" "),
    (item.aliases || []).join(" "),
    (item.platforms || []).join(" ")
  ].join(" ");
}

for (const [query, expectedTitle] of requiredSearches) {
  const found = data.commands.some((item) => normalize(commandText(item)).includes(normalize(query)) && item.title === expectedTitle);
  if (!found) errors.push(`recherche "${query}" ne trouve pas "${expectedTitle}"`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validation OK: ${data.commands.length} fiches, ${data.themes.length} themes.`);
