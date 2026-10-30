# DATA PRIVACY, DPIA & SOVEREIGN AI SPECIFICATION v4.0 (`DATA_PRIVACY.md`)
> **Tham chiếu Pháp lý & Tiêu chuẩn Quốc tế:**
> 1. **Nghị định 13/2023/NĐ-CP** của Chính phủ Việt Nam về Bảo vệ dữ liệu cá nhân (bao gồm Hồ sơ Đánh giá Tác động Xử lý Dữ liệu Cá nhân — **DPIA**).
> 2. **Luật An ninh mạng Việt Nam** & Mô hình Bảo đảm An toàn Thông tin **4 Lớp** của Bộ Thông tin & Truyền thông / Cục An toàn thông tin.
> 3. **GDPR (EU 2016/679)**, **EU AI Act (High-Risk Educational AI Transparency)** & **ISO/IEC 27701 / 42001**.
> 4. **OWASP Top 10 for LLM Applications (2025)** — `LLM02: Sensitive Information Disclosure`.

---

## 1. PHÂN LOẠI DỮ LIỆU & NGUYÊN TẮC THU THẬP TỐI THIỂU (`DATA MINIMIZATION MATRIX v4.0`)

| Phân nhóm | Các trường dữ liệu cụ thể | Cơ chế Bảo vệ Bắt buộc ở Phía Server | Thời hạn Lưu trữ (Retention Policy) |
| :--- | :--- | :--- | :--- |
| **1. Dữ liệu Cá nhân Cơ bản** | Họ tên hiển thị, Email sinh viên (`.edu.vn`), Mã số sinh viên (MSSV), Số điện thoại. | • Mã hóa khi lưu trữ trên Supabase PostgreSQL + RLS.<br>• Che tự động 100% bằng `PIIRedactor` (`[REDACTED_EMAIL]`, `[REDACTED_VN_PHONE]`, `[REDACTED_STUDENT_ID]`) trước khi gửi qua bất kỳ mô hình LLM nào. | Lưu trong thời gian tài khoản hoạt động; xóa/ẩn danh tức thì khi sinh viên yêu cầu xóa tài khoản. |
| **2. Dữ liệu Cá nhân Nhạy cảm & Xác thực** | Mật khẩu, khóa bí mật MFA TOTP, số CCCD/CMND (nếu sinh viên vô tình dán vào khung chat), Token phiên. | • Mật khẩu băm `Argon2id`; kiểm tra lộ lọt mật khẩu chỉ nhận **5 ký tự đầu của SHA-1 (`k-Anonymity`)**.<br>• CCCD 12 số bị `PIIRedactor` cắt bỏ tức thì (`[REDACTED_CCCD]`).<br>• Cookie phiên đặt cờ `HttpOnly`, `Secure`, `SameSite=Lax`. | Token phiên tự động hết hạn theo TTL; tuyệt đối không lưu mật khẩu rõ hoặc toàn bộ mã băm SHA-1. |
| **3. Tài sản Trí tuệ của Sinh viên (Mã nguồn Đồ án & Học liệu)** | Đoạn mã nguồn đồ án gửi kiểm định tại Lớp 3 (`Layer3AuditPentest`), câu hỏi học tập RAG tại Lớp 1 (`StudentHubApp`). | • Quét và che toàn bộ API Key / Secret thật (`[REDACTED_API_SECRET]`) trước khi xử lý.<br>• Gắn nhãn `sensitivity = "HIGH"` để `HybridLLMGateway` ưu tiên xử lý cục bộ qua **`Ollama Local`** (dữ liệu không rời khỏi máy chủ trường).<br>• **Zero-Content Logging:** Bảng nhật ký chỉ ghi độ trễ, số token và tên model — không ghi nội dung code hay câu hỏi. | Xóa bộ nhớ đệm ngay sau khi trả kết quả quét SAST & bản vá. |
| **4. Dữ liệu Đóng góp Cộng đồng (`Prompt Injection League`, `ViPI-Bench`, `Zalo Shield Bot`)** | Câu lệnh thử nghiệm vượt rào (`Prompt Injection`), tin nhắn/URL nghi ngờ lừa đảo do sinh viên gửi. | • Chỉ đưa vào kho nghiên cứu `ViPI-Bench` khi sinh viên bật cờ **Đồng ý Đạo đức Nghiên cứu (`irb_research_consent_granted = true`)**.<br>• Tự động chạy `PIIRedactor` 2 lượt và băm một chiều có muối (`salted SHA-256`) đối với định danh người gửi. | Lưu trữ ẩn danh vĩnh viễn cho tập benchmark khoa học mở; cho phép rút lại sự đồng ý đối với các mẫu chưa xuất bản. |
| **5. Hộ chiếu Bằng chứng Sống & Chứng chỉ `W3C Verifiable Credentials 2.0`** | Cột mốc `SEC-XP`, danh sách kỹ năng phòng thủ đã hoàn thành, chữ ký số `Ed25519`/`HMAC-SHA256`. | • Hỗ trợ **Tiết lộ Có Chọn lọc (`Selective Disclosure`)**: sinh viên chỉ chia sẻ mã định danh chứng chỉ và các cột mốc năng lực muốn công khai cho nhà tuyển dụng mà không lộ điểm số môn học hay lịch sử bị chặn. | Do sinh viên toàn quyền kiểm soát, xuất JSON-LD hoặc thu hồi (`Revocation List`) bất cứ lúc nào. |

---

## 2. KIẾN TRÚC BẢO VỆ QUYỀN RIÊNG TƯ TRÊN 4 LUỒNG DỮ LIỆU TRỌNG YẾU

### 2.1. Luồng 1 — Trước và Sau khi Gọi Mô hình AI (`Pre-Flight & Post-Flight Privacy Guard`)
1. **Lọc Đầu vào (`PIIRedactor.redact` trong [`llm_gateway.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/core/llm_gateway.py)):**
   - Email $\rightarrow$ `[REDACTED_EMAIL]`
   - Số điện thoại Việt Nam (`03x`, `05x`, `07x`, `08x`, `09x`, `+84...`) $\rightarrow$ `[REDACTED_VN_PHONE]`
   - Số CCCD 12 chữ số $\rightarrow$ `[REDACTED_CCCD]`
   - Mã số sinh viên (MSSV) $\rightarrow$ `[REDACTED_STUDENT_ID]`
   - Khóa bí mật (`sk-...`, `AIza...`, `ghp_...`, `sbp_...`) $\rightarrow$ `[REDACTED_API_SECRET]`
2. **Định tuyến Tôn trọng Chủ quyền Dữ liệu (`Sovereign Local Failover`):**
   - Khi sinh viên chọn chế độ **`FORCE_LOCAL_OLLAMA`** hoặc gửi mã nguồn đồ án (`sensitivity = "HIGH"`), dữ liệu được xử lý 100% bởi mô hình nội bộ (`Ollama Local`), không đi qua đường truyền xuyên biên giới (tuân thủ Điều 25 Nghị định 13/2023/NĐ-CP về chuyển dữ liệu cá nhân ra nước ngoài).
3. **Kiểm tra Đầu ra (`Post-Flight Canary & Honey-RAG Check`):**
   - Kiểm tra câu trả lời của LLM để đảm bảo không rò rỉ `Canary Token` hay `Honey-RAG Token` trước khi trả về trình duyệt.

### 2.2. Luồng 2 — Chia sẻ Tình báo Liên trường, `Scam Weather` & `Vulnerability Genome` (`k-Anonymity` $k \ge 5$)
* Mọi gói tin cảnh báo `STIX 2.1`, bản tin `Scam Weather Forecast` và thống kê `Vulnerability Genome` theo môn học bắt buộc vượt qua 3 cổng:
  1. **Tước bỏ định danh (`PII Strip`):** Xóa hoàn toàn IP nội bộ của sinh viên, email và tên tài khoản.
  2. **Ngưỡng ẩn danh $k \ge 5$ (`k-Anonymity Gate`):** Chỉ xuất thống kê hoặc cảnh báo khi có ít nhất $k = 5$ phiên/đơn vị độc lập ghi nhận.
  3. **Kiểm duyệt Con người (`Human-in-the-Loop TLP Approval`):** Quản trị viên bắt buộc xác nhận nhãn phân phối (`TLP:CLEAR`, `TLP:GREEN`, `TLP:AMBER`).

### 2.3. Luồng 3 — Bảo mật Khóa Môi trường Hệ thống (`Secret Hygiene & Localhost Guard`)
* Tệp `.env` và `.env.local` chứa `GEMINI_API_KEY`, `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `TAVILY_API_KEY` bắt buộc nằm trong `.gitignore`.
* API `/api/v1/system/integrations-status` chỉ trả về chuỗi đã che mặt nạ (`AIzaSy...xxxx`), tuyệt đối không trả về khóa gốc.
* API `/api/v1/system/update-keys` chỉ cho phép gọi từ `localhost` (`127.0.0.1` / `::1`) kèm `X-Nova-Admin-Token`.

### 2.4. Luồng 4 — Quyền của Chủ thể Dữ liệu theo Điều 9 Nghị định 13/2023/NĐ-CP
* **Quyền được biết & Đồng ý rõ ràng (`Explicit Consent`):** Hiển thị rõ nhãn `[R]` / `[H]` / `[S]`, tên nhà cung cấp AI đang chạy và bộ đếm số lượng PII đã che tự động ngay trên giao diện `Nova OS`.
* **Quyền Truy cập, Xuất dữ liệu & Xóa dữ liệu (`Right to Portability & Erasure`):** Sinh viên có thể xuất toàn bộ `Living Evidence Passport` ra chuẩn `W3C Verifiable Credentials JSON-LD` hoặc yêu cầu xóa toàn bộ dữ liệu cá nhân bất cứ lúc nào.
