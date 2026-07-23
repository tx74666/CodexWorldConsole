from datetime import datetime, timedelta, timezone
from pathlib import Path
import sys
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import world_console as world


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def intraday_points(end, count=60):
    start = end - timedelta(minutes=count - 1)
    return [
        {
            "label": moment.strftime("%m-%d %H:%M"),
            "date": moment.date().isoformat(),
            "time": moment.isoformat(),
            "value": 100 + index / 10,
        }
        for index in range(count)
        for moment in [start + timedelta(minutes=index)]
    ]


def main():
    now = datetime.now(timezone.utc)
    asset = {"symbol": "AAPL", "group": "companies", "marketCap": 3_000_000_000_000}
    old_points = intraday_points(now - timedelta(days=1))
    new_points = intraday_points(now)
    payload = {
        "source": "test",
        "updated": (now - timedelta(days=1)).isoformat(),
        "shortHistoryUpdatedAt": (now - timedelta(days=1)).isoformat(),
        "shortHistory": old_points,
    }

    def attach_current_history(items, **_kwargs):
        items[0]["shortHistory"] = new_points
        items[0]["shortHistorySource"] = "test intraday"
        items[0]["shortHistoryUpdatedAt"] = now.isoformat()
        return items

    with patch.object(world, "attach_dense_price_histories", attach_current_history):
        refreshed = world.enrich_history_with_dense_prices(payload, asset, "1d")

    require(
        world.history_latest_datetime(refreshed["shortHistory"]) == world.history_latest_datetime(new_points),
        "a newer rolling window did not replace the stale window",
    )
    require(world.market_history_payload_is_fresh(refreshed, "1d", asset), "fresh intraday data was marked stale")

    legacy = {"updated": now.isoformat(), "shortHistory": new_points}
    require(
        not world.market_history_payload_is_fresh(legacy, "1d", asset),
        "legacy payload without range freshness metadata was accepted",
    )

    private_asset = {"symbol": "SPCX", "group": "companies"}
    private_payload = {
        "updated": now.isoformat(),
        "historyUpdatedAt": now.isoformat(),
        "history": new_points,
    }
    response = world.market_history_payload_with_status(private_payload, "1m", private_asset)
    require(response["stale"] is False, "fresh private-company history was marked stale")
    require(response["rangeUpdatedAt"] == private_payload["historyUpdatedAt"], "range timestamp was not exposed")

    stale_payload = {
        "source": "test",
        "updated": (now - timedelta(days=1)).isoformat(),
        "shortHistoryUpdatedAt": (now - timedelta(days=1)).isoformat(),
        "shortHistory": old_points,
    }
    history_url = "https://companiesmarketcap.com/apple/marketcap/"
    cache_key = world.market_history_cache_key(history_url, asset)
    with (
        patch.object(world, "load_market_history_cache", return_value={cache_key: stale_payload}),
        patch.object(world, "refresh_market_history_async", return_value=True) as refresh,
    ):
        stale_response = world.load_market_history(history_url, asset, "1d")
    require(stale_response["refreshing"] is True, "stale history did not switch to background refresh")
    require(stale_response["stale"] is True, "stale history was presented as fresh")
    require(stale_response["shortHistory"] == old_points, "stale-while-revalidate did not return cached history")
    refresh.assert_called_once()

    metal_asset = {"symbol": "XAU", "group": "metals", "value": 3_400}
    require(
        world.market_history_cache_key("", metal_asset) == "asset:metals:XAU",
        "pathless metal history did not receive a stable cache key",
    )
    refreshed_metal = {
        "source": "test",
        "updated": now.isoformat(),
        "shortHistoryUpdatedAt": now.isoformat(),
        "shortHistory": new_points,
    }
    stored = {}
    with (
        patch.object(world, "load_market_history_cache", return_value={}),
        patch.object(world, "enrich_history_with_dense_prices", return_value=refreshed_metal),
        patch.object(world, "store_market_history_payload", side_effect=lambda key, value: stored.update({key: value})),
    ):
        metal_response = world.load_market_history("", metal_asset, "1d", force_refresh=True)
    require(metal_response["stale"] is False, "fresh pathless history was marked stale")
    require(stored.get("asset:metals:XAU") == refreshed_metal, "pathless history was not cached")

    print("PASS market history freshness, stale-while-revalidate, and pathless caching")


if __name__ == "__main__":
    main()
