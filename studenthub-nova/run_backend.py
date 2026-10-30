import sys
import uvicorn

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

if __name__ == "__main__":
    print("[NOVA-OS] Starting Server-Authoritative Backend for StudentHub-AI x Nova OS v3.0...")
    print("[NOVA-OS] Interactive Swagger UI: http://localhost:8000/docs")
    uvicorn.run("apps.api.main:app", host="0.0.0.0", port=8000, reload=False)
