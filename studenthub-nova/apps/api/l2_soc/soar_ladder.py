import uuid
import time
import hashlib
from typing import Dict, Any, List, Optional


class GraduatedSOARResponder:
    """
    Skill: skill.layer2.soc_anomaly_detector@2 & skill.layer2.soar_responder@2 [Mode: R]
    Thực thi phản ứng tự động theo 5 nấc thang (Graduated Response Ladder):
      1. MONITOR (Score < 50)
      2. STEP_UP_MFA (50 <= Score < 70, TTL 600s)
      3. THROTTLE (70 <= Score < 85, TTL 300s)
      4. QUARANTINE_ACCOUNT (85 <= Score < 95 hoặc IP thuộc Campus NAT Allowlist, TTL 900s)
      5. BLOCK_IP_PENDING_APPROVAL (Score >= 95 & không thuộc IP NAT Campus, TTL 3600s, cần Admin duyệt)
    """

    CAMPUS_NAT_IPS = {"203.162.10.1", "203.162.4.190", "14.225.20.100", "127.0.0.1"}

    SIGMA_RULES = {
        "l1.prompt_injection.blocked": "SIGMA-AI-001: Direct Prompt Override / Jailbreak Attempt",
        "l1.rag_poisoning.sanitized": "SIGMA-AI-002: Indirect RAG Context Injection Detected",
        "l1.ssrf.blocked": "SIGMA-NET-004: Internal/Cloud Metadata SSRF Probe",
        "cyber_range.brute_force_campus_nat": "SIGMA-AUTH-003: High-Velocity Credential Brute-Force on Shared NAT",
        "cyber_range.rag_poisoning_wave": "SIGMA-AI-002: Multi-Vector RAG Document Poisoning Wave",
        "cyber_range.ssrf_metadata_probe": "SIGMA-NET-004: Cloud Metadata 169.254.169.254 Enumeration",
        "cyber_range.full_4layer_stress": "SIGMA-SOC-009: Coordinated Multi-Layer Red-Team Stress Wave",
        "l3.sast.critical_vulnerability": "SIGMA-SEC-005: High/Critical CWE Vulnerability in Student Code",
    }

    def __init__(self):
        self.active_responses: Dict[str, Dict[str, Any]] = {}
        self.event_stream: List[Dict[str, Any]] = []
        self.seq_counter = 1040

        # Khởi tạo 2 sự kiện mẫu chuẩn SecurityEvent v2 để giao diện SOC hiển thị ngay khi mở
        self.evaluate_and_respond(
            event_type="l1.prompt_injection.blocked",
            anomaly_score=78,
            session_id="sess_sv2026_01",
            client_ip="203.162.10.1",
            source_mode="real",
            reasons=["[Stage 2 Heuristic] Cố gắng hủy bỏ chỉ dẫn hệ thống (Instruction Override)"],
        )
        self.evaluate_and_respond(
            event_type="l1.ssrf.blocked",
            anomaly_score=88,
            session_id="sess_sv2026_09",
            client_ip="203.162.10.1",
            source_mode="real",
            reasons=["[SSRF Guard] Ngăn chặn truy vấn tới Cloud Metadata 169.254.169.254"],
        )

    def evaluate_and_respond(
        self,
        event_type: str,
        anomaly_score: int,
        session_id: str,
        client_ip: str,
        source_mode: str = "real",
        reasons: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        self.seq_counter += 1
        is_campus_nat = client_ip in self.CAMPUS_NAT_IPS
        reason_list = list(reasons or ["Vượt ngưỡng baseline hành vi người dùng (UEBA)"])

        # Quyết định nấc thang phản ứng (Graduated Ladder)
        if anomaly_score < 50:
            tier, ttl_s, needs_approval = "monitor", 0, False
        elif anomaly_score < 70:
            tier, ttl_s, needs_approval = "step_up_mfa", 600, False
        elif anomaly_score < 85:
            tier, ttl_s, needs_approval = "throttle", 300, False
        elif anomaly_score < 95 or is_campus_nat:
            # Nếu là IP NAT Ký túc xá / Trường học -> chỉ cô lập đúng Session đó (quarantine), KHÔNG khóa cả IP trường!
            tier, ttl_s, needs_approval = "quarantine", 900, False
            if is_campus_nat and anomaly_score >= 85:
                reason_list.append(
                    f"Bảo vệ IP NAT Campus ({client_ip}): Cô lập đúng Session vi phạm (TTL 900s), giữ an toàn cho 500+ sinh viên cùng mạng"
                )
        else:
            tier, ttl_s, needs_approval = "pending_human_block", 3600, True

        response_id = f"resp_{uuid.uuid4().hex[:8]}"
        session_hash = hashlib.sha256(session_id.encode("utf-8")).hexdigest()[:14]
        sigma_rule = self.SIGMA_RULES.get(event_type, "SIGMA-GEN-001: Behavioral Anomaly Threshold Exceeded")

        now_epoch = time.time()
        event_record = {
            "event_id": f"ev_{uuid.uuid4().hex[:10]}",
            "response_id": response_id,
            "seq": self.seq_counter,
            "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(now_epoch)),
            "layer": "L2",
            "source": source_mode,  # "real" hoặc "simulated"
            "type": event_type,
            "severity": (
                "critical"
                if anomaly_score >= 90
                else ("high" if anomaly_score >= 70 else ("medium" if anomaly_score >= 50 else "low"))
            ),
            "actor": {
                "session_id_hash": f"sha256:{session_hash}",
                "client_ip": client_ip,
                "is_campus_nat_ip": is_campus_nat,
            },
            "evidence": {
                "anomaly_score": anomaly_score,
                "matched_sigma_rules": [sigma_rule],
                "reasons": reason_list,
            },
            "response": tier,
            "response_ttl_s": ttl_s,
            "expires_at": round(now_epoch + ttl_s, 2) if ttl_s > 0 else 0,
            "requires_human_approval": needs_approval,
            "undone": False,
        }

        self.active_responses[response_id] = event_record
        self.event_stream.insert(0, event_record)
        # Giữ tối đa 50 sự kiện gần nhất trong bộ nhớ
        if len(self.event_stream) > 50:
            self.event_stream = self.event_stream[:50]
        return event_record

    def undo_response(self, response_id: str, analyst_role: str = "soc_analyst") -> Dict[str, Any]:
        if response_id not in self.active_responses:
            return {"ok": False, "message": "Không tìm thấy mã phản ứng cần hoàn tác"}
        record = self.active_responses[response_id]
        record["undone"] = True
        record["response"] = f"rolled_back_by_{analyst_role}"
        record["response_ttl_s"] = 0
        return {"ok": True, "record": record}

    def approve_block(self, response_id: str, admin_role: str = "soc_commander") -> Dict[str, Any]:
        if response_id not in self.active_responses:
            return {"ok": False, "message": "Không tìm thấy mã phản ứng"}
        record = self.active_responses[response_id]
        record["requires_human_approval"] = False
        record["response"] = f"approved_ip_block_by_{admin_role}"
        return {"ok": True, "record": record}
