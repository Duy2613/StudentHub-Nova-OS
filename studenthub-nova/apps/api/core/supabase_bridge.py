import os
import json
import time
import urllib.request
import urllib.error
from typing import Dict, Any, Optional
from core.env_loader import load_project_env


class SupabaseLiveBridge:
    """
    Kết nối trực tiếp tới Supabase REST & Auth API (NEXT_PUBLIC_SUPABASE_URL)
    và đồng bộ dữ liệu thực tế cho StudentHub-AI × Nova OS.
    """

    def __init__(self):
        load_project_env()
        self.supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
        self.anon_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
        self.service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
        self.tavily_key = os.environ.get("TAVILY_API_KEY", "")
        self.legacy_api_url = os.environ.get("STUDENTHUB_LEGACY_VERIFICATION_BASE_URL", "").rstrip("/")

    def check_supabase_health(self) -> Dict[str, Any]:
        if not self.supabase_url or not (self.anon_key or self.service_key):
            return {
                "connected": False,
                "status": "NOT_CONFIGURED",
                "url": self.supabase_url or "none",
                "latency_ms": 0.0,
            }
        start_ts = time.perf_counter()
        api_key = self.service_key or self.anon_key
        try:
            req = urllib.request.Request(
                f"{self.supabase_url}/rest/v1/",
                headers={
                    "apikey": api_key,
                    "Authorization": f"Bearer {api_key}",
                },
                method="GET",
            )
            with urllib.request.urlopen(req, timeout=6) as res:
                latency_ms = round((time.perf_counter() - start_ts) * 1000, 2)
                return {
                    "connected": res.status == 200,
                    "status": f"ONLINE (HTTP {res.status})",
                    "url": self.supabase_url,
                    "auth_mode": "service_role" if self.service_key else "anon_key",
                    "latency_ms": latency_ms,
                }
        except urllib.error.HTTPError as e:
            latency_ms = round((time.perf_counter() - start_ts) * 1000, 2)
            # HTTP 200/401/404 from Supabase Kong gateway still proves live cloud endpoint reachability
            return {
                "connected": e.code in (200, 400, 401, 404),
                "status": f"REACHABLE (HTTP {e.code})",
                "url": self.supabase_url,
                "latency_ms": latency_ms,
            }
        except Exception as e:
            latency_ms = round((time.perf_counter() - start_ts) * 1000, 2)
            return {
                "connected": False,
                "status": f"ERROR ({str(e)[:80]})",
                "url": self.supabase_url,
                "latency_ms": latency_ms,
            }

    def search_tavily_evidence(self, query: str) -> Optional[str]:
        """
        Gọi trực tiếp Tavily Search API (Lớp 3 Guarded External Evidence) nếu đã cấu hình TAVILY_API_KEY.
        """
        if not self.tavily_key:
            return None
        try:
            payload = json.dumps({
                "api_key": self.tavily_key,
                "query": query[:280],
                "search_depth": "basic",
                "max_results": 2,
            }).encode("utf-8")
            req = urllib.request.Request(
                "https://api.tavily.com/search",
                data=payload,
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=6) as res:
                data = json.loads(res.read().decode("utf-8"))
                results = data.get("results", [])
                if results:
                    snippets = [f"[{r.get('title', 'Nguồn')}]: {r.get('content', '')[:160]}..." for r in results[:2]]
                    return " | ".join(snippets)
        except Exception:
            pass
        return None
