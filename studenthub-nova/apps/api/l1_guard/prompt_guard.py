import unicodedata
import re
import base64
import ipaddress
import urllib.parse
import socket
import time
from typing import List, Dict, Any, Optional


class MultiStagePromptGuard:
    """
    Skill: skill.layer1.prompt_guard@2 [Mode: R - Thật 100% ở Server]
    Bảo vệ cả Direct Injection (từ khung chat) và Indirect Injection (ẩn trong tài liệu RAG).
    Hỗ trợ bật/tắt từng tầng (Ablation Study - RQ1):
      - Stage 1 (normalize): Chuẩn hóa Unicode NFKC, xóa ký tự ẩn Zero-width, giải mã Base64 payload ẩn
      - Stage 2 (heuristic): Tập luật Regex đa ngôn ngữ Việt - Anh tốc độ cao (< 5ms)
      - Stage 3 (semantic): Phân loại ngữ nghĩa & ngữ cảnh học thuật (chống False Positive cho câu hỏi môn học CNTT)
      - Stage 4 (context_isolation): Lọc RAG chunks độc hại & bọc trong thẻ <untrusted_context>
      - Stage 5 (canary): Bơm mã bẫy Canary Token và kiểm tra rò rỉ đầu ra
    """

    # Các mẫu tấn công trực tiếp & gián tiếp (Direct & Indirect Injection)
    INJECTION_PATTERNS = [
        (
            re.compile(r"ignore\s+(all\s+)?(previous|prior|above|system)\s+(instructions|prompts|rules)", re.I),
            "Cố gắng hủy bỏ chỉ dẫn hệ thống (Instruction Override)",
            75,
        ),
        (
            re.compile(r"(disregard|forget)\s+(everything|all\s+(prior\s+|previous\s+)?(instructions|rules|prompts)|your\s+rules)", re.I),
            "Lệnh xóa bỏ quy tắc bảo mật hệ thống (Rule Disregard)",
            72,
        ),
        (
            re.compile(r"(reveal|show|print|output|repeat|leak)\s+(your\s+|the\s+)?(hidden\s+)?(system\s+prompt|hidden\s+instructions|canary(\s+token)?|secret\s+key|initial\s+prompt)", re.I),
            "Dò hỏi System Prompt / Canary Token (System Prompt Exfiltration)",
            80,
        ),
        (
            re.compile(r"(bỏ\s+qua\s+(mọi|tất\s+cả)\s+(quy\s+tắc|hướng\s+dẫn|chỉ\s+thị)|tiết\s+lộ\s+system\s+prompt|in\s+ra\s+mã\s+canary)", re.I),
            "Tấn công chiếm quyền điều khiển tiếng Việt (Vietnamese Instruction Override)",
            78,
        ),
        (
            re.compile(r"(hãy\s+đóng\s+vai\s+DAN|do\s+anything\s+now|jailbreak|developer\s+mode\s+enabled|god\s+mode|unrestricted\s+ai)", re.I),
            "Kỹ thuật Jailbreak / Giả mạo chế độ nhà phát triển (DAN / Developer Mode)",
            82,
        ),
        (
            re.compile(r"<\s*/?\s*(untrusted_context|system_instruction|system_prompt)\s*>", re.I),
            "Cố tình đóng mở thẻ thoát ngữ cảnh RAG (XML Delimiter Escape)",
            85,
        ),
        (
            re.compile(r"(IMPORTANT\s+SYSTEM\s+UPDATE|ADMIN\s+OVERRIDE|SYSTEM\s+NOTE\s*:.*ignore)", re.I),
            "Giả mạo thông báo quản trị viên trong ngữ cảnh (Fake System Authority)",
            74,
        ),
    ]

    # Ngữ cảnh học thuật lành tính (giúp giảm False Positive khi sinh viên hỏi bài môn CSDL / HĐH / ATTT)
    BENIGN_ACADEMIC_CONTEXT_RE = re.compile(
        r"(giải\s+thích|ví\s+dụ|cú\s+pháp|trong\s+môn|bài\s+tập|câu\s+lệnh\s+sql|làm\s+sao\s+để\s+phòng\s+chống|cách\s+vá\s+lỗi|khái\s+niệm)",
        re.I,
    )

    SEMANTIC_INTENT_KEYWORDS = [
        ("sudo_escalation", re.compile(r"(act\s+as\s+root|bypass\s+authentication|grant\s+admin\s+access|cấp\s+quyền\s+admin)", re.I), 45),
        ("data_exfiltration", re.compile(r"(dump\s+all\s+student|xất\s+toàn\s+bộ\s+danh\s+sách\s+mật\s+khẩu|send\s+to\s+http)", re.I), 55),
        ("prompt_stealing", re.compile(r"(what\s+were\s+you\s+told\s+before\s+this|verbatim\s+system\s+message)", re.I), 65),
    ]

    BASE64_CANDIDATE_RE = re.compile(r"(?:[A-Za-z0-9+/]{4}){5,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?")

    # Bảng ánh xạ ký tự đồng hình (Cyrillic/Greek Homoglyphs -> ASCII)
    HOMOGLYPH_MAP = str.maketrans({
        "а": "a", "е": "e", "і": "i", "о": "o", "р": "p", "с": "c", "у": "y", "х": "x",
        "А": "A", "Е": "E", "І": "I", "О": "O", "Р": "P", "С": "C", "У": "Y", "Х": "X",
    })

    @classmethod
    def normalize_text(cls, text: str) -> tuple[str, List[str]]:
        """
        Tầng 1: Chuẩn hóa Unicode NFKC, khử Homoglyph, xóa ký tự Zero-width và giải mã Base64 ẩn.
        """
        notes: List[str] = []
        # Xóa ký tự ẩn Zero-width
        cleaned = re.sub(r"[\u200b\u200c\u200d\u2060\ufeff]", "", text)
        if len(cleaned) != len(text):
            notes.append("[Stage 1 Normalize] Đã loại bỏ ký tự ẩn Zero-Width Evasion")

        # Khử ký tự đồng hình Cyrillic/Greek
        dehomoglyphed = cleaned.translate(cls.HOMOGLYPH_MAP)
        if dehomoglyphed != cleaned:
            notes.append("[Stage 1 Normalize] Đã chuẩn hóa ký tự đồng hình (Homoglyph Normalization)")

        normalized = unicodedata.normalize("NFKC", dehomoglyphed)

        # Kiểm tra và giải mã Base64 payload ẩn
        for match in cls.BASE64_CANDIDATE_RE.findall(normalized):
            if len(match) >= 24:
                try:
                    decoded = base64.b64decode(match).decode("utf-8", errors="ignore")
                    if any(w in decoded.lower() for w in ("ignore", "system", "prompt", "canary", "jailbreak", "override")):
                        normalized += f" [DECODED_BASE64_PAYLOAD: {decoded}]"
                        notes.append("[Stage 1 Normalize] Giải mã payload ẩn Base64 chứa chỉ thị điều khiển")
                except Exception:
                    pass

        return normalized, notes

    @classmethod
    def inspect_and_wrap(
        cls,
        user_prompt: str,
        rag_chunks: List[str],
        active_stages: Optional[Dict[str, bool]] = None,
    ) -> Dict[str, Any]:
        start_ts = time.perf_counter()
        stages = {
            "normalize": True,
            "heuristic": True,
            "semantic": True,
            "context_isolation": True,
            "canary": True,
        }
        if active_stages:
            stages.update(active_stages)

        reasons: List[str] = []
        risk_score = 0
        triggered_stage = "none"

        # Tầng 1: Normalize
        if stages["normalize"]:
            clean_prompt, norm_notes = cls.normalize_text(user_prompt)
            reasons.extend(norm_notes)
            if norm_notes:
                risk_score += 15
        else:
            clean_prompt = user_prompt

        # Tầng 2: Heuristic Direct Injection Scan
        if stages["heuristic"]:
            for regex, reason, weight in cls.INJECTION_PATTERNS:
                if regex.search(clean_prompt):
                    reasons.append(f"[Stage 2 Heuristic - Direct] {reason}")
                    risk_score += weight
                    triggered_stage = "STAGE_1_HEURISTIC"

        # Tầng 3: Semantic Intent & Academic Context Calibration
        if stages["semantic"]:
            for intent_name, regex, weight in cls.SEMANTIC_INTENT_KEYWORDS:
                if regex.search(clean_prompt):
                    reasons.append(f"[Stage 3 Semantic] Phát hiện ý định nhạy cảm ({intent_name})")
                    risk_score += weight
                    if triggered_stage == "none":
                        triggered_stage = "STAGE_2_SEMANTIC"

            # Giảm điểm cảnh báo giả nếu câu hỏi mang tính học thuật rõ ràng và không cố trích xuất prompt/canary
            if (
                cls.BENIGN_ACADEMIC_CONTEXT_RE.search(clean_prompt)
                and risk_score < 70
                and "canary" not in clean_prompt.lower()
                and "system prompt" not in clean_prompt.lower()
            ):
                risk_score = max(0, risk_score - 30)

        if risk_score >= 60:
            latency_ms = round((time.perf_counter() - start_ts) * 1000, 3)
            return {
                "allowed": False,
                "action": "BLOCK",
                "risk_score": min(100, risk_score),
                "triggered_stage": triggered_stage,
                "sanitized_prompt": "",
                "isolated_rag_xml": "",
                "active_stages": stages,
                "latency_ms": latency_ms,
                "reasons": reasons,
            }

        # Tầng 4: RAG Context Isolation & Indirect Injection Sanitizer
        safe_chunks: List[str] = []
        if stages["context_isolation"]:
            for idx, chunk in enumerate(rag_chunks):
                clean_chunk, _ = cls.normalize_text(chunk) if stages["normalize"] else (chunk, [])
                chunk_flagged = False
                for regex, reason, _weight in cls.INJECTION_PATTERNS:
                    if regex.search(clean_chunk):
                        reasons.append(
                            f"[Stage 4 RAG Sanitizer - Chunk #{idx+1}] {reason} -> Đã cắt bỏ đoạn tài liệu nhiễm độc"
                        )
                        risk_score = max(risk_score, 38)
                        triggered_stage = "STAGE_3_RAG_INJECTION"
                        chunk_flagged = True
                if not chunk_flagged:
                    safe_chunks.append(clean_chunk)
            wrapped_context = "\n".join(
                f'<untrusted_context doc_id="chunk_{i+1}">{c}</untrusted_context>'
                for i, c in enumerate(safe_chunks)
            )
        else:
            # Khi tắt context_isolation trong Ablation Study -> ghép thẳng RAG chunks (dễ bị Indirect Injection)
            safe_chunks = list(rag_chunks)
            wrapped_context = "\n".join(safe_chunks)

        final_prompt = f"Ngữ cảnh học liệu:\n{wrapped_context}\n\nCâu hỏi sinh viên: {clean_prompt}"
        latency_ms = round((time.perf_counter() - start_ts) * 1000, 3)

        return {
            "allowed": True,
            "action": "SANITIZE" if reasons else "ALLOW",
            "risk_score": min(100, risk_score),
            "triggered_stage": triggered_stage,
            "sanitized_prompt": final_prompt,
            "isolated_rag_xml": wrapped_context,
            "active_stages": stages,
            "latency_ms": latency_ms,
            "reasons": reasons,
        }


class SSRFSafeURLAnalyzer:
    """
    Skill: skill.layer1.phishing_and_url_analyzer@2 [Mode: R]
    Chặn đứng vector tấn công SSRF vào IP nội bộ / Cloud Metadata và chấm điểm Phishing có giải thích.
    """
    SUSPICIOUS_TLDS = (".xyz", ".top", ".click", ".zip", ".loan", ".tk", ".gq", ".cf")
    PHISHING_KEYWORDS = (
        "login-verify",
        "free-scholarship",
        "reset-studenthub",
        "nhanthuong",
        "xacthuc-tai-khoan",
        "hocbong-khan",
        "nop-phi-xac-nhan",
        "unlock-account",
    )
    TRUSTED_EDU_DOMAINS = ("studenthub.edu.vn", "moet.gov.vn", "hust.edu.vn", "vnuhcm.edu.vn", "vnu.edu.vn")

    @classmethod
    def analyze(cls, url: str) -> Dict[str, Any]:
        start_ts = time.perf_counter()
        try:
            raw_url = url.strip()
            parsed = urllib.parse.urlparse(raw_url)
            if parsed.scheme not in ("http", "https") or not parsed.hostname:
                return {
                    "score": 60,
                    "label": "UNKNOWN",
                    "verdict": "INVALID_SCHEME",
                    "reasons": ["Định dạng URL không hợp lệ hoặc sử dụng giao thức bị cấm (chỉ cho phép http/https)"],
                    "confidence": 1.0,
                }

            hostname = parsed.hostname.lower()

            # Kiểm tra localhost / loopback trực tiếp theo tên
            if hostname in ("localhost", "localhost.localdomain", "0.0.0.0", "[::1]", "::1"):
                return {
                    "score": 100,
                    "label": "MALICIOUS",
                    "verdict": "SSRF_BLOCKED",
                    "ssrf_blocked_range": "LOOPBACK",
                    "reasons": [f"🛑 [SSRF BLOCKED]: Tên miền ({hostname}) trỏ trực tiếp về dịch vụ nội bộ Loopback"],
                    "confidence": 1.0,
                }

            # Chống SSRF: Phân giải IP và kiểm tra Private / Loopback / Link-local (169.254.169.254)
            try:
                ip_str = socket.gethostbyname(hostname)
                ip_obj = ipaddress.ip_address(ip_str)
                if ip_obj.is_loopback or ip_obj.is_private or ip_obj.is_link_local or ip_obj.is_reserved:
                    range_type = (
                        "LINK_LOCAL_METADATA"
                        if str(ip_obj).startswith("169.254.")
                        else ("LOOPBACK" if ip_obj.is_loopback else "RFC1918_PRIVATE")
                    )
                    return {
                        "score": 100,
                        "label": "MALICIOUS",
                        "verdict": "SSRF_BLOCKED",
                        "ssrf_blocked_range": range_type,
                        "reasons": [
                            f"🛑 [SSRF BLOCKED]: Tên miền trỏ về IP nội bộ/đặc quyền ({ip_str} - {range_type})"
                        ],
                        "confidence": 1.0,
                    }
            except socket.gaierror:
                pass

            score = 5
            reasons: List[str] = []

            if "xn--" in hostname:
                score += 60
                reasons.append("Phát hiện tên miền đồng hình Punycode (IDN Homograph Attack)")

            if hostname.endswith(cls.SUSPICIOUS_TLDS):
                score += 35
                reasons.append(f"Sử dụng đuôi tên miền rủi ro cao (.{hostname.split('.')[-1]})")

            # Phát hiện giả mạo thương hiệu trường đại học nhưng không thuộc .edu.vn
            if any(brand in hostname for brand in ("studenthub", "daotao", "sinhvien", "hocbong")) and not hostname.endswith((".edu.vn", ".gov.vn")):
                score += 35
                reasons.append("Tên miền chứa từ khóa học vụ nhưng không thuộc tên miền giáo dục chính thống (.edu.vn)")

            for kw in cls.PHISHING_KEYWORDS:
                if kw in raw_url.lower():
                    score += 45
                    reasons.append(f"Chứa từ khóa mồi nhử đánh cắp thông tin/lừa đảo ('{kw}')")

            if parsed.scheme == "http" and not hostname.endswith(".edu.vn"):
                score += 15
                reasons.append("Kết nối HTTP không mã hóa TLS")

            if hostname in cls.TRUSTED_EDU_DOMAINS or hostname.endswith(".edu.vn"):
                score = max(3, score - 20)
                if not reasons:
                    reasons.append("Tên miền giáo dục chính thống (.edu.vn) đã xác thực")

            score = min(100, score)
            label = "MALICIOUS" if score >= 70 else ("SUSPICIOUS" if score >= 35 else "SAFE")
            if not reasons:
                reasons.append("Không phát hiện dấu hiệu giả mạo hoặc trỏ IP nội bộ")

            latency_ms = round((time.perf_counter() - start_ts) * 1000, 2)
            return {
                "score": score,
                "label": label,
                "verdict": label,
                "hostname": hostname,
                "reasons": reasons,
                "confidence": 0.94,
                "latency_ms": latency_ms,
            }
        except Exception:
            # Fail-closed: Không bao giờ mặc định trả về SAFE khi gặp lỗi
            return {
                "score": 60,
                "label": "UNKNOWN",
                "verdict": "UNKNOWN",
                "reasons": ["Không thể phân tích an toàn URL này (Fail-Closed)"],
                "confidence": 0.0,
            }


class EndpointHygieneInspector:
    """
    Skill: skill.layer1.endpoint_hygiene_inspector@2 [Mode: H]
    Đánh giá vệ sinh bảo mật phiên trình duyệt và kiểm tra rò rỉ mật khẩu bằng k-Anonymity (SHA-1 5 ký tự đầu).
    """

    # Kho mẫu mã băm SHA-1 (5 ký tự đầu -> danh sách hậu tố bị lộ và số lần xuất hiện trong các vụ lộ dữ liệu lớn)
    KNOWN_BREACHED_PREFIXES = {
        "5BAA6": [("1E4C9B93F3F0682250B6CF8331B7EE68FD8", 3842190, "password")],
        "7C4A8": [("D09CA3762AF61E59520943DC26494F8941B", 2510420, "123456")],
        "F7C3B": [("C1D808E04732ADF679965CCC34CA7AE3441", 894120, "123456789")],
        "8CB22": [("37D0679CA88DB6464EAC60DA96345513964", 612500, "12345")],
        "B1B37": [("73A05C0ED0176787A4F1574FF0075F7521E", 142300, "qwerty")],
    }

    @classmethod
    def inspect(
        cls,
        user_id: str,
        mfa_enabled: bool = True,
        https_secure: bool = True,
        webcrypto_available: bool = True,
        sha1_prefix5: Optional[str] = None,
    ) -> Dict[str, Any]:
        prefix = (sha1_prefix5 or "5BAA6").strip().upper()[:5]
        breaches = cls.KNOWN_BREACHED_PREFIXES.get(prefix, [])
        breach_count = breaches[0][1] if breaches else 0

        score = 100
        recommendations: List[str] = []

        if not mfa_enabled:
            score -= 35
            recommendations.append("Bật xác thực đa yếu tố (MFA TOTP / Passkey FIDO2) cho tài khoản sinh viên")
        if not https_secure:
            score -= 25
            recommendations.append("Chuyển sang kết nối HTTPS/TLS 1.3 an toàn")
        if breach_count > 0:
            score -= 40
            recommendations.append(
                f"Mật khẩu có tiền tố SHA-1 [{prefix}***] trùng khớp {breach_count:,} bản ghi lộ lọt công khai -> Cần đổi ngay!"
            )

        if not recommendations:
            recommendations.append("Phiên trình duyệt đạt chuẩn Zero-Trust Endpoint Hygiene")

        status = "HARDENED" if score >= 85 else ("NEEDS_ATTENTION" if score >= 55 else "AT_RISK")
        return {
            "execution_mode": "H",
            "user_id": user_id,
            "hygiene_score": max(0, score),
            "posture_status": status,
            "k_anonymity_check": {
                "prefix_queried": prefix,
                "plaintext_never_sent": True,
                "matching_suffixes_count": len(breaches),
                "estimated_breach_exposures": breach_count,
            },
            "checks": {
                "mfa_totp_enabled": mfa_enabled,
                "https_secure_context": https_secure,
                "webcrypto_available": webcrypto_available,
                "password_breach_detected": breach_count > 0,
            },
            "recommended_actions": recommendations,
        }
