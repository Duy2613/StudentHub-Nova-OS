---
name: compliance-and-verifiable-credentials
description: International Security Standards Compliance (H0 Hardening, OWASP ASVS 4.0 L2, OWASP LLM Top 10 2025, MITRE ATLAS, NIST AI RMF, Vietnam Decree 13/2023/NĐ-CP DPIA), W3C Verifiable Credentials 2.0 Proof-of-Defense Passport, and Zalo Shield Bot integration skill for StudentHub-AI × Nova OS.
---

# International Compliance, W3C Verifiable Credentials & Ecosystem Skill (`compliance-and-verifiable-credentials`)

## 1. Mục đích & Khi nào Kích hoạt (When to Use)
Kích hoạt Skill này khi thực hiện:
- Kiểm toán và gia cố an toàn nền móng **`H0` (Security Self-Audit & Secret Hygiene)** theo [`docs/THREAT_MODEL.md`](file:///d:/MYPROVIPPOJ/docs/THREAT_MODEL.md) và [`docs/COMPLIANCE_AND_ETHICS.md`](file:///d:/MYPROVIPPOJ/docs/COMPLIANCE_AND_ETHICS.md).
- Đánh giá tuân thủ **Nghị định 13/2023/NĐ-CP (DPIA)**, **OWASP ASVS 4.0 Level 2**, **OWASP Top 10 for LLM (2025)**, **MITRE ATLAS**, **NIST AI RMF 1.0**.
- Triển khai **Chứng chỉ Năng lực Phòng thủ Ký số chuẩn Quốc tế (`W3C Verifiable Credentials 2.0 / Open Badges 3.0` — Ý tưởng E2)** trong `Living Evidence Passport`.
- Tích hợp kênh **`Zalo Shield Bot` (`Ý tưởng E1`)**, **`Scam Weather Forecast` (`Ý tưởng D1`)**, và **`Vulnerability Genome` (`Ý tưởng D2`)**.

---

## 2. Danh Sách Kiểm Tra Bắt Buộc Khi Gia Cố Hệ Thống (`H0` & `H2` Gates)

### 2.1. Cổng Bảo vệ Khóa Môi trường & Quản trị (`H0 Mandatory Gate`)
1. Endpoint `POST /api/v1/system/update-keys` trong [`studenthub-nova/apps/api/main.py`](file:///d:/MYPROVIPPOJ/studenthub-nova/apps/api/main.py) bắt buộc:
   - Kiểm tra địa chỉ IP của `Request` phải thuộc `{"127.0.0.1", "::1", "localhost", "testclient"}` (hoặc truyền đúng mã `X-Nova-Admin-Token` khớp biến môi trường `NOVA_ADMIN_TOKEN`).
   - Không tự động ghi đè sang thư mục bên ngoài workspace nếu quản trị viên không bật cờ `allow_external_sync = true`.
2. Tệp `.gitignore` tại gốc dự án bắt buộc loại trừ `.env`, `.env.local`, `.env.*.local`, `*.pem`, `*.key`.

### 2.2. Chuẩn Xuất Chứng Chỉ `W3C Verifiable Credentials 2.0` (`Proof-of-Defense Passport`)
Mỗi hộ chiếu trả về từ `/api/v1/passport/{user_id}` phải đính kèm trường `w3c_verifiable_credential` tuân thủ cấu trúc JSON-LD:
```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json"
  ],
  "type": ["VerifiableCredential", "OpenBadgeCredential", "NovaProofOfDefenseCredential"],
  "issuer": "did:web:studenthub-nova.edu.vn",
  "credentialSubject": {
    "id": "did:studenthub:SV-2026-001",
    "totalVerifiedSecXp": 820,
    "verifiedDefenseSkills": [
      "L1_PROMPT_INJECTION_DEFENSE",
      "L2_CAMPUS_NAT_SOAR_RESPONSE",
      "L3_SAST_PATCH_VERIFICATION",
      "L4_STIX_K_ANONYMITY_PRIVACY"
    ]
  },
  "proof": {
    "type": "DataIntegrityProof",
    "cryptosuite": "eddsa-jcs-2022-or-hmac-sha256",
    "verificationMethod": "did:web:studenthub-nova.edu.vn#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "..."
  }
}
```
Nhà tuyển dụng hoặc giảng viên có thể kiểm tra chữ ký `proofValue` độc lập mà không cần truy cập cơ sở dữ liệu nội bộ của trường, đồng thời bảo vệ quyền riêng tư của sinh viên (**Selective Disclosure** theo [`docs/DATA_PRIVACY.md`](file:///d:/MYPROVIPPOJ/docs/DATA_PRIVACY.md)).
