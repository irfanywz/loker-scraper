import os
import inspect
import logging
from importlib.machinery import ModuleSpec
from importlib.util import spec_from_file_location, module_from_spec
from types import ModuleType

from src.config.path import CORE_APP_PATH

def _import_module_from_path(module_name: str, file_path: str) -> ModuleType | None:
    """Imports a module from a given file path."""
    try:
        spec: ModuleSpec | None = spec_from_file_location(module_name, file_path)
        if spec and spec.loader:
            module = module_from_spec(spec)
            spec.loader.exec_module(module)
            return module
    except Exception as e:
        logging.error(f"Failed to import module '{module_name}' from '{file_path}': {e}")
    return None


def _find_handler_class(module: ModuleType, tool_name: str) -> type | None:
    """Finds a handler class within a module, preferring a specific naming convention."""
    # A more robust convention is to check for inheritance from a base class.
    # For now, we can check for a name match or just grab the first class.
    expected_class_name = f"{tool_name.replace('_', '')}handler"
    
    for name, obj in inspect.getmembers(module, inspect.isclass):
        if name.lower() == expected_class_name:
            return obj

    # Fallback to the first class defined in the module if no name match.
    for name, obj in inspect.getmembers(module, inspect.isclass):
        if obj.__module__ == module.__name__:
            return obj
            
    return None


def get_all_tools_metadata() -> list:
    """Scans the tools directory and gathers metadata from each tool's controller."""
    tools_data = []
    tools_dir = os.path.join(CORE_APP_PATH, 'tools')

    for tool_folder in os.listdir(tools_dir):
        tool_path = os.path.join(tools_dir, tool_folder)
        controller_file = os.path.join(tool_path, 'controller.py')

        if os.path.isdir(tool_path) and os.path.exists(controller_file):
            module = _import_module_from_path(tool_folder, controller_file)
            if not module:
                continue

            handler_class = _find_handler_class(module, tool_folder)
            if handler_class:
                # Instantiate the handler to get dynamic properties if any
                try:
                    instance = handler_class()
                except Exception as e:
                    logging.error(f"Error instantiating handler for tool '{tool_folder}': {e}")
                    continue
                
                # can you make tool_info dynamic declaration base on property on class
                # Collect all public properties (not starting with _)
                tool_info = {}
                for prop_name in dir(handler_class):
                    if not prop_name.startswith('_') and not callable(getattr(instance, prop_name)):
                        tool_info[prop_name] = getattr(instance, prop_name)
                        
                tools_data.append(tool_info)
            else:
                logging.warning(f"No handler class found in {controller_file}")

    return tools_data


def get_tool_handler(tool_name: str):
    """
    Loads and instantiates a specific tool handler by its name.
    """
    tool_controller_path = os.path.join(CORE_APP_PATH, "tools", tool_name, "controller.py")

    if not os.path.exists(tool_controller_path):
        logging.error(f"Controller file not found for tool '{tool_name}' at {tool_controller_path}")
        return None

    module = _import_module_from_path(tool_name, tool_controller_path)
    if not module:
        return None

    handler_class = _find_handler_class(module, tool_name)
    if handler_class:
        try:
            return handler_class()  # Instantiate the handler
        except Exception as e:
            logging.error(f"Error instantiating handler for tool '{tool_name}': {e}")
    else:
        logging.warning(f"No handler class found for tool '{tool_name}'")

    return None
