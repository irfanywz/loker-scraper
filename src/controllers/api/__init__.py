import tornado.web

class ApiBaseHandler(tornado.web.RequestHandler):        
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "Content-Type")
        self.set_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.set_header("Content-Type", "application/json")

    def options(self, *args, **kwargs):
        self.set_status(204)
        self.finish()                

class Error404Handler(ApiBaseHandler):
    def prepare(self):
        self.write({"status": "error", "message": "404: Not Found"})
        self.finish()