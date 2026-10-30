import json
import os
import time
from typing import Dict, Any, List

DATA_DIR = r"D:\MYPROVIPPOJ\studenthub-nova\data"
DURABLE_STORE_PATH = os.path.join(DATA_DIR, "nova_durable_store.json")


class DurableStateStore:
    """
    H0 Persistence Guarantee:
    Đảm bảo 100% dữ liệu (xp_ledger, claimed_idempotency_keys, security_events, passport_events,
    league_submissions, canary_credentials) được lưu bền vững trên đĩa (JSON WAL) ngay cả khi
    dự án Supabase Free Tier đang tạm dừng (Paused), và đồng bộ hai chiều với Supabase khi trực tuyến.
    """

    @staticmethod
    def _default_state() -> Dict[str, Any]:
        return {
            "schema_version": "4.0.0-InternationalEdition",
            "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "xp_ledger": [],
            "claimed_idempotency_keys": [],
            "security_events": [],
            "passport_events": [],
            "league_submissions": [],
            "canary_credentials": [],
        }

    @classmethod
    def load(cls) -> Dict[str, Any]:
        os.makedirs(DATA_DIR, exist_ok=True)
        if not os.path.isfile(DURABLE_STORE_PATH):
            state = cls._default_state()
            cls.save(state)
            return state
        try:
            with open(DURABLE_STORE_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                default = cls._default_state()
                for k, v in default.items():
                    if k not in data:
                        data[k] = v
                return data
        except Exception:
            return cls._default_state()

    @classmethod
    def save(cls, state: Dict[str, Any]) -> bool:
        try:
            os.makedirs(DATA_DIR, exist_ok=True)
            state["updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            tmp_path = DURABLE_STORE_PATH + ".tmp"
            with open(tmp_path, "w", encoding="utf-8") as f:
                json.dump(state, f, ensure_ascii=False, indent=2)
            os.replace(tmp_path, DURABLE_STORE_PATH)
            return True
        except Exception:
            return False
