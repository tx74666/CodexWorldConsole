import argparse
import concurrent.futures
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
import hashlib
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import html
import json
import os
import re
import shutil
import socket
import subprocess
import sys
import threading
import urllib.request
import urllib.parse
import webbrowser
import xml.etree.ElementTree as ET


APP_DIR = Path(__file__).resolve().parent
DEFAULT_PORT = 8797
WORLD_CACHE = APP_DIR / "cache" / "world.geojson"
EVENT_TRANSLATION_CACHE = APP_DIR / "cache" / "translations.json"
IMAGE_CACHE = APP_DIR / "cache" / "images.json"
MARKET_CACHE = APP_DIR / "cache" / "markets.json"
MARKET_HISTORY_CACHE = APP_DIR / "cache" / "market_history.json"
GOOGLE_TRANSLATE_ENDPOINT = "https://translation.googleapis.com/language/translate/v2"
TRANSLATION_TARGET = "zh-TW"

NEWS_FEEDS = [
    ("BBC World", "https://feeds.bbci.co.uk/news/world/rss.xml"),
    ("NPR World", "https://feeds.npr.org/1004/rss.xml"),
    ("The Guardian", "https://www.theguardian.com/world/rss"),
    ("Al Jazeera", "https://www.aljazeera.com/xml/rss/all.xml"),
]

WORLD_GEOJSON_URLS = [
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
    "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json",
]

MARKET_CACHE_SECONDS = 1800
MARKET_DISPLAY_COUNT = 50
MARKET_FETCH_LIMIT = 120
MARKET_HISTORY_PREP_LIMIT = 12
MARKET_INITIAL_HISTORY_ASSET_COUNT = 12
MARKET_CACHE_SCHEMA_VERSION = 7
MARKET_FULL_HISTORY_POINTS = 260
MARKET_DENSE_HISTORY_POINTS = 460
MARKET_RECENT_DENSE_DAYS = 430
MARKET_SHORT_HISTORY_POINTS = 520
MARKET_INTRADAY_HISTORY_MIN_POINTS = 30
MARKET_INTRADAY_SESSION_MIN_POINTS = 12
MARKET_SHORT_HISTORY_MIN_POINTS = 24
MARKET_SPARKLINE_POINTS = 60
MARKET_CACHE_REWRITE_BYTES = 5_000_000
MARKET_REFRESH_LOCK = threading.Lock()
MARKET_REFRESH_IN_PROGRESS = False
SELECTION_TRANSLATION_CACHE = {}
SELECTION_TRANSLATION_CACHE_LIMIT = 160
SELECTION_TRANSLATION_CACHE_LOCK = threading.Lock()
SELECTION_TRANSLATION_EXTERNAL_TIMEOUT = 1.35
SELECTION_TRANSLATION_EXECUTOR = concurrent.futures.ThreadPoolExecutor(max_workers=6)
SELECTION_TRANSLATION_FALLBACKS = {
    "injured": {
        "zh-CN": "受伤",
        "en": "injured",
        "dictionary": [{"part": "adjective", "terms": ["受伤的", "负伤的"]}],
        "examples": ["Several people were injured in the blast."],
    },
    "wounded": {
        "zh-CN": "受伤",
        "en": "wounded",
        "dictionary": [{"part": "adjective", "terms": ["受伤的", "负伤的"]}],
        "examples": ["The wounded were taken to hospital."],
    },
    "ceasefire": {
        "zh-CN": "停火",
        "en": "ceasefire",
        "dictionary": [{"part": "noun", "terms": ["停火", "停战", "休战"]}],
        "examples": ["The ceasefire agreement was announced overnight."],
    },
    "proposal": {
        "zh-CN": "提案",
        "en": "proposal",
        "dictionary": [{"part": "noun", "terms": ["提案", "建议", "提议"]}],
        "examples": ["The proposal is still under discussion."],
    },
    "missile": {
        "zh-CN": "导弹",
        "en": "missile",
        "dictionary": [{"part": "noun", "terms": ["导弹", "飞弹"]}],
        "examples": ["A missile was intercepted before impact."],
    },
    "strike": {
        "zh-CN": "袭击",
        "en": "strike",
        "dictionary": [{"part": "noun", "terms": ["袭击", "罢工", "打击"]}, {"part": "verb", "terms": ["袭击", "打击", "罢工"]}],
        "examples": ["The strike hit a military site."],
    },
    "blast": {
        "zh-CN": "爆炸",
        "en": "blast",
        "dictionary": [{"part": "noun", "terms": ["爆炸", "冲击波"]}],
        "examples": ["The blast damaged nearby buildings."],
    },
    "hostage": {
        "zh-CN": "人质",
        "en": "hostage",
        "dictionary": [{"part": "noun", "terms": ["人质"]}],
        "examples": ["The hostages were released."],
    },
    "sanction": {
        "zh-CN": "制裁",
        "en": "sanction",
        "dictionary": [{"part": "noun", "terms": ["制裁", "批准"]}, {"part": "verb", "terms": ["制裁", "批准"]}],
        "examples": ["The country faces new sanctions."],
    },
}
SELECTION_TRANSLATION_FALLBACKS.update({
    "market cap": {
        "zh-CN": "市值",
        "en": "market cap",
        "dictionary": [{"part": "noun", "terms": ["市值", "市场总值"]}],
        "examples": ["Apple's market cap rose today."],
    },
    "market capitalization": {
        "zh-CN": "市值",
        "en": "market capitalization",
        "dictionary": [{"part": "noun", "terms": ["市值", "市场总值"]}],
        "examples": ["Market capitalization is share price multiplied by shares outstanding."],
    },
    "cap": {
        "zh-CN": "市值",
        "en": "cap",
        "dictionary": [{"part": "noun", "terms": ["市值", "上限", "帽子"]}],
        "examples": ["In market cap, cap is short for capitalization."],
    },
    "rank": {
        "zh-CN": "排名",
        "en": "rank",
        "dictionary": [{"part": "noun", "terms": ["排名", "等级"]}],
        "examples": ["The asset rank changed after the latest update."],
    },
    "rank move": {
        "zh-CN": "排名变化",
        "en": "rank move",
        "dictionary": [{"part": "noun", "terms": ["排名变化", "名次变动"]}],
        "examples": ["Rank move shows how many positions changed."],
    },
    "symbol": {
        "zh-CN": "代码",
        "en": "symbol",
        "dictionary": [{"part": "noun", "terms": ["代码", "符号"]}],
        "examples": ["AAPL is Apple's ticker symbol."],
    },
    "value": {
        "zh-CN": "数值",
        "en": "value",
        "dictionary": [{"part": "noun", "terms": ["数值", "价值"]}],
        "examples": ["The value column shows the selected figure."],
    },
    "move": {
        "zh-CN": "涨跌幅",
        "en": "move",
        "dictionary": [{"part": "noun", "terms": ["涨跌幅", "变动"]}],
        "examples": ["Move shows today's percentage change."],
    },
    "country": {
        "zh-CN": "国家/地区",
        "en": "country",
        "dictionary": [{"part": "noun", "terms": ["国家", "地区"]}],
        "examples": ["Country shows where the asset is listed."],
    },
    "source": {
        "zh-CN": "来源",
        "en": "source",
        "dictionary": [{"part": "noun", "terms": ["来源", "数据来源"]}],
        "examples": ["Source identifies where the data came from."],
    },
    "updated": {
        "zh-CN": "更新于",
        "en": "updated",
        "dictionary": [{"part": "verb", "terms": ["更新", "更新于"]}],
        "examples": ["Updated shows the latest refresh time."],
    },
    "anchor": {
        "zh-CN": "基准",
        "en": "anchor",
        "dictionary": [{"part": "noun", "terms": ["基准", "锚定项"]}],
        "examples": ["Anchor selects the base currency."],
    },
    "currency pair": {
        "zh-CN": "货币对",
        "en": "currency pair",
        "dictionary": [{"part": "noun", "terms": ["货币对", "汇率对"]}],
        "examples": ["USD to CNY is a currency pair."],
    },
    "currency": {
        "zh-CN": "货币",
        "en": "currency",
        "dictionary": [{"part": "noun", "terms": ["货币", "币种"]}],
        "examples": ["Currency quotes compare each unit against USD."],
    },
    "exchange rates": {
        "zh-CN": "汇率",
        "en": "exchange rates",
        "dictionary": [{"part": "noun", "terms": ["汇率", "兑换率"]}],
        "examples": ["Exchange rates show currency conversion values."],
    },
    "fiat": {
        "zh-CN": "法定货币",
        "en": "fiat",
        "dictionary": [{"part": "noun", "terms": ["法定货币", "法币"]}],
        "examples": ["Fiat currencies include USD, EUR, and CNY."],
    },
    "crypto": {
        "zh-CN": "加密资产",
        "en": "crypto",
        "dictionary": [{"part": "noun", "terms": ["加密资产", "加密货币"]}],
        "examples": ["Bitcoin is shown as a crypto asset."],
    },
    "metal": {
        "zh-CN": "金属",
        "en": "metal",
        "dictionary": [{"part": "noun", "terms": ["金属", "贵金属"]}],
        "examples": ["Gold is listed as a metal."],
    },
    "asset": {
        "zh-CN": "资产",
        "en": "asset",
        "dictionary": [{"part": "noun", "terms": ["资产", "标的"]}],
        "examples": ["Each card represents one asset."],
    },
    "assets": {
        "zh-CN": "资产",
        "en": "assets",
        "dictionary": [{"part": "noun", "terms": ["资产", "标的"]}],
        "examples": ["Top assets are ordered by market value."],
    },
    "top assets": {
        "zh-CN": "前列资产",
        "en": "top assets",
        "dictionary": [{"part": "noun", "terms": ["前列资产", "排名靠前的资产"]}],
        "examples": ["Top assets include companies, metals, and cryptocurrencies."],
    },
    "reports": {
        "zh-CN": "报告",
        "en": "reports",
        "dictionary": [{"part": "noun", "terms": ["报告", "消息"]}],
        "examples": ["Reports are grouped by location."],
    },
    "stats": {
        "zh-CN": "统计",
        "en": "stats",
        "dictionary": [{"part": "noun", "terms": ["统计", "数据"]}],
        "examples": ["Stats mode shows city data."],
    },
    "markets": {
        "zh-CN": "市场",
        "en": "markets",
        "dictionary": [{"part": "noun", "terms": ["市场", "行情"]}],
        "examples": ["Markets mode shows assets and exchange rates."],
    },
    "selected text": {
        "zh-CN": "选中文本",
        "en": "selected text",
        "dictionary": [{"part": "noun", "terms": ["选中文本", "所选文字"]}],
        "examples": ["Selected text appears in the translation panel."],
    },
    "original": {
        "zh-CN": "原文",
        "en": "original",
        "dictionary": [{"part": "noun", "terms": ["原文", "原始内容"]}],
        "examples": ["Original shows the selected source text."],
    },
    "translation": {
        "zh-CN": "翻译",
        "en": "translation",
        "dictionary": [{"part": "noun", "terms": ["翻译", "译文"]}],
        "examples": ["Translation shows the target language result."],
    },
    "local time": {
        "zh-CN": "本地时间",
        "en": "local time",
        "dictionary": [{"part": "noun", "terms": ["本地时间", "当地时间"]}],
        "examples": ["Local time is updated every second."],
    },
    "company": {
        "zh-CN": "公司",
        "en": "company",
        "dictionary": [{"part": "noun", "terms": ["公司", "企业"]}],
        "examples": ["Apple is a company asset."],
    },
    "companies": {
        "zh-CN": "公司",
        "en": "companies",
        "dictionary": [{"part": "noun", "terms": ["公司", "企业"]}],
        "examples": ["Companies are mixed with metals and crypto assets."],
    },
    "share price": {
        "zh-CN": "股价",
        "en": "share price",
        "dictionary": [{"part": "noun", "terms": ["股价", "股票价格"]}],
        "examples": ["Share price is one input for market cap."],
    },
    "share": {
        "zh-CN": "股票/份额",
        "en": "share",
        "dictionary": [{"part": "noun", "terms": ["股票", "份额"]}],
        "examples": ["Share can refer to one unit of stock."],
    },
    "price": {
        "zh-CN": "价格",
        "en": "price",
        "dictionary": [{"part": "noun", "terms": ["价格", "价位"]}],
        "examples": ["Price changes affect the value."],
    },
    "bitcoin": {
        "zh-CN": "比特币",
        "en": "bitcoin",
        "dictionary": [{"part": "noun", "terms": ["比特币", "BTC"]}],
        "examples": ["Bitcoin is listed under crypto."],
    },
    "gold": {
        "zh-CN": "黄金",
        "en": "gold",
        "dictionary": [{"part": "noun", "terms": ["黄金", "金"]}],
        "examples": ["Gold is tracked as XAU."],
    },
})
ALL_ASSETS_URL = "https://companiesmarketcap.com/assets-by-market-cap/"
COMPANIES_MARKETCAP_BASE = "https://companiesmarketcap.com/"
FRANKFURTER_BASE = "https://api.frankfurter.dev/v1"
FIAT_CURRENCY_CODES = [
    "EUR", "CNY", "JPY", "GBP", "CHF", "HKD", "SGD",
]
CURRENCY_INFO = {
    "USD": ("US Dollar", "美元", "us"),
    "EUR": ("Euro", "欧元", "eu"),
    "CNY": ("Chinese Yuan", "人民币", "cn"),
    "JPY": ("Japanese Yen", "日元", "jp"),
    "GBP": ("British Pound", "英镑", "gb"),
    "CHF": ("Swiss Franc", "瑞士法郎", "ch"),
    "HKD": ("Hong Kong Dollar", "港元", "hk"),
    "SGD": ("Singapore Dollar", "新加坡元", "sg"),
    "KRW": ("South Korean Won", "韩元", "kr"),
    "INR": ("Indian Rupee", "印度卢比", "in"),
    "CAD": ("Canadian Dollar", "加元", "ca"),
    "AUD": ("Australian Dollar", "澳元", "au"),
    "BRL": ("Brazilian Real", "巴西雷亚尔", "br"),
    "MXN": ("Mexican Peso", "墨西哥比索", "mx"),
    "TRY": ("Turkish Lira", "土耳其里拉", "tr"),
    "ZAR": ("South African Rand", "南非兰特", "za"),
}
CURRENCY_ASSET_CODES = {
    "GOLD": ("XAU", "Gold", "黄金", "metal", "oz"),
}
CURRENCY_ANCHOR_CODES = ["USD", "CNY", "EUR", "JPY", "GBP", "BTC", "XAU"]
REQUIRED_FIAT_CURRENCY_CODES = {"USD", *FIAT_CURRENCY_CODES}
REQUIRED_CURRENCY_CODES = {*REQUIRED_FIAT_CURRENCY_CODES, "BTC", "XAU"}
YAHOO_SYMBOL_OVERRIDES = {
    "GOLD": "GC=F",
    "SILVER": "SI=F",
    "BTC": "BTC-USD",
}
YAHOO_CURRENCY_SYMBOLS = {
    "CNY": "USDCNY=X",
    "EUR": "USDEUR=X",
    "JPY": "USDJPY=X",
    "GBP": "USDGBP=X",
    "CHF": "USDCHF=X",
    "HKD": "USDHKD=X",
    "SGD": "USDSGD=X",
    "BTC": "BTC-USD",
    "XAU": "GC=F",
}
MARKET_SYMBOLS = [
    {"id": "sp500", "symbol": "^GSPC"},
    {"id": "nasdaq", "symbol": "^IXIC"},
    {"id": "hangseng", "symbol": "^HSI"},
    {"id": "usd_cny", "symbol": "CNY=X"},
    {"id": "eur_usd", "symbol": "EURUSD=X"},
    {"id": "gold", "symbol": "GC=F"},
    {"id": "oil", "symbol": "CL=F"},
    {"id": "btc", "symbol": "BTC-USD"},
    {"id": "nvidia", "symbol": "NVDA"},
    {"id": "microsoft", "symbol": "MSFT"},
    {"id": "apple", "symbol": "AAPL"},
    {"id": "tsmc", "symbol": "TSM"},
]

IMPORTANT_TERMS = {
    "war": 2,
    "ceasefire": 2,
    "invasion": 2,
    "strike": 2,
    "missile": 2,
    "summit": 2,
    "election": 2,
    "president": 1,
    "minister": 1,
    "court": 1,
    "sanction": 1,
    "tariff": 1,
    "trade": 1,
    "nuclear": 2,
    "hostage": 2,
    "china": 1,
    "taiwan": 2,
    "russia": 1,
    "ukraine": 2,
    "iran": 2,
    "gaza": 2,
    "israel": 1,
    "trump": 1,
    "xi": 1,
    "putin": 1,
}

NON_EVENT_TITLE_TERMS = [
    "as it happened",
    "comment",
    "commentary",
    "live",
    "podcast",
    "opinion",
    "analysis",
    "explainer",
    "what we know",
    "what to know",
    "your questions answered",
    "takeaways",
    "travelogue",
    "review",
]

HYPOTHETICAL_TITLE_TERMS = [
    "could",
    "if",
    "may",
    "might",
    "possible",
    "chance",
    "fears",
    "concerns",
    "threat",
    "threats",
]

HYPOTHETICAL_ALLOWED_TERMS = [
    "called off",
    "delays",
    "delayed",
    "pauses",
    "postponed",
]

INDIRECT_SOURCE_TERMS = [
    "activists say",
    "advocates say",
    "analysts say",
    "campaigners say",
    "critics say",
    "experts say",
    "groups say",
    "rights group says",
    "rights groups say",
]

INTENTION_TITLE_TERMS = [
    "aims to",
    "expected to",
    "plans to",
    "planning to",
    "seeking to",
    "seeks to",
    "set to",
    "tries to",
    "trying to",
    "wants to",
]

INTENTION_ALLOWED_TERMS = [
    "announces",
    "announced",
    "called off",
    "delays",
    "delayed",
    "imposes",
    "orders",
    "pauses",
    "postponed",
]

QUESTION_STARTERS = {
    "can",
    "could",
    "did",
    "does",
    "do",
    "how",
    "is",
    "should",
    "what",
    "when",
    "where",
    "why",
    "will",
    "would",
}

CONCRETE_EVENT_TERMS = [
    "advances",
    "announces",
    "announced",
    "arrives",
    "attack",
    "attacks",
    "blames",
    "called off",
    "ceasefire",
    "conducts",
    "delays",
    "delayed",
    "detains",
    "drone",
    "earthquake",
    "election",
    "expel",
    "fire",
    "flood",
    "imposes",
    "jails",
    "kill",
    "killed",
    "kills",
    "launches",
    "meeting",
    "meet",
    "meets",
    "missile",
    "orders",
    "passes",
    "pauses",
    "postponed",
    "reaches deal",
    "reports",
    "resolution",
    "rises",
    "rules",
    "sanction",
    "sentences",
    "signs deal",
    "strike",
    "strikes",
    "surge",
    "surges",
    "summit",
    "tariff",
    "visit",
    "visits",
    "vote",
    "wins",
]

HARD_EVENT_TERMS = [
    "attack",
    "attacks",
    "ceasefire",
    "conducts",
    "death toll",
    "drone",
    "earthquake",
    "flood",
    "imposes",
    "kill",
    "killed",
    "kills",
    "launches",
    "missile",
    "sanction",
    "strike",
    "strikes",
    "summit",
]

LOCATION_HINTS = [
    ("Taipei", "Taiwan", 25.0330, 121.5654, ["taipei", "taiwan"]),
    ("Beijing", "China", 39.9042, 116.4074, ["beijing", "beijing summit", "trump xi", "xi jinping", "xi", "china"]),
    ("Washington", "United States", 38.9072, -77.0369, ["white house", "washington", "united states", "us"]),
    ("Moscow", "Russia", 55.7558, 37.6173, ["moscow", "putin", "russia", "kremlin"]),
    ("Kyiv", "Ukraine", 50.4501, 30.5234, ["kyiv", "kiev", "ukraine"]),
    ("Gaza", "Palestinian territories", 31.5017, 34.4668, ["gaza", "hamas"]),
    ("Jerusalem", "Israel", 31.7683, 35.2137, ["jerusalem", "israel"]),
    ("Lebanon", "Lebanon", 33.8547, 35.8623, ["lebanon", "hezbollah", "tyre", "deir qanoun"]),
    ("Tehran", "Iran", 35.6892, 51.3890, ["tehran", "iran", "hormuz", "gulf states", "middle east crisis"]),
    ("Abu Dhabi", "United Arab Emirates", 24.4539, 54.3773, ["abu dhabi", "uae", "united arab emirates", "barakah"]),
    ("Doha", "Qatar", 25.2854, 51.5310, ["doha", "qatar"]),
    ("Riga", "Latvia", 56.9496, 24.1052, ["riga", "latvia"]),
    ("Havana", "Cuba", 23.1136, -82.3666, ["havana", "cuba"]),
    ("Caracas", "Venezuela", 10.4806, -66.9036, ["caracas", "venezuela", "maduro"]),
    ("London", "United Kingdom", 51.5072, -0.1276, ["london", "britain", "uk", "united kingdom"]),
    ("Brussels", "Belgium", 50.8503, 4.3517, ["brussels", "eu", "european union", "nato"]),
    ("New York", "United States", 40.7128, -74.0060, ["new york", "united nations", "wall street"]),
    ("Tokyo", "Japan", 35.6762, 139.6503, ["tokyo", "japan"]),
    ("Seoul", "South Korea", 37.5665, 126.9780, ["seoul", "south korea", "north korea"]),
    ("New Delhi", "India", 28.6139, 77.2090, ["new delhi", "india"]),
    ("Islamabad", "Pakistan", 33.6844, 73.0479, ["islamabad", "pakistan"]),
    ("Bangkok", "Thailand", 13.7563, 100.5018, ["bangkok", "thailand"]),
    ("Jakarta", "Indonesia", -6.2088, 106.8456, ["jakarta", "indonesia"]),
    ("Sydney", "Australia", -33.8688, 151.2093, ["sydney", "australia"]),
    ("Sao Paulo", "Brazil", -23.5558, -46.6396, ["sao paulo", "brazil"]),
]

LOCATION_KEY_WEIGHTS = {
    "beijing": 14,
    "beijing summit": 16,
    "trump xi": 18,
    "xi jinping": 16,
    "china": 8,
    "xi": 4,
    "tehran": 16,
    "iran": 14,
    "hormuz": 14,
    "gulf states": 12,
    "middle east crisis": 12,
    "gaza": 16,
    "hamas": 12,
    "jerusalem": 14,
    "israel": 10,
    "lebanon": 16,
    "hezbollah": 12,
    "tyre": 12,
    "deir qanoun": 14,
    "abu dhabi": 16,
    "uae": 14,
    "united arab emirates": 16,
    "barakah": 16,
    "latvia": 14,
    "riga": 14,
    "cuba": 14,
    "havana": 14,
    "venezuela": 16,
    "caracas": 16,
    "maduro": 14,
    "washington": 14,
    "white house": 14,
    "united states": 8,
    "us": 3,
}

FALLBACK_EVENTS = [
    {
        "id": "fallback-trump-xi-beijing",
        "title": "Trump-Xi Beijing summit puts Taiwan, trade and Iran in focus",
        "statement": "Trump-Xi Beijing summit puts Taiwan, trade and Iran in focus",
        "summary": "Recent reporting described the Beijing summit as high-stakes diplomacy with modest deliverables and pointed warnings over Taiwan.",
        "source": "Fallback brief",
        "url": "https://apnews.com/article/75d703648da64e2caaace39e6415dc35",
        "published": "2026-05-16T00:00:00Z",
        "location": "Beijing",
        "country": "China",
        "lat": 39.9042,
        "lon": 116.4074,
        "category": "diplomacy",
        "severity": 5,
    },
    {
        "id": "fallback-putin-china",
        "title": "Putin visit to China follows Trump's Beijing trip",
        "statement": "Putin visit to China follows Trump's Beijing trip",
        "summary": "Russia-China diplomacy remains under watch as Moscow leans heavily on Beijing during continuing pressure over Ukraine.",
        "source": "Fallback brief",
        "url": "https://apnews.com/article/75d703648da64e2caaace39e6415dc35",
        "published": "2026-05-16T00:00:00Z",
        "location": "Beijing",
        "country": "China",
        "lat": 39.9042,
        "lon": 116.4074,
        "category": "diplomacy",
        "severity": 4,
    },
]


class ConsoleHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(APP_DIR), **kwargs)

    def do_GET(self):
        if self.path.startswith("/api/events"):
            self.send_json({"events": load_events(), "updated": datetime.now(timezone.utc).isoformat()})
            return
        if self.path.startswith("/api/markets"):
            self.send_json(load_markets())
            return
        if self.path.startswith("/api/market-history"):
            query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            url = query.get("url", [""])[0]
            asset = {
                "symbol": query.get("symbol", [""])[0],
                "group": query.get("group", [""])[0],
                "marketCap": finite_number(query.get("marketCap", [""])[0]),
                "value": finite_number(query.get("value", [""])[0]),
            }
            self.send_json(load_market_history(url, asset, query.get("range", [""])[0]))
            return
        if self.path.startswith("/api/translate"):
            query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            text = query.get("text", [""])[0]
            target = query.get("target", ["zh-CN"])[0]
            ui_language = query.get("ui", ["zh"])[0]
            context = query.get("context", [""])[0]
            try:
                self.send_json(translate_text(text, target, ui_language, context))
            except Exception:
                self.send_json({"error": "translation unavailable"}, status=502)
            return
        if self.path.startswith("/api/image-file"):
            query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            url = query.get("url", [""])[0]
            self.send_image(url)
            return
        if self.path.startswith("/api/article-image-file"):
            query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            url = query.get("url", [""])[0]
            self.send_article_image(url)
            return
        if self.path.startswith("/api/image"):
            query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            url = query.get("url", [""])[0]
            self.send_json({"imageUrl": article_image_url(url)})
            return
        if self.path.startswith("/api/world"):
            geojson = load_world_geojson()
            if geojson:
                self.send_json(geojson)
            else:
                self.send_json({"error": "world map unavailable"}, status=503)
            return
        super().do_GET()

    def do_POST(self):
        if self.path.startswith("/api/market-ask"):
            try:
                length = min(int(self.headers.get("Content-Length", "0") or 0), 80_000)
                body = self.rfile.read(length)
                payload = json.loads(body.decode("utf-8", errors="ignore")) if body else {}
            except Exception:
                self.send_json({"error": "bad request"}, status=400)
                return
            try:
                result = answer_market_question(payload)
                status = int(result.pop("_status", 200)) if isinstance(result, dict) else 200
                self.send_json(result, status=status)
            except Exception as exc:
                self.send_json({"error": str(exc) or "market ask unavailable"}, status=502)
            return
        self.send_json({"error": "not found"}, status=404)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        return

    def send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def send_image(self, url):
        image_url = clean_image_url(url)
        if not image_url:
            self.send_json({"error": "image unavailable"}, status=404)
            return
        try:
            request = urllib.request.Request(image_url, headers={"User-Agent": "CodexWorldConsole/1.0"})
            with urllib.request.urlopen(request, timeout=8) as response:
                content_type = response.headers.get("Content-Type", "image/jpeg").split(";", 1)[0]
                body = response.read()
            if not content_type.startswith("image/") or not body:
                self.send_json({"error": "image unavailable"}, status=404)
                return
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "public, max-age=86400")
            self.end_headers()
            self.wfile.write(body)
        except Exception:
            self.send_json({"error": "image unavailable"}, status=404)

    def send_article_image(self, url):
        image_url = article_image_url(url)
        if not image_url:
            self.send_json({"error": "image unavailable"}, status=404)
            return
        self.send_image(image_url)


def fetch_url(url, timeout=6, user_agent="CodexWorldConsole/1.0"):
    request = urllib.request.Request(url, headers={"User-Agent": user_agent})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def compact_text(value, limit=1200):
    text = re.sub(r"\s+", " ", str(value or "")).strip()
    return text[:limit].strip()


def extract_response_text(payload):
    if not isinstance(payload, dict):
        return ""
    direct = compact_text(payload.get("output_text"), 4000)
    if direct:
        return direct
    chunks = []
    for item in payload.get("output") or []:
        if not isinstance(item, dict):
            continue
        for content in item.get("content") or []:
            if not isinstance(content, dict):
                continue
            text = content.get("text")
            if isinstance(text, dict):
                text = text.get("value")
            text = compact_text(text, 4000)
            if text:
                chunks.append(text)
    return "\n".join(chunks).strip()


def market_ask_endpoint():
    return (
        os.environ.get("WORLD_CONSOLE_MARKET_ASK_API_URL")
        or os.environ.get("WORLD_CONSOLE_MCP_API_URL")
        or ""
    ).strip()


def market_ask_api_key():
    return (
        os.environ.get("WORLD_CONSOLE_MARKET_ASK_API_KEY")
        or os.environ.get("WORLD_CONSOLE_MCP_API_KEY")
        or ""
    ).strip()


def openai_api_key():
    return (
        os.environ.get("WORLD_CONSOLE_OPENAI_API_KEY")
        or os.environ.get("OPENAI_API_KEY")
        or ""
    ).strip()


def openai_base_url():
    return (
        os.environ.get("WORLD_CONSOLE_OPENAI_BASE_URL")
        or os.environ.get("OPENAI_BASE_URL")
        or "https://api.openai.com/v1"
    ).strip().rstrip("/")


def openai_market_model():
    return (
        os.environ.get("WORLD_CONSOLE_MARKET_ASK_MODEL")
        or os.environ.get("OPENAI_MODEL")
        or "gpt-5-mini"
    ).strip()


def normalize_market_ask_mode(value):
    return "fast" if str(value or "").strip().lower() == "fast" else "think"


def use_codex_market_ask():
    return os.environ.get("WORLD_CONSOLE_USE_CODEX_ASK", "").strip().lower() in {"1", "true", "yes", "on"}


def codex_home_path():
    return (
        os.environ.get("CODEX_HOME")
        or str(Path.home() / ".codex")
    )


def codex_executable_path():
    candidates = [
        os.environ.get("WORLD_CONSOLE_CODEX_CLI"),
        os.environ.get("CODEX_CLI_PATH"),
        r"C:\Users\Randy\AppData\Local\OpenAI\Codex\bin\codex.exe",
        str(Path.home() / "AppData" / "Local" / "OpenAI" / "Codex" / "bin" / "codex.exe"),
        shutil.which("codex"),
    ]
    for candidate in candidates:
        if candidate and Path(candidate).exists():
            return str(Path(candidate))
    return ""


def market_research_symbol(context):
    asset = context.get("asset") if isinstance(context, dict) else {}
    if not isinstance(asset, dict):
        return ""
    group = compact_text(asset.get("group"), 32).lower()
    symbol = compact_text(asset.get("symbol"), 32).upper()
    if group != "companies":
        return ""
    return symbol if re.match(r"^[A-Z0-9.\-^=]{1,24}$", symbol) else ""


def yahoo_finance_headlines(symbol, limit=4):
    if not symbol:
        return []
    query = urllib.parse.urlencode({"s": symbol, "region": "US", "lang": "en-US"})
    url = f"https://feeds.finance.yahoo.com/rss/2.0/headline?{query}"
    try:
        root = ET.fromstring(fetch_url(url, timeout=5, user_agent="Mozilla/5.0 CodexWorldConsole/1.0"))
    except Exception:
        return []
    rows = []
    for item in root.findall(".//item"):
        title = compact_text(item.findtext("title"), 180)
        if not title:
            continue
        rows.append({
            "title": title,
            "summary": compact_text(strip_markup(item.findtext("description") or ""), 220),
            "published": compact_text(item.findtext("pubDate"), 80),
            "url": compact_text(item.findtext("link"), 220),
            "source": "Yahoo Finance",
        })
        if len(rows) >= limit:
            break
    return rows


def enrich_market_context_for_thinking(question, context):
    if not isinstance(context, dict):
        return {}
    enriched = dict(context)
    symbol = market_research_symbol(context)
    headlines = yahoo_finance_headlines(symbol) if symbol else []
    if headlines:
        enriched["research"] = {
            "symbol": symbol,
            "question": compact_text(question, 240),
            "items": headlines,
        }
    return enriched


def market_answer_limit(mode="think"):
    return 520 if normalize_market_ask_mode(mode) == "fast" else 1100


def clean_market_answer(answer, limit=900):
    text = compact_text(answer, limit)
    if not text:
        return ""
    text = re.sub(r"^(只能|只可|目前只能|当前只能)[^。；\n]{0,90}[。；]\s*", "", text)
    text = re.sub(r"没有新闻、财报或行业催化信息[，,、]?", "", text)
    text = text.replace("无法确认具体上涨原因", "")
    text = text.replace("无法确认具体下跌原因", "")
    text = text.replace("无法确认具体原因", "")
    return re.sub(r"\s+", " ", text).strip(" ，,;\n")


def call_market_ask_endpoint(question, context, mode="think"):
    endpoint = market_ask_endpoint()
    if not endpoint:
        return None
    body = json.dumps({
        "question": question,
        "mode": mode,
        "context": context,
    }, ensure_ascii=False).encode("utf-8")
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "CodexWorldConsole/1.0",
    }
    api_key = market_ask_api_key()
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
        headers["X-API-Key"] = api_key
    request = urllib.request.Request(endpoint, data=body, headers=headers, method="POST")
    with urllib.request.urlopen(request, timeout=14 if mode == "fast" else 24) as response:
        payload = json.loads(response.read().decode("utf-8", errors="ignore"))
    answer = compact_text(
        payload.get("answer") or payload.get("response") or payload.get("text") or payload.get("result"),
        4000,
    ) if isinstance(payload, dict) else ""
    if not answer:
        answer = extract_response_text(payload)
    answer = clean_market_answer(answer, market_answer_limit(mode))
    return {"answer": answer, "source": "Market MCP"} if answer else None


def call_openai_market_ask(question, context, mode="think"):
    api_key = openai_api_key()
    if not api_key:
        return None
    instructions = (
        "You are a sharp market analysis assistant inside a local market console. "
        "Use the selected asset, currency pair, marketSnapshot, semiconductorPeers, and research snippets when present. "
        "Do not ask clarifying questions; infer whether the user asks about the asset, sector, currency pair, rank, or chart. "
        "When explaining a move, connect the visible price move to sector breadth, valuation/positioning, macro pressure, catalysts, and what to watch next. "
        "If the question is about semiconductor or AI-chip weakness, explicitly consider AI valuation/profit taking, earnings expectations, rates/jobs pressure, and supply-chain contagion when supported by context. "
        "Avoid generic phrases like 'repricing' unless you explain what is being repriced. "
        "Do not expose internal uncertainty phrases such as 'only from current data' or 'cannot confirm'. "
        "If evidence is indirect, say '可能' once and then give the concrete driver. Do not invent live prices, dates, or events not present in context. "
        "Answer in Chinese unless the user asks for another language. "
        "Fast mode: one compact paragraph, usually 3-5 sentences. Think mode: 4-7 concise sentences or short bullets, with a clear conclusion. "
        "This is informational analysis, not financial advice."
    )
    body = {
        "model": openai_market_model(),
        "instructions": instructions,
        "input": (
            "User question:\n"
            f"{question}\n\n"
            f"Mode: {mode}\n\n"
            "Selected market context JSON:\n"
            f"{json.dumps(context, ensure_ascii=False, indent=2)}"
        ),
        "max_output_tokens": 1100 if mode == "think" else 650,
    }
    reasoning_effort = os.environ.get("WORLD_CONSOLE_MARKET_ASK_REASONING", "low").strip()
    if mode == "fast":
        reasoning_effort = os.environ.get("WORLD_CONSOLE_MARKET_ASK_FAST_REASONING", "minimal").strip()
    if reasoning_effort:
        body["reasoning"] = {"effort": reasoning_effort}
    request = urllib.request.Request(
        f"{openai_base_url()}/responses",
        data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "CodexWorldConsole/1.0",
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=14 if mode == "fast" else 30) as response:
        payload = json.loads(response.read().decode("utf-8", errors="ignore"))
    answer = clean_market_answer(extract_response_text(payload), market_answer_limit(mode))
    return {"answer": answer, "source": f"OpenAI · {openai_market_model()}"} if answer else None


def call_codex_market_ask(question, context, mode="think"):
    executable = codex_executable_path()
    if not executable:
        return None
    output_path = APP_DIR / "cache" / "market_ask_last.txt"
    output_path.parent.mkdir(exist_ok=True)
    try:
        if output_path.exists():
            output_path.unlink()
    except OSError:
        pass

    prompt = (
        "你是 WorldConsole 里的市场问答助手。"
        "你只能基于用户问题和给定 JSON 上下文回答；不要调用工具，不要修改文件，不要编造实时数据、新闻或日期。"
        "上下文可能包含 asset、currency、marketSnapshot、semiconductorPeers、research。"
        "如果用户问涨跌原因，要把当前资产、同板块广度、估值/仓位、宏观压力、直接催化和后续观察点串起来。"
        "不要只说“重新定价”，除非你解释到底在重估什么。"
        "请用中文，直接回答。\n\n"
        f"用户问题：{question}\n\n"
        "当前选中上下文 JSON：\n"
        f"{json.dumps(context, ensure_ascii=False, indent=2)}"
    )
    prompt = (
        prompt
        + "\n\n"
        + f"\u91cd\u8981\uff1a\u6a21\u5f0f\u662f {mode}\u3002\u4f60\u8981\u81ea\u5df1\u5224\u65ad\u7528\u6237\u95ee\u7684\u662f\u8d44\u4ea7\u3001\u6c47\u7387\u3001\u6392\u540d\u8fd8\u662f\u8d70\u52bf\uff0c\u4e0d\u8981\u628a\u5224\u65ad\u8fc7\u7a0b\u5199\u51fa\u6765\u3002"
        + "\u4e0d\u8981\u5199\u201c\u53ea\u80fd\u4ece\u5f53\u524d\u6570\u636e\u201d\u3001\u201c\u65e0\u6cd5\u786e\u8ba4\u201d\u8fd9\u7c7b\u5185\u90e8\u9650\u5236\u53e5\u3002"
        + "\u8bc1\u636e\u95f4\u63a5\u65f6\u7528\u201c\u53ef\u80fd\u201d\uff0c\u7136\u540e\u7ed9\u51fa\u5177\u4f53\u63a8\u65ad\u3002"
        + ("\u56de\u7b54\u9650 500 \u4e2a\u4e2d\u6587\u5b57\u7b26\u3002" if mode == "fast" else "\u56de\u7b54\u53ef\u4ee5\u7528 5-8 \u53e5\uff0c\u628a\u56e0\u679c\u94fe\u8bb2\u5b8c\u6574\u3002")
    )
    env = os.environ.copy()
    env["CODEX_HOME"] = codex_home_path()
    command = [
        executable,
        "exec",
        "--skip-git-repo-check",
        "--ephemeral",
        "--ignore-rules",
        "--sandbox",
        "read-only",
        "-c",
        'approval_policy="never"',
        "-c",
        f'model_reasoning_effort="{"minimal" if mode == "fast" else "medium"}"',
        "-C",
        str(APP_DIR),
        "--output-last-message",
        str(output_path),
        "-",
    ]
    completed = subprocess.run(
        command,
        input=prompt,
        text=True,
        encoding="utf-8",
        errors="replace",
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        cwd=str(APP_DIR),
        env=env,
        timeout=28 if mode == "fast" else 75,
        creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
    )
    answer = ""
    try:
        if output_path.exists():
            answer = clean_market_answer(output_path.read_text(encoding="utf-8", errors="replace"), 4000)
    except OSError:
        answer = ""
    if not answer:
        lines = [
            line.strip()
            for line in (completed.stdout or "").splitlines()
            if line.strip()
            and not line.startswith("OpenAI Codex")
            and not line.startswith("--------")
            and not line.startswith("workdir:")
            and not line.startswith("model:")
            and not line.startswith("provider:")
            and not line.startswith("approval:")
            and not line.startswith("sandbox:")
            and not line.startswith("reasoning")
            and not line.startswith("session id:")
            and not line.startswith("tokens used")
            and not re.match(r"^\d{4}-\d{2}-\d{2}T", line)
        ]
        answer = clean_market_answer(lines[-1] if lines else "", 4000)
    if completed.returncode == 0 and answer:
        return {"answer": answer, "source": "Local Codex"}
    return None


def finite_float(value):
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if number != number or abs(number) == float("inf"):
        return None
    return number


def market_context_value(context, *keys):
    data = context
    for key in keys:
        if not isinstance(data, dict):
            return None
        data = data.get(key)
    return data


def market_context_dict(context, *keys):
    data = market_context_value(context, *keys)
    return data if isinstance(data, dict) else {}


def market_context_list(context, *keys):
    data = market_context_value(context, *keys)
    return data if isinstance(data, list) else []


def market_item_name(item):
    if not isinstance(item, dict):
        return ""
    return compact_text(item.get("name") or item.get("symbol") or item.get("id"), 80)


def market_item_symbol(item):
    if not isinstance(item, dict):
        return ""
    return compact_text(item.get("symbol"), 32).upper()


def market_item_pct(item):
    if not isinstance(item, dict):
        return None
    pct = finite_float(item.get("changePct"))
    if pct is not None:
        return pct
    move = compact_text(item.get("move"), 40)
    match = re.search(r"[-+]?\d+(?:\.\d+)?", move)
    return finite_float(match.group(0)) if match else None


def market_item_label(item, include_rank=False):
    name = market_item_name(item)
    if not name:
        return ""
    pct = market_item_pct(item)
    rank = item.get("rank") if isinstance(item, dict) else None
    prefix = f"#{rank} " if include_rank and rank else ""
    if pct is None:
        return f"{prefix}{name}"
    return f"{prefix}{name} {pct:+.2f}%"


def format_market_item_list(items, limit=5, include_rank=False):
    labels = []
    for item in items:
        label = market_item_label(item, include_rank=include_rank)
        if label:
            labels.append(label)
        if len(labels) >= limit:
            break
    return "、".join(labels)


def compact_money(value):
    number = finite_float(value)
    if number is None:
        return ""
    absolute = abs(number)
    if absolute >= 1_000_000_000_000:
        return f"${number / 1_000_000_000_000:.2f}T"
    if absolute >= 1_000_000_000:
        return f"${number / 1_000_000_000:.2f}B"
    if absolute >= 1_000_000:
        return f"${number / 1_000_000:.2f}M"
    return f"${number:,.2f}"


def research_headlines(context, limit=3):
    items = market_context_list(context, "research", "items")
    titles = []
    for item in items:
        title = compact_text(item.get("title") if isinstance(item, dict) else item, 110)
        if title:
            titles.append(title)
        if len(titles) >= limit:
            break
    return titles


SEMICONDUCTOR_QUERY_RE = re.compile(
    r"半导体|半導體|芯片|晶片|AI\s*芯|HBM|SOX|台股|台积电|台積電|联发科|聯發科|"
    r"semiconductor|chip|chips|broadcom|博通|nvidia|英伟达|英偉達|amd|micron|美光|"
    r"marvell|tsmc|asml|hynix|海力士|qualcomm|高通|intel|英特尔|英特爾",
    re.IGNORECASE,
)


def is_semiconductor_question(question, context):
    asset = market_context_dict(context, "asset")
    text = " ".join([
        compact_text(question, 300),
        market_item_name(asset),
        market_item_symbol(asset),
        " ".join(market_item_symbol(item) for item in market_context_list(context, "semiconductorPeers")[:8]),
    ])
    return bool(SEMICONDUCTOR_QUERY_RE.search(text))


def is_taiwan_supply_chain_question(question, context):
    asset = market_context_dict(context, "asset")
    text = " ".join([compact_text(question, 300), market_item_name(asset), market_item_symbol(asset)])
    return bool(re.search(r"台股|台湾|臺灣|台积|台積|联发科|聯發科|TSMC|MediaTek|Hynix|海力士", text, re.IGNORECASE))


def local_semiconductor_answer(question, context):
    asset = market_context_dict(context, "asset")
    selected = market_item_label(asset)
    peers = market_context_list(context, "semiconductorPeers")
    peer_decliners = [item for item in peers if (market_item_pct(item) or 0) < 0]
    peer_gainers = [item for item in peers if (market_item_pct(item) or 0) > 0]
    decliner_line = format_market_item_list(peer_decliners, limit=6)
    gainer_line = format_market_item_list(peer_gainers, limit=4)
    titles = research_headlines(context, limit=2)
    question_blob = f"{question} {market_item_name(asset)} {market_item_symbol(asset)}"
    mentions_broadcom = bool(re.search(r"broadcom|博通|AVGO", question_blob, re.IGNORECASE))

    lines = []
    if selected:
        lines.append(f"这不像 {selected} 单独出问题，更像半导体/AI 芯片链条一起降温。")
    else:
        lines.append("这更像半导体/AI 芯片链条的集中降温，不是单一公司的孤立波动。")
    if decliner_line:
        lines.append(f"同屏里 {decliner_line} 都在跌，说明资金先砍高 beta、涨幅大的 AI/芯片仓位。")
    elif gainer_line:
        lines.append(f"同屏半导体并非全跌，{gainer_line} 仍然上涨，所以更像局部仓位切换，而不是行业基本面同时崩掉。")
    if mentions_broadcom:
        lines.append("Broadcom 这类龙头的财报/指引只要没有继续大幅抬高 AI 预期，市场就容易按“高预期落空、利多出尽”处理。")
    else:
        lines.append("核心逻辑通常是 AI 芯片交易太拥挤：需求故事还在，但股价和估值先跑得太快，任何不够惊艳的财报或指引都会触发获利回吐。")
    if titles:
        lines.append(f"已抓到的相关标题里，{titles[0]}，这类消息会放大市场对增长节奏和估值的敏感度。")
    else:
        lines.append("宏观上如果同时遇到强就业、利率上行或降息推迟预期，高估值科技股会被压估值，半导体指数通常反应更剧烈。")
    if is_taiwan_supply_chain_question(question, context):
        lines.append("台积电、联发科、海力士这类供应链跟跌，更多是美股 AI 链条估值修正传导，不等于台湾公司基本面突然变差。")
    else:
        lines.append("全球供应链会被一起带下来，是因为资金把 GPU、HBM、晶圆代工、网络芯片和服务器链条当作同一个 AI trade 处理。")
    lines.append("所以当前更像 correction/估值重估；后面真正要警惕的是 AI 服务器订单、HBM 需求、云厂商资本开支如果连续下修，那才可能从回调变成趋势反转。")
    return clean_market_answer(" ".join(lines), 1100)


def local_currency_answer(question, context):
    currency = market_context_dict(context, "currency")
    pair = compact_text(currency.get("pair"), 80)
    move = compact_text(currency.get("move"), 40)
    anchor = market_context_dict(currency, "anchor")
    quote = market_context_dict(currency, "quote")
    if not pair:
        return ""
    anchor_name = compact_text(anchor.get("name") or anchor.get("code"), 60)
    quote_name = compact_text(quote.get("name") or quote.get("code"), 60)
    return clean_market_answer(
        f"{pair} 当前变动 {move or '接近持平'}。这类汇率问题重点看两边相对强弱："
        f"{anchor_name} 是基准，{quote_name} 是报价；如果图表上行，表示同一单位 {anchor.get('code') or '基准货币'} 能换到更多 {quote.get('code') or '报价货币'}。"
        "短线原因通常来自利率预期、风险偏好和美元流动性，长期再看通胀差、贸易和央行政策。",
        760,
    )


def local_asset_answer(question, context):
    asset = market_context_dict(context, "asset")
    name = market_item_name(asset)
    if not name:
        return ""
    symbol = market_item_symbol(asset)
    pct = market_item_pct(asset)
    move = compact_text(asset.get("move"), 40)
    rank = asset.get("rank")
    cap = compact_money(asset.get("marketCap"))
    titles = research_headlines(context, limit=2)
    nearby = market_context_list(context, "marketSnapshot", "nearby")
    decliners = market_context_list(context, "marketSnapshot", "decliners")
    gainers = market_context_list(context, "marketSnapshot", "gainers")
    direction = "上涨" if pct is not None and pct > 0 else "下跌" if pct is not None and pct < 0 else "波动"
    facts = [name]
    if symbol and symbol != name.upper():
        facts.append(symbol)
    if rank:
        facts.append(f"排名 #{rank}")
    if cap:
        facts.append(f"市值 {cap}")
    if move:
        facts.append(f"当前 {move}")

    lines = [f"{'，'.join(facts)}。"]
    if titles:
        lines.append(f"直接消息面先看：{titles[0]}。这会影响市场对它短期增长、估值或风险折价的判断。")
    strongest_same_side = [item for item in (decliners if pct is not None and pct < 0 else gainers) if market_item_name(item) != name]
    same_side_line = format_market_item_list(strongest_same_side, limit=4)
    nearby_line = format_market_item_list(nearby, limit=4, include_rank=True)
    if same_side_line:
        lines.append(f"从同屏涨跌看，{same_side_line} 也在同方向移动，说明这不一定只是单家公司事件，可能有板块或风格资金在一起切换。")
    elif nearby_line:
        lines.append(f"它附近排名的参照是 {nearby_line}，如果只有它明显异动，就更偏公司自身消息；如果一起动，就更偏板块因素。")
    if pct is not None:
        if abs(pct) >= 5:
            lines.append(f"{abs(pct):.2f}% 的幅度已经不是普通噪音，通常意味着预期、仓位或消息面至少有一项被明显重估。")
        else:
            lines.append(f"这个幅度更像短线情绪和仓位调整，除非后续新闻、成交量或指引继续确认，否则先不要把它直接等同于基本面反转。")
    lines.append(f"结论：这次{direction}要先分清是公司催化、板块共振还是宏观估值压力；现在的屏幕证据更适合把它当作“需要继续确认的市场定价变化”。")
    return clean_market_answer(" ".join(lines), 950)


def local_market_answer(question, context):
    if not isinstance(context, dict):
        return "没有足够的市场上下文。"
    if is_semiconductor_question(question, context):
        return local_semiconductor_answer(question, context)
    asset_answer = local_asset_answer(question, context)
    if asset_answer:
        return asset_answer
    currency_answer = local_currency_answer(question, context)
    if currency_answer:
        return currency_answer
    return "没有足够的市场上下文。"


def answer_market_question(payload):
    if not isinstance(payload, dict):
        raise ValueError("bad request")
    question = compact_text(payload.get("question"), 1200)
    context = payload.get("context") if isinstance(payload.get("context"), dict) else {}
    mode = normalize_market_ask_mode(payload.get("mode"))
    if not question:
        raise ValueError("question required")
    if mode == "fast":
        for caller in (call_market_ask_endpoint, call_openai_market_ask):
            try:
                result = caller(question, context, mode)
            except Exception:
                result = None
            if result and result.get("answer"):
                result["answer"] = clean_market_answer(result["answer"], market_answer_limit(mode))
                result["mode"] = mode
                return result
        return {"answer": local_market_answer(question, context), "source": "Fast", "mode": mode}
    context = enrich_market_context_for_thinking(question, context)
    callers = [call_market_ask_endpoint, call_openai_market_ask]
    if use_codex_market_ask():
        callers.append(call_codex_market_ask)
    for caller in callers:
        try:
            result = caller(question, context, mode)
        except Exception:
            result = None
        if result and result.get("answer"):
            result["answer"] = clean_market_answer(result["answer"], market_answer_limit(mode))
            result["mode"] = mode
            return result
    return {"answer": local_market_answer(question, context), "source": "Local", "mode": mode}


def parse_translation_response(payload):
    if not isinstance(payload, dict):
        return ""
    candidates = [
        payload.get("translation"),
        payload.get("translatedText"),
        payload.get("translated"),
        payload.get("result"),
        payload.get("text"),
        payload.get("targetText"),
    ]
    data = payload.get("data")
    if isinstance(data, dict):
        candidates.extend([
            data.get("translation"),
            data.get("translatedText"),
            data.get("result"),
        ])
        translations = data.get("translations")
        if isinstance(translations, list) and translations:
            first = translations[0]
            if isinstance(first, dict):
                candidates.append(first.get("translatedText") or first.get("translation"))
    for value in candidates:
        value = re.sub(r"\s+", " ", str(value or "")).strip()
        if value:
            return value
    return ""


def internal_translate_endpoint():
    return (
        os.environ.get("WORLD_CONSOLE_TRANSLATE_API_URL")
        or os.environ.get("WORLD_CONSOLE_INTERNAL_TRANSLATE_URL")
        or os.environ.get("INTRANET_TRANSLATE_API_URL")
        or ""
    ).strip()


def internal_translate_api_key():
    return (
        os.environ.get("WORLD_CONSOLE_TRANSLATE_API_KEY")
        or os.environ.get("INTERNAL_TRANSLATE_API_KEY")
        or ""
    ).strip()


def internal_translate_text(text, target="zh-CN", context="", timeout=0.55):
    endpoint = internal_translate_endpoint()
    if not endpoint:
        return None

    body = json.dumps({
        "text": text,
        "q": text,
        "source": "auto",
        "target": target,
        "target_language": target,
        "context": context,
    }, ensure_ascii=False).encode("utf-8")
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "CodexWorldConsole/1.0",
    }
    api_key = internal_translate_api_key()
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
        headers["X-API-Key"] = api_key

    try:
        request = urllib.request.Request(endpoint, data=body, headers=headers, method="POST")
        with urllib.request.urlopen(request, timeout=timeout) as response:
            payload = json.loads(response.read().decode("utf-8", errors="ignore"))
        translated = parse_translation_response(payload)
        explanation = re.sub(r"\s+", " ", str(payload.get("explanation") or payload.get("reason") or "")).strip() if isinstance(payload, dict) else ""
        if translated:
            return {
                "translation": translated,
                "explanation": explanation,
                "detected": payload.get("detected") or payload.get("source") or "",
                "dictionary": payload.get("dictionary") if isinstance(payload.get("dictionary"), list) else [],
                "examples": payload.get("examples") if isinstance(payload.get("examples"), list) else [],
                "sourceName": "Internal Translate",
            }
    except Exception:
        pass

    try:
        query = urllib.parse.urlencode({"text": text, "q": text, "target": target, "source": "auto"})
        separator = "&" if "?" in endpoint else "?"
        request = urllib.request.Request(endpoint + separator + query, headers={"User-Agent": "CodexWorldConsole/1.0"})
        with urllib.request.urlopen(request, timeout=timeout) as response:
            payload = json.loads(response.read().decode("utf-8", errors="ignore"))
        translated = parse_translation_response(payload)
        if translated:
            return {
                "translation": translated,
                "explanation": re.sub(r"\s+", " ", str(payload.get("explanation") or "")).strip() if isinstance(payload, dict) else "",
                "detected": payload.get("detected") if isinstance(payload, dict) else "",
                "dictionary": payload.get("dictionary") if isinstance(payload, dict) and isinstance(payload.get("dictionary"), list) else [],
                "examples": payload.get("examples") if isinstance(payload, dict) and isinstance(payload.get("examples"), list) else [],
                "sourceName": "Internal Translate",
            }
    except Exception:
        return None
    return None


def google_translate_payload(text, target="zh-CN", include_details=False, timeout=1.8, attempts=1):
    params = [
        ("client", "gtx"),
        ("sl", "auto"),
        ("tl", target),
        ("dt", "t"),
    ]
    if include_details:
        params.extend([("dt", "bd"), ("dt", "ex")])
    params.append(("q", text))
    query = urllib.parse.urlencode(params)
    url = f"https://translate.googleapis.com/translate_a/single?{query}"
    last_error = None
    for _ in range(max(1, attempts)):
        try:
            return json.loads(fetch_url(
                url,
                timeout=timeout,
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            ).decode("utf-8", errors="ignore"))
        except Exception as error:
            last_error = error
    raise last_error


def mymemory_translate_text(text, target="zh-CN", timeout=1.8):
    source = "zh-CN" if re.search(r"[\u3400-\u9fff]", text or "") else "en"
    if target == "en" and source.startswith("zh"):
        langpair = "zh-CN|en"
    elif target.startswith("zh") and source == "en":
        langpair = "en|zh-CN"
    else:
        langpair = f"{source}|{target}"
    query = urllib.parse.urlencode({"q": text, "langpair": langpair})
    payload = json.loads(fetch_url(
        f"https://api.mymemory.translated.net/get?{query}",
        timeout=timeout,
        user_agent="Mozilla/5.0",
    ).decode("utf-8", errors="ignore"))
    translated = parse_translation_response(payload.get("responseData", {}) if isinstance(payload, dict) else {})
    if not translated and isinstance(payload, dict):
        translated = parse_translation_response(payload)
    if translated and str(payload.get("responseStatus", 200)) == "200":
        return {
            "translation": translated,
            "detected": source,
            "dictionary": [],
            "examples": [],
            "sourceName": "MyMemory",
        }
    return None


def google_translate_text(text, target="zh-CN", include_details=False, timeout=1.05):
    payload = google_translate_payload(text, target, include_details=include_details, timeout=timeout, attempts=1)
    translated = extract_google_translation(payload)
    if not translated:
        return None
    return {
        "translation": translated,
        "detected": payload[2] if isinstance(payload, list) and len(payload) > 2 else "",
        "dictionary": extract_google_dictionary(payload),
        "examples": extract_google_examples(payload),
        "sourceName": "Google Translate",
    }


def fastest_external_translate_text(text, target="zh-CN"):
    futures = [
        SELECTION_TRANSLATION_EXECUTOR.submit(google_translate_text, text, target, False, 1.05),
        SELECTION_TRANSLATION_EXECUTOR.submit(mymemory_translate_text, text, target, 1.15),
    ]
    try:
        for future in concurrent.futures.as_completed(futures, timeout=SELECTION_TRANSLATION_EXTERNAL_TIMEOUT):
            try:
                result = future.result()
            except Exception:
                result = None
            if result and result.get("translation"):
                for pending in futures:
                    if pending is not future:
                        pending.cancel()
                return result
    except concurrent.futures.TimeoutError:
        pass
    for future in futures:
        future.cancel()
    return None


def extract_google_translation(payload):
    if not isinstance(payload, list) or not payload or not isinstance(payload[0], list):
        return ""
    return re.sub(r"\s+", " ", "".join(
        str(part[0])
        for part in payload[0]
        if isinstance(part, list) and part and part[0]
    )).strip()


def extract_google_dictionary(payload):
    rows = payload[1] if isinstance(payload, list) and len(payload) > 1 and isinstance(payload[1], list) else []
    entries = []
    for row in rows[:4]:
        if not isinstance(row, list) or len(row) < 2:
            continue
        part = str(row[0] or "").strip()
        terms = [
            re.sub(r"\s+", " ", str(term)).strip()
            for term in (row[1] if isinstance(row[1], list) else [])
            if str(term or "").strip()
        ][:5]
        if terms:
            entries.append({"part": part, "terms": terms})
    return entries


def extract_google_examples(payload):
    raw = payload[13] if isinstance(payload, list) and len(payload) > 13 and isinstance(payload[13], list) else []
    examples = []
    for bucket in raw:
        if not isinstance(bucket, list):
            continue
        for item in bucket:
            if isinstance(item, list) and item and isinstance(item[0], str):
                example = strip_markup(item[0])
                if example and example not in examples:
                    examples.append(example)
            if len(examples) >= 2:
                return examples
    return examples


def selection_tokens(text):
    return re.findall(r"[A-Za-z][A-Za-z'-]*|\d+(?:\.\d+)?|[\u3400-\u9fff]+", text or "")


def englishish(text):
    return bool(re.search(r"[A-Za-z]", text or ""))


def main_dictionary_senses(dictionary, translation):
    seen = set()
    senses = []
    normalized_translation = re.sub(r"\s+", "", translation or "").lower()
    for entry in dictionary or []:
        terms = []
        for term in entry.get("terms", []) or []:
            normalized = re.sub(r"\s+", "", str(term or "")).lower()
            if not normalized or normalized in seen:
                continue
            seen.add(normalized)
            terms.append(str(term).strip())
        if not terms:
            continue
        if normalized_translation and all(re.sub(r"\s+", "", term).lower() == normalized_translation for term in terms):
            continue
        label = entry.get("part") or ""
        senses.append((label, terms[:3]))
        if len(senses) >= 3:
            break
    return senses


def zh_part_label(label):
    mapping = {
        "noun": "\u540d\u8bcd",
        "verb": "\u52a8\u8bcd",
        "adjective": "\u5f62\u5bb9\u8bcd",
        "adverb": "\u526f\u8bcd",
        "pronoun": "\u4ee3\u8bcd",
        "preposition": "\u4ecb\u8bcd",
        "conjunction": "\u8fde\u8bcd",
        "interjection": "\u611f\u53f9\u8bcd",
    }
    return mapping.get(str(label or "").lower(), label)


def fallback_selection_translation(source_text, target):
    key = re.sub(r"[^A-Za-z]+", " ", source_text or "").strip().lower()
    if not key:
        return None
    fallback = SELECTION_TRANSLATION_FALLBACKS.get(key)
    if not fallback:
        return None
    return {
        "translation": fallback.get(target) or fallback.get("zh-CN") or source_text,
        "detected": "en" if englishish(source_text) else "",
        "dictionary": fallback.get("dictionary", []),
        "examples": fallback.get("examples", []),
        "sourceName": "Local fallback",
    }


def cached_selection_translation(cache_key):
    with SELECTION_TRANSLATION_CACHE_LOCK:
        return SELECTION_TRANSLATION_CACHE.get(cache_key)


def remember_selection_translation(cache_key, result):
    with SELECTION_TRANSLATION_CACHE_LOCK:
        while len(SELECTION_TRANSLATION_CACHE) >= SELECTION_TRANSLATION_CACHE_LIMIT:
            try:
                SELECTION_TRANSLATION_CACHE.pop(next(iter(SELECTION_TRANSLATION_CACHE)))
            except StopIteration:
                break
        SELECTION_TRANSLATION_CACHE[cache_key] = result
    return result


def build_translation_result(source_text, translated, detected, target, dictionary, examples, source_name, ui_language, context, explanation=""):
    return {
        "text": source_text,
        "translation": translated,
        "explanation": explanation or build_selection_explanation(source_text, translated, detected, target, dictionary, examples, ui_language, context),
        "detected": detected,
        "target": target,
        "dictionary": dictionary,
        "examples": examples,
        "sourceName": source_name,
    }


def build_selection_explanation(source_text, translation, detected, target, dictionary, examples, ui_language="zh", context=""):
    source_text = re.sub(r"\s+", " ", source_text or "").strip()
    translation = re.sub(r"\s+", " ", translation or "").strip()
    context = re.sub(r"\s+", " ", context or "").strip()
    tokens = selection_tokens(source_text)
    english_text = englishish(source_text) or str(detected or "").startswith("en")
    senses = main_dictionary_senses(dictionary, translation)

    if ui_language != "zh":
        lines = []
        if translation:
            lines.append(f"In this selection: {translation}.")
        if senses:
            lines.append("Other main senses: " + "; ".join(
                f"{label}: {', '.join(terms)}" if label else ", ".join(terms)
                for label, terms in senses
            ) + ".")
        if len(tokens) > 1 and english_text:
            lines.append(f"Structure: the core word is usually near the end ({tokens[-1]}), while the words before it narrow the meaning.")
        if examples:
            lines.append("Example: " + examples[0])
        return "\n".join(lines)

    lines = []
    if translation:
        lines.append(f"\u8fd9\u91cc\u7684\u610f\u601d\uff1a{translation}\u3002")

    if context and source_text and source_text in context:
        lines.append("\u5224\u65ad\u4f9d\u636e\uff1a\u8fd9\u4e2a\u8bd1\u6cd5\u4f18\u5148\u670d\u52a1\u5f53\u524d\u9009\u533a\u9644\u8fd1\u7684\u53e5\u5b50\uff0c\u4e0d\u662f\u628a\u6240\u6709\u8bcd\u5178\u4e49\u90fd\u644a\u5f00\u3002")

    if senses:
        sense_parts = []
        for label, terms in senses:
            joined_terms = "\u3001".join(terms)
            display_label = zh_part_label(label)
            sense_parts.append(f"{display_label}\uff1a{joined_terms}" if display_label else joined_terms)
        lines.append("\u5176\u4ed6\u4e3b\u8981\u4e49\u9879\uff08\u7531\u4e3b\u5230\u6b21\uff09\uff1a" + "\uff1b".join(sense_parts) + "\u3002")

    if english_text and len(tokens) > 1:
        head = tokens[-1]
        modifier = "\u3001".join(tokens[:-1])
        lines.append(f"\u7ed3\u6784\uff1a\u8fd9\u662f\u4e00\u4e2a\u82f1\u6587\u77ed\u8bed\uff0c\u6838\u5fc3\u8bcd\u901a\u5e38\u5728\u540e\u9762\uff08{head}\uff09\uff0c\u524d\u9762\u7684 {modifier} \u5728\u9650\u5b9a\u5b83\u7684\u8303\u56f4\u6216\u5185\u5bb9\u3002")
        lines.append("\u4e3a\u4ec0\u4e48\u8fd9\u4e48\u7ffb\uff1a\u82f1\u6587\u5e38\u628a\u4fee\u9970\u8bcd\u653e\u5728\u6838\u5fc3\u8bcd\u524d\uff0c\u4e2d\u6587\u8981\u628a\u8fd9\u4e2a\u9650\u5b9a\u5173\u7cfb\u987a\u56de\u6765\uff0c\u5148\u8bf4\u5b83\u662f\u5173\u4e8e\u4ec0\u4e48\uff0c\u518d\u8bf4\u6838\u5fc3\u52a8\u4f5c/\u4e8b\u7269\u3002")
    elif english_text and len(tokens) == 1:
        lower = tokens[0].lower()
        if re.search(r"(tion|sion|ment|ness|ity|ance|ence)$", lower):
            lines.append("\u7ec6\u8282\uff1a\u8fd9\u7c7b\u8bcd\u5c3e\u5e38\u89c1\u4e8e\u540d\u8bcd\uff0c\u65b0\u95fb\u91cc\u901a\u5e38\u8981\u770b\u5b83\u540e\u9762\u63a5\u7684\u52a8\u8bcd\u6216\u4ecb\u8bcd\uff0c\u5224\u65ad\u662f\u4e8b\u4ef6\u3001\u72b6\u6001\u8fd8\u662f\u653f\u7b56\u52a8\u4f5c\u3002")
        elif re.search(r"(ed|ing)$", lower):
            lines.append("\u7ec6\u8282\uff1a\u8fd9\u4e2a\u5f62\u5f0f\u53ef\u80fd\u662f\u52a8\u8bcd\u5f62\u6001\uff0c\u4e5f\u53ef\u80fd\u50cf\u5f62\u5bb9\u8bcd\u4e00\u6837\u4fee\u9970\u540d\u8bcd\uff0c\u8981\u7ed3\u5408\u524d\u540e\u6587\u5224\u65ad\u3002")
        else:
            lines.append("\u7ec6\u8282\uff1a\u5355\u8bcd\u4e0d\u8981\u53ea\u8bb0\u4e00\u4e2a\u4e2d\u6587\u5bf9\u5e94\uff0c\u66f4\u8981\u770b\u5b83\u5728\u53e5\u5b50\u91cc\u4fee\u9970\u8c01\u3001\u88ab\u54ea\u4e2a\u52a8\u8bcd\u652f\u914d\u3001\u662f\u6b63\u5f0f\u8fd8\u662f\u53e3\u8bed\u3002")
    elif not english_text:
        lines.append("\u7ec6\u8282\uff1a\u4e2d\u6587\u8bcd\u7ec4\u7ffb\u6210\u82f1\u6587\u65f6\uff0c\u5e38\u8981\u5148\u627e\u6838\u5fc3\u540d\u8bcd/\u52a8\u8bcd\uff0c\u518d\u628a\u4fee\u9970\u4fe1\u606f\u653e\u5230\u524d\u9762\u6216\u7528\u4ecb\u8bcd\u77ed\u8bed\u63a5\u5728\u540e\u9762\u3002")

    if examples:
        lines.append("\u7528\u6cd5\u4f8b\u5b50\uff1a" + "\uff1b".join(examples[:2]) + "\u3002")
    return "\n".join(lines)


def translate_text(text, target="zh-CN", ui_language="zh", context=""):
    source_text = re.sub(r"\s+", " ", str(text or "")).strip()
    if not source_text:
        return {"text": "", "translation": "", "explanation": "", "target": target}
    source_text = source_text[:600]
    context = re.sub(r"\s+", " ", str(context or "")).strip()[:900]
    target = "en" if str(target).lower().startswith("en") else "zh-CN"
    ui_language = "zh" if str(ui_language).lower().startswith("zh") else "en"
    cache_key = (source_text, target, ui_language, context)
    cached = cached_selection_translation(cache_key)
    if cached:
        return cached

    fallback = fallback_selection_translation(source_text, target)
    if fallback:
        return remember_selection_translation(cache_key, build_translation_result(
            source_text,
            fallback["translation"],
            fallback["detected"],
            target,
            fallback["dictionary"],
            fallback["examples"],
            fallback["sourceName"],
            ui_language,
            context,
        ))

    internal_result = internal_translate_text(source_text, target, context)
    if internal_result:
        translated = internal_result["translation"]
        detected = internal_result.get("detected") or ""
        dictionary = internal_result.get("dictionary") or []
        examples = internal_result.get("examples") or []
        source_name = internal_result.get("sourceName") or "Internal Translate"
        supplied_explanation = internal_result.get("explanation") or ""
    else:
        supplied_explanation = ""
        external_result = fastest_external_translate_text(source_text, target)
        if external_result:
            translated = external_result["translation"]
            detected = external_result.get("detected") or ""
            dictionary = external_result.get("dictionary") or []
            examples = external_result.get("examples") or []
            source_name = external_result.get("sourceName") or "External Translate"
        else:
            translated = ""
            detected = ""
            dictionary = []
            examples = []
            source_name = ""

    if not translated:
        if not fallback:
            raise RuntimeError("translation unavailable")
        translated = fallback["translation"]
        detected = fallback["detected"]
        dictionary = fallback["dictionary"]
        examples = fallback["examples"]
        source_name = fallback["sourceName"]

    return remember_selection_translation(cache_key, build_translation_result(
        source_text,
        translated,
        detected,
        target,
        dictionary,
        examples,
        source_name,
        ui_language,
        context,
        supplied_explanation,
    ))


def strip_markup(text):
    text = re.sub(r"<[^>]+>", " ", text or "")
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def xml_local_name(tag):
    return str(tag).rsplit("}", 1)[-1].lower()


def clean_image_url(value, base_url=""):
    if not value:
        return ""
    value = html.unescape(str(value)).strip()
    if value.startswith("//"):
        value = "https:" + value
    elif base_url:
        value = urllib.parse.urljoin(base_url, value)
    if not re.match(r"^https?://", value, re.I):
        return ""
    return value


def item_image_url(item, raw_summary=""):
    for node in item.iter():
        name = xml_local_name(node.tag)
        url = clean_image_url(node.attrib.get("url") or node.attrib.get("href"))
        if not url:
            continue
        media_kind = (node.attrib.get("medium") or node.attrib.get("type") or "").lower()
        if name in {"thumbnail", "image"}:
            return url
        if name in {"content", "enclosure"} and ("image" in media_kind or re.search(r"\.(jpe?g|png|webp)(?:[?#].*)?$", url, re.I)):
            return url

    match = re.search(r"<img\b[^>]*\bsrc=[\"']([^\"']+)[\"']", raw_summary or "", re.I)
    return clean_image_url(match.group(1)) if match else ""


def load_image_cache():
    try:
        if IMAGE_CACHE.exists():
            return json.loads(IMAGE_CACHE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        pass
    return {}


def save_image_cache(cache):
    try:
        IMAGE_CACHE.parent.mkdir(exist_ok=True)
        IMAGE_CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    except OSError:
        pass


def extract_article_image(html_text, base_url):
    patterns = [
        r"<meta\b[^>]*(?:property|name)=[\"'](?:og:image|twitter:image|twitter:image:src)[\"'][^>]*content=[\"']([^\"']+)[\"']",
        r"<meta\b[^>]*content=[\"']([^\"']+)[\"'][^>]*(?:property|name)=[\"'](?:og:image|twitter:image|twitter:image:src)[\"']",
        r"<link\b[^>]*rel=[\"']image_src[\"'][^>]*href=[\"']([^\"']+)[\"']",
    ]
    for pattern in patterns:
        match = re.search(pattern, html_text or "", re.I)
        if match:
            url = clean_image_url(match.group(1), base_url)
            if url:
                return url
    return ""


def article_image_url(url):
    url = clean_image_url(url)
    if not url:
        return ""

    cache = load_image_cache()
    cached = cache.get(url)
    if isinstance(cached, str):
        return cached

    try:
        html_text = fetch_url(url, timeout=5).decode("utf-8", errors="ignore")
        image_url = extract_article_image(html_text, url)
    except Exception:
        image_url = ""

    cache[url] = image_url
    save_image_cache(cache)
    return image_url


def history_has_dated_points(history):
    return sum(
        1 for item in history or []
        if isinstance(item, dict) and item.get("date") and finite_number(item.get("value")) is not None
    ) >= 2


def limit_history_points(history, max_points):
    points = [item for item in history or [] if isinstance(item, dict)]
    if max_points <= 0 or len(points) <= max_points:
        return points
    if max_points == 1:
        return [points[-1]]
    result = []
    used = set()
    step = (len(points) - 1) / (max_points - 1)
    for index in range(max_points):
        source_index = round(index * step)
        if source_index in used:
            continue
        used.add(source_index)
        result.append(points[source_index])
    if result and result[-1] is not points[-1]:
        result[-1] = points[-1]
    return result


def history_point_datetime(item):
    if not isinstance(item, dict):
        return None
    raw = item.get("time") or item.get("date")
    if raw is None:
        return None
    if isinstance(raw, (int, float)) and not isinstance(raw, bool):
        timestamp = float(raw) / 1000 if float(raw) > 10_000_000_000 else float(raw)
        try:
            return datetime.fromtimestamp(timestamp, timezone.utc)
        except (OverflowError, OSError, ValueError):
            return None
    text = str(raw).strip()
    if not text:
        return None
    if re.fullmatch(r"\d{10,13}", text):
        timestamp = int(text) / 1000 if len(text) > 10 else int(text)
        try:
            return datetime.fromtimestamp(timestamp, timezone.utc)
        except (OverflowError, OSError, ValueError):
            return None
    try:
        parsed = datetime.fromisoformat(text.replace("Z", "+00:00"))
    except ValueError:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def limit_dense_history_points(history, max_points=MARKET_DENSE_HISTORY_POINTS):
    points = [item for item in history or [] if isinstance(item, dict)]
    if max_points <= 0 or len(points) <= max_points:
        return points
    dated = [(history_point_datetime(item), item) for item in points]
    dates = [date for date, _item in dated if date is not None]
    if len(dates) < 2:
        return limit_history_points(points, max_points)

    latest = max(dates)
    cutoff = latest - timedelta(days=MARKET_RECENT_DENSE_DAYS)
    recent = [item for date, item in dated if date is not None and date >= cutoff]
    older = [item for date, item in dated if date is None or date < cutoff]
    if len(recent) >= max_points:
        return limit_history_points(recent, max_points)
    older_budget = max_points - len(recent)
    return limit_history_points(older, older_budget) + recent


def history_span_days(history):
    dates = [history_point_datetime(item) for item in history or [] if isinstance(item, dict)]
    dates = [date for date in dates if date is not None]
    if len(dates) < 2:
        return 0
    return (max(dates) - min(dates)).total_seconds() / 86400


def history_point_count(history):
    return len([item for item in history or [] if isinstance(item, dict)])


def history_points_since(history, days):
    dated = [
        (history_point_datetime(item), item)
        for item in history or []
        if isinstance(item, dict)
    ]
    dates = [date for date, _item in dated if date is not None]
    if not dates:
        return []
    latest = max(dates)
    cutoff = latest - timedelta(days=days)
    return [item for date, item in dated if date is not None and cutoff <= date <= latest + timedelta(minutes=5)]


def latest_intraday_session_points(history):
    dated = [
        (history_point_datetime(item), item)
        for item in history or []
        if isinstance(item, dict)
    ]
    dated = [(date, item) for date, item in dated if date is not None]
    if not dated:
        return []
    latest_day = max(date.date() for date, _item in dated)
    return [item for date, item in dated if date.date() == latest_day]


def history_points_are_intraday_dense(history, min_points=MARKET_INTRADAY_HISTORY_MIN_POINTS):
    points = [
        history_point_datetime(item)
        for item in history or []
        if isinstance(item, dict)
    ]
    points = sorted(point for point in points if point is not None)
    if len(points) < min_points:
        return False
    gaps = [
        (points[index] - points[index - 1]).total_seconds()
        for index in range(1, len(points))
        if points[index] > points[index - 1]
    ]
    if not gaps:
        return False
    gaps.sort()
    return gaps[len(gaps) // 2] <= 20 * 60


def history_has_dense_intraday_points(history):
    recent = history_points_since(history, 1)
    return history_points_are_intraday_dense(recent, MARKET_INTRADAY_SESSION_MIN_POINTS)


def compact_market_payload(payload):
    if not isinstance(payload, dict):
        return payload
    for index, asset in enumerate(payload.get("assets", []) or []):
        if not isinstance(asset, dict):
            continue
        keep_chart_history = index < MARKET_INITIAL_HISTORY_ASSET_COUNT
        if keep_chart_history:
            asset["history"] = limit_history_points(asset.get("history"), MARKET_FULL_HISTORY_POINTS)
            asset["denseHistory"] = limit_dense_history_points(asset.get("denseHistory"), MARKET_DENSE_HISTORY_POINTS)
            asset["shortHistory"] = limit_history_points(asset.get("shortHistory"), MARKET_SHORT_HISTORY_POINTS)
        else:
            for key in ("history", "denseHistory", "shortHistory", "historySource", "denseHistorySource", "shortHistorySource"):
                asset.pop(key, None)
        asset["sparkline"] = limit_history_points(asset.get("sparkline"), MARKET_SPARKLINE_POINTS)
    currencies = payload.get("currencies")
    if isinstance(currencies, dict):
        for quote in currencies.get("quotes", []) or []:
            if not isinstance(quote, dict):
                continue
            quote["history"] = limit_history_points(quote.get("history"), MARKET_FULL_HISTORY_POINTS)
            quote["denseHistory"] = limit_dense_history_points(quote.get("denseHistory"), MARKET_DENSE_HISTORY_POINTS)
            quote["shortHistory"] = limit_history_points(quote.get("shortHistory"), MARKET_SHORT_HISTORY_POINTS)
    return payload


def sorted_market_assets(assets):
    return sorted(
        [item for item in assets or [] if isinstance(item, dict)],
        key=lambda item: (
            int(item.get("rank")) if str(item.get("rank", "")).isdigit() else 9999,
            -float(item.get("marketCap") or 0),
        ),
    )


def market_rank_key(asset):
    if not isinstance(asset, dict):
        return ""
    return str(asset.get("id") or asset.get("symbol") or asset.get("name") or "").lower()


def apply_market_rank_changes(assets, previous_payload):
    previous_assets = previous_payload.get("assets", []) if isinstance(previous_payload, dict) else []
    previous_updated = str(previous_payload.get("updated") or previous_payload.get("servedAt") or "") if isinstance(previous_payload, dict) else ""
    previous_ranks = {}
    for item in previous_assets:
        key = market_rank_key(item)
        rank = finite_number(item.get("rank")) if isinstance(item, dict) else None
        if key and rank is not None:
            previous_ranks[key] = int(rank)
    for asset in assets or []:
        key = market_rank_key(asset)
        current_rank = finite_number(asset.get("rank")) if isinstance(asset, dict) else None
        previous_rank = previous_ranks.get(key)
        if not key or current_rank is None or previous_rank is None:
            continue
        asset["rankPrevious"] = previous_rank
        asset["rankChange"] = previous_rank - int(current_rank)
        if previous_updated:
            asset["rankChangedAt"] = previous_updated
    return assets


def currency_quote_codes(currencies):
    if not isinstance(currencies, dict):
        return set()
    return {
        str(item.get("code", "")).upper()
        for item in currencies.get("quotes", []) or []
        if isinstance(item, dict) and item.get("code")
    }


def has_required_currency_quotes(currencies):
    return REQUIRED_CURRENCY_CODES.issubset(currency_quote_codes(currencies))


def has_enough_market_fill(assets):
    ranked = sorted_market_assets(assets)
    if len(ranked) < MARKET_DISPLAY_COUNT:
        return False
    without_metals = [item for item in ranked if item.get("group") != "metals"]
    without_crypto = [item for item in ranked if item.get("group") != "crypto"]
    companies = [item for item in ranked if item.get("group") == "companies"]
    return (
        len(without_metals) >= MARKET_DISPLAY_COUNT
        and len(without_crypto) >= MARKET_DISPLAY_COUNT
        and len(companies) >= MARKET_DISPLAY_COUNT
    )


def market_cache_payload(allow_stale=False):
    try:
        if not MARKET_CACHE.exists():
            return None
        payload = json.loads(MARKET_CACHE.read_text(encoding="utf-8"))
        assets = payload.get("assets")
        if not assets:
            return None
        if payload.get("source") != "companiesmarketcap-assets":
            return None
        if payload.get("schemaVersion") != MARKET_CACHE_SCHEMA_VERSION and not allow_stale:
            return None
        if len(assets) < MARKET_DISPLAY_COUNT:
            return None
        if not allow_stale and not has_enough_market_fill(assets):
            return None
        if not any(str(item.get("symbol", "")).upper() == "GOLD" for item in payload.get("assets", []) if isinstance(item, dict)):
            return None
        if not any(str(item.get("symbol", "")).upper() == "BTC" for item in payload.get("assets", []) if isinstance(item, dict)):
            return None
        if any(is_etf_name(item.get("name", ""), item.get("symbol", "")) for item in payload.get("assets", []) if isinstance(item, dict)):
            return None
        if not any(item.get("countryFlag") for item in payload.get("assets", []) if isinstance(item, dict) and item.get("country")):
            return None
        if not any(item.get("countryCode") for item in payload.get("assets", []) if isinstance(item, dict) and item.get("country")):
            return None
        if payload.get("source") == "companiesmarketcap-assets" and not any(
            item.get("historyUrl") for item in payload.get("assets", []) if isinstance(item, dict)
        ):
            return None
        if payload.get("source") == "companiesmarketcap-assets" and not any(
            item.get("history") for item in payload.get("assets", []) if isinstance(item, dict)
        ):
            return None
        if payload.get("source") == "companiesmarketcap-assets" and not any(
            history_has_dated_points(item.get("history"))
            for item in payload.get("assets", []) if isinstance(item, dict) and item.get("group") == "companies"
        ):
            return None
        if payload.get("source") == "companiesmarketcap-assets" and not any(
            history_has_dated_points(item.get("denseHistory"))
            for item in payload.get("assets", []) if isinstance(item, dict)
        ):
            return None
        if payload.get("source") == "companiesmarketcap-assets" and not any(
            history_has_dated_points(item.get("shortHistory"))
            for item in payload.get("assets", []) if isinstance(item, dict)
        ):
            return None
        currencies = payload.get("currencies")
        if not isinstance(currencies, dict) or not currencies.get("quotes"):
            return None
        if not has_required_currency_quotes(currencies):
            return None
        if not any(
            history_has_dated_points(item.get("denseHistory"))
            for item in currencies.get("quotes", []) if isinstance(item, dict) and item.get("code") != "USD"
        ):
            return None
        if not any(
            history_has_dated_points(item.get("shortHistory"))
            for item in currencies.get("quotes", []) if isinstance(item, dict) and item.get("code") != "USD"
        ):
            return None
        allowed_currency_codes = {"USD", *FIAT_CURRENCY_CODES, *CURRENCY_ANCHOR_CODES}
        if any(
            str(item.get("code", "")).upper() not in allowed_currency_codes
            for item in currencies.get("quotes", []) if isinstance(item, dict)
        ):
            return None
        updated = datetime.fromisoformat(str(payload.get("updated", "")).replace("Z", "+00:00"))
        age = datetime.now(timezone.utc) - updated
        if allow_stale or age <= timedelta(seconds=MARKET_CACHE_SECONDS):
            payload = compact_market_payload(payload)
            try:
                if MARKET_CACHE.stat().st_size > MARKET_CACHE_REWRITE_BYTES:
                    save_market_cache(payload)
            except OSError:
                pass
            payload["stale"] = age > timedelta(seconds=MARKET_CACHE_SECONDS)
            payload["servedAt"] = datetime.now(timezone.utc).isoformat()
            return payload
    except (OSError, ValueError, json.JSONDecodeError):
        return None
    return None


def save_market_cache(payload):
    try:
        MARKET_CACHE.parent.mkdir(exist_ok=True)
        if isinstance(payload, dict):
            payload["schemaVersion"] = MARKET_CACHE_SCHEMA_VERSION
        payload = compact_market_payload(payload)
        MARKET_CACHE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    except OSError:
        pass


def load_market_history_cache():
    try:
        if MARKET_HISTORY_CACHE.exists():
            payload = json.loads(MARKET_HISTORY_CACHE.read_text(encoding="utf-8"))
            return payload if isinstance(payload, dict) else {}
    except (OSError, json.JSONDecodeError):
        pass
    return {}


def save_market_history_cache(cache):
    try:
        MARKET_HISTORY_CACHE.parent.mkdir(exist_ok=True)
        MARKET_HISTORY_CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    except OSError:
        pass


def finite_number(*values):
    for value in values:
        if isinstance(value, (int, float)) and not isinstance(value, bool):
            return float(value)
        if isinstance(value, str):
            text = value.strip().replace(",", "").replace("$", "")
            if re.fullmatch(r"-?\d+(?:\.\d+)?", text):
                return float(text)
    return None


def yahoo_json(url, timeout=6):
    return json.loads(fetch_url(url, timeout=timeout).decode("utf-8", errors="ignore"))


def yahoo_quotes(symbols):
    query = urllib.parse.urlencode({"symbols": ",".join(symbols)})
    payload = yahoo_json(f"https://query1.finance.yahoo.com/v7/finance/quote?{query}", timeout=7)
    rows = payload.get("quoteResponse", {}).get("result", [])
    return {row.get("symbol"): row for row in rows if row.get("symbol")}


def yahoo_spark(symbols):
    query = urllib.parse.urlencode({
        "symbols": ",".join(symbols),
        "range": "1mo",
        "interval": "1d",
    })
    payload = yahoo_json(f"https://query1.finance.yahoo.com/v7/finance/spark?{query}", timeout=7)
    histories = {}
    for row in payload.get("spark", {}).get("result", []):
        symbol = row.get("symbol")
        responses = row.get("response") or []
        if not symbol or not responses:
            continue
        quote_rows = responses[0].get("indicators", {}).get("quote", [])
        closes = quote_rows[0].get("close", []) if quote_rows else []
        values = [float(value) for value in closes if isinstance(value, (int, float))]
        if len(values) >= 2:
            histories[symbol] = values[-24:]
    return histories


def parse_money_text(value):
    text = strip_markup(value).replace(",", "").replace("$", "").strip()
    match = re.search(r"(-?\d+(?:\.\d+)?)\s*([TtBbMmKk]?)", text)
    if not match:
        return None
    number = float(match.group(1))
    suffix = match.group(2).upper()
    if suffix == "T":
        number *= 1_000_000_000_000
    elif suffix == "B":
        number *= 1_000_000_000
    elif suffix == "M":
        number *= 1_000_000
    elif suffix == "K":
        number *= 1_000
    return number


def company_asset_id(symbol, name):
    key = symbol or name
    return re.sub(r"[^a-z0-9]+", "-", key.lower()).strip("-")


def is_etf_name(name, symbol=""):
    text = f" {name or ''} {symbol or ''} ".lower()
    etf_terms = [
        " etf ",
        " etfs ",
        " etn ",
        " etns ",
        " etc ",
        " etps ",
        " exchange traded",
        " index fund",
        " ishares ",
        " vanguard ",
        " spdr ",
        " invesco qqq ",
        " qqq ",
        " fund etf",
        " etf shares",
    ]
    return any(term in text for term in etf_terms)


def asset_group_from_row(row, name, symbol):
    row_class_match = re.search(r'<tr[^>]*class="([^"]*)"', row, re.I)
    row_class = row_class_match.group(1).lower() if row_class_match else ""
    upper_symbol = (symbol or "").upper()
    if "crypto-outliner" in row_class or upper_symbol in {"BTC", "ETH", "BNB", "SOL", "XRP", "DOGE", "ADA"}:
        return "crypto"
    if "precious-metals-outliner" in row_class or upper_symbol in {"GOLD", "SILVER", "PLAT", "PALLAD"}:
        return "metals"
    if is_etf_name(name, symbol):
        return "etfs"
    return "companies"


def clean_site_asset_url(value):
    return clean_image_url(value, COMPANIES_MARKETCAP_BASE)


COUNTRY_FLAG_CODES = {
    "USA": "us",
    "Taiwan": "tw",
    "S. Arabia": "sa",
    "S. Korea": "kr",
    "China": "cn",
    "Netherlands": "nl",
    "Switzerland": "ch",
    "UK": "gb",
    "France": "fr",
    "Canada": "ca",
    "Japan": "jp",
    "Germany": "de",
    "India": "in",
    "Brazil": "br",
    "Australia": "au",
    "Hong Kong": "hk",
    "Singapore": "sg",
}


def country_flag_url(country):
    code = COUNTRY_FLAG_CODES.get(country or "")
    return f"{COMPANIES_MARKETCAP_BASE}img/flags/{code}.png" if code else ""


def country_flag_code(country):
    return COUNTRY_FLAG_CODES.get(country or "")


def sparkline_points(row):
    match = re.search(r'<path\s+d="([^"]+)"', row, re.I | re.S)
    if not match:
        return []
    pairs = re.findall(r"[ML]\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)", match.group(1))
    points = []
    for index, (_, y_text) in enumerate(pairs):
        y_value = float(y_text)
        points.append({
            "label": str(index + 1),
            "value": 41 - y_value,
            "relative": True,
        })
    return points


def company_history_url(value):
    value = html.unescape(value or "").strip()
    if not value:
        return ""
    absolute = urllib.parse.urljoin(COMPANIES_MARKETCAP_BASE, value)
    parsed = urllib.parse.urlparse(absolute)
    if parsed.netloc.lower() != "companiesmarketcap.com":
        return ""
    if not parsed.path.endswith("/marketcap/"):
        return ""
    return parsed.path


def parse_companies_marketcap(html_text, limit=24):
    rows = re.findall(r"<tr\b[^>]*>(.*?)</tr>", html_text or "", re.I | re.S)
    assets = []
    for row in rows:
        if "company-name" not in row or "company-code" not in row:
            continue

        name_match = re.search(r'<div class="company-name">(.*?)</div>', row, re.I | re.S)
        code_match = re.search(r'<div class="company-code">(.*?)</div>', row, re.I | re.S)
        link_match = re.search(r'<a\s+href="([^"]+/marketcap/)"', row, re.I | re.S)
        if not name_match or not code_match:
            continue

        name = strip_markup(name_match.group(1))
        symbol = strip_markup(code_match.group(1))
        cells = re.findall(r'<td class="td-right" data-sort="([^"]*)">(.*?)</td>', row, re.I | re.S)
        if len(cells) < 2:
            continue

        market_cap = finite_number(float(cells[0][0])) if re.match(r"^-?\d+(?:\.\d+)?$", cells[0][0]) else parse_money_text(cells[0][1])
        price = parse_money_text(cells[1][1])
        change_match = re.search(
            r'<td data-sort="(-?\d+(?:\.\d+)?)" class="rh-sm">.*?([0-9]+(?:\.[0-9]+)?)%',
            row,
            re.I | re.S,
        )
        change_pct = None
        if change_match:
            sign = -1 if float(change_match.group(1)) < 0 else 1
            change_pct = sign * float(change_match.group(2))

        country_match = re.search(r'<span class="responsive-hidden">(.*?)</span>', row, re.I | re.S)
        country = strip_markup(country_match.group(1)) if country_match else ""

        if market_cap is None or price is None:
            continue

        assets.append({
            "id": company_asset_id(symbol, name),
            "group": "companies",
            "symbol": symbol,
            "name": name,
            "zhSummary": "来自 CompaniesMarketCap 的公司市值、股价和当日涨跌。",
            "summary": "Company market cap, share price, and today's move from CompaniesMarketCap.",
            "value": price,
            "unit": "USD",
            "changePct": change_pct,
            "marketCap": market_cap,
            "country": country,
            "sourceName": "CompaniesMarketCap",
            "historyUrl": company_history_url(link_match.group(1)) if link_match else "",
        })
        if len(assets) >= limit:
            break
    return assets


def fetch_companies_marketcap(limit=24):
    html_text = fetch_url("https://companiesmarketcap.com/", timeout=10).decode("utf-8", errors="ignore")
    return parse_companies_marketcap(html_text, limit=limit)


def parse_all_assets_marketcap(html_text, limit=MARKET_FETCH_LIMIT):
    rows = re.findall(r"<tr\b[^>]*>.*?</tr>", html_text or "", re.I | re.S)
    assets = []
    for row in rows:
        if "company-name" not in row or "company-code" not in row:
            continue

        rank_match = re.search(r'class="rank-td[^"]*"\s+data-sort="(\d+)"', row, re.I | re.S)
        name_match = re.search(r'<div class="company-name">(.*?)</div>', row, re.I | re.S)
        code_match = re.search(r'<div class="company-code">(.*?)</div>', row, re.I | re.S)
        link_match = re.search(r'<a\s+href="([^"]+/marketcap/)"', row, re.I | re.S)
        logo_match = re.search(r'<img[^>]+class="company-logo"[^>]+src="([^"]+)"', row, re.I | re.S)
        if not name_match or not code_match:
            continue

        name = strip_markup(name_match.group(1))
        symbol = strip_markup(code_match.group(1))
        group = asset_group_from_row(row, name, symbol)
        if group == "etfs":
            continue

        cells = re.findall(r'<td class="td-right" data-sort="([^"]*)">(.*?)</td>', row, re.I | re.S)
        if len(cells) < 2:
            continue

        market_cap = finite_number(float(cells[0][0])) if re.match(r"^-?\d+(?:\.\d+)?$", cells[0][0]) else parse_money_text(cells[0][1])
        price = parse_money_text(cells[1][1])
        change_match = re.search(
            r'<td[^>]*class="rh-sm"[^>]*data-sort="(-?\d+(?:\.\d+)?)"[^>]*>.*?([0-9]+(?:\.[0-9]+)?)%',
            row,
            re.I | re.S,
        ) or re.search(
            r'<td[^>]*data-sort="(-?\d+(?:\.\d+)?)"[^>]*class="rh-sm"[^>]*>.*?([0-9]+(?:\.[0-9]+)?)%',
            row,
            re.I | re.S,
        )
        change_pct = None
        if change_match:
            sign = -1 if float(change_match.group(1)) < 0 else 1
            change_pct = sign * float(change_match.group(2))

        country_match = re.search(r'<span class="responsive-hidden">(.*?)</span>', row, re.I | re.S)
        country = strip_markup(country_match.group(1)) if country_match else ""
        flag_match = re.search(r'<img[^>]+class="flag"[^>]+src="([^"]+)"', row, re.I | re.S)
        flag_text_match = re.search(r"<td>\s*([^<\s]+)\s*<span class=\"responsive-hidden\">", row, re.I | re.S)
        country_flag = clean_site_asset_url(flag_match.group(1)) if flag_match else ""
        if not country_flag and flag_text_match:
            country_flag = strip_markup(flag_text_match.group(1))
        if country and (not country_flag or not country_flag.startswith("http")):
            country_flag = country_flag_url(country) or country_flag
        if market_cap is None or price is None:
            continue

        if group == "metals":
            summary = "Precious metal market cap, spot price, and today's move from CompaniesMarketCap."
            zh_summary = "来自 CompaniesMarketCap 的贵金属市值、现货价格和当日涨跌。"
        elif group == "crypto":
            summary = "Cryptocurrency market cap, token price, and today's move from CompaniesMarketCap."
            zh_summary = "来自 CompaniesMarketCap 的加密货币市值、币价和当日涨跌。"
        else:
            summary = "Company market cap, share price, and today's move from CompaniesMarketCap."
            zh_summary = "来自 CompaniesMarketCap 的公司市值、股价和当日涨跌。"

        assets.append({
            "id": company_asset_id(symbol, name),
            "rank": int(rank_match.group(1)) if rank_match else None,
            "group": group,
            "symbol": symbol,
            "name": name,
            "zhSummary": zh_summary,
            "summary": summary,
            "value": price,
            "unit": "USD",
            "changePct": change_pct,
            "marketCap": market_cap,
            "country": country,
            "countryCode": country_flag_code(country),
            "countryFlag": country_flag,
            "logoUrl": clean_site_asset_url(logo_match.group(1)) if logo_match else "",
            "sourceName": "CompaniesMarketCap",
            "historyUrl": company_history_url(link_match.group(1)) if link_match else "",
            "sparkline": sparkline_points(row),
        })
        if len(assets) >= limit:
            break
    return assets


def fetch_all_assets_marketcap(limit=MARKET_FETCH_LIMIT):
    assets = []
    seen = set()
    for page in range(1, 5):
        url = ALL_ASSETS_URL if page == 1 else f"{ALL_ASSETS_URL}page/{page}/"
        try:
            html_text = fetch_url(url, timeout=10).decode("utf-8", errors="ignore")
        except Exception:
            if assets:
                break
            raise
        page_assets = parse_all_assets_marketcap(html_text, limit=limit)
        added = 0
        for asset in page_assets:
            key = asset.get("id") or f"{asset.get('symbol')}:{asset.get('name')}"
            if key in seen:
                continue
            seen.add(key)
            assets.append(asset)
            added += 1
            if len(assets) >= limit:
                return assets
        if not added:
            break
    return assets


def parse_market_cap_history(html_text):
    data_match = re.search(r"data\s*=\s*(\[\{.*?\}\]);", html_text or "", re.I | re.S)
    if data_match:
        try:
            rows = json.loads(data_match.group(1))
            history = []
            for row in rows:
                timestamp = row.get("d")
                market_cap_units = row.get("m")
                if not isinstance(timestamp, (int, float)) or not isinstance(market_cap_units, (int, float)):
                    continue
                date = datetime.fromtimestamp(timestamp, timezone.utc).date().isoformat()
                history.append({
                    "label": date,
                    "date": date,
                    "value": float(market_cap_units) * 100_000,
                })
            if len(history) >= 2:
                return history
        except (TypeError, ValueError, json.JSONDecodeError):
            pass

    marker = "End of year Market Cap"
    start = html_text.find(marker)
    segment = html_text[start:] if start >= 0 else html_text
    table_end = segment.find("</table>")
    if table_end >= 0:
        segment = segment[:table_end]

    rows = []
    for match in re.finditer(
        r"<tr>\s*<td>(\d{4})</td>\s*<td>(.*?)</td>\s*<td[^>]*>(.*?)</td>\s*</tr>",
        segment,
        re.I | re.S,
    ):
        year = int(match.group(1))
        value = parse_money_text(match.group(2))
        if value is None:
            continue
        change_text = strip_markup(match.group(3)).replace("%", "").strip()
        try:
            change_pct = float(change_text) if change_text else None
        except ValueError:
            change_pct = None
        rows.append({
            "label": str(year),
            "value": value,
            "changePct": change_pct,
        })
    return sorted(rows, key=lambda item: item["label"])


def normalized_market_range(range_name):
    range_name = str(range_name or "").lower()
    return range_name if range_name in {"1d", "5d", "1m", "1y", "5y", "all"} else ""


def history_payload_has_range(payload, range_name):
    range_name = normalized_market_range(range_name)
    if not isinstance(payload, dict):
        return False
    if range_name == "1d":
        return history_has_dense_intraday_points(payload.get("shortHistory"))
    if range_name in {"5d", "1m"}:
        days = 5 if range_name == "5d" else 31
        points = history_points_since(payload.get("shortHistory"), days)
        min_span = 2.5 if range_name == "5d" else 20
        return history_point_count(points) >= 2 and history_span_days(points) >= min_span
    if range_name in {"1y", "5y"}:
        return history_point_count(payload.get("denseHistory")) >= 30
    if range_name == "all":
        return history_has_dated_points(payload.get("history"))
    return (
        history_has_dated_points(payload.get("history"))
        and history_point_count(payload.get("denseHistory")) >= 2
        and history_point_count(payload.get("shortHistory")) >= MARKET_SHORT_HISTORY_MIN_POINTS
    )


def enrich_history_with_dense_prices(payload, asset, range_name=""):
    if not isinstance(payload, dict) or not isinstance(asset, dict):
        return payload
    symbol = str(asset.get("symbol") or "").strip()
    if not symbol:
        return payload
    enriched = {
        "symbol": symbol,
        "group": asset.get("group") or "companies",
        "marketCap": finite_number(asset.get("marketCap")),
        "value": finite_number(asset.get("value")),
    }
    if isinstance(payload.get("history"), list):
        enriched["history"] = payload.get("history")
    attach_dense_price_histories([enriched], limit=1, detailed_short=True, range_name=range_name)
    changed = False
    for key in ("history", "denseHistory", "shortHistory"):
        incoming = enriched.get(key)
        if not incoming:
            continue
        existing = payload.get(key)
        should_replace = not existing
        if key == "shortHistory" and range_name in {"1d", "5d", "1m"}:
            should_replace = (
                not history_payload_has_range({"shortHistory": existing}, range_name)
                or history_span_days(incoming) > history_span_days(existing) + 0.25
            )
        elif key == "denseHistory" and range_name in {"1y", "5y"}:
            should_replace = history_span_days(incoming) > history_span_days(existing) + 7
        elif key == "history" and range_name in {"all", ""}:
            should_replace = history_span_days(incoming) > history_span_days(existing) + 30
        if should_replace:
            payload[key] = incoming
            changed = True
    for key in ("historySource", "denseHistorySource", "shortHistorySource"):
        if enriched.get(key):
            payload[key] = enriched[key]
            changed = True
    if changed:
        payload["updated"] = datetime.now(timezone.utc).isoformat()
    return payload


def load_market_history(url, asset=None, range_name=""):
    range_name = normalized_market_range(range_name)
    path = company_history_url(url)
    if not path:
        payload = {"source": "CompaniesMarketCap", "history": []}
        return enrich_history_with_dense_prices(payload, asset, range_name)

    cache = load_market_history_cache()
    cached = cache.get(path)
    stale_history = []
    if isinstance(cached, dict):
        if history_payload_has_range(cached, range_name):
            return cached
        if isinstance(cached.get("history"), list):
            stale_history = cached.get("history") or []

    if range_name in {"1d", "5d", "1m", "1y", "5y"} and asset:
        payload = dict(cached) if isinstance(cached, dict) else {
            "source": "CompaniesMarketCap",
            "updated": datetime.now(timezone.utc).isoformat(),
            "history": stale_history,
        }
        payload = enrich_history_with_dense_prices(payload, asset, range_name)
        if payload.get("denseHistory") or payload.get("shortHistory"):
            cache[path] = payload
            save_market_history_cache(cache)
        return payload

    try:
        absolute = urllib.parse.urljoin(COMPANIES_MARKETCAP_BASE, path)
        html_text = fetch_url(absolute, timeout=10).decode("utf-8", errors="ignore")
        history = parse_market_cap_history(html_text)
    except Exception:
        history = []

    if not history and stale_history:
        payload = {
            "source": "CompaniesMarketCap",
            "updated": datetime.now(timezone.utc).isoformat(),
            "history": stale_history,
        }
        payload = enrich_history_with_dense_prices(payload, asset, range_name)
        if payload.get("denseHistory") or payload.get("shortHistory"):
            cache[path] = payload
            save_market_history_cache(cache)
        return payload

    payload = {
        "source": "CompaniesMarketCap",
        "updated": datetime.now(timezone.utc).isoformat(),
        "history": history,
    }
    payload = enrich_history_with_dense_prices(payload, asset, range_name)
    if history or payload.get("denseHistory") or payload.get("shortHistory"):
        cache[path] = payload
        save_market_history_cache(cache)
    return payload


def yahoo_symbol_for_asset(asset):
    symbol = str(asset.get("symbol") or "").upper()
    return YAHOO_SYMBOL_OVERRIDES.get(symbol, str(asset.get("symbol") or "").strip())


def yahoo_price_history(symbol, range_name="5y", interval="1d"):
    symbol = (symbol or "").strip()
    if not symbol:
        return []
    query = urllib.parse.urlencode({"range": range_name, "interval": interval})
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{urllib.parse.quote(symbol, safe='')}?{query}"
    payload = yahoo_json(url, timeout=8)
    result = (payload.get("chart", {}).get("result") or [None])[0]
    if not result:
        return []
    timestamps = result.get("timestamp") or []
    indicators = result.get("indicators", {})
    quote_rows = indicators.get("quote") or []
    adj_rows = indicators.get("adjclose") or []
    closes = []
    if adj_rows and isinstance(adj_rows[0], dict):
        closes = adj_rows[0].get("adjclose") or []
    if not closes and quote_rows and isinstance(quote_rows[0], dict):
        closes = quote_rows[0].get("close") or []
    points = []
    for timestamp, close in zip(timestamps, closes):
        value = finite_number(close)
        if not isinstance(timestamp, (int, float)) or value is None or value <= 0:
            continue
        moment = datetime.fromtimestamp(timestamp, timezone.utc)
        date = moment.date().isoformat()
        points.append({
            "label": moment.strftime("%m-%d %H:%M") if re.search(r"[mh]$", interval) else date,
            "date": date,
            "time": moment.isoformat(),
            "close": value,
        })
    return points


def yahoo_short_price_history(symbol, detailed=False, range_name=""):
    range_name = normalized_market_range(range_name)
    if range_name == "1d":
        specs = [("1d", "5m"), ("5d", "5m"), ("5d", "15m")]
    elif range_name == "5d":
        specs = [("5d", "15m")]
    elif range_name == "1m":
        specs = [("1mo", "1h")]
    else:
        specs = [("1mo", "1h")]
        if detailed:
            specs.append(("5d", "15m"))

    merged = {}
    for history_range, interval in specs:
        try:
            history = yahoo_price_history(symbol, range_name=history_range, interval=interval)
        except Exception:
            history = []
        for point in history:
            key = point.get("time") or point.get("date") or point.get("label")
            if key:
                merged[key] = point
        if range_name == "1d" and history_has_dense_intraday_points(merged.values()):
            break
    return sorted(
        merged.values(),
        key=lambda item: history_point_datetime(item) or datetime.min.replace(tzinfo=timezone.utc),
    )


def rescaled_dense_history(asset, price_points):
    if len(price_points) < 2:
        return []
    latest_close = finite_number(price_points[-1].get("close"))
    if latest_close in (None, 0):
        return []
    if asset.get("group") == "companies":
        anchor_value = finite_number(asset.get("marketCap"))
        value_kind = "marketCap"
    else:
        anchor_value = finite_number(asset.get("value"))
        value_kind = "price"
    if anchor_value in (None, 0):
        return []
    history = []
    for point in price_points:
        close = finite_number(point.get("close"))
        if close is None:
            continue
        history.append({
            "label": point.get("label"),
            "date": point.get("date"),
            "time": point.get("time"),
            "value": (close / latest_close) * anchor_value,
            "sourceValue": close,
            "valueKind": value_kind,
        })
    return history


def currency_history_from_yahoo(code, range_name="5y", interval="1d"):
    code = str(code or "").upper()
    symbol = YAHOO_CURRENCY_SYMBOLS.get(code)
    if not symbol:
        return []
    points = yahoo_price_history(symbol, range_name=range_name, interval=interval)
    history = []
    inverse = code in {"BTC", "XAU"}
    for point in points:
        close = finite_number(point.get("close"))
        if close is None or close <= 0:
            continue
        value = 1 / close if inverse else close
        history.append({
            "label": point.get("label"),
            "date": point.get("date"),
            "time": point.get("time"),
            "value": value,
        })
    return history


def merge_history_series(*series_list):
    merged = {}
    for series in series_list:
        for point in series or []:
            if not isinstance(point, dict):
                continue
            key = point.get("time") or point.get("date") or point.get("label")
            if key:
                merged[key] = point
    return sorted(
        merged.values(),
        key=lambda item: history_point_datetime(item) or datetime.min.replace(tzinfo=timezone.utc),
    )


def attach_currency_histories(quotes):
    for quote in quotes:
        if not isinstance(quote, dict):
            continue
        code = str(quote.get("code") or "").upper()
        if code == "USD":
            continue
        try:
            dense = currency_history_from_yahoo(code, range_name="5y", interval="1d")
        except Exception:
            dense = []
        try:
            long_history = currency_history_from_yahoo(code, range_name="max", interval="1mo")
        except Exception:
            long_history = []
        try:
            short = merge_history_series(
                currency_history_from_yahoo(code, range_name="1mo", interval="1h"),
                currency_history_from_yahoo(code, range_name="1d", interval="5m"),
            )
        except Exception:
            short = []
        if long_history and history_span_days(long_history) > history_span_days(quote.get("history")) + 30:
            quote["history"] = limit_history_points(long_history, MARKET_FULL_HISTORY_POINTS)
            quote["historySource"] = "Yahoo Finance monthly close"
        if dense:
            quote["denseHistory"] = limit_dense_history_points(dense, MARKET_DENSE_HISTORY_POINTS)
            quote["denseHistorySource"] = "Yahoo Finance daily close"
        if short:
            quote["shortHistory"] = limit_history_points(short, MARKET_SHORT_HISTORY_POINTS)
            quote["shortHistorySource"] = "Yahoo Finance intraday close"
    return quotes


def attach_dense_price_histories(assets, limit=None, detailed_short=False, range_name=""):
    range_name = normalized_market_range(range_name)
    attached = 0
    for asset in assets:
        if limit is not None and attached >= limit:
            break
        if asset.get("group") not in {"companies", "metals", "crypto"}:
            continue
        symbol = yahoo_symbol_for_asset(asset)
        if not symbol:
            continue
        needs_short = range_name in {"", "1d", "5d", "1m"}
        needs_dense = range_name in {"", "1y", "5y", "all"}
        needs_long = range_name in {"", "all"}
        dense = []
        long_history = []
        short = []
        if needs_dense:
            try:
                dense = rescaled_dense_history(asset, yahoo_price_history(symbol, range_name="5y", interval="1d"))
            except Exception:
                dense = []
        if needs_long:
            try:
                long_history = rescaled_dense_history(asset, yahoo_price_history(symbol, range_name="max", interval="1mo"))
            except Exception:
                long_history = []
        if needs_short:
            try:
                short = rescaled_dense_history(asset, yahoo_short_price_history(symbol, detailed=detailed_short, range_name=range_name))
            except Exception:
                short = []
        existing_span = history_span_days(asset.get("history"))
        should_fill_all_history = asset.get("group") != "companies" or existing_span <= (365 * 5 + 90)
        if long_history and should_fill_all_history and history_span_days(long_history) > existing_span + 30:
            asset["history"] = limit_history_points(long_history, MARKET_FULL_HISTORY_POINTS)
            asset["historySource"] = "Yahoo Finance monthly close, rescaled to latest CompaniesMarketCap value"
        if dense:
            asset["denseHistory"] = limit_dense_history_points(dense, MARKET_DENSE_HISTORY_POINTS)
            asset["denseHistorySource"] = "Yahoo Finance daily close, rescaled to latest CompaniesMarketCap value"
        if short:
            asset["shortHistory"] = limit_history_points(short, MARKET_SHORT_HISTORY_POINTS)
            asset["shortHistorySource"] = "Yahoo Finance intraday close, rescaled to latest CompaniesMarketCap value"
        if dense or short or long_history:
            attached += 1
    return assets


def attach_company_histories(assets, limit=8):
    attached = 0
    for asset in assets:
        if attached >= limit:
            break
        if asset.get("group") != "companies" or not asset.get("historyUrl"):
            continue
        history_payload = load_market_history(asset.get("historyUrl"))
        history = history_payload.get("history") if isinstance(history_payload, dict) else []
        if history:
            asset["history"] = limit_history_points(history, MARKET_FULL_HISTORY_POINTS)
            attached += 1
    return assets


def fetch_frankfurter_latest(symbols):
    query = urllib.parse.urlencode({"base": "USD", "symbols": ",".join(symbols)})
    return json.loads(fetch_url(f"{FRANKFURTER_BASE}/latest?{query}", timeout=8).decode("utf-8", errors="ignore"))


def fetch_frankfurter_history(end_date, symbols, days=45):
    try:
        end = datetime.fromisoformat(str(end_date)).date()
    except ValueError:
        end = datetime.now(timezone.utc).date()
    start = end - timedelta(days=days)
    query = urllib.parse.urlencode({"base": "USD", "symbols": ",".join(symbols)})
    url = f"{FRANKFURTER_BASE}/{start.isoformat()}..{end.isoformat()}?{query}"
    return json.loads(fetch_url(url, timeout=8).decode("utf-8", errors="ignore"))


def currency_history_points(history_payload, code, latest_date=None, latest_rate=None):
    rates = history_payload.get("rates", {}) if isinstance(history_payload, dict) else {}
    points = []
    for date_text in sorted(rates):
        row = rates.get(date_text, {})
        rate = finite_number(row.get(code)) if isinstance(row, dict) else None
        if rate is None:
            continue
        points.append({"label": date_text, "date": date_text, "value": rate})

    if latest_date and latest_rate is not None:
        if not points or points[-1].get("date") != latest_date:
            points.append({"label": latest_date, "date": latest_date, "value": latest_rate})
    return points


def currency_usd_change_pct(points):
    if len(points) < 2:
        return None
    current_rate = finite_number(points[-1].get("value"))
    previous_rate = finite_number(points[-2].get("value"))
    if current_rate is None or previous_rate in (None, 0):
        return None
    current_usd_value = 1 / current_rate
    previous_usd_value = 1 / previous_rate
    if previous_usd_value == 0:
        return None
    return ((current_usd_value - previous_usd_value) / previous_usd_value) * 100


def fiat_currency_quotes():
    symbols = FIAT_CURRENCY_CODES
    latest = fetch_frankfurter_latest(symbols)
    rates = latest.get("rates", {}) if isinstance(latest, dict) else {}
    latest_date = str(latest.get("date") or datetime.now(timezone.utc).date().isoformat())
    history_payload = fetch_frankfurter_history(latest_date, symbols)

    quotes = [{
        "code": "USD",
        "name": CURRENCY_INFO["USD"][0],
        "zhName": CURRENCY_INFO["USD"][1],
        "group": "fiat",
        "countryCode": CURRENCY_INFO["USD"][2],
        "quotePerUsd": 1.0,
        "usdValue": 1.0,
        "changePct": 0.0,
        "date": latest_date,
        "history": [{"label": latest_date, "date": latest_date, "value": 1.0}],
        "sourceName": "Frankfurter",
    }]

    for code in symbols:
        rate = finite_number(rates.get(code))
        if rate is None or rate <= 0:
            continue
        name, zh_name, country_code = CURRENCY_INFO.get(code, (code, code, ""))
        history = currency_history_points(history_payload, code, latest_date, rate)
        quotes.append({
            "code": code,
            "name": name,
            "zhName": zh_name,
            "group": "fiat",
            "countryCode": country_code,
            "quotePerUsd": rate,
            "usdValue": 1 / rate,
            "changePct": currency_usd_change_pct(history),
            "date": latest_date,
            "history": history,
            "sourceName": "Frankfurter",
        })
    return latest_date, quotes


def currency_asset_quotes(assets):
    quotes = []
    used_codes = set()
    for asset in assets or []:
        if not isinstance(asset, dict):
            continue
        symbol = str(asset.get("symbol") or "").upper()
        group = str(asset.get("group") or "")
        value = finite_number(asset.get("value"))
        if value is None or value <= 0:
            continue

        if symbol in CURRENCY_ASSET_CODES:
            code, name, zh_name, quote_group, unit_label = CURRENCY_ASSET_CODES[symbol]
        elif group == "crypto" and symbol == "BTC":
            code = symbol
            name = str(asset.get("name") or symbol)
            zh_name = str(asset.get("zhName") or name)
            quote_group = "crypto"
            unit_label = "token"
        else:
            continue

        if not code or code in used_codes:
            continue
        used_codes.add(code)
        quotes.append({
            "code": code,
            "symbol": symbol,
            "name": name,
            "zhName": zh_name,
            "group": quote_group,
            "unitLabel": unit_label,
            "quotePerUsd": 1 / value,
            "usdValue": value,
            "changePct": finite_number(asset.get("changePct")),
            "marketCap": finite_number(asset.get("marketCap")),
            "sourceName": str(asset.get("sourceName") or "CompaniesMarketCap"),
            "logoUrl": asset.get("logoUrl") or "",
            "sourceAssetId": asset.get("id") or "",
        })
        if len([item for item in quotes if item.get("group") == "crypto"]) >= 6 and len([item for item in quotes if item.get("group") == "metal"]) >= 2:
            break
    return quotes


def merge_currency_quotes(*quote_groups):
    merged = {}
    order = []
    for quotes in quote_groups:
        for quote in quotes or []:
            if not isinstance(quote, dict):
                continue
            code = str(quote.get("code") or "").upper()
            if not code:
                continue
            if code not in merged:
                order.append(code)
            merged[code] = {**quote, "code": code}
    return [merged[code] for code in order]


def cached_fiat_currency_quotes(currencies):
    if not isinstance(currencies, dict):
        return []
    quotes = []
    codes = set()
    for quote in currencies.get("quotes", []) or []:
        if not isinstance(quote, dict):
            continue
        code = str(quote.get("code") or "").upper()
        if code in REQUIRED_FIAT_CURRENCY_CODES:
            quotes.append({**quote, "code": code})
            codes.add(code)
    return quotes if REQUIRED_FIAT_CURRENCY_CODES.issubset(codes) else []


def load_currency_quotes(assets, stale_currencies=None):
    stale_currencies = stale_currencies if isinstance(stale_currencies, dict) else {}
    cached_fiat_quotes = cached_fiat_currency_quotes(stale_currencies)
    try:
        date_text, fiat_quotes = fiat_currency_quotes()
    except Exception:
        date_text, fiat_quotes = str(stale_currencies.get("date") or ""), cached_fiat_quotes

    asset_quotes = currency_asset_quotes(assets)
    quotes = merge_currency_quotes(cached_fiat_quotes, fiat_quotes, asset_quotes)
    if not REQUIRED_FIAT_CURRENCY_CODES.issubset({item.get("code") for item in quotes}):
        raise RuntimeError("Incomplete fiat currency quotes")
    quotes = attach_currency_histories(quotes)
    anchors = [code for code in CURRENCY_ANCHOR_CODES if any(item.get("code") == code for item in quotes)]
    return {
        "source": "frankfurter-cmc",
        "date": date_text,
        "anchors": anchors,
        "quotes": quotes,
    }


def market_history_priority_assets(assets):
    ranked = sorted_market_assets(assets)
    buckets = [
        ranked[:MARKET_DISPLAY_COUNT],
        [item for item in ranked if item.get("group") != "metals"][:MARKET_DISPLAY_COUNT],
        [item for item in ranked if item.get("group") != "crypto"][:MARKET_DISPLAY_COUNT],
        [item for item in ranked if item.get("group") == "companies"][:MARKET_DISPLAY_COUNT],
    ]
    seen = set()
    priority = []
    for bucket in buckets:
        for item in bucket:
            key = item.get("id") or f"{item.get('symbol')}:{item.get('name')}"
            if key in seen:
                continue
            seen.add(key)
            priority.append(item)
    return priority


def build_live_market_payload(stale_cached=None):
    if stale_cached is None:
        stale_cached = market_cache_payload(allow_stale=True)
    company_assets = []
    try:
        company_assets = fetch_all_assets_marketcap(limit=MARKET_FETCH_LIMIT)
        priority_assets = market_history_priority_assets(company_assets)
        attach_company_histories(priority_assets, limit=MARKET_HISTORY_PREP_LIMIT)
        attach_dense_price_histories(priority_assets, limit=MARKET_HISTORY_PREP_LIMIT)
    except Exception:
        company_assets = []

    assets = company_assets
    if not assets:
        return None
    apply_market_rank_changes(assets, stale_cached)

    stale_currencies = stale_cached.get("currencies", {}) if isinstance(stale_cached, dict) else {}
    try:
        currencies = load_currency_quotes(assets, stale_currencies)
    except Exception:
        currencies = stale_currencies
    if not has_required_currency_quotes(currencies):
        return stale_cached if stale_cached and has_required_currency_quotes(stale_currencies) else None

    payload = {
        "source": "companiesmarketcap-assets",
        "updated": datetime.now(timezone.utc).isoformat(),
        "stale": False,
        "servedAt": datetime.now(timezone.utc).isoformat(),
        "assets": assets,
        "currencies": currencies,
    }
    save_market_cache(payload)
    return payload


def refresh_market_cache_async():
    global MARKET_REFRESH_IN_PROGRESS
    with MARKET_REFRESH_LOCK:
        if MARKET_REFRESH_IN_PROGRESS:
            return False
        MARKET_REFRESH_IN_PROGRESS = True

    def refresh():
        global MARKET_REFRESH_IN_PROGRESS
        try:
            build_live_market_payload(market_cache_payload(allow_stale=True))
        finally:
            with MARKET_REFRESH_LOCK:
                MARKET_REFRESH_IN_PROGRESS = False

    threading.Thread(target=refresh, daemon=True).start()
    return True


def load_markets():
    cached = market_cache_payload()
    if cached:
        return cached
    stale_cached = market_cache_payload(allow_stale=True)
    if stale_cached:
        refresh_market_cache_async()
        stale_cached["stale"] = True
        stale_cached["servedAt"] = datetime.now(timezone.utc).isoformat()
        stale_cached["cacheReason"] = "stale-while-revalidate"
        return stale_cached

    payload = build_live_market_payload()
    if payload:
        return payload

    return {
        "source": "unavailable",
        "updated": datetime.now(timezone.utc).isoformat(),
        "assets": [],
    }


def direct_event_title(title):
    cleaned = re.sub(r"\s+", " ", title or "").strip()
    cleaned = re.sub(r"^(analysis|comment|commentary|explainer|opinion)\s*:\s*", "", cleaned, flags=re.I)
    cleaned = re.sub(r"^[^:]{1,56}\blive\s*:\s*", "", cleaned, flags=re.I)
    cleaned = cleaned.rstrip(" ?")
    return cleaned[:180]


def parse_datetime(value):
    if not value:
        return datetime.now(timezone.utc).isoformat()
    try:
        parsed = parsedate_to_datetime(value)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc).isoformat()
    except (TypeError, ValueError, IndexError):
        return datetime.now(timezone.utc).isoformat()


def event_datetime(value):
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)
    except (AttributeError, ValueError):
        return datetime.now(timezone.utc)


def event_window_days(event):
    severity = int(event.get("severity") or 1)
    if severity >= 5:
        return 21
    if severity >= 4:
        return 7
    return 3


def event_is_recent_enough(event, now):
    published = event_datetime(event.get("published"))
    return published >= now - timedelta(days=event_window_days(event))


DEDUPE_STOP_WORDS = {
    "a", "an", "and", "are", "as", "at", "after", "before", "between", "but",
    "by", "for", "from", "he", "in", "into", "is", "it", "new", "of", "on",
    "or", "over", "s", "the", "to", "with", "world",
}
DEDUPE_SHORT_TOKENS = {"eu", "uk", "un", "us", "xi"}
DEDUPE_TOKEN_ALIASES = {
    "attacked": "attack",
    "attacks": "attack",
    "hails": "hail",
    "killed": "kill",
    "kills": "kill",
    "meeting": "meet",
    "meets": "meet",
    "met": "meet",
    "strikes": "strike",
    "striking": "strike",
}
DEDUPE_ENTITY_WORDS = {
    "beijing", "china", "gaza", "hezbollah", "iran", "israel", "israeli",
    "jinping", "lebanon", "palestinian", "putin", "russia", "russian",
    "taiwan", "trump", "xi",
}
DEDUPE_ENTITY_PATTERNS = [
    (r"习近平|習近平", "xi"),
    (r"普京|普丁", "putin"),
    (r"川普|特朗普", "trump"),
    (r"中国|中國|访华|訪華", "china"),
    (r"北京", "beijing"),
    (r"俄中|中俄", "russia"),
]


def event_place_key(event):
    lat = event.get("lat")
    lon = event.get("lon")
    if isinstance(lat, (int, float)) and isinstance(lon, (int, float)):
        return f"{lat:.1f}|{lon:.1f}"
    return f"{event.get('location', '').lower()}|{event.get('country', '').lower()}"


def cjk_ngrams(text):
    characters = re.findall(r"[\u3400-\u9fff]", text or "")
    grams = set()
    for size in (2, 3):
        grams.update(
            "".join(characters[index:index + size])
            for index in range(0, max(0, len(characters) - size + 1))
        )
    return grams


def normalize_dedupe_token(token):
    normalized = DEDUPE_TOKEN_ALIASES.get(token, token)
    if len(normalized) > 4 and normalized.endswith("s"):
        return normalized[:-1]
    return normalized


def event_dedupe_text(event):
    return " ".join(
        str(event.get(field) or "")
        for field in ("statement", "title", "statement_zh", "title_zh")
    )


def event_tokens(event):
    raw_text = event_dedupe_text(event)
    tokens = {
        normalized
        for token in normalize_lookup_text(raw_text).split()
        for normalized in [normalize_dedupe_token(token)]
        if normalized not in DEDUPE_STOP_WORDS and (len(normalized) > 2 or normalized in DEDUPE_SHORT_TOKENS)
    }
    tokens.update(cjk_ngrams(raw_text))
    return tokens


def event_entity_tokens(event):
    raw_text = event_dedupe_text(event)
    tokens = {
        normalized
        for token in normalize_lookup_text(raw_text).split()
        for normalized in [normalize_dedupe_token(token)]
        if normalized in DEDUPE_ENTITY_WORDS
    }
    for pattern, value in DEDUPE_ENTITY_PATTERNS:
        if re.search(pattern, raw_text, re.IGNORECASE):
            tokens.add(value)
    return tokens


def token_similarity(left, right):
    if not left or not right:
        return 0
    return len(left & right) / min(len(left), len(right))


def entity_similarity(left, right):
    if not left or not right:
        return False
    shared = left & right
    return len(shared) >= 2 and len(shared) / min(len(left), len(right)) >= 0.66


def strong_entity_similarity(left, right):
    if not left or not right:
        return False
    shared = left & right
    return len(shared) >= 3 and len(shared) / min(len(left), len(right)) >= 0.7


def similar_event(left, right):
    left_entities = event_entity_tokens(left)
    right_entities = event_entity_tokens(right)
    if event_place_key(left) != event_place_key(right):
        return strong_entity_similarity(left_entities, right_entities)
    if entity_similarity(left_entities, right_entities):
        return True
    return token_similarity(event_tokens(left), event_tokens(right)) >= 0.52


def dedupe_similar_events(items):
    deduped = []
    for event in items:
        duplicate_index = next(
            (index for index, existing in enumerate(deduped) if similar_event(existing, event)),
            None,
        )
        if duplicate_index is None:
            deduped.append(event)
            continue

        if event_datetime(event.get("published")) > event_datetime(deduped[duplicate_index].get("published")):
            deduped[duplicate_index] = event
    return deduped


def classify_event(text):
    lowered = text.lower()
    if any(word in lowered for word in ["summit", "talks", "meeting", "diplomacy", "president", "minister"]):
        return "diplomacy"
    if any(word in lowered for word in ["war", "strike", "missile", "conflict", "military"]):
        return "security"
    if any(word in lowered for word in ["election", "vote", "parliament", "court"]):
        return "politics"
    if any(word in lowered for word in ["earthquake", "flood", "storm", "heat", "fire"]):
        return "climate"
    if any(word in lowered for word in ["market", "oil", "tariff", "trade", "inflation"]):
        return "economy"
    return "world"


def score_event(text):
    lowered = text.lower()
    score = 1
    for word, weight in IMPORTANT_TERMS.items():
        if word in lowered:
            score += weight
    return min(max(score, 1), 5)


def translation_api_key():
    return (
        os.environ.get("WORLD_CONSOLE_GOOGLE_TRANSLATE_API_KEY")
        or os.environ.get("GOOGLE_TRANSLATE_API_KEY")
        or ""
    ).strip()


def load_translation_cache():
    try:
        if EVENT_TRANSLATION_CACHE.exists():
            payload = json.loads(EVENT_TRANSLATION_CACHE.read_text(encoding="utf-8"))
            return payload if isinstance(payload, dict) else {}
    except (OSError, json.JSONDecodeError):
        pass
    return {}


def save_translation_cache(cache):
    try:
        EVENT_TRANSLATION_CACHE.parent.mkdir(exist_ok=True)
        EVENT_TRANSLATION_CACHE.write_text(
            json.dumps(cache, ensure_ascii=False, indent=2, sort_keys=True),
            encoding="utf-8",
        )
    except OSError:
        pass


def translation_cache_key(text):
    digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
    return f"{TRANSLATION_TARGET}:{digest}"


def google_translate_batch(texts, api_key, timeout=10):
    if not texts:
        return []

    url = GOOGLE_TRANSLATE_ENDPOINT + "?" + urllib.parse.urlencode({"key": api_key})
    body = json.dumps({
        "q": texts,
        "target": TRANSLATION_TARGET,
        "format": "text",
    }, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        payload = json.loads(response.read().decode("utf-8"))

    rows = payload.get("data", {}).get("translations", [])
    translated = []
    for row in rows:
        translated.append(html.unescape(row.get("translatedText", "")).strip())
    return translated


def apply_translations(events):
    api_key = translation_api_key()
    if not api_key:
        return events

    cache = load_translation_cache()
    missing = []
    missing_keys = []

    for event in events:
        for field in ("title", "statement", "summary"):
            text = (event.get(field) or "").strip()
            if not text:
                continue
            key = translation_cache_key(text)
            cached = cache.get(key)
            if cached:
                event[f"{field}_zh"] = cached
            else:
                missing.append(text)
                missing_keys.append((event, field, key))

    if missing:
        try:
            for start in range(0, len(missing), 24):
                batch = missing[start:start + 24]
                batch_keys = missing_keys[start:start + 24]
                translations = google_translate_batch(batch, api_key)
                for translated, (event, field, key) in zip(translations, batch_keys):
                    if translated:
                        cache[key] = translated
                        event[f"{field}_zh"] = translated
            save_translation_cache(cache)
        except Exception:
            # Translation is helpful, not required. Keep reports usable if the API is unavailable.
            return events

    return events


def normalize_lookup_text(text):
    return f" {re.sub(r'[^a-z0-9]+', ' ', text.lower()).strip()} "


def lookup_key(key):
    return re.sub(r"[^a-z0-9]+", " ", key.lower()).strip()


def lookup_has(lookup, key):
    normalized_key = lookup_key(key)
    return bool(normalized_key) and f" {normalized_key} " in lookup


def first_lookup_word(text):
    match = re.search(r"[a-z0-9]+", text.lower())
    return match.group(0) if match else ""


def is_question_headline(title):
    stripped = (title or "").strip()
    if "?" in stripped:
        return True
    return first_lookup_word(stripped) in QUESTION_STARTERS


def has_any_lookup_term(lookup, terms):
    return any(lookup_has(lookup, term) for term in terms)


def has_hard_event_signal(title_lookup):
    return has_any_lookup_term(title_lookup, HARD_EVENT_TERMS)


def is_concrete_event(title, summary):
    title_lookup = normalize_lookup_text(title)

    if has_any_lookup_term(title_lookup, NON_EVENT_TITLE_TERMS):
        return False

    if is_question_headline(title):
        return False

    if (
        has_any_lookup_term(title_lookup, HYPOTHETICAL_TITLE_TERMS)
        and not has_any_lookup_term(title_lookup, HYPOTHETICAL_ALLOWED_TERMS)
    ):
        return False

    if (
        has_any_lookup_term(title_lookup, INDIRECT_SOURCE_TERMS)
        and not has_hard_event_signal(title_lookup)
    ):
        return False

    if (
        has_any_lookup_term(title_lookup, INTENTION_TITLE_TERMS)
        and not has_any_lookup_term(title_lookup, INTENTION_ALLOWED_TERMS)
    ):
        return False

    return has_any_lookup_term(title_lookup, CONCRETE_EVENT_TERMS)


def location_key_weight(key):
    normalized_key = lookup_key(key)
    if normalized_key in LOCATION_KEY_WEIGHTS:
        return LOCATION_KEY_WEIGHTS[normalized_key]
    return 10 if len(normalized_key) > 4 else 5


def score_location_keys(lookup, keys):
    return sum(location_key_weight(key) for key in keys if lookup_has(lookup, key))


def best_scored_location(title, summary):
    title_lookup = normalize_lookup_text(title)
    summary_lookup = normalize_lookup_text(summary)
    title_has_location = any(score_location_keys(title_lookup, keys) for _, _, _, _, keys in LOCATION_HINTS)
    summary_multiplier = 0.25 if title_has_location else 0.65

    best = None
    best_score = 0
    for city, country, lat, lon, keys in LOCATION_HINTS:
        score = score_location_keys(title_lookup, keys)
        score += score_location_keys(summary_lookup, keys) * summary_multiplier
        if score > best_score:
            best = city, country, lat, lon
            best_score = score

    if best and best_score >= 8:
        return best
    return None


def locate_event(title, summary=""):
    title_lookup = normalize_lookup_text(title)
    combined_lookup = normalize_lookup_text(f"{title} {summary}")

    if any(lookup_has(title_lookup, key) for key in [
        "us senate",
        "senate advances",
        "war powers resolution",
        "us imposes sanctions",
        "trump administration",
        "white house",
    ]):
        return "Washington", "United States", 38.9072, -77.0369

    if lookup_has(title_lookup, "taiwan says") or lookup_has(title_lookup, "taiwan s"):
        return "Taipei", "Taiwan", 25.0330, 121.5654

    if (
        lookup_has(title_lookup, "xi")
        and lookup_has(title_lookup, "putin")
        and (lookup_has(title_lookup, "china") or lookup_has(title_lookup, "beijing"))
    ):
        return "Beijing", "China", 39.9042, 116.4074

    scored = best_scored_location(title, summary)
    if scored:
        return scored

    if lookup_has(combined_lookup, "trump"):
        return "Washington", "United States", 38.9072, -77.0369
    return "Unplaced", "", None, None


def parse_feed(source, xml_bytes):
    root = ET.fromstring(xml_bytes)
    items = root.findall(".//item")
    if not items:
        items = root.findall("{http://www.w3.org/2005/Atom}entry")

    events = []
    for item in items[:30]:
        title = item.findtext("title") or item.findtext("{http://www.w3.org/2005/Atom}title") or "Untitled report"
        link = item.findtext("link") or ""
        atom_link = item.find("{http://www.w3.org/2005/Atom}link")
        if atom_link is not None:
            link = atom_link.attrib.get("href", link)
        raw_summary = (
            item.findtext("description")
            or item.findtext("summary")
            or item.findtext("{http://www.w3.org/2005/Atom}summary")
            or title
        )
        published = item.findtext("pubDate") or item.findtext("published") or item.findtext("{http://www.w3.org/2005/Atom}published")
        clean_title = strip_markup(title)
        clean_summary = strip_markup(raw_summary)
        if not clean_title or clean_title.lower() == "untitled report":
            continue
        if not is_concrete_event(clean_title, clean_summary):
            continue

        combined = f"{clean_title} {clean_summary}"
        location, country, lat, lon = locate_event(clean_title, clean_summary)
        category = classify_event(combined)
        events.append({
            "id": re.sub(r"[^a-z0-9]+", "-", f"{source}-{clean_title}".lower()).strip("-")[:90],
            "title": clean_title[:180],
            "statement": direct_event_title(clean_title),
            "summary": clean_summary[:300],
            "source": source,
            "url": link,
            "published": parse_datetime(published),
            "location": location,
            "country": country,
            "lat": lat,
            "lon": lon,
            "category": category,
            "severity": score_event(combined),
            "imageUrl": item_image_url(item, raw_summary),
        })
    return events


def load_events():
    events = []
    now = datetime.now(timezone.utc)
    for source, url in NEWS_FEEDS:
        try:
            for event in parse_feed(source, fetch_url(url)):
                if event["severity"] < 3:
                    continue
                if not event_is_recent_enough(event, now):
                    continue
                events.append(event)
        except Exception:
            continue

    if not events:
        return FALLBACK_EVENTS

    events.sort(key=lambda item: (item["severity"], event_datetime(item["published"])), reverse=True)
    return apply_translations(dedupe_similar_events(events)[:24])


def load_world_geojson():
    if WORLD_CACHE.exists():
        try:
            return json.loads(WORLD_CACHE.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            pass

    for url in WORLD_GEOJSON_URLS:
        try:
            data = fetch_url(url, timeout=8)
            parsed = json.loads(data.decode("utf-8"))
            WORLD_CACHE.parent.mkdir(exist_ok=True)
            WORLD_CACHE.write_text(json.dumps(parsed), encoding="utf-8")
            return parsed
        except Exception:
            continue
    return None


def port_is_available(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind(("127.0.0.1", port))
            return True
        except OSError:
            return False


def pick_port(start):
    port = start
    while port < start + 30:
        if port_is_available(port):
            return port
        port += 1
    raise RuntimeError("No local port available.")


def running_console_port(start):
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    for port in range(start, start + 30):
        url = f"http://127.0.0.1:{port}/index.html"
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=0.05):
                pass
            request = urllib.request.Request(url, headers={"User-Agent": "CodexWorldConsole/1.0"})
            with opener.open(request, timeout=0.35) as response:
                body = response.read(4096).decode("utf-8", errors="ignore")
            if "Codex World Console" in body or "World Event Console" in body:
                return port
        except Exception:
            continue
    return None


def browser_candidates():
    candidates = []
    for name in ("msedge.exe", "chrome.exe"):
        found = shutil.which(name)
        if found:
            candidates.append(found)

    local_app = os.environ.get("LOCALAPPDATA", "")
    program_files = [os.environ.get("ProgramFiles", ""), os.environ.get("ProgramFiles(x86)", "")]
    candidates.extend([
        str(Path(program_files[0]) / "Microsoft" / "Edge" / "Application" / "msedge.exe"),
        str(Path(program_files[1]) / "Microsoft" / "Edge" / "Application" / "msedge.exe"),
        str(Path(program_files[0]) / "Google" / "Chrome" / "Application" / "chrome.exe"),
        str(Path(program_files[1]) / "Google" / "Chrome" / "Application" / "chrome.exe"),
        str(Path(local_app) / "Google" / "Chrome" / "Application" / "chrome.exe"),
    ])
    return [item for item in candidates if item and Path(item).exists()]


def open_console_window(url):
    for browser in browser_candidates():
        try:
            subprocess.Popen([browser, f"--app={url}", "--new-window"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return
        except OSError:
            continue
    webbrowser.open(url)


def main():
    parser = argparse.ArgumentParser(description="Codex World Console")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()

    existing_port = running_console_port(args.port)
    if existing_port:
        url = f"http://127.0.0.1:{existing_port}/index.html"
        if not args.no_browser:
            open_console_window(url)
        return

    port = pick_port(args.port)
    url = f"http://127.0.0.1:{port}/index.html"
    server = ThreadingHTTPServer(("127.0.0.1", port), ConsoleHandler)

    if sys.stdout:
        print()
        print("Codex World Console is running.")
        print(f"URL: {url}")
        print("Press Ctrl+C to stop it.")
        print()

    if not args.no_browser:
        open_console_window(url)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    if sys.platform != "win32":
        print("This launcher is tuned for Windows, but the page itself is portable.")
    main()
