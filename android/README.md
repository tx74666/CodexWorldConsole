# Android prototype

This directory contains a minimal, security-restricted WebView shell. It is not part of the Windows release workflow and does not bundle the Python service or the live Codex World assets.

The app version is read from the repository-level `app-manifest.json`. Configure a hosted HTTPS console at build time:

```text
gradle assembleDebug -PworldConsoleUrl=https://console.example/
```

Plain HTTP is rejected by default. A development-only endpoint can be enabled explicitly with `-PworldConsoleAllowCleartext=true`; do not use that setting for production builds.

The repository currently has no Gradle wrapper, signing configuration, emulator tests, or Android release job. Treat this module as a prototype until those delivery requirements are added.
