---
name: vipi-benchmark-and-redteam
description: Scientific Evaluation, ViPI-Bench / SEA-PI-Bench dataset construction, Prompt Injection League (Data Flywheel), SimPy Campus Digital Twin simulation for RQ2, and AST/Unit-Test Gate evaluation skill for StudentHub-AI × Nova OS. Activate whenever working on eval_engine.py, run_evaluation.py, RQ1-RQ4 benchmarks, or red-teaming.
---

# ViPI-Bench, Red-Team Flywheel & Reproducible Evaluation Skill (`vipi-benchmark-and-redteam`)

## 1. Mục đích & Khi nào Kích hoạt (When to Use)
Kích hoạt Skill này bất cứ khi nào làm việc với:
- Bộ đánh giá thực nghiệm [`studenthub-nova/apps/api/eval_engine.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/eval_engine.py) và [`studenthub-nova/run_evaluation.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/run_evaluation.py).
- Giao thức đánh giá khoa học [`docs/BENCHMARK_PROTOCOL.md`](file:///d:/MYPROVIPPOJ/docs/BENCHMARK_PROTOCOL.md).
- Các hợp đồng kỹ năng:
  - `skill.flywheel.prompt_injection_league@1` (**Ý tưởng B1/B2/B3**: Giải đấu Red-vs-Blue & thu thập mẫu `ViPI-Bench` / `SEA-PI-Bench`).
  - `skill.moonshot.campus_digital_twin@1` (**Ý tưởng F1/F4**: Mô phỏng đa tác tử `SimPy` cho mạng NAT trường đại học — **RQ2**).
  - `skill.layer3.code_security_auditor@3` (Cổng kiểm định 3 bước `SAST Re-scan + AST Syntax + Unit-Test Gate` — **RQ3**).

---

## 2. 5 Nguyên Tắc Thực Nghiệm Khoa Học Bắt Buộc (`Zero Hardcoded Metrics`)

1. **Cấm Hằng Số Giả (`No Fabricated Baselines`):**
   - Tuyệt đối không gán cứng các số như `99.8%` hay `48.0%` vào kết quả thực nghiệm. Mọi chính sách đối chứng (`Policy A..D` trong RQ2, `Ablation 1..4` trong RQ1, `SAST + LLM Patch` trong RQ3) đều phải chạy qua hàm mô phỏng/kiểm tra thật trên cùng một tập dữ liệu đầu vào.
2. **Phân Tách Nghiêm Ngặt `Train/Dev` và `Held-out Test`:**
   - Tập `held_out_test` của `ViPI-Bench` phải được kiểm tra mã băm `SHA-256` trước khi chạy đánh giá. Không bao giờ dùng các mẫu trong `held_out_test` để viết biểu thức chính quy ở Tầng 1.
3. **Báo Cáo Khoảng Tin Cậy `95% CI` & Phân Vị Độ Trễ (`p50`, `p95`, `p99`):**
   - Sử dụng công thức **Wilson Score 95% Confidence Interval** hoặc **Bootstrap ($B = 1000$, `seed = 42`)** cho mọi chỉ số tỷ lệ (`ASR`, `TPR`, `FPR`, `Collateral Damage Rate`, `Verified Patch Rate`).
4. **Cổng Kiểm Tra Cú Pháp `AST` & `Unit-Test Gate` cho RQ3:**
   - Khi đánh giá bản vá mã nguồn tại Lớp 3, phải gọi `ast.parse(patched_code)` (đối với Python) và chạy kiểm thử chức năng để chứng minh bản vá không chỉ sạch lỗi SAST (`remaining_findings == 0`) mà còn giữ nguyên tính đúng đắn của chương trình.
5. **Đồng Ý Đạo Đức Nghiên Cứu (`IRB Consent`) & Ẩn Danh PII Cho `Prompt Injection League`:**
   - Mọi mẫu thu thập từ giải đấu sinh viên bắt buộc có `irb_research_consent_granted == true` và đi qua `PIIRedactor.redact()` trước khi lưu vào bảng `nova_vipi_bench_submissions`.
