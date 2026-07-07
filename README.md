# Lexique Cisco CLI

Application statique consultable en local et publiable en ligne.

## Utilisation locale

Ouvrir `index.html` dans un navigateur.

## Mise en ligne

Publier tout le dossier `cisco-cli-lexique` sur un hebergeur statique:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- serveur web interne

Aucun backend ni installation de dependances n'est necessaire.

## Agent IA integre

Le bouton `Agent IA` ouvre un assistant local qui interroge le lexique embarque
et propose des commandes Cisco pertinentes selon la question. Il fonctionne sans
connexion externe. Pour brancher une IA generative reelle, il faudra ajouter une
API securisee cote serveur afin de ne pas exposer de cle dans le navigateur.

## Fonctions ajoutees

- Copie ligne par ligne ou par bloc de configuration.
- Variables mises en evidence dans les commandes.
- Raccourcis clavier: `/` ou `Ctrl+K` pour focaliser la recherche.
- Favoris conserves dans le navigateur.
- Generateurs interactifs pour VLAN, trunk, SVI, DHCP et SSH.
- Vue urgence pour les incidents CPU, port coupe et routage.
- Mode PWA: cache hors-ligne apres une premiere visite depuis le site publie.
- Section materiel et PoE: CPU, memoire, temperature, ventilateurs, alimentations, budget PoE, etat PoE par port, activation/desactivation PoE.

## Source et prudence

Base inspiree du projet open source:
https://github.com/grplyler/cisco-cheatsheet#inter-vlan-routing

Les commandes Cisco IOS / IOS XE varient selon les versions, licences et modeles.
Tester toute commande critique en laboratoire ou fenetre de maintenance avant production.
