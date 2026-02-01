import os

import logging
import tornado.web
import tornado.httpclient

from src.routes import url_patterns
from src.config.path import CORE_PATH, DATA_PATH, DATABASE_PATH, LOG_FILE, LOG_PATH, TEMPLATE_PATH
from src.utils.pyinstaller_ import is_frozen

# Set the global default max_clients
tornado.httpclient.AsyncHTTPClient.configure(None, max_clients=1000)
        
class Application(tornado.web.Application):
    def __init__(self):

        # Setup first before run tornado
        self.setup_folder()
        self.setup_logging()            

        settings = {
            "template_path": TEMPLATE_PATH,
            "debug": True if not is_frozen() else False,
            "cookie_secret": "your-super-secret-and-long-cookie-secret-string",
        }       
        
        super(Application, self).__init__(url_patterns, **settings)

    def setup_folder(self):
        os.makedirs(DATA_PATH, exist_ok=True)
        os.makedirs(DATABASE_PATH, exist_ok=True)
        os.makedirs(LOG_PATH, exist_ok=True)
        os.makedirs(CORE_PATH, exist_ok=True)
        
    def setup_logging(self):
        # Configure logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(LOG_FILE),  # Log to a file
                logging.StreamHandler()         # Log to the console
            ]
        )
     
    def on_shutdown_callback(self, callback):
        self.settings["shutdown"] = callback

    def shutdown(self):
        print("Closing database connection...")