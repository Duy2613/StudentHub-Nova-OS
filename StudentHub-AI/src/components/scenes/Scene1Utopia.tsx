import React, { useEffect, useRef, useState } from 'react';
import TapHoldTrigger from '../hud/TapHoldTrigger';
import HybridSceneStage, { VisualCompositorMode } from './HybridSceneStage';

interface Scene1UtopiaProps {
  onNext?: () => void;
  visualMode?: VisualCompositorMode;
}

export const Scene1Utopia: React.FC<Scene1UtopiaProps> = ({
  onNext,
  visualMode = 'hybrid',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const holdProgressRef = useRef<number>(0);
  const [holdPercent, setHoldPercent] = useState<number>(0);

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

    // 42 3D Sakura & Emerald Neural Petals with Depth Layers
    const particles = Array.from({ length: 42 }, (_, idx) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      depth: 0.4 + (idx % 5) * 0.18,
      radius: 5 + Math.random() * 9,
      speedX: 0.35 + Math.random() * 0.75,
      speedY: 0.35 + Math.random() * 0.7,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.025,
      isEmerald: idx % 3 === 0,
    }));

    const render = () => {
      t += 0.016;
      const hp = holdProgressRef.current; // 0..1 when user holds TapHoldTrigger
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width * 0.52;
      const cy = canvas.height * 0.48;

      // 1. Volumetric God-Rays from upper-left canopy
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let r = 0; r < 4; r++) {
        const rayX = canvas.width * (0.18 + r * 0.18) + Math.sin(t * 0.6 + r) * 30;
        const grad = ctx.createLinearGradient(rayX, 0, rayX + 220, canvas.height);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
        grad.addColorStop(0.55, 'rgba(52, 211, 153, 0.07)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(rayX - 70, 0);
        ctx.lineTo(rayX + 90, 0);
        ctx.lineTo(rayX + 360, canvas.height);
        ctx.lineTo(rayX + 100, canvas.height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 2. Hand-Touch Neural Nexus & Hold-to-Shatter Shockwave Rings
      ctx.save();
      const baseGlow = 75 + Math.sin(t * 3) * 15 + hp * 220;
      const nexusGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, baseGlow);
      nexusGrad.addColorStop(0, hp > 0.5 ? 'rgba(254, 202, 202, 0.9)' : 'rgba(254, 240, 138, 0.75)');
      nexusGrad.addColorStop(0.4, hp > 0.5 ? 'rgba(248, 113, 113, 0.35)' : 'rgba(52, 211, 153, 0.32)');
      nexusGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = nexusGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseGlow, 0, Math.PI * 2);
      ctx.fill();

      // Expanding concentric ripples
      for (let w = 0; w < 3; w++) {
        const waveProg = (t * (0.4 + hp * 1.2) + w * 0.33) % 1;
        ctx.strokeStyle =
          hp > 0.45
            ? `rgba(239, 68, 68, ${(1 - waveProg) * (0.4 + hp * 0.5)})`
            : `rgba(5, 150, 105, ${(1 - waveProg) * 0.42})`;
        ctx.lineWidth = 1.8 + hp * 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 35 + waveProg * (260 + hp * 350), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Pre-shatter hairline cracks when holdProgress > 0.25
      if (hp > 0.25) {
        const crackIntensity = (hp - 0.25) / 0.75;
        const rays = 10;
        for (let c = 0; c < rays; c++) {
          const angle = (c / rays) * Math.PI * 2 + 0.3;
          ctx.strokeStyle = `rgba(220, 38, 38, ${crackIntensity * 0.75})`;
          ctx.lineWidth = 1.5 + crackIntensity * 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          let rx = cx;
          let ry = cy;
          const steps = Math.ceil(crackIntensity * 6);
          for (let s = 1; s <= steps; s++) {
            rx += Math.cos(angle + Math.sin(c * s) * 0.28) * (75 * crackIntensity);
            ry += Math.sin(angle + Math.cos(c * s) * 0.28) * (75 * crackIntensity);
            ctx.lineTo(rx, ry);
          }
          ctx.stroke();
        }
      }
      ctx.restore();

      // 3. Floating Sakura & Emerald Neural Petals
      particles.forEach((p) => {
        const speedBoost = 1 + hp * 3.5;
        p.x += (Math.sin(t + p.y * 0.01) * 0.45 + p.speedX) * p.depth * speedBoost;
        p.y += p.speedY * p.depth * speedBoost;
        p.angle += p.spin * speedBoost;

        if (p.y > canvas.height + 24) p.y = -24;
        if (p.x > canvas.width + 24) p.x = -24;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.isEmerald
          ? `rgba(16, 185, 129, ${0.42 * p.depth})`
          : `rgba(244, 114, 182, ${0.52 * p.depth})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius * p.depth, p.radius * 0.52 * p.depth, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleHoldProgress = (val: number) => {
    holdProgressRef.current = val;
    setHoldPercent(Math.round(val * 100));
  };

  return (
    <HybridSceneStage
      sceneNumber={1}
      imageSrc="/assets/images/scene1_utopia_ai_enhanced.png"
      videoSrc="/assets/videos/scene1_studenthub_novaos_loop.webm"
      visualMode={visualMode}
      videoBlendMode="screen"
      videoOpacity={0.38}
      imageOpacity={0.62}
      parallaxStrength={28}
      chromaticAberration={holdPercent > 35 ? (holdPercent - 35) / 65 : 0}
      lightTheme={true}
      className="bg-gradient-to-b from-[#f8fafc] via-[#ecfdf5] to-[#d1fae5] text-slate-900"
    >
      {/* Interactive Foreground Particle & Fracture Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[3]" />

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-6 sm:px-12 pt-20 sm:pt-24 pb-16 flex-1 flex flex-col justify-center min-h-[calc(100vh-5rem)]">
        {/* Top Epistemic Context Pill */}
        <div className="mb-3 inline-flex items-center gap-2 self-start px-3.5 py-1 rounded-full bg-white/85 backdrop-blur-md border border-emerald-600/25 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-wider text-emerald-900 uppercase">
            SCENE 01 · THE SINGLE-LAYER ILLUSION [R: 2.5D DEPTH + CLEAN-PLATE COMPOSITOR]
          </span>
        </div>

        {/* Hero Typography Section */}
        <div className="max-w-4xl space-y-1">
          <div className="flex items-baseline gap-3 sm:gap-4 flex-wrap">
            <span className="font-serif italic font-bold text-4xl sm:text-6xl md:text-7xl text-emerald-950 tracking-tight drop-shadow-sm">
              Firewall
            </span>
            <span className="font-sans font-semibold text-2xl sm:text-4xl md:text-5xl text-slate-800 tracking-tight">
              would keep
            </span>
          </div>

          <div className="py-1 flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="font-serif italic font-bold text-5xl sm:text-7xl md:text-8xl leading-none text-transparent bg-clip-text bg-gradient-to-r from-emerald-900 via-teal-700 to-emerald-600 tracking-tight">
              SAFE
            </span>
            <div className="hidden lg:flex flex-col px-3.5 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-emerald-700/20 shadow-sm max-w-xs">
              <span className="font-mono text-[10px] font-bold text-emerald-800 uppercase">
                Tương tác Bàn tay Sinh viên × AI
              </span>
              <span className="text-[11px] text-slate-700 mt-0.5 leading-snug">
                Di chuột để cảm nhận chiều sâu 2.5D. Nhấn giữ để kiểm tra độ bền của bảo mật đơn lớp.
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3 sm:gap-4 flex-wrap pt-0.5">
            <span className="font-sans font-medium text-2xl sm:text-4xl text-slate-700">
              StudentHub
            </span>
            <span className="font-serif italic font-bold text-4xl sm:text-6xl md:text-7xl text-emerald-950">
              Data.
            </span>
          </div>
        </div>

        {/* Subtitle / Narrative */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-800/90 max-w-xl font-medium leading-relaxed bg-white/65 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl border border-white/70 shadow-sm">
          Mọi nền tảng học tập tích hợp AI đều trông hoàn hảo dưới ánh nắng — cho đến khi một tài liệu RAG chứa mã độc hoặc một liên kết giả mạo xuyên thủng bức tường lửa đơn độc.
        </p>

        {/* Tap & Hold Interaction Trigger + Stress Meter */}
        <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-4 sm:gap-6">
          <TapHoldTrigger
            labelTop="NHẤN GIỮ"
            labelBottom="KIỂM CHỨNG SỰ THẬT"
            primaryColor={holdPercent > 50 ? '#dc2626' : '#059669'}
            holdDurationMs={1400}
            darkText={true}
            onProgress={handleHoldProgress}
            onComplete={onNext}
          />

          {holdPercent > 0 && (
            <div className="px-3.5 py-2 rounded-xl bg-red-950/90 text-red-100 border border-red-400/50 font-mono text-xs shadow-xl animate-pulse">
              ⚠️ ÁP LỰC LÊN TƯỜNG LỬA ĐƠN LỚP: <b>{holdPercent}%</b> — ĐANG RẠN NỨT...
            </div>
          )}
        </div>
      </div>

      {/* Bottom Scene Indicator Meta */}
      <div className="relative z-10 px-4 sm:px-12 pb-6 sm:pb-8 flex items-center justify-between text-[11px] font-mono font-bold text-emerald-950/75 uppercase tracking-wider pointer-events-none">
        <span className="truncate max-w-[42%]">Scene 01 // Single-Layer AI Utopia</span>
        <span className="shrink-0">-18% · 01 (+100 SEC-XP)</span>
      </div>
    </HybridSceneStage>
  );
};

export default Scene1Utopia;
