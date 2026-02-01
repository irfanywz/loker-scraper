from tinydb import TinyDB

class BaseModel:
    def __init__(self, db_path):        
        self.db = TinyDB(db_path)
        print(f"Initialized database at: {db_path}")

    def __getattr__(self, name):
        # fallback when request method not exist
        def method(*args, **kwargs):
            return getattr(self.db, name)(*args, **kwargs)
        return method        
    
    def all(self):
        return self.db.all()

    def get(self, d_id):
        return self.db.get(doc_id=d_id)

    def create(self, data):
        return self.db.insert(data)

    def update(self, d_id, data):
        self.db.update(data, doc_ids=[d_id])

    def delete(self, d_id):
        self.db.remove(doc_ids=[d_id])
        
    def delete_many(self, d_ids):
        self.db.remove(doc_ids=d_ids)        