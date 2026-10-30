import React, { useEffect, useRef, useState } from 'react';
import HybridSceneStage, { VisualCompositorMode } from './HybridSceneStage';

interface Scene3FourLayersProps {
  onNext?: () => void;
  onPrev?: () => void;
  visualMode?: VisualCompositorMode;
}

export const Scene3FourLayers: React.FC<Scene3FourLayersProps> = ({
  onNext,
  onPrev,
  visualMode = 'hybrid',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<number>(1);
  const [burnProgress, setBurnProgress] = useState<number>(78); // 0..100% burn-to-hologram progression

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

    // 55 Rising glowing fire embers (amber) & cyber shield particles (emerald)
    const embers = Array.from({ length: 55 }, (_, idx) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: 1.5 + Math.random() * 3.2,
      speedY: 0.9 + Math.random() * 2.1,
      speedX: (Math.random() - 0.5) * 0.9,
      isEmerald: idx % 2 === 0,
    }));

    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height * 0.48;

      // 1. 4-Layer Counter-Rotating Orbital Shield Hologram
      for (let r = 1; r <= 4; r++) {
        const isFocused = selectedLayer === r;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * (r % 2 === 0 ? 0.5 : -0.5) * (1.3 / r));
        ctx.strokeStyle = isFocused
          ? 'rgba(52, 211, 153, 0.85)'
          : r === 1
          ? 'rgba(245, 158, 11, 0.35)'
          : `rgba(16, 185, 129, ${0.48 - r * 0.07})`;
        ctx.lineWidth = isFocused ? 3.5 : 1.8;
        ctx.setLineDash([45 + r * 14, 24]);
        ctx.beginPath();
        ctx.arc(0, 0, 95 + r * 68, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Rising Fire Embers & Emerald Cyber Motes (Fast 2-pass halo, 0 shadowBlur)
      embers.forEach((e) => {
        e.y -= e.speedY;
        e.x += e.speedX + Math.sin(t + e.y * 0.012) * 0.55;

        if (e.y < -12) {
          e.y = canvas.height + 12;
          e.x = Math.random() * canvas.width;
        }

        ctx.fillStyle = e.isEmerald ? 'rgba(52, 211, 153, 0.22)' : 'rgba(251, 146, 60, 0.22)';
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = e.isEmerald ? '#10b981' : '#f97316';
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [selectedLayer]);

  const layers = [
    {
      id: 1,
      badge: 'LỚP 1 · TUYẾN ĐẦU TẠI CHỖ',
      honesty: '[R] Real + [H] Hybrid',
      skillId: 'skill.layer1.prompt_guard@2 & url_analyzer@2',
      title: 'Lực lượng tại chỗ & Bảo vệ RAG/Endpoint',
      epistemicRole: 'Trust V5 L1: Quét từ khóa lừa đảo tiếng Việt, homoglyph, yêu cầu OTP/chuyển khoản.',
      cyberRole: 'Nova OS L1: Multi-Stage Prompt Guard (4 tầng chống Direct/Indirect RAG Injection) + SSRF URL Analyzer + Hygiene.',
      color: 'emerald',
    },
    {
      id: 2,
      badge: 'LỚP 2 · GIÁM SÁT & PHẢN ỨNG 24/7',
      honesty: '[R] SOAR + [H] SOC Stream',
      skillId: 'skill.layer2.soar_responder@2 & soc_anomaly@2',
      title: 'Trung tâm AI SOC 24/7 & Graduated SOAR',
      epistemicRole: 'Trust V5 L2: Phân tích uy tín nguồn (L2A), ngữ nghĩa AI sâu (L2B) & rủi ro học đường (L2C).',
      cyberRole: 'Nova OS L2: Liên thông SecurityFabric -> SecurityEvent v2 -> Phản ứng 5 nấc thang bảo vệ IP NAT Campus + Undo 1 chạm.',
      color: 'sky',
    },
    {
      id: 3,
      badge: 'LỚP 3 · KIỂM ĐỊNH ĐỘC LẬP',
      honesty: '[R] SAST + [S] Cyber Range',
      skillId: 'skill.layer3.code_security_auditor@2',
      title: 'Kiểm định Mã nguồn SAST & Red-Team Lab',
      epistemicRole: 'Trust V5 L3: Truy xuất và đối chiếu nguồn bằng chứng độc lập qua SafeRemoteUrl.',
      cyberRole: 'Nova OS L3: Quét SAST xác định (Semgrep/Bandit/gitleaks) + HybridLLM Patch (Ollama/Gemini) + Bắt buộc quét lại (Re-scan = 0 lỗi).',
      color: 'amber',
    },
    {
      id: 4,
      badge: 'LỚP 4 · LIÊN THÔNG QUỐC GIA & HỘ CHIẾU',
      honesty: '[R] STIX/k-Anon + [S] TAXII Lab',
      skillId: 'skill.layer4.threat_intel_synchronizer@2',
      title: 'Đồng bộ Tình báo STIX 2.1 & Evidence Passport',
      epistemicRole: 'Trust V5 L4: Phán quyết hiệu chỉnh cuối cùng & đóng dấu vào Living Evidence Passport.',
      cyberRole: 'Nova OS L4: Đồng bộ IOC chuẩn STIX 2.1 (URLhaus/KEV), tra cứu lộ mật khẩu k-Anonymity (5-hex SHA-1) & cổng duyệt TLP (k >= 5).',
      color: 'purple',
    },
  ];

  return (
    <HybridSceneStage
      sceneNumber={3}
      imageSrc="/assets/images/scene3_burn_ai_enhanced.png"
      videoSrc="/assets/videos/scene3_studenthub_novaos_loop.webm"
      visualMode={visualMode}
      videoBlendMode="screen"
      videoOpacity={0.42}
      imageOpacity={0.74}
      parallaxStrength={26}
      className="bg-gradient-to-b from-[#06100c] via-[#090d16] to-[#050807] text-white"
    >
      {/* Orbital Hologram & Rising Embers Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[3]" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-8 lg:px-12 pt-20 sm:pt-24 pb-12 flex-1 flex flex-col justify-center">
        {/* Contrast Heading + Burn Progression Control */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 border-b border-white/10 pb-4 sm:pb-5">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-amber-400 font-bold block mb-1">
              SCENE 03 · PERLIN FIRE DISSOLVE & DUAL 4-LAYER ARCHITECTURE
            </span>
            <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
              <span className="font-sans font-light text-xl sm:text-2xl text-slate-300">
                Lý thuyết bán
              </span>
              <span
                className="font-serif italic font-bold text-3xl sm:text-5xl text-amber-500 line-through decoration-amber-400/80 transition-opacity"
                style={{ opacity: Math.max(0.25, 1 - burnProgress / 130) }}
              >
                Giấy tờ
              </span>
            </div>
          </div>

          {/* Interactive Burn-to-Shield Slider */}
          <div className="flex flex-col items-start lg:items-center bg-slate-900/80 backdrop-blur-xl px-3.5 py-2 rounded-2xl border border-emerald-500/30">
            <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-mono">
              <span className="text-amber-400">🔥 Đốt Quy tắc Cũ</span>
              <input
                type="range"
                min={0}
                max={100}
                value={burnProgress}
                onChange={(e) => setBurnProgress(Number(e.target.value))}
                className="w-24 sm:w-28 accent-emerald-400 cursor-pointer"
              />
              <span className="text-emerald-300 font-bold">{burnProgress}% Khiên 4 Lớp</span>
            </div>
          </div>

          <div className="lg:text-right">
            <span className="font-sans font-medium text-lg sm:text-xl text-slate-300 block">
              Thực chiến hợp nhất
            </span>
            <span className="font-serif italic font-bold text-3xl sm:text-5xl text-emerald-400 block drop-shadow-[0_0_30px_rgba(52,211,153,0.55)]">
              Song Kiếm 4 Lớp
            </span>
          </div>
        </div>

        {/* 4 Layers Interactive Dual-Architecture Grid */}
        <div className="mt-5 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-6xl mx-auto w-full">
          {layers.map((l) => {
            const isSelected = selectedLayer === l.id;
            return (
              <div
                key={l.id}
                onClick={() => setSelectedLayer(l.id)}
                className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-2xl border ${
                  isSelected
                    ? 'bg-emerald-950/70 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.3)] scale-[1.01]'
                    : 'bg-slate-950/55 border-white/10 hover:border-emerald-500/50 hover:bg-slate-900/75'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {l.badge}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-amber-300 border border-amber-400/30">
                    {l.honesty}
                  </span>
                </div>

                <h3 className="font-sans font-bold text-sm sm:text-base text-white mb-0.5">
                  {l.title}
                </h3>
                <div className="font-mono text-[10px] text-cyan-300/90 mb-2.5">
                  Contract: {l.skillId}
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-black/35 border border-white/10">
                    <span className="font-mono font-bold text-sky-300 block mb-0.5 text-[11px]">
                      🧠 Mặt trận Nhận thức (StudentHub-AI Trust V5):
                    </span>
                    <span className="text-slate-200 text-[11px] sm:text-xs">{l.epistemicRole}</span>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-950/45 border border-emerald-500/25">
                    <span className="font-mono font-bold text-emerald-300 block mb-0.5 text-[11px]">
                      🛡️ Mặt trận Hạ tầng (Nova OS ATTT 4 Lớp):
                    </span>
                    <span className="text-emerald-100 text-[11px] sm:text-xs">{l.cyberRole}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Action Buttons */}
        <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {onPrev && (
            <button
              onClick={onPrev}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-slate-900/70 border border-white/20 text-slate-300 text-xs sm:text-sm font-semibold hover:bg-white/10 transition-colors cursor-pointer"
            >
              ← Scene 2 (Vỡ kính)
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold tracking-wide shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 cursor-pointer"
            >
              Tiến vào Cổng Xoay Nova OS (Scene 4) →
            </button>
          )}
        </div>
      </div>

      {/* Bottom Meta */}
      <div className="relative z-10 px-4 sm:px-12 pb-6 sm:pb-8 flex items-center justify-between text-[11px] font-mono font-semibold text-emerald-400/75 uppercase tracking-widest pointer-events-none">
        <span className="truncate max-w-[42%]">Scene 03 // Dual 4-Layer Architecture</span>
        <span className="shrink-0">+45% · 03 (+300 SEC-XP)</span>
      </div>
    </HybridSceneStage>
  );
};

export default Scene3FourLayers;
