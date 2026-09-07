# Codex World

Codex World is a local world-event and markets console for Windows.

## What's new in 0.4.0 / 本次升级

- Find market assets by name or ticker, save favorites locally, and keep favorites at the top of the list.
- News reports distinguish the last successful fetch from the time a cached response was served, including partial source failures and offline data.
- Automatic refresh prioritizes the active view and reduces background requests while the window is hidden.
- Temperature readings consistently use `°C` in city cards, map labels, and weather details.
- Selecting or copying text inside the translation panel no longer triggers another translation.

- 行情支持名称和代码搜索、自选收藏及置顶，自选保存在本机。
- 新闻显示真实的成功更新时间，区分缓存数据、部分数据源失败和离线状态。
- 自动刷新优先处理当前页面，窗口隐藏时减少后台请求。
- 城市卡片、地图和天气详情统一使用带小圆圈的 `°C`。
- 翻译面板内的原文、译文和解释可以正常选中复制，不会再次触发自动翻译。

## Download / 下载

Download the Windows installer: [Codex-World-Setup-x64.exe](https://github.com/tx74666/CodexWorldConsole/releases/latest/download/Codex-World-Setup-x64.exe). Each new release also includes a `.sha256` checksum and GitHub build attestation.

下载 Windows 安装包：[Codex-World-Setup-x64.exe](https://github.com/tx74666/CodexWorldConsole/releases/latest/download/Codex-World-Setup-x64.exe)。新版本还会附带 `.sha256` 校验文件和 GitHub 构建证明。

Latest release: [github.com/tx74666/CodexWorldConsole/releases/latest](https://github.com/tx74666/CodexWorldConsole/releases/latest)

## Install / 安装

1. Double-click `Codex-World-Setup-x64.exe`.
2. Choose **简体中文** or **English**.
3. Choose the install drive and folder on the destination page.
4. Finish Setup and launch Codex World from the desktop or Start menu.

1. 双击 `Codex-World-Setup-x64.exe`。
2. 选择 **简体中文** 或 **English**。
3. 在安装位置页面选择磁盘和目录。
4. 完成安装，从桌面或开始菜单启动 Codex World。

The installer contains the x64 application runtime. Users do not need to install Python.

## Local Data

Installed copies keep caches and local settings per Windows account under:

```text
%LOCALAPPDATA%\CodexWorld
```

Local data is not included in GitHub releases.

Uninstall removes disposable caches and diagnostic logs but preserves preferences and saved model configuration for a later reinstall. Delete `%LOCALAPPDATA%\CodexWorld` manually if you want to remove all local data.

On the first 0.3.4 source-mode launch, a legacy `.world-console.local.json` beside the source is copied into the user data directory if no new config exists; a plaintext legacy model key is protected during that migration.

The installer includes public bootstrap snapshots for the map and market list. The initial markets API returns only asset and currency summaries; currency history is loaded for the active pair on demand, while asset chart history refreshes independently. Personal settings and wallpaper history are never shared between devices.

## Requirements

- Windows 10 or Windows 11, 64-bit
- Microsoft Edge or Google Chrome

## Run From Source

```powershell
python world_console.py
```

The default local URL is `http://127.0.0.1:8797/index.html`.

## Model API / 模型接口

Open a market item and choose **API** in the “Ask for details” panel. Codex World supports the OpenAI Responses API and OpenAI-compatible Chat Completions endpoints. Questions are sent to the configured model as natural language together with the selected Codex World context; there is no keyword-based answer router.

打开市场条目，在“询问详情”面板中点击 **API**。Codex World 支持 OpenAI Responses API 和兼容 Chat Completions 的接口。问题会以自然语言原样发送给模型，并附带当前选中的 Codex World 上下文，不再通过关键词选择固定回答。

API settings stay on the loopback-only local server in `%LOCALAPPDATA%\CodexWorld\.world-console.local.json`; on Windows the saved key is protected with DPAPI and is never returned to the browser. Think mode can optionally enable the Responses API `web_search` tool, which is off by default. External endpoints must use HTTPS; plain HTTP is accepted only for loopback model servers. Changing the endpoint without supplying a new key clears the old key so credentials cannot cross endpoints.

The local HTTP server exposes only the four required web assets and exact API routes. Public image fetching rejects private, loopback, multicast, and reserved addresses, disables proxy inheritance, and connects to the DNS result that was actually validated on every redirect.

接口设置保存在仅监听回环地址的本机服务端 `%LOCALAPPDATA%\CodexWorld\.world-console.local.json`；Windows 会用 DPAPI 保护已保存密钥，密钥也不会返回浏览器。Think 模式可选择启用 Responses API 的 `web_search` 工具，默认关闭。外部接口必须使用 HTTPS；只有回环地址模型服务可使用 HTTP。更换接口但不提供新密钥时，旧密钥会自动清除。

Environment-provided model settings take precedence as one complete configuration source and are shown as managed in the UI. Local credentials are never combined with an environment-provided endpoint.

## Build Locally

Install Python 3.12 x64, the pinned PyInstaller version, and Inno Setup 7, then run:

```powershell
python -m pip install pyinstaller==6.22.2
.\scripts\build-windows.ps1 -OutputDir release
```

The version comes from `app-manifest.json`; an explicit `-Version` must match it. The build verifies Python x64, Python 3.12, PyInstaller and Inno Setup 7, embeds Windows version metadata, and uses a per-project mutex so concurrent builds cannot overwrite shared output. It produces the installer plus `release\Codex-World-Setup-x64.exe.sha256`. Validation CI builds the Windows package before tags are created; release CI also performs a silent temporary install, starts the packaged executable on a loopback test port, and requires a clean uninstall before publishing.

Before a release, refresh the bundled public market snapshot explicitly and validate it. The refresh command is deterministic and will not write unless `--write` is present:

```powershell
python scripts\refresh-market-bootstrap.py --write
python scripts\check-package-resources.py --source-only --max-market-age-days 7
```

## Tests

```powershell
python -m unittest discover -s tests -v
python scripts\check-market-freshness.py
python scripts\check-package-resources.py --source-only --max-market-age-days 7
npm ci --ignore-scripts
npm run check
```

The responsive browser suite is available as `npm run test:responsive` while a local server is listening on port 8797. CI installs the locked Playwright runtime and runs this suite at 390–2560 px.

## Android

`android/` is a security-restricted WebView prototype, not a published Codex World package. It requires an HTTPS-hosted console and currently has no Gradle wrapper, signing, emulator-test, or release pipeline; see `android/README.md`.
