$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$androidRoot = Join-Path $root "android"
$sdkRoot = "C:\Users\Hugo\Documents\Codex\.android-tools\sdk"
$javaRoot = Get-ChildItem (Join-Path $root ".android-build\jdk21-extracted") -Directory | Select-Object -First 1
$nodeCandidates = @(
    (Get-Command node.exe -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -ErrorAction SilentlyContinue),
    "C:\Users\Hugo\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
) | Where-Object { $_ -and (Test-Path -LiteralPath $_) }
$node = $nodeCandidates | Select-Object -First 1
$pythonCandidates = @(
    "C:\Users\Hugo\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe",
    (Get-Command python.exe -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -ErrorAction SilentlyContinue)
) | Where-Object { $_ -and (Test-Path -LiteralPath $_) }
$python = $pythonCandidates | Select-Object -First 1

if (-not $javaRoot) {
    throw "JDK 21 introuvable dans .android-build\jdk21-extracted"
}
if (-not $node) {
    throw "Node.js introuvable"
}
if (-not (Test-Path (Join-Path $sdkRoot "platforms\android-36\android.jar"))) {
    throw "SDK Android 36 introuvable dans $sdkRoot"
}
if (-not (Test-Path (Join-Path $root ".android-private\signing.properties"))) {
    throw "Configuration de signature privee introuvable"
}

$env:JAVA_HOME = $javaRoot.FullName
$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot
$env:GRADLE_USER_HOME = Join-Path $root ".android-build\gradle-home"

& $node (Join-Path $root "tools\prepare-mobile.mjs")
& $node (Join-Path $root "node_modules\@capacitor\cli\bin\capacitor") sync android
if ($python) {
    & $python (Join-Path $root "tools\generate-icons.py")
}
& (Join-Path $androidRoot "gradlew.bat") -p $androidRoot assembleRelease

$source = Join-Path $androidRoot "app\build\outputs\apk\release\app-release.apk"
$downloads = Join-Path $root "downloads"
$target = Join-Path $downloads "Cisco-CLI-Lexique-Android-v1.1.0.apk"
New-Item -ItemType Directory -Force -Path $downloads | Out-Null
Copy-Item -LiteralPath $source -Destination $target -Force

$hash = (Get-FileHash -Algorithm SHA256 $target).Hash
[System.IO.File]::WriteAllText(
    (Join-Path $downloads "Cisco-CLI-Lexique-Android-v1.1.0.sha256.txt"),
    "$hash  Cisco-CLI-Lexique-Android-v1.1.0.apk`r`n",
    [System.Text.UTF8Encoding]::new($false)
)

Write-Output "APK genere : $target"
Write-Output "SHA256 : $hash"
