import os.path
from time import strftime

from src.config.const import APP_NAME
from src.utils.path import resource_path, exe_path
from src.utils.pyinstaller_ import is_frozen


EXE_PATH = exe_path()
EXE_SOURCE_PATH = os.path.join(EXE_PATH, 'src')
RESOURCE_PATH = resource_path('src' if not is_frozen() else '')
RESOURCES_PATH = os.path.join(RESOURCE_PATH, 'resources')
DATA_PATH = os.path.join(EXE_PATH, f'{APP_NAME}_Data')
DATABASE_PATH = os.path.join(DATA_PATH, '.db')

LOG_PATH = os.path.join(DATA_PATH, 'logs')
LOG_FILE = os.path.join(LOG_PATH, f'{strftime("%d-%m-%Y")}.log')
LOG_ERROR_FILE = os.path.join(LOG_PATH, f'{strftime("%d-%m-%Y")}-error.log')

ICON_FILE = os.path.join(RESOURCES_PATH, "icons", "app.png")
ICON_URL = '/storage/resources/icons/app.png'

TEMPLATE_PATH = os.path.join(RESOURCES_PATH, "static", "dist")
ASSETS_PATH = os.path.join(TEMPLATE_PATH, "assets")

# when in frozen
if is_frozen():
    CORE_PATH = os.path.join(DATA_PATH, 'core/dist')
    CORE_APP_PATH = CORE_PATH
else:
    CORE_PATH = os.path.join(EXE_SOURCE_PATH, 'core')
    CORE_APP_PATH = os.path.join(RESOURCE_PATH, 'app', 'src', 'core')