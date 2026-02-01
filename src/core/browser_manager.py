import os
import asyncio
from pyppeteer import launch
from src.config.path import DATA_PATH

class BrowserManager:
    _instance = None
    _browser = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self.user_data_dir = os.path.join(DATA_PATH, 'chrome_profile')

    def _get_chrome_path(self):
        paths = [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
        ]
        for path in paths:
            if os.path.exists(path):
                return path
        return None

    async def get_browser(self):
        # Cek apakah browser sudah ada dan masih terkoneksi
        if self._browser:
            try:
                if not self._browser.isConnected:
                    self._browser = None
                else:
                    # Health Check: Ping browser untuk memastikan responsif
                    # Jika hang lebih dari 5 detik, anggap mati
                    await asyncio.wait_for(self._browser.version(), timeout=5.0)
            except Exception:
                print("Browser tidak merespons atau terputus. Restarting...")
                try:
                    await self._browser.close()
                except Exception:
                    # Jika close normal gagal, paksa kill process
                    if self._browser and self._browser.process:
                        self._browser.process.kill()
                self._browser = None

        # Jika belum ada atau terputus, luncurkan baru
        if self._browser is None:
            executable_path = self._get_chrome_path()
            self._browser = await launch(
                headless=False, # Tetap False agar terlihat (sesuai request)
                executablePath=executable_path,
                userDataDir=self.user_data_dir,
                args=['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,768'],
                autoClose=False # PENTING: Agar browser tidak mati saat script selesai
            )
        
        return self._browser

    async def close_browser(self):
        if self._browser:
            await self._browser.close()
            self._browser = None