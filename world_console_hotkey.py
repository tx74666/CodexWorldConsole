from pathlib import Path
import subprocess
import sys


if sys.platform != "win32":
    raise SystemExit("The global hotkey listener is only available on Windows.")

import ctypes
from ctypes import wintypes


APP_DIR = Path(__file__).resolve().parent
LAUNCHER = APP_DIR / "Start-WorldConsole.vbs"
HOTKEY_ID = 0xC0DE
MOD_ALT = 0x0001
VK_C = 0x43
WM_HOTKEY = 0x0312


def launch_console():
    subprocess.Popen(
        ["wscript.exe", str(LAUNCHER)],
        cwd=str(APP_DIR),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def main():
    user32 = ctypes.windll.user32
    if not user32.RegisterHotKey(None, HOTKEY_ID, MOD_ALT, VK_C):
        return

    msg = wintypes.MSG()
    try:
        while user32.GetMessageW(ctypes.byref(msg), None, 0, 0) != 0:
            if msg.message == WM_HOTKEY and msg.wParam == HOTKEY_ID:
                launch_console()
            user32.TranslateMessage(ctypes.byref(msg))
            user32.DispatchMessageW(ctypes.byref(msg))
    finally:
        user32.UnregisterHotKey(None, HOTKEY_ID)


if __name__ == "__main__":
    main()
