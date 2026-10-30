import React, { useState, useEffect } from 'react';

interface Layer4NationalSyncProps {
  onXpUpdate?: (newXp: number) => void;
}

export const Layer4NationalSync: React.FC<Layer4NationalSyncProps> = ({ onXpUpdate }) => {
  const [stixData, setStixData] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Outbound STIX & k-Anonymity Gate State
  const [indicatorPattern, setIndicatorPattern] = useState(
    "[domain-name:value = 'hocbong-sinhvien-khan.xyz']"
  );
  const [exportDesc, setExportDesc] = useState(
    'Phát hiện chiến dịch Phishing nhắm vào sinh viên MSSV B2109988 (email: sv_test@studenthub.edu.vn, SĐT: 0912345678)'
  );
  const [tenantCount, setTenantCount] = useState<number>(6);
  const [tlpMarking, setTlpMarking] = useState<'TLP:CLEAR' | 'TLP:GREEN' | 'TLP:AMBER'>('TLP:GREEN');
  const [adminApproved, setAdminApproved] = useState<boolean>(false);
  const [exportResult, setExportResult] = useState<any>(null);

  const nationalFeeds = [
    {
      source: 'NCSC Vietnam Threat Feed [H]',
      type: 'IoC Sync',
      desc: 'Đồng bộ danh sách 4,200 dải IP máy chủ C2 và tên miền giả mạo cổng học vụ đại học',
      syncTime: 'Vừa xong',
    },
    {
      source: 'CISA Known Exploited Vulnerabilities (KEV) [R]',
      type: 'Cảnh báo sớm',
      desc: 'Cập nhật lỗ hổng CVE-2024-21626 (Docker Container Breakout) vào bộ lọc Lớp 3',
      syncTime: '10 phút trước',
    },
    {
      source: 'EDU-SOC Threat Sharing Alliance [R]',
      type: 'Phối hợp xử lý',
      desc: 'Chia sẻ mẫu lừa đảo học bổng quốc tế và tuyển dụng CTV online nhắm vào tân sinh viên',
      syncTime: '35 phút trước',
    },
  ];

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/l4/stix-feed');
      const data = await res.json();
      setStixData(data);
    } catch {
      // Fallback
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    handleSync();
  }, []);

  const handleTestExport = async (customK?: number, customApprove?: boolean) => {
    const kVal = customK ?? tenantCount;
    const appVal = customApprove ?? adminApproved;
    if (customK !== undefined) setTenantCount(customK);
    if (customApprove !== undefined) setAdminApproved(customApprove);

    try {
      const res = await fetch('http://localhost:8000/api/v1/l4/stix-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          indicator_pattern: indicatorPattern,
          description: exportDesc,
          affected_tenant_count: kVal,
          tlp_marking: tlpMarking,
          admin_approved: appVal,
        }),
      });
      const data = await res.json();
      setExportResult(data);
      if (onXpUpdate) {
        fetch('http://localhost:8000/api/v1/xp/ledger')
          .then((r) => r.json())
          .then((d) => {
            if (typeof d.total_xp === 'number') onXpUpdate(d.total_xp);
          })
          .catch(() => {});
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="h-full w-full bg-slate-900 text-slate-100 p-6 overflow-y-auto select-none space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/40">
              LỚP 4
            </span>
            <h2 className="text-xl font-bold text-white">
              Kết nối & Chia sẻ Tình báo Mối đe dọa Quốc gia (STIX 2.1 / TAXII 2.1)
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              [R] STIX 2.1 & k-ANONYMITY + [S] LAB TAXII UPLINK
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Đồng bộ chỉ số tấn công (IoC) chuẩn OASIS STIX 2.1 và kiểm định quyền riêng tư k-Anonymity (k ≥ 5) kèm khử PII trước khi chia sẻ cảnh báo.
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30 disabled:opacity-50 shrink-0"
        >
          {isSyncing ? 'ĐANG ĐỒNG BỘ...' : '🌐 LÀM MỚI NGUỒN STIX 2.1'}
        </button>
      </div>

      {/* 1. Outbound STIX 2.1 & k-Anonymity (k >= 5) Privacy Gate Tester */}
      <div className="p-5 rounded-2xl bg-slate-950/70 border border-purple-500/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold font-mono text-purple-300 uppercase tracking-wider">
              1. Cổng Kiểm định Quyền riêng tư k-Anonymity (k ≥ 5) & Khử PII trước khi Xuất STIX 2.1 [R]
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Chỉ cho phép đóng gói chia sẻ cảnh báo khi số đơn vị/nhóm bị ảnh hưởng <code>k ≥ 5</code> và đã tự động xóa sạch MSSV, Email, SĐT.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            skill.layer4.threat_intel_synchronizer@2
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="md:col-span-2 space-y-1">
            <label className="text-[11px] font-mono text-slate-400">
              Mô tả sự cố (chứa thử MSSV, Email, SĐT để kiểm tra tự động khử PII):
            </label>
            <input
              type="text"
              value={exportDesc}
              onChange={(e) => setExportDesc(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-100 px-3 py-2 rounded-xl outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">
              Số đơn vị ghi nhận (Chỉ số k) & Nhãn TLP:
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={50}
                value={tenantCount}
                onChange={(e) => setTenantCount(Number(e.target.value))}
                className="w-20 bg-slate-900 border border-slate-700 text-xs font-mono text-center text-amber-300 px-2 py-2 rounded-xl outline-none"
              />
              <select
                value={tlpMarking}
                onChange={(e) => setTlpMarking(e.target.value as any)}
                className="flex-1 bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 px-2.5 py-2 rounded-xl outline-none"
              >
                <option value="TLP:CLEAR">TLP:CLEAR</option>
                <option value="TLP:GREEN">TLP:GREEN</option>
                <option value="TLP:AMBER">TLP:AMBER</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => handleTestExport(3, false)}
              className="px-3 py-1.5 rounded-xl bg-red-950/50 hover:bg-red-900/50 text-red-300 border border-red-500/30 font-mono cursor-pointer"
            >
              🛑 Thử k = 3 (&lt; 5: Chặn bởi Cổng k-Anonymity)
            </button>
            <button
              onClick={() => handleTestExport(7, false)}
              className="px-3 py-1.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/50 text-amber-300 border border-amber-500/30 font-mono cursor-pointer"
            >
              ⚠️ Thử k = 7 (Đạt k ≥ 5 + Chờ Admin Duyệt)
            </button>
            <button
              onClick={() => handleTestExport(8, true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 font-mono cursor-pointer"
            >
              ✅ Thử k = 8 + Admin Approved (Xuất gói STIX 2.1 sạch PII)
            </button>
          </div>
        </div>

        {exportResult && (
          <div
            className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
              exportResult.k_anonymity_satisfied
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/30 border-red-500/40 text-red-200'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span>Trạng thái: {exportResult.status}</span>
              <span>Đã tự động khử: {exportResult.pii_stripped_count} trường PII/Secret</span>
            </div>
            <div className="font-sans text-slate-200">{exportResult.message}</div>
            {exportResult.outbound_stix_package && (
              <pre className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] text-purple-200 overflow-x-auto">
                {JSON.stringify(exportResult.outbound_stix_package, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* 2. Inbound STIX 2.1 Feed Objects */}
      {stixData && (
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-purple-300">
              2. Gói Dữ liệu Tình báo STIX 2.1 Đã Nạp ({stixData.inbound_mode}):
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
              {stixData.outbound_policy}
            </span>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
            {stixData.stix_bundle?.objects?.map((obj: any, i: number) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 gap-2"
              >
                <div>
                  <span className="text-purple-400 font-bold">[{obj.type.toUpperCase()}]</span>{' '}
                  <span className="text-white font-bold">{obj.name}</span>
                  {obj.pattern && (
                    <div className="text-slate-400 text-[10px] mt-0.5">{obj.pattern}</div>
                  )}
                </div>
                <span className="text-emerald-400 font-bold shrink-0">
                  {obj.source} ({obj.tlp})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* National Feed Stream */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Kênh Liên thông Cảnh báo An ninh Không gian mạng Quốc gia
          </span>
          <span className="text-xs text-purple-400 font-mono">MISP / STIX 2.1 / TAXII 2.1</span>
        </div>
        <div className="divide-y divide-slate-800/60">
          {nationalFeeds.map((feed, i) => (
            <div
              key={i}
              className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs hover:bg-slate-800/30 transition-colors gap-2"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-sm">{feed.source}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {feed.type}
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{feed.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] text-slate-400 font-mono block mb-1">
                  {feed.syncTime}
                </span>
                <span className="text-emerald-400 font-mono font-bold">✓ Đã đẩy xuống Lớp 1 & 2</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layer4NationalSync;
