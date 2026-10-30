# BÁO CÁO KẾT QUẢ THỰC NGHIỆM TÁI LẬP ĐƯỢC (`make eval` — RQ1, RQ2, RQ3)
> **Phiên bản:** `4.0.0-InternationalEdition` | **Thời điểm chạy:** `2026-10-26T04:44:06Z` | **Tổng thời gian thực thi:** `3.13 ms`

---

## 1. KẾT QUẢ RQ1 (LỚP 1): NGHIÊN CỨU CẮT BỎ (ABLATION STUDY) BỘ `MultiStagePromptGuard`

| Cấu hình Phòng thủ (Ablation Configuration) | Tỉ lệ Tấn công Thành công (ASR % ↓) | Tỉ lệ Phát hiện (TPR Recall % ↑) | Chặn nhầm Học thuật (FPR % ↓) | Chặn Direct | Khử độc RAG Indirect | Độ trễ p50 (ms) | Độ trễ p95 (ms) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1. No Guard (Baseline 0)** | `100.0%` | `0.0%` | `0.0%` | `0/8` | `0/3` | `0.0 ms` | `0.001 ms` |
| **2. Stage 1 Only (Heuristic Regex)** | `54.5%` | `45.5%` | `0.0%` | `5/8` | `0/3` | `0.014 ms` | `0.025 ms` |
| **3. Stage 1 + Normalize (NFKC/Base64/Homoglyph)** | `36.4%` | `63.6%` | `0.0%` | `7/8` | `0/3` | `0.021 ms` | `0.285 ms` |
| **4. Stage 1 + 2 + Semantic Intent** | `27.3%` | `72.7%` | `0.0%` | `8/8` | `0/3` | `0.024 ms` | `0.062 ms` |
| **5. Full 4-Stage Guard (+ RAG Isolation, Honey-RAG & Canary)** | `0.0%` | `100.0%` | `0.0%` | `8/8` | `3/3` | `0.03 ms` | `0.06 ms` |

---

## 2. KẾT QUẢ RQ2 (LỚP 2): SO SÁNH `GRADUATED SOAR LADDER` VỚI `HARD IP AUTO-BLOCK` TRÊN MẠNG NAT CAMPUS (500 SINH VIÊN)

| Chính sách Phản ứng (SOAR Policy) | Tỉ lệ Chặn Kẻ Tấn Công (↑) | Sinh viên Lành tính cùng IP Campus bị Chặn nhầm (↓) | Tỉ lệ Thiệt hại Phụ (Collateral Damage ↓) | Thời gian Phản ứng (MTTR) | Hỗ trợ Hoàn tác (1-Click Undo) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **1. Alert-Only (Chỉ cảnh báo, không phản ứng tự động)** | `0.0%` | `0 / 500 (0.0%)` | `0.0%` | `N/A (Can thiệp thủ công)` | ❌ Không |
| **2. Hard IP Auto-Block (Chặn cứng IP khi Score >= 85)** | `100.0%` | `500 / 500 (100.0% — Self-Inflicted DoS)` | `100.0%` | `0.029 ms (Chặn nhầm toàn trường)` | ❌ Không |
| **3. Graduated SOAR v4 (Session Quarantine + Adaptive Tarpit + Campus NAT Allowlist + Undo)** | `100.0%` | `0 / 500 (0.0% — 95% CI [0.0%, 0.8%])` | `0.0%` | `0.09 ms (Undo: 0.002 ms)` | ✅ Có (`< 1ms`) |

---

## 3. KẾT QUẢ RQ3 (LỚP 3): HIỆU QUẢ `DETERMINISTIC SAST + HYBRID LLM PATCH + MANDATORY RE-SCAN GATE`

| Quy trình Kiểm định Mã nguồn (Audit Pipeline) | Phát hiện Lỗ hổng (CWE-89/78/798/918/79) | Tự động Sinh Bản vá (`patch_diff`) | Tỉ lệ Bản vá An toàn Xác thực sau Quét lại (`verified_safe` ↑) | Tỉ lệ Rò rỉ PII / Bí mật lên Cloud LLM (↓) |
| :--- | :---: | :---: | :---: | :---: |
| **1. SAST-Only (Chỉ quét tĩnh, sinh viên tự sửa thủ công)** | `8/8 (100%)` | `0.0%` | `0.0%` | `0.0%` |
| **2. Naive Unverified Patch (Không qua cổng Mandatory SAST Re-scan)** | `8/8 (100%)` | `100.0%` | `0.0%` | `100.0%` |
| **3. Deterministic SAST + HybridLLM (Redacted/Local) + Mandatory Re-scan & AST Gate** | `8/8 (100%)` | `100.0%` | `100.0%` | `0.0%` |
