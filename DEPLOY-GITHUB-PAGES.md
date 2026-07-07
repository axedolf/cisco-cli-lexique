# Mettre l'application en ligne avec GitHub Pages

## Methode simple depuis le site GitHub

1. Aller sur https://github.com/new
2. Creer un depot public, par exemple `cisco-cli-lexique`
3. Cliquer sur `uploading an existing file`
4. Glisser tous les fichiers du dossier `cisco-cli-lexique`:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `data.js`
   - `README.md`
   - `.nojekyll`
5. Cliquer sur `Commit changes`
6. Aller dans `Settings` puis `Pages`
7. Dans `Build and deployment`, choisir:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
8. Cliquer sur `Save`

Apres quelques minutes, le site sera disponible a une adresse du type:

```text
https://TON-UTILISATEUR.github.io/cisco-cli-lexique/
```

## Methode avec GitHub Desktop

1. Creer un nouveau depot local avec GitHub Desktop.
2. Copier tous les fichiers de `cisco-cli-lexique` a la racine du depot.
3. Faire `Commit`.
4. Cliquer sur `Publish repository`.
5. Activer GitHub Pages dans `Settings > Pages`.

## Important

Publier le contenu du dossier `cisco-cli-lexique`, pas le dossier parent seul.
L'application a besoin de `index.html`, `styles.css`, `app.js` et `data.js`.
