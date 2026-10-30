# HƯỚNG DẪN CẤU HÌNH TOÀN DIỆN API KEYS, SUPABASE, OLLAMA & KHỞI CHẠY FULL DỰ ÁN (`STUDENTHUB-AI × NOVA OS v3.0`)

Hệ thống hiện đã được thiết lập cơ chế **Tự động nạp & Đồng bộ nóng (Hot-Reload Environment Loader)** qua [`env_loader.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/core/env_loader.py) và [`supabase_bridge.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/core/supabase_bridge.py).

Toàn bộ các khóa sẵn có từ [`frontend/.env.local`](file:///C:/Users/Duy/Projects/MyProj/StudentHub-AI/frontend/.env.local) đã được đồng bộ tự động sang:
1. **Backend Server-Authoritative:** [`D:\MYPROVIPPOJ\studenthub-nova\.env`](file:///d:/MYPROVIPPOJ/studenthub-nova/.env)
2. **Frontend Scrollytelling & Nova OS:** [`D:\MYPROVIPPOJ\StudentHub-AI\.env.local`](file:///d:/MYPROVIPPOJ/StudentHub-AI/.env.local)

---

## BƯỚC 1: 2 CÁCH ĐƯA API KEY & SUPABASE VÀO HỆ THỐNG (NHANH NHẤT)

### Cách 1 — Nhập trực tiếp ngay trên Giao diện Web Nova OS (Không cần mở code hay khởi động lại Server)
1. Mở trình duyệt tại **`http://localhost:5173/`**.
2. Bấm nút **`Launch Nova OS →`** ở thanh Dock dưới cùng (hoặc bấm vào nút **`✦ 500 SEC-XP`** trên thanh Top Bar).
3. Mở ứng dụng số 6: **`🛂 Passport & RQ1–3`** → Chọn Tab số 3: **`🔌 Kết nối API, Supabase & Hệ thống`**.
4. Tại khung **`🔑 Nhập & Cập nhật Nóng API Keys / Supabase`**, bạn dán các khóa muốn cập nhật vào rồi bấm **`💾 Lưu vào .env & Kích hoạt Nóng`**:
   - Hệ thống sẽ tự động ghi xuống cả 3 tệp `.env` và nạp thẳng vào RAM của FastAPI.
   - Bấm tiếp nút **`⚡ Kiểm tra Kết nối Thực (Ping Supabase + AI)`** để xem độ trễ (ms) và trạng thái phản hồi trực tiếp.

### Cách 2 — Chỉnh sửa trực tiếp trong tệp `.env`
Mở tệp [`D:\MYPROVIPPOJ\studenthub-nova\.env`](file:///d:/MYPROVIPPOJ/studenthub-nova/.env) và điền các biến cốt lõi sau:

```env
# 1. GOOGLE GEMINI API (Lấy tại https://aistudio.google.com/app/apikey — bắt đầu bằng AIzaSy...)
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-2.5-flash

# 2. OPENAI API (Dự phòng Cloud thứ 2 — bắt đầu bằng sk-proj-...)
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini

# 3. OLLAMA LOCAL (Chạy AI nội bộ 100% cho kiểm định mã nguồn Lớp 3)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:7b

# 4. SUPABASE CLOUD (Lấy tại Supabase Dashboard -> Project Settings -> API & Database)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# 5. TAVILY SEARCH & OPENALEX (Tra cứu bằng chứng độc lập Lớp 3 cho Trust V5)
TAVILY_API_KEY=tvly-...
OPEN_ALEX_KEY=...
```

---

## BƯỚC 2: KÍCH HOẠT LẠI DỰ ÁN SUPABASE (`Restore Paused Supabase Project`)

Khi kiểm tra tự động tệp `.env.local` hiện tại của bạn, dự án Supabase `https://kytdomflmjytzyaabogi.supabase.co` đang trả về lỗi phân giải tên miền (`getaddrinfo failed`).
* **Nguyên nhân:** Trên gói Free của Supabase, sau 7 ngày không có truy vấn, Supabase sẽ tạm dừng (Pause) dự án và tạm gỡ bản ghi DNS `*.supabase.co`.
* **Cách bật lại trong 30 giây:**
  1. Truy cập **[https://supabase.com/dashboard/projects](https://supabase.com/dashboard/projects)**.
  2. Chọn project của bạn (`kytdomflmjytzyaabogi` hoặc tạo project mới).
  3. Bấm nút màu xanh **`Restore project`** (Khôi phục dự án) và đợi khoảng 1–2 phút để Supabase cấp lại DNS.
  4. Nếu bạn tạo Project Supabase mới, vào mục **Project Settings → API**, copy `Project URL`, `anon public` key và `service_role` key rồi dán vào Tab **`🔌 Kết nối API, Supabase & Hệ thống`** trên giao diện Nova OS!

---

## BƯỚC 3: LƯU Ý VỀ ĐỊNH DẠNG KHÓA `GEMINI_API_KEY` VÀ `OPENAI_MODEL`

Trong tệp `.env.local` cũ:
* `GEMINI_API_KEY` đang có tiền tố `AQ.A...` (định dạng token OAuth/Vertex nội bộ) và `GEMINI_MODEL=gemini-3.8-flash`.
* Bộ [`HybridLLMGateway`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/core/llm_gateway.py) đã được nâng cấp để **tự động chuẩn hóa** `gemini-3.8-flash` → `gemini-2.5-flash` và `gpt-5.6-luna` → `gpt-4o-mini`.
* Để gọi trực tiếp Google AI Studio chuẩn REST nhanh nhất, bạn lấy khóa chuẩn bắt đầu bằng **`AIzaSy...`** tại **[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)** và dán vào ô `GEMINI_API_KEY`.
* Nếu bạn muốn chạy **Ollama Local** (miễn phí 100%, không giới hạn Quota):
  ```powershell
  ollama serve
  ollama pull qwen2.5-coder:7b
  ```

---

## BƯỚC 4: LỆNH KHỞI CHẠY TOÀN BỘ HỆ THỐNG (BACKEND + FRONTEND + KIỂM ĐỊNH)

### 1. Khởi chạy Backend FastAPI Server-Authoritative (`Port 8000`)
```powershell
$env:PYTHONIOENCODING="utf-8"
cd D:\MYPROVIPPOJ\studenthub-nova
python run_backend.py
```
* **Swagger UI (Tài liệu & Test trực tiếp 16 API):** `http://localhost:8000/docs`
* **Kiểm tra trạng thái API Keys & Supabase:** `http://localhost:8000/api/v1/system/integrations-status`

### 2. Khởi chạy Frontend Scrollytelling 5 Cảnh & Nova OS (`Port 5173`)
```powershell
cd D:\MYPROVIPPOJ\StudentHub-AI
npm.cmd run dev -- --port 5173 --host
```
* **Giao diện chính:** `http://localhost:5173/`
* **Studio Xuất Video Clean-Plate:** `http://localhost:5173/nova-asset-studio.html`

### 3. Chạy Bộ Thực nghiệm RQ1–RQ3 & Kiểm thử Tự động 14 Hạng mục
```powershell
$env:PYTHONIOENCODING="utf-8"
cd D:\MYPROVIPPOJ\studenthub-nova
python run_evaluation.py
python audit_test_suite.py
```
