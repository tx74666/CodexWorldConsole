import gzip
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
import tempfile
import threading
import time
import unittest
from unittest import mock
import urllib.error
import urllib.parse
import urllib.request

import world_console


class BackendReliabilityTests(unittest.TestCase):
    def test_finite_number_rejects_overflow_and_non_finite_values(self):
        self.assertIsNone(world_console.finite_number("9" * 400))
        self.assertIsNone(world_console.finite_number(float("inf")))
        self.assertIsNone(world_console.finite_number(float("nan")))
        self.assertEqual(world_console.finite_number("1,234.5"), 1234.5)

    def test_translation_network_failure_does_not_split_the_batch(self):
        with mock.patch.object(
            world_console,
            "google_translate_batch",
            side_effect=urllib.error.URLError("offline"),
        ) as translate:
            result = world_console.translate_batch_resilient([f"item {index}" for index in range(16)], "key")

        self.assertEqual(result, [""] * 16)
        translate.assert_called_once()

    def test_market_history_cache_coalesces_writes_and_prunes_old_entries(self):
        with tempfile.TemporaryDirectory() as directory:
            cache_path = Path(directory) / "market_history.json"
            with (
                mock.patch.object(world_console, "MARKET_HISTORY_CACHE", cache_path),
                mock.patch.object(world_console, "MARKET_HISTORY_CACHE_MEMORY", {}),
                mock.patch.object(world_console, "MARKET_HISTORY_CACHE_VERSION", 0),
                mock.patch.object(world_console, "MARKET_HISTORY_SAVED_VERSION", 0),
                mock.patch.object(world_console, "MARKET_HISTORY_SAVE_THREAD", None),
                mock.patch.object(world_console, "MARKET_HISTORY_SAVE_DELAY_SECONDS", 0.05),
                mock.patch.object(world_console, "MARKET_HISTORY_CACHE_MAX_ENTRIES", 3),
                mock.patch.object(
                    world_console,
                    "atomic_write_text",
                    wraps=world_console.atomic_write_text,
                ) as atomic_write,
            ):
                for index in range(5):
                    world_console.store_market_history_payload(
                        f"asset:{index}",
                        {"updated": f"2026-08-21T00:00:0{index}+00:00", "history": [{"value": index}]},
                    )
                writer = world_console.MARKET_HISTORY_SAVE_THREAD
                self.assertIsNotNone(writer)
                writer.join(timeout=5)
                self.assertFalse(writer.is_alive())

                saved = json.loads(cache_path.read_text(encoding="utf-8"))
                self.assertEqual(set(saved), {"asset:2", "asset:3", "asset:4"})
                self.assertEqual(atomic_write.call_count, 1)
                self.assertEqual(
                    world_console.MARKET_HISTORY_CACHE_VERSION,
                    world_console.MARKET_HISTORY_SAVED_VERSION,
                )

    def test_market_summary_omits_heavy_currency_history(self):
        payload = {
            "assets": [{"id": "aapl"}],
            "currencies": {
                "quotes": [{
                    "code": "CNY",
                    "quotePerUsd": 7.1,
                    "history": [{"value": 1}],
                    "denseHistory": [{"value": 2}],
                    "shortHistory": [{"value": 3}],
                    "historySource": "fixture",
                }],
            },
        }

        summary = world_console.market_summary_payload(payload)

        self.assertTrue(summary["currencyHistoryLazy"])
        self.assertEqual(summary["assets"], payload["assets"])
        self.assertEqual(summary["currencies"]["quotes"][0]["code"], "CNY")
        self.assertNotIn("history", summary["currencies"]["quotes"][0])
        self.assertIn("history", payload["currencies"]["quotes"][0])

    def test_currency_quote_merge_preserves_and_extends_cached_history(self):
        cached = {
            "code": "CNY",
            "quotePerUsd": 7.0,
            "history": [
                {"date": "2020-01-01", "value": 6.9},
                {"date": "2025-01-01", "value": 7.2},
            ],
            "denseHistory": [{"date": "2025-01-01", "value": 7.2}],
            "shortHistory": [{"time": "2025-01-01T00:00:00Z", "value": 7.2}],
            "historySource": "cached monthly history",
        }
        live = {
            "code": "cny",
            "quotePerUsd": 7.1,
            "history": [
                {"date": "2024-12-01", "value": 7.15},
                {"date": "2025-02-01", "value": 7.1},
            ],
        }

        result = world_console.merge_currency_quotes([cached], [live])[0]

        self.assertEqual(result["code"], "CNY")
        self.assertEqual(result["quotePerUsd"], 7.1)
        self.assertEqual(result["history"][0]["date"], "2020-01-01")
        self.assertEqual(result["history"][-1]["date"], "2025-02-01")
        self.assertEqual(result["denseHistory"], cached["denseHistory"])
        self.assertEqual(result["shortHistory"], cached["shortHistory"])
        self.assertEqual(result["historySource"], "cached monthly history")

    def test_dense_history_enrichment_merges_new_intraday_points_without_shrinking_span(self):
        now = datetime(2026, 8, 24, 12, tzinfo=timezone.utc)
        existing = [
            {"time": (now - timedelta(days=85 - index)).isoformat(), "value": 100 + index}
            for index in range(86)
        ]
        incoming = [
            {"time": (now - timedelta(hours=6) + timedelta(minutes=5 * index)).isoformat(), "value": 200 + index}
            for index in range(73)
        ]
        payload = {"shortHistory": existing, "shortHistorySource": "cached source"}
        asset = {"symbol": "AAPL", "group": "companies", "value": 200}

        def attach(rows, **_kwargs):
            rows[0]["shortHistory"] = incoming
            rows[0]["shortHistorySource"] = "fresh intraday source"
            rows[0]["shortHistoryUpdatedAt"] = now.isoformat()
            return rows

        with (
            mock.patch.object(world_console, "yahoo_symbol_for_asset", return_value="AAPL"),
            mock.patch.object(world_console, "attach_dense_price_histories", side_effect=attach),
        ):
            result = world_console.enrich_history_with_dense_prices(payload, asset, range_name="1d")

        self.assertGreater(world_console.history_span_days(result["shortHistory"]), 80)
        self.assertEqual(result["shortHistory"][-1]["time"], incoming[-1]["time"])
        self.assertEqual(result["shortHistorySource"], "fresh intraday source")

    def test_market_snapshot_is_parsed_once_until_the_file_changes(self):
        bootstrap_path = Path(world_console.APP_DIR) / "bootstrap" / "markets.json.gz"
        with gzip.open(bootstrap_path, "rt", encoding="utf-8") as source:
            payload = json.load(source)
        with tempfile.TemporaryDirectory() as directory:
            cache_path = Path(directory) / "markets.json"
            cache_path.write_text(
                json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
                encoding="utf-8",
            )
            with (
                mock.patch.object(world_console, "MARKET_CACHE", cache_path),
                mock.patch.object(world_console, "MARKET_CACHE_MEMORY", None),
                mock.patch.object(world_console, "MARKET_CACHE_MEMORY_SIGNATURE", None),
                mock.patch.object(world_console.json, "loads", wraps=json.loads) as loads,
            ):
                first = world_console.market_cache_payload(allow_stale=True)
                second = world_console.market_cache_payload(allow_stale=True)

            self.assertIsNotNone(first)
            self.assertIsNotNone(second)
            self.assertEqual(loads.call_count, 1)

    def test_legacy_source_config_is_migrated_without_plaintext_key(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            legacy_dir = root / "source"
            data_dir = root / "data"
            legacy_dir.mkdir()
            (legacy_dir / ".world-console.local.json").write_text(json.dumps({
                "features": {"earning": True},
                "ask": {
                    "baseUrl": "https://api.openai.com/v1",
                    "model": "legacy-model",
                    "apiKey": "legacy-secret",
                },
            }), encoding="utf-8")
            target = data_dir / ".world-console.local.json"
            with (
                mock.patch.object(world_console, "APP_DIR", legacy_dir),
                mock.patch.object(world_console, "DATA_DIR", data_dir),
                mock.patch.object(world_console, "LOCAL_CONFIG", target),
                mock.patch.object(world_console, "CONFIGURED_DATA_DIR", ""),
                mock.patch.object(world_console, "protect_local_secret", return_value="protected-secret"),
            ):
                migrated = world_console.migrate_legacy_source_config()

            saved_text = target.read_text(encoding="utf-8")
            saved = json.loads(saved_text)
            self.assertTrue(migrated)
            self.assertTrue(saved["features"]["earning"])
            self.assertEqual(saved["ask"]["apiKeyProtected"], "protected-secret")
            self.assertNotIn("apiKey", saved["ask"])
            self.assertNotIn("legacy-secret", saved_text)

    def test_article_image_rejects_polluted_private_cache_entries(self):
        article_url = "https://public.example/article"
        private_image = "http://127.0.0.1/private.png"
        html = f'<meta property="og:image" content="{private_image}">'.encode()
        with tempfile.TemporaryDirectory() as directory:
            cache_path = Path(directory) / "images.json"
            cache_path.write_text(json.dumps({article_url: private_image}), encoding="utf-8")
            with (
                mock.patch.object(world_console, "IMAGE_CACHE", cache_path),
                mock.patch.object(
                    world_console,
                    "is_public_http_url",
                    side_effect=lambda value: "127.0.0.1" not in str(value),
                ),
                mock.patch.object(world_console, "fetch_url", return_value=html),
            ):
                result = world_console.article_image_url(article_url)

            self.assertEqual(result, "")
            self.assertEqual(json.loads(cache_path.read_text(encoding="utf-8"))[article_url], "")

    def test_concurrent_article_cache_writes_merge_instead_of_overwriting(self):
        articles = ["https://public.example/a", "https://public.example/b"]
        barrier = threading.Barrier(2)

        def fetch(url, **_kwargs):
            barrier.wait(timeout=2)
            slug = url.rsplit("/", 1)[-1]
            return f'<meta property="og:image" content="https://images.example/{slug}.png">'.encode()

        with tempfile.TemporaryDirectory() as directory:
            cache_path = Path(directory) / "images.json"
            results = []
            with (
                mock.patch.object(world_console, "IMAGE_CACHE", cache_path),
                mock.patch.object(world_console, "is_public_http_url", return_value=True),
                mock.patch.object(world_console, "fetch_url", side_effect=fetch),
            ):
                threads = [threading.Thread(target=lambda url=url: results.append(world_console.article_image_url(url))) for url in articles]
                for thread in threads:
                    thread.start()
                for thread in threads:
                    thread.join(timeout=3)

            self.assertTrue(all(not thread.is_alive() for thread in threads))
            self.assertEqual(len(results), 2)
            saved = json.loads(cache_path.read_text(encoding="utf-8"))
            self.assertEqual(set(saved), set(articles))

    def test_same_article_fetch_is_single_flight(self):
        article_url = "https://public.example/same"
        started = threading.Event()
        release = threading.Event()
        calls = []

        def fetch(*_args, **_kwargs):
            calls.append(1)
            started.set()
            release.wait(timeout=2)
            return b'<meta property="og:image" content="https://images.example/same.png">'

        with tempfile.TemporaryDirectory() as directory:
            cache_path = Path(directory) / "images.json"
            results = []
            with (
                mock.patch.object(world_console, "IMAGE_CACHE", cache_path),
                mock.patch.object(world_console, "is_public_http_url", return_value=True),
                mock.patch.object(world_console, "fetch_url", side_effect=fetch),
            ):
                first = threading.Thread(target=lambda: results.append(world_console.article_image_url(article_url)))
                second = threading.Thread(target=lambda: results.append(world_console.article_image_url(article_url)))
                first.start()
                self.assertTrue(started.wait(timeout=1))
                second.start()
                time.sleep(0.05)
                release.set()
                first.join(timeout=3)
                second.join(timeout=3)

            self.assertEqual(len(calls), 1)
            self.assertEqual(results, ["https://images.example/same.png"] * 2)

    def test_expired_event_cache_returns_stale_data_while_one_refreshes(self):
        stale = [{"id": "stale-event"}]
        started = threading.Event()
        release = threading.Event()

        def slow_fetch(*_args, **_kwargs):
            started.set()
            release.wait(timeout=2)
            return b"<rss><channel></channel></rss>"

        with (
            mock.patch.object(world_console, "EVENT_CACHE_MEMORY", stale),
            mock.patch.object(world_console, "EVENT_CACHE_MONOTONIC", 0.0),
            mock.patch.object(world_console, "EVENT_CACHE_UPDATED", None),
            mock.patch.object(world_console, "EVENT_SOURCE_STATUS", "unavailable"),
            mock.patch.object(world_console, "EVENT_FAILED_SOURCES", []),
            mock.patch.object(world_console, "EVENT_NEXT_RETRY_MONOTONIC", 0.0),
            mock.patch.object(world_console, "EVENT_REFRESH_IN_PROGRESS", False),
            mock.patch.object(world_console, "NEWS_FEEDS", [("Fixture", "https://example.com/feed")]),
            mock.patch.object(world_console, "fetch_url", side_effect=slow_fetch),
        ):
            before = time.monotonic()
            first = world_console.load_events()
            first_elapsed = time.monotonic() - before
            self.assertTrue(started.wait(timeout=1))
            before = time.monotonic()
            second = world_console.load_events()
            second_elapsed = time.monotonic() - before
            release.set()
            deadline = time.monotonic() + 3
            while world_console.EVENT_REFRESH_IN_PROGRESS and time.monotonic() < deadline:
                time.sleep(0.01)

        self.assertEqual(first, stale)
        self.assertEqual(second, stale)
        self.assertLess(first_elapsed, 0.25)
        self.assertLess(second_elapsed, 0.25)
        self.assertFalse(world_console.EVENT_REFRESH_IN_PROGRESS)

    def test_event_refresh_thread_start_failure_restores_single_flight_flag(self):
        broken_thread = mock.Mock()
        broken_thread.start.side_effect = RuntimeError("thread unavailable")
        with (
            mock.patch.object(world_console, "EVENT_CACHE_MEMORY", None),
            mock.patch.object(world_console, "EVENT_CACHE_MONOTONIC", 0.0),
            mock.patch.object(world_console, "EVENT_CACHE_UPDATED", None),
            mock.patch.object(world_console, "EVENT_SOURCE_STATUS", "unavailable"),
            mock.patch.object(world_console, "EVENT_FAILED_SOURCES", []),
            mock.patch.object(world_console, "EVENT_NEXT_RETRY_MONOTONIC", 0.0),
            mock.patch.object(world_console, "EVENT_REFRESH_IN_PROGRESS", False),
            mock.patch.object(world_console.threading, "Thread", return_value=broken_thread),
        ):
            result = world_console.load_events()
            refreshing = world_console.EVENT_REFRESH_IN_PROGRESS

        self.assertEqual(result, world_console.FALLBACK_EVENTS)
        self.assertFalse(refreshing)

    def test_public_fetch_uses_the_resolved_address_without_second_dns_lookup(self):
        target = {
            "url": urllib.parse.urlsplit("https://images.example/pixel.png"),
            "hostname": "images.example",
            "port": 443,
            "addresses": ((2, 1, 6, "", ("93.184.216.34", 443)),),
        }
        connected = []
        connection_hosts = []

        class FakeResponse:
            status = 200
            reason = "OK"
            headers = {"Content-Length": "2", "Content-Type": "image/png"}

            def read(self, _limit):
                return b"ok"

        class FakeConnection:
            def __init__(self, host, port, timeout=None):
                self.host = host
                self.port = port
                self.timeout = timeout
                connection_hosts.append((host, port))

            def request(self, _method, _path, headers=None):
                connected.append(self._create_connection((self.host, self.port), self.timeout, None))

            def getresponse(self):
                return FakeResponse()

            def close(self):
                pass

        request = urllib.request.Request("https://images.example/pixel.png")
        with (
            mock.patch.object(world_console, "resolve_public_target", return_value=target) as resolver,
            mock.patch.object(world_console, "connect_resolved", return_value="pinned-socket") as connector,
            mock.patch.object(world_console.http.client, "HTTPSConnection", FakeConnection),
        ):
            _response, body = world_console.open_public_request(request, timeout=2, max_bytes=16)

        self.assertEqual(body, b"ok")
        resolver.assert_called_once_with("https://images.example/pixel.png")
        connector.assert_called_once_with(target["addresses"], 2, None)
        self.assertEqual(connected, ["pinned-socket"])
        self.assertEqual(connection_hosts, [("images.example", 443)])


if __name__ == "__main__":
    unittest.main()
