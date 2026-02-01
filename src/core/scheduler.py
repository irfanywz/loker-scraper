import asyncio
from datetime import datetime, timedelta
from src.models.settings_model import SettingsModel
from src.core.source_service import SourceService

class Scheduler:
    _instance = None
    _task = None
    _is_running = False

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self.settings_model = SettingsModel()
        self.source_service = SourceService()

    def start(self):
        if self._is_running:
            return
        
        self._is_running = True
        # Jalankan loop di background task
        self._task = asyncio.create_task(self._run_loop())
        print("Scheduler started.")

    def stop(self):
        self._is_running = False
        if self._task:
            self._task.cancel()
            self._task = None
        print("Scheduler stopped.")

    async def _run_loop(self):
        print("Scheduler loop running...")
        while self._is_running:
            try:
                config = self.settings_model.get_config()
                
                if config.get('auto_scrape', False):
                    interval = int(config.get('scrape_interval', 60))
                    last_run_str = config.get('last_run')
                    
                    should_run = False
                    if not last_run_str:
                        should_run = True
                    else:
                        last_run = datetime.strptime(last_run_str, "%Y-%m-%d %H:%M:%S")
                        next_run = last_run + timedelta(minutes=interval)
                        if datetime.now() >= next_run:
                            should_run = True
                    
                    if should_run:
                        print(f"Scheduler: Executing auto scrape (Interval: {interval}m)")
                        await self.source_service.scrape_all()
                        
                        self.settings_model.update_config({
                            "last_run": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        })
                
                # Cek setiap 60 detik
                await asyncio.sleep(60)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"Scheduler Error: {e}")
                await asyncio.sleep(60) # Tunggu sebentar jika error sebelum retry