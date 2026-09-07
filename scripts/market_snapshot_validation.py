"""Shared validation for market snapshots before packaging or replacement."""

from datetime import datetime, timedelta, timezone
import math


REQUIRED_CURRENCY_CODES = {"USD", "EUR", "CNY", "JPY", "GBP", "CHF", "HKD", "SGD", "XAU", "BTC"}
ALLOWED_ASSET_GROUPS = {"companies", "crypto", "metals"}


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def is_finite_number(value, *, positive=False):
    return (
        isinstance(value, (int, float))
        and not isinstance(value, bool)
        and math.isfinite(float(value))
        and (not positive or float(value) > 0)
    )


def has_finite_coordinate_pair(value):
    if not isinstance(value, (list, tuple)):
        return False
    if len(value) >= 2 and is_finite_number(value[0]) and is_finite_number(value[1]):
        return True
    return any(has_finite_coordinate_pair(item) for item in value)


def validate_world_payload(world, *, min_features=170):
    require(isinstance(world, dict) and world.get("type") == "FeatureCollection", "world bootstrap is not a FeatureCollection")
    features = world.get("features")
    require(
        isinstance(features, list)
        and len(features) >= min_features
        and all(isinstance(item, dict) for item in features),
        "world bootstrap is incomplete",
    )
    names = []
    for feature in features:
        properties = feature.get("properties") if isinstance(feature.get("properties"), dict) else {}
        name = str(properties.get("name") or "").strip()
        geometry = feature.get("geometry") if isinstance(feature.get("geometry"), dict) else {}
        require(feature.get("type") == "Feature" and name, "world feature name or type is invalid")
        require(
            geometry.get("type") in {"Polygon", "MultiPolygon"}
            and has_finite_coordinate_pair(geometry.get("coordinates")),
            f"world feature geometry is invalid ({name})",
        )
        names.append(name)
    require(len(names) == len(set(names)), "world feature names are duplicated")
    return len(features)


def validate_market_payload(markets, *, max_age_days=0, expected_schema=11):
    require(isinstance(markets, dict), "market bootstrap is not an object")
    assets = markets.get("assets")
    require(
        markets.get("schemaVersion") == expected_schema
        and isinstance(assets, list)
        and len(assets) >= 90
        and all(isinstance(item, dict) for item in assets),
        "market bootstrap is incomplete",
    )
    asset_ids = [str(item.get("id") or "").strip() for item in assets]
    require(all(asset_ids) and len(asset_ids) == len(set(asset_ids)), "market asset IDs are missing or duplicated")
    require(
        all(str(item.get("symbol") or "").strip() and str(item.get("name") or "").strip() for item in assets),
        "market asset symbols or names are missing",
    )
    require(
        all(str(item.get("group") or "").strip() in ALLOWED_ASSET_GROUPS for item in assets),
        "market asset groups are invalid",
    )
    require(
        all(
            is_finite_number(item.get("value"), positive=True)
            and is_finite_number(item.get("marketCap"), positive=True)
            and is_finite_number(item.get("changePct"))
            for item in assets
        ),
        "market assets contain invalid values",
    )
    require(
        all(
            "sparkline" not in item
            or (
                isinstance(item.get("sparkline"), list)
                and len(item["sparkline"]) >= 2
                and all(
                    isinstance(point, dict) and is_finite_number(point.get("value"))
                    for point in item["sparkline"]
                )
            )
            for item in assets
        ),
        "market asset sparklines are invalid",
    )

    currencies = markets.get("currencies") if isinstance(markets.get("currencies"), dict) else {}
    quotes = currencies.get("quotes")
    require(
        isinstance(quotes, list)
        and len(quotes) >= len(REQUIRED_CURRENCY_CODES)
        and all(isinstance(item, dict) for item in quotes),
        "currency bootstrap is incomplete",
    )
    currency_codes = [str(item.get("code") or "").strip().upper() for item in quotes]
    require(
        all(currency_codes)
        and len(currency_codes) == len(set(currency_codes))
        and REQUIRED_CURRENCY_CODES.issubset(currency_codes),
        "required currency quotes are missing or duplicated",
    )
    require(
        all(
            any(
                is_finite_number(item.get(field), positive=True)
                for field in ("quotePerUsd", "usdValue")
            )
            for item in quotes
        ),
        "currency quotes contain invalid values",
    )

    try:
        market_updated = datetime.fromisoformat(str(markets.get("updated") or "").replace("Z", "+00:00"))
    except ValueError as exc:
        raise AssertionError("market bootstrap timestamp is invalid") from exc
    if market_updated.tzinfo is None:
        market_updated = market_updated.replace(tzinfo=timezone.utc)
    market_age = datetime.now(timezone.utc) - market_updated.astimezone(timezone.utc)
    require(market_age >= -timedelta(minutes=5), f"market bootstrap timestamp is in the future ({market_age})")
    if max_age_days > 0:
        require(market_age <= timedelta(days=max_age_days), f"market bootstrap is stale ({market_age})")

    try:
        currency_date = datetime.fromisoformat(str(currencies.get("date") or ""))
    except ValueError as exc:
        raise AssertionError("currency bootstrap date is invalid") from exc
    if currency_date.tzinfo is None:
        currency_date = currency_date.replace(tzinfo=timezone.utc)
    currency_age = datetime.now(timezone.utc) - currency_date.astimezone(timezone.utc)
    require(currency_age >= -timedelta(days=1), f"currency bootstrap date is in the future ({currency_age})")
    if max_age_days > 0:
        require(
            currency_age <= timedelta(days=max_age_days + 1),
            f"currency bootstrap is stale ({currency_age})",
        )
    return len(assets), len(quotes)
