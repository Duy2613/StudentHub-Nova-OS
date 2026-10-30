import os
import sys
import json

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "apps", "api"))

from eval_engine import EmpiricalEvaluationEngine


def main():
    print("[NOVA-EVAL] Running Reproducible Empirical Benchmarks (RQ1, RQ2, RQ3)...")
    res = EmpiricalEvaluationEngine.run_all_benchmarks()

    md_lines = [
        "# BÁO CÁO KẾT QUẢ THỰC NGHIỆM TÁI LẬP ĐƯỢC (`make eval` — RQ1, RQ2, RQ3)",
        f"> **Phiên bản:** `{res['benchmark_version']}` | **Thời điểm chạy:** `{res['executed_at']}` | **Tổng thời gian thực thi:** `{res['total_execution_time_ms']} ms`",
        "",
        "---",
        "",
        "## 1. KẾT QUẢ RQ1 (LỚP 1): NGHIÊN CỨU CẮT BỎ (ABLATION STUDY) BỘ `MultiStagePromptGuard`",
        "",
        "| Cấu hình Phòng thủ (Ablation Configuration) | Tỉ lệ Tấn công Thành công (ASR % ↓) | Tỉ lệ Phát hiện (TPR Recall % ↑) | Chặn nhầm Học thuật (FPR % ↓) | Chặn Direct | Khử độc RAG Indirect | Độ trễ p50 (ms) | Độ trễ p95 (ms) |",
        "| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |",
    ]

    for r in res["rq1_prompt_guard_ablation"]:
        md_lines.append(
            f"| **{r['configuration']}** | `{r['asr_pct']}%` | `{r['tpr_recall_pct']}%` | `{r['fpr_benign_pct']}%` | `{r['direct_blocked']}` | `{r['indirect_rag_sanitized']}` | `{r['p50_latency_ms']} ms` | `{r['p95_latency_ms']} ms` |"
        )

    md_lines.extend([
        "",
        "---",
        "",
        "## 2. KẾT QUẢ RQ2 (LỚP 2): SO SÁNH `GRADUATED SOAR LADDER` VỚI `HARD IP AUTO-BLOCK` TRÊN MẠNG NAT CAMPUS (500 SINH VIÊN)",
        "",
        "| Chính sách Phản ứng (SOAR Policy) | Tỉ lệ Chặn Kẻ Tấn Công (↑) | Sinh viên Lành tính cùng IP Campus bị Chặn nhầm (↓) | Tỉ lệ Thiệt hại Phụ (Collateral Damage ↓) | Thời gian Phản ứng (MTTR) | Hỗ trợ Hoàn tác (1-Click Undo) |",
        "| :--- | :---: | :---: | :---: | :---: | :---: |",
    ])

    for r in res["rq2_graduated_soar_campus_nat"]:
        undo_str = "✅ Có (`< 1ms`)" if r["undo_supported"] else "❌ Không"
        md_lines.append(
            f"| **{r['policy']}** | `{r['attacker_sessions_stopped_pct']}%` | `{r['innocent_campus_students_blocked']}` | `{r['collateral_damage_rate_pct']}%` | `{r['mttr_ms']}` | {undo_str} |"
        )

    md_lines.extend([
        "",
        "---",
        "",
        "## 3. KẾT QUẢ RQ3 (LỚP 3): HIỆU QUẢ `DETERMINISTIC SAST + HYBRID LLM PATCH + MANDATORY RE-SCAN GATE`",
        "",
        "| Quy trình Kiểm định Mã nguồn (Audit Pipeline) | Phát hiện Lỗ hổng (CWE-89/78/798/918/79) | Tự động Sinh Bản vá (`patch_diff`) | Tỉ lệ Bản vá An toàn Xác thực sau Quét lại (`verified_safe` ↑) | Tỉ lệ Rò rỉ PII / Bí mật lên Cloud LLM (↓) |",
        "| :--- | :---: | :---: | :---: | :---: |",
    ])

    for r in res["rq3_sast_patch_verification"]:
        md_lines.append(
            f"| **{r['pipeline']}** | `{r['vulnerabilities_detected']}` | `{r['auto_patch_generated_pct']}%` | `{r['verified_safe_after_rescan_pct']}%` | `{r['pii_secret_leak_to_cloud_pct']}%` |"
        )

    md_content = "\n".join(md_lines) + "\n"

    for out_path in [
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "docs", "EVALUATION_RESULTS.md"),
        r"D:\MYPROVIPPOJ\docs\EVALUATION_RESULTS.md",
        r"D:\MYPROVIPPOJ\StudentHub-AI\docs\EVALUATION_RESULTS.md",
    ]:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(md_content)

    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "docs", "eval_results.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=2)

    print(md_content)
    print(f"[NOVA-EVAL] Saved reproducible benchmark report to {json_path} and docs/EVALUATION_RESULTS.md")


if __name__ == "__main__":
    main()
