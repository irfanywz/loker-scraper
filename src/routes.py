import os
from tornado.web import url

from src.config.path import TEMPLATE_PATH, ASSETS_PATH

from src.controllers import BaseHandler, StorageHandler
from src.controllers.api import Error404Handler
from src.controllers.api.settings_controller import SettingsApiHandler
from src.controllers.api.modular_controller import ToolsApiHandler, ExecutionApiHandler, ComponentApiHandler
from src.controllers.api.sources_controller import SourcesApiHandler
from src.controllers.api.jobs_controller import JobsApiHandler


url_patterns = [

    # Route for Sources
    url(r"/api/sources/?", SourcesApiHandler),

    # Route for Jobs
    url(r"/api/jobs/?", JobsApiHandler),

    # Route for Setting
    url(r"/api/settings/?", SettingsApiHandler),    

    # Route to vue dist
    url(r"/assets/(.*)", StorageHandler, {
        "path": ASSETS_PATH
    }),
    
    # Route for 404 API path
    # All other routes should be handled by the Vue app
    # This should be the last route in the list
    url(r"/api/(.*)", Error404Handler),
    
    # Route to dist
    # this is for fix favicon
    url(r"/(.*\.(ico|svg|webmanifest|png))", StorageHandler, {
        "path": TEMPLATE_PATH
    }),
    
    url(r"/(.*)", BaseHandler, name='home'),
]