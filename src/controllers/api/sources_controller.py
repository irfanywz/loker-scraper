import json
from src.controllers.api import ApiBaseHandler
from src.models.sources_model import SourcesModel
from src.core.source_service import SourceService

class SourcesApiHandler(ApiBaseHandler):
    def initialize(self):
        self.model = SourcesModel()
        self.service = SourceService()

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

    async def get_sources(self, data):
        sources = self.model.get_all()
        self.write({"status": "success", "data": sources})
        self.finish()

    async def create_source(self, data):
        # Validasi sederhana
        if not data.get('name') or not data.get('url'):
            self.set_status(400)
            self.write({"status": "error", "message": "Nama dan URL wajib diisi"})
            self.finish()
            return

        new_source = {
            "name": data.get('name'),
            "url": data.get('url'),
            "config": data.get('config', {}),
            "active": True
        }
        
        # Simpan ke database (create mengembalikan doc_id)
        doc_id = self.model.create(new_source)
        new_source['id'] = doc_id
        
        self.write({"status": "success", "message": "Sumber berhasil ditambahkan", "data": new_source})
        self.finish()

    async def delete_source(self, data):
        source_id = data.get('id')
        if source_id:
            self.model.delete(int(source_id))
            self.write({"status": "success", "message": "Sumber berhasil dihapus"})
        else:
            self.set_status(400)
            self.write({"status": "error", "message": "ID diperlukan"})
        self.finish()

    async def update_source(self, data):
        source_id = data.get('id')
        if not source_id:
            self.set_status(400)
            self.write({"status": "error", "message": "ID diperlukan"})
            self.finish()
            return

        if not data.get('name') or not data.get('url'):
            self.set_status(400)
            self.write({"status": "error", "message": "Nama dan URL wajib diisi"})
            self.finish()
            return

        # Update data (exclude id from payload to avoid overwriting doc_id logic if any)
        self.model.update(int(source_id), data)
        self.write({"status": "success", "message": "Sumber berhasil diperbarui"})
        self.finish()

    async def test_source(self, data):
        url = data.get('url')
        config = data.get('config')
        source_id = data.get('id')
        result = await self.service.test_source(url, config, source_id)
        self.write(result)
        self.finish()

    async def test_all_sources(self, data):
        results = await self.service.test_all_sources()
        self.write({"status": "success", "data": results})
        self.finish()