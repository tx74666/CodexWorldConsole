from copy import deepcopy
from datetime import datetime, timezone
import unittest

from scripts.market_snapshot_validation import REQUIRED_CURRENCY_CODES, validate_market_payload, validate_world_payload


def valid_snapshot():
    now = datetime.now(timezone.utc)
    return {
        "schemaVersion": 11,
        "updated": now.isoformat(),
        "assets": [{
            "id": f"asset-{index}",
            "symbol": f"SYM{index}",
            "name": f"Asset {index}",
            "group": "companies",
            "value": index + 1.0,
            "marketCap": (index + 1.0) * 1_000_000,
            "changePct": index / 10,
            "sparkline": [{"label": "1", "value": 1.0}, {"label": "2", "value": 2.0}],
        } for index in range(90)],
        "currencies": {
            "date": now.date().isoformat(),
            "quotes": [
                {"code": code, "quotePerUsd": index + 1.0, "usdValue": 1.0 / (index + 1.0)}
                for index, code in enumerate(sorted(REQUIRED_CURRENCY_CODES))
            ],
        },
    }


class MarketSnapshotValidationTests(unittest.TestCase):
    def test_complete_snapshot_passes_shared_validation(self):
        self.assertEqual(validate_market_payload(valid_snapshot(), max_age_days=1), (90, 10))

    def test_duplicate_ids_and_non_finite_quotes_are_rejected(self):
        duplicate = valid_snapshot()
        duplicate["assets"][1]["id"] = duplicate["assets"][0]["id"]
        with self.assertRaisesRegex(AssertionError, "duplicated"):
            validate_market_payload(duplicate)

        non_finite = deepcopy(valid_snapshot())
        non_finite["currencies"]["quotes"][0]["quotePerUsd"] = float("inf")
        non_finite["currencies"]["quotes"][0]["usdValue"] = float("nan")
        with self.assertRaisesRegex(AssertionError, "invalid values"):
            validate_market_payload(non_finite)

    def test_invalid_asset_content_is_rejected(self):
        mutations = {
            "missing symbol": lambda asset: asset.update(symbol=""),
            "invalid group": lambda asset: asset.update(group="unknown"),
            "missing value": lambda asset: asset.update(value=None),
            "non-positive market cap": lambda asset: asset.update(marketCap=0),
            "non-finite change": lambda asset: asset.update(changePct=float("nan")),
            "broken sparkline": lambda asset: asset.update(sparkline=[{"value": None}]),
        }
        for label, mutate in mutations.items():
            with self.subTest(label=label):
                snapshot = valid_snapshot()
                mutate(snapshot["assets"][0])
                with self.assertRaises(AssertionError):
                    validate_market_payload(snapshot)

    def test_world_features_require_names_and_polygon_coordinates(self):
        world = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {"name": f"Country {index}"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [0.0, 0.0]]],
                },
            } for index in range(170)],
        }
        self.assertEqual(validate_world_payload(world), 170)

        broken = deepcopy(world)
        broken["features"][0]["geometry"]["coordinates"] = []
        with self.assertRaisesRegex(AssertionError, "geometry"):
            validate_world_payload(broken)


if __name__ == "__main__":
    unittest.main()
