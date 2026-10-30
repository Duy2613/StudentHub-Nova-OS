import React, { useState, useEffect, useRef } from 'react';
import HybridSceneStage, { VisualCompositorMode } from './HybridSceneStage';

interface Scene5CyberCityProps {
  onOpenApp?: (appId: string) => void;
  onLaunchNovaOs?: () => void;
  onPrev?: () => void;
  visualMode?: VisualCompositorMode;
}

interface CityBuildingNode {
  id: string;
  title: string;
  name: string;
  badge: string;
  honestyBadge: string;
  skillContract: string;
  color: string;
  appId: string;
  mapX: string; // % position on isometric map
  mapY: string;
  desc: string;
  liveMetric: string;
}

export const Scene5CyberCity: React.FC<Scene5CyberCityProps> = ({
  onOpenApp,
  onLaunchNovaOs,
  onPrev,
  visualMode = 'hybrid',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>('studenthub');
  const [cityViewMode, setCityViewMode] = useState<'spatial' | 'grid'>('spatial');

  const buildings: CityBuildingNode[] = [
    {
      id: 'layer1',
      title: 'LỚP 1: TÒA THỦ QUÂN TẠI CHỖ',
      name: 'LOCAL AI GUARD & SSRF SANDBOX',
      badge: 'LỚP 1',
      honestyBadge: '[R] Real + [H] Hygiene',
      skillContract: 'skill.layer1.prompt_guard@2',
      color: '#34d399',
      appId: 'layer1',
      mapX: '22%',
      mapY: '32%',
      desc: 'Lọc Prompt Injection 4 tầng (NFKC, Heuristic, Semantic, <untrusted_context>, Canary), kiểm tra link chống SSRF và vệ sinh phiên MFA.',
      liveMetric: '4-Stage Guard · <12ms Latency',
    },
    {
      id: 'layer2',
      title: 'LỚP 2: THÁP GIÁM SÁT AI SOC 24/7',
      name: 'GRADUATED SOAR & CAMPUS NAT GUARD',
      badge: 'LỚP 2',
      honestyBadge: '[R] SOAR + [H] Telemetry',
      skillContract: 'skill.layer2.soar_responder@2',
      color: '#38bdf8',
      appId: 'layer2',
      mapX: '78%',
      mapY: '32%',
      desc: 'Phát hiện dị thường theo chuẩn SecurityEvent v2, phản ứng tự động 5 nấc thang có TTL, bảo vệ dải IP NAT Ký túc xá và hỗ trợ Undo 1 chạm.',
      liveMetric: '0% Campus False Block · 1-Click Undo',
    },
    {
      id: 'layer3',
      title: 'LỚP 3: VIỆN KIỂM ĐỊNH ĐỘC LẬP',
      name: 'DETERMINISTIC SAST & CYBER RANGE',
      badge: 'LỚP 3',
      honestyBadge: '[R] SAST + [S] Range',
      skillContract: 'skill.layer3.code_security_auditor@2',
      color: '#fbbf24',
      appId: 'layer3',
      mapX: '22%',
      mapY: '72%',
      desc: 'Quét mã nguồn đồ án sinh viên bằng SAST xác định (Semgrep/Bandit/gitleaks), sinh bản vá qua HybridLLM (Ollama/Gemini) và bắt buộc quét lại.',
      liveMetric: 'Mandatory Re-scan Gate = 0 Vulns',
    },
    {
      id: 'layer4',
      title: 'LỚP 4: TRẠM LIÊN THÔNG QUỐC GIA',
      name: 'STIX 2.1 / TAXII & K-ANONYMITY',
      badge: 'LỚP 4',
      honestyBadge: '[R] STIX/k-Anon + [S] TAXII',
      skillContract: 'skill.layer4.threat_intel_synchronizer@2',
      color: '#a78bfa',
      appId: 'layer4',
      mapX: '78%',
      mapY: '72%',
      desc: 'Đồng bộ IOC chuẩn STIX 2.1, tra cứu lộ mật khẩu bằng 5 ký tự đầu SHA-1 (k-Anonymity) và đóng dấu vào Living Evidence Passport.',
      liveMetric: 'k >= 5 Privacy Gate · TLP Enforced',
    },
  ];

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
      t += 0.018;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.52;

      const towerCoords = [
        { x: canvas.width * 0.22, y: canvas.height * 0.32, color: '#34d399' },
        { x: canvas.width * 0.78, y: canvas.height * 0.32, color: '#38bdf8' },
        { x: canvas.width * 0.22, y: canvas.height * 0.72, color: '#fbbf24' },
        { x: canvas.width * 0.78, y: canvas.height * 0.72, color: '#a78bfa' },
      ];

      // 1. Isometric Circuit Highways & Travelling Data Packets
      towerCoords.forEach((tc, idx) => {
        ctx.save();
        ctx.strokeStyle = `${tc.color}55`;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(tc.x, tc.y);
        ctx.stroke();

        // Data packet flowing from tower to core and back (Fast 2-pass halo, 0 shadowBlur)
        const prog = (t * 0.55 + idx * 0.25) % 1;
        const px = tc.x + (cx - tc.x) * prog;
        const py = tc.y + (cy - tc.y) * prog;

        ctx.fillStyle = `${tc.color}33`;
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = tc.color;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 2. Central Holographic Energy Dome Pulse
      const pulse = 1 + Math.sin(t * 2.5) * 0.04;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(pulse, pulse);

      const domeGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 190);
      domeGrad.addColorStop(0, 'rgba(52, 211, 153, 0.38)');
      domeGrad.addColorStop(0.65, 'rgba(16, 185, 129, 0.12)');
      domeGrad.addColorStop(1, 'rgba(5, 150, 105, 0)');

      ctx.fillStyle = domeGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 210, 130, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(52, 211, 153, 0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 18, 220, 95, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const activeNode = buildings.find((b) => b.id === hoveredBuilding);

  return (
    <HybridSceneStage
      sceneNumber={5}
      imageSrc="/assets/images/scene5_city_ai_enhanced.png"
      videoSrc="/assets/videos/scene5_studenthub_novaos_loop.webm"
      visualMode={visualMode}
      videoBlendMode="screen"
      videoOpacity={0.36}
      imageOpacity={0.86}
      parallaxStrength={24}
      className="bg-slate-950 text-white"
    >
      {/* Isometric Circuit & Energy Dome Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[3]" />

      {/* Top Header & View Mode Switcher */}
      <div className="relative z-10 container mx-auto px-4 sm:px-8 lg:px-12 pt-20 sm:pt-24 pb-2 flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="text-center lg:text-left">
          <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
            SCENE 05 · ISOMETRIC 3D CYBER-DEFENSE CITY (`scene5_city_ai_enhanced.png`)
          </span>
          <h2 className="font-sans font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight mt-1.5 sm:mt-2">
            Đô Thị Số Sinh Viên <span className="text-emerald-400">Nova City</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-xl p-1.5 rounded-full border border-white/15">
          <button
            onClick={() => setCityViewMode('spatial')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              cityViewMode === 'spatial'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🗺️ Bản Đồ 3D Hotspot
          </button>
          <button
            onClick={() => setCityViewMode('grid')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              cityViewMode === 'grid'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🎛️ Lưới Điều Hành 5 Phân Hệ
          </button>
        </div>
      </div>

      {/* SPATIAL 3D HOTSPOT MODE: Interactive Beacons Directly on the 3D Isometric City */}
      {cityViewMode === 'spatial' ? (
        <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto my-2 min-h-[470px]">
          {/* Central StudentHub-AI Core Dome Pin */}
          <div
            onMouseEnter={() => setHoveredBuilding('studenthub')}
            onClick={onLaunchNovaOs}
            style={{ left: '50%', top: '48%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 flex flex-col items-center"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-4 rounded-full bg-emerald-400/35 animate-ping" />
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 border-2 border-white flex items-center justify-center font-black text-2xl shadow-[0_0_40px_rgba(16,185,129,0.9)] group-hover:scale-110 transition-transform">
                ✦
              </div>
            </div>
            <div className="mt-2 px-4 py-2 rounded-2xl bg-slate-950/90 backdrop-blur-xl border-2 border-emerald-400 text-center shadow-2xl group-hover:scale-105 transition-transform">
              <div className="font-mono text-[10px] font-bold text-emerald-300 uppercase">
                TRUNG TÂM ĐIỀU HÀNH LÕI [R]
              </div>
              <div className="font-sans font-black text-sm sm:text-base text-white">
                ENTER NOVA OS DESKTOP ↗
              </div>
            </div>
          </div>

          {/* 4 Satellite Layer Tower Pins */}
          {buildings.map((b) => {
            const isHovered = hoveredBuilding === b.id;
            return (
              <div
                key={b.id}
                style={{ left: b.mapX, top: b.mapY }}
                onMouseEnter={() => setHoveredBuilding(b.id)}
                onClick={() => onOpenApp?.(b.appId)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 flex flex-col items-center"
              >
                {/* Pulsing Beacon Node */}
                <div className="relative flex items-center justify-center">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-mono font-black text-xs text-slate-950 border-2 border-white shadow-xl group-hover:scale-115 transition-transform"
                    style={{
                      backgroundColor: b.color,
                      boxShadow: `0 0 28px ${b.color}`,
                    }}
                  >
                    {b.badge.replace('LỚP ', 'L')}
                  </div>
                </div>

                {/* Floating Tower Label Pill */}
                <div
                  className={`mt-2 px-3.5 py-2 rounded-2xl backdrop-blur-xl border transition-all duration-200 w-56 sm:w-64 ${
                    isHovered
                      ? 'bg-slate-950/95 scale-105 shadow-2xl'
                      : 'bg-slate-950/80 hover:bg-slate-950/95'
                  }`}
                  style={{ borderColor: isHovered ? b.color : 'rgba(255,255,255,0.2)' }}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
                    <span style={{ color: b.color }} className="font-bold">
                      {b.badge} · {b.honestyBadge}
                    </span>
                    <span className="text-emerald-300">MỞ APP ↗</span>
                  </div>
                  <div className="font-sans font-bold text-xs sm:text-sm text-white truncate">
                    {b.title}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 truncate mt-0.5">
                    {b.liveMetric}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bottom Inspector Bar for Hovered Building */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-30">
            <div className="p-4 rounded-2xl bg-slate-950/90 backdrop-blur-2xl border border-emerald-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              {activeNode ? (
                <>
                  <div className="text-left">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span
                        className="px-2 py-0.5 rounded font-bold text-slate-950"
                        style={{ backgroundColor: activeNode.color }}
                      >
                        {activeNode.badge}
                      </span>
                      <span className="text-emerald-300 font-bold">{activeNode.honestyBadge}</span>
                      <span className="text-slate-400">· {activeNode.skillContract}</span>
                    </div>
                    <h4 className="font-sans font-bold text-sm sm:text-base text-white mt-1">
                      {activeNode.title} — <span className="text-cyan-300">{activeNode.name}</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">{activeNode.desc}</p>
                  </div>
                  <button
                    onClick={() => onOpenApp?.(activeNode.appId)}
                    className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-sans font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
                  >
                    Mở {activeNode.badge} trong Nova OS ↗
                  </button>
                </>
              ) : (
                <>
                  <div className="text-left">
                    <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
                      TRUNG TÂM ĐIỀU HÀNH STUDENTHUB-AI × NOVA OS (V5 CORE)
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Rê chuột hoặc bấm vào từng tòa tháp trên bản đồ Isometric 3D để kiểm tra trạng thái và khởi chạy trực tiếp ứng dụng tương ứng.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenApp?.('passport')}
                      className="px-4 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-sky-200 font-sans font-bold text-xs uppercase tracking-wider cursor-pointer transition-all"
                    >
                      🛂 Passport & RQ1–RQ3
                    </button>
                    <button
                      onClick={onLaunchNovaOs}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-sans font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
                    >
                      Vào Nova OS Desktop (6 Apps) ↗
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* COMMAND GRID VIEW MODE */
        <div className="relative z-10 container mx-auto px-6 sm:px-12 py-4 flex-1 flex flex-col justify-center items-center">
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={onLaunchNovaOs}
              className="md:col-span-2 cursor-pointer group text-center py-6 px-8 rounded-3xl bg-emerald-950/60 backdrop-blur-2xl border-2 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.35)] hover:scale-[1.01] transition-all flex flex-col items-center"
            >
              <span className="font-mono text-xs tracking-widest text-emerald-300 font-bold uppercase">
                STUDENTHUB-AI V5 × NOVA OS KERNEL [R]
              </span>
              <h3 className="font-sans font-black text-2xl sm:text-3xl text-white mt-1">
                KHỞI CHẠY KHÔNG GIAN LÀM VIỆC NOVA OS (6 APPS) ↗
              </h3>
            </div>

            {buildings.map((b) => (
              <div
                key={b.id}
                onClick={() => onOpenApp?.(b.appId)}
                className="p-5 rounded-2xl cursor-pointer transition-all duration-300 bg-slate-950/80 backdrop-blur-xl border border-white/15 hover:border-emerald-400 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border"
                      style={{
                        borderColor: b.color,
                        color: b.color,
                        backgroundColor: `${b.color}18`,
                      }}
                    >
                      {b.badge} · {b.honestyBadge}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-300">
                      LAUNCH APP ↗
                    </span>
                  </div>
                  <h4 className="font-sans font-bold text-base text-white mb-1">{b.title}</h4>
                  <p className="font-mono text-[11px] text-cyan-300 mb-2">{b.skillContract}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Scene Meta */}
      <div className="relative z-10 px-4 sm:px-12 pb-6 sm:pb-8 flex items-center justify-between text-[11px] font-mono font-bold text-emerald-400/80 uppercase tracking-widest pointer-events-none">
        <span className="truncate max-w-[42%]">Scene 05 // Isometric 3D Cyber City</span>
        <div className="flex items-center gap-4 sm:gap-6 pointer-events-auto">
          {onPrev && (
            <button
              onClick={onPrev}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              ← Quay lại Scene 4
            </button>
          )}
          <span className="shrink-0">+100% · 05 COMPLETE (500 SEC-XP)</span>
        </div>
      </div>
    </HybridSceneStage>
  );
};

export default Scene5CyberCity;
