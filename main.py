import asyncio
import os

import webbrowser
from src.boot import Application
from src.config.const import APP_BANNER, APP_NAME, APP_PORT, APP_URL, APP_VERSION
from src.config.path import ICON_FILE
from src.core import load_core
from src.utils.process import kill_proc_tree
from src.utils.pyinstaller_ import is_frozen
from src.utils.singleton import ensure_single_instance
from src.utils.pystray_ import SystemTrayApp

def perform_open():
    webbrowser.open(APP_URL)

def perform_exit(app, server):
    if server:
        server.stop()
    app.shutdown()
    print("Server has been stopped. Exiting.")
    kill_proc_tree()
    os._exit(0)    

async def main():
    # Ensure only one instance of the application can run.
    # This must be the first call.
    if is_frozen():
        ensure_single_instance(APP_NAME, APP_PORT)

    print(APP_BANNER)
    print('Version:', APP_VERSION)
    print('Port:', APP_PORT)
    print("\n")
    
    load_core()

    app = Application()

    from src.core.scheduler import Scheduler
    Scheduler.get_instance().start()
    
    server = None
    try:
        print('Starting server...')    
        server = app.listen(APP_PORT)

        if is_frozen():
            tray = SystemTrayApp(
                name=APP_NAME,
                image=ICON_FILE,
                open_func=perform_open
            )
            tray.run()
        
        # register callback for app shutdown
        app.on_shutdown_callback(callback=lambda: perform_exit(app, server))        
        
        print(f"Server started on host: {APP_URL}")
        if is_frozen():
            perform_open()

        print("\n")
        
        print("Press Ctrl+C to quit")
        
        print("\n\n")

        await asyncio.Event().wait()
        
    except KeyboardInterrupt:
        print("\nCtrl+C received. Shutting down gracefully...")
    finally:
        perform_exit(app, server)

if __name__ == "__main__":
    asyncio.run(main())