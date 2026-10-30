import React, { useEffect, useRef } from 'react';
import { VisualCompositorMode, ScrollScrubTelemetry } from '../scenes/HybridSceneStage';
import XpCounter from './XpCounter';

interface TopTimelineProps {
  progressPercent?: number; // e.g. -18 to 100
  sceneIndex?: number;      // 1 to 5
  progressText?: string;    // e.g. "-18%  01"
  isDarkTheme?: boolean;
  audioActive?: boolean;
  onToggleAudio?: () => void;
  visualMode?: VisualCompositorMode;
  onChangeVisualMode?: (mode: VisualCompositorMode) => void;
  continuousScroll?: boolean;
  onToggleScrollMode?: () => void;
  onSelectScene?: (scene: number) => void;
  onEnterWorkMode?: () => void;
  targetXp?: number;
  xpLabel?: string;
  serverSynced?: boolean;
}

export const TopTimeline: React.FC<TopTimelineProps> = ({
  progressPercent = -18,
  sceneIndex = 1,
  progressText,
  isDarkTheme = true,
  audioActive = false,
  onToggleAudio,
  visualMode = 'hybrid',
  onChangeVisualMode,
  continuousScroll = false,
  onToggleScrollMode,
  onSelectScene,
  onEnterWorkMode,
  targetXp = 100,
  xpLabel = 'SEC-XP',
  serverSynced = false,
}) => {
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const ticks = Array.from({ length: 33 }, (_, i) => i);
  const displayLabel =
    progressText ||
    `${progressPercent > 0 ? `+${progressPercent}` : progressPercent}%  0${sceneIndex}`;

  // Direct DOM update at 60fps during scrolling — Zero React re-renders!
  useEffect(() => {
    const onTelemetry = (e: Event) => {
      const detail = (e as CustomEvent<ScrollScrubTelemetry>).detail;
      if (!detail || !labelRef.current) return;
      const pct = Math.round(-18 + detail.masterProgress * 118);
      const signPct = pct > 0 ? `+${pct}` : `${pct}`;
      labelRef.current.textContent = `${signPct}%  0${detail.sceneIndex}`;
    };
    window.addEventListener('nova-scroll-telemetry', onTelemetry, { passive: true });
    return () => window.removeEventListener('nova-scroll-telemetry', onTelemetry);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex items-center justify-between px-3 sm:px-6 py-3 select-none transition-colors duration-300 gap-2 sm:gap-4">
      {/* Left: Audio Toggle + Visual Compositor Mode Switcher */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={onToggleAudio}
          title={audioActive ? 'Tắt âm thanh Synth' : 'Bật âm thanh WebAudio Synth'}
          aria-label="Toggle Sound"
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer shrink-0 ${
            isDarkTheme
              ? 'bg-slate-900/85 hover:bg-slate-800 border-white/20 text-white'
              : 'bg-white/90 hover:bg-white border-slate-900/20 text-slate-900 shadow-sm'
          }`}
        >
          {audioActive ? (
            <div className="flex items-center gap-0.5 h-4">
              <span className="w-0.5 bg-emerald-400 h-2 animate-pulse" />
              <span className="w-0.5 bg-emerald-400 h-4 animate-pulse" />
              <span className="w-0.5 bg-emerald-400 h-3 animate-pulse" />
              <span className="w-0.5 bg-emerald-400 h-1.5 animate-pulse" />
            </div>
          ) : (
            <div className="w-4 h-0.5 bg-current rounded-full" />
          )}
        </button>

        {/* Visual Layer Mode Switcher (Hybrid vs AI-3D vs Video) */}
        {onChangeVisualMode && (
          <div
            className={`hidden 2xl:flex items-center gap-1 p-1 rounded-full border text-[11px] font-mono shrink-0 ${
              isDarkTheme
                ? 'bg-slate-950/85 border-white/15 text-slate-300'
                : 'bg-white/90 border-slate-900/15 text-slate-700 shadow-sm'
            }`}
          >
            {(
              [
                { id: 'hybrid', label: '✨ Hybrid 3D+Video' },
                { id: 'ai3d', label: '🖼️ AI 3D Plate' },
                { id: 'video', label: '🎬 Video Loop' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => onChangeVisualMode(m.id)}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer font-bold ${
                  visualMode === m.id
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'hover:opacity-80'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}

        {/* Continuous Scroll vs Step Mode Toggle */}
        {onToggleScrollMode && (
          <button
            onClick={onToggleScrollMode}
            title="Chuyển đổi giữa chế độ Cuộn liên tục 5 cảnh và chế độ Từng cảnh"
            className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-mono font-bold cursor-pointer transition-all shrink-0 ${
              isDarkTheme
                ? 'bg-slate-950/85 border-white/15 text-emerald-300 hover:border-emerald-400'
                : 'bg-white/90 border-slate-900/15 text-emerald-800 hover:border-emerald-600 shadow-sm'
            }`}
          >
            <span>{continuousScroll ? '📜 Cuộn Dọc 5 Cảnh' : '🎯 Từng Cảnh'}</span>
          </button>
        )}

        {/* Idea C6: 1-Click Work Mode (Zero-Distraction Nova OS) */}
        {onEnterWorkMode && (
          <button
            onClick={onEnterWorkMode}
            title="Idea C6: Bỏ qua hiệu ứng 3D để vào thẳng Chế độ Làm việc (Work Mode / Nova OS)"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 text-[11px] font-mono font-bold cursor-pointer transition-all shadow-md shrink-0"
          >
            <span className="hidden sm:inline">⚡ Work Mode (Nova OS)</span>
            <span className="sm:hidden">⚡ Nova OS</span>
          </button>
        )}
      </div>

      {/* Center: Ruler / Progression Gauge (Click ticks to jump scenes) */}
      <div className="pointer-events-auto hidden md:flex flex-col items-center bg-slate-950/75 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-2xl border border-white/15 shrink-0">
        <div className="flex items-center gap-1 sm:gap-1.5 h-5">
          {ticks.map((idx) => {
            const mappedScene = Math.min(5, Math.max(1, Math.ceil(((idx + 1) / 33) * 5)));
            const isActiveCenter = mappedScene === sceneIndex && idx % 7 === 3;
            const isMajor = idx % 8 === 0;
            return (
              <button
                key={idx}
                onClick={() => onSelectScene?.(mappedScene)}
                title={`Chuyển tới Scene 0${mappedScene}`}
                className={`w-[2px] transition-all duration-200 cursor-pointer ${
                  isActiveCenter
                    ? 'h-5 bg-emerald-400 scale-x-125'
                    : isMajor
                    ? 'h-3.5 bg-white/70 hover:bg-emerald-300'
                    : 'h-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            );
          })}
        </div>
        <span
          ref={labelRef}
          className="text-[11px] font-bold tracking-widest mt-1 font-mono uppercase text-emerald-300"
        >
          {displayLabel}
        </span>
      </div>

      {/* Right slot: Server-Authoritative SEC-XP Counter */}
      <div className="pointer-events-auto flex items-center justify-end shrink-0">
        <XpCounter
          targetXp={targetXp}
          label={xpLabel}
          serverSynced={serverSynced}
        />
      </div>
    </header>
  );
};

export default TopTimeline;
