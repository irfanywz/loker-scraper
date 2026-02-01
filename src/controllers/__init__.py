import tornado.web

from src.config.path import ICON_FILE

class BaseHandler(tornado.web.RequestHandler):
    def get(self, path=None):
        self.render("index.html")        
        
class StorageHandler(tornado.web.StaticFileHandler):
    def write_error(self, status_code, **kwargs):
        if status_code != 200:
            # Default For StaticFileHandler as Image
            self.set_header('Content-Type', 'image/jpeg')
            with open(ICON_FILE, "rb") as f:
                self.write(f.read())
            self.finish()
        else:
            super().write_error(status_code, **kwargs)