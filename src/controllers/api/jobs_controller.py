import json
from src.controllers.api import ApiBaseHandler
from src.models.jobs_model import JobsModel
from src.core.source_service import SourceService

class JobsApiHandler(ApiBaseHandler):
    def initialize(self):
        self.model = JobsModel()
        self.source_service = SourceService()

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

    async def get_jobs(self, data):
        jobs = self.model.get_all()
        # Sort by ID descending (terbaru diatas)
        jobs.sort(key=lambda x: x['id'], reverse=True)
        self.write({"status": "success", "data": jobs})
        self.finish()

    async def delete_job(self, data):
        job_id = data.get('id')
        if job_id:
            self.model.delete(int(job_id))
            self.write({"status": "success", "message": "Data berhasil dihapus"})
        self.finish()

    async def clear_jobs(self, data):
        self.model.db.truncate()
        self.write({"status": "success", "message": "Semua data berhasil dihapus"})
        self.finish()

    async def scrape_jobs(self, data):
        result = await self.source_service.scrape_all()
        self.write(result)
        self.finish()