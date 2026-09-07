from datetime import datetime, timezone
import time
import unittest
from unittest import mock
import urllib.error

import world_console


class EventFreshnessTests(unittest.TestCase):
    def setUp(self):
        patches = mock.patch.multiple(
            world_console,
            EVENT_CACHE_MEMORY=None,
            EVENT_CACHE_MONOTONIC=0.0,
            EVENT_CACHE_UPDATED=None,
            EVENT_SOURCE_STATUS="unavailable",
            EVENT_FAILED_SOURCES=[],
            EVENT_NEXT_RETRY_MONOTONIC=0.0,
            EVENT_REFRESH_IN_PROGRESS=False,
            NEWS_FEEDS=[("Healthy", "https://example.com/healthy"), ("Other", "https://example.com/other")],
        )
        patches.start()
        self.addCleanup(patches.stop)
        translations = mock.patch.object(world_console, "apply_translations", side_effect=lambda rows: rows)
        translations.start()
        self.addCleanup(translations.stop)

    def seed_old_cache(self):
        rows = [{"id": "older-report", "source": "Healthy"}]
        world_console.EVENT_CACHE_MEMORY = rows
        world_console.EVENT_CACHE_UPDATED = "2026-08-01T00:00:00+00:00"
        world_console.EVENT_CACHE_MONOTONIC = time.monotonic() - 1_000
        world_console.EVENT_SOURCE_STATUS = "ok"
        return rows

    def report(self, source):
        return {
            "id": source,
            "title": "Earthquake strikes Japan",
            "statement": "Earthquake strikes Japan",
            "summary": "Earthquake strikes Japan",
            "source": source,
            "published": datetime.now(timezone.utc).isoformat(),
            "severity": 5,
            "category": "disaster",
            "location": "Tokyo",
            "country": "Japan",
            "lat": 35.68,
            "lon": 139.69,
        }

    def test_initial_fallback_has_no_success_timestamp_and_starts_only_one_refresh(self):
        with mock.patch.object(world_console.threading, "Thread") as worker:
            first = world_console.load_events_payload()
            second = world_console.load_events_payload()

        self.assertEqual(first["events"], world_console.FALLBACK_EVENTS)
        self.assertIsNone(first["updated"])
        self.assertTrue(first["stale"])
        self.assertTrue(first["refreshing"])
        self.assertEqual(first["sourceStatus"], "unavailable")
        self.assertEqual(second["events"], first["events"])
        self.assertEqual(worker.call_count, 1)
        worker.return_value.start.assert_called_once()

    def test_fresh_cache_keeps_success_time_separate_from_response_time(self):
        cached = self.seed_old_cache()
        world_console.EVENT_CACHE_MONOTONIC = time.monotonic()
        with mock.patch.object(world_console.threading, "Thread") as worker:
            first = world_console.load_events_payload()
            second = world_console.load_events_payload()

        self.assertEqual(first["events"], cached)
        self.assertEqual(first["updated"], "2026-08-01T00:00:00+00:00")
        self.assertEqual(second["updated"], first["updated"])
        self.assertNotEqual(first["updated"], first["servedAt"])
        self.assertFalse(first["stale"])
        self.assertFalse(first["refreshing"])
        worker.assert_not_called()

    def test_all_sources_fail_preserves_reports_and_does_not_extend_cache_lifetime(self):
        cached = self.seed_old_cache()
        original_clock = world_console.EVENT_CACHE_MONOTONIC
        world_console.EVENT_REFRESH_IN_PROGRESS = True
        with mock.patch.object(world_console, "fetch_url", side_effect=urllib.error.URLError("offline")):
            world_console._refresh_event_cache()
        with mock.patch.object(world_console.threading, "Thread") as worker:
            responses = [world_console.load_events_payload() for _ in range(20)]

        self.assertEqual(world_console.EVENT_CACHE_MONOTONIC, original_clock)
        for payload in responses:
            self.assertEqual(payload["events"], cached)
            self.assertEqual(payload["updated"], "2026-08-01T00:00:00+00:00")
            self.assertTrue(payload["stale"])
            self.assertFalse(payload["refreshing"])
            self.assertEqual(payload["sourceStatus"], "unavailable")
            self.assertEqual(payload["failedSources"], ["Healthy", "Other"])
        self.assertGreater(world_console.EVENT_NEXT_RETRY_MONOTONIC, time.monotonic())
        worker.assert_not_called()

    def test_cold_start_failure_does_not_promote_fallback_to_live_cache(self):
        with mock.patch.object(world_console, "fetch_url", side_effect=TimeoutError):
            world_console._refresh_event_cache()
        payload = world_console.load_events_payload()

        self.assertIsNone(world_console.EVENT_CACHE_MEMORY)
        self.assertEqual(payload["events"], world_console.FALLBACK_EVENTS)
        self.assertIsNone(payload["updated"])
        self.assertTrue(payload["stale"])
        self.assertFalse(payload["refreshing"])

    def test_partial_success_lists_failed_source_and_retries_without_expiring_good_data(self):
        self.seed_old_cache()
        fresh = self.report("Healthy")

        def fetch(url):
            if url.endswith("other"):
                raise urllib.error.URLError("offline")
            return b"feed"

        with (
            mock.patch.object(world_console, "fetch_url", side_effect=fetch),
            mock.patch.object(world_console, "parse_feed", return_value=[fresh]),
        ):
            world_console._refresh_event_cache()
        with mock.patch.object(world_console.threading, "Thread") as worker:
            payload = world_console.load_events_payload()
            worker.assert_not_called()
            world_console.EVENT_NEXT_RETRY_MONOTONIC = 0.0
            retry = world_console.load_events_payload()
            worker.assert_called_once()

        self.assertEqual(payload["events"], [fresh])
        self.assertEqual(payload["sourceStatus"], "partial")
        self.assertEqual(payload["failedSources"], ["Other"])
        self.assertFalse(payload["stale"])
        self.assertNotEqual(payload["updated"], "2026-08-01T00:00:00+00:00")
        self.assertEqual(retry["updated"], payload["updated"])
        self.assertFalse(retry["stale"])
        self.assertTrue(retry["refreshing"])

    def test_successful_empty_feed_clears_old_reports_instead_of_redating_them(self):
        self.seed_old_cache()
        with mock.patch.object(world_console, "fetch_url", return_value=b"<rss><channel/></rss>"):
            world_console._refresh_event_cache()
        payload = world_console.load_events_payload()

        self.assertEqual(payload["events"], [])
        self.assertEqual(payload["sourceStatus"], "ok")
        self.assertEqual(payload["failedSources"], [])
        self.assertFalse(payload["stale"])
        self.assertIsNotNone(payload["updated"])

    def test_recovery_clears_failure_state_and_advances_success_time(self):
        self.seed_old_cache()
        with mock.patch.object(world_console, "fetch_url", side_effect=TimeoutError):
            world_console._refresh_event_cache()
        with (
            mock.patch.object(world_console, "fetch_url", return_value=b"feed"),
            mock.patch.object(world_console, "parse_feed", side_effect=lambda source, _xml: [self.report(source)]),
        ):
            world_console._refresh_event_cache()
        payload = world_console.load_events_payload()

        self.assertTrue(payload["events"])
        self.assertEqual(payload["sourceStatus"], "ok")
        self.assertEqual(payload["failedSources"], [])
        self.assertFalse(payload["stale"])
        self.assertFalse(payload["refreshing"])
        self.assertNotEqual(payload["updated"], "2026-08-01T00:00:00+00:00")
        self.assertEqual(world_console.EVENT_NEXT_RETRY_MONOTONIC, 0.0)

    def test_old_reports_are_not_paired_with_a_refresh_that_finished_during_response(self):
        cached = self.seed_old_cache()
        worker = mock.Mock()
        worker.start.side_effect = world_console._refresh_event_cache
        with (
            mock.patch.object(world_console.threading, "Thread", return_value=worker),
            mock.patch.object(world_console.concurrent.futures, "ThreadPoolExecutor") as executor,
        ):
            executor.return_value.__enter__.return_value.map.return_value = [
                ("Healthy", [self.report("Healthy")], True),
                ("Other", [], True),
            ]
            first = world_console.load_events_payload()
            second = world_console.load_events_payload()

        self.assertEqual(first["events"], cached)
        self.assertEqual(first["updated"], "2026-08-01T00:00:00+00:00")
        self.assertTrue(first["stale"])
        self.assertTrue(first["refreshing"])
        self.assertNotEqual(second["events"], cached)
        self.assertNotEqual(second["updated"], first["updated"])
        self.assertFalse(second["stale"])
        self.assertFalse(second["refreshing"])

    def test_thread_start_failure_exposes_stale_state_and_throttles_retries(self):
        self.seed_old_cache()
        worker = mock.Mock()
        worker.start.side_effect = RuntimeError("thread unavailable")
        with mock.patch.object(world_console.threading, "Thread", return_value=worker) as make_worker:
            first = world_console.load_events_payload()
            second = world_console.load_events_payload()

        self.assertTrue(first["stale"])
        self.assertFalse(first["refreshing"])
        self.assertEqual(first["sourceStatus"], "unavailable")
        self.assertEqual(first["updated"], second["updated"])
        make_worker.assert_called_once()

    def test_translation_failure_keeps_successful_rss_usable(self):
        with (
            mock.patch.object(world_console, "fetch_url", return_value=b"feed"),
            mock.patch.object(world_console, "parse_feed", side_effect=lambda source, _xml: [self.report(source)]),
            mock.patch.object(world_console, "apply_translations", side_effect=OSError("translation cache unavailable")),
        ):
            world_console._refresh_event_cache()
        payload = world_console.load_events_payload()

        self.assertTrue(payload["events"])
        self.assertEqual(payload["sourceStatus"], "ok")
        self.assertFalse(payload["stale"])

    def test_feed_parser_rejects_error_pages_but_accepts_valid_empty_feeds(self):
        for xml in (b"<html><body>Service unavailable</body></html>", b"<error/>", b"<rss/>"):
            with self.subTest(xml=xml), self.assertRaises(ValueError):
                world_console.parse_feed("Fixture", xml)
        self.assertEqual(world_console.parse_feed("Fixture", b"<rss><channel/></rss>"), [])
        self.assertEqual(world_console.parse_feed("Fixture", b'<feed xmlns="http://www.w3.org/2005/Atom"/>'), [])


if __name__ == "__main__":
    unittest.main()
