import json
from src.controllers.api import ApiBaseHandler
from src.models.jobs_model import JobsModel
from src.models.settings_model import SettingsModel

class SettingsApiHandler(ApiBaseHandler):
    def initialize(self):
        self.jobs_model = JobsModel()
        self.settings_model = SettingsModel()

    async def post(self, *args, **kwargs):
        try:
            payload = json.loads(self.request.body)
            action = payload.get('action')
            data = payload.get('data')

            if hasattr(self, action) and callable(getattr(self, action)):
                await getattr(self, action)(data)
            else:
                self.set_status(400)
                self.write({"status": "error", "message": f"Invalid action: {action}"})
                self.finish()

        except Exception as e:
            self.set_status(500)
            self.write({"status": "error", "message": str(e)})
            self.finish()

    async def import_jobs(self, data):
        jobs = data.get('jobs', [])
        if not isinstance(jobs, list):
             self.set_status(400)
             self.write({"status": "error", "message": "Format data tidak valid"})
             self.finish()
             return
        
        # Kosongkan database lama dan masukkan data baru
        self.jobs_model.db.truncate()
        if jobs:
            self.jobs_model.insert_multiple(jobs)
            
        self.write({"status": "success", "message": f"Berhasil memulihkan {len(jobs)} data lowongan"})

    async def clear_jobs(self, data):
        self.jobs_model.db.truncate()
        self.write({"status": "success", "message": "Semua data berhasil dihapus"})

    async def export_jobs(self, data):
        # Ambil semua data untuk backup
        jobs = self.jobs_model.get_all()
        self.write({"status": "success", "data": jobs})

    async def get_scheduler_config(self, data):
        config = self.settings_model.get_config()
        self.write({"status": "success", "data": config})

    async def save_scheduler_config(self, data):
        self.settings_model.update_config(data)
        self.write({"status": "success", "message": "Konfigurasi scheduler berhasil disimpan"})