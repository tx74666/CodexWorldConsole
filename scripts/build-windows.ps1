param(
  [string]$Version = "0.3.1",
  [string]$OutputDir = "release",
  [string]$Python = "python"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Version = $Version.Trim().TrimStart("v")
if ($Version -notmatch '^\d+\.\d+\.\d+$') {
  throw "Version must use semantic versioning, for example 0.2.0."
}
if (-not [System.IO.Path]::IsPathRooted($OutputDir)) {
  $OutputDir = Join-Path $ProjectRoot $OutputDir
}
$OutputDir = [System.IO.Path]::GetFullPath($OutputDir)
$BuildRoot = Join-Path $ProjectRoot "build\world-installer"

function Remove-SafeBuildDirectory {
  param([string]$Path)
  $full = [System.IO.Path]::GetFullPath($Path)
  $root = [System.IO.Path]::GetFullPath($ProjectRoot).TrimEnd('\') + '\'
  if (-not $full.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove a directory outside the project: $full"
  }
  if (Test-Path -LiteralPath $full) {
    Remove-Item -LiteralPath $full -Recurse -Force
  }
}

function Resolve-InnoCompiler {
  $candidates = @(
    $env:INNO_SETUP_COMPILER,
    (Join-Path $ProjectRoot "..\.tools\Inno Setup 7\ISCC.exe"),
    "C:\Program Files\Inno Setup 7\ISCC.exe",
    "C:\Program Files (x86)\Inno Setup 7\ISCC.exe",
    "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
  ) | Where-Object { $_ }
  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate) {
      return (Resolve-Path -LiteralPath $candidate).Path
    }
  }
  throw "Inno Setup compiler was not found. Install Inno Setup 7 or set INNO_SETUP_COMPILER."
}

Remove-SafeBuildDirectory -Path $BuildRoot
New-Item -ItemType Directory -Force -Path $BuildRoot, $OutputDir | Out-Null

@(
  "Codex-World-*.zip",
  "Codex-World-*.apk",
  "Codex-World-*.sha256",
  "Codex-World-Setup-x64.exe",
  "update-manifest.json"
) | ForEach-Object {
  Get-ChildItem -LiteralPath $OutputDir -File -Filter $_ -ErrorAction SilentlyContinue |
    Remove-Item -Force
}

$ManifestPath = Join-Path $BuildRoot "app-manifest.json"
$Manifest = [ordered]@{
  name = "Codex World"
  version = $Version
  repository = "tx74666/CodexWorldConsole"
  channel = "stable"
  installMode = "installed"
  edition = "windows-x64"
}
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($ManifestPath, ($Manifest | ConvertTo-Json -Depth 5) + [Environment]::NewLine, $Utf8NoBom)

$DataItems = @(
  @{ Source = $ManifestPath; Destination = "." },
  @{ Source = "index.html"; Destination = "." },
  @{ Source = "app.js"; Destination = "." },
  @{ Source = "styles.css"; Destination = "." },
  @{ Source = "README.md"; Destination = "." },
  @{ Source = "Earth-taskbar-natural-20260521.ico"; Destination = "." },
  @{ Source = "Earth-taskbar-natural-20260521.png"; Destination = "." },
  @{ Source = "bootstrap"; Destination = "bootstrap" },
  @{ Source = "wallpapers"; Destination = "wallpapers" }
)

$PyInstallerArgs = @(
  "-m", "PyInstaller",
  "--noconfirm",
  "--clean",
  "--onedir",
  "--windowed",
  "--name", "Codex World",
  "--icon", (Join-Path $ProjectRoot "Earth-taskbar-natural-20260521.ico"),
  "--distpath", (Join-Path $BuildRoot "dist"),
  "--workpath", (Join-Path $BuildRoot "work"),
  "--specpath", (Join-Path $BuildRoot "spec")
)
foreach ($item in $DataItems) {
  $source = if ([System.IO.Path]::IsPathRooted($item.Source)) { $item.Source } else { Join-Path $ProjectRoot $item.Source }
  if (Test-Path -LiteralPath $source) {
    $PyInstallerArgs += @("--add-data", "$source;$($item.Destination)")
  }
}
$PyInstallerArgs += (Join-Path $ProjectRoot "world_console.py")

& $Python @PyInstallerArgs
if ($LASTEXITCODE -ne 0) {
  throw "PyInstaller failed with exit code $LASTEXITCODE."
}

$AppDir = Join-Path $BuildRoot "dist\Codex World"
$AppExe = Join-Path $AppDir "Codex World.exe"
if (-not (Test-Path -LiteralPath $AppExe)) {
  throw "Codex World executable was not created."
}
@"
Codex World
Version: $Version

Installed through Codex-World-Setup-x64.exe.
Launch Codex World from the desktop or Start menu.
"@ | Set-Content -LiteralPath (Join-Path $AppDir "README-FIRST.txt") -Encoding UTF8

$TargetInstaller = Join-Path $OutputDir "Codex-World-Setup-x64.exe"
if (Test-Path -LiteralPath $TargetInstaller) {
  Remove-Item -LiteralPath $TargetInstaller -Force
}
$Iscc = Resolve-InnoCompiler
$Iss = Join-Path $ProjectRoot "installer\CodexWorld.iss"
& $Iscc "/DAppVersion=$Version" "/DSourceDir=$AppDir" "/DOutputDir=$OutputDir" $Iss
if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $TargetInstaller)) {
  throw "Inno Setup failed to create $TargetInstaller."
}

Write-Host "Created $TargetInstaller"
