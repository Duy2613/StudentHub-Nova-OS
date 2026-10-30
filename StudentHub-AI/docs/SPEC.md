# SYSTEM SPECIFICATION v4.0 (INTERNATIONAL RESEARCH & CREATIVE MASTER EDITION): STUDENTHUB-AI (V5 CORE) × NOVA OS (4-LAYER CYBER DEFENSE)
> **Tên đề tài / Dự án:** Thiết kế, Triển khai và Đánh giá Thực nghiệm Kiến trúc Phòng thủ Đa lớp Kép (Nhận thức Học thuật & Hạ tầng An toàn Thông tin 4 Lớp) Tích hợp Bẫy Chủ động (Active Deception), Vòng lặp Dữ liệu Cộng đồng (Data Flywheel) và Hộ chiếu Bằng chứng Sống cho Sinh viên Đông Nam Á (`StudentHub-AI × Nova OS`).
> **Phiên bản:** `4.0.0-InternationalEdition` | **Trạng thái:** Chuẩn hóa Quốc tế (OWASP LLM Top 10 2025, MITRE ATLAS, NIST AI RMF 1.0, W3C VC 2.0, Nghị định 13/2023/NĐ-CP)
> **Kho mã nguồn gốc (Source of Truth):**
> - Production Core: `C:\Users\Duy\Projects\MyProj\StudentHub-AI`
> - Scrollytelling 120FPS & Nova OS Frontend: `D:\MYPROVIPPOJ\StudentHub-AI`
> - Server-Authoritative 4-Layer Backend: `D:\MYPROVIPPOJ\studenthub-nova`

---

## 1. TẦM NHÌN BẮC ĐẨU (NORTH STAR) & 7 ĐÓNG GÓP KHOA HỌC – KỸ THUẬT (`C1` → `C7`)

> **Tầm nhìn Bắc Đẩu (North Star Vision):** *"Lá chắn số cho mọi sinh viên Đông Nam Á: tự bảo vệ trước lừa đảo học đường, an toàn khi sử dụng AI tạo sinh, biến mọi va chạm bảo mật thành bài học thực chiến, và chứng minh năng lực phòng thủ bằng mật mã có thể kiểm chứng độc lập."*
>
> **Chỉ số Bắc Đẩu (North Star Metric):** Số lượng sinh viên được bảo vệ thực tế mỗi tháng **có đo lường kiểm chứng được** (số chiến dịch lừa đảo học đường bị chặn thật, số lỗ hổng đồ án được vá qua cổng SAST + Unit-Test Gate, số bài thực hành phòng thủ hoàn thành và được ký số W3C Verifiable Credentials).

### 1.1. Hai Mặt Trận Rủi Ro Cốt Lõi
1. **Rủi ro Nhận thức & Lừa đảo Học đường (Epistemic & Academic Scam Risks):**
   - Thông báo học bổng/đóng học phí giả mạo theo mùa học vụ, lừa đảo việc làm thêm/thực tập sinh, mã QR độc hại, đánh cắp OTP, mạo danh phòng Đào tạo/Công tác sinh viên qua tên miền đồng hình (`Punycode/IDN Homograph`) và Deepfake giọng nói/hình ảnh.
2. **Rủi ro An toàn Thông tin Hệ thống AI & Đồ án Sinh viên (AI & Infrastructure Cyber Risks):**
   - **(R1) Direct & Indirect Prompt Injection & Confused-Deputy Tool Abuse:** Kẻ tấn công cài chỉ thị ẩn trong giáo trình PDF/Markdown (`RAG Poisoning`) hoặc khung chat để chiếm quyền điều khiển LLM, trích xuất System Prompt hoặc lừa AI Agent gọi công cụ trái phép.
   - **(R2) Session Abuse & Self-Inflicted Campus NAT DoS:** Tấn công Brute-force, Credential Stuffing hoặc cố tình bơm payload độc hại từ mạng Wi-Fi trường đại học/Ký túc xá nhằm kích hoạt cơ chế chặn IP cứng (`AUTO_BLOCK`), làm mất kết nối hàng nghìn sinh viên lành tính dùng chung cổng NAT.
   - **(R3) Vulnerable Student Code & Leaked Repository Secrets:** Sinh viên vô tình đẩy khóa API (`GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`), mật khẩu CSDL hoặc mã nguồn chứa lỗ hổng `CWE-89 (SQLi)`, `CWE-78 (OS Command Injection)`, `CWE-918 (SSRF)`, `CWE-79 (XSS)` lên kho đồ án.

### 1.2. 7 Đóng Góp Khoa Học & Kỹ Thuật Độc Đáo (`C1` → `C7`)
* **`C1` — Kiến trúc Song Kiếm 4 Lớp (`Dual 4-Layer Epistemic × Cyber Defense Architecture`):** Hợp nhất 4 lớp kiểm chứng thông tin nhận thức (`StudentHub-AI Trust V5`) với 4 lớp phòng thủ hạ tầng ATTT (`Nova OS`) qua mặt phẳng kiểm soát Zero-Trust (`SecurityFabric` + `AgenticToolFirewall`) và lược đồ sự kiện `SecurityEvent v2`.
* **`C2` — Phòng Thủ Chủ Động Lớp 1 (`Multi-Stage Prompt Guard` + `Honey-RAG Trap` + `Hybrid LLM Gateway`):** Kết hợp bộ lọc 4 tầng phía Server với **Tài liệu Mồi `Honey-RAG`** (gắn khóa định danh mật mã riêng cho từng đoạn tài liệu mồi để truy vết chính xác tài liệu và phiên bị khai thác Indirect Injection) và `HybridLLMGateway` (ẩn danh PII theo Nghị định 13/2023/NĐ-CP, tự động chuyển đổi dự phòng `Gemini 2.5 Flash` ↔ `OpenAI` ↔ `Ollama Local`).
* **`C3` — Phản Ứng Đa Nấc Bảo Vệ Mạng Trường Lớp 2 (`Graduated SOAR Ladder` + `Adaptive Tarpit` + `Campus NAT Protection`):** Thay thế cơ chế chặn IP cứng bằng thang phản ứng 6 chế độ (`MONITOR` → `STEP_UP_MFA` → `ADAPTIVE_TARPIT` → `THROTTLE` → `QUARANTINE_ACCOUNT` → `BLOCK_IP_PENDING_APPROVAL`) có thời hạn tự mở (`TTL`), bảo vệ tuyệt đối dải IP cổng NAT trường đại học và hỗ trợ **Hoàn tác 1 chạm (`1-Click Undo`)**.
* **`C4` — Kiểm Định Mã Nguồn Độc Lập Lớp 3 (`Deterministic SAST` + `LLM Patch Verify` + `Canary Credentials`):** Kết hợp công cụ phân tích tĩnh xác định (`Semgrep`/`Bandit`/`gitleaks`) với `HybridLLMGateway` (ưu tiên `Ollama Local` cho mã nguồn nhạy cảm), **bắt buộc quét lại SAST = 0 lỗi + kiểm tra cú pháp AST/Unit-Test Gate**, đồng thời cấp **Khóa Bẫy `Canary Credentials`** vào kho đồ án để phát hiện sớm rò rỉ repo.
* **`C5` — Vòng Lặp Dữ Liệu Cộng Đồng (`ViPI-Bench` / `SEA-PI-Bench` & `Prompt Injection League`):** Xây dựng bộ dữ liệu chuẩn mở đầu tiên về Prompt Injection học đường đa ngôn ngữ Đông Nam Á (tiếng Việt, Thái, Indonesia, Tagalog) với tập kiểm thử khóa kín (`Held-out Set`) và giải đấu Red-vs-Blue hợp법 có sự đồng ý đạo đức nghiên cứu (IRB Consent).
* **`C6` — Công Cụ Pháp Y & Sư Phạm Tương Tác 3D (`SOC Time-Travel Replay` & `Teachable Block`):** Tái sử dụng động cơ Scrollytelling 120FPS để tua ngược/xuôi dòng thời gian sự cố bảo mật (`SOC Time-Travel Replay`) và biến mỗi lần chặn thành một bài học vi mô 2 phút (`Teachable Block`).
* **`C7` — Hộ Chiếu Bằng Chứng Sống Chuẩn Quốc Tế (`W3C Verifiable Credentials 2.0 Proof-of-Defense Passport`):** Kết nối sổ cái điểm bảo mật `xp_ledger` (có `Idempotency-Key` và lưu trữ bền vững trên PostgreSQL/Supabase RLS) vào `Living Evidence Passport`, xuất chứng chỉ năng lực ký số `Ed25519` chuẩn **W3C Verifiable Credentials / Open Badges 3.0** để nhà tuyển dụng xác minh độc lập qua mã QR.

---

## 2. QUY ƯỚC NHÃN TRUNG THỰC KHOA HỌC (HONESTY & PROVENANCE LABELS)

Mọi tính năng, endpoint API, cửa sổ ứng dụng trên **Nova OS** và bảng số liệu thực nghiệm bắt buộc gắn nhãn minh bạch:

| Nhãn | Phân loại | Ý nghĩa & Phạm vi áp dụng trong hệ thống v4.0 |
| :--- | :--- | :--- |
| **`[R]` Real** | **Thật 100% (Server-Authoritative)** | • Xác thực OIDC/JWKS, `SecurityFabric`, Localhost/Admin-Token Key Guard, CSRF Guard, RBAC+ABAC+ReBAC.<br>• `MultiStagePromptGuard` (4 tầng + công tắc Ablation), `Honey-RAG Attribution Trap`, `AgenticToolFirewall`.<br>• `PIIRedactor` (Nghị định 13), `HybridLLMGateway` (Gemini + OpenAI + Ollama Local Failover).<br>• `URL Analyzer` chống SSRF (chặn `RFC1918`, `Loopback`, `169.254.169.254`, Punycode/IDN Homograph).<br>• `GraduatedSOARResponder` (bao gồm `Adaptive Tarpit`, `Campus NAT Allowlist`, `TTL`, `1-Click Undo`).<br>• `CodeSecurityAuditor` (SAST xác định + LLM Patch Diff + Mandatory Re-scan + AST/Unit-Test Gate + `Canary Credentials`).<br>• Kiểm tra mật khẩu lộ lọt `k-Anonymity` (5 ký tự đầu SHA-1), `STIX 2.1` Bundle & chữ ký số `W3C Verifiable Credentials`. |
| **`[H]` Hybrid** | **Lai (Thật trên Web/Server, Tích hợp mô phỏng quy mô mở rộng)** | • **Lớp 1 Endpoint Hygiene:** Kiểm tra thật các tín hiệu phiên & trình duyệt (`MFA status`, `WebCrypto`, `k-Anonymity`), không cài Agent cấp Kernel xuống máy tính sinh viên.<br>• **Lớp 2 AI SOC 24/7 & Classroom Live Attack:** Xử lý thật 100% sự kiện từ `SecurityFabric` và `PromptGuard`; cho phép trộn luồng telemetry mô phỏng có gắn cờ `source_mode: "simulated"` để diễn tập lớp học.<br>• **Scam Weather Forecast & Zalo Shield Bot:** Phân tích thật qua pipeline Trust V5 kết hợp lịch học vụ mẫu và Webhook Zalo OA/Bot. |
| **`[S]` Simulated** | **Mô phỏng có kịch bản trong phòng Lab cô lập (Controlled Lab)** | • **Deepfake Shield Lab & Consent-based Drill (Lớp 1):** Bài học tương tác nhận diện dấu hiệu giả mạo âm thanh/video.<br>• **Red-Team Cyber Range Simulator (Lớp 3):** Phát lưu lượng tấn công mẫu cô lập vào loopback pipeline kèm nút `Emergency Stop`.<br>• **Campus Digital Twin (Moonshot F1):** Mô phỏng đa tác tử `SimPy` (1.000+ sinh viên ảo chia sẻ IP NAT trường đại học) để kiểm chứng toán học cho **RQ2**.<br>• **National TAXII Uplink (Lớp 4):** Đồng bộ gói `STIX 2.1` đã duyệt lên `Mock TAXII 2.1 Server` trong lab. |

---

## 3. KIẾN TRÚC VISUAL 120FPS & SƯ PHẠM 3D: SCROLLYTELLING + SOC TIME-TRAVEL REPLAY

### 3.1. Động Cơ Kết Hợp 5 Tầng Không Tái Vẽ React (`120FPS Zero-Re-Render 5-Layer Compositor`)
1. **Tầng 1 — Master 3D Base Plate (`scene1..5_*_ai_enhanced.jpg/.webp`):** 5 bức ảnh 3D Octane/UE5 sạch 100% watermark và không bị nướng HUD tĩnh, dịch chuyển 2.5D Depth Parallax bằng biến CSS `-- scroll-progress` và `requestAnimationFrame` trực tiếp trên GPU (`will-change: transform`).
2. **Tầng 2 — Clean-Plate Motion Video Blend (`scene1..5_studenthub_novaos_loop.webm`):** Hòa trộn chuyển động hạt và ánh sáng ở chế độ Clean Plate.
3. **Tầng 3 — `CinematicTransitionDirector.tsx` (WebGL / Canvas2D Seamless Transition Bridge):** Video/Shader cầu nối che phủ hoàn toàn khoảnh khắc chuyển cảnh giữa 5 Scene theo đúng vận tốc cuộn chuột (`Scroll-Velocity Linked Portal, Shockwave, Ember & Laser Grid`).
4. **Tầng 4 — Interactive Procedural FX & `SOC Time-Travel Replay` Scrubbing:** Cho phép dùng chính thanh cuộn thời gian 120FPS để **tua ngược/tua xuôi một sự cố bảo mật (`SOC Time-Travel Replay`)** nhằm quan sát từng gói tin tấn công, quyết định của `PromptGuard`, mã bẫy `Honey-RAG` và nấc thang `SOAR` tại từng mili-giây.
5. **Tầng 5 — Live React HUD & `Work Mode` Toggle (`Idea C6`):** Hỗ trợ chuyển đổi tức thì giữa **Chế độ Điện ảnh 3D (`Cinematic Scrollytelling Mode`)** khi trình diễn/học tập và **Chế độ Làm việc Tối giản (`Zero-Distraction Work Mode`)** khi sinh viên và giảng viên sử dụng hằng ngày.

### 3.2. Bảng Đặc Tả 5 Phân Cảnh Scrollytelling (`-18%` → `100%`)
| Scene | Dải Tiến Trình | Tài nguyên Hình ảnh & Video | Hiệu ứng Chuyển cảnh & Tương tác | Kết nối Nghiệp vụ & `xp_ledger` |
| :--- | :---: | :--- | :--- | :--- |
| **Scene 1: Ảo Tưởng Bảo Mật Đơn Lớp (`The Fragile AI Utopia`)** | `-18% → 0%` | `scene1_utopia_ai_enhanced.jpg` + `scene1_studenthub_novaos_loop.webm` | 2.5D Hand Parallax + Sakura Motes + `TAP & HOLD (1.5s)` tạo sóng xung kích chuyển sang cảnh vỡ kính. | Mở màn câu chuyện & nhận `+100 SEC-XP` (`SCENE_1_SHATTER`). |
| **Scene 2: Sự Thật Vỡ Toác (`The Glass Shatter`)** | `0% → 25%` | `scene2_shatter_ai_enhanced.jpg` + `scene2_studenthub_novaos_loop.webm` | Voronoi Glass Shatter + Chromatic RGB Split + 3 thẻ lỗ hổng 3D (`R1 Prompt Injection`, `R2 Campus NAT DoS`, `R3 Vulnerable Code`). | Thông điệp chuẩn hóa: ***"Nhưng sự thật thì khác: chỉ một lớp là chưa đủ."*** (`+100 SEC-XP`). |
| **Scene 3: Đốt Bỏ Quy Tắc Cũ & Kiến Trúc 4 Lớp (`Burn & 4-Layer Shield`)** | `25% → 55%` | `scene3_burn_ai_enhanced.jpg` + `scene3_studenthub_novaos_loop.webm` | Procedural Perlin Fire Burn Mask + 4 vòng khiên Hologram xoay ngược chiều (`L1`, `L2`, `L3`, `L4`). | Đối sánh trực quan **Song Kiếm 4 Lớp (`Trust V5` × `Nova OS`)** (`+100 SEC-XP`). |
| **Scene 4: Cổng Kích Hoạt Nova OS (`The Cloud Portal`)** | `55% → 80%` | `scene4_portal_ai_enhanced.jpg` + `scene4_studenthub_novaos_loop.webm` | Z-Axis Camera Warp Tunnel xuyên qua cổng mây khi giữ nút `HOLD TO INITIALIZE NOVA OS`. | Mở khóa `NovaDesktop` (`+100 SEC-XP`). |
| **Scene 5: Thành Phố Phòng Thủ Isometric 3D (`Cyber-Defense City`)** | `80% → 100%` | `scene5_city_ai_enhanced.jpg` + `scene5_studenthub_novaos_loop.webm` | Mạng lưới xung dữ liệu Isometric + **5 điểm nóng 3D (`Core`, `L1`, `L2`, `L3`, `L4`)** mở thẳng từng ứng dụng trong `Nova OS`. | Đạt tối đa `500 Intro SEC-XP` & vào không gian làm việc **Nova OS**. |

---

## 4. CÂY SÁNG TẠO 24 TÍNH NĂNG ĐỘT PHÁ & LỘ TRÌNH 4 TẦM NHÌN (`H0` → `H3`)

### 4.1. Ma Trận 6 Nhánh Sáng Tạo Tích Hợp Vào Kiến Trúc 4 Lớp
1. **Nhánh A — Chủ động Bẫy Kẻ Tấn Công (`Active Deception`):**
   - `A1` **Honey-RAG Trap (L1 → L2):** Tài liệu mồi trong kho RAG chứa mã định danh `HONEY-RAG-DOC-xxxx` để truy vết chính xác tài liệu và phiên khai thác Indirect Prompt Injection.
   - `A2` **Canary Credentials trong Đồ án (L3 → L2):** Cấp khóa API giả có gắn bẫy theo dõi cho mỗi kho đồ án sinh viên để phát hiện rò rỉ repo tức thì.
   - `A3` **Campus Micro-Honeypot (L2):** Cảm biến honeypot nhẹ trong mạng lab/KTX đẩy telemetry tấn công thật về Lớp 2.
   - `A4` **Adaptive Tarpit (L2):** Nấc thang làm chậm lũy tiến (`200ms → 2500ms`) kèm phản hồi mồi vô hại trước khi khóa phiên, giảm tối đa tác động lên sinh viên bị nghi nhầm.
2. **Nhánh B — Vòng Lặp Dữ Liệu Tự Lớn (`Data Flywheel & Open Benchmarks`):**
   - `B1` **Prompt Injection League:** Giải đấu Red-vs-Blue theo mùa cho sinh viên toàn quốc thử sức vượt `PromptGuard`, thu thập mẫu tấn công tiếng Việt có sự đồng ý (`IRB Consent`).
   - `B2` **Red vs Blue Agent Arena:** Vòng lặp đối kháng tự động giữa Attacker Agent và Defender Guard, chấm điểm trên tập `Held-out Set` cố định.
   - `B3` **ViPI-Bench → SEA-PI-Bench:** Bộ dữ liệu chuẩn mở gồm $\ge 2.000$ mẫu Prompt Injection học đường tiếng Việt và mở rộng sang Đông Nam Á (Thái, Indonesia, Tagalog).
   - `B4` **Public Guard Leaderboard:** Bảng xếp hạng công khai cho các mô hình bảo vệ AI ngôn ngữ Đông Nam Á.
3. **Nhánh C — Sư Phạm & Trải Nghiệm Thực Chiến (`Pedagogical Cyber Defense`):**
   - `C1` **SOC Time-Travel Replay:** Dùng thanh cuộn Scrollytelling để tua lại từng bước của một cuộc tấn công và trạng thái SOAR.
   - `C2` **Incident-to-Scrollytelling Generator:** Tự động chuyển hóa sự cố bảo mật đã ẩn danh thành câu chuyện 5 cảnh phục vụ giảng dạy.
   - `C3` **Classroom Live Attack:** Chế độ lớp học trực tiếp kiểu Kahoot — giảng viên phát đợt tấn công mẫu, cả lớp cùng phòng thủ trên Nova OS.
   - `C4` **Teachable Block:** Khi sinh viên bị chặn bởi Lớp 1 hoặc Lớp 3, hệ thống giải thích ngay kỹ thuật vừa chạm phải và mở bài lab khắc phục 2 phút.
   - `C5` **Policy-as-Code Dojo:** Sân tập viết luật `Sigma` / `Rego` có chấm điểm tự động bằng cách phát lại lưu lượng tấn công thật.
   - `C6` **Work Mode Toggle:** Chuyển đổi 1 chạm giữa giao diện 3D Scrollytelling và giao diện làm việc tối giản hằng ngày.
4. **Nhánh D — Dự Báo & Trí Tuệ Tập Thể (`Forecasting & Collective Intelligence`):**
   - `D1` **Scam Weather Forecast:** Dự báo nguy cơ lừa đảo theo lịch học vụ (tuần nhập học, đóng học phí, xét học bổng, kỳ thực tập).
   - `D2` **Vulnerability Genome:** Bản đồ lỗ hổng mã nguồn (`CWE`) theo từng môn học và khóa sinh viên để phản hồi cho chương trình đào tạo.
   - `D3` **Federated Scam Detector:** Học liên kết bảo toàn quyền riêng tư (`Federated Learning + Differential Privacy`) giữa nhiều trường đại học.
   - `D4` **Campaign Clustering:** Gom cụm các tin nhắn/URL lừa đảo cùng chiến dịch để cảnh báo sớm toàn trường.
5. **Nhánh E — Hệ Sinh Thái & Chuẩn Xác Thực Quốc Tế (`Ecosystem & Credentials`):**
   - `E1` **Zalo Shield Bot:** Kênh kiểm tra nhanh tin nhắn/link/QR đáng ngờ trong 3 giây qua Zalo.
   - `E2` **Proof-of-Defense W3C Verifiable Credentials:** Xuất `Living Evidence Passport` theo chuẩn **W3C VC 2.0 / Open Badges 3.0** có chữ ký số `Ed25519`.
   - `E3` **LTI 1.3 LMS & GitHub App Integration:** Tích hợp bài lab vào Moodle/Canvas và tự động nhận xét lỗ hổng trên Pull Request đồ án.
   - `E4` **Browser Link Guardian & Voice Check (`E5`):** Tiện ích trình duyệt chống giả mạo cổng đăng nhập `.edu.vn` và kiểm tra bằng giọng nói cho sinh viên khiếm thị.
6. **Nhánh F — Moonshot Nghiên Cứu (`Research Moonshots`):**
   - `F1` **Campus Digital Twin:** Bản sao số mạng trường đại học bằng `SimPy` với 1.000+ tác tử sinh viên ảo để kiểm chứng SOAR trước khi áp dụng thật.
   - `F2` **Agentic Tool Firewall:** Tường lửa kiểm soát chuỗi hành động (`Action-Graph Capability Firewall`) cho AI Agent theo ngữ cảnh.
   - `F3` **Consent-based Deepfake Drill:** Diễn tập nhận diện cuộc gọi/video Deepfake cho sinh viên đã đăng ký tham gia tự nguyện có phê duyệt đạo đức.
   - `F4` **Formal Verification for SOAR (TLA+/Alloy):** Chứng minh hình thức bất biến *"Không bao giờ khóa toàn bộ IP Campus NAT nếu chưa có phê duyệt của Admin"*.

### 4.2. Lộ Trình Triển Khai 4 Tầm Nhìn (`H0` → `H3`)
| Tầm nhìn | Khung thời gian | Hạng mục Trọng tâm | Chỉ số Nghiệm thu (KPIs & Verification Gates) |
| :--- | :---: | :--- | :--- |
| **`H0` — Nền móng An toàn & Trung thực** | Tháng 0 – 1 | • Khóa xác thực `localhost`/Admin Token cho `/api/v1/system/update-keys`, siết `CORS`, chuẩn hóa `.gitignore`.<br>• Lưu trữ bền vững trên `Supabase PostgreSQL + RLS`.<br>• Tách biệt hoàn toàn **Smoke Test** và **Held-out Empirical Eval** (loại bỏ mọi hằng số viết cứng). | • `0` endpoint quản trị không xác thực.<br>• `100%` dữ liệu `xp_ledger`, `security_events`, `evidence_passports` bền vững sau khi khởi động lại.<br>• `0` hằng số giả trong `eval_engine.py`. |
| **`H1` — Khác biệt Nhanh & Benchmark v1** | Tháng 1 – 3 | • Triển khai **Honey-RAG (`A1`)**, **Canary Credentials (`A2`)**, **Adaptive Tarpit (`A4`)**, **Teachable Block (`C4`)**, **SOC Time-Travel Replay (`C1`)**.<br>• Công bố bộ dữ liệu **`ViPI-Bench v1.0`** ($\ge 2.000$ mẫu). | • `ViPI-Bench` đạt $\ge 2.000$ mẫu (chia `Train/Dev/Held-out`).<br>• Báo cáo thực nghiệm có khoảng tin cậy `95% CI` và đối sánh với $\ge 2$ baseline quốc tế thật (`Llama Guard 3`, `Semgrep`). |
| **`H2` — Hệ sinh thái & Pilot Thực tế** | Tháng 3 – 9 | • Mở giải đấu **Prompt Injection League (`B1`)**, **Zalo Shield Bot (`E1`)**, **Classroom Live Attack (`C3`)**, **W3C Verifiable Credentials Passport (`E2`)**.<br>• Triển khai thí điểm (Pilot) tại ít nhất 1 Khoa CNTT. | • $\ge 300$ sinh viên tham gia thử nghiệm thực tế.<br>• Điểm khả dụng **SUS $\ge 75$**, cải thiện điểm nhận thức bảo mật sau bài học `Teachable Block` có ý nghĩa thống kê ($p < 0.01$). |
| **`H3` — Moonshot Khu vực Đông Nam Á** | Tháng 9 – 24 | • Hoàn thiện **Campus Digital Twin (`F1`)**, **Agentic Tool Firewall (`F2`)**, **SEA-PI-Bench & Public Leaderboard (`B3/B4`)**, **Federated Scam Detector (`D3`)**. | • $\ge 3$ trường đại học liên kết thử nghiệm.<br>• Bài báo khoa học nộp hội nghị/tạp chí quốc tế uy tín (IEEE S&P / USENIX / CCS /ACNS / Q1 Journal). |

---

## 5. THIẾT KẾ THỰC NGHIỆM KHOA HỌC TÁI LẬP ĐƯỢC (`RQ1` → `RQ4`)

> **Chi tiết giao thức thống kê và bộ dữ liệu chuẩn xem tại:** [`docs/BENCHMARK_PROTOCOL.md`](file:///d:/MYPROVIPPOJ/docs/BENCHMARK_PROTOCOL.md)

| Mã RQ | Câu hỏi Nghiên cứu | Tập Dữ liệu Chuẩn (Held-out Datasets) | Chỉ số Đo lường (èm `95% Bootstrap CI`) | Các Cấu hình Đối chứng Thực tế (Real Baselines & Ablation) |
| :--- | :--- | :--- | :--- | :--- |
| **`RQ1` (Lớp 1)** | Bộ `MultiStagePromptGuard` kết hợp `Honey-RAG Trap` và `AgenticToolFirewall` giảm tỉ lệ tấn công thành công (Direct, Indirect RAG & Tool Abuse) như thế nào so với các công cụ quốc tế? | **`ViPI-Bench v1.0` Held-out Set** (gồm Direct Jailbreak, Indirect RAG Poisoning, Homoglyph/Base64, và câu hỏi học thuật lành tính chứa từ khóa `SELECT *`, `kill -9`, `chmod 777`). | • **ASR** (Attack Success Rate %)<br>• **TPR / FPR (%)**, **Macro-F1**, **AUROC**<br>• **Honey-RAG Attribution Accuracy (%)**<br>• **Latency p50 / p95 / p99 (ms)** | 1. `No Guard` (Raw LLM)<br>2. `Meta Llama Guard 3 / Prompt Guard`<br>3. `Stage 1..4 Ablation Variants`<br>4. `Full Nova L1 Guard + Honey-RAG + AgenticToolFirewall` |
| **`RQ2` (Lớp 2)** | Cơ chế `Graduated SOAR Ladder` + `Adaptive Tarpit` + `Campus NAT Allowlist` giảm tỉ lệ chặn nhầm sinh viên cùng mạng trường bao nhiêu lần so với `Hard IP Auto-Block`? | **Luồng mô phỏng đa tác tử `SimPy Campus Digital Twin`**: 500–1.000 sinh viên lành tính dùng chung IP NAT (`203.162.4.190`) + 5–20 tác tử tấn công thực hiện Brute-force, Credential Stuffing và RAG Probing. | • **Collateral Damage Rate (False Block Rate %)**<br>• **Attacker Containment Rate (%)**<br>• **MTTD / MTTR (ms)**<br>• **Undo Recovery Latency (ms)** | 1. `Alert-Only` (SIEM thụ động)<br>2. `Fail2ban / Hard IP Auto-Block` (`score >= 85`)<br>3. `Session-Only Rate Limit`<br>4. `Nova Graduated SOAR v4 + Adaptive Tarpit + Campus NAT Guard` |
| **`RQ3` (Lớp 3)** | Quy trình `Deterministic SAST + HybridLLM Patch + Mandatory Re-scan + AST/Unit-Test Gate` nâng tỉ lệ bản vá vừa hết lỗ hổng vừa chạy đúng chức năng lên bao nhiêu? | **Tập 100+ mẫu mã nguồn đồ án sinh viên** (Python, JS/TS, SQL) có bộ kiểm thử đơn vị (`pytest` / `vitest`) bao phủ `CWE-89`, `CWE-78`, `CWE-798`, `CWE-918`, `CWE-79`. | • **Detection Precision / Recall / F1 (%)**<br>• **Verified Safe & Functional Patch Rate (%)** (`Rescan == 0` **VÀ** `UnitTests == PASS`)<br>• **PII Leak Rate to Cloud (%)** | 1. `Standalone Semgrep / Bandit` (Chỉ phát hiện)<br>2. `Raw Cloud LLM Patching` (Không có SAST dẫn đường)<br>3. `Nova L3 SAST + HybridLLM + Mandatory Re-scan + Unit-Test Gate` |
| **`RQ4` (Sư phạm & UX)** | Cơ chế `Teachable Block` và `SOC Time-Travel Replay` cải thiện nhận thức an toàn thông tin và giảm tỷ lệ tái phạm lỗi của sinh viên như thế nào? | **Nghiên cứu người dùng thực nghiệm (IRB-Approved User Study)** với sinh viên CNTT/Kinh tế thực hiện nhiệm vụ trên `Nova OS`. | • **Pre/Post Security Quiz Gain (%)**<br>• **Repeat Violation Rate (%)**<br>• **System Usability Scale (SUS)** & **NASA-TLX Cognitive Load** | 1. `Static Error Banner` (Chỉ báo lỗi "Bị chặn")<br>2. `Nova Teachable Block + 2-Min Interactive Lab + SOC Time-Travel Replay` |
