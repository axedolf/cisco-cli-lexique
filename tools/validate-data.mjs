import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync("data.js", "utf8");
const appSource = fs.readFileSync("app.js", "utf8");
const htmlSource = fs.readFileSync("index.html", "utf8");
const context = {};
vm.runInNewContext(`${source}; result = CISCO_DATA;`, context);

const data = context.result;
const themeIds = new Set(data.themes.map((theme) => theme.id));
const errors = [];
const commandTitles = new Set();

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
  if (commandTitles.has(item.title)) errors.push(`commands[${index}] titre duplique: ${item.title}`);
  commandTitles.add(item.title);
}

for (const snippet of data.snippets || []) {
  if (!commandTitles.has(snippet.commandTitle)) errors.push(`snippet orphelin: ${snippet.commandTitle}`);
}

const htmlIds = new Set([...htmlSource.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
const referencedIds = new Set([...appSource.matchAll(/\$\("#([^" ]+)"\)/g)].map((match) => match[1]));
for (const id of referencedIds) {
  if (!htmlIds.has(id)) errors.push(`app.js reference un id HTML absent: #${id}`);
}

const requiredSearches = [
  ["bgp", "BGP voisin eBGP minimal"],
  ["qos", "QoS MQC simple avec class-map et policy-map"],
  ["policy-map", "QoS MQC simple avec class-map et policy-map"],
  ["port-security", "Port security sur port d'acces"],
  ["dhcp snooping", "DHCP Snooping"],
  ["tdr", "Executer un test cable TDR cuivre"],
  ["crc", "Diagnostiquer CRC input errors et drops cable"],
  ["dot1x", "802.1X filaire avec RADIUS"],
  ["ip verify source", "IP Source Guard sur ports d'acces"],
  ["zbf", "Zone-Based Policy Firewall ZBF"],
  ["copp", "CoPP Control Plane Policing"],
  ["hsrp", "Configurer HSRP avec suivi d'uplink"],
  ["netflow", "Configurer Flexible NetFlow IPv4"],
  ["vpc", "Configurer un domaine vPC Nexus"],
  ["vxlan", "Verifier VXLAN EVPN sur Nexus 9000"],
  ["install add", "Mettre a jour IOS XE en mode install"]
];

if (!Array.isArray(data.diagnostics) || data.diagnostics.length < 6) {
  errors.push("diagnostics: au moins 6 symptomes sont requis");
}

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
