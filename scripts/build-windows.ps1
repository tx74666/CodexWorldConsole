param(
  [string]$Version = "dev"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$dist = Join-Path $root "dist"
$release = Join-Path $root "release"
$appName = "Codex World Console"
$icon = Join-Path $root "Earth-taskbar-natural-20260521.ico"

Set-Location $root
if (Test-Path $dist) { Remove-Item -LiteralPath $dist -Recurse -Force }
if (Test-Path $release) { Remove-Item -LiteralPath $release -Recurse -Force }
New-Item -ItemType Directory -Force -Path $release | Out-Null

python -m pip install --upgrade pip
python -m pip install pyinstaller

$addData = @(
  "index.html;.",
  "app.js;.",
  "styles.css;.",
  "Earth-taskbar-natural-20260521.ico;.",
  "Earth-taskbar-natural-20260521.png;.",
  "wallpapers;wallpapers"
)

$args = @(
  "--noconfirm",
  "--clean",
  "--onedir",
  "--windowed",
  "--name", $appName,
  "--icon", $icon
)

foreach ($item in $addData) {
  if (Test-Path (Join-Path $root ($item -split ";")[0])) {
    $args += @("--add-data", $item)
  }
}

$args += "world_console.py"
python -m PyInstaller @args

$packageRoot = Join-Path $dist $appName
$readme = Join-Path $packageRoot "README-FIRST.txt"
@"
Codex World Console
Version: $Version

Run:
  Double-click "Codex World Console.exe".

The app starts a local server and opens the console in an app-style browser window.
No install step is required after unzipping.
"@ | Set-Content -Encoding UTF8 -Path $readme

$zip = Join-Path $release "Codex-World-Console-Windows-$Version.zip"
Compress-Archive -Path (Join-Path $packageRoot "*") -DestinationPath $zip -Force
Write-Host "Created $zip"
