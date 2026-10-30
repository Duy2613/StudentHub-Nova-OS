import React, { useEffect, useRef, useState } from 'react';

export type VisualCompositorMode = 'hybrid' | 'ai3d' | 'video';

export interface ScrollScrubTelemetry {
  masterProgress: number; // 0..1 across all 5 scenes
  sceneIndex: number;     // 1..5
  localProgress: number;  // 0..1 within current scene
  velocity: number;       // signed scroll velocity
}

interface HybridSceneStageProps {
  sceneNumber: 1 | 2 | 3 | 4 | 5;
  imageSrc: string;
  videoSrc: string;
  visualMode?: VisualCompositorMode;
  videoBlendMode?: 'screen' | 'lighten' | 'soft-light';
  videoOpacity?: number;
  imageOpacity?: number;
  parallaxStrength?: number;
  chromaticAberration?: number; // 0..1
  lightTheme?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * skill.ui.zero_scrollytelling_compositor@3 (120FPS Ultra-Optimized GPU Edition)
 * - ZERO React setState on mousemove or scroll!
 * - ZERO moving CSS filter:blur() layers!
 * - ZERO video.currentTime keyframe-seeking stutter!
 * - Pure GPU Composite Layer transforms (translate3d + scale) inside requestAnimationFrame.
 */
export const HybridSceneStage: React.FC<HybridSceneStageProps> = ({
  sceneNumber,
  imageSrc,
  videoSrc,
  visualMode = 'hybrid',
  videoBlendMode = 'screen',
  videoOpacity = 0.42,
  imageOpacity = 0.82,
  parallaxStrength = 26,
  chromaticAberration = 0,
  lightTheme = false,
  className = '',
  children,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const mainPlateRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rimLightRef = useRef<HTMLDivElement | null>(null);

  const targetPointerRef = useRef({ x: 0, y: 0, rawX: 50, rawY: 50 });
  const smoothPointerRef = useRef({ x: 0, y: 0, rawX: 50, rawY: 50 });
  const scrollStateRef = useRef({ localProgress: 0, velocity: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    let rafId: number;
    let lastRateUpdate = 0;

    const onScrollTelemetry = (e: Event) => {
      const detail = (e as CustomEvent<ScrollScrubTelemetry>).detail;
      if (!detail || detail.sceneIndex !== sceneNumber) return;
      scrollStateRef.current.localProgress = detail.localProgress;
      scrollStateRef.current.velocity = detail.velocity;

      // Throttle playbackRate updates to every 120ms and NEVER seek vid.currentTime (prevents VP9 decoder stutter!)
      const now = performance.now();
      const vid = videoRef.current;
      if (vid && now - lastRateUpdate > 120) {
        lastRateUpdate = now;
        const absVel = Math.abs(detail.velocity);
        const targetRate = absVel > 0.004 ? Math.min(2.4, 1.0 + absVel * 14) : 1.0;
        if (Math.abs(vid.playbackRate - targetRate) > 0.15) {
          try {
            vid.playbackRate = targetRate;
          } catch {
            // Ignore browser media rate constraints
          }
        }
      }
    };

    window.addEventListener('nova-scroll-telemetry', onScrollTelemetry, { passive: true });

    const animateGpuLayers = () => {
      if (!reducedMotion) {
        // Smooth lerp for pointer coordinates (no React re-render!)
        const tp = targetPointerRef.current;
        const sp = smoothPointerRef.current;
        sp.x += (tp.x - sp.x) * 0.12;
        sp.y += (tp.y - sp.y) * 0.12;
        sp.rawX += (tp.rawX - sp.rawX) * 0.15;
        sp.rawY += (tp.rawY - sp.rawY) * 0.15;

        const lp = scrollStateRef.current.localProgress; // 0..1 within scene
        const vel = scrollStateRef.current.velocity;

        const dx = -sp.x * parallaxStrength;
        const dy = -sp.y * (parallaxStrength * 0.65) - (lp - 0.5) * 42;

        // Smooth Z-Axis Camera Dolly Zoom driven by mouse wheel progress
        const dollyScale = 1.05 + lp * 0.15 + Math.min(0.08, Math.abs(vel) * 0.2);
        const videoScale = 1.03 + lp * 0.18;

        if (mainPlateRef.current) {
          mainPlateRef.current.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${dollyScale.toFixed(3)})`;
        }
        if (videoRef.current) {
          videoRef.current.style.transform = `translate3d(${(dx * 0.6).toFixed(1)}px, ${(dy * 0.6).toFixed(1)}px, 0) scale(${videoScale.toFixed(3)})`;
        }
        if (rimLightRef.current) {
          rimLightRef.current.style.background = lightTheme
            ? `radial-gradient(600px circle at ${sp.rawX.toFixed(1)}% ${sp.rawY.toFixed(1)}%, rgba(16, 185, 129, 0.15), transparent 65%)`
            : `radial-gradient(650px circle at ${sp.rawX.toFixed(1)}% ${sp.rawY.toFixed(1)}%, rgba(52, 211, 153, 0.13), transparent 65%)`;
        }

        scrollStateRef.current.velocity *= 0.88;
      }
      rafId = requestAnimationFrame(animateGpuLayers);
    };

    rafId = requestAnimationFrame(animateGpuLayers);

    return () => {
      window.removeEventListener('nova-scroll-telemetry', onScrollTelemetry);
      cancelAnimationFrame(rafId);
    };
  }, [sceneNumber, parallaxStrength, reducedMotion, lightTheme]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    targetPointerRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      rawX: ((e.clientX - rect.left) / rect.width) * 100,
      rawY: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const handleMouseLeave = () => {
    targetPointerRef.current = { x: 0, y: 0, rawX: 50, rawY: 50 };
  };

  const showAiImage = visualMode === 'hybrid' || visualMode === 'ai3d';
  const showVideo = visualMode === 'hybrid' || visualMode === 'video';

  // Elliptical mask removes top (<13%) and bottom (>85%) baked HUD from old .webm recordings in hybrid mode
  const cleanPlateMask =
    visualMode === 'hybrid'
      ? 'radial-gradient(ellipse 82% 64% at 50% 50%, rgba(0,0,0,1) 38%, rgba(0,0,0,0.45) 66%, rgba(0,0,0,0) 84%)'
      : 'none';

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full min-h-screen flex flex-col justify-between overflow-hidden select-none ${className}`}
    >
      {/* LAYER 1: Master 3D AI-Enhanced Crisp Plate with GPU-Accelerated 2.5D Parallax & Scroll Dolly */}
      {showAiImage && (
        <div
          ref={mainPlateRef}
          className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: `url('${imageSrc}')`,
            opacity: visualMode === 'ai3d' ? Math.min(imageOpacity + 0.14, 0.96) : imageOpacity,
            willChange: 'transform',
            transform: 'translate3d(0px, 0px, 0) scale(1.06)',
          }}
        />
      )}

      {/* Optional Lightweight Chromatic Aberration Edge Highlight */}
      {showAiImage && chromaticAberration > 0.15 && !reducedMotion && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            boxShadow: `inset ${Math.round(chromaticAberration * 14)}px 0 28px rgba(239,68,68,${(chromaticAberration * 0.35).toFixed(2)}), inset -${Math.round(chromaticAberration * 14)}px 0 28px rgba(56,189,248,${(chromaticAberration * 0.35).toFixed(2)})`,
          }}
        />
      )}

      {/* LAYER 2: Clean-Plate Masked Motion Video Loop (.webm) */}
      {showVideo && (
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          preload="auto"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[1]"
          style={{
            opacity: visualMode === 'video' ? 0.88 : videoOpacity,
            mixBlendMode: visualMode === 'video' ? 'normal' : videoBlendMode,
            WebkitMaskImage: cleanPlateMask,
            maskImage: cleanPlateMask,
            willChange: 'transform',
            transform: 'translate3d(0px, 0px, 0) scale(1.04)',
          }}
        />
      )}

      {/* LAYER 3: Cursor-Tracked Specular 3D Rim Light (Direct Ref Update - Zero React Re-render) */}
      <div
        ref={rimLightRef}
        className="absolute inset-0 pointer-events-none z-[2]"
      />

      {/* LAYER 4: Cinema Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: lightTheme
            ? 'radial-gradient(ellipse at center, transparent 58%, rgba(6, 78, 59, 0.18) 100%)'
            : 'radial-gradient(ellipse at center, transparent 50%, rgba(2, 6, 23, 0.72) 100%)',
        }}
      />

      {/* LAYER 5: Interactive Scene Canvas & Foreground Content */}
      {children}
    </section>
  );
};

export default HybridSceneStage;
