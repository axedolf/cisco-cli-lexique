# Architecture technique cible

## Principe

L'application reste statique pour GitHub Pages: HTML, CSS et JavaScript client-side uniquement.
Aucun secret, aucune base de donnees et aucun backend ne doivent etre requis pour consulter le lexique.

## Couches

1. `index.html`
   - Structure de l'interface.
   - Points d'accroche des vues: fiches, outils, urgence, procedures, glossaire, agent local.

2. `styles.css`
   - Design system CSS natif.
   - Themes clair/sombre via variables CSS.
   - Responsive mobile/tablette/desktop.

3. `data.js`
   - Source de donnees embarquee.
   - Themes, fiches commandes, snippets interactifs, scenarios, urgence et glossaire.
   - Format volontairement simple pour faciliter les contributions sans build.

4. `app.js`
   - Recherche fuzzy, filtres, favoris, agent local, snippets, export texte/PDF navigateur.
   - Stockage utilisateur dans `localStorage`.

5. PWA
   - `manifest.webmanifest`, `sw.js`, `icons/`.
   - Installation Android/macOS et consultation hors-ligne apres premiere visite.

## Schema recommande pour une fiche

```js
{
  theme: "bgp",
  type: "config",
  level: "avance",
  title: "BGP voisin eBGP minimal",
  summary: "Etablit une session BGP externe et annonce un prefixe.",
  platforms: ["IOS", "IOS XE"],
  commands: [
    "router bgp 65010",
    "neighbor 203.0.113.1 remote-as 65000"
  ],
  aliases: ["bgp ebgp", "neighbor remote-as"],
  notes: [
    "Le prefixe annonce doit exister dans la table de routage.",
    "Filtrage et route-map sont indispensables en production."
  ]
}
```

## Roadmap technique

### Phase 1

- Conserver l'interface actuelle et renforcer le contenu.
- Separateurs de themes pour BGP et QoS.
- Recherche fuzzy indexant aussi plateformes et alias.
- Validation automatique des donnees.

### Phase 2

- Generateurs de configuration avances par cas d'usage.
- Scenarios de troubleshooting interactifs.
- Quiz CCNA/CCNP.
- Export PDF cible par fiche.

### Phase 3

- Progression locale, statistiques personnelles et flashcards.
- Mode urgence enrichi.
- Import/export des favoris.

### Phase 4

- Export JSON statique pour API publique.
- Extension navigateur.
- Contribution collaborative via GitHub Issues ou Pull Requests.

## Contraintes

- Toute fonctionnalite doit fonctionner sans backend.
- Les donnees sensibles ou cles API sont interdites dans le client.
- Les commandes critiques doivent comporter une note de prudence.
- Les ajouts de contenu doivent passer `pnpm test` ou `node tools/validate-data.mjs`.
