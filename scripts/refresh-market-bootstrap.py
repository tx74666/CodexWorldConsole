"""Refresh the public market bootstrap deliberately, outside the release job."""

import argparse
import gzip
import io
import json
import os
from pathlib import Path
import sys
import tempfile

try:
    from market_snapshot_validation import validate_market_payload
except ModuleNotFoundError:
    from scripts.market_snapshot_validation import validate_market_payload


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def read_existing(path):
    if not path.is_file():
        return None
    with gzip.open(path, "rt", encoding="utf-8") as source:
        payload = json.load(source)
    return payload if isinstance(payload, dict) else None


def write_deterministic_gzip(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=f".{path.name}.",
        suffix=".tmp",
        dir=str(path.parent),
    )
    temporary = Path(temporary_name)
    try:
        with os.fdopen(descriptor, "wb") as raw:
            with gzip.GzipFile(filename="", mode="wb", fileobj=raw, compresslevel=9, mtime=0) as compressed:
                with io.TextIOWrapper(compressed, encoding="utf-8", newline="\n") as text:
                    json.dump(payload, text, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true", help="replace bootstrap/markets.json.gz after validation")
    parser.add_argument("--output", type=Path, default=ROOT / "bootstrap" / "markets.json.gz")
    args = parser.parse_args()

    with tempfile.TemporaryDirectory(prefix="codex-world-market-refresh-") as data_directory:
        os.environ["CODEX_WORLD_DATA_DIR"] = data_directory
        import world_console

        previous = read_existing(args.output)
        payload = world_console.build_live_market_payload(previous)
        if not isinstance(payload, dict):
            raise RuntimeError("live market sources did not produce a payload")
        payload = world_console.compact_market_payload(payload)
        payload["schemaVersion"] = world_console.MARKET_CACHE_SCHEMA_VERSION
        payload["stale"] = False

    try:
        asset_count, quote_count = validate_market_payload(
            payload,
            max_age_days=2,
            expected_schema=world_console.MARKET_CACHE_SCHEMA_VERSION,
        )
    except AssertionError as exc:
        raise RuntimeError(f"refusing invalid market snapshot: {exc}") from exc

    print(f"Fetched {asset_count} assets and {quote_count} currency quotes; updated={payload.get('updated')}")
    if not args.write:
        print("Dry run only. Re-run with --write to replace the bootstrap snapshot.")
        return
    write_deterministic_gzip(args.output, payload)
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
