const state = {
  query: "",
  theme: "all",
  type: "all",
  level: "all",
  view: "cards",
  agentOpen: localStorage.getItem("cisco-cli-agent-open") === "true",
  favorites: new Set(JSON.parse(localStorage.getItem("cisco-cli-favorites") || "[]"))
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const themeMap = Object.fromEntries(CISCO_DATA.themes.map((theme) => [theme.id, theme]));

function normalize(value) {
  return value.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function commandText(item) {
  return [item.title, item.summary, item.theme, item.type, item.level, item.commands.join(" "), item.notes.join(" ")].join(" ");
}

function tokenize(value) {
  return normalize(value)
    .replace(/[^a-z0-9./:-]+/g, " ")
    .split(" ")
    .filter((word) => word.length > 2);
}

function filteredCommands() {
  const q = normalize(state.query.trim());
  return CISCO_DATA.commands.filter((item) => {
    const matchesTheme = state.theme === "all" || item.theme === state.theme;
    const matchesType = state.type === "all" || item.type === state.type;
    const matchesLevel = state.level === "all" || item.level === state.level;
    const matchesQuery = !q || normalize(commandText(item)).includes(q);
    return matchesTheme && matchesType && matchesLevel && matchesQuery;
  });
}

function commandId(item) {
  return `${item.theme}:${item.title}`;
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
  $("#cardsGrid").innerHTML = items.map((item) => {
    const theme = themeMap[item.theme];
    const id = commandId(item);
    const favorite = state.favorites.has(id);
    return `
      <article class="command-card" style="--accent:${theme.accent}">
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
        <pre><code>${escapeHtml(item.commands.join("\n"))}</code></pre>
        <div class="card-actions">
          <button class="copy-btn" data-copy="${escapeAttr(item.commands.join("\n"))}">Copier</button>
        </div>
        <ul class="notes">
          ${item.notes.map((note) => `<li>${note}</li>`).join("")}
        </ul>
      </article>
    `;
  }).join("") || `<div class="empty">Aucun resultat. Essaie un autre mot-cle ou retire un filtre.</div>`;

  bindCardActions();
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
          <pre><code>${escapeHtml(item.commands.join("\n"))}</code></pre>
          <button class="copy-btn" data-copy="${escapeAttr(item.commands.join("\n"))}">Copier</button>
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
      await copyToClipboard(button.dataset.copy);
      button.textContent = "Copie";
      setTimeout(() => button.textContent = "Copier", 1200);
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
        ${scenario.steps.map((step) => `<li>${step}</li>`).join("")}
      </ol>
    </article>
  `).join("");
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

function setView(view) {
  state.view = view;
  $$(".view-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
  $$(".view-panel").forEach((panel) => panel.classList.remove("active"));
  $(`#${view}View`).classList.add("active");
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
    renderCards();
  });

  $$(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      state.type = button.dataset.filter;
      $$(".filter-chip").forEach((chip) => chip.classList.remove("active"));
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

  if (localStorage.getItem("cisco-cli-theme") === "light") {
    document.body.classList.add("light");
  }

  render();
  renderScenarios();
  renderGlossary();
  setAgentOpen(state.agentOpen);
  renderAgentMessage("assistant", "Bonjour, je suis ton agent IA Cisco integre. Pose-moi une question sur une configuration, une verification ou un depannage; je reponds avec les commandes du lexique local.");
}

init();
