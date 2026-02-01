import os
from src.config.path import DATA_PATH
from src.models import BaseModel

class SourcesModel(BaseModel):
    def __init__(self):
        # Set lokasi database spesifik untuk sources
        db_path = os.path.join(DATA_PATH, 'sources.json')
        super().__init__(db_path)

    def get_all(self):
        # TinyDB secara default tidak mengembalikan ID di dalam dict datanya saat .all()
        # Kita perlu inject doc_id agar frontend bisa menggunakannya sebagai key
        return [dict(doc, id=doc.doc_id) for doc in self.db]

    def get_by_id(self, doc_id):
        doc = self.get(int(doc_id))
        if doc:
            doc['id'] = int(doc_id)
            return doc
        return None