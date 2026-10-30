---
name: studenthub-nova-architect
description: Senior International Architecture (v4.0), 120FPS Hybrid 3D Scrollytelling & SOC Time-Travel Replay Engine, 4-Layer Server-Authoritative Cyber Defense + Active Deception (Honey-RAG, Canary Credentials, Adaptive Tarpit), Data Flywheel (ViPI-Bench, Prompt Injection League), and W3C Verifiable Credentials Living Evidence Passport integration skill for StudentHub-AI × Nova OS.
---

# StudentHub-AI × Nova OS International Master Architect Skill (`SKILL.md` v4.0)

## 1. Mục đích & Phạm vi Kích hoạt (When to Use)
Kích hoạt Skill này bất cứ khi nào thiết kế, nâng cấp, kiểm toán hoặc phát triển tính năng cho:
- **Kho Production Core:** `C:\Users\Duy\Projects\MyProj\StudentHub-AI`
- **Kho Scrollytelling 120FPS & Nova OS Frontend:** [`D:\MYPROVIPPOJ\StudentHub-AI`](file:///d:/MYPROVIPPOJ/StudentHub-AI)
- **Kho Server-Authoritative 4-Layer Backend:** [`D:\MYPROVIPPOJ\studenthub-nova`](file:///d:/MYPROVIPPOJ/studenthub-nova)
- **Bộ Tài liệu Đặc tả Chuẩn Quốc tế v4.0:**
  - [`docs/SPEC.md`](file:///d:/MYPROVIPPOJ/docs/SPEC.md)
  - [`docs/SKILLS.md`](file:///d:/MYPROVIPPOJ/docs/SKILLS.md) (28 Hợp đồng Kỹ năng chuẩn hóa)
  - [`docs/ARCHITECTURE.md`](file:///d:/MYPROVIPPOJ/docs/ARCHITECTURE.md)
  - [`docs/THREAT_MODEL.md`](file:///d:/MYPROVIPPOJ/docs/THREAT_MODEL.md)
  - [`docs/DATA_PRIVACY.md`](file:///d:/MYPROVIPPOJ/docs/DATA_PRIVACY.md)
  - [`docs/COMPLIANCE_AND_ETHICS.md`](file:///d:/MYPROVIPPOJ/docs/COMPLIANCE_AND_ETHICS.md)
  - [`docs/BENCHMARK_PROTOCOL.md`](file:///d:/MYPROVIPPOJ/docs/BENCHMARK_PROTOCOL.md)

---

## 2. 8 Quy Tắc Kiến Trúc Bất Biến Cấp Quốc Tế (Mandatory International Invariants v4.0)

1. **Server-Authoritative & Fail-Closed (`[R]` / `[H]` / `[S]`):**
   - Mọi quyết định bảo mật (chặn Prompt Injection, tính điểm `SEC-XP`, phản ứng `SOAR`, xác nhận bản vá `SAST`, ký số `W3C VC`) bắt buộc thực thi tại Server.
   - Khi gặp lỗi hoặc timeout, luôn trả về `BLOCK`, `QUARANTINE` hoặc `UNKNOWN` — không bao giờ mặc định trả về `SAFE` hay `ALLOW`.
   - Hiển thị rõ huy hiệu minh bạch **`[R]` Real**, **`[H]` Hybrid**, **`[S]` Simulated** trên mọi cửa sổ `Nova OS` và báo cáo thực nghiệm.

2. **Khóa Cứng Quản Trị Bí Mật & Chống Rò Rỉ Khóa (`H0 Secret & Admin Hygiene`):**
   - Endpoint `/api/v1/system/update-keys` bắt buộc chỉ chấp nhận yêu cầu từ `localhost` (`127.0.0.1` / `::1`) kèm kiểm tra `X-Nova-Admin-Token`, và chỉ ghi vào `.env.local` nội bộ của dự án.
   - Tệp `.gitignore` luôn chặn `.env`, `.env.local`, `*.pem`, `*.key`.

3. **Bảo vệ Dữ liệu Cá nhân & Chủ quyền AI (Nghị định 13/2023/NĐ-CP & OWASP LLM02):**
   - Mọi prompt và mã nguồn gửi tới LLM bắt buộc đi qua `PIIRedactor` (che Email, SĐT, CCCD, MSSV, API Key) và gắn `Canary Token`.
   - Mã nguồn đồ án (`sensitivity == "HIGH"`) hoặc khi hết hạn mức Cloud (`429 Quota`) tự động định tuyến/Failover sang **`Ollama Local`**.

4. **Chủ Động Bẫy Kẻ Tấn Công (`Active Deception`: `Honey-RAG` + `Canary Credentials` + `Adaptive Tarpit`):**
   - Cài đặt các đoạn mồi **`Honey-RAG` (`HONEY-RAG-DOC-xxxx`)** vào kho tri thức để truy vết chính xác tài liệu và phiên khai thác Indirect Prompt Injection.
   - Cấp khóa giả **`Canary Credentials` (`NOVA_CANARY_KEY_...`)** vào đồ án sinh viên để phát hiện sớm rò rỉ repo.
   - Sử dụng **`Adaptive Tarpit`** (làm chậm lũy tiến `200ms → 2500ms`) trước khi cô lập phiên đáng ngờ.

5. **Bảo vệ Dải IP Cổng NAT Trường Đại Học (`Campus NAT Allowlist` ở Lớp 2 SOAR):**
   - Tuyệt đối không dùng lệnh `AUTO_BLOCK` cứng theo IP đối với dải mạng Ký túc xá / Wi-Fi trường đại học (`203.162.4.190`, `203.162.10.1`, `14.161.0.0/16`).
   - Áp dụng thang phản ứng `MONITOR` → `STEP_UP_MFA` → `ADAPTIVE_TARPIT` → `THROTTLE` → `QUARANTINE_ACCOUNT` → `BLOCK_IP_PENDING_APPROVAL` có `TTL` và **`1-Click Undo`**.

6. **Kiểm định Mã nguồn 3 Cổng (`SAST + AST Syntax + Unit-Test Gate` ở Lớp 3):**
   - Bản vá mã nguồn do `HybridLLMGateway` sinh ra bắt buộc vượt qua: (1) Quét lại SAST xác định = `0` lỗi, (2) Kiểm tra cây cú pháp `AST` hợp lệ (không xóa trắng hàm), và (3) Kiểm thử đơn vị chức năng (`Unit-Test Gate`) trước khi nhận nhãn `VERIFIED_SAFE`.

7. **120FPS Zero-Re-Render Scrollytelling, `SOC Time-Travel Replay`, `Teachable Block` & `Work Mode`:**
   - Duy trì kiến trúc cập nhật biến CSS `--scroll-progress` trực tiếp trên GPU (0 React state re-render khi lăn chuột), kết hợp `CinematicTransitionDirector.tsx` che mượt chuyển cảnh giữa 5 Scene, hỗ trợ tua thời gian sự cố `SOC Time-Travel Replay`, mở bài học 2 phút `Teachable Block` khi bị chặn, và có công tắc chuyển nhanh sang `Work Mode`.

8. **Thực Nghiệm Trung Thực Tái Lập Được (`Zero Hardcoded Metrics` & `95% Bootstrap CI`):**
   - Tách bạch rõ `Pilot Smoke Suite` và `Held-out Benchmark` (`ViPI-Bench` / `SEA-PI-Bench` + `SimPy Campus Digital Twin`); mọi con số trong `eval_engine.py` phải được tính trực tiếp từ lần chạy thật kèm khoảng tin cậy `95% CI`.

---

## 3. Danh Mục 28 Hợp Đồng Kỹ Năng Hệ Thống (`docs/SKILLS.md` v4.0)
- **Nhóm A (Lớp 1–4 & Active Deception — 12 Skills):** `prompt_guard@3`, `phishing_and_url_analyzer@3`, `endpoint_hygiene_inspector@3`, `honey_rag_trap@1`, `agentic_tool_firewall@1`, `soc_anomaly_detector@3`, `soar_responder@3`, `adaptive_tarpit@1`, `code_security_auditor@3`, `canary_credential_injector@1`, `cyber_range_simulator@3`, `threat_intel_synchronizer@3`.
- **Nhóm B (Trust V5, Data Flywheel & Ecosystem — 10 Skills):** `four_layer_epistemic_verifier@5`, `hybrid_llm_gateway@3`, `academic_copilot@3`, `living_evidence_passport_binder@3` (kèm `W3C VC 2.0`), `security_fabric_pdp@3`, `xp_ledger@3`, `prompt_injection_league@1`, `scam_weather_engine@1`, `vulnerability_genome@1`, `zalo_shield_bot@1`.
- **Nhóm C (Visual 120FPS, Pedagogical Replay & Moonshots — 6 Skills):** `zero_scrollytelling_compositor@4`, `nova_os_desktop_environment@4`, `soc_time_travel_replay@1`, `teachable_block_coach@1`, `classroom_live_attack@1`, `campus_digital_twin@1`.

---

## 4. Liên Kết Các Kỹ Năng Chuyên Biệt Cùng Hệ Sinh Thái (`.agent/skills/`)
- Khi triển khai **Honey-RAG, Canary Credentials, Adaptive Tarpit, SOC Time-Travel Replay, Teachable Block**: đọc thêm [`.agent/skills/deception-and-soc-replay/SKILL.md`](file:///d:/MYPROVIPPOJ/.agent/skills/deception-and-soc-replay/SKILL.md).
- Khi xây dựng **`ViPI-Bench`, `Prompt Injection League`, `SimPy Campus Digital Twin` và chạy thực nghiệm `RQ1..RQ4`**: đọc thêm [`.agent/skills/vipi-benchmark-and-redteam/SKILL.md`](file:///d:/MYPROVIPPOJ/.agent/skills/vipi-benchmark-and-redteam/SKILL.md).
- Khi kiểm toán **H0 Security, OWASP ASVS/LLM Top 10, Nghị định 13 DPIA, W3C Verifiable Credentials Passport & Zalo Shield Bot**: đọc thêm [`.agent/skills/compliance-and-verifiable-credentials/SKILL.md`](file:///d:/MYPROVIPPOJ/.agent/skills/compliance-and-verifiable-credentials/SKILL.md).
