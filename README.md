# Codex World

Codex World is a local world-event and markets console.

## Downloads

Choose your device, download one file, then open it.

| Device | Download | Open |
| --- | --- | --- |
| Windows | [Desktop ZIP](https://github.com/tx74666/CodexWorldConsole/releases/download/v0.1.2/Codex-World-Console-Windows-v0.1.2.zip) | Unzip it, then run `Codex World.exe`. |
| Android | [APK](https://github.com/tx74666/CodexWorldConsole/releases/download/v0.1.2/Codex-World-Console-Android-v0.1.2.apk) | Install the APK, then open Codex World. |

All downloads are also on the [v0.1.2 release page](https://github.com/tx74666/CodexWorldConsole/releases/tag/v0.1.2).

Need the source code instead? Use GitHub's green **Code** button, then **Download ZIP**.

## First Run

Windows starts a local server automatically and opens the console window.

The Android APK is a WebView preview build with bundled console files. For a hosted Android build, set `WORLD_CONSOLE_URL` before building.

## Run Locally

Requirements:

- Windows 10/11
- Python 3.11 or newer
- Microsoft Edge or Google Chrome

Run:

```powershell
python world_console.py
```

Or double-click:

```text
Start-WorldConsole.vbs
```

The default local URL is:

```text
http://127.0.0.1:8797/index.html
```

## Publish Downloads On GitHub

1. Push this folder to a GitHub repository.
2. Create a version tag, for example:

```powershell
git tag v0.1.0
git push origin v0.1.0
```

3. GitHub Actions will build:

- Windows desktop zip
- Android APK

4. The tag build publishes both files to GitHub Releases automatically.

Manual builds are also available from **Actions -> Build downloads -> Run workflow**. Manual builds upload artifacts but only tag builds create a public Release.

## Static Preview Check

The `Pages` workflow validates that the static UI files used by the Android WebView preview are present. Release downloads work without enabling GitHub Pages. The full dynamic app still needs the local Python backend used by the desktop build.

## Notes

- The app itself uses only the Python standard library.
- Desktop release packaging uses PyInstaller in GitHub Actions.
- Android APKs are installable but not Play Store release-signed. Add a signing keystore workflow later if you want production Android releases.
