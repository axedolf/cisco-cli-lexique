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

Une version Android native Capacitor est incluse dans le dossier `android/`.

APK signe pret a installer:

`downloads/Cisco-CLI-Lexique-Android-v1.1.0.apk`

Lien public direct apres publication GitHub Pages:

https://axedolf.github.io/cisco-cli-lexique/downloads/Cisco-CLI-Lexique-Android-v1.1.0.apk

Pre-requis:

- Java JDK
- Android SDK
- Capacitor 8
- une cle de signature Android privee

Commande cible:

```powershell
powershell -ExecutionPolicy Bypass -File tools/build-android.ps1
```

La cle et son mot de passe sont conserves dans `.android-private/`, dossier exclu de Git.
Sauvegarder ce dossier dans un emplacement prive: il est indispensable pour signer les futures mises a jour.

### Installation sur le telephone

1. Telecharger l'APK depuis le lien direct.
2. Ouvrir le fichier depuis les telechargements Android.
3. Autoriser temporairement l'installation depuis cette source si Android le demande.
4. Appuyer sur `Installer`.

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
