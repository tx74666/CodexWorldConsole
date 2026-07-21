#ifndef AppVersion
  #define AppVersion "0.3.1"
#endif
#ifndef SourceDir
  #define SourceDir "..\build\world-installer\dist\Codex World"
#endif
#ifndef OutputDir
  #define OutputDir "..\release"
#endif
#ifndef UserDataDir
  #define UserDataDir "{localappdata}\CodexWorld"
#endif

[Setup]
AppId={{9E6806E6-855B-44D7-BE2E-4857245750BD}
AppName=Codex World
AppVersion={#AppVersion}
AppVerName=Codex World {#AppVersion}
AppPublisher=tx74666
AppPublisherURL=https://github.com/tx74666/CodexWorldConsole
AppSupportURL=https://github.com/tx74666/CodexWorldConsole/issues
AppUpdatesURL=https://github.com/tx74666/CodexWorldConsole/releases/latest
DefaultDirName={localappdata}\Programs\Codex World
DefaultGroupName=Codex World
OutputDir={#OutputDir}
OutputBaseFilename=Codex-World-Setup-x64
SetupIconFile=..\Earth-taskbar-natural-20260521.ico
UninstallDisplayIcon={app}\Codex World.exe
SetupArchitecture=x64
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=lowest
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
ShowLanguageDialog=yes
UsePreviousLanguage=yes
UsePreviousAppDir=yes
DisableDirPage=no
DisableProgramGroupPage=yes
CloseApplications=yes
RestartApplications=no
VersionInfoVersion={#AppVersion}
VersionInfoProductName=Codex World
VersionInfoDescription=Codex World Setup for Windows x64

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "chinesesimp"; MessagesFile: "compiler:Languages\ChineseSimplified.isl"

[Files]
Source: "{#SourceDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\Codex World"; Filename: "{app}\Codex World.exe"; WorkingDir: "{app}"; IconFilename: "{app}\Codex World.exe"; IconIndex: 0
Name: "{group}\Uninstall Codex World"; Filename: "{uninstallexe}"
Name: "{autodesktop}\Codex World"; Filename: "{app}\Codex World.exe"; WorkingDir: "{app}"; IconFilename: "{app}\Codex World.exe"; IconIndex: 0

[Registry]
Root: HKCU; Subkey: "Software\Codex\Codex World"; ValueType: string; ValueName: "InstallPath"; ValueData: "{app}"; Flags: uninsdeletekey
Root: HKCU; Subkey: "Software\Codex\Codex World"; ValueType: string; ValueName: "Version"; ValueData: "{#AppVersion}"

[Run]
Filename: "{app}\Codex World.exe"; Description: "{cm:LaunchProgram,Codex World}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: "{#UserDataDir}"
Type: filesandordirs; Name: "{app}\cache"
