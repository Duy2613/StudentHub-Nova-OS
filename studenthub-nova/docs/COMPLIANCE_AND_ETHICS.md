# INTERNATIONAL COMPLIANCE, SUPPLY CHAIN & RESEARCH ETHICS SPECIFICATION v4.0 (`COMPLIANCE_AND_ETHICS.md`)
> **Hệ thống:** `StudentHub-AI (V5 Core) × Nova OS (ATTT 4 Lớp Server-Authoritative)`
> **Phiên bản:** `4.0.0-InternationalEdition`
> **Phạm vi:** Ánh xạ tuân thủ đầy đủ các bộ khung tiêu chuẩn quốc tế về An toàn Ứng dụng Web, An toàn Hệ thống AI Tạo sinh, Quản trị Rủi ro AI, Chuỗi Cung ứng Phần mềm và Đạo đức Nghiên cứu trên Con người (IRB).

---

## 1. BẢNG ÁNH XẠ OWASP TOP 10 FOR LLM APPLICATIONS (2025 EDITION)

| Mã OWASP LLM 2025 | Tên Rủi ro | Cơ chế Kiểm soát & Giảm thiểu trong `StudentHub-AI × Nova OS` | Hợp đồng Kỹ năng (`Skill ID`) |
| :--- | :--- | :--- | :--- |
| **`LLM01:2025`** | **Prompt Injection** | • `MultiStagePromptGuard` 4 tầng phía Server (NFKC, Regex Việt–Anh, Semantic Intent, RAG `<untrusted_context>`).<br>• Bẫy tài liệu mồi `Honey-RAG Trap` truy vết nguồn khai thác Indirect Injection. | `skill.layer1.prompt_guard@3`<br>`skill.layer1.honey_rag_trap@1` |
| **`LLM02:2025`** | **Sensitive Information Disclosure** | • `PIIRedactor` tự động che Email, SĐT, CCCD, MSSV, API Key trước khi gọi LLM.<br>• Ưu tiên định tuyến mã nguồn đồ án (`sensitivity="HIGH"`) sang `Ollama Local`. | `skill.platform.hybrid_llm_gateway@3` |
| **`LLM03:2025`** | **Supply Chain Vulnerabilities** | • Xuất danh mục thành phần phần mềm chuẩn **CycloneDX SBOM** (`sbom.json`).<br>• Cố định phiên bản thư viện (`package-lock.json` / `requirements.txt`) và quét lỗ hổng phụ thuộc. | `skill.layer3.code_security_auditor@3` |
| **`LLM04:2025`** | **Data and Model Poisoning** | • Tách biệt tuyệt đối tập kiểm thử khóa kín (`Held-out Set`) của `ViPI-Bench` khỏi dữ liệu đóng góp từ `Prompt Injection League`.<br>• Quét và lọc mọi đoạn tài liệu RAG trước khi lập chỉ mục. | `skill.flywheel.prompt_injection_league@1` |
| **`LLM05:2025`** | **Improper Output Handling** | • Bắt buộc quét lại bản vá do LLM sinh ra bằng SAST xác định (`remaining_findings == 0`) và kiểm tra cú pháp AST trước khi đánh dấu an toàn.<br>• Chống SSRF và XSS trên mọi đường dẫn do LLM hoặc người dùng tạo ra. | `skill.layer3.code_security_auditor@3`<br>`skill.layer1.phishing_and_url_analyzer@3` |
| **`LLM06:2025`** | **Excessive Agency** | • `AgenticToolFirewall` theo dõi mức độ nhiễm bẩn ngữ cảnh (`Context Taint Tracking`), chặn kịch bản "Confused Deputy" gọi công cụ ra ngoài khi ngữ cảnh có `<untrusted_context>`. | `skill.layer1.agentic_tool_firewall@1` |
| **`LLM07:2025`** | **System Prompt Leakage** | • Gắn `Canary Token` động (`CANARY-NOVA-xxxx`) vào System Instruction và chặn tức thì ở tầng Post-flight nếu xuất hiện trong câu trả lời. | `skill.layer1.prompt_guard@3`<br>`skill.platform.hybrid_llm_gateway@3` |
| **`LLM08:2025`** | **Vector and Embedding Weaknesses** | • Phân tách không gian tên (`course_namespace`) trong kho RAG, gắn thẻ `<untrusted_context>` và cài đặt các đoạn mồi `Honey-RAG` có chữ ký HMAC riêng. | `skill.layer1.honey_rag_trap@1` |
| **`LLM09:2025`** | **Misinformation & Hallucination** | • Pipeline kiểm chứng nhận thức 4 lớp `OwnBackendTrustOrchestrator` (Trust V5) kết hợp trích dẫn nguồn học liệu bắt buộc và hiển thị rõ trạng thái `DEGRADED` khi thiếu bằng chứng. | `skill.trust.four_layer_epistemic_verifier@5`<br>`skill.studenthub.academic_copilot@3` |
| **`LLM10:2025`** | **Unbounded Consumption (Denial of Wallet / Service)** | • Giới hạn tốc độ theo phiên, tự động chuyển đổi dự phòng (`Quota 429 Failover`) sang `Ollama Local`, và áp dụng `Adaptive Tarpit` (làm chậm lũy tiến `200ms → 2500ms`) cho phiên đáng ngờ. | `skill.layer2.adaptive_tarpit@1`<br>`skill.platform.hybrid_llm_gateway@3` |

---

## 2. BẢNG ÁNH XẠ MITRE ATLAS (ADVERSARIAL THREAT LANDSCAPE FOR AI SYSTEMS)

| Kỹ thuật MITRE ATLAS | Chiến thuật (Tactic) | Kịch bản Đối kháng trong Môi trường Đại học | Cơ chế Phòng thủ & Phát hiện của Hệ thống |
| :--- | :--- | :--- | :--- |
| **`AML.T0051.000`** | LLM Prompt Injection: Direct | Sinh viên/Kẻ tấn công nhập lệnh Jailbreak, Base64 hoặc Unicode Homoglyph vào khung chat RAG. | Tầng 1 Normalization + Heuristic & Tầng 2 Semantic Intent Classifier (`skill.layer1.prompt_guard@3`). |
| **`AML.T0051.001`** | LLM Prompt Injection: Indirect | Giảng viên/Sinh viên tải lên tài liệu PDF/Markdown bị cài lệnh ẩn điều khiển trợ lý AI. | Tầng 3 RAG Context Sanitizer + `<untrusted_context>` + `Honey-RAG Trap` (`skill.layer1.honey_rag_trap@1`). |
| **`AML.T0053`** | LLM Plugin / Tool Compromise | Lợi dụng tài liệu nhiễm bẩn để lừa AI Agent gọi công cụ gửi dữ liệu ra ngoài. | `AgenticToolFirewall` chặn chuỗi hành động có tác dụng phụ khi ngữ cảnh bị đánh dấu nhiễm bẩn (`skill.layer1.agentic_tool_firewall@1`). |
| **`AML.T0040`** | ML Model Inference API Access | Quét tự động hàng loạt câu lệnh từ mạng Wi-Fi trường đại học để dò tìm lỗ hổng của Guard. | Lớp 2 `Adaptive Tarpit` + `Graduated SOAR` cô lập đúng phiên tấn công mà không khóa IP NAT chung của trường (`skill.layer2.soar_responder@3`). |
| **`AML.T0024`** | Exfiltration via ML Inference API | Trích xuất System Prompt hoặc dữ liệu cá nhân thông qua đầu ra của mô hình. | Tầng 4 `Canary Token` Post-flight Check + `PIIRedactor` 2 chiều (`skill.platform.hybrid_llm_gateway@3`). |

---

## 3. BẢNG ÁNH XẠ KHUNG QUẢN TRỊ RỦI RO NIST AI RMF 1.0 & ISO/IEC 42001

1. **`GOVERN` (Quản trị & Trách nhiệm giải trình):**
   - Áp dụng **Hiến pháp Nhãn Trung thực (`[R]` Thật / `[H]` Lai / `[S]` Mô phỏng)** trên toàn bộ 6 ứng dụng của `Nova OS` và báo cáo thực nghiệm.
   - Yêu cầu phê duyệt của con người (`Human-in-the-Loop`) đối với các quyết định tác động rộng: chặn IP ngoài trường (`BLOCK_IP_PENDING_APPROVAL`), xuất gói tình báo `STIX 2.1` liên trường (`TLP Gate`), và áp dụng bản vá mã nguồn đồ án.
2. **`MAP` (Nhận diện Ngữ cảnh & Phân loại Rủi ro):**
   - Phân biệt rõ ngữ cảnh mạng đặc thù của trường đại học (`Campus Shared NAT IP` với hàng nghìn sinh viên dùng chung địa chỉ IP công cộng) và mức độ nhạy cảm dữ liệu (`sensitivity: NORMAL | HIGH`).
3. **`MEASURE` (Đo lường Khách quan & Tái lập được):**
   - Đo lường tự động qua `EmpiricalEvaluationEngine` và `BENCHMARK_PROTOCOL.md` trên tập kiểm thử khóa kín (`Held-out Set`), báo cáo đầy đủ khoảng tin cậy `95% Bootstrap CI`, độ trễ `p50/p95/p99` và tỷ lệ chặn nhầm (`Collateral Damage Rate`).
4. **`MANAGE` (Ứng phó, Khôi phục & Cải tiến Liên tục):**
   - Mọi hành động tự động của `SOAR Ladder` đều có thời hạn tự hết hạn (`TTL`) và nút **Hoàn tác 1 chạm (`1-Click Undo`)**.
   - Biến mỗi sự cố bị chặn thành cơ hội học tập qua `Teachable Block` và `SOC Time-Travel Replay`.

---

## 4. TIÊU CHUẨN AN TOÀN ỨNG DỤNG OWASP ASVS 4.0 LEVEL 2 & CHUỖI CUNG ỨNG (SBOM / SLSA)

### 4.1. Danh mục Kiểm tra OWASP ASVS 4.0 L2 (Đã áp dụng ở Tầm nhìn `H0`)
* **`V1.2 & V4` (Kiến trúc Xác thực & Kiểm soát Truy cập):** Toàn bộ điểm `SEC-XP`, quyết định `PromptGuard` và hành động `SOAR` được tính toán tại Server (`Server-Authoritative`).
* **`V2.10 & V13` (Bảo vệ Khóa Bí mật & API Quản trị):**
  - Endpoint `/api/v1/system/update-keys` bắt buộc kiểm tra địa chỉ gọi là `localhost` (`127.0.0.1` / `::1`) hoặc có header `X-Nova-Admin-Token` hợp lệ.
  - Endpoint `/api/v1/system/integrations-status` chỉ hiển thị khóa đã che mặt nạ (`AIzaSy...xxxx`).
  - Tệp `.gitignore` chặn tuyệt đối `.env`, `.env.local`, `*.key`, `*.pem`.
* **`V12.6` (Chống SSRF):** `SSRFPhishingURLAnalyzer` chặn toàn bộ dải `RFC1918`, `127.0.0.0/8`, `169.254.169.254` và kiểm tra lại ở mỗi bước chuyển hướng.

### 4.2. An toàn Chuỗi Cung ứng Phần mềm (`Supply Chain Security`)
* **Danh mục Thành phần Phần mềm (`CycloneDX SBOM`):** Tạo tự động tệp `sbom.cdx.json` cho cả kho Python (`studenthub-nova`) và kho Node.js/TypeScript (`StudentHub-AI`).
* **Kiểm tra Bí mật Tĩnh trước khi Commit (`Pre-commit Secret Scanning`):** Quét bằng tập luật `gitleaks` / `CodeSecurityAuditor` để đảm bảo `0` khóa API thật lọt vào lịch sử Git.

---

## 5. GIAO THỨC ĐẠO ĐỨC NGHIÊN CỨU TRÊN CON NGƯỜI (`IRB / HUMAN-SUBJECTS ETHICS PROTOCOL`)

Để đủ điều kiện công bố tại các hội nghị khoa học quốc tế hàng đầu (IEEE S&P, USENIX Security, ACM CCS, SIGCSE) và tuân thủ Nghị định 13/2023/NĐ-CP:

1. **Nguyên tắc Đồng ý Tự nguyện Có Hiểu biết (`Informed Consent — Opt-In Only`):**
   - Trong giải đấu **`Prompt Injection League` (`B1`)**, kênh **`Zalo Shield Bot` (`E1`)** và nghiên cứu người dùng **`Teachable Block` (`RQ4`)**, sinh viên được hiển thị bảng giải thích rõ mục đích nghiên cứu và chỉ khi đánh dấu đồng ý (`irb_research_consent_granted = true`) thì mẫu dữ liệu (đã ẩn danh PII) mới được đưa vào bộ dữ liệu khoa học `ViPI-Bench`.
2. **Nguyên tắc Không Gây Hại & Môi trường Cô lập (`Beneficence & No Harm`):**
   - Mọi bài tập trong `Teachable Block`, `Classroom Live Attack` và `Cyber Range` chỉ sử dụng các mẫu payload vô hại đã được vô hiệu hóa (`defanged`) trong môi trường sandbox cô lập (`loopback`), tuyệt đối không hướng dẫn tấn công vào hệ thống bên ngoài.
   - Đối với ý tưởng **`Consent-based Deepfake Drill` (`F3`)**, chỉ thực hiện trên nhóm sinh viên đã đăng ký tình nguyện trước trong khuôn khổ lớp học có giảng viên giám sát và giải thích ngay sau buổi diễn tập (`Immediate Debriefing`).
3. **Quyền Rút lui Bất cứ Lúc nào (`Right to Withdraw`):**
   - Sinh viên tham gia thí điểm có thể rút lại sự đồng ý đóng góp dữ liệu hoặc xóa hồ sơ thực nghiệm của mình bất cứ lúc nào mà không ảnh hưởng đến điểm số học tập hay quyền sử dụng `StudentHub-AI`.
