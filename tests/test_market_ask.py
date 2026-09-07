import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest import mock

import world_console


class MarketAskModelTests(unittest.TestCase):
    def test_missing_model_returns_configuration_error_instead_of_template_answer(self):
        context = {
            "language": "zh",
            "asset": {"name": "CXMT", "symbol": "688825.SS"},
            "marketUniverse": [{"name": "TSMC"}, {"name": "AMD"}],
        }
        with (
            mock.patch.object(world_console, "market_ask_endpoint", return_value=""),
            mock.patch.object(
                world_console,
                "market_model_api_config",
                return_value={"configured": False},
            ),
            mock.patch.object(world_console, "use_codex_market_ask", return_value=False),
        ):
            result = world_console.answer_market_question({
                "question": "这是什么新兴公司",
                "mode": "fast",
                "context": context,
            })

        self.assertEqual(result["code"], "ask_not_configured")
        self.assertEqual(result["_status"], 503)
        self.assertNotIn("answer", result)

    def test_arbitrary_question_is_forwarded_unchanged_to_the_model(self):
        captured = {}

        def fake_model(question, context, mode):
            captured.update(question=question, context=context, mode=mode)
            return {"answer": "这是模型按自然语言生成的回答。", "source": "test model"}

        context = {
            "language": "zh",
            "asset": {"name": "CXMT", "symbol": "688825.SS"},
            "marketUniverse": [{"name": "TSMC"}, {"name": "AMD"}],
        }
        with (
            mock.patch.object(world_console, "market_ask_endpoint", return_value=""),
            mock.patch.object(
                world_console,
                "market_model_api_config",
                return_value={"configured": True},
            ),
            mock.patch.object(world_console, "call_openai_market_ask", side_effect=fake_model),
            mock.patch.object(world_console, "use_codex_market_ask", return_value=False),
        ):
            result = world_console.answer_market_question({
                "question": "它和三星的产品路线有什么本质差别？",
                "mode": "fast",
                "context": context,
            })

        self.assertEqual(captured["question"], "它和三星的产品路线有什么本质差别？")
        self.assertEqual(captured["context"], context)
        self.assertEqual(result["answer"], "这是模型按自然语言生成的回答。")

    def test_chat_completions_protocol_sends_question_and_context(self):
        config = {
            "configured": True,
            "baseUrl": "http://127.0.0.1:11434/v1",
            "model": "local-model",
            "protocol": "chat-completions",
            "webSearch": True,
            "apiKey": "",
        }
        response_payload = {
            "choices": [{"message": {"content": "通用模型回答"}}],
        }
        with (
            mock.patch.object(world_console, "market_model_api_config", return_value=config),
            mock.patch.object(world_console, "open_json_request", return_value=response_payload) as open_request,
        ):
            result = world_console.call_openai_market_ask(
                "随便问一个没有预设关键词的问题",
                {"asset": {"name": "Example"}},
                "fast",
            )

        request = open_request.call_args.args[0]
        body = json.loads(request.data.decode("utf-8"))
        self.assertEqual(request.full_url, "http://127.0.0.1:11434/v1/chat/completions")
        self.assertIn("随便问一个没有预设关键词的问题", body["messages"][1]["content"])
        self.assertIn('"name": "Example"', body["messages"][1]["content"])
        self.assertEqual(result["answer"], "通用模型回答")

    def test_responses_think_mode_can_enable_web_search(self):
        config = {
            "configured": True,
            "baseUrl": "https://api.openai.com/v1",
            "model": "gpt-5.6-terra",
            "protocol": "responses",
            "webSearch": True,
            "apiKey": "test-key",
        }
        response_payload = {
            "output_text": "Current answer [Example].",
            "output": [{
                "type": "message",
                "content": [{
                    "type": "output_text",
                    "text": "Current answer [Example].",
                    "annotations": [{
                        "type": "url_citation",
                        "start_index": 15,
                        "end_index": 24,
                        "url": "https://example.com/current",
                        "title": "Example source",
                    }],
                }],
            }],
        }
        with (
            mock.patch.object(world_console, "market_model_api_config", return_value=config),
            mock.patch.object(world_console, "open_json_request", return_value=response_payload) as open_request,
        ):
            result = world_console.call_openai_market_ask(
                "What changed most recently?",
                {"asset": {"name": "Example"}},
                "think",
            )

        request = open_request.call_args.args[0]
        body = json.loads(request.data.decode("utf-8"))
        self.assertEqual(body["tools"], [{"type": "web_search"}])
        self.assertEqual(body["reasoning"], {"effort": "low"})
        self.assertEqual(result["answer"], "Current answer [Example].")
        self.assertEqual(result["citations"], [{
            "startIndex": 15,
            "endIndex": 24,
            "url": "https://example.com/current",
            "title": "Example source",
        }])

    def test_saved_api_key_is_not_returned_by_public_config(self):
        environment_names = (
            "WORLD_CONSOLE_OPENAI_API_KEY",
            "OPENAI_API_KEY",
            "WORLD_CONSOLE_OPENAI_BASE_URL",
            "OPENAI_BASE_URL",
            "WORLD_CONSOLE_MARKET_ASK_MODEL",
            "OPENAI_MODEL",
            "WORLD_CONSOLE_MARKET_ASK_PROTOCOL",
            "WORLD_CONSOLE_MARKET_ASK_WEB_SEARCH",
            "WORLD_CONSOLE_MARKET_ASK_API_URL",
            "WORLD_CONSOLE_MCP_API_URL",
            "WORLD_CONSOLE_USE_CODEX_ASK",
        )
        clean_environment = {name: "" for name in environment_names}
        with tempfile.TemporaryDirectory() as directory:
            config_path = Path(directory) / ".world-console.local.json"
            with (
                mock.patch.object(world_console, "LOCAL_CONFIG", config_path),
                mock.patch.dict(os.environ, clean_environment, clear=False),
            ):
                public = world_console.save_market_ask_config({
                    "baseUrl": "https://api.openai.com/v1",
                    "model": "gpt-5.6-terra",
                    "protocol": "responses",
                    "webSearch": False,
                    "apiKey": "secret-test-key",
                })
                saved = json.loads(config_path.read_text(encoding="utf-8"))
                saved_text = config_path.read_text(encoding="utf-8")

        self.assertTrue(public["configured"])
        self.assertTrue(public["hasApiKey"])
        self.assertFalse(public["webSearch"])
        self.assertNotIn("apiKey", public)
        self.assertNotIn("apiKey", saved["ask"])
        self.assertRegex(saved["ask"]["apiKeyProtected"], r"^(dpapi|plain):")
        self.assertNotIn("secret-test-key", saved_text)
        self.assertFalse(saved["ask"]["webSearch"])

    def test_environment_endpoint_never_reuses_a_locally_saved_key(self):
        environment_names = (
            "WORLD_CONSOLE_OPENAI_API_KEY",
            "OPENAI_API_KEY",
            "WORLD_CONSOLE_OPENAI_BASE_URL",
            "OPENAI_BASE_URL",
            "WORLD_CONSOLE_MARKET_ASK_MODEL",
            "OPENAI_MODEL",
            "WORLD_CONSOLE_MARKET_ASK_PROTOCOL",
            "WORLD_CONSOLE_MARKET_ASK_WEB_SEARCH",
        )
        clean_environment = {name: "" for name in environment_names}
        clean_environment.update({
            "WORLD_CONSOLE_OPENAI_BASE_URL": "https://gateway.example/v1",
            "WORLD_CONSOLE_MARKET_ASK_MODEL": "environment-model",
        })
        with tempfile.TemporaryDirectory() as directory:
            config_path = Path(directory) / ".world-console.local.json"
            config_path.write_text(json.dumps({
                "ask": {
                    "baseUrl": "https://api.openai.com/v1",
                    "apiKey": "local-secret",
                    "model": "local-model",
                    "webSearch": True,
                }
            }), encoding="utf-8")
            with (
                mock.patch.object(world_console, "LOCAL_CONFIG", config_path),
                mock.patch.dict(os.environ, clean_environment, clear=False),
            ):
                config = world_console.market_model_api_config()

        self.assertEqual(config["baseUrl"], "https://gateway.example/v1")
        self.assertEqual(config["model"], "environment-model")
        self.assertEqual(config["apiKey"], "")
        self.assertFalse(config["webSearch"])
        self.assertTrue(config["managedByEnvironment"])

    def test_non_connection_environment_overrides_preserve_saved_connection(self):
        environment_names = (
            "WORLD_CONSOLE_OPENAI_API_KEY",
            "OPENAI_API_KEY",
            "WORLD_CONSOLE_OPENAI_BASE_URL",
            "OPENAI_BASE_URL",
            "WORLD_CONSOLE_MARKET_ASK_MODEL",
            "OPENAI_MODEL",
            "WORLD_CONSOLE_MARKET_ASK_PROTOCOL",
            "WORLD_CONSOLE_MARKET_ASK_WEB_SEARCH",
        )
        clean_environment = {name: "" for name in environment_names}
        clean_environment.update({
            "WORLD_CONSOLE_MARKET_ASK_MODEL": "environment-model",
            "WORLD_CONSOLE_MARKET_ASK_WEB_SEARCH": "false",
        })
        with tempfile.TemporaryDirectory() as directory:
            config_path = Path(directory) / ".world-console.local.json"
            config_path.write_text(json.dumps({
                "ask": {
                    "baseUrl": "https://api.openai.com/v1",
                    "apiKey": "local-secret",
                    "model": "local-model",
                    "protocol": "responses",
                    "webSearch": True,
                }
            }), encoding="utf-8")
            with (
                mock.patch.object(world_console, "LOCAL_CONFIG", config_path),
                mock.patch.dict(os.environ, clean_environment, clear=False),
            ):
                config = world_console.market_model_api_config()

        self.assertEqual(config["baseUrl"], "https://api.openai.com/v1")
        self.assertEqual(config["apiKey"], "local-secret")
        self.assertEqual(config["model"], "environment-model")
        self.assertFalse(config["webSearch"])
        self.assertTrue(config["managedByEnvironment"])

    def test_changing_endpoint_without_a_new_key_clears_the_old_key(self):
        environment_names = (
            "WORLD_CONSOLE_OPENAI_API_KEY",
            "OPENAI_API_KEY",
            "WORLD_CONSOLE_OPENAI_BASE_URL",
            "OPENAI_BASE_URL",
            "WORLD_CONSOLE_MARKET_ASK_MODEL",
            "OPENAI_MODEL",
            "WORLD_CONSOLE_MARKET_ASK_PROTOCOL",
            "WORLD_CONSOLE_MARKET_ASK_WEB_SEARCH",
        )
        with tempfile.TemporaryDirectory() as directory:
            config_path = Path(directory) / ".world-console.local.json"
            config_path.write_text(json.dumps({
                "ask": {
                    "baseUrl": "https://api.openai.com/v1",
                    "apiKey": "old-secret",
                    "model": "old-model",
                }
            }), encoding="utf-8")
            with (
                mock.patch.object(world_console, "LOCAL_CONFIG", config_path),
                mock.patch.dict(os.environ, {name: "" for name in environment_names}, clear=False),
            ):
                world_console.save_market_ask_config({
                    "baseUrl": "https://gateway.example/v1",
                    "model": "new-model",
                    "protocol": "responses",
                    "webSearch": False,
                })
                saved = json.loads(config_path.read_text(encoding="utf-8"))

        self.assertNotIn("apiKey", saved["ask"])

    def test_saved_key_can_be_removed_explicitly(self):
        environment_names = (
            "WORLD_CONSOLE_OPENAI_API_KEY",
            "OPENAI_API_KEY",
            "WORLD_CONSOLE_OPENAI_BASE_URL",
            "OPENAI_BASE_URL",
            "WORLD_CONSOLE_MARKET_ASK_MODEL",
            "OPENAI_MODEL",
            "WORLD_CONSOLE_MARKET_ASK_PROTOCOL",
            "WORLD_CONSOLE_MARKET_ASK_WEB_SEARCH",
        )
        with tempfile.TemporaryDirectory() as directory:
            config_path = Path(directory) / ".world-console.local.json"
            with (
                mock.patch.object(world_console, "LOCAL_CONFIG", config_path),
                mock.patch.dict(os.environ, {name: "" for name in environment_names}, clear=False),
            ):
                world_console.save_market_ask_config({
                    "baseUrl": "https://api.openai.com/v1",
                    "model": "gpt-5.6-terra",
                    "apiKey": "temporary-secret",
                })
                public = world_console.save_market_ask_config({
                    "baseUrl": "https://api.openai.com/v1",
                    "model": "gpt-5.6-terra",
                    "clearApiKey": True,
                })
                saved = json.loads(config_path.read_text(encoding="utf-8"))

        self.assertFalse(public["hasApiKey"])
        self.assertNotIn("apiKey", saved["ask"])
        self.assertNotIn("apiKeyProtected", saved["ask"])

    def test_responses_citations_are_offset_across_multiple_text_blocks(self):
        payload = {
            "output_text": "First [A].\nSecond [B].",
            "output": [{
                "type": "message",
                "content": [
                    {
                        "type": "output_text",
                        "text": "First [A].",
                        "annotations": [{
                            "type": "url_citation",
                            "start_index": 6,
                            "end_index": 9,
                            "url": "https://example.com/a",
                            "title": "A",
                        }],
                    },
                    {
                        "type": "output_text",
                        "text": "Second [B].",
                        "annotations": [{
                            "type": "url_citation",
                            "start_index": 7,
                            "end_index": 10,
                            "url": "https://example.com/b",
                            "title": "B",
                        }],
                    },
                ],
            }],
        }

        answer, citations = world_console.extract_response_answer_and_citations(payload)

        self.assertEqual(answer, "First [A].\nSecond [B].")
        self.assertEqual([(item["startIndex"], item["endIndex"]) for item in citations], [(6, 9), (18, 21)])

    def test_non_loopback_http_model_endpoint_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "HTTPS"):
            world_console.normalized_http_url("http://example.com/v1", allow_loopback_http=True)

    def test_model_endpoint_rejects_invalid_ports_during_configuration(self):
        for url in (
            "https://example.com:abc/v1",
            "https://example.com:0/v1",
            "https://example.com:65536/v1",
        ):
            with self.subTest(url=url), self.assertRaisesRegex(ValueError, "port"):
                world_console.normalized_http_url(url, allow_loopback_http=True)

    def test_saturated_history_workers_report_a_retryable_refresh(self):
        semaphore = mock.Mock()
        semaphore.acquire.return_value = False
        asset = {"group": "company", "symbol": "RETRY-ONLY-TEST"}
        with mock.patch.object(world_console, "MARKET_HISTORY_REFRESH_SEMAPHORE", semaphore):
            refreshing = world_console.refresh_market_history_async("", asset, "5d")

        self.assertTrue(refreshing)
        semaphore.acquire.assert_called_once_with(blocking=False)


if __name__ == "__main__":
    unittest.main()
