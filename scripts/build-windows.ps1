param(
  [string]$Version = "",
  [string]$OutputDir = "release",
  [string]$Python = "python",
  [string]$ExpectedPyInstallerVersion = ""
)

$ErrorActionPreference = "Stop"
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$SourceManifestPath = Join-Path $ProjectRoot "app-manifest.json"
$SourceManifest = Get-Content -LiteralPath $SourceManifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
$ManifestVersion = [string]$SourceManifest.version
$RequestedVersion = $Version.Trim().TrimStart("v")
if ([string]::IsNullOrWhiteSpace($RequestedVersion)) {
  $RequestedVersion = $ManifestVersion
}
$Version = $RequestedVersion
$Version = $Version.Trim().TrimStart("v")
if ($Version -notmatch '^\d+\.\d+\.\d+$') {
  throw "Version must use semantic versioning, for example 0.2.0."
}
$VersionParts = foreach ($Part in $Version.Split('.')) {
  [long]$ParsedPart = 0
  if (-not [long]::TryParse($Part, [ref]$ParsedPart) -or $ParsedPart -gt 65535) {
    throw "Each Windows version component must be between 0 and 65535."
  }
  $ParsedPart
}
if ($Version -ne $ManifestVersion) {
  throw "Requested version $Version does not match app-manifest.json version $ManifestVersion."
}
if (-not [System.IO.Path]::IsPathRooted($OutputDir)) {
  $OutputDir = Join-Path $ProjectRoot $OutputDir
}
$OutputDir = [System.IO.Path]::GetFullPath($OutputDir)
if (
  $OutputDir.TrimEnd('\') -eq [System.IO.Path]::GetPathRoot($OutputDir).TrimEnd('\') -or
  $OutputDir.TrimEnd('\') -eq $ProjectRoot.TrimEnd('\')
) {
  throw "OutputDir must be a dedicated subdirectory, not a drive or project root: $OutputDir"
}
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

$MutexBytes = [System.Text.Encoding]::UTF8.GetBytes($ProjectRoot.ToLowerInvariant())
$MutexHasher = [System.Security.Cryptography.SHA256]::Create()
try {
  $MutexHash = [System.BitConverter]::ToString($MutexHasher.ComputeHash($MutexBytes)).Replace("-", "").Substring(0, 20)
} finally {
  $MutexHasher.Dispose()
}
$BuildMutex = [System.Threading.Mutex]::new($false, "Local\CodexWorldBuild-$MutexHash")
$BuildMutexAcquired = $false
try {
  try {
    $BuildMutexAcquired = $BuildMutex.WaitOne(0)
  } catch [System.Threading.AbandonedMutexException] {
    $BuildMutexAcquired = $true
  }
  if (-not $BuildMutexAcquired) {
    throw "Another Codex World build is already using the shared output directories."
  }

  $PythonInfoJson = & $Python -c "import json, platform, struct, sys; print(json.dumps({'version': platform.python_version(), 'bits': struct.calcsize('P') * 8, 'majorMinor': f'{sys.version_info.major}.{sys.version_info.minor}'}))"
  if ($LASTEXITCODE -ne 0) { throw "Python preflight failed with exit code $LASTEXITCODE." }
  $PythonInfo = $PythonInfoJson | ConvertFrom-Json
  if ([int]$PythonInfo.bits -ne 64) { throw "Windows x64 packaging requires a 64-bit Python runtime." }
  if ([string]$PythonInfo.majorMinor -ne "3.12") { throw "Windows packaging requires Python 3.12; found $($PythonInfo.version)." }
  $PyInstallerVersion = (& $Python -c "import PyInstaller; print(PyInstaller.__version__)").Trim()
  if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($PyInstallerVersion)) {
    throw "PyInstaller is not available in the selected Python runtime."
  }
  if (-not [string]::IsNullOrWhiteSpace($ExpectedPyInstallerVersion) -and $PyInstallerVersion -ne $ExpectedPyInstallerVersion) {
    throw "PyInstaller $ExpectedPyInstallerVersion is required; found $PyInstallerVersion."
  }
  Write-Host "Build runtime: Python $($PythonInfo.version) x64, PyInstaller $PyInstallerVersion"

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
  @{ Source = "wallpapers\README.txt"; Destination = "wallpapers" },
  @{ Source = "wallpapers\SOURCES.md"; Destination = "wallpapers" },
  @{ Source = "wallpapers\blue-lake-boats.jpg"; Destination = "wallpapers" },
  @{ Source = "wallpapers\calm-mountain-lake.jpg"; Destination = "wallpapers" },
  @{ Source = "wallpapers\palm-sky-reflection.jpg"; Destination = "wallpapers" },
  @{ Source = "wallpapers\quiet-forest-aerial.jpg"; Destination = "wallpapers" },
  @{ Source = "wallpapers\snow-water-mountains.jpg"; Destination = "wallpapers" },
  @{ Source = "wallpapers\soft-mountain-sun.jpg"; Destination = "wallpapers" }
)

$VersionTuple = "($($VersionParts[0]), $($VersionParts[1]), $($VersionParts[2]), 0)"
$VersionInfoPath = Join-Path $BuildRoot "version-info.txt"
@"
VSVersionInfo(
  ffi=FixedFileInfo(
    filevers=$VersionTuple,
    prodvers=$VersionTuple,
    mask=0x3f,
    flags=0x0,
    OS=0x40004,
    fileType=0x1,
    subtype=0x0,
    date=(0, 0)
  ),
  kids=[
    StringFileInfo([
      StringTable(
        '040904B0',
        [StringStruct('CompanyName', 'Codex World Project'),
         StringStruct('FileDescription', 'Codex World'),
         StringStruct('FileVersion', '$Version'),
         StringStruct('InternalName', 'Codex World'),
         StringStruct('OriginalFilename', 'Codex World.exe'),
         StringStruct('ProductName', 'Codex World'),
         StringStruct('ProductVersion', '$Version')]
      )
    ]),
    VarFileInfo([VarStruct('Translation', [1033, 1200])])
  ]
)
"@ | Set-Content -LiteralPath $VersionInfoPath -Encoding UTF8

$PyInstallerArgs = @(
  "-m", "PyInstaller",
  "--noconfirm",
  "--clean",
  "--onedir",
  "--windowed",
  "--name", "Codex World",
  "--icon", (Join-Path $ProjectRoot "Earth-taskbar-natural-20260521.ico"),
  "--version-file", $VersionInfoPath,
  "--distpath", (Join-Path $BuildRoot "dist"),
  "--workpath", (Join-Path $BuildRoot "work"),
  "--specpath", (Join-Path $BuildRoot "spec")
)
foreach ($item in $DataItems) {
  $source = if ([System.IO.Path]::IsPathRooted($item.Source)) { $item.Source } else { Join-Path $ProjectRoot $item.Source }
  if (-not (Test-Path -LiteralPath $source)) {
    throw "Required package resource is missing: $source"
  }
  $PyInstallerArgs += @("--add-data", "$source;$($item.Destination)")
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
$IsccIdentity = (& $Iscc /? 2>&1 | Out-String)
if ($IsccIdentity -notmatch 'Inno Setup 7 Command-Line Compiler') {
  throw "Inno Setup 7 is required at $Iscc."
}
Write-Host "Installer compiler: Inno Setup 7"
$Iss = Join-Path $ProjectRoot "installer\CodexWorld.iss"
& $Iscc "/DAppVersion=$Version" "/DSourceDir=$AppDir" "/DOutputDir=$OutputDir" $Iss
if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $TargetInstaller)) {
  throw "Inno Setup failed to create $TargetInstaller."
}

$InstallerHash = (Get-FileHash -LiteralPath $TargetInstaller -Algorithm SHA256).Hash.ToUpperInvariant()
$ChecksumPath = Join-Path $OutputDir "Codex-World-Setup-x64.exe.sha256"
[System.IO.File]::WriteAllText(
  $ChecksumPath,
  "$InstallerHash *Codex-World-Setup-x64.exe$([Environment]::NewLine)",
  $Utf8NoBom
)

  Write-Host "Created $TargetInstaller"
  Write-Host "SHA-256 $InstallerHash"
} finally {
  if ($BuildMutexAcquired) { $BuildMutex.ReleaseMutex() }
  $BuildMutex.Dispose()
}
