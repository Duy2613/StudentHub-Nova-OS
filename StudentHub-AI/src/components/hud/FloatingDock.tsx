import React, { useState } from 'react';

interface FloatingDockProps {
  onLaunchNovaOs?: () => void;
  onSelectScene?: (scene: number) => void;
  currentScene?: number;
  isNovaOsOpen?: boolean;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  onLaunchNovaOs,
  onSelectScene,
  currentScene = 1,
  isNovaOsOpen = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scenes = [
    { id: 1, short: '01', title: 'Scene 1: Ảo tưởng Bảo mật (-18%)' },
    { id: 2, short: '02', title: 'Scene 2: Vỡ kính & Lỗ hổng (-07%)' },
    { id: 3, short: '03', title: 'Scene 3: Đốt giấy & 4 Lớp ATTT (+45%)' },
    { id: 4, short: '04', title: 'Scene 4: Cổng Xoay Xuyên Mây (+75%)' },
    { id: 5, short: '05', title: 'Scene 5: Đô thị Isometric 3D (+100%)' },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center select-none">
      {/* Pop-up Navigation Menu */}
      {isMenuOpen && (
        <div className="mb-3 p-2.5 bg-slate-950/95 backdrop-blur-2xl border border-emerald-500/40 rounded-2xl shadow-2xl flex flex-col gap-1 w-72 animate-in fade-in duration-150">
          <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 border-b border-white/10 flex items-center justify-between">
            <span>5 Phân Cảnh Scrollytelling</span>
            <span>[Phím 1-5]</span>
          </div>
          {scenes.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onSelectScene?.(s.id);
                setIsMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-colors font-medium flex items-center justify-between cursor-pointer ${
                currentScene === s.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{s.title}</span>
              {currentScene === s.id && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              )}
            </button>
          ))}

          <div className="pt-1.5 mt-1 border-t border-white/10">
            <a
              href="/nova-asset-studio.html"
              target="_blank"
              rel="noreferrer"
              className="w-full px-3 py-2 text-xs rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 font-mono font-bold flex items-center justify-between"
            >
              <span>🎬 Mở Studio Xuất Video Clean-Plate</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Bottom Pill Dock */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-2xl rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.45)] border border-white/60">
        {/* Emerald Branding Emblem / Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          title="Mở menu danh sách Scene & Clean-Plate Video Studio"
          className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-black hover:scale-105 transition-transform shadow-inner cursor-pointer"
        >
          <span className="text-sm tracking-tighter">✦</span>
        </button>

        {/* Quick 01..05 Scene Stepper Pills */}
        <div className="hidden sm:flex items-center gap-1 px-1">
          {scenes.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectScene?.(s.id)}
              title={s.title}
              className={`w-8 h-8 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
                currentScene === s.id
                  ? 'bg-slate-950 text-emerald-400 shadow'
                  : 'text-slate-600 hover:bg-slate-200 hover:text-slate-950'
              }`}
            >
              {s.short}
            </button>
          ))}
        </div>

        {/* Primary Action Button: Launch Nova OS */}
        <button
          onClick={onLaunchNovaOs}
          className={`px-6 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            isNovaOsOpen
              ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]'
              : 'bg-slate-950 hover:bg-slate-800 text-white hover:shadow-lg'
          }`}
        >
          <span>{isNovaOsOpen ? 'Đang mở Nova OS' : 'Launch Nova OS'}</span>
          <span className="text-emerald-400">→</span>
        </button>
      </div>
    </div>
  );
};

export default FloatingDock;
