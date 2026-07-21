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

    print("PASS market history freshness and rolling-window replacement")


if __name__ == "__main__":
    main()
