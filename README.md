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

## Installation Android et macOS

La version GitHub Pages est installable comme PWA depuis Chrome, Edge ou Safari compatible:

- Android: ouvrir le site puis `Installer l'application` ou `Ajouter a l'ecran d'accueil`.
- macOS: ouvrir le site dans Chrome/Edge puis installer depuis la barre d'adresse.

Pour generer un APK Android ou une application macOS Electron, voir `PACKAGING.md`.

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
- Sections BGP et QoS avec commandes de configuration, verification et depannage.
- Badges de compatibilite plateforme sur les fiches enrichies.
- Version v3: enrichissement securite L2/L3 avec 802.1X, MAB, IP Source Guard, DAI, Private VLAN, ZBF, CoPP, MPP, AAA et durcissement management.
- Diagnostic cables et liens physiques: TDR cuivre, interpretation de paires, erreurs CRC/drops et controles SFP/fibre.
- Atelier terrain: analyse heuristique de sorties CLI, anonymisation des donnees, diagnostics guides et matrice symptome/commandes.
- Constructeur d'intervention avec ordre des fiches, controles avant/apres, plan de rollback et export `.cfg`.
- Comparaison de captures avant/apres et journal d'incident horodate conserves dans le navigateur.
- Profils Catalyst IOS/IOS XE, Nexus NX-OS et ISR avec filtrage de compatibilite.
- Haute disponibilite: HSRP, VRRP, GLBP, StackWise, SSO et NSF.
- Supervision: Flexible NetFlow, IP SLA, tracking et ERSPAN.
- Datacenter: vPC, VXLAN EVPN, FEX, transceivers et ressources ASIC Nexus.
- Maintenance logicielle: controle d'image, boot, installation IOS XE et mise a jour NX-OS.

## Architecture et contribution

- Architecture technique: `ARCHITECTURE.md`
- Guide de contribution: `CONTRIBUTING.md`
- Validation locale des donnees: `node tools/validate-data.mjs`

## Source et prudence

Base inspiree du projet open source:
https://github.com/grplyler/cisco-cheatsheet#inter-vlan-routing

Les commandes Cisco IOS / IOS XE varient selon les versions, licences et modeles.
Tester toute commande critique en laboratoire ou fenetre de maintenance avant production.
