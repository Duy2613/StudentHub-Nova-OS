import React, { useState } from 'react';

interface Layer1LocalGuardProps {
  onXpUpdate?: (newXp: number) => void;
}

export const Layer1LocalGuard: React.FC<Layer1LocalGuardProps> = ({ onXpUpdate }) => {
  const [urlInput, setUrlInput] = useState('http://127.0.0.1:8000/admin');
  const [analyzing, setAnalyzing] = useState(false);
  const [urlResult, setUrlResult] = useState<any>(null);

  // Endpoint Hygiene & k-Anonymity Inspector State
  const [sha1Prefix, setSha1Prefix] = useState('5BAA6');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [httpsSecure, setHttpsSecure] = useState(true);
  const [hygieneResult, setHygieneResult] = useState<any>(null);
  const [checkingHygiene, setCheckingHygiene] = useState(false);

  // Deepfake Shield Lab [S] State
  const [deepfakeVerdict, setDeepfakeVerdict] = useState<string | null>(null);

  const localDevices = [
    { name: 'Server Phòng Lab Kỹ Thuật Số', ip: '192.168.1.10', status: 'Mã hóa AES-256-GCM', health: '100%' },
    { name: 'Gateway Sinh Viên KTX Khu A', ip: '203.162.10.1', status: 'WPA3 Enterprise + NAT Guard', health: '99%' },
    { name: 'Trạm Quản Lý Học Liệu RAG AI', ip: '192.168.1.45', status: 'FIDO2 / 2FA Bắt buộc', health: '99%' },
    { name: 'Cổng Định Danh Thẻ Sinh Viên NFC', ip: '192.168.3.12', status: 'Zero-Trust Enforced', health: '97%' },
  ];

  const handleAnalyzeUrl = async (presetUrl?: string) => {
    const target = presetUrl || urlInput;
    if (!target) return;
    setAnalyzing(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/l1/url/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      setUrlResult(data.result);
      if (typeof data.total_xp === 'number' && onXpUpdate) {
        onXpUpdate(data.total_xp);
      }
    } catch {
      const isSsrf = /127\.0\.0\.1|localhost|169\.254/i.test(target);
      setUrlResult({
        score: isSsrf ? 100 : 10,
        label: isSsrf ? 'MALICIOUS' : 'SAFE',
        verdict: isSsrf ? 'SSRF_BLOCKED' : 'SAFE',
        reasons: isSsrf
          ? ['🛑 [SSRF BLOCKED]: Tên miền trỏ về IP nội bộ/đặc quyền (Loopback / Cloud Metadata)']
          : ['Không phát hiện dấu hiệu giả mạo hoặc trỏ IP nội bộ'],
        confidence: 0.95,
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleInspectHygiene = async (customPrefix?: string) => {
    const prefix = (customPrefix || sha1Prefix).toUpperCase().slice(0, 5);
    setSha1Prefix(prefix);
    setCheckingHygiene(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/l1/hygiene/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'SV-2026-001',
          mfa_enabled: mfaEnabled,
          https_secure: httpsSecure,
          webcrypto_available: true,
          sha1_prefix5: prefix,
        }),
      });
      const data = await res.json();
      setHygieneResult(data.result);
      if (typeof data.total_xp === 'number' && onXpUpdate) {
        onXpUpdate(data.total_xp);
      }
    } catch {
      // Fallback
    } finally {
      setCheckingHygiene(false);
    }
  };

  return (
    <div className="h-full w-full bg-slate-900 text-slate-100 p-6 overflow-y-auto select-none space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              LỚP 1
            </span>
            <h2 className="text-xl font-bold text-white">Lực lượng & Thiết bị Tại chỗ (Local Guard)</h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              [R] PROMPT/URL GUARD + [H] ENDPOINT HYGIENE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Bảo vệ tuyến đầu: Kiểm tra liên kết chống SSRF/Phishing, Kiểm định vệ sinh phiên đăng nhập bằng k-Anonymity và Bài thực hành Nhận diện Deepfake.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          LOCAL SHIELD: ACTIVE
        </div>
      </div>

      {/* 1. URL Phishing & SSRF Analyzer Tool [R] */}
      <div className="p-5 rounded-2xl bg-slate-950/70 border border-emerald-500/30 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🛡️</span>
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono">
              1. URL Analyzer in Sandbox (Chống SSRF, Punycode Homograph & Lừa đảo Phishing) [R]
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            skill.layer1.phishing_and_url_analyzer@2
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Nhập đường link kiểm tra (ví dụ http://127.0.0.1:8000 hoặc https://hocbong-sinhvien-khan.xyz)..."
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-emerald-400 text-xs text-slate-100 px-3.5 py-2.5 rounded-xl outline-none"
          />
          <button
            onClick={() => handleAnalyzeUrl()}
            disabled={analyzing}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-all cursor-pointer disabled:opacity-50"
          >
            {analyzing ? 'Đang phân tích...' : '🔍 Quét URL An Toàn (+25 XP)'}
          </button>
        </div>

        <div className="flex gap-2 flex-wrap text-[11px]">
          <span className="text-slate-400 py-0.5">Mẫu kiểm thử nhanh:</span>
          <button
            onClick={() => {
              setUrlInput('http://127.0.0.1:8000/admin');
              handleAnalyzeUrl('http://127.0.0.1:8000/admin');
            }}
            className="px-2.5 py-1 rounded-lg bg-red-950/40 text-red-300 border border-red-500/30 hover:bg-red-900/40 cursor-pointer"
          >
            🛑 SSRF Loopback (127.0.0.1)
          </button>
          <button
            onClick={() => {
              setUrlInput('http://169.254.169.254/latest/meta-data/iam/');
              handleAnalyzeUrl('http://169.254.169.254/latest/meta-data/iam/');
            }}
            className="px-2.5 py-1 rounded-lg bg-red-950/40 text-red-300 border border-red-500/30 hover:bg-red-900/40 cursor-pointer"
          >
            🛑 Cloud Metadata (169.254.169.254)
          </button>
          <button
            onClick={() => {
              setUrlInput('https://xn--studenthub-l1a.xyz/login-verify');
              handleAnalyzeUrl('https://xn--studenthub-l1a.xyz/login-verify');
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-500/30 hover:bg-amber-900/40 cursor-pointer"
          >
            ⚠️ Punycode Homograph (xn--studenthub)
          </button>
          <button
            onClick={() => {
              setUrlInput('https://studenthub.edu.vn/courses');
              handleAnalyzeUrl('https://studenthub.edu.vn/courses');
            }}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/40 cursor-pointer"
          >
            ✅ Tên miền Giáo dục Chính thống (.edu.vn)
          </button>
        </div>

        {urlResult && (
          <div className="mt-2 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300">
                Kết quả đánh giá ({urlResult.verdict || urlResult.label}):
              </span>
              <span
                className={`px-2.5 py-0.5 rounded font-bold ${
                  urlResult.label === 'MALICIOUS'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : urlResult.label === 'SUSPICIOUS'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {urlResult.label} (Điểm rủi ro: {urlResult.score}/100)
              </span>
            </div>
            {urlResult.reasons?.map((r: string, idx: number) => (
              <div key={idx} className="text-slate-300">
                • {r}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Endpoint Hygiene & k-Anonymity Password Leak Inspector [H] + Deepfake Lab [S] */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Endpoint Hygiene Card */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-sky-500/30 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-300 uppercase tracking-wider font-mono">
              2. Vệ sinh Phiên & Kiểm tra Mật khẩu k-Anonymity [H]
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
              SHA-1 Prefix-5 Only
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Chỉ gửi 5 ký tự Hex đầu tiên của mã băm SHA-1 lên Server để đối chiếu kho mật khẩu bị lộ mà không bao giờ tiết lộ mật khẩu thật.
          </p>

          <div className="flex flex-wrap gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={mfaEnabled}
                onChange={(e) => setMfaEnabled(e.target.checked)}
                className="accent-emerald-500"
              />
              <span>Đã bật MFA TOTP / Passkey</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={httpsSecure}
                onChange={(e) => setHttpsSecure(e.target.checked)}
                className="accent-emerald-500"
              />
              <span>Kết nối HTTPS TLS 1.3</span>
            </label>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              maxLength={5}
              value={sha1Prefix}
              onChange={(e) => setSha1Prefix(e.target.value.toUpperCase())}
              className="w-28 bg-slate-900 border border-slate-700 text-xs font-mono text-center text-amber-300 px-3 py-2 rounded-xl outline-none"
              placeholder="5BAA6"
            />
            <button
              onClick={() => handleInspectHygiene()}
              disabled={checkingHygiene}
              className="flex-1 px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono transition-all cursor-pointer"
            >
              {checkingHygiene ? 'Đang kiểm tra...' : '🔐 Kiểm định Phiên & k-Anonymity (+25 XP)'}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <button
              onClick={() => handleInspectHygiene('5BAA6')}
              className="px-2 py-1 rounded bg-red-950/40 text-red-300 border border-red-500/30 cursor-pointer"
            >
              Prefix 5BAA6 ("password" — Lộ 3.8M lần)
            </button>
            <button
              onClick={() => handleInspectHygiene('7C4A8')}
              className="px-2 py-1 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30 cursor-pointer"
            >
              Prefix 7C4A8 ("123456" — Lộ 2.5M lần)
            </button>
            <button
              onClick={() => handleInspectHygiene('A94F1')}
              className="px-2 py-1 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 cursor-pointer"
            >
              Prefix A94F1 (Mật khẩu mạnh — 0 lộ lọt)
            </button>
          </div>

          {hygieneResult && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
              <div className="flex justify-between font-bold">
                <span>Trạng thái Phiên: {hygieneResult.posture_status}</span>
                <span className="text-emerald-400">Điểm Vệ sinh: {hygieneResult.hygiene_score}/100</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Tiền tố truy vấn: [{hygieneResult.k_anonymity_check?.prefix_queried}***] — Số bản ghi lộ:{' '}
                {hygieneResult.k_anonymity_check?.estimated_breach_exposures?.toLocaleString()}
              </div>
              {hygieneResult.recommended_actions?.map((act: string, i: number) => (
                <div key={i} className="text-amber-300">
                  • {act}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deepfake Shield Lab [S] */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-purple-500/30 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider font-mono">
              3. Phòng Lab Nhận diện Deepfake Giả mạo Học vụ [S]
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              [S] Simulated Training Lab
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Tình huống:</strong> Bạn nhận cuộc gọi video ngắn (6 giây, chất lượng mờ, âm thanh hơi đều nhịp cơ học) từ tài khoản giống Cố vấn học tập, yêu cầu chuyển gấp 4.500.000đ tiền bảo hiểm học kỳ vào số tài khoản lạ. Dấu hiệu nào xác định đây là Deepfake?
          </p>
          <div className="space-y-2 text-xs">
            <button
              onClick={() =>
                setDeepfakeVerdict(
                  '✅ CHÍNH XÁC! Kẻ gian dùng AI Deepfake thường gọi rất ngắn (5-10s), viện cớ mạng yếu để che giấu lỗi nhép môi (lip-sync artifact) và thúc ép chuyển tiền vào tài khoản cá nhân.'
                )
              }
              className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-emerald-950/50 border border-slate-700 hover:border-emerald-500/40 text-slate-200 transition-all cursor-pointer"
            >
              A. Lỗi đồng bộ khẩu hình (lip-sync), ngắt máy sớm để tránh bị hỏi ngược, và tài khoản nhận tiền không thuộc kho bạc trường
            </button>
            <button
              onClick={() =>
                setDeepfakeVerdict(
                  '❌ SAI: Tuyệt đối không chuyển tiền ngay! Hãy gọi lại qua số điện thoại công vụ chính thức của Khoa/Trường để xác minh ngoài luồng (Out-of-Band Verification).'
                )
              }
              className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-red-950/50 border border-slate-700 hover:border-red-500/40 text-slate-200 transition-all cursor-pointer"
            >
              B. Tin tưởng ngay vì hình ảnh khuôn mặt trên video giống thầy/cô
            </button>
          </div>
          {deepfakeVerdict && (
            <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/40 text-xs text-purple-200">
              {deepfakeVerdict}
            </div>
          )}
        </div>
      </div>

      {/* Local Device Inventory Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Danh mục Thiết bị & Phân vùng Mạng Nội bộ (Lớp 1 Tại chỗ)
          </span>
          <span className="text-xs text-emerald-400 font-mono">Tuân thủ Nghị định 85/2016/NĐ-CP</span>
        </div>
        <div className="divide-y divide-slate-800/60">
          {localDevices.map((d, i) => (
            <div
              key={i}
              className="px-5 py-3.5 flex items-center justify-between text-xs hover:bg-slate-800/30 transition-colors"
            >
              <div>
                <span className="font-semibold text-white block">{d.name}</span>
                <span className="text-[11px] text-slate-400 font-mono">{d.ip}</span>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700 block mb-1">
                  {d.status}
                </span>
                <span className="text-emerald-400 font-mono font-bold">{d.health} Safe</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layer1LocalGuard;
