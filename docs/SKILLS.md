# SYSTEM & AI SKILLS CONTRACTS v4.0 (`SKILLS.md` — INTERNATIONAL 28-SKILL MASTER REGISTRY)
> **Hệ thống:** `StudentHub-AI (V5 Core) × Nova OS (ATTT 4 Lớp Server-Authoritative & Active Deception)`
> **Phiên bản:** `4.0.0-InternationalEdition` | **Tổng số Hợp đồng Kỹ năng (Skills):** 28 Skills chuẩn hóa (16 Core v3.0 + 12 Creative & International v4.0)
> **Nguyên tắc Bất biến (Zero-Trust Skill Invariants v4.0):**
> 1. **Ủy quyền Trước Thực thi (Pre-Execution PDP & Tool Firewall Gate):** Mọi Skill bắt buộc đi qua `skill.platform.security_fabric_pdp@3` và (nếu do AI Agent gọi) phải qua `skill.layer1.agentic_tool_firewall@1`.
> 2. **Thất bại An toàn (`Fail-Closed / Never Default Safe`):** Khi bất kỳ tầng kiểm tra, mạng hoặc mô hình AI nào gặp lỗi/timeout, Skill bắt buộc trả về `BLOCK`, `QUARANTINE` hoặc `UNKNOWN` — tuyệt đối không bao giờ tự động trả về `ALLOW` hay `SAFE`.
> 3. **Không Ghi Nhật ký Nội dung Nhạy cảm (`Zero-Prompt / Zero-Secret Logging`):** Chỉ ghi metadata (`request_id`, `correlation_id`, `latency_ms`, `tokens`, `provider`, `triggered_stage`). Mọi dữ liệu cá nhân phải đi qua `PIIRedactor` (Nghị định 13/2023/NĐ-CP) trước khi chạm tới LLM.
> 4. **Gắn Nhãn Minh bạch (`[R]` Thật / `[H]` Lai / `[S]` Mô phỏng) & Chuẩn Quốc tế:** Mọi Skill đều định nghĩa rõ `execution_mode`, `horizon` (`H0`..`H3`) và `compliance_mapping` (`OWASP LLM Top 10 2025`, `MITRE ATLAS`, `NIST AI RMF 1.0`, `Decree 13/2023/NĐ-CP`).

---

## BẢNG TỔNG HỢP 28 HỢP ĐỒNG KỸ NĂNG HỆ THỐNG (`v4.0 REGISTRY MAP`)

| STT | Skill ID | Nhãn | Tầm nhìn | Lớp / Phân hệ | Ý tưởng Sáng tạo & Chức năng Cốt lõi |
| :-: | :--- | :-: | :-: | :--- | :--- |
| **01** | `skill.layer1.prompt_guard@3` | `[R]` | `H0` | Lớp 1 (Local Guard) | Bộ lọc 4 tầng chống Direct/Indirect RAG Prompt Injection (có công tắc Ablation RQ1) |
| **02** | `skill.layer1.phishing_and_url_analyzer@3` | `[R]` | `H0` | Lớp 1 (Local Guard) | Chống SSRF (`RFC1918`/`169.254.169.254`) & phát hiện Punycode/IDN Homograph `.edu.vn` |
| **03** | `skill.layer1.endpoint_hygiene_inspector@3` | `[H]` | `H0` | Lớp 1 (Local Guard) | Kiểm định vệ sinh phiên, MFA TOTP & kiểm tra lộ mật khẩu `k-Anonymity` |
| **04** | `skill.layer1.honey_rag_trap@1` | `[R]` | `H1` | Lớp 1 → Lớp 2 | **Ý tưởng A1:** Tài liệu mồi `Honey-RAG` gắn khóa mật mã truy vết nguồn khai thác RAG |
| **05** | `skill.layer1.agentic_tool_firewall@1` | `[R]` | `H3` | Lớp 1 (Agent Security) | **Ý tưởng F2:** Tường lửa kiểm soát đồ thị hành động (`Action-Graph`) của AI Agent |
| **06** | `skill.layer2.soc_anomaly_detector@3` | `[H]` | `H0` | Lớp 2 (24/7 AI SOC) | Chuẩn hóa `SecurityEvent v2`, khớp luật Sigma & chấm điểm dị thường UEBA |
| **07** | `skill.layer2.soar_responder@3` | `[R]` | `H0` | Lớp 2 (24/7 AI SOC) | Phản ứng tự động theo nấc thang + Bảo vệ IP Campus NAT + `TTL` + `1-Click Undo` (RQ2) |
| **08** | `skill.layer2.adaptive_tarpit@1` | `[R]` | `H1` | Lớp 2 (24/7 AI SOC) | **Ý tưởng A4:** Làm chậm lũy tiến (`200ms → 2500ms`) & phản hồi mồi cho phiên đáng ngờ |
| **09** | `skill.layer3.code_security_auditor@3` | `[R]` | `H0` | Lớp 3 (Audit & Pentest) | Quét SAST xác định + `HybridLLM` Patch Diff + Mandatory Re-scan + AST/Unit-Test Gate (RQ3) |
| **10** | `skill.layer3.canary_credential_injector@1` | `[R]` | `H1` | Lớp 3 → Lớp 2 | **Ý tưởng A2:** Cấp khóa API giả có theo dõi (`Canary Credentials`) để phát hiện lộ repo đồ án |
| **11** | `skill.layer3.cyber_range_simulator@3` | `[S]` | `H0` | Lớp 3 (Audit & Pentest) | Phát kịch bản tấn công mẫu cô lập vào pipeline Lớp 1–2 kèm nút `Emergency Stop` |
| **12** | `skill.layer4.threat_intel_synchronizer@3` | `[H]` | `H0` | Lớp 4 (National Sync) | Đồng bộ IOC `STIX 2.1`, tra cứu `k-Anonymity` ($k \ge 5$) & kiểm duyệt xuất TLP |
| **13** | `skill.trust.four_layer_epistemic_verifier@5` | `[R]` | `H0` | Trust V5 Core | Pipeline kiểm chứng tin cậy nhận thức 4 lớp (`OwnBackendTrustOrchestrator`) |
| **14** | `skill.platform.hybrid_llm_gateway@3` | `[R]` | `H0` | Core Infrastructure | Cổng định tuyến AI lai (`Gemini 2.5 Flash` + `OpenAI` + `Ollama Local` + `PIIRedactor`) |
| **15** | `skill.studenthub.academic_copilot@3` | `[R]` | `H0` | StudentHub Core | Trợ lý học tập RAG có trích dẫn nguồn học liệu & bọc `<untrusted_context>` |
| **16** | `skill.intelligence.living_evidence_passport_binder@3` | `[R]` | `H2` | Evidence & Credentials | **Ý tưởng E2:** `Living Evidence Passport` + Xuất chứng chỉ ký số **W3C Verifiable Credentials 2.0** |
| **17** | `skill.platform.security_fabric_pdp@3` | `[R]` | `H0` | Core Infrastructure | Mặt phẳng kiểm soát Zero-Trust (`SecurityFabric` + Localhost/Admin-Token Key Guard) |
| **18** | `skill.platform.xp_ledger@3` | `[R]` | `H0` | Core Infrastructure | Sổ cái điểm `SEC-XP` bất biến phía Server có `Idempotency-Key` & lưu trữ Supabase RLS |
| **19** | `skill.flywheel.prompt_injection_league@1` | `[R]` | `H2` | Data Flywheel | **Ý tưởng B1/B2/B3:** Giải đấu `Prompt Injection League` & thu thập mẫu `ViPI-Bench` có IRB Consent |
| **20** | `skill.forecast.scam_weather_engine@1` | `[H]` | `H2` | Collective Intelligence | **Ý tưởng D1/D4:** Dự báo thời tiết lừa đảo theo lịch học vụ & gom cụm chiến dịch (`Campaign Clustering`) |
| **21** | `skill.analytics.vulnerability_genome@1` | `[R]` | `H2` | Collective Intelligence | **Ý tưởng D2:** Bản đồ gen lỗ hổng đồ án (`Vulnerability Genome`) theo môn học & khóa |
| **22** | `skill.ecosystem.zalo_shield_bot@1` | `[H]` | `H2` | Ecosystem Channels | **Ý tưởng E1/E4:** Bot Zalo kiểm tra lừa đảo trong 3 giây & `Browser Link Guardian` |
| **23** | `skill.ui.zero_scrollytelling_compositor@4` | `[R]` | `H0` | Visual Engine 120FPS | Động cơ Scrollytelling 5 tầng 120FPS + `CinematicTransitionDirector` + `Work Mode` (`C6`) |
| **24** | `skill.ui.nova_os_desktop_environment@4` | `[R]` | `H0` | Spatial Web OS | Hệ điều hành ảo `Nova OS` 6 ứng dụng kèm huy hiệu `[R]`/`[H]`/`[S]` |
| **25** | `skill.edu.soc_time_travel_replay@1` | `[R]` | `H1` | Pedagogical Replay | **Ý tưởng C1/C2:** Tua ngược/xuôi dòng thời gian sự cố SOC bằng thanh cuộn 120FPS |
| **26** | `skill.edu.teachable_block_coach@1` | `[R]` | `H1` | Pedagogical Coach | **Ý tưởng C4:** Giải thích kỹ thuật tấn công tức thì & mở bài lab 2 phút ngay khi bị chặn |
| **27** | `skill.edu.classroom_live_attack@1` | `[H]` | `H2` | Classroom Cyber Range | **Ý tưởng C3/C5:** Đấu trường phòng thủ trực tiếp trên lớp học & `Policy-as-Code Dojo` |
| **28** | `skill.moonshot.campus_digital_twin@1` | `[S]` | `H3` | Moonshot Simulation | **Ý tưởng F1/F4:** Bản sao số mạng trường đại học `SimPy` (1.000+ tác tử) & kiểm chứng hình thức SOAR |

---

## PHẦN A: NHÓM KỸ NĂNG PHÒNG THỦ ATTT 4 LỚP & BẪY CHỦ ĐỘNG (12 SKILLS)

### 1. `skill.layer1.prompt_guard@3` — Bộ Lọc Đa Tầng Chống Prompt Injection (Direct & Indirect RAG)
* **Ánh xạ mã nguồn:** [`studenthub-nova/apps/api/l1_guard/prompt_guard.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/l1_guard/prompt_guard.py)
```yaml
id: skill.layer1.prompt_guard
version: 3
execution_mode: R
horizon: H0
layer: L1_LOCAL_GUARD
compliance_mapping:
  owasp_llm_2025: [LLM01_Prompt_Injection, LLM07_System_Prompt_Leakage]
  mitre_atlas: [AML.T0051.000_Direct, AML.T0051.001_Indirect]
  nist_ai_rmf: [MEASURE-2.7, MANAGE-2.2]
description: >
  Bảo vệ luồng hội thoại học tập RAG và các AI Agent khỏi Direct Jailbreak,
  Unicode Homoglyph/Zero-width evasion, Base64/Hex payload và Indirect Prompt Injection
  cài cắm trong tài liệu môn học. Hỗ trợ bật/tắt độc lập từng tầng để chạy Ablation Study (RQ1).
input_schema:
  user_prompt: string (max 16000 chars)
  retrieved_rag_chunks: list[{ doc_id: string, title?: string, content: string, honey_token_id?: string }]
  active_stages:
    stage1_normalize_heuristic: boolean (default: true)
    stage2_semantic_intent: boolean (default: true)
    stage3_rag_context_isolation: boolean (default: true)
    stage4_canary_and_output_guard: boolean (default: true)
output_schema:
  allowed: boolean
  action: ALLOW | SANITIZE | BLOCK
  risk_score: integer (0..100)
  blocked_by_stage: NONE | STAGE_1_HEURISTIC | STAGE_2_SEMANTIC | STAGE_3_RAG_INJECTION | STAGE_4_CANARY_LEAK
  sanitized_prompt: string
  isolated_rag_xml: string
  canary_token: string
  teachable_lesson_id?: string # Liên kết sang skill.edu.teachable_block_coach@1
  latency_ms: float
  reasons: list[string]
safety_invariants:
  - server_authoritative_only
  - strict_xml_context_delimiters
  - fail_closed_on_exception
  - zero_raw_prompt_persistence
failure_mode: >
  Khi bất kỳ tầng nào ném ngoại lệ hoặc quá thời gian (timeout > 1500ms), trả về
  allowed=false, action=BLOCK, blocked_by_stage="FAIL_CLOSED_ERROR" và phát SecurityEvent v2.
metrics: [asr_direct_pct, asr_indirect_pct, fpr_benign_academic_pct, macro_f1, auroc, p50_latency_ms, p95_latency_ms]
```

---

### 2. `skill.layer1.phishing_and_url_analyzer@3` — Bộ Phân Tích Liên Kết Lừa Đảo & Chống SSRF
* **Ánh xạ mã nguồn:** [`studenthub-nova/apps/api/l1_guard/prompt_guard.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/l1_guard/prompt_guard.py) (`SSRFPhishingURLAnalyzer`)
```yaml
id: skill.layer1.phishing_and_url_analyzer
version: 3
execution_mode: R
horizon: H0
layer: L1_LOCAL_GUARD
compliance_mapping:
  owasp_asvs: [V12.6_SSRF_Protection]
  owasp_llm_2025: [LLM05_Improper_Output_Handling]
description: >
  Kiểm tra đường dẫn học bổng, học phí, tuyển dụng hoặc tài liệu do sinh viên gửi.
  Chặn tuyệt đối tấn công Server-Side Request Forgery (SSRF) vào mạng nội bộ/Cloud Metadata
  và phát hiện tên miền giả mạo thương hiệu trường đại học (Punycode/IDN Homograph).
input_schema:
  url: string (max 2048 chars)
  context_text?: string (max 4000 chars)
  resolve_dns?: boolean (default: true)
output_schema:
  verdict: SAFE | SUSPICIOUS | MALICIOUS | SSRF_BLOCKED | UNKNOWN
  risk_score: integer (0..100)
  ssrf_blocked: boolean
  is_punycode_homograph: boolean
  impersonated_institution?: string
  reasons: list[string]
safety_invariants:
  - block_rfc1918_10_172_192
  - block_loopback_127_and_localhost
  - block_cloud_metadata_169_254_169_254
  - only_allow_http_https_schemes
  - revalidate_every_redirect_hop
failure_mode: trả về verdict=UNKNOWN, risk_score=65 kèm cảnh báo không mở liên kết khi DNS lỗi.
metrics: [ssrf_block_rate_pct, phishing_f1_score, fpr_edu_vn_domains_pct, latency_ms]
```

---

### 3. `skill.layer1.endpoint_hygiene_inspector@3` — Kiểm Định Vệ Sinh Bảo Mật Phiên & Trình Duyệt
* **Ánh xạ mã nguồn:** [`studenthub-nova/apps/api/l1_guard/prompt_guard.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/l1_guard/prompt_guard.py) (`EndpointHygieneInspector`)
```yaml
id: skill.layer1.endpoint_hygiene_inspector
version: 3
execution_mode: H
horizon: H0
layer: L1_LOCAL_GUARD
compliance_mapping:
  owasp_asvs: [V2_Authentication, V3_Session_Management]
description: >
  Đánh giá độ an toàn tại chỗ của phiên đăng nhập sinh viên dựa trên tín hiệu trình duyệt,
  MFA TOTP và kiểm tra mật khẩu lộ lọt qua giao thức k-Anonymity (chỉ nhận 5 ký tự Hex đầu SHA-1).
input_schema:
  user_id: string
  mfa_enabled: boolean
  https_secure: boolean
  webcrypto_available: boolean
  sha1_prefix5: string (exact 5 hex chars)
output_schema:
  hygiene_score: integer (0..100)
  posture: HARDENED | MODERATE | VULNERABLE
  k_anonymity_prefix_queried: string
  candidate_breach_suffixes_returned: integer
  recommendations: list[string]
safety_invariants:
  - never_accept_plaintext_password_or_full_hash
  - explicit_hybrid_scope_badge
failure_mode: trả về posture=MODERATE nếu thiếu tín hiệu trình duyệt.
metrics: [hygiene_check_latency_ms, mfa_adoption_rate_pct]
```

---

### 4. `skill.layer1.honey_rag_trap@1` — Bẫy Tài Liệu Mồi `Honey-RAG` Truy Vết Khai Thác (`Ý tưởng A1`)
```yaml
id: skill.layer1.honey_rag_trap
version: 1
execution_mode: R
horizon: H1
layer: L1_TO_L2_DECEPTION
compliance_mapping:
  owasp_llm_2025: [LLM01_Prompt_Injection, LLM08_Vector_and_Embedding_Weaknesses]
  mitre_atlas: [AML.T0051.001_Indirect_Prompt_Injection]
description: >
  Cài đặt các đoạn tài liệu mồi (Honey-RAG Chunks) có gắn khóa định danh mật mã duy nhất
  (HONEY-RAG-DOC-xxxx) vào kho tri thức RAG. Khi kẻ tấn công thực hiện Indirect Prompt Injection
  để trích xuất dữ liệu hoặc ép LLM thực thi chỉ thị ẩn trong tài liệu, khóa định danh xuất hiện
  ở đầu ra hoặc lệnh gọi công cụ giúp Lớp 2 SOC biết chính xác tài liệu nào và phiên nào đang khai thác.
input_schema:
  operation: PLANT_HONEY_CHUNK | VERIFY_OUTPUT_FOR_HONEY_TOKEN
  course_namespace: string
  candidate_output_or_tool_args?: string
  session_id?: string
output_schema:
  honey_triggered: boolean
  attributed_doc_id?: string
  honey_token_id?: string
  attacker_session_id?: string
  escalated_to_l2_event_id?: string
safety_invariants:
  - honey_chunks_never_alter_benign_academic_facts
  - cryptographic_hmac_token_per_document
  - automatic_l2_soc_escalation_on_trigger
failure_mode: giữ nguyên luồng kiểm tra Canary chuẩn của Tầng 4 nếu kho Honey-RAG chưa khởi tạo.
metrics: [honey_attribution_accuracy_pct, time_to_attribute_ms, false_trigger_rate_pct]
```

---

### 5. `skill.layer1.agentic_tool_firewall@1` — Tường Lửa Đồ Thị Hành Động Cho AI Agent (`Ý tưởng F2`)
```yaml
id: skill.layer1.agentic_tool_firewall
version: 1
execution_mode: R
horizon: H3
layer: L1_LOCAL_GUARD
compliance_mapping:
  owasp_llm_2025: [LLM06_Excessive_Agency, LLM01_Prompt_Injection]
  mitre_atlas: [AML.T0053_LLM_Plugin_Compromise]
description: >
  Kiểm soát quyền gọi công cụ của AI Agent dựa trên đồ thị luồng dữ liệu (Data-Flow & Action-Graph).
  Chặn đứng kịch bản "Confused Deputy": nếu ngữ cảnh hiện tại có chứa dữ liệu không đáng tin cậy
  (<untrusted_context>, email/link bên ngoài), Agent bị cấm gọi các công cụ có tác dụng phụ ra ngoài
  (như send_message, export_file, webhook_post) nếu không có xác nhận tường minh của sinh viên.
input_schema:
  agent_id: string
  session_id: string
  proposed_tool_name: string
  proposed_tool_args: object
  context_taint_level: TRUSTED_ONLY | CONTAINS_UNTRUSTED_RAG | CONTAINS_EXTERNAL_URL
  recent_tool_chain: list[string]
output_schema:
  decision: ALLOW | BLOCK_CONFUSED_DEPUTY | REQUIRE_STUDENT_CONFIRMATION
  risk_reason: string
  violated_graph_policy?: string
safety_invariants:
  - block_external_side_effects_when_context_tainted
  - enforce_least_privilege_tool_allowlist
failure_mode: trả về BLOCK_CONFUSED_DEPUTY khi không xác định được mức độ nhiễm bẩn (taint level) của ngữ cảnh.
metrics: [confused_deputy_block_rate_pct, benign_tool_call_fpr_pct]
```

---

### 6. `skill.layer2.soc_anomaly_detector@3` — Giám Sát Dị Thường 24/7 (`SecurityEvent v2` + Sigma + UEBA)
* **Ánh xạ mã nguồn:** [`studenthub-nova/apps/api/l2_soc/soar_ladder.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/l2_soc/soar_ladder.py)
```yaml
id: skill.layer2.soc_anomaly_detector
version: 3
execution_mode: H
horizon: H0
layer: L2_AI_SOC_247
compliance_mapping:
  owasp_asvs: [V7_Error_Handling_and_Logging]
  nist_ai_rmf: [MEASURE-4.1, MANAGE-3.1]
description: >
  Chuẩn hóa mọi sự kiện từ Lớp 1, Lớp 3 và SecurityFabric sang SecurityEvent v2;
  đối chiếu tập luật Sigma kết hợp đường cơ sở hành vi (UEBA Baseline) để phát hiện
  Brute-force, Credential Stuffing, RAG Probing và kích hoạt Honey-RAG/Canary.
input_schema:
  event_type: string
  anomaly_score: integer (0..100)
  session_id: string
  client_ip: string
  source_mode: real | simulated
  reasons: list[string]
output_schema:
  event_id: string
  severity: LOW | MEDIUM | HIGH | CRITICAL
  is_campus_nat_ip: boolean
  recommended_soar_tier: MONITOR | STEP_UP_MFA | ADAPTIVE_TARPIT | THROTTLE | QUARANTINE_ACCOUNT | BLOCK_IP_PENDING_APPROVAL
safety_invariants:
  - mandatory_source_real_or_simulated_flag
  - salted_sha256_actor_identifiers
failure_mode: nâng mức cảnh báo SOC và áp dụng ngưỡng tĩnh bảo thủ.
metrics: [mttd_ms, detection_recall_pct, false_positive_alert_rate_pct]
```

---

### 7. `skill.layer2.soar_responder@3` — Phản Ứng Tự Động Theo Nấc Thang & Bảo Vệ IP Campus (`SOAR Ladder`)
* **Ánh xạ mã nguồn:** [`studenthub-nova/apps/api/l2_soc/soar_ladder.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/l2_soc/soar_ladder.py) (`GraduatedSOAREngine`)
```yaml
id: skill.layer2.soar_responder
version: 3
execution_mode: R
horizon: H0
layer: L2_AI_SOC_247
compliance_mapping:
  nist_ai_rmf: [MANAGE-2.4, MANAGE-4.1]
description: >
  Thực thi phản ứng tự động theo nấc thang có thời hạn (TTL), bảo vệ tuyệt đối dải IP NAT
  trường đại học (Campus Wi-Fi/Dormitory NAT Allowlist) khỏi bị khóa nhầm hàng loạt (RQ2),
  và hỗ trợ Hoàn tác 1 chạm (1-Click Undo) có ghi vết kiểm toán.
input_schema:
  event_type: string
  anomaly_score: integer (0..100)
  session_id: string
  client_ip: string
  source_mode: real | simulated
output_schema:
  response_id: string
  tier: MONITOR | STEP_UP_MFA | ADAPTIVE_TARPIT | THROTTLE | QUARANTINE_ACCOUNT | BLOCK_IP_PENDING_APPROVAL
  scope: SESSION_ONLY | ACCOUNT_ONLY | IP_PENDING_ADMIN
  is_campus_nat_ip: boolean
  campus_nat_protected: boolean
  ttl_seconds: integer
  undo_available: boolean
  status: ACTIVE | PENDING_HUMAN_APPROVAL | UNDONE
safety_invariants:
  - campus_nat_ip_never_auto_blocked
  - mandatory_ttl_auto_expiry
  - one_click_undo_supported
  - human_approval_required_for_ip_block
failure_mode: chỉ áp dụng STEP_UP_MFA hoặc THROTTLE 300s ở cấp độ phiên đơn lẻ.
metrics: [mttr_ms, campus_false_block_rate_pct, undo_recovery_latency_ms]
```

---

### 8. `skill.layer2.adaptive_tarpit@1` — Làm Chậm Thích Ứng & Phản Hồi Mồi Bảo Vệ Sinh Viên (`Ý tưởng A4`)
```yaml
id: skill.layer2.adaptive_tarpit
version: 1
execution_mode: R
horizon: H1
layer: L2_AI_SOC_247
compliance_mapping:
  mitre_atlas: [AML.T0040_Model_Inference_API_Access]
description: >
  Thay vì chặn cứng ngay các phiên có điểm rủi ro trung bình-cao (55 <= score < 80) trên mạng dùng chung,
  hệ thống tự động chèn độ trễ lũy tiến (200ms -> 800ms -> 2500ms) và giới hạn tốc độ nhả token.
  Kẻ tấn công quét tự động bị tiêu hao tài nguyên, trong khi sinh viên thật bị nghi nhầm vẫn tiếp tục học được.
input_schema:
  session_id: string
  anomaly_score: integer (0..100)
  consecutive_suspicious_requests: integer
output_schema:
  tarpit_active: boolean
  injected_delay_ms: integer (0..3000)
  token_stream_rate_limit_tps: integer
  ttl_seconds: integer
safety_invariants:
  - max_delay_capped_at_3000ms_to_prevent_worker_starvation
  - async_non_blocking_sleep_only
  - instant_clear_on_mfa_step_up
failure_mode: bỏ qua độ trễ tarpit và chuyển về nấc STEP_UP_MFA nếu hàng đợi async đạt ngưỡng tải cao.
metrics: [attacker_throughput_reduction_pct, benign_student_task_completion_pct]
```

---

### 9. `skill.layer3.code_security_auditor@3` — Kiểm Định Mã Nguồn Đồ Án (`SAST` + `LLM Patch` + `Re-scan & AST Gate`)
* **Ánh xạ mã nguồn:** [`studenthub-nova/apps/api/l3_audit/code_auditor.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/l3_audit/code_auditor.py)
```yaml
id: skill.layer3.code_security_auditor
version: 3
execution_mode: R
horizon: H0
layer: L3_INDEPENDENT_AUDIT
compliance_mapping:
  owasp_asvs: [V1_Architecture, V5_Validation_Sanitization]
  owasp_llm_2025: [LLM02_Sensitive_Information_Disclosure, LLM05_Improper_Output_Handling]
description: >
  Quét mã nguồn đồ án sinh viên bằng tập luật SAST xác định (CWE-89 SQLi, CWE-78 OS Command Injection,
  CWE-798 Hardcoded Secrets, CWE-918 SSRF, CWE-79 XSS), chuyển qua HybridLLMGateway (đã ẩn PII, ưu tiên
  Ollama Local) để giải thích tiếng Việt và sinh bản vá (patch_diff), cuối cùng bắt buộc vượt qua
  Cổng Quét Lại SAST = 0 lỗi VÀ Cổng Kiểm tra Cú pháp AST / Unit-Test trước khi cấp chứng nhận VERIFIED_SAFE.
input_schema:
  filename: string
  code: string (max 100000 chars)
  llm_mode: HYBRID_AUTO | FORCE_LOCAL_OLLAMA | FORCE_CLOUD_GEMINI
output_schema:
  report_id: string
  report_sha256: string
  initial_findings_count: integer
  findings: list[FindingObject]
  patched_code: string
  patch_diff: string
  verification_rescan:
    executed: boolean
    remaining_findings_count: integer
    ast_syntax_valid: boolean
    unit_test_gate_passed: boolean
    verified_safe: boolean # Chỉ true khi remaining_findings_count == 0 và ast_syntax_valid == true
safety_invariants:
  - high_sensitivity_routes_to_local_llm_or_redacted
  - mandatory_deterministic_rescan_after_llm_patch
  - mandatory_ast_syntax_validation
  - append_only_report_hash_chain
failure_mode: trả về danh sách lỗi SAST xác định + bản vá mẫu chuẩn (Deterministic Remediation) nếu LLM lỗi.
metrics: [sast_precision_pct, sast_recall_pct, verified_safe_and_functional_patch_rate_pct, pii_leak_rate_pct]
```

---

### 10. `skill.layer3.canary_credential_injector@1` — Khóa Bẫy `Canary Credentials` Bảo Vệ Kho Đồ Án (`Ý tưởng A2`)
```yaml
id: skill.layer3.canary_credential_injector
version: 1
execution_mode: R
horizon: H1
layer: L3_TO_L2_DECEPTION
compliance_mapping:
  owasp_asvs: [V2.10_Service_Authentication, V7_Logging]
description: >
  Khi sinh viên khởi tạo hoặc kiểm định đồ án, hệ thống tạo một khóa API giả có định dạng giống thật
  (ví dụ: NOVA_CANARY_KEY_...) dùng cho file .env.example hoặc honeypot config. Nếu khóa này bị gọi
  từ bất kỳ IP nào bên ngoài, Lớp 2 SOC lập tức cảnh báo cho sinh viên rằng kho mã nguồn đã bị lộ.
input_schema:
  operation: GENERATE_CANARY_KEY | REPORT_CANARY_KEY_USAGE
  student_id: string
  repo_name: string
  triggered_token?: string
  caller_ip?: string
output_schema:
  canary_key_id: string
  decoy_env_snippet: string
  leak_detected: boolean
  alert_dispatched_to_student: boolean
safety_invariants:
  - canary_key_has_zero_real_privileges
  - unique_hmac_per_student_repo
failure_mode: ghi nhận sự kiện vào hàng đợi cục bộ nếu kênh thông báo thời gian thực tạm ngắt.
metrics: [mean_time_to_detect_repo_leak_ms, false_alarm_rate_pct]
```

---

### 11. `skill.layer3.cyber_range_simulator@3` — Mô Phỏng Tấn Công Đỏ Có Kiểm Soát (`Isolated Red-Team Lab`)
* **Ánh xạ mã nguồn:** [`studenthub-nova/apps/api/main.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/main.py) (`simulate_cyber_range`)
```yaml
id: skill.layer3.cyber_range_simulator
version: 3
execution_mode: S
horizon: H0
layer: L3_INDEPENDENT_AUDIT
description: >
  Phát kịch bản lưu lượng tấn công mẫu cô lập (Campus NAT Brute-force, RAG Poisoning Wave,
  SSRF Metadata Probe, Full 4-Layer Stress) vào pipeline Lớp 1–2 để kiểm thử khả năng phòng thủ.
input_schema:
  scenario: brute_force_campus_nat | rag_poisoning_wave | ssrf_metadata_probe | full_4layer_stress
output_schema:
  mode_badge: string
  scenario: string
  innocent_campus_users_impacted: integer
  emitted_event: SecurityEventV2
safety_invariants:
  - hardcoded_loopback_pipeline_only
  - no_external_target_host_accepted
  - synthetic_telemetry_tag_enforced
failure_mode: dừng ngay lập tức khi người dùng nhấn Emergency Stop.
metrics: [l1_l2_coverage_pct, simulation_duration_ms]
```

---

### 12. `skill.layer4.threat_intel_synchronizer@3` — Đồng Bộ Tình Báo `STIX 2.1` & `k-Anonymity` ($k \ge 5$)
* **Ánh xạ mã nguồn:** [`studenthub-nova/apps/api/l4_intel/stix_taxii.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/l4_intel/stix_taxii.py)
```yaml
id: skill.layer4.threat_intel_synchronizer
version: 3
execution_mode: H
horizon: H0
layer: L4_NATIONAL_SYNC
compliance_mapping:
  decree_13_2023_vn: [Article_11_Consent, Article_22_Deidentification]
description: >
  Nhập chỉ số tấn công (IOC) chuẩn STIX 2.1, kiểm tra rò rỉ mật khẩu bằng thuật toán k-Anonymity
  (5 ký tự đầu SHA-1), và đóng gói cảnh báo STIX 2.1 ẩn danh (bắt buộc k >= 5 đơn vị/phiên độc lập,
  đã gỡ sạch PII và có quản trị viên phê duyệt nhãn TLP) trước khi chia sẻ liên trường.
input_schema:
  indicator_pattern: string
  description: string
  affected_tenant_count: integer
  tlp_marking: TLP:CLEAR | TLP:GREEN | TLP:AMBER
  admin_approved: boolean
output_schema:
  export_allowed: boolean
  status: EXPORTED_TO_TAXII | REJECTED_K_ANONYMITY_THRESHOLD | PENDING_ADMIN_APPROVAL
  k_anonymity_satisfied: boolean
  pii_stripped: boolean
  stix_bundle: object
safety_invariants:
  - enforce_k_anonymity_min_5_before_export
  - strip_all_student_and_institution_pii
  - mandatory_human_approval_for_outbound_taxii
failure_mode: giữ gói STIX ở trạng thái nháp nội bộ, tuyệt đối không phát tán tự động.
metrics: [stix_parse_latency_ms, privacy_rejection_accuracy_pct]
```

---

## PHẦN B: NHÓM KỸ NĂNG KIỂM CHỨNG NHẬN THỨC V5, DATA FLYWHEEL & HỆ SINH THÁI (10 SKILLS)

### 13. `skill.trust.four_layer_epistemic_verifier@5` — Pipeline Kiểm Chứng Tin Cậy Nhận Thức 4 Lớp
* **Ánh xạ mã nguồn:** [`studenthub-nova/apps/api/studenthub_v5/epistemic_trust.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/studenthub_v5/epistemic_trust.py) ↔ `OwnBackendTrustOrchestrator.js`
```yaml
id: skill.trust.four_layer_epistemic_verifier
version: 5
execution_mode: R
horizon: H0
layer: CROSS_LAYER_EPISTEMIC_TRUST
description: >
  Pipeline chính thống của StudentHub-AI kiểm tra tin nhắn học vụ, thông báo học phí/học bổng,
  tuyển dụng, URL và mã QR qua 4 lớp: L1 Deterministic Screen -> L2A Reputation / L2B Semantic AI /
  L2C StudentDomainRisk -> L3 Guarded External Evidence -> L4 Calibrated Final Verdict.
input_schema:
  content_type: text | url | qr_payload
  content: string (max 50000 chars)
output_schema:
  case_id: string
  verdict: SAFE_VERIFIED | SUSPICIOUS_WARNING | HIGH_RISK_SCAM | SSRF_OR_MALICIOUS_BLOCKED
  confidence: float (0.0..1.0)
  layers: object
  passport_event_id: string
safety_invariants:
  - no_fabricated_live_ai_when_unconfigured
  - explicit_degraded_honesty_state
failure_mode: trả về kết quả xác định của Lớp 1 kèm trạng thái DEGRADED nếu cổng LLM ngoại tuyến.
metrics: [end_to_end_latency_ms, calibration_ece, brier_score]
```

---

### 14. `skill.platform.hybrid_llm_gateway@3` — Cổng Định Tuyến AI Lai (`Gemini` + `OpenAI` + `Ollama` + `PIIRedactor`)
* **Ánh xạ mã nguồn:** [`studenthub-nova/apps/api/core/llm_gateway.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/core/llm_gateway.py)
```yaml
id: skill.platform.hybrid_llm_gateway
version: 3
execution_mode: R
horizon: H0
layer: CORE_INFRASTRUCTURE
compliance_mapping:
  decree_13_2023_vn: [PII_Redaction_Before_Cross_Border_Transfer]
  owasp_llm_2025: [LLM02_Sensitive_Information_Disclosure]
description: >
  Cổng AI duy nhất cho cả StudentHub-AI và Nova OS:
  (1) Pre-flight: Ẩn danh PII (Email, SĐT, CCCD, MSSV, API Key) + Gắn Canary Token;
  (2) Hybrid Routing: Định tuyến thông minh giữa Gemini 2.5 Flash, OpenAI và Ollama Local;
  (3) Post-flight: Kiểm tra rò rỉ Canary Token ở đầu ra và chỉ ghi log metadata.
input_schema:
  system_instruction: string
  user_content: string
  mode: HYBRID_AUTO | FORCE_LOCAL_OLLAMA | FORCE_CLOUD_GEMINI
  sensitivity: NORMAL | HIGH
output_schema:
  reply: string
  metadata:
    provider: string
    latency_ms: float
    pii_redacted_counts: object
    canary_token_id: string
    canary_leaked: boolean
    fallback_used: boolean
safety_invariants:
  - mandatory_pii_redaction_decree_13_2023
  - automatic_429_quota_failover_to_local
  - post_flight_canary_leak_check
  - zero_prompt_text_in_database_logs
failure_mode: chuyển về chế độ phản hồi xác định an toàn khi mọi nhà cung cấp AI đều không khả dụng.
metrics: [failover_success_rate_pct, pii_redaction_recall_pct, gateway_p95_latency_ms]
```

---

### 15. `skill.studenthub.academic_copilot@3` — Trợ Lý Học Tập RAG Có Trích Dẫn & Bảo Vệ Công Cụ
* **Ánh xạ mã nguồn:** [`studenthub-nova/apps/api/main.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/main.py) (`/api/v1/l1/rag-chat`)
```yaml
id: skill.studenthub.academic_copilot
version: 3
execution_mode: R
horizon: H0
layer: L1_LOCAL_GUARD
description: >
  Trợ lý học tập giải đáp môn học và quy chế học vụ. Mọi tài liệu RAG đều được lọc qua
  PromptGuard Tầng 3, bọc trong thẻ <untrusted_context> và kiểm tra Honey-RAG.
input_schema:
  user_prompt: string
  rag_chunks: list[{ doc_id: string, title: string, content: string }]
  llm_mode: string
output_schema:
  allowed: boolean
  guard_result: object
  llm_response: string
  gateway_metadata: object
  total_xp: integer
safety_invariants:
  - enforce_prompt_guard_v3_before_rag
  - refuse_when_ungrounded
failure_mode: chặn yêu cầu và kích hoạt Teachable Block khi phát hiện Prompt Injection.
metrics: [grounded_citation_rate_pct, injection_block_rate_pct]
```

---

### 16. `skill.intelligence.living_evidence_passport_binder@3` — Hộ Chiếu Bằng Chứng Sống & Chứng Chỉ Ký Số `W3C VC 2.0` (`Ý tưởng E2`)
* **Ánh xạ mã nguồn:** [`studenthub-nova/apps/api/studenthub_v5/epistemic_trust.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/studenthub_v5/epistemic_trust.py) (`LivingEvidencePassportManager`)
```yaml
id: skill.intelligence.living_evidence_passport_binder
version: 3
execution_mode: R
horizon: H2
layer: CROSS_LAYER_EVIDENCE_PASSPORT
compliance_mapping:
  w3c_standards: [W3C_Verifiable_Credentials_2.0, Open_Badges_3.0]
description: >
  Ghi nhận bất biến các cột mốc thực hành bảo mật trên Nova OS và kết quả kiểm chứng Trust V5
  vào Living Evidence Passport; xuất chứng chỉ JSON-LD theo chuẩn W3C Verifiable Credentials 2.0
  kèm chữ ký số Ed25519 / HMAC-SHA256 để nhà tuyển dụng hoặc giảng viên xác minh độc lập qua QR.
input_schema:
  owner_id: string
  event_type: string
  title: string
  layer: string
  provenance_class: DETERMINISTIC_RULE | TRUST_ENGINE | OFFICIAL_VERIFIED
  export_w3c_vc?: boolean (default: true)
output_schema:
  passport_id: string
  revision: integer
  integrity_sha256: string
  w3c_verifiable_credential?:
    "@context": list[string]
    type: list[string]
    issuer: string
    issuanceDate: string
    credentialSubject: object
    proof:
      type: Ed25519Signature2020 | Sha256HmacProof2026
      verificationMethod: string
      proofValue: string
safety_invariants:
  - reject_demo_fixture_in_live_passport
  - append_only_revision_history
  - offline_verifiable_cryptographic_proof
failure_mode: từ chối ghi hộ chiếu nếu provenance_class không hợp lệ.
metrics: [passport_binding_integrity_pct, vc_verification_latency_ms]
```

---

### 17. `skill.platform.security_fabric_pdp@3` — Mặt Phẳng Kiểm Soát Zero-Trust & Khóa Quản Trị (`SecurityFabric`)
* **Ánh xạ mã nguồn:** [`studenthub-nova/apps/api/main.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/main.py) & `SecurityFabric.js`
```yaml
id: skill.platform.security_fabric_pdp
version: 3
execution_mode: R
horizon: H0
layer: CORE_INFRASTRUCTURE
compliance_mapping:
  owasp_asvs: [V1.2_Authentication_Architecture, V4_Access_Control, V13_API_Security]
description: >
  Cổng kiểm soát truy cập Zero-Trust bọc toàn bộ API của StudentHub-AI và Nova OS.
  Đặc biệt ở bản v4.0 (H0): khóa chặt các endpoint quản trị nhạy cảm (như /api/v1/system/update-keys)
  chỉ cho phép truy cập từ loopback (127.0.0.1 / ::1) kết hợp mã xác thực X-Nova-Admin-Token.
input_schema:
  client_ip: string
  path: string
  headers: object
  required_scope?: string
output_schema:
  decision: ALLOW | DENY_UNAUTHORIZED | DENY_NON_LOCALHOST | STEP_UP
  correlation_id: string
safety_invariants:
  - admin_key_mutation_restricted_to_localhost_and_token
  - strict_cors_origin_allowlist
  - never_expose_raw_secret_values_in_response
failure_mode: trả về HTTP 403 Forbidden và ghi nhận sự kiện cảnh báo vào Lớp 2 SOC.
metrics: [unauthorized_admin_block_count, pdp_evaluation_latency_ms]
```

---

### 18. `skill.platform.xp_ledger@3` — Sổ Cái Điểm Bảo Mật Bất Biến Phía Server (`Server-Authoritative SEC-XP`)
* **Ánh xạ mã nguồn:** [`studenthub-nova/apps/api/main.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/main.py) & [`studenthub-nova/apps/api/core/supabase_bridge.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/core/supabase_bridge.py)
```yaml
id: skill.platform.xp_ledger
version: 3
execution_mode: R
horizon: H0
layer: CORE_INFRASTRUCTURE
description: >
  Quản lý điểm thưởng thực hành bảo mật SEC-XP ở phía Server với khóa chống cộng trùng
  (Idempotency-Key), tự động đồng bộ bền vững lên bảng nova_xp_ledger trên Supabase PostgreSQL.
input_schema:
  milestone_id: string
  idempotency_key: string
output_schema:
  awarded: boolean
  xp_added: integer
  total_xp: integer
  persisted_to_supabase: boolean
safety_invariants:
  - client_cannot_specify_arbitrary_xp_amount
  - idempotency_key_unique_constraint
  - append_only_ledger
failure_mode: lưu vào sổ cái bộ nhớ đệm an toàn và đồng bộ bù khi Supabase trực tuyến trở lại.
metrics: [duplicate_claim_rejection_rate_pct, supabase_sync_success_rate_pct]
```

---

### 19. `skill.flywheel.prompt_injection_league@1` — Giải Đấu `Prompt Injection League` & Vòng Lặp `ViPI-Bench` (`Ý tưởng B1/B2/B3`)
```yaml
id: skill.flywheel.prompt_injection_league
version: 1
execution_mode: R
horizon: H2
layer: DATA_FLYWHEEL_BENCHMARK
compliance_mapping:
  research_ethics: [IRB_Informed_Consent, PII_Stripped_Corpus_Contribution]
description: >
  Tổ chức đấu trường theo mùa cho sinh viên thử nghiệm vượt qua MultiStagePromptGuard.
  Mọi mẫu tấn công mới (sau khi đã được sinh viên đồng ý đóng góp nghiên cứu và được PIIRedactor
  làm sạch 100%) được đưa vào hàng đợi kiểm duyệt để làm giàu tập dữ liệu ViPI-Bench / SEA-PI-Bench,
  đồng thời giữ nguyên tập Held-out Set khóa kín để chống học vẹt (Overfitting).
input_schema:
  student_id: string
  season_id: string
  attack_category: DIRECT_JAILBREAK | INDIRECT_RAG_POISON | HOMOGLYPH_OBFUSCATION | MULTILINGUAL_SEA
  candidate_payload: string
  irb_research_consent_granted: boolean
output_schema:
  submission_id: string
  bypassed_guard: boolean
  blocked_at_stage: string
  elo_rating_delta: integer
  xp_awarded: integer
  queued_for_vipi_bench_review: boolean
safety_invariants:
  - mandatory_irb_consent_before_corpus_ingestion
  - mandatory_pii_redaction_before_storage
  - held_out_benchmark_split_never_modified_by_live_traffic
failure_mode: chấm điểm cho phiên thi đấu nhưng không lưu mẫu vào kho dữ liệu nếu irb_research_consent_granted == false.
metrics: [unique_attack_variants_collected, guard_hardening_delta_asr_pct]
```

---

### 20. `skill.forecast.scam_weather_engine@1` — Dự Báo Thời Tiết Lừa Đảo Theo Lịch Học Vụ (`Ý tưởng D1/D4`)
```yaml
id: skill.forecast.scam_weather_engine
version: 1
execution_mode: H
horizon: H2
layer: COLLECTIVE_INTELLIGENCE
description: >
  Kết hợp lịch học vụ của các trường đại học (mùa nhập học tân sinh viên, tuần đóng học phí,
  đợt xét học bổng, mùa tuyển thực tập) với thuật toán gom cụm chiến dịch (Campaign Clustering)
  từ báo cáo thực tế ở Lớp 1 & Lớp 4 để phát bản tin "Dự báo Thời tiết Lừa đảo" sớm hàng tuần.
input_schema:
  institution_code: string
  academic_week_phase: FRESHMAN_ONBOARDING | TUITION_DEADLINE | SCHOLARSHIP_REVIEW | INTERNSHIP_HIRING | EXAM_WEEK
  recent_scam_reports_7d: integer
output_schema:
  forecast_level: CALM_GREEN | WATCH_BLUE | ELEVATED_AMBER | STORM_RED
  risk_index: integer (0..100)
  dominant_scam_campaigns: list[{ campaign_id: string, theme_vi: string, sample_indicators: list[string] }]
  preventive_checklist_vi: list[string]
safety_invariants:
  - k_anonymity_campaign_aggregation
  - zero_individual_victim_exposure
failure_mode: hiển thị dự báo cơ sở theo lịch học vụ chuẩn khi chưa đủ dữ liệu gom cụm thời gian thực.
metrics: [early_warning_lead_time_hours, campaign_clustering_purity_pct]
```

---

### 21. `skill.analytics.vulnerability_genome@1` — Bản Đồ Gen Lỗ Hổng Đồ Án Theo Môn Học (`Ý tưởng D2`)
```yaml
id: skill.analytics.vulnerability_genome
version: 1
execution_mode: R
horizon: H2
layer: COLLECTIVE_INTELLIGENCE
description: >
  Tổng hợp ẩn danh các lỗ hổng CWE phát hiện tại Lớp 3 (CodeSecurityAuditor) theo từng học phần
  (ví dụ: Nhập môn CSDL, Lập trình Web, Phát triển Ứng dụng AI) để tạo "Bản đồ Gen Lỗ hổng"
  giúp giảng viên biết chính xác tuần học nào cần bổ sung kiến thức lập trình an toàn.
input_schema:
  course_code: string
  semester: string
output_schema:
  total_scans_analyzed: integer
  cwe_distribution: list[{ cwe_id: string, name: string, percentage: float, verified_patch_rate: float }]
  curriculum_recommendations_vi: list[string]
safety_invariants:
  - aggregate_only_when_cohort_size_min_5
  - never_expose_individual_student_grades_or_code
failure_mode: trả về báo cáo tổng hợp cấp khoa nếu số lượng mẫu của môn học nhỏ hơn 5.
metrics: [semester_over_semester_cwe_reduction_pct]
```

---

### 22. `skill.ecosystem.zalo_shield_bot@1` — Cổng Tiếp Nhận `Zalo Shield Bot` & `Browser Link Guardian` (`Ý tưởng E1/E4`)
```yaml
id: skill.ecosystem.zalo_shield_bot
version: 1
execution_mode: H
horizon: H2
layer: ECOSYSTEM_CHANNELS
description: >
  Hợp đồng Webhook cho phép sinh viên chuyển tiếp tin nhắn, đường dẫn hoặc ảnh chụp mã QR
  đáng ngờ qua Zalo Shield Bot (hoặc tiện ích Browser Link Guardian) và nhận phán quyết
  từ Pipeline Trust V5 + URL Analyzer trong vòng dưới 3 giây.
input_schema:
  channel: ZALO_BOT_WEBHOOK | BROWSER_EXTENSION_GUARD
  sender_hash: string
  message_text?: string
  extracted_url?: string
output_schema:
  verdict_badge_vi: string # "✅ AN TOÀN", "⚠️ NGHI NGỜ CAO", "🛑 LỪA ĐẢO / ĐỘC HẠI"
  risk_score: integer (0..100)
  short_explanation_vi: string (max 280 chars)
  deep_link_nova_os: string
  response_latency_ms: float
safety_invariants:
  - webhook_hmac_signature_verification
  - salted_hash_sender_id_only
  - sub_3_second_timeout_budget
failure_mode: trả về cảnh báo thận trọng kèm danh sách kiểm tra thủ công 3 bước nếu quá thời gian chờ 3 giây.
metrics: [bot_p95_response_ms, daily_protected_students_count]
```

---

## PHẦN C: NHÓM KỸ NĂNG VISUAL 120FPS, SƯ PHẠM TƯƠNG TÁC & MOONSHOT (6 SKILLS)

### 23. `skill.ui.zero_scrollytelling_compositor@4` — Động Cơ Scrollytelling 120FPS, Chuyển Cảnh WebGL & `Work Mode` (`Ý tưởng C6`)
* **Ánh xạ mã nguồn:** [`StudentHub-AI/src/components/scenes/HybridSceneStage.tsx`](file:///d:/MYPROVIPPOJ/StudentHub-AI/src/components/scenes/HybridSceneStage.tsx) & [`CinematicTransitionDirector.tsx`](file:///d:/MYPROVIPPOJ/StudentHub-AI/src/components/scenes/CinematicTransitionDirector.tsx)
```yaml
id: skill.ui.zero_scrollytelling_compositor
version: 4
execution_mode: R
horizon: H0
layer: UI_PRESENTATION_ENGINE
description: >
  Điều phối 5 phân cảnh Scrollytelling (-18% -> 100%) ở tốc độ 120FPS bằng kiến trúc
  Zero-React-Re-Render (cập nhật trực tiếp biến CSS --scroll-progress trên GPU),
  kết hợp 5 ảnh AI 3D sạch watermark, 5 video Clean Plate, hiệu ứng cầu nối chuyển cảnh
  CinematicTransitionDirector và công tắc chuyển đổi nhanh sang Work Mode (giao diện tối giản).
input_schema:
  scroll_progress: float (0.0..1.0)
  ui_mode: CINEMATIC_3D_MODE | WORK_MODE_MINIMAL
  reduced_motion: boolean
output_schema:
  active_scene_index: integer (1..5)
  transition_bridge_opacity: float (0.0..1.0)
  fps_estimate: float
safety_invariants:
  - zero_react_state_rerender_on_scroll_tick
  - zero_double_hud_overlap
  - zero_watermark_plates
  - instant_work_mode_bypass_available
failure_mode: tự động chuyển về Work Mode tĩnh nếu thiết bị không hỗ trợ tăng tốc phần cứng.
metrics: [avg_fps, frame_drop_rate_pct, first_load_js_kb]
```

---

### 24. `skill.ui.nova_os_desktop_environment@4` — Hệ Điều Hành Web Ảo `Nova OS` 6 Ứng Dụng
* **Ánh xạ mã nguồn:** [`StudentHub-AI/src/components/nova-os/NovaDesktop.tsx`](file:///d:/MYPROVIPPOJ/StudentHub-AI/src/components/nova-os/NovaDesktop.tsx)
```yaml
id: skill.ui.nova_os_desktop_environment
version: 4
execution_mode: R
horizon: H0
layer: UI_PRESENTATION_ENGINE
description: >
  Không gian làm việc ảo hợp nhất chứa 6 ứng dụng: StudentHubApp (RAG Copilot + Trust V5 + Quiz),
  Layer1LocalGuard, Layer2SocMonitor, Layer3AuditPentest, Layer4NationalSync và PassportAndEvalApp
  (Hộ chiếu Bằng chứng Sống + RQ1..RQ3 Live Benchmark + Quản trị API Key & Supabase).
input_schema:
  initial_app_id?: studenthub | layer1 | layer2 | layer3 | layer4 | passport
output_schema:
  open_windows: list[WindowState]
  backend_connection_status: ONLINE_AUTHORITATIVE | DEGRADED_LOCAL_FALLBACK
safety_invariants:
  - mandatory_honesty_badge_per_window
  - read_only_xp_mirror_from_server
failure_mode: hiển thị trạng thái kết nối trung thực nếu Backend chưa bật.
metrics: [window_open_latency_ms, sus_usability_score]
```

---

### 25. `skill.edu.soc_time_travel_replay@1` — Tua Thời Gian Pháp Y Sự Cố `SOC Time-Travel Replay` (`Ý tưởng C1/C2`)
```yaml
id: skill.edu.soc_time_travel_replay
version: 1
execution_mode: R
horizon: H1
layer: PEDAGOGICAL_3D_ENGINE
description: >
  Tái sử dụng động cơ scroll-scrubbing 120FPS để cho phép sinh viên và giảng viên kéo thanh trượt
  thời gian (0% -> 100% vòng đời sự cố) nhằm quan sát từng bước: gói tin tấn công đi vào Lớp 1,
  mã bẫy Honey-RAG phát sáng, điểm dị thường UEBA tăng lên ở Lớp 2, và SOAR chuyển nấc thang
  bảo vệ IP Campus như thế nào. Hỗ trợ xuất sự cố thành câu chuyện 5 cảnh để giảng dạy.
input_schema:
  incident_id: string
  scrub_position_pct: float (0.0..100.0)
output_schema:
  timestamp_offset_ms: integer
  active_layer_focus: L1 | L2 | L3 | L4
  packet_snapshot: object
  soar_state_at_tick: object
  pedagogical_commentary_vi: string
safety_invariants:
  - replay_uses_anonymized_security_events_only
  - deterministic_state_reconstruction
failure_mode: tải kịch bản mẫu chuẩn nếu incident_id không tồn tại.
metrics: [forensic_comprehension_quiz_score_pct, scrub_frame_time_ms]
```

---

### 26. `skill.edu.teachable_block_coach@1` — Biến Mỗi Lần Chặn Thành Bài Học 2 Phút (`Teachable Block` — `Ý tưởng C4`)
```yaml
id: skill.edu.teachable_block_coach
version: 1
execution_mode: R
horizon: H1
layer: PEDAGOGICAL_COACH
description: >
  Khi một câu lệnh chat hoặc đoạn code của sinh viên bị chặn bởi Lớp 1 hoặc Lớp 3,
  thay vì chỉ hiện thông báo lỗi khô khan, hệ thống lập tức mở thẻ "Teachable Block":
  (1) Giải thích ngắn gọn kỹ thuật vừa kích hoạt (ví dụ: Indirect Prompt Injection hay SQLi);
  (2) Hiển thị hậu quả thực tế nếu không có lớp bảo vệ;
  (3) Mở bài thực hành tương tác 2 phút để sinh viên tự sửa lại cho đúng và nhận SEC-XP.
input_schema:
  blocked_by_skill: string
  violation_code: string
  original_snippet_redacted: string
output_schema:
  lesson_id: string
  title_vi: string
  what_happened_vi: string
  why_dangerous_vi: string
  interactive_fix_challenge:
    prompt_question_vi: string
    options: list[string]
    correct_index: integer
    xp_reward: integer
safety_invariants:
  - non_punitive_constructivist_tone
  - never_teach_weaponized_exploitation_outside_sandbox
failure_mode: hiển thị thẻ giải thích tĩnh chuẩn hóa nếu dịch vụ bài tập tương tác bận.
metrics: [micro_lab_completion_rate_pct, repeat_violation_reduction_pct]
```

---

### 27. `skill.edu.classroom_live_attack@1` — Đấu Trường Phòng Thủ Lớp Học & `Policy-as-Code Dojo` (`Ý tưởng C3/C5`)
```yaml
id: skill.edu.classroom_live_attack
version: 1
execution_mode: H
horizon: H2
layer: CLASSROOM_CYBER_RANGE
description: >
  Cho phép giảng viên mở phiên diễn tập trực tiếp trên lớp (kiểu Kahoot cho SOC & Blue Team):
  giảng viên phát một đợt tấn công mô phỏng hoặc giao bài tập viết luật Sigma/Rego (Policy-as-Code Dojo);
  sinh viên toàn lớp viết luật hoặc chọn phản ứng SOAR trên Nova OS, hệ thống chấm điểm tự động
  trên tập trace tấn công thật.
input_schema:
  classroom_session_code: string
  instructor_id: string
  mode: LIVE_SOAR_DEFENSE | SIGMA_REGO_DOJO
  student_policy_rule?: string
output_schema:
  detection_tpr_pct: float
  false_positive_fpr_pct: float
  campus_nat_collateral_damage_pct: float
  class_leaderboard_rank: integer
  xp_awarded: integer
safety_invariants:
  - isolated_classroom_tenant_namespace
  - sandboxed_policy_evaluation_timeout_500ms
failure_mode: chấm điểm cục bộ từng sinh viên nếu kết nối bảng xếp hạng lớp học bị gián đoạn.
metrics: [student_engagement_rate_pct, policy_f1_improvement_pct]
```

---

### 28. `skill.moonshot.campus_digital_twin@1` — Bản Sao Số Mạng Trường Đại Học `SimPy` & Kiểm Chứng Hình Thức (`Ý tưởng F1/F4`)
```yaml
id: skill.moonshot.campus_digital_twin
version: 1
execution_mode: S
horizon: H3
layer: MOONSHOT_SIMULATION
description: >
  Mô phỏng đa tác tử (Multi-Agent Discrete-Event Simulation bằng SimPy) tái hiện mạng trường đại học
  với 1.000+ sinh viên ảo (theo nhịp sinh hoạt giờ lên lớp, KTX ban đêm, mùa thi) chia sẻ dải IP NAT
  cùng các tác tử tấn công tự động. Đồng thời kiểm tra bất biến hình thức (Formal Invariant Check)
  rằng SOAR Ladder không bao giờ gây mất kết nối cho sinh viên lành tính cùng IP NAT.
input_schema:
  virtual_students_count: integer (100..5000, default: 1000)
  attacker_agents_count: integer (1..100, default: 15)
  shared_nat_ips_count: integer (1..10, default: 2)
  duration_simulated_minutes: integer (10..1440, default: 60)
  random_seed: integer (default: 42)
output_schema:
  simulation_run_id: string
  total_requests_simulated: integer
  policies_compared:
    hard_ip_auto_block:
      collateral_damage_pct: float
      ci95_low: float
      ci95_high: float
    nova_graduated_soar_v4:
      collateral_damage_pct: float
      ci95_low: float
      ci95_high: float
      attacker_containment_pct: float
  formal_invariant_campus_nat_never_auto_blocked: boolean
safety_invariants:
  - deterministic_reproducible_seed
  - pure_in_memory_discrete_event_simulation
failure_mode: giảm số lượng tác tử về mức an toàn (500 agents) nếu bộ nhớ máy chủ hạn chế.
metrics: [simulation_wall_time_ms, invariant_violation_count]
```
