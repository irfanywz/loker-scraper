import os
import pystray
from PIL import Image
import sys
import ctypes
import win32con

if sys.platform == 'win32':
    class Win32PystrayIcon(pystray.Icon):
        WM_LBUTTONUP = 0x0202
        WM_LBUTTONDBLCLK = 0x0203

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.action = kwargs['action']

        def _on_notify(self, wparam, lparam):
            super()._on_notify(wparam, lparam)
            if lparam == self.WM_LBUTTONUP:
                if self.action:
                    self.action(self)
    
    pystray.Icon = Win32PystrayIcon


class SystemTrayApp:
    def __init__(self, name='TestApp', image='app.png', callback_on_exit=None, open_func=None):
        self.name = name
        self.hwnd = self._get_console_handle()
        
        if callback_on_exit:
            self.callback_on_exit = callback_on_exit
        else:
            self.callback_on_exit = lambda: os._exit(0) # Default exit behavior            
        
        if open_func:
            self.open_func = open_func
        
        try:
            image = Image.open(image)
        except FileNotFoundError:
            image = Image.new('RGB', (64, 64), 'white')
            
        self.icon = pystray.Icon(
            name=self.name,
            icon=image,
            title='Click to Toggle Console',
            action=self.toggle_console
        )

        self.icon.menu = pystray.Menu(
            pystray.MenuItem('Open', self.open_app),
            pystray.MenuItem(self.get_toggle_text, self.toggle_console),
            pystray.Menu.SEPARATOR,
            pystray.MenuItem('Exit', self.exit_app)
        )
    
    def _get_console_handle(self):
        if sys.platform != 'win32':
            return None
        return ctypes.windll.kernel32.GetConsoleWindow()

    def _is_console_visible(self):
        if sys.platform != 'win32' or not self.hwnd:
            return False
        return ctypes.windll.user32.IsWindowVisible(self.hwnd)

    def toggle_console(self, icon):
        if sys.platform != 'win32':
            return
            
        if not self.hwnd:
            print("Error: Could not get console window handle.")
            return

        visible = self._is_console_visible()

        if visible:
            ctypes.windll.user32.ShowWindow(self.hwnd, win32con.SW_HIDE)
            print("Console hidden via icon click.")
        else:
            ctypes.windll.user32.ShowWindow(self.hwnd, win32con.SW_SHOW)
            ctypes.windll.user32.SetForegroundWindow(self.hwnd)
            print("Console shown via icon click.")

    def get_toggle_text(self, item):
        if self._is_console_visible():
            return 'Hide (Visible)'
        return 'Show (Hidden)'

    def open_app(self):
        if self.open_func:
            self.open_func()
    
    def exit_app(self, icon, item=None):
        print("Exiting application...")
        icon.stop()
        if self.callback_on_exit:
            self.callback_on_exit()            

    def run(self):
        print("PyTray application started.")
        self.icon.run_detached()