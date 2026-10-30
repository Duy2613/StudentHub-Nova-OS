---
name: deception-and-soc-replay
description: Active Cyber Deception (Honey-RAG attribution traps, Canary Credentials for student repos, Adaptive Tarpit) and 3D Pedagogical Experience (SOC Time-Travel Replay, Teachable Block micro-labs, Classroom Live Attack) skill for StudentHub-AI × Nova OS. Activate whenever building or upgrading deception traps, forensic timeline scrubbing, or constructivist security education features.
---

# Active Deception & 3D Pedagogical Replay Skill (`deception-and-soc-replay`)

## 1. Mục đích & Khi nào Kích hoạt (When to Use)
Kích hoạt Skill này khi triển khai các tính năng thuộc **Tầm nhìn H1 & H2 (Nhánh A: Deception & Nhánh C: Sư phạm Tương tác)** trong [`docs/SPEC.md`](file:///d:/MYPROVIPPOJ/docs/SPEC.md) và [`docs/SKILLS.md`](file:///d:/MYPROVIPPOJ/docs/SKILLS.md):
1. **`skill.layer1.honey_rag_trap@1` (Ý tưởng A1):** Cài đặt tài liệu mồi `Honey-RAG` có khóa mật mã riêng (`HONEY-RAG-DOC-xxxx`) để truy vết chính xác tài liệu và phiên khai thác Indirect Prompt Injection.
2. **`skill.layer3.canary_credential_injector@1` (Ý tưởng A2):** Cấp khóa API giả có theo dõi (`NOVA_CANARY_KEY_...`) vào kho đồ án sinh viên để phát hiện sớm rò rỉ repo.
3. **`skill.layer2.adaptive_tarpit@1` (Ý tưởng A4):** Chèn độ trễ lũy tiến (`200ms → 2500ms`) bằng `asyncio.sleep` không chặn luồng cho các phiên nghi ngờ trước khi cô lập.
4. **`skill.edu.soc_time_travel_replay@1` (Ý tưởng C1/C2):** Dùng thanh cuộn 120FPS để tua ngược/xuôi dòng thời gian sự cố bảo mật (`SOC Time-Travel Replay`).
5. **`skill.edu.teachable_block_coach@1` (Ý tưởng C4):** Mở thẻ giải thích ngắn gọn + bài thực hành 2 phút ngay khi lệnh chat hoặc mã nguồn của sinh viên bị chặn.

---

## 2. Quy Tắc Thiết Kế Kỹ Thuật Bắt Buộc

### 2.1. Quy tắc cho `Honey-RAG Trap` (`L1 -> L2`)
- Mỗi đoạn tài liệu mồi phải có mã `honey_token_id = f"HONEY-RAG-DOC-{hmac_hex[:8]}"` gắn liền với `doc_id` và `course_namespace`.
- Tài liệu mồi tuyệt đối **không được chứa kiến thức học thuật sai lệch** gây ảnh hưởng tới sinh viên học tập bình thường; nó chỉ chứa một khóa định danh ẩn sẽ bị trích xuất khi kẻ tấn công ép LLM in toàn bộ ngữ cảnh thô.
- Khi phát hiện `honey_token_id` trong đầu ra hoặc tham số gọi công cụ, tự động phát sự kiện `SecurityEvent v2` mức `CRITICAL` sang Lớp 2 SOC kèm `attributed_doc_id` và `session_id`.

### 2.2. Quy tắc cho `Adaptive Tarpit` (`L2`)
- Tuyệt đối không dùng `time.sleep()` đồng bộ làm nghẽn worker FastAPI; bắt buộc dùng `await asyncio.sleep(delay_ms / 1000.0)` với ngưỡng trần `MAX_TARPIT_MS = 3000`.
- Xóa ngay trạng thái Tarpit khi sinh viên hoàn tất xác thực bước cao (`STEP_UP_MFA`) hoặc khi giảng viên bấm **`1-Click Undo`**.

### 2.3. Quy tắc cho `SOC Time-Travel Replay` & `Teachable Block` (`C1` & `C4`)
- Thanh trượt `SOC Time-Travel Replay` phải tái sử dụng cơ chế cập nhật mượt 120FPS của [`HybridSceneStage.tsx`](file:///d:/MYPROVIPPOJ/StudentHub-AI/src/components/scenes/HybridSceneStage.tsx), hiển thị đồng bộ 4 cột mốc của một sự cố:
  1. `T+0ms`: Gói tin đi vào Lớp 1 (`PromptGuard` / `URLAnalyzer`).
  2. `T+15ms`: Tầng chặn hoặc khóa bẫy `Honey-RAG` kích hoạt.
  3. `T+35ms`: Lớp 2 tính điểm `UEBA` và kiểm tra `Campus NAT Allowlist`.
  4. `T+50ms`: `Graduated SOAR` áp dụng `Adaptive Tarpit` / `QUARANTINE_ACCOUNT` mà không ảnh hưởng tới sinh viên khác cùng IP.
- Mọi thông báo chặn trên giao diện phải đính kèm nút **"🎓 Tìm hiểu vì sao & Thực hành khắc phục (2 phút, +30 SEC-XP)"** (`Teachable Block`).
