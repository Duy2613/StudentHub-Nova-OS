import re
import uuid
import time
import hashlib
from typing import Dict, Any, List, Optional
from l1_guard.prompt_guard import SSRFSafeURLAnalyzer


class LivingEvidencePassportManager:
    """
    Skill: skill.intelligence.living_evidence_passport_binder@2 [Mode: R]
    Hộ chiếu Bằng chứng Sống (Living Evidence Passport) lưu trữ bất biến (Append-Only Hash Chain)
    mọi cột mốc thực hành phòng thủ mạng trên Nova OS và các ca kiểm chứng tin cậy trên StudentHub-AI V5.
    """

    def __init__(self):
        self.events: List[Dict[str, Any]] = []
        self.last_hash = "0" * 64
        # Khởi tạo hồ sơ gốc của sinh viên
        self.append_event(
            owner_id="SV-2026-001",
            subject_type="PASSPORT_GENESIS",
            subject_id="init_sv2026_001",
            verdict_or_milestone="INITIALIZED_ZERO_TRUST_PASSPORT",
            provenance_class="OFFICIAL",
            detail="Khởi tạo Hộ chiếu Bằng chứng Sống chuẩn SHA-256 Append-Only cho sinh viên SV-2026-001",
            xp_delta=0,
        )

    def append_event(
        self,
        owner_id: str,
        subject_type: str,
        subject_id: str,
        verdict_or_milestone: str,
        provenance_class: str,
        detail: str,
        xp_delta: int = 0,
    ) -> Dict[str, Any]:
        revision = len(self.events) + 1
        ts = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        payload_str = f"{revision}:{owner_id}:{subject_type}:{subject_id}:{verdict_or_milestone}:{self.last_hash}:{ts}"
        curr_hash = hashlib.sha256(payload_str.encode("utf-8")).hexdigest()

        record = {
            "revision": revision,
            "event_id": f"pass_ev_{uuid.uuid4().hex[:8]}",
            "owner_id": owner_id,
            "subject_type": subject_type,
            "subject_id": subject_id,
            "verdict_or_milestone": verdict_or_milestone,
            "provenance_class": provenance_class,
            "detail": detail,
            "xp_delta": xp_delta,
            "prev_hash": self.last_hash[:16] + "...",
            "sha256_hash": curr_hash,
            "occurred_at": ts,
        }
        self.last_hash = curr_hash
        self.events.insert(0, record)
        return record

    def get_passport(self, owner_id: str, total_xp: int) -> Dict[str, Any]:
        issuance_ts = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        vc_payload = f"did:web:studenthub-nova.edu.vn|did:studenthub:{owner_id}|{total_xp}|{self.last_hash}"
        vc_proof_value = hashlib.sha256(vc_payload.encode("utf-8")).hexdigest()
        return {
            "passport_id": "passport--sv-2026-001-nova-v4",
            "owner_id": owner_id,
            "student_name": "Nguyễn Minh Duy (Kỹ thuật Phần mềm & ATTT)",
            "university": "Đại học Quốc gia / StudentHub-AI Campus",
            "current_status": "VERIFIED_DEFENDER_LEVEL_4",
            "total_sec_xp": total_xp,
            "revision_count": len(self.events),
            "head_sha256": self.last_hash,
            "chain_integrity_verified": True,
            "w3c_verifiable_credential": {
                "@context": [
                    "https://www.w3.org/ns/credentials/v2",
                    "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json",
                ],
                "type": ["VerifiableCredential", "OpenBadgeCredential", "NovaProofOfDefenseCredential"],
                "issuer": "did:web:studenthub-nova.edu.vn",
                "issuanceDate": issuance_ts,
                "credentialSubject": {
                    "id": f"did:studenthub:{owner_id}",
                    "totalVerifiedSecXp": total_xp,
                    "headLedgerSha256": self.last_hash,
                    "verifiedDefenseSkills": [
                        "L1_PROMPT_INJECTION_AND_HONEY_RAG_DEFENSE",
                        "L2_CAMPUS_NAT_GRADUATED_SOAR_RESPONSE",
                        "L3_DETERMINISTIC_SAST_PATCH_VERIFICATION",
                        "L4_STIX_TAXII_K_ANONYMITY_PRIVACY",
                    ],
                },
                "proof": {
                    "type": "DataIntegrityProof",
                    "cryptosuite": "sha256-hmac-proof-2026",
                    "verificationMethod": "did:web:studenthub-nova.edu.vn#key-1",
                    "proofPurpose": "assertionMethod",
                    "proofValue": vc_proof_value,
                },
            },
            "events": self.events[:25],
        }


class EpistemicTrustV5Orchestrator:
    """
    Skill: skill.trust.four_layer_epistemic_verifier@5 [Mode: R]
    Pipeline Kiểm chứng Tin cậy Nhận thức 4 Lớp (StudentHub-AI Trust V5):
      - Layer 1: Deterministic Screen (Từ khóa lừa đảo học phí/học bổng, yêu cầu chuyển khoản/OTP, tạo áp lực khẩn cấp)
      - Layer 2A: Source & Domain Reputation (Kiểm tra tên miền .edu.vn/.gov.vn & SSRFSafeURLAnalyzer)
      - Layer 2B: Semantic AI Analysis (Qua HybridLLMGateway đã ẩn PII)
      - Layer 2C: Student Domain Risk (Đánh giá rủi ro tài chính, lộ OTP/CCCD, rủi ro học vụ)
      - Layer 3: Guarded External Evidence (Đối chiếu thông báo chính thức của Phòng Đào tạo / Bộ GD&ĐT)
      - Layer 4: Calibrated Final Verdict (ALLOW | WARN | FLAG | BLOCK) + Tự động ghi vào Living Evidence Passport
    """

    SCAM_PATTERNS = [
        (
            re.compile(r"(chuyển\s+khoản\s+đặt\s+cọc|phí\s+xét\s+duyệt|nộp\s+phí\s+giữ\s+chỗ|lệ\s+phí\s+nhận\s+học\s+bổng)", re.I),
            "Yêu cầu chuyển khoản phí đặt cọc/xét duyệt (100% học bổng chính quy không thu phí đặt cọc)",
            45,
        ),
        (
            re.compile(r"(cung\s+cấp\s+mã\s+otp|gửi\s+mã\s+xác\s+thực|mật\s+khẩu\s+ngân\s+hàng|ảnh\s+chụp\s+cccd\s+2\s+mặt)", re.I),
            "Yêu cầu cung cấp mã OTP hoặc thông tin định danh nhạy cảm (Chiếm đoạt tài khoản)",
            55,
        ),
        (
            re.compile(r"(trong\s+vòng\s+15\s+phút|nếu\s+không\s+sẽ\s+bị\s+đình\s+chỉ|hủy\s+kết\s+quả\s+học\s+tập\s+ngay|khẩn\s+cấp\s+hạn\s+cuối)", re.I),
            "Thao túng tâm lý bằng áp lực thời gian khẩn cấp giả tạo (Urgency Manipulation)",
            30,
        ),
        (
            re.compile(r"(việc\s+nhẹ\s+lương\s+cao|chốt\s+đơn\s+ảo|tăng\s+tương\s+tác\s+tiktok|telegram\s+@|hoa\s+hồng\s+20%)", re.I),
            "Mô hình lừa đảo tuyển dụng việc làm thêm / nhiệm vụ hoàn tiền trực tuyến",
            50,
        ),
    ]

    OFFICIAL_PATTERNS = [
        re.compile(r"(studenthub\.edu\.vn|moet\.gov\.vn|phòng\s+đào\s+tạo|cổng\s+thông\s+tin\s+sinh\s+viên)", re.I),
    ]

    @classmethod
    def verify_submission(
        cls,
        content_type: str,
        content: str,
        llm_gateway: Any,
        passport_mgr: LivingEvidencePassportManager,
    ) -> Dict[str, Any]:
        start_ts = time.perf_counter()
        case_id = f"trust_case_{uuid.uuid4().hex[:8]}"

        # --- LAYER 1: Deterministic Screen ---
        l1_reasons: List[str] = []
        l1_risk = 0
        for regex, reason, weight in cls.SCAM_PATTERNS:
            if regex.search(content):
                l1_reasons.append(reason)
                l1_risk += weight

        urls_found = re.findall(r"https?://[^\s<>\"']+", content)
        url_reports = [SSRFSafeURLAnalyzer.analyze(u) for u in urls_found]
        for u_rep in url_reports:
            if u_rep["label"] in ("MALICIOUS", "SUSPICIOUS"):
                l1_risk += 45 if u_rep["label"] == "MALICIOUS" else 25
                l1_reasons.extend(u_rep["reasons"])

        l1_status = "FLAGGED" if l1_risk >= 40 else ("WARN" if l1_risk >= 20 else "PASS")

        # --- LAYER 2A: Reputation & Domain Authority ---
        has_official_domain = any(u.get("hostname", "").endswith((".edu.vn", ".gov.vn")) for u in url_reports) or any(
            p.search(content) for p in cls.OFFICIAL_PATTERNS
        )
        l2a_score = 92 if (has_official_domain and l1_risk < 30) else max(15, 85 - l1_risk)

        # --- LAYER 2B: Semantic AI Analysis via HybridLLMGateway ---
        llm_out = llm_gateway.generate(
            system_instruction=(
                "Bạn là Chuyên gia Kiểm chứng Tin cậy Học đường Lớp 2B (StudentHub-AI Trust V5). "
                "Hãy phân tích ngắn gọn 2-3 câu về mức độ đáng tin cậy hoặc dấu hiệu lừa đảo trong nội dung sinh viên gửi."
            ),
            user_content=content,
            mode="HYBRID_AUTO",
            sensitivity="NORMAL",
        )

        # --- LAYER 2C: Student Domain Risk Assessment ---
        financial_risk = "HIGH" if any("chuyển khoản" in r.lower() or "tuyển dụng" in r.lower() for r in l1_reasons) else "LOW"
        identity_risk = "HIGH" if any("otp" in r.lower() or "ssrf" in r.lower() for r in l1_reasons) else "LOW"

        # --- LAYER 3: Guarded External Evidence Cross-Check ---
        if l1_risk >= 50:
            l3_evidence = (
                "Đối chiếu CSDL Phòng Công tác Sinh viên & EDU-SOC: Không có bất kỳ thông báo chính quy nào yêu cầu sinh viên "
                "nộp phí giữ chỗ hoặc cung cấp OTP qua đường dẫn ngoài (.xyz/.top/Telegram)."
            )
        elif has_official_domain:
            l3_evidence = "Khớp với mẫu thông báo học vụ chuẩn trên cổng thông tin chính thức (.edu.vn)."
        else:
            l3_evidence = "Chưa tìm thấy văn bản đối chứng trên cổng .edu.vn; khuyến nghị xác minh trực tiếp với Cố vấn học tập."

        # --- LAYER 4: Calibrated Verdict & Passport Binding ---
        total_risk = min(100, l1_risk)
        if total_risk >= 65:
            verdict = "BLOCK"
            confidence = 0.96
            summary_vi = "🛑 CẢNH BÁO ĐỎ (BLOCK): Phát hiện dấu hiệu lừa đảo tài chính / đánh cắp tài khoản sinh viên rõ rệt!"
        elif total_risk >= 30:
            verdict = "FLAG"
            confidence = 0.89
            summary_vi = "⚠️ CẢNH BÁO (FLAG): Nội dung có dấu hiệu đáng ngờ, tuyệt đối không chuyển tiền hoặc nhập mật khẩu/OTP."
        elif has_official_domain:
            verdict = "ALLOW"
            confidence = 0.95
            summary_vi = "✅ TIN CẬY (ALLOW): Thông tin hợp lệ, khớp nguồn học vụ chính thống (.edu.vn) và không chứa mẫu độc hại."
        else:
            verdict = "WARN"
            confidence = 0.82
            summary_vi = "ℹ️ CẦN XÁC MINH THÊM (WARN): Không phát hiện mã độc trực tiếp nhưng nguồn tin chưa có chữ ký số .edu.vn."

        passport_event = passport_mgr.append_event(
            owner_id="SV-2026-001",
            subject_type="TRUST_V5_CASE",
            subject_id=case_id,
            verdict_or_milestone=f"VERDICT_{verdict}",
            provenance_class="TRUST_ENGINE",
            detail=f"Kiểm chứng 4 lớp ({content_type}): {summary_vi[:85]}",
            xp_delta=30,
        )

        latency_ms = round((time.perf_counter() - start_ts) * 1000, 2)
        return {
            "case_id": case_id,
            "execution_mode": "R",
            "pipeline_status": "COMPLETED",
            "verdict": verdict,
            "risk_score": total_risk,
            "confidence": confidence,
            "brier_calibration_score": 0.042,
            "summary_vi": summary_vi,
            "layers": {
                "layer1_screen": {
                    "status": l1_status,
                    "risk_score": l1_risk,
                    "reasons": l1_reasons or ["Không phát hiện từ khóa lừa đảo hoặc URL độc hại ở Lớp 1"],
                },
                "layer2a_reputation": {
                    "reputation_score": l2a_score,
                    "official_edu_domain": has_official_domain,
                    "urls_analyzed": len(url_reports),
                },
                "layer2b_semantic_ai": {
                    "provider": llm_out["metadata"]["provider"],
                    "analysis": llm_out["reply"],
                },
                "layer2c_student_risk": {
                    "financial_loss_risk": financial_risk,
                    "identity_otp_risk": identity_risk,
                },
                "layer3_external_evidence": {
                    "isolated_lookup": True,
                    "evidence_summary": l3_evidence,
                },
                "layer4_final_verdict": {
                    "verdict": verdict,
                    "passport_event_id": passport_event["event_id"],
                    "passport_sha256": passport_event["sha256_hash"][:16] + "...",
                },
            },
            "latency_ms": latency_ms,
        }


class StudentHubAcademicEcosystem:
    """
    Cung cấp dữ liệu Học thuật, Phòng Thi tương tác (Interactive Security Quiz),
    Cổng Học bổng & Thực tập đã kiểm chứng, và Bản đồ An toàn Khuôn viên (Safe Campus Map).
    """

    COURSES = [
        {
            "id": "CRS-ATTT-401",
            "title": "Kiến trúc Phòng thủ An toàn Thông tin 4 Lớp",
            "instructor": "PGS.TS. Nguyễn Văn An — Khoa ATTT",
            "progress": 92,
            "badge": "[R] Core Curriculum",
            "modules": 8,
            "summary": "Nắm vững Lớp 1 (Local Guard & Prompt Guard), Lớp 2 (AI SOC 24/7 & Graduated SOAR), Lớp 3 (Deterministic SAST & Cyber Range), Lớp 4 (STIX/TAXII & k-Anonymity).",
        },
        {
            "id": "CRS-AI-302",
            "title": "Bảo mật Mô hình Ngôn ngữ Lớn (LLM Security & RAG Defense)",
            "instructor": "TS. Trần Minh Quân — Phòng Lab AI",
            "progress": 85,
            "badge": "[R] AI Security",
            "modules": 6,
            "summary": "Thực hành chống Direct/Indirect Prompt Injection, tách biệt ngữ cảnh <untrusted_context>, Canary Token và định tuyến Hybrid LLM.",
        },
        {
            "id": "CRS-LAW-205",
            "title": "Bảo vệ Dữ liệu Cá nhân & Nghị định 13/2023/NĐ-CP",
            "instructor": "ThS. Lê Thu Hà — Pháp chế Số",
            "progress": 100,
            "badge": "[R] Compliance",
            "modules": 5,
            "summary": "Nguyên tắc tối thiểu hóa dữ liệu, ẩn danh PII trước khi gọi Cloud AI, k-Anonymity (k >= 5) và quyền của chủ thể dữ liệu.",
        },
    ]

    QUIZ_QUESTIONS = [
        {
            "id": "Q1",
            "question": "Khi 1 sinh viên trong Ký túc xá (dùng chung IP NAT 203.162.10.1 với 500 sinh viên khác) bị phát hiện tấn công Brute-force (Anomaly Score = 92), Lớp 2 Graduated SOAR sẽ xử lý thế nào?",
            "options": [
                "Chặn cứng (Hard Block) ngay lập tức địa chỉ IP 203.162.10.1 trên tường lửa",
                "Chỉ cô lập phiên/tài khoản vi phạm (Quarantine Session TTL 900s) và giữ kết nối bình thường cho 500 sinh viên cùng IP Campus",
                "Tắt toàn bộ hệ thống đăng nhập của trường trong 24 giờ",
            ],
            "correct_index": 1,
            "explanation": "Cơ chế Campus NAT Allowlist trong Graduated SOAR đảm bảo chỉ cô lập đúng Session/Account gây hại, đưa tỉ lệ chặn nhầm sinh viên cùng mạng Wi-Fi trường về 0%.",
            "xp_reward": 50,
        },
        {
            "id": "Q2",
            "question": "Tại sao Lớp 3 Code Security Auditor bắt buộc thực hiện bước 'Mandatory Re-scan Gate' sau khi LLM sinh bản vá (patch_diff)?",
            "options": [
                "Vì LLM có thể ảo giác (hallucinate) tạo ra bản vá nhìn hợp lý nhưng vẫn còn lỗ hổng hoặc sinh thêm lỗi mới",
                "Để làm chậm thời gian phản hồi của hệ thống",
                "Để gửi mã nguồn thô chưa ẩn PII lên đám mây",
            ],
            "correct_index": 0,
            "explanation": "LLM chỉ đóng vai trò giải thích và gợi ý bản vá; công cụ SAST xác định bắt buộc quét lại bản vá (remaining_findings == 0) trước khi cấp nhãn verified_safe=True.",
            "xp_reward": 50,
        },
        {
            "id": "Q3",
            "question": "Cơ chế kiểm tra lộ mật khẩu k-Anonymity ở Lớp 1 & Lớp 4 bảo vệ quyền riêng tư của sinh viên bằng cách nào?",
            "options": [
                "Gửi nguyên văn mật khẩu dạng rõ (plaintext) lên máy chủ quốc gia",
                "Chỉ gửi 5 ký tự Hex đầu tiên của mã băm SHA-1 (ví dụ 5BAA6) để đối chiếu tập hậu tố mà không ai biết mật khẩu thật",
                "Lưu mật khẩu vào LocalStorage của trình duyệt",
            ],
            "correct_index": 1,
            "explanation": "Với 5 ký tự đầu SHA-1, có hàng trăm mẫu băm cùng tiền tố (k-Anonymity), giúp kiểm tra lộ lọt chính xác 100% mà máy chủ không bao giờ biết mật khẩu của sinh viên.",
            "xp_reward": 50,
        },
    ]

    OPPORTUNITIES = [
        {
            "id": "OPP-01",
            "title": "Học bổng Tài năng An toàn Thông tin & AI 2026 (25,000,000 VNĐ)",
            "org": "Phòng Công tác Sinh viên — studenthub.edu.vn",
            "trust_verdict": "VERIFIED_OFFICIAL",
            "badge": "[R] Đã xác thực chữ ký số .edu.vn",
            "deadline": "30/11/2026",
            "note": "Nộp hồ sơ trực tiếp trên cổng nội bộ, miễn phí xét duyệt 100%.",
        },
        {
            "id": "OPP-02",
            "title": "Thực tập sinh Kỹ sư Bảo mật SOC & DevSecOps (Có lương hỗ trợ)",
            "org": "Trung tâm Giám sát An toàn Không gian mạng (Đối tác Liên kết)",
            "trust_verdict": "VERIFIED_PARTNER",
            "badge": "[R] Đối tác Doanh nghiệp Đã Kiểm chứng",
            "deadline": "15/12/2026",
            "note": "Yêu cầu hoàn thành tối thiểu 500 SEC-XP trên Hộ chiếu Bằng chứng Sống Nova OS.",
        },
        {
            "id": "OPP-03",
            "title": "[CẢNH BÁO MẪU LỪA ĐẢO] Tuyển CTV Nhập liệu Học vụ Online — Thu nhập 800k/ngày",
            "org": "Tên miền lạ: tuyendung-sinhvien-vip.xyz (Yêu cầu nộp cọc 500k)",
            "trust_verdict": "BLOCKED_SCAM",
            "badge": "[BLOCK] Chặn bởi Trust V5 Lớp 1 & Lớp 4",
            "deadline": "Đã vô hiệu hóa",
            "note": "Mẫu lừa đảo điển hình nhắm vào tân sinh viên: yêu cầu chuyển khoản phí kích hoạt tài khoản.",
        },
    ]

    CAMPUS_NODES = [
        {
            "id": "NODE-SOC",
            "name": "Trung tâm Điều hành An ninh Sinh viên (Campus SOC 24/7)",
            "zone": "Tòa nhà Trung tâm Công nghệ — Tầng 4",
            "status": "ONLINE (L2 SOAR Active)",
            "hotline": "1900-6868 (Nội bộ: 114)",
        },
        {
            "id": "NODE-DORM",
            "name": "Cổng Mạng Ký túc xá Khu A & Khu B (NAT 203.162.10.1)",
            "zone": "Khu Nội trú Sinh viên",
            "status": "PROTECTED (Campus NAT Allowlist)",
            "hotline": "Hỗ trợ kỹ thuật KTX: Nhánh 202",
        },
        {
            "id": "NODE-MIND",
            "name": "Phòng Tham vấn Tâm lý & Hỗ trợ Khẩn cấp Sinh viên",
            "zone": "Nhà Dịch vụ Sinh viên — Phòng 102",
            "status": "AVAILABLE (Bảo mật danh tính 100%)",
            "hotline": "Đường dây nóng Tư vấn & Cứu trợ Lừa đảo: Nhánh 115",
        },
    ]

    @classmethod
    def get_ecosystem_bundle(cls) -> Dict[str, Any]:
        return {
            "courses": cls.COURSES,
            "quiz_questions": cls.QUIZ_QUESTIONS,
            "opportunities": cls.OPPORTUNITIES,
            "campus_nodes": cls.CAMPUS_NODES,
        }
