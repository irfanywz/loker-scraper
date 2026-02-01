import sys
import webbrowser

from src.config.const import APP_URL

# This utility is Windows-specific. It requires the `pywin32` library.
# You can install it with: pip install pywin32
try:
    from win32event import CreateMutex
    from win32api import GetLastError
    from winerror import ERROR_ALREADY_EXISTS
except ImportError:
    # If not on Windows or pywin32 is not installed, create dummy functions.
    def ensure_single_instance(mutex_name, port):
        print("Warning: Single instance check is only supported on Windows with pywin32.")
        pass
else:
    mutex_handle = None

    def ensure_single_instance(mutex_name, port):
        """Checks for an existing instance using a named mutex and exits if found."""
        global mutex_handle
        mutex_handle = CreateMutex(None, 1, f"Global\\{mutex_name}")
        if GetLastError() == ERROR_ALREADY_EXISTS:
            print("Another instance is already running. Opening browser and exiting.")
            webbrowser.open_new_tab(APP_URL)
            sys.exit(0)