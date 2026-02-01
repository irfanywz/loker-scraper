import os
from src.config.path import DATA_PATH
from src.models import BaseModel

class SettingsModel(BaseModel):
    def __init__(self):
        # Set lokasi database settings
        db_path = os.path.join(DATA_PATH, 'settings.json')
        super().__init__(db_path)

    def get_config(self):
        # Ambil config pertama, jika tidak ada buat default
        config = self.db.all()
        if config:
            doc = config[0]
            doc['id'] = doc.doc_id
            return doc
        
        default = {
            "auto_scrape": False,
            "scrape_interval": 60, # dalam menit
            "last_run": None
        }
        doc_id = self.db.insert(default)
        default['id'] = doc_id
        return default

    def update_config(self, data):
        doc = self.get_config()
        self.db.update(data, doc_ids=[doc['id']])