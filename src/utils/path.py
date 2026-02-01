import os.path
import sys

from src.utils.pyinstaller_ import is_frozen

def exe_path(*args):
    if is_frozen():
        dir = os.path.dirname(sys.executable)
    elif __file__:
        dir = os.path.abspath(".")
    return os.path.join(dir, *args)

def resource_path(*args):
    if is_frozen():
        dir = sys._MEIPASS
    elif __file__:
        dir = os.path.abspath(".")
    return os.path.join(dir, *args)