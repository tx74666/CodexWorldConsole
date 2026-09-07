import gzip
import http.client
import json
from pathlib import Path
import tempfile
import threading
import unittest
from unittest import mock

import world_console


class ConsoleHttpSecurityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temporary_directory = tempfile.TemporaryDirectory()
        cls.config_patcher = mock.patch.object(
            world_console,
            "LOCAL_CONFIG",
            Path(cls.temporary_directory.name) / ".world-console.local.json",
        )
        cls.config_patcher.start()
        cls.server = world_console.ThreadingHTTPServer(("127.0.0.1", 0), world_console.ConsoleHandler)
        cls.server.daemon_threads = True
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.port = cls.server.server_port

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(timeout=5)
        cls.config_patcher.stop()
        cls.temporary_directory.cleanup()

    def request(self, method, path, body=None, headers=None):
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        connection.request(method, path, body=body, headers=headers or {})
        response = connection.getresponse()
        payload = response.read()
        result = response.status, dict(response.getheaders()), payload
        connection.close()
        return result

    def test_static_server_exposes_only_the_web_allowlist(self):
        for path in (
            "/world_console.py",
            "/.world-console.local.json",
            "/.git/config",
            "/cache/markets.json",
            "/api/config-near-match",
            "/api/image?url=https://example.com/image.png",
        ):
            with self.subTest(path=path):
                status, _headers, _body = self.request("GET", path)
                self.assertEqual(status, 404)

        status, _headers, _body = self.request("HEAD", "/.world-console.local.json")
        self.assertEqual(status, 405)

        status, headers, body = self.request("GET", "/index.html")
        self.assertEqual(status, 200)
        self.assertIn(b"Codex World", body)
        self.assertEqual(headers.get("X-Content-Type-Options"), "nosniff")
        self.assertNotIn("Python", headers.get("Server", ""))
        self.assertIn("frame-ancestors 'none'", headers.get("Content-Security-Policy", ""))

    def test_cross_origin_config_write_is_rejected(self):
        body = json.dumps({
            "baseUrl": "https://api.openai.com/v1",
            "model": "gpt-5.6-terra",
        }).encode("utf-8")
        status, _headers, _payload = self.request(
            "POST",
            "/api/ask-config",
            body=body,
            headers={
                "Content-Type": "application/json",
                "Origin": "https://attacker.example",
            },
        )
        self.assertEqual(status, 403)

    def test_untrusted_host_header_is_rejected(self):
        status, _headers, _payload = self.request(
            "GET",
            "/api/config",
            headers={"Host": "attacker.example"},
        )
        self.assertEqual(status, 421)

    def test_public_proxy_rejects_multicast_addresses(self):
        multicast_results = [
            (2, 1, 6, "", ("224.0.0.1", 443)),
            (10, 1, 6, "", ("ff02::1", 443, 0, 0)),
        ]
        for result in multicast_results:
            with self.subTest(address=result[4][0]), mock.patch.object(
                world_console.socket,
                "getaddrinfo",
                return_value=[result],
            ):
                self.assertFalse(world_console.is_public_http_url("https://example.com/image.png"))

    def test_cross_site_read_or_cost_trigger_is_rejected(self):
        status, _headers, _payload = self.request(
            "GET",
            "/api/events",
            headers={"Origin": "https://attacker.example"},
        )
        self.assertEqual(status, 403)

    def test_non_json_and_oversized_requests_are_rejected(self):
        status, _headers, _payload = self.request(
            "POST",
            "/api/market-ask",
            body=b"{}",
            headers={"Content-Type": "text/plain"},
        )
        self.assertEqual(status, 415)

        status, _headers, _payload = self.request(
            "POST",
            "/api/market-ask",
            body=b"{}",
            headers={
                "Content-Type": "application/json",
                "Content-Length": str(world_console.MAX_JSON_REQUEST_BYTES + 1),
            },
        )
        self.assertEqual(status, 413)

    def test_same_origin_json_config_write_succeeds(self):
        body = json.dumps({
            "baseUrl": "http://127.0.0.1:11434/v1",
            "model": "local-model",
            "protocol": "chat-completions",
            "webSearch": False,
        }).encode("utf-8")
        status, _headers, payload = self.request(
            "POST",
            "/api/ask-config",
            body=body,
            headers={
                "Content-Type": "application/json; charset=utf-8",
                "Origin": f"http://127.0.0.1:{self.port}",
            },
        )
        self.assertEqual(status, 200)
        public = json.loads(payload.decode("utf-8"))
        self.assertEqual(public["baseUrl"], "http://127.0.0.1:11434/v1")
        self.assertNotIn("apiKey", public)

    def test_selection_translation_uses_json_post_instead_of_query_text(self):
        request_payload = {
            "text": "private selected text",
            "target": "zh-CN",
            "ui": "en",
            "context": "private surrounding context",
        }
        expected = {
            "text": request_payload["text"],
            "translation": "fixture",
            "explanation": "fixture explanation",
            "target": "zh-CN",
        }
        with mock.patch.object(world_console, "translate_text", return_value=expected) as translate:
            status, _headers, body = self.request(
                "POST",
                "/api/translate",
                body=json.dumps(request_payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "Origin": f"http://127.0.0.1:{self.port}",
                },
            )
            get_status, _headers, _body = self.request(
                "GET",
                "/api/translate?text=private-selected-text",
            )

        self.assertEqual(status, 200)
        self.assertEqual(json.loads(body.decode("utf-8")), expected)
        self.assertEqual(get_status, 404)
        translate.assert_called_once_with(
            request_payload["text"],
            request_payload["target"],
            request_payload["ui"],
            request_payload["context"],
        )

    def test_large_json_responses_support_gzip(self):
        events = [{"id": "large", "summary": "x" * 4_000}]
        with mock.patch.object(world_console, "load_events_payload", return_value={"events": events}):
            status, headers, payload = self.request(
                "GET",
                "/api/events",
                headers={"Accept-Encoding": "br, gzip"},
            )

        self.assertEqual(status, 200)
        self.assertEqual(headers.get("Content-Encoding"), "gzip")
        self.assertEqual(headers.get("Vary"), "Accept-Encoding")
        decoded = json.loads(gzip.decompress(payload).decode("utf-8"))
        self.assertEqual(decoded["events"], events)

    def test_market_summary_is_lightweight_and_history_routes_are_allowlisted(self):
        market_payload = {
            "source": "fixture",
            "assets": [{"id": "aapl"}],
            "currencies": {
                "quotes": [{
                    "code": "CNY",
                    "usdValue": 0.14,
                    "quotePerUsd": 7.1,
                    "history": [{"value": 7.0}],
                }],
            },
        }
        with mock.patch.object(world_console, "load_markets", return_value=market_payload):
            status, _headers, body = self.request("GET", "/api/markets")
        self.assertEqual(status, 200)
        summary = json.loads(body.decode("utf-8"))
        self.assertTrue(summary["currencyHistoryLazy"])
        self.assertNotIn("history", summary["currencies"]["quotes"][0])

        with (
            mock.patch.object(world_console, "market_history_asset", return_value=None),
            mock.patch.object(world_console, "load_market_history") as load_history,
        ):
            status, _headers, _body = self.request("GET", "/api/market-history?id=forged&range=1m")
        self.assertEqual(status, 404)
        load_history.assert_not_called()

        quote = {"code": "CNY", "history": [{"value": 7.0}]}
        with mock.patch.object(world_console, "market_currency_history", return_value=quote):
            status, _headers, body = self.request("GET", "/api/currency-history?code=CNY")
        self.assertEqual(status, 200)
        self.assertEqual(json.loads(body.decode("utf-8"))["quote"], quote)


if __name__ == "__main__":
    unittest.main()
