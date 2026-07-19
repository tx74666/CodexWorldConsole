# Codex World

Codex World is a local world-event and markets console for Windows.

## Download / 下载

There is one public package: [Codex-World-Setup-x64.exe](https://github.com/tx74666/CodexWorldConsole/releases/latest/download/Codex-World-Setup-x64.exe).

公开下载只有一个：[Codex-World-Setup-x64.exe](https://github.com/tx74666/CodexWorldConsole/releases/latest/download/Codex-World-Setup-x64.exe)。

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

The installer includes a public bootstrap snapshot for the map and market panels. On first launch it is copied into the current Windows account and refreshed in the background. Personal settings and wallpaper history are never shared between devices.

## Requirements

- Windows 10 or Windows 11, 64-bit
- Microsoft Edge or Google Chrome

## Run From Source

```powershell
python world_console.py
```

The default local URL is `http://127.0.0.1:8797/index.html`.

## Build Locally

Install Python 3.12 x64, PyInstaller, and Inno Setup 7, then run:

```powershell
python -m pip install pyinstaller
.\scripts\build-windows.ps1 -Version 0.3.0 -OutputDir release
```

The result is `release\Codex-World-Setup-x64.exe`.
