import sys

def is_frozen():
    if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
        return True