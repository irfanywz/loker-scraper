import os
import psutil

def kill_proc_tree():
    try:
        pid = os.getpid()    
        parent = psutil.Process(pid)
        for child in parent.children(recursive=True):
            child.kill()
    except:
        pass
    
import subprocess

def run_cli_worker(command):
    """
    Synchronous function to run the pollination CLI command in a separate process.
    This is a top-level function in its own module to avoid pickling/import issues.
    """
    process = subprocess.run(command, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    if process.returncode != 0:
        error_details = process.stderr.strip()
        raise RuntimeError(f"Gagal membuat gambar: {error_details}")
    return process.stdout    