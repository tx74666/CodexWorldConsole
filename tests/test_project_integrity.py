import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]


class ProjectIntegrityTests(unittest.TestCase):
    def test_version_has_one_repository_source(self):
        manifest_version = json.loads((ROOT / "app-manifest.json").read_text(encoding="utf-8"))["version"]
        package_version = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))["version"]
        build_script = (ROOT / "scripts" / "build-windows.ps1").read_text(encoding="utf-8")
        android_build = (ROOT / "android" / "app" / "build.gradle").read_text(encoding="utf-8")

        self.assertEqual(package_version, manifest_version)
        self.assertIn("app-manifest.json", build_script)
        self.assertIn('file("../../app-manifest.json")', android_build)
        self.assertNotIn('versionName "0.', android_build)

    def test_release_pipeline_is_tag_only_and_pinned(self):
        workflow = (ROOT / ".github" / "workflows" / "release.yml").read_text(encoding="utf-8")
        self.assertNotIn("workflow_dispatch", workflow)
        self.assertIn('"pyinstaller==6.22.2"', workflow)
        self.assertIn("5AD54CA3DEF786F8F4212552E54CC6D8D61329E2D24A1CFEE0571D42C2684FF1", workflow)
        self.assertIn('gh release create "$RELEASE_TAG"', workflow)
        self.assertIn("Verify installed payload and installer metadata", workflow)
        self.assertIn("Installed app did not become ready", workflow)
        self.assertIn('throw "Smoke uninstall failed:', workflow)
        self.assertNotIn('Write-Warning "Smoke uninstall failed:', workflow)
        action_refs = re.findall(r"uses:\s+[^\s@]+@([^\s#]+)", workflow)
        self.assertTrue(action_refs)
        self.assertTrue(all(re.fullmatch(r"[0-9a-f]{40}", ref) for ref in action_refs))

    def test_installer_preserves_configuration_and_packages_allowlisted_wallpapers(self):
        installer = (ROOT / "installer" / "CodexWorld.iss").read_text(encoding="utf-8")
        build_script = (ROOT / "scripts" / "build-windows.ps1").read_text(encoding="utf-8")
        self.assertIn('Name: "{#UserDataDir}\\cache"', installer)
        self.assertNotIn('Name: "{#UserDataDir}"\n', installer)
        self.assertNotIn('Source = "wallpapers"', build_script)
        self.assertNotIn("kobayashi-dragon-maid-online.jpg", build_script)
        self.assertNotIn("elaina-wandering-witch-online.jpg", build_script)
        self.assertIn("Local\\CodexWorldBuild-", build_script)
        self.assertIn('"--version-file", $VersionInfoPath', build_script)
        self.assertFalse((ROOT / "wallpapers" / "kobayashi-dragon-maid-online.jpg").exists())
        self.assertFalse((ROOT / "wallpapers" / "elaina-wandering-witch-online.jpg").exists())

    def test_android_webview_defaults_are_restricted(self):
        manifest = (ROOT / "android" / "app" / "src" / "main" / "AndroidManifest.xml").read_text(encoding="utf-8")
        activity = (
            ROOT / "android" / "app" / "src" / "main" / "java" / "com" / "codex" / "worldconsole" / "MainActivity.java"
        ).read_text(encoding="utf-8")
        self.assertIn('android:allowBackup="false"', manifest)
        self.assertNotIn('android:usesCleartextTraffic="true"', manifest)
        self.assertIn("MIXED_CONTENT_NEVER_ALLOW", activity)
        self.assertIn("setAllowUniversalAccessFromFileURLs(false)", activity)
        self.assertIn("isAllowedInsideWebView", activity)
        self.assertIn("request.isForMainFrame()", activity)
        self.assertIn("request.hasGesture()", activity)
        android_build = (ROOT / "android" / "app" / "build.gradle").read_text(encoding="utf-8")
        self.assertIn("androidVersionCode < 1L", android_build)
        self.assertIn("androidVersionCode > 2100000000L", android_build)
        self.assertIn("versionCode androidVersionCode.intValue()", android_build)

    def test_validation_pipeline_builds_windows_before_release_tags(self):
        workflow = (ROOT / ".github" / "workflows" / "pages.yml").read_text(encoding="utf-8")
        self.assertIn("windows-package:", workflow)
        self.assertIn("build-windows.ps1", workflow)
        self.assertIn('ExpectedPyInstallerVersion "6.22.2"', workflow)

    def test_temperature_units_use_the_celsius_symbol(self):
        app = (ROOT / "app.js").read_text(encoding="utf-8")
        self.assertIn("function formatCelsius(value)", app)
        self.assertGreaterEqual(app.count("formatCelsius("), 10)
        self.assertNotRegex(
            app,
            r"\$\{Math\.round\((?:item\.temperature|temp)\)\}\s+C\b",
        )

    def test_import_does_not_create_or_seed_the_runtime_data_directory(self):
        with tempfile.TemporaryDirectory() as parent:
            data_directory = Path(parent) / "not-created"
            environment = os.environ.copy()
            environment["CODEX_WORLD_DATA_DIR"] = str(data_directory)
            completed = subprocess.run(
                [sys.executable, "-c", "import world_console"],
                cwd=ROOT,
                env=environment,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                timeout=15,
            )
            self.assertEqual(completed.returncode, 0, completed.stdout)
            self.assertFalse(data_directory.exists())


if __name__ == "__main__":
    unittest.main()
