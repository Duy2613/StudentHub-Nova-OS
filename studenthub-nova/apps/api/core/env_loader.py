import os
from typing import Dict, Any

WORKSPACE_WRITE_ENV_PATHS = [
    r"D:\MYPROVIPPOJ\studenthub-nova\.env",
    r"D:\MYPROVIPPOJ\StudentHub-AI\.env.local",
]

ENV_PATHS = [
    r"D:\MYPROVIPPOJ\studenthub-nova\.env",
    r"D:\MYPROVIPPOJ\StudentHub-AI\.env.local",
    r"C:\Users\Duy\Projects\MyProj\StudentHub-AI\frontend\.env.local",
]


def load_project_env(force_override: bool = False) -> Dict[str, str]:
    """
    Tự động nạp biến môi trường từ tệp .env / .env.local vào os.environ.
    Tuyệt đối không in giá trị khóa bí mật ra log.
    """
    loaded: Dict[str, str] = {}
    for path in ENV_PATHS:
        if not os.path.isfile(path):
            continue
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                for raw_line in f:
                    line = raw_line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    if key and val and (force_override or not os.environ.get(key)):
                        os.environ[key] = val
                        loaded[key] = path
        except Exception:
            pass
    return loaded


def update_env_variables(updates: Dict[str, str], allow_external_sync: bool = False) -> Dict[str, Any]:
    """
    Cập nhật trực tiếp các biến môi trường mới vào bộ nhớ os.environ và đồng bộ xuống các tệp .env / .env.local
    trong phạm vi workspace (chỉ ghi ra repo ngoài khi allow_external_sync=True).
    """
    clean_updates = {k.strip(): v.strip() for k, v in updates.items() if k.strip() and v and v.strip()}
    for k, v in clean_updates.items():
        os.environ[k] = v

    target_paths = ENV_PATHS if allow_external_sync else WORKSPACE_WRITE_ENV_PATHS
    synced_files = []
    for path in target_paths:
        try:
            existing_lines = []
            if os.path.isfile(path):
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    existing_lines = f.read().splitlines()

            updated_keys = set()
            new_lines = []
            for line in existing_lines:
                stripped = line.strip()
                if stripped and not stripped.startswith("#") and "=" in stripped:
                    k = stripped.split("=", 1)[0].strip()
                    if k in clean_updates:
                        new_lines.append(f"{k}={clean_updates[k]}")
                        updated_keys.add(k)
                        continue
                new_lines.append(line)

            for k, v in clean_updates.items():
                if k not in updated_keys:
                    new_lines.append(f"{k}={v}")

            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "w", encoding="utf-8") as f:
                f.write("\n".join(new_lines) + "\n")
            synced_files.append(path)
        except Exception:
            pass

    return {"updated_keys": list(clean_updates.keys()), "synced_files": synced_files}


def mask_secret(val: str) -> str:
    if not val:
        return "NOT_SET"
    if len(val) <= 8:
        return "***SET***"
    return f"{val[:4]}...{val[-4:]} (len={len(val)})"


def get_gemini_key_pool() -> list[str]:
    """
    Thu thập toàn bộ danh sách khóa Gemini từ mọi biến môi trường:
    GEMINI_API_KEY, GEMINI_KEY_1..10, và GEMINI_API_KEYS_POOL (phân tách bằng dấu phẩy/xuống dòng).
    """
    load_project_env()
    candidates: list[str] = []
    for k_name in [
        "GEMINI_API_KEY",
        "GEMINI_KEY_1",
        "GEMINI_KEY_2",
        "GEMINI_KEY_3",
        "GEMINI_KEY_4",
        "GEMINI_KEY_5",
        "GEMINI_API_KEYS_POOL",
    ]:
        raw = os.environ.get(k_name, "")
        if not raw:
            continue
        for part in raw.replace("\n", ",").replace(";", ",").split(","):
            clean = part.strip().strip('"').strip("'")
            if clean and "DAN_API_KEY" not in clean and clean not in candidates:
                candidates.append(clean)
    return candidates


def add_gemini_keys_to_pool(new_keys_raw: str) -> Dict[str, Any]:
    """
    Thêm nhanh 1 hoặc nhiều khóa Gemini mới (cách nhau bởi dấu phẩy hoặc xuống dòng)
    vào đầu Pool (ưu tiên dùng khóa mới nhất trước) và lưu bền vững vào .env / .env.local.
    """
    load_project_env()
    existing = get_gemini_key_pool()
    incoming = [
        p.strip().strip('"').strip("'")
        for p in new_keys_raw.replace("\n", ",").replace(";", ",").split(",")
        if p.strip()
    ]
    if not incoming:
        return {"ok": False, "added_count": 0, "pool_size": len(existing)}

    # Đưa các khóa mới lên đầu danh sách ưu tiên
    merged: list[str] = []
    for k in incoming + existing:
        if k and k not in merged:
            merged.append(k)

    updates: Dict[str, str] = {
        "GEMINI_API_KEY": merged[0],
        "GEMINI_API_KEYS_POOL": ",".join(merged),
    }
    for idx, k in enumerate(merged[:5], start=1):
        updates[f"GEMINI_KEY_{idx}"] = k

    sync_res = update_env_variables(updates)
    return {
        "ok": True,
        "added_count": len(incoming),
        "pool_size": len(merged),
        "masked_pool": [mask_secret(k) for k in merged],
        "synced_files": sync_res["synced_files"],
    }


def get_env_inventory() -> Dict[str, Any]:
    load_project_env()
    keys_to_inspect = [
        "GEMINI_API_KEY",
        "GEMINI_KEY_1",
        "GEMINI_KEY_2",
        "GEMINI_KEY_3",
        "GEMINI_API_KEYS_POOL",
        "GEMINI_MODEL",
        "OPENAI_API_KEY",
        "OPENAI_MODEL",
        "GITHUB_TOKEN",
        "HUGGINGFACE_TOKEN",
        "NVD_API_KEY",
        "TAVILY_API_KEY",
        "OPEN_ALEX_KEY",
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_ROLE_KEY",
        "DATABASE_URL",
        "STUDENTHUB_LEGACY_VERIFICATION_BASE_URL",
        "OLLAMA_BASE_URL",
    ]
    inventory = {}
    for k in keys_to_inspect:
        v = os.environ.get(k, "")
        if k in (
            "NEXT_PUBLIC_SUPABASE_URL",
            "GEMINI_MODEL",
            "OPENAI_MODEL",
            "STUDENTHUB_LEGACY_VERIFICATION_BASE_URL",
            "OLLAMA_BASE_URL",
        ):
            inventory[k] = {"configured": bool(v), "value_preview": v or "default"}
        else:
            inventory[k] = {"configured": bool(v), "value_preview": mask_secret(v)}
    pool = get_gemini_key_pool()
    inventory["GEMINI_POOL_SUMMARY"] = {
        "configured": len(pool) > 0,
        "pool_size": len(pool),
        "value_preview": f"{len(pool)} keys in rotation pool ({', '.join(mask_secret(x) for x in pool[:3])})",
    }
    return inventory
