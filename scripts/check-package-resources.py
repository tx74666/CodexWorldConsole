import argparse
import gzip
import hashlib
import json
import struct
from pathlib import Path

try:
    from market_snapshot_validation import validate_market_payload, validate_world_payload
except ModuleNotFoundError:
    from scripts.market_snapshot_validation import validate_market_payload, validate_world_payload


ROOT = Path(__file__).resolve().parents[1]
BOOTSTRAP_FILES = ("world.geojson", "markets.json")
CORE_RESOURCES = (
    "index.html",
    "app.js",
    "styles.css",
    "README.md",
    "Earth-taskbar-natural-20260521.ico",
    "Earth-taskbar-natural-20260521.png",
)
PACKAGED_WALLPAPERS = {
    "blue-lake-boats.jpg",
    "calm-mountain-lake.jpg",
    "palm-sky-reflection.jpg",
    "quiet-forest-aerial.jpg",
    "snow-water-mountains.jpg",
    "soft-mountain-sun.jpg",
}
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


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def find_unique(directory, name):
    matches = [path for path in directory.rglob(name) if path.is_file()]
    require(len(matches) == 1, f"expected exactly one packaged {name}, found {len(matches)}")
    return matches[0]


def main():
    source_manifest = json.loads((ROOT / "app-manifest.json").read_text(encoding="utf-8"))
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--app-dir",
        type=Path,
        default=ROOT / "build" / "world-installer" / "dist" / "Codex World",
    )
    parser.add_argument("--expected-version", default=str(source_manifest.get("version") or ""))
    parser.add_argument("--source-only", action="store_true")
    parser.add_argument("--max-market-age-days", type=float, default=0)
    args = parser.parse_args()

    check_ico(ROOT / "Earth-taskbar-natural-20260521.ico")
    world = read_bootstrap(ROOT / "bootstrap", "world.geojson")
    markets = read_bootstrap(ROOT / "bootstrap", "markets.json")
    validate_world_payload(world)
    validate_market_payload(markets, max_age_days=args.max_market_age_days)
    currencies = markets.get("currencies") if isinstance(markets.get("currencies"), dict) else {}
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
    require('Type: filesandordirs; Name: "{#UserDataDir}\\cache"' in installer, "local cache cleanup is missing")
    require('Type: filesandordirs; Name: "{#UserDataDir}\\logs"' in installer, "local log cleanup is missing")
    require('Type: filesandordirs; Name: "{#UserDataDir}"' not in installer, "uninstall must preserve user configuration")
    require('Type: filesandordirs; Name: "{app}"' not in installer, "uninstaller contains an unsafe recursive app-directory delete")

    if args.source_only:
        print(f"PASS source resources ({len(markets['assets'])} market assets, {len(currencies['quotes'])} currency quotes)")
        return

    app_dir = args.app_dir.resolve()
    require((app_dir / "Codex World.exe").is_file(), f"packaged EXE is missing: {app_dir}")
    manifests = list(app_dir.rglob("app-manifest.json"))
    require(len(manifests) == 1, "packaged manifest is missing or duplicated")
    manifest = json.loads(manifests[0].read_text(encoding="utf-8"))
    expected_manifest = {
        "name": "Codex World",
        "version": args.expected_version,
        "repository": "tx74666/CodexWorldConsole",
        "channel": "stable",
        "installMode": "installed",
        "edition": "windows-x64",
    }
    require(
        all(manifest.get(key) == value for key, value in expected_manifest.items()),
        f"unexpected packaged manifest: {manifest}",
    )

    for name in CORE_RESOURCES:
        source_path = ROOT / name
        packaged_path = find_unique(app_dir, name)
        require(sha256(source_path) == sha256(packaged_path), f"packaged {name} differs from source")

    packaged_bootstrap = next((path.parent for path in app_dir.rglob("world.geojson.gz") if path.parent.name == "bootstrap"), None)
    require(packaged_bootstrap is not None, "bootstrap directory was not packaged")
    packaged_payloads = {name: read_bootstrap(packaged_bootstrap, name) for name in BOOTSTRAP_FILES}
    for name in BOOTSTRAP_FILES:
        require(
            sha256(ROOT / "bootstrap" / f"{name}.gz") == sha256(packaged_bootstrap / f"{name}.gz"),
            f"packaged {name}.gz differs from source",
        )
    require(
        packaged_payloads["markets.json"].get("updated") == markets.get("updated"),
        "packaged market bootstrap does not match the release snapshot",
    )
    require(not (packaged_bootstrap / "market_history.json.gz").exists(), "packaged app contains stale market history")

    image_extensions = {".jpg", ".jpeg", ".png", ".webp"}
    wallpapers = {
        path.name
        for path in app_dir.rglob("*")
        if path.is_file() and "wallpapers" in path.parts and path.suffix.lower() in image_extensions
    }
    require(wallpapers == PACKAGED_WALLPAPERS, f"unexpected packaged wallpaper set: {sorted(wallpapers)}")
    for name in PACKAGED_WALLPAPERS:
        packaged_wallpaper = find_unique(app_dir, name)
        require(
            sha256(ROOT / "wallpapers" / name) == sha256(packaged_wallpaper),
            f"packaged wallpaper differs from source: {name}",
        )
    require(any(path.name == "SOURCES.md" and "wallpapers" in path.parts for path in app_dir.rglob("SOURCES.md")), "wallpaper sources are missing")
    require(not list(app_dir.rglob(".world-console.local.json")), "device-local configuration entered the package")

    print(
        f"PASS World package resources ({len(wallpapers)} wallpapers, "
        f"{len(markets['assets'])} market assets, {len(currencies['quotes'])} currency quotes)"
    )


if __name__ == "__main__":
    main()
