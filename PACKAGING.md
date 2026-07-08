# Versions portables Android et macOS

## Option recommandee: installation PWA

L'application est deja publiee comme PWA sur GitHub Pages:

https://axedolf.github.io/cisco-cli-lexique/

### Android

1. Ouvrir le lien dans Chrome.
2. Menu `...`.
3. Choisir `Installer l'application` ou `Ajouter a l'ecran d'accueil`.
4. L'application s'ouvre ensuite comme une application Android et fonctionne hors-ligne apres une premiere visite.

### macOS

1. Ouvrir le lien dans Chrome ou Edge.
2. Cliquer sur l'icone d'installation dans la barre d'adresse, ou menu `...` puis `Installer Lexique Cisco CLI`.
3. L'application apparait dans le Lanceur d'applications.

## APK Android

Une version APK peut etre generee avec Bubblewrap ou PWABuilder a partir de la PWA publiee.

Pre-requis:

- Java JDK
- Android SDK
- Bubblewrap CLI
- un keystore de signature Android

Commande cible:

```powershell
pnpm install
pnpm run build:android:twa
```

Publication possible:

- GitHub Releases pour distribuer un APK directement.
- Google Play Store avec un compte Google Play Console et une signature valide.

## Application macOS

Le projet contient une enveloppe Electron dans `electron/main.cjs`.

Pre-requis:

- Node.js
- pnpm
- macOS pour compiler proprement une app macOS
- Apple Developer Program pour signature/notarisation si distribution publique large

Commande cible depuis un Mac:

```bash
pnpm install
pnpm run build:mac
```

Publication possible:

- GitHub Releases avec un `.dmg` ou `.zip`.
- Site web personnel.
- Mac App Store uniquement avec compte Apple Developer et processus de validation Apple.

## Limite importante

Depuis cette machine Windows, on peut preparer le projet et publier la PWA. En revanche, compiler et signer proprement une vraie application macOS doit se faire sur macOS. Pour Android, il faut installer le SDK Android et creer une cle de signature avant de produire un APK publiable.
