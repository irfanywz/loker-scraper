import os
from src.config.path import DATA_PATH
from src.models import BaseModel

class JobsModel(BaseModel):
    def __init__(self):
        # Set lokasi database spesifik untuk jobs
        db_path = os.path.join(DATA_PATH, 'jobs.json')
        super().__init__(db_path)

    def get_all(self):
        # Mengembalikan semua data dengan ID
        return [dict(doc, id=doc.doc_id) for doc in self.db]

    def get_existing_links(self):
        # Mengembalikan set link yang sudah ada untuk deduplikasi cepat
        return {doc.get('link') for doc in self.db if doc.get('link')}