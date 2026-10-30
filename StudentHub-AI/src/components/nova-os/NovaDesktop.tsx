import React, { useState, useEffect } from 'react';
import StudentHubApp from './apps/StudentHubApp';
import Layer1LocalGuard from './apps/Layer1LocalGuard';
import Layer2SocMonitor from './apps/Layer2SocMonitor';
import Layer3AuditPentest from './apps/Layer3AuditPentest';
import Layer4NationalSync from './apps/Layer4NationalSync';
import PassportAndEvalApp from './apps/PassportAndEvalApp';

interface NovaDesktopProps {
  onClose?: () => void;
  initialApp?: string;
}

interface WindowState {
  id: string;
  shortLabel: string;
  title: string;
  icon: string;
  honestyBadge: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export const NovaDesktop: React.FC<NovaDesktopProps> = ({
  onClose,
  initialApp = 'studenthub',
}) => {
  const [activeWindowId, setActiveWindowId] = useState<string>(initialApp);
  const [topZ, setTopZ] = useState<number>(12);
  const [serverXp, setServerXp] = useState<number>(500);
  const [xpStatus, setXpStatus] = useState<string>('Sổ cái Server [R]');

  // Server-Authoritative Claim Intro XP & Sync Ledger
  useEffect(() => {
    const claimXp = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/gamification/claim-intro-xp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': 'intro-session-claim-001',
          },
          body: JSON.stringify({ intro_milestone_xp: 500 }),
        });
        const data = await res.json();
        if (typeof data.total_xp === 'number') {
          setServerXp(Math.max(500, data.total_xp));
        }
        setXpStatus('Sổ cái Server [R]');
      } catch {
        setServerXp(500);
        setXpStatus('Offline Mirror [H]');
      }
    };
    claimXp();
  }, []);

  const [windows, setWindows] = useState<Record<string, WindowState>>({
    studenthub: {
      id: 'studenthub',
      shortLabel: 'StudentHub V5',
      title: 'StudentHub-AI V5 Core: RAG Copilot, Kiểm chứng Tin cậy 4 Lớp & Học thuật',
      icon: '🎓',
      honestyBadge: '[R] REAL CORE V5',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: initialApp === 'studenthub' ? 12 : 10,
    },
    layer1: {
      id: 'layer1',
      shortLabel: 'Lớp 1: Local Guard',
      title: 'Lớp 1: Lực lượng & Thiết bị Tại chỗ (URL Sandbox, Hygiene k-Anonymity & Deepfake Lab)',
      icon: '🛡️',
      honestyBadge: '[R]/[H]/[S]',
      isOpen: initialApp === 'layer1',
      isMinimized: false,
      isMaximized: false,
      zIndex: initialApp === 'layer1' ? 12 : 5,
    },
    layer2: {
      id: 'layer2',
      shortLabel: 'Lớp 2: SOC 24/7',
      title: 'Lớp 2: Trung tâm Giám sát SOC 24/7 (Graduated SOAR Ladder & Bảo vệ IP NAT Campus)',
      icon: '👁️',
      honestyBadge: '[R]/[H] SOAR & SIEM',
      isOpen: initialApp === 'layer2',
      isMinimized: false,
      isMaximized: false,
      zIndex: initialApp === 'layer2' ? 12 : 5,
    },
    layer3: {
      id: 'layer3',
      shortLabel: 'Lớp 3: SAST & Range',
      title: 'Lớp 3: Kiểm định Độc lập (Deterministic SAST + HybridLLM Patch + Mandatory Re-scan Gate)',
      icon: '🔬',
      honestyBadge: '[R] SAST + [S] RANGE',
      isOpen: initialApp === 'layer3',
      isMinimized: false,
      isMaximized: false,
      zIndex: initialApp === 'layer3' ? 12 : 5,
    },
    layer4: {
      id: 'layer4',
      shortLabel: 'Lớp 4: STIX/TAXII',
      title: 'Lớp 4: Liên thông Cảnh báo Quốc gia (STIX 2.1 Threat Feed & Cổng k-Anonymity k ≥ 5)',
      icon: '🌐',
      honestyBadge: '[R] STIX + [S] TAXII',
      isOpen: initialApp === 'layer4',
      isMinimized: false,
      isMaximized: false,
      zIndex: initialApp === 'layer4' ? 12 : 5,
    },
    passport: {
      id: 'passport',
      shortLabel: 'Passport & RQ1–3',
      title: 'Hộ chiếu Bằng chứng Sống (SHA-256 Chain) & Thực nghiệm Khoa học RQ1–RQ3',
      icon: '🛂',
      honestyBadge: '[R] VERIFIED PROOF',
      isOpen: initialApp === 'passport',
      isMinimized: false,
      isMaximized: false,
      zIndex: initialApp === 'passport' ? 12 : 5,
    },
  });

  const bringToFront = (appId: string) => {
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setActiveWindowId(appId);
    setWindows((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        isOpen: true,
        isMinimized: false,
        zIndex: nextZ,
      },
    }));
  };

  const toggleMaximize = (appId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWindows((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        isMaximized: !prev[appId].isMaximized,
        isMinimized: false,
        zIndex: topZ + 1,
      },
    }));
    setTopZ((z) => z + 1);
    setActiveWindowId(appId);
  };

  const toggleApp = (appId: string) => {
    setWindows((prev) => {
      const win = prev[appId];
      if (!win.isOpen || win.isMinimized) {
        return {
          ...prev,
          [appId]: { ...win, isOpen: true, isMinimized: false, zIndex: topZ + 1 },
        };
      }
      if (activeWindowId === appId) {
        return {
          ...prev,
          [appId]: { ...win, isMinimized: true },
        };
      }
      return {
        ...prev,
        [appId]: { ...win, zIndex: topZ + 1 },
      };
    });
    setTopZ((z) => z + 1);
    setActiveWindowId(appId);
  };

  const closeWindow = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWindows((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], isOpen: false },
    }));
  };

  const minimizeWindow = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWindows((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], isMinimized: true },
    }));
  };

  const handleXpUpdate = (newXp: number) => {
    setServerXp((prev) => Math.max(prev, newXp));
  };

  const renderAppContent = (appId: string) => {
    switch (appId) {
      case 'studenthub':
        return <StudentHubApp onXpUpdate={handleXpUpdate} />;
      case 'layer1':
        return <Layer1LocalGuard onXpUpdate={handleXpUpdate} />;
      case 'layer2':
        return <Layer2SocMonitor onXpUpdate={handleXpUpdate} />;
      case 'layer3':
        return <Layer3AuditPentest onXpUpdate={handleXpUpdate} />;
      case 'layer4':
        return <Layer4NationalSync onXpUpdate={handleXpUpdate} />;
      case 'passport':
        return <PassportAndEvalApp />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-br from-slate-950 via-[#081018] to-emerald-950 select-none flex flex-col font-sans">
      {/* Top OS Menu Bar */}
      <header className="h-10 px-3 sm:px-4 bg-slate-950/95 border-b border-white/10 flex items-center justify-between text-xs text-slate-300 z-50 gap-2 shrink-0">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 font-black text-white tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="font-mono">NOVA OS v4.0</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden lg:inline font-medium text-[11px]">
            StudentHub-AI V5 × 4-Layer Cyber Defense
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30 font-bold hidden sm:inline">
            28 SKILLS ACTIVE
          </span>
        </div>

        {/* Quick App Switcher Pills in Top Bar */}
        <div className="hidden 2xl:flex items-center gap-1 overflow-x-auto py-0.5">
          {Object.values(windows).map((w) => {
            const isCurr = activeWindowId === w.id && w.isOpen && !w.isMinimized;
            return (
              <button
                key={w.id}
                onClick={() => bringToFront(w.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isCurr
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{w.icon}</span>
                <span>{w.shortLabel}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono shrink-0">
          <button
            onClick={() => bringToFront('passport')}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold cursor-pointer transition-colors text-[11px]"
            title="Mở Hộ chiếu Bằng chứng Sống & Thực nghiệm RQ1–RQ3"
          >
            ✦ {serverXp} SEC-XP
          </button>
          <button
            onClick={onClose}
            className="px-2.5 sm:px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>⬅ <span className="hidden sm:inline">Quay lại</span> 5 Cảnh 3D</span>
          </button>
        </div>
      </header>

      {/* Main Desktop Space / Window Canvas */}
      <main className="relative flex-1 p-2 sm:p-4 overflow-hidden">
        {Object.values(windows).map((win) => {
          if (!win.isOpen || win.isMinimized) return null;
          const isActive = activeWindowId === win.id;

          return (
            <div
              key={win.id}
              onClick={() => bringToFront(win.id)}
              style={{ zIndex: win.zIndex }}
              className={`absolute transition-all duration-200 flex flex-col shadow-2xl overflow-hidden bg-slate-900 border ${
                win.isMaximized
                  ? 'inset-0 z-40 rounded-none border-emerald-500/60'
                  : 'inset-2 sm:inset-4 md:inset-6 rounded-2xl'
              } ${
                isActive
                  ? 'border-emerald-500/50 shadow-[0_25px_60px_rgba(0,0,0,0.85)]'
                  : 'border-white/10 shadow-black/60 opacity-95'
              }`}
            >
              {/* Window Header / Titlebar */}
              <div
                onDoubleClick={() => toggleMaximize(win.id)}
                className={`h-10 px-3 sm:px-4 flex items-center justify-between border-b transition-colors select-none gap-2 shrink-0 ${
                  isActive
                    ? 'bg-slate-950 border-slate-800 text-white'
                    : 'bg-slate-950/80 border-slate-800/80 text-slate-400'
                }`}
              >
                {/* Traffic light control dots */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => closeWindow(win.id, e)}
                    className="w-3 h-3 rounded-full bg-red-500 hover:opacity-80 transition-opacity cursor-pointer"
                    title="Đóng cửa sổ"
                  />
                  <button
                    onClick={(e) => minimizeWindow(win.id, e)}
                    className="w-3 h-3 rounded-full bg-amber-500 hover:opacity-80 transition-opacity cursor-pointer"
                    title="Thu nhỏ cửa sổ"
                  />
                  <button
                    onClick={(e) => toggleMaximize(win.id, e)}
                    className="w-3 h-3 rounded-full bg-emerald-500 hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center text-[8px] text-slate-950 font-bold"
                    title={win.isMaximized ? 'Thu nhỏ lại (Restore)' : 'Phóng to toàn màn hình (Maximize)'}
                  />
                </div>

                {/* Window Title (min-w-0 ensures truncation works properly without pushing elements) */}
                <div className="flex-1 min-w-0 flex items-center gap-2 text-xs font-bold px-2 cursor-pointer">
                  <span className="shrink-0">{win.icon}</span>
                  <span className="truncate text-slate-100">{win.title}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => toggleMaximize(win.id, e)}
                    className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                    title={win.isMaximized ? 'Restore' : 'Maximize'}
                  >
                    {win.isMaximized ? '⤡ Restore' : '⤢ Fullscreen'}
                  </button>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 font-bold">
                    {win.honestyBadge}
                  </span>
                </div>
              </div>

              {/* Window App Body */}
              <div className="flex-1 bg-slate-900 overflow-hidden">{renderAppContent(win.id)}</div>
            </div>
          );
        })}
      </main>

      {/* Bottom OS Dock */}
      <footer className="h-16 flex items-center justify-center pb-2.5 z-50">
        <div className="px-4 py-1.5 rounded-2xl bg-slate-950/90 border border-white/15 shadow-2xl flex items-center gap-2.5">
          {Object.values(windows).map((win) => {
            const isActive = activeWindowId === win.id && win.isOpen && !win.isMinimized;
            return (
              <button
                key={win.id}
                onClick={() => toggleApp(win.id)}
                title={win.title}
                className={`group relative px-3 py-2 rounded-xl flex items-center gap-2 text-xs transition-all duration-150 hover:-translate-y-1 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 border border-emerald-400/60 text-white shadow-[0_0_15px_rgba(52,211,153,0.25)]'
                    : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <span className="text-base">{win.icon}</span>
                <span className="hidden sm:inline font-mono text-[11px] font-bold">
                  {win.shortLabel}
                </span>
                {win.isOpen && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};

export default NovaDesktop;
