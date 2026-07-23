import argparse
from datetime import datetime, timedelta, timezone
import gzip
import json
import struct
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BOOTSTRAP_FILES = ("world.geojson", "markets.json")


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def check_ico(path):
    payload = path.read_bytes()
    require(len(payload) >= 6, f"icon is truncated: {path}")
    reserved, icon_type, count = struct.unpack_from("<HHH", payload, 0)
    require(reserved == 0 and icon_type == 1 and count > 0, f"icon directory is invalid: {path}")
    for index in range(count):
        size, offset = struct.unpack_from("<II", payload, 6 + index * 16 + 8)
        require(size > 0 and offset + size <= len(payload), f"icon entry {index} points beyond the file")


def read_bootstrap(directory, name):
    path = directory / f"{name}.gz"
    require(path.is_file(), f"bootstrap resource is missing: {path}")
    with gzip.open(path, "rt", encoding="utf-8") as source:
        return json.load(source)


def main():
    source_manifest = json.loads((ROOT / "app-manifest.json").read_text(encoding="utf-8"))
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--app-dir",
        type=Path,
        default=ROOT / "build" / "world-installer" / "dist" / "Codex World",
    )
    parser.add_argument("--expected-version", default=str(source_manifest.get("version") or ""))
    args = parser.parse_args()

    check_ico(ROOT / "Earth-taskbar-natural-20260521.ico")
    world = read_bootstrap(ROOT / "bootstrap", "world.geojson")
    markets = read_bootstrap(ROOT / "bootstrap", "markets.json")
    require(world.get("type") == "FeatureCollection" and len(world.get("features", [])) >= 170, "world bootstrap is incomplete")
    require(markets.get("schemaVersion") == 11 and len(markets.get("assets", [])) >= 50, "market bootstrap is incomplete")
    market_updated = datetime.fromisoformat(str(markets.get("updated") or "").replace("Z", "+00:00"))
    market_age = datetime.now(timezone.utc) - market_updated.astimezone(timezone.utc)
    require(-timedelta(minutes=5) <= market_age <= timedelta(days=7), f"market bootstrap is stale ({market_age})")
    require(not (ROOT / "bootstrap" / "market_history.json.gz").exists(), "a stale market-history snapshot must not enter releases")

    installer = (ROOT / "installer" / "CodexWorld.iss").read_text(encoding="utf-8")
    desktop_line = next(
        (line for line in installer.splitlines() if 'Name: "{autodesktop}\\Codex World"' in line),
        "",
    )
    require(desktop_line, "desktop shortcut is missing from Setup")
    require("Tasks:" not in desktop_line, "desktop shortcut is optional instead of guaranteed")
    require('IconFilename: "{app}\\Codex World.exe"' in desktop_line, "shortcut icon is not pinned to the installed EXE")
    require("Check: ShouldCreateDesktopShortcut" in desktop_line, "desktop shortcut is overwritten during upgrades")
    require(
        "not FileExists(ExpandConstant('{autodesktop}\\Codex World.lnk'))" in installer,
        "desktop shortcut preservation check is missing",
    )
    require('Name: "{group}\\Uninstall Codex World"; Filename: "{uninstallexe}"' in installer, "Start menu uninstaller is missing")
    require('#define UserDataDir "{localappdata}\\CodexWorld"' in installer, "default World data directory is not device-local")
    require('Type: filesandordirs; Name: "{#UserDataDir}"' in installer, "local World data is not removed on uninstall")
    require('Type: filesandordirs; Name: "{app}"' not in installer, "uninstaller contains an unsafe recursive app-directory delete")

    app_dir = args.app_dir.resolve()
    require((app_dir / "Codex World.exe").is_file(), f"packaged EXE is missing: {app_dir}")
    manifests = list(app_dir.rglob("app-manifest.json"))
    require(len(manifests) == 1, "packaged manifest is missing or duplicated")
    manifest = json.loads(manifests[0].read_text(encoding="utf-8"))
    require(manifest.get("version") == args.expected_version, f"unexpected packaged version: {manifest.get('version')}")

    packaged_bootstrap = next((path.parent for path in app_dir.rglob("world.geojson.gz") if path.parent.name == "bootstrap"), None)
    require(packaged_bootstrap is not None, "bootstrap directory was not packaged")
    packaged_payloads = {name: read_bootstrap(packaged_bootstrap, name) for name in BOOTSTRAP_FILES}
    require(
        packaged_payloads["markets.json"].get("updated") == markets.get("updated"),
        "packaged market bootstrap does not match the release snapshot",
    )
    require(not (packaged_bootstrap / "market_history.json.gz").exists(), "packaged app contains stale market history")

    image_extensions = {".jpg", ".jpeg", ".png", ".webp"}
    wallpapers = [
        path
        for path in app_dir.rglob("*")
        if path.is_file() and "wallpapers" in path.parts and path.suffix.lower() in image_extensions
    ]
    require(len(wallpapers) >= 8, f"built-in wallpapers are missing ({len(wallpapers)} found)")
    require(not list(app_dir.rglob(".world-console.local.json")), "device-local configuration entered the package")

    print(f"PASS World package resources ({len(wallpapers)} wallpapers, {len(markets['assets'])} market assets)")


if __name__ == "__main__":
    main()
