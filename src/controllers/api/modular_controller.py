import json
import os

from src.controllers.api import ApiBaseHandler
from src.utils.modstring import get_tool_handler

from src.controllers.api import ApiBaseHandler
from src.config.path import CORE_APP_PATH

from src.controllers.api import ApiBaseHandler
from src.utils.modstring import get_all_tools_metadata

class ToolsApiHandler(ApiBaseHandler):
    def get(self):
        tools_data = get_all_tools_metadata()
        self.write(json.dumps(tools_data))            
        
class ExecutionApiHandler(ApiBaseHandler):
    async def post(self):
        try:
            payload = json.loads(self.request.body)
            tool_command = payload.get('tool')

            action = payload.get('action', 'create') 
            params = payload.get('params', {})

            handler = get_tool_handler(tool_command)

            if handler:
                if hasattr(handler, action) and callable(getattr(handler, action)):
                    method_to_call = getattr(handler, action)
                    result = await method_to_call(params)
                    self.write({"status": "success", "data": result})
                else:
                    self.set_status(400)
                    self.write({"status": "error", "message": f"Action '{action}' is not supported by the '{tool_command}' tool."})
            else:
                self.set_status(400)
                self.write({"status": "error", "message": f"Tool '{tool_command}' tidak dikenal."})
        except Exception as e:
            self.set_status(500)
            self.write({"status": "error", "message": str(e)})
            

class ComponentApiHandler(ApiBaseHandler):
    def get(self, component_path):
        try:
            safe_path = os.path.normpath(os.path.join(CORE_APP_PATH, 'tools', component_path))
            with open(safe_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # While vue3-sfc-loader handles the parsing of SFCs, if you are serving the script.js file directly from a server, ensure the server is responding with the correct Content-Type header (e.g., application/javascript or text/javascript). Incorrect MIME types can prevent the browser from executing the script.
            if component_path.endswith('.js'):
                self.set_header("Content-Type", "application/javascript")
            elif component_path.endswith('.vue'):
                self.set_header("Content-Type", "text/html") # Or text/x-vue; charset=utf-8
            else:
                self.set_header("Content-Type", "text/plain")    
                
            # disable cache
            # self.set_header("Cache-Control", "no-cache, no-store, must-revalidate")
            # self.set_header("Pragma", "no-cache")
            # self.set_header("Expires", "0")                                        
            
            self.write(content)
        except FileNotFoundError:
            self.send_error(404, reason=f"Component file not found: {component_path}")
        except Exception as e:
            self.send_error(500, reason=str(e))            
            
