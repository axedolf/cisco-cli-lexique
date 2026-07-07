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

## Source et prudence

Base inspiree du projet open source:
https://github.com/grplyler/cisco-cheatsheet#inter-vlan-routing

Les commandes Cisco IOS / IOS XE varient selon les versions, licences et modeles.
Tester toute commande critique en laboratoire ou fenetre de maintenance avant production.
