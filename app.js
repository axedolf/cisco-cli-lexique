const state = {
  query: "",
  theme: "all",
  type: "all",
  level: "all",
  view: "cards",
  activeResultIndex: -1,
  favoritesOnly: false,
  agentOpen: localStorage.getItem("cisco-cli-agent-open") === "true",
  sessionParams: JSON.parse(localStorage.getItem("cisco-cli-session-params") || "{}"),
  favorites: new Set(JSON.parse(localStorage.getItem("cisco-cli-favorites") || "[]"))
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const themeMap = Object.fromEntries(CISCO_DATA.themes.map((theme) => [theme.id, theme]));
const snippetMap = Object.fromEntries((CISCO_DATA.snippets || []).map((snippet) => [snippet.commandTitle, snippet]));
const copyStore = new Map();
let copyStoreCounter = 0;

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

function tokenize(value) {
  return normalize(value)
    .replace(/[^a-z0-9./:-]+/g, " ")
    .split(" ")
    .filter((word) => word.length > 2);
}

function fuzzyIncludes(text, word) {
  if (!word) return true;
  if (text.includes(word)) return true;
  let index = 0;
  for (const char of text) {
    if (char === word[index]) index += 1;
    if (index === word.length) return true;
  }
  return false;
}

function editDistance(a, b) {
  const rows = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j += 1) rows[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return rows[a.length][b.length];
}

function matchesSearch(item, query) {
  if (!query) return true;
  const haystack = normalize(commandText(item));
  const words = tokenize(query);
  const haystackWords = tokenize(commandText(item));
  return words.every((word) => {
    if (fuzzyIncludes(haystack, word)) return true;
    if (word.length < 4) return false;
    return haystackWords.some((candidate) => Math.abs(candidate.length - word.length) <= 2 && editDistance(candidate, word) <= 2);
  });
}

function searchScore(item, query) {
  if (!query) return 0;
  const title = normalize(item.title);
  const summary = normalize(item.summary);
  const aliases = normalize((item.aliases || []).join(" "));
  const commands = normalize(item.commands.join(" "));
  let score = 0;
  if (title.includes(query)) score += 120;
  if (aliases.includes(query)) score += 110;
  if (commands.includes(query)) score += 70;
  if (summary.includes(query)) score += 50;
  for (const word of tokenize(query)) {
    if (title.includes(word)) score += 18;
    if (aliases.includes(word)) score += 16;
    if (commands.includes(word)) score += 10;
    if (summary.includes(word)) score += 8;
  }
  return score;
}

function filteredCommands() {
  const q = normalize(state.query.trim());
  const hasQuery = q.length > 0;
  const results = CISCO_DATA.commands.filter((item) => {
    const id = commandId(item);
    const matchesTheme = hasQuery || state.theme === "all" || item.theme === state.theme;
    const matchesType = hasQuery || state.type === "all" || item.type === state.type;
    const matchesLevel = hasQuery || state.level === "all" || item.level === state.level;
    const matchesFavorites = hasQuery || !state.favoritesOnly || state.favorites.has(id);
    const matchesQuery = matchesSearch(item, q);
    return matchesTheme && matchesType && matchesLevel && matchesFavorites && matchesQuery;
  });
  if (hasQuery) {
    results.sort((a, b) => searchScore(b, q) - searchScore(a, q));
  }
  return results;
}

function commandId(item) {
  return `${item.theme}:${item.title}`;
}

function applySessionParams(value) {
  const p = state.sessionParams;
  const replacements = {
    "vlan-id": p.vlanId,
    "interface-name": p.interfaceName,
    "uplink-interface": p.interfaceName,
    "source-interface": p.interfaceName,
    "ip-address": p.ipAddress,
    "destination-ip": p.destinationIp,
    "source-ip": p.sourceIp,
    "vrf-name": p.vrfName,
    "process-id": p.processId,
    "area-id": p.areaId,
    wildcard: p.wildcard,
    mask: p.mask
  };

  let output = value;
  Object.entries(replacements).forEach(([key, replacement]) => {
    if (!replacement) return;
    output = output.replace(new RegExp(`<${key}>|\\[${key}\\]`, "gi"), replacement);
  });
  return output;
}

function commandsForExport(commands) {
  return commands.map(applySessionParams).join("\n");
}

function commandMode(command) {
  const line = command.trim().toLowerCase();
  if (/^(show|ping|traceroute|telnet|ssh|copy|write|clear|debug|undebug|terminal|test|monitor capture|dir|reload|more)\b/.test(line)) return "Switch#";
  if (/^(configure terminal|conf t|enable|disable|end)\b/.test(line)) return "Switch#";
  if (/^(interface|router|ip access-list|line|vlan|ip dhcp pool|route-map|policy-map|class-map|ipv6 router)\b/.test(line)) return "Switch(config)#";
  if (/^(exit|description|ip address|no shutdown|shutdown|switchport|spanning-tree|power inline|ip ospf|ipv6 ospf|encapsulation|channel-group|standby|ip helper-address|service-policy)\b/.test(line)) return "Switch(config-if)#";
  return "Switch(config)#";
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}

function slugify(value) {
  return normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "script";
}

function registerCopyText(text) {
  const id = `copy-${copyStoreCounter += 1}`;
  copyStore.set(id, text);
  return id;
}

function copyButton(label, text, className = "copy-btn") {
  return `<button class="${className}" data-copy-id="${registerCopyText(text)}">${label}</button>`;
}

function exportButton(label, filename, text) {
  return `<button class="export-btn" data-filename="${escapeAttr(filename)}" data-export-id="${registerCopyText(text)}">${label}</button>`;
}

function commandWarnings(item) {
  const text = commandsForExport(item.commands).toLowerCase();
  const warnings = [];
  if (text.includes("crypto key generate rsa")) {
    warnings.push("Verifier que ip domain-name est configure avant crypto key generate rsa.");
  }
  if (/\breload\b/.test(text)) {
    warnings.push("reload redemarre l'equipement: sauvegarder et prevoir une fenetre d'intervention.");
  }
  if (/\b(write erase|erase startup-config|delete flash:|format flash:|factory-reset)\b/.test(text)) {
    warnings.push("Commande destructive: confirmer sauvegarde, acces console et procedure de retour arriere.");
  }
  if (text.includes("default-information originate always")) {
    warnings.push("default-information originate always peut annoncer une route par defaut meme si la sortie est indisponible.");
  }
  return [...new Set([...(item.warnings || []), ...warnings])];
}

function renderWarnings(item) {
  const warnings = commandWarnings(item);
  if (!warnings.length) return "";
  return `
    <div class="warnings" role="note">
      ${warnings.map((warning) => `<span class="warning-badge">${escapeHtml(warning)}</span>`).join("")}
    </div>
  `;
}

function renderPlatforms(item) {
  if (!item.platforms?.length) return "";
  return `
    <div class="platforms" aria-label="Compatibilite plateforme">
      ${item.platforms.map((platform) => `<span>${escapeHtml(platform)}</span>`).join("")}
    </div>
  `;
}

function renderNav() {
  const nav = $("#themeNav");
  const total = CISCO_DATA.commands.length;
  const buttons = [
    `<button class="theme-link ${state.theme === "all" ? "active" : ""}" data-theme="all"><span>Tous les themes</span><strong>${total}</strong></button>`
  ];

  CISCO_DATA.themes.forEach((theme) => {
    const count = CISCO_DATA.commands.filter((item) => item.theme === theme.id).length;
    buttons.push(`
      <button class="theme-link ${state.theme === theme.id ? "active" : ""}" data-theme="${theme.id}" style="--accent:${theme.accent}">
        <span>${theme.name}</span>
        <strong>${count}</strong>
      </button>
    `);
  });

  nav.innerHTML = buttons.join("");
  $$(".theme-link").forEach((button) => {
    button.addEventListener("click", () => {
      state.theme = button.dataset.theme;
      render();
    });
  });
}

function renderCards() {
  const items = filteredCommands();
  $("#resultCount").textContent = items.length;
  if (state.activeResultIndex >= items.length) state.activeResultIndex = items.length - 1;
  $("#cardsGrid").innerHTML = items.map((item) => {
    const theme = themeMap[item.theme];
    const id = commandId(item);
    const favorite = state.favorites.has(id);
    const exportText = commandsForExport(item.commands);
    const index = items.indexOf(item);
    return `
      <article class="command-card ${state.activeResultIndex === index ? "selected" : ""}" style="--accent:${theme.accent}" data-result-index="${index}" tabindex="-1">
        <div class="card-head">
          <div>
            <span class="theme-badge">${theme.name}</span>
            <h3>${item.title}</h3>
          </div>
          <button class="favorite ${favorite ? "active" : ""}" data-favorite="${id}" title="Ajouter aux favoris">${favorite ? "★" : "☆"}</button>
        </div>
        <p>${item.summary}</p>
        <div class="meta">
          <span>${labelType(item.type)}</span>
          <span>${labelLevel(item.level)}</span>
        </div>
        ${renderPlatforms(item)}
        ${renderWarnings(item)}
        ${renderCommandBlock(item.commands)}
        ${renderSnippet(item)}
        <div class="card-actions">
          ${copyButton("Copier", exportText)}
          ${exportButton("Exporter .txt", `${slugify(item.title)}.txt`, exportText)}
        </div>
        <ul class="notes">
          ${item.notes.map((note) => `<li>${note}</li>`).join("")}
        </ul>
      </article>
    `;
  }).join("") || `<div class="empty">Aucun resultat. Essaie un autre mot-cle ou retire un filtre.</div>`;

  bindCardActions();
}

function renderCommandBlock(commands) {
  return `
    <div class="command-block">
      ${commands.map((command) => {
        const prepared = applySessionParams(command);
        return `
        <div class="command-line">
          <span class="prompt-badge">${escapeHtml(commandMode(prepared))}</span>
          <code>${highlightVariables(prepared)}</code>
          ${copyButton("Copier", prepared, "line-copy")}
        </div>
      `;}).join("")}
    </div>
  `;
}

function renderSnippet(item) {
  const snippet = snippetMap[item.title];
  if (!snippet) return "";
  const defaults = Object.fromEntries(snippet.fields.map((field) => [field.key, field.value]));
  const generated = buildSnippet(snippet, defaults);
  return `
    <details class="snippet" data-snippet="${escapeAttr(item.title)}">
      <summary>${escapeHtml(snippet.title)}</summary>
      <div class="snippet-fields">
        ${snippet.fields.map((field) => `
          <label>
            <span>${escapeHtml(field.label)}</span>
            <input data-snippet-field="${escapeAttr(field.key)}" value="${escapeAttr(field.value)}">
          </label>
        `).join("")}
      </div>
      <pre><code data-snippet-output>${escapeHtml(generated)}</code></pre>
      ${copyButton("Copier le snippet", generated)}
    </details>
  `;
}

function buildSnippet(snippet, values) {
  return snippet.template
    .map((line) => applySessionParams(line.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] || "")))
    .join("\n");
}

function updateSnippet(details) {
  const snippet = snippetMap[details.dataset.snippet];
  if (!snippet) return;
  const values = {};
  details.querySelectorAll("[data-snippet-field]").forEach((input) => {
    values[input.dataset.snippetField] = input.value.trim();
  });
  const generated = buildSnippet(snippet, values);
  details.querySelector("[data-snippet-output]").textContent = generated;
  details.querySelector(".copy-btn").dataset.copyId = registerCopyText(generated);
}

function findAgentMatches(question, limit = 4) {
  const words = tokenize(question);
  const intentBoosts = {
    configurer: "config",
    creer: "config",
    activer: "config",
    verifier: "verify",
    voir: "verify",
    depanner: "troubleshoot",
    panne: "troubleshoot",
    securiser: "security",
    proteger: "security"
  };

  return CISCO_DATA.commands
    .map((item) => {
      const haystack = normalize(commandText(item));
      let score = 0;
      words.forEach((word) => {
        if (haystack.includes(word)) score += word.length > 4 ? 3 : 2;
        if (normalize(item.title).includes(word)) score += 3;
      });
      Object.entries(intentBoosts).forEach(([keyword, type]) => {
        if (normalize(question).includes(keyword) && item.type === type) score += 4;
      });
      if (state.theme !== "all" && item.theme === state.theme) score += 1;
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

function buildAgentAnswer(question) {
  const matches = findAgentMatches(question);
  if (!matches.length) {
    return {
      intro: "Je n'ai pas trouve de fiche tres proche dans le lexique. Essaie avec un mot-cle Cisco comme VLAN, trunk, SSH, OSPF, DHCP, ACL, port-security ou err-disabled.",
      matches: []
    };
  }

  const primaryTheme = themeMap[matches[0].theme]?.name || "Cisco CLI";
  return {
    intro: `Voici ce que je te conseille pour "${question}" dans le theme ${primaryTheme}. Adapte toujours les VLAN, IP, interfaces et mots de passe a ton environnement.`,
    matches
  };
}

function renderAgentMessage(role, content) {
  const messages = $("#agentMessages");
  const bubble = document.createElement("article");
  bubble.className = `agent-message ${role}`;

  if (typeof content === "string") {
    bubble.innerHTML = `<p>${escapeHtml(content)}</p>`;
  } else {
    bubble.innerHTML = `
      <p>${escapeHtml(content.intro)}</p>
      ${content.matches.map((item) => `
        <section class="agent-result">
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(themeMap[item.theme].name)} · ${labelType(item.type)}</span>
          </div>
          <p>${escapeHtml(item.summary)}</p>
          <pre><code>${escapeHtml(commandsForExport(item.commands))}</code></pre>
          ${copyButton("Copier", commandsForExport(item.commands))}
        </section>
      `).join("")}
      <p class="agent-warning">Controle la compatibilite IOS/IOS XE et teste les changements sensibles hors production.</p>
    `;
  }

  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
  bindCardActions();
}

function askAgent(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;
  renderAgentMessage("user", cleanQuestion);
  renderAgentMessage("assistant", buildAgentAnswer(cleanQuestion));
}

function setAgentOpen(open) {
  state.agentOpen = open;
  $("#agentPanel").classList.toggle("open", open);
  $("#agentFab").classList.toggle("hidden", open);
  localStorage.setItem("cisco-cli-agent-open", open ? "true" : "false");
  if (open) {
    $("#agentInput").focus();
  }
}

function bindCardActions() {
  $$(".copy-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      await copyToClipboard(copyStore.get(button.dataset.copyId) || "");
      button.textContent = "Copie";
      setTimeout(() => button.textContent = "Copier", 1200);
    });
  });

  $$(".line-copy").forEach((button) => {
    button.addEventListener("click", async () => {
      await copyToClipboard(copyStore.get(button.dataset.copyId) || "");
      button.textContent = "OK";
      setTimeout(() => button.textContent = "Copier", 1200);
    });
  });

  $$(".export-btn").forEach((button) => {
    button.addEventListener("click", () => {
      downloadTextFile(button.dataset.filename, copyStore.get(button.dataset.exportId) || "");
    });
  });

  $$(".snippet").forEach((details) => {
    details.querySelectorAll("[data-snippet-field]").forEach((input) => {
      input.addEventListener("input", () => updateSnippet(details));
    });
  });

  $$(".favorite").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.favorite;
      if (state.favorites.has(id)) {
        state.favorites.delete(id);
      } else {
        state.favorites.add(id);
      }
      localStorage.setItem("cisco-cli-favorites", JSON.stringify([...state.favorites]));
      renderCards();
    });
  });
}

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

function renderScenarios() {
  $("#scenarioList").innerHTML = CISCO_DATA.scenarios.map((scenario) => `
    <article class="scenario">
      <h3>${scenario.title}</h3>
      <ol>
        ${scenario.steps.map((step) => `<li>${highlightVariables(applySessionParams(step))}</li>`).join("")}
      </ol>
      ${exportButton("Exporter .txt", `${slugify(scenario.title)}.txt`, scenario.steps.map(applySessionParams).join("\n"))}
    </article>
  `).join("");
  bindCardActions();
}

function renderEmergency() {
  $("#emergencyList").innerHTML = (CISCO_DATA.emergency || []).map((scenario) => `
    <article class="scenario emergency-card">
      <h3>${scenario.title}</h3>
      <ol>
        ${scenario.steps.map((step) => `<li>${highlightVariables(applySessionParams(step))}</li>`).join("")}
      </ol>
    </article>
  `).join("");
}

function renderSessionParams() {
  $$("[data-session-param]").forEach((input) => {
    input.value = state.sessionParams[input.dataset.sessionParam] || "";
  });
}

function ipToNumber(ip) {
  const parts = ip.trim().split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) return null;
  return parts.reduce((acc, part) => ((acc << 8) | part) >>> 0, 0);
}

function numberToIp(number) {
  return [24, 16, 8, 0].map((shift) => (number >>> shift) & 255).join(".");
}

function maskToNumber(maskValue) {
  const clean = maskValue.trim();
  if (/^\d{1,2}$/.test(clean)) {
    const cidr = Number(clean);
    if (cidr < 0 || cidr > 32) return null;
    return cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  }
  return ipToNumber(clean);
}

function maskToCidr(maskNumber) {
  const binary = maskNumber.toString(2).padStart(32, "0");
  if (!/^1*0*$/.test(binary)) return null;
  return binary.indexOf("0") === -1 ? 32 : binary.indexOf("0");
}

function renderIpCalculator() {
  const output = $("#calcOutput");
  const ip = ipToNumber($("#calcIp").value);
  const mask = maskToNumber($("#calcMask").value);
  if (ip === null || mask === null) {
    output.innerHTML = `<p>Renseigne une IP et un CIDR/masque valide.</p>`;
    return;
  }
  const cidr = maskToCidr(mask);
  if (cidr === null) {
    output.innerHTML = `<p>Masque non contigu: verifie la valeur.</p>`;
    return;
  }
  const wildcard = (~mask) >>> 0;
  const network = ip & mask;
  const broadcast = network | wildcard;
  const first = cidr >= 31 ? network : network + 1;
  const last = cidr >= 31 ? broadcast : broadcast - 1;
  output.innerHTML = `
    <dl>
      <div><dt>Reseau</dt><dd>${numberToIp(network)}/${cidr}</dd></div>
      <div><dt>Masque</dt><dd>${numberToIp(mask)}</dd></div>
      <div><dt>Wildcard</dt><dd>${numberToIp(wildcard)}</dd></div>
      <div><dt>Broadcast</dt><dd>${numberToIp(broadcast)}</dd></div>
      <div><dt>Plage utile</dt><dd>${numberToIp(first)} - ${numberToIp(last)}</dd></div>
    </dl>
  `;
}

function renderGlossary() {
  $("#glossaryList").innerHTML = CISCO_DATA.glossary.map(([term, definition]) => `
    <article class="glossary-item">
      <h3>${term}</h3>
      <p>${definition}</p>
    </article>
  `).join("");
}

function labelType(type) {
  return {
    config: "Configuration",
    verify: "Verification",
    troubleshoot: "Depannage",
    security: "Securite"
  }[type] || type;
}

function labelLevel(level) {
  return {
    base: "Base",
    intermediaire: "Intermediaire",
    avance: "Avance"
  }[level] || level;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/\n/g, "&#10;");
}

function highlightVariables(value) {
  return escapeHtml(value).replace(/(&lt;[^&]+&gt;|\b[A-Z][A-Z0-9_]{2,}\b)/g, '<span class="cmd-var">$1</span>');
}

function setView(view) {
  state.view = view;
  state.activeResultIndex = -1;
  $$(".view-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
  $$(".view-panel").forEach((panel) => panel.classList.remove("active"));
  $(`#${view}View`).classList.add("active");
}

function moveResultSelection(delta) {
  if (state.view !== "cards") return;
  const cards = $$(".command-card");
  if (!cards.length) return;
  state.activeResultIndex = Math.max(0, Math.min(cards.length - 1, state.activeResultIndex + delta));
  cards.forEach((card, index) => card.classList.toggle("selected", index === state.activeResultIndex));
  cards[state.activeResultIndex].scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function toggleSelectedCard() {
  if (state.view !== "cards" || state.activeResultIndex < 0) return;
  const card = $$(".command-card")[state.activeResultIndex];
  if (!card) return;
  card.classList.toggle("expanded");
  card.focus({ preventScroll: true });
  card.scrollIntoView({ block: "center", behavior: "smooth" });
}

function render() {
  renderNav();
  renderCards();
  $("#commandCount").textContent = CISCO_DATA.commands.length;
  $("#themeCount").textContent = CISCO_DATA.themes.length;
}

function init() {
  $("#searchInput").addEventListener("input", (event) => {
    state.query = event.target.value;
    state.activeResultIndex = state.query.trim() ? 0 : -1;
    renderCards();
  });

  $$(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.favorites) {
        state.favoritesOnly = !state.favoritesOnly;
        button.classList.toggle("active", state.favoritesOnly);
        renderCards();
        return;
      }
      state.type = button.dataset.filter;
      $$(".filter-chip[data-filter]").forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
      renderCards();
    });
  });

  $("#levelSelect").addEventListener("change", (event) => {
    state.level = event.target.value;
    renderCards();
  });

  $$(".view-tab").forEach((tab) => {
    tab.addEventListener("click", () => setView(tab.dataset.view));
  });

  $$("[data-session-param]").forEach((input) => {
    input.addEventListener("input", () => {
      state.sessionParams[input.dataset.sessionParam] = input.value.trim();
      localStorage.setItem("cisco-cli-session-params", JSON.stringify(state.sessionParams));
      renderCards();
      renderScenarios();
      renderEmergency();
    });
  });

  $("#clearSessionBtn").addEventListener("click", () => {
    state.sessionParams = {};
    localStorage.removeItem("cisco-cli-session-params");
    renderSessionParams();
    renderCards();
    renderScenarios();
    renderEmergency();
  });

  $("#calcIp").addEventListener("input", renderIpCalculator);
  $("#calcMask").addEventListener("input", renderIpCalculator);

  $("#themeBtn").addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("cisco-cli-theme", document.body.classList.contains("light") ? "light" : "dark");
  });

  $("#printBtn").addEventListener("click", () => window.print());

  $("#agentOpenBtn").addEventListener("click", () => setAgentOpen(true));
  $("#agentFab").addEventListener("click", () => setAgentOpen(true));
  $("#agentCloseBtn").addEventListener("click", () => setAgentOpen(false));
  $("#agentForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#agentInput");
    askAgent(input.value);
    input.value = "";
  });

  $$("[data-agent-prompt]").forEach((button) => {
    button.addEventListener("click", () => askAgent(button.dataset.agentPrompt));
  });

  document.addEventListener("keydown", (event) => {
    const isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);
    if ((event.key === "/" && !isTyping) || (event.key.toLowerCase() === "k" && event.ctrlKey)) {
      event.preventDefault();
      $("#searchInput").focus();
      $("#searchInput").select();
      return;
    }
    if (!isTyping && state.view === "cards" && ["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) {
      event.preventDefault();
      if (event.key === "ArrowDown") moveResultSelection(1);
      if (event.key === "ArrowUp") moveResultSelection(-1);
      if (event.key === "Enter") toggleSelectedCard();
    }
  });

  if (localStorage.getItem("cisco-cli-theme") === "light") {
    document.body.classList.add("light");
  }

  render();
  renderSessionParams();
  renderIpCalculator();
  renderScenarios();
  renderEmergency();
  renderGlossary();
  setAgentOpen(state.agentOpen);
  renderAgentMessage("assistant", "Bonjour, je suis ton agent IA Cisco integre. Pose-moi une question sur une configuration, une verification ou un depannage; je reponds avec les commandes du lexique local.");
  registerServiceWorker();
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("./sw.js?v=20260709-1").catch(() => {});
  }
}

init();
