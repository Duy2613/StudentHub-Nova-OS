import React, { useEffect, useState } from 'react';

interface XpCounterProps {
  targetXp?: number; // e.g. 100, 200, 300, 400, 500
  label?: string;    // e.g. "SEC-XP"
  serverSynced?: boolean;
  className?: string;
}

export const XpCounter: React.FC<XpCounterProps> = ({
  targetXp = 100,
  label = 'SEC-XP',
  serverSynced = false,
  className = '',
}) => {
  const [currentXp, setCurrentXp] = useState(targetXp);

  useEffect(() => {
    const start = currentXp;
    const diff = targetXp - start;
    if (diff === 0) return;

    const duration = 550; // ms
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const val = Math.round(start + diff * ease);
      setCurrentXp(val);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const handle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(handle);
  }, [targetXp]);

  return (
    <div
      title={
        serverSynced
          ? 'Sổ cái xp_ledger Server-Authoritative [R] đã đồng bộ (Idempotency-Key)'
          : 'Bản sao chỉ đọc (Read-only Mirror) — tối đa 500 Intro SEC-XP'
      }
      className={`pointer-events-auto select-none backdrop-blur-xl bg-white/95 text-slate-900 border border-emerald-500/40 shadow-xl shadow-black/20 px-3 sm:px-4 py-1.5 rounded-full flex items-center gap-1.5 sm:gap-2 transition-all duration-300 hover:scale-105 shrink-0 ${className}`}
    >
      <span className="text-emerald-600 text-xs sm:text-sm animate-pulse">✦</span>
      <span className="text-xs sm:text-sm font-black tracking-tight font-sans">
        +{currentXp}
      </span>
      <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-600 uppercase">
        {label}
      </span>
      <span
        className={`hidden sm:inline ml-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
          serverSynced
            ? 'bg-emerald-500/20 text-emerald-800 border border-emerald-500/40'
            : 'bg-slate-200 text-slate-700'
        }`}
      >
        {serverSynced ? '[R] SYNCED' : '[R] LEDGER'}
      </span>
    </div>
  );
};

export default XpCounter;
