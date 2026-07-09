# Contribuer au Lexique Cisco CLI

## Ajouter une commande

1. Ouvrir `data.js`.
2. Ajouter une entree dans `CISCO_DATA.commands`.
3. Renseigner au minimum:
   - `theme`
   - `type`
   - `level`
   - `title`
   - `summary`
   - `commands`
   - `notes`
4. Ajouter `platforms` et `aliases` si possible.
5. Lancer la validation:

```powershell
node tools/validate-data.mjs
```

## Regles de contenu

- Utiliser des adresses de documentation: `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`, `2001:db8::/32`.
- Eviter les commandes destructrices sans avertissement clair.
- Toujours ajouter les commandes de verification utiles.
- Indiquer les limites de compatibilite quand une syntaxe depend de la plateforme.

## Style

- Texte en francais.
- Pas d'accents obligatoires dans les commandes ou les identifiants.
- Commandes en syntaxe Cisco CLI exacte quand elle est stable.
- Notes courtes, actionnables, orientees terrain.
