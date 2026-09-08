import subprocess
import sys
import os
import time

def main():
    print("=" * 60)
    print("Starting CyberDetect SOC Forensic Analyzer Demo Servers")
    print("=" * 60)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")

    print("\n[1/2] Starting FastAPI Backend on http://localhost:8000 ...")
    backend_cmd = [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=backend_dir)

    time.sleep(2)

    print("\n[2/2] Starting Vite Frontend on http://localhost:5173 ...")
    frontend_cmd = ["npx.cmd" if os.name == 'nt' else "npx", "vite"]
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir)

    print("\n" + "=" * 60)
    print(" CyberDetect Demo is Running!")
    print("-> Access the UI at:  http://localhost:5173")
    print("-> API Docs at:      http://localhost:8000/docs")
    print("-> Demo Credentials: admin / cyberdetect2026")
    print("=" * 60)

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        sys.exit(0)

if __name__ == "__main__":
    main()
