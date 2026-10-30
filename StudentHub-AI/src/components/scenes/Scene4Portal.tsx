import React, { useState, useEffect, useRef } from 'react';
import TapHoldTrigger from '../hud/TapHoldTrigger';
import HybridSceneStage, { VisualCompositorMode } from './HybridSceneStage';

interface Scene4PortalProps {
  onNext?: () => void;
  onPrev?: () => void;
  onLaunchNovaOs?: () => void;
  visualMode?: VisualCompositorMode;
}

export const Scene4Portal: React.FC<Scene4PortalProps> = ({
  onNext,
  onPrev,
  onLaunchNovaOs,
  visualMode = 'hybrid',
}) => {
  const [isWarped, setIsWarped] = useState(false);
  const [warpCharge, setWarpCharge] = useState(0); // 0..100%
  const warpChargeRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const charge = warpChargeRef.current; // 0..1
      t += 0.02 * (1 + charge * 4.5);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      if (!isWarped) {
        // 4 Counter-Rotating Cryptographic Portal Rings
        for (let r = 1; r <= 4; r++) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(t * (r % 2 === 0 ? 1 : -1) * (0.65 / r));
          ctx.strokeStyle =
            r % 2 === 0
              ? `rgba(56, 189, 248, ${0.75 - r * 0.1 + charge * 0.25})`
              : `rgba(16, 185, 129, ${0.85 - r * 0.12 + charge * 0.2})`;
          ctx.lineWidth = 3.5 + r * 1.2 + charge * 3;
          ctx.setLineDash([65, 32]);
          ctx.beginPath();
          ctx.arc(0, 0, r * 62 + 45 + charge * 35, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Warp streaks accelerating as user holds button
        if (charge > 0.05) {
          ctx.save();
          for (let i = 0; i < 48; i++) {
            const angle = (i / 48) * Math.PI * 2;
            const dist = (t * 420 + i * 35) % 850;
            const len = 25 + charge * 95;
            const x1 = cx + Math.cos(angle) * dist;
            const y1 = cy + Math.sin(angle) * dist;
            const x2 = cx + Math.cos(angle) * (dist + len);
            const y2 = cy + Math.sin(angle) * (dist + len);
            ctx.strokeStyle = `rgba(125, 211, 252, ${charge * 0.75})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
          ctx.restore();
        }
      } else {
        // Post-Warp Cloud Sanctuary Light Motes & Orbital Halo
        for (let i = 0; i < 55; i++) {
          const angle = (i / 55) * Math.PI * 2;
          const dist = (t * 280 + i * 42) % 920;
          const x = cx + Math.cos(angle) * dist;
          const y = cy + Math.sin(angle) * dist;

          ctx.fillStyle =
            i % 2 === 0 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(16, 185, 129, 0.45)';
          ctx.beginPath();
          ctx.arc(x, y, 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [isWarped]);

  const handleProgress = (val: number) => {
    warpChargeRef.current = val;
    setWarpCharge(Math.round(val * 100));
  };

  return (
    <HybridSceneStage
      sceneNumber={4}
      imageSrc="/assets/images/scene4_portal_ai_enhanced.png"
      videoSrc="/assets/videos/scene4_studenthub_novaos_loop.webm"
      visualMode={visualMode}
      videoBlendMode="screen"
      videoOpacity={isWarped ? 0.32 : 0.46}
      imageOpacity={isWarped ? 0.48 : 0.82}
      parallaxStrength={32}
      chromaticAberration={warpCharge / 100}
      lightTheme={isWarped}
      className={
        isWarped
          ? 'bg-gradient-to-b from-[#e0f2fe] via-[#f0fdf4] to-[#ffffff] text-slate-900'
          : 'bg-[#040811] text-white'
      }
    >
      {/* Dynamic Portal & Hyperspace Warp Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[3]" />

      {/* Main Content Area */}
      <div className="relative z-10 container mx-auto px-4 sm:px-8 lg:px-12 pt-20 sm:pt-24 pb-12 flex-1 flex flex-col items-center justify-center text-center">
        {!isWarped ? (
          <div className="max-w-2xl space-y-4 sm:space-y-5 flex flex-col items-center">
            <span className="px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              SCENE 04 · THE 4-LAYER PORTAL GATEWAY (`scene4_portal_ai_enhanced.png`)
            </span>

            <h2 className="font-serif italic font-bold text-4xl sm:text-6xl md:text-7xl text-white drop-shadow-[0_10px_30px_rgba(16,185,129,0.4)]">
              Cổng Xoay 4 Lớp
            </h2>

            <p className="text-slate-200 text-sm sm:text-base max-w-lg font-normal leading-relaxed bg-slate-950/60 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/10">
              Hội tụ đồng thời <b>StudentHub-AI Trust V5</b> và <b>4 Lớp Phòng Thủ ATTT</b> để xuyên qua tầng mây rủi ro, tiến vào không gian làm việc <b>Nova OS</b>.
            </p>

            <div className="pt-3 sm:pt-4 flex flex-col items-center gap-2.5 sm:gap-3">
              <TapHoldTrigger
                labelTop="NHẤN GIỮ"
                labelBottom="XUYÊN CỔNG MÂY"
                primaryColor="#10b981"
                holdDurationMs={1400}
                onProgress={handleProgress}
                onComplete={() => setIsWarped(true)}
              />
              {warpCharge > 0 && (
                <span className="font-mono text-xs text-cyan-300 animate-pulse">
                  ⚡ GIA TỐC HYPERSPACE WARP: {warpCharge}%
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center bg-white/80 backdrop-blur-2xl p-6 sm:p-10 rounded-3xl border border-sky-200 shadow-2xl">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 font-mono text-[11px] sm:text-xs font-bold">
              <span>✓ ZERO-TRUST KERNEL VERIFIED</span>
              <span>·</span>
              <span>HYBRID LLM GATEWAY READY</span>
            </div>

            <span className="font-serif italic font-bold text-3xl sm:text-5xl text-sky-800 block">
              Introducing
            </span>

            <h1 className="font-sans font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-emerald-600 to-indigo-700">
              NOVA OS
            </h1>

            <p className="text-slate-800 font-bold text-base sm:text-xl max-w-2xl">
              Hệ Điều Hành Bảo Mật 4 Lớp Tích Hợp Full StudentHub-AI V5
            </p>

            <p className="text-slate-600 text-xs sm:text-sm max-w-xl leading-relaxed">
              Mọi truy vấn học tập RAG, đường dẫn học bổng, nhật ký phiên đăng nhập và mã nguồn đồ án của bạn giờ đây được bảo vệ bởi kiến trúc Server-Authoritative 4 lớp.
            </p>

            <div className="pt-3 sm:pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={onLaunchNovaOs}
                className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-slate-950 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 shadow-2xl shadow-sky-500/30 transition-all hover:scale-105 flex items-center gap-2.5 cursor-pointer"
              >
                <span>Khởi chạy Nova OS Desktop ngay</span>
                <span className="text-emerald-400">⚡</span>
              </button>

              {onNext && (
                <button
                  onClick={onNext}
                  className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer"
                >
                  Khám phá Đô thị 3D Isometric (Scene 5) →
                </button>
              )}

              <button
                onClick={() => {
                  warpChargeRef.current = 0;
                  setWarpCharge(0);
                  setIsWarped(false);
                }}
                className="px-4 py-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-mono text-xs cursor-pointer"
              >
                ↺ Xem lại Cổng Xoay
              </button>
            </div>
          </div>
        )}

        {/* Navigation Footer Actions */}
        {!isWarped && (
          <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {onPrev && (
              <button
                onClick={onPrev}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-slate-900/70 border border-white/20 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                ← Scene 3 (4 Lớp ATTT)
              </button>
            )}
            <button
              onClick={() => setIsWarped(true)}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono text-emerald-300 transition-colors cursor-pointer"
            >
              Bỏ qua giữ phím · Mở Cổng Ngay →
            </button>
          </div>
        )}
      </div>

      {/* Bottom Meta */}
      <div
        className={`relative z-10 px-4 sm:px-12 pb-6 sm:pb-8 flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-widest pointer-events-none ${
          isWarped ? 'text-slate-700' : 'text-emerald-400/75'
        }`}
      >
        <span className="truncate max-w-[42%]">Scene 04 // Cloud Portal Warp</span>
        <span className="shrink-0">+75% · 04 (+400 SEC-XP)</span>
      </div>
    </HybridSceneStage>
  );
};

export default Scene4Portal;
