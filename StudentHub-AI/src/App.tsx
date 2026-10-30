import React, { useState, useEffect, useRef, useCallback } from 'react';
import TopTimeline from './components/hud/TopTimeline';
import XpCounter from './components/hud/XpCounter';
import FloatingDock from './components/hud/FloatingDock';

import Scene1Utopia from './components/scenes/Scene1Utopia';
import Scene2Shatter from './components/scenes/Scene2Shatter';
import Scene3FourLayers from './components/scenes/Scene3FourLayers';
import Scene4Portal from './components/scenes/Scene4Portal';
import Scene5CyberCity from './components/scenes/Scene5CyberCity';
import { VisualCompositorMode, ScrollScrubTelemetry } from './components/scenes/HybridSceneStage';
import CinematicTransitionDirector, {
  TransitionType,
  TransitionEventPayload,
} from './components/scenes/CinematicTransitionDirector';

import NovaDesktop from './components/nova-os/NovaDesktop';

const API_BASE = 'http://localhost:8000';

// 4 Boundary Windows between Scene 1->2, 2->3, 3->4, 4->5 on masterProgress (0..1)
const BOUNDARIES: Array<{
  center: number;
  halfWidth: number;
  from: number;
  to: number;
  type: TransitionType;
}> = [
  { center: 0.2, halfWidth: 0.048, from: 1, to: 2, type: 'shatter_shockwave' },
  { center: 0.4, halfWidth: 0.048, from: 2, to: 3, type: 'fire_burn_wall' },
  { center: 0.6, halfWidth: 0.048, from: 3, to: 4, type: 'quantum_iris' },
  { center: 0.8, halfWidth: 0.048, from: 4, to: 5, type: 'cloud_warp_dive' },
];

const PRELOAD_IMAGES = [
  '/assets/images/scene1_utopia_ai_enhanced.png',
  '/assets/images/scene2_shatter_ai_enhanced.png',
  '/assets/images/scene3_burn_ai_enhanced.png',
  '/assets/images/scene4_portal_ai_enhanced.png',
  '/assets/images/scene5_city_ai_enhanced.png',
];

export const App: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [isNovaOsOpen, setIsNovaOsOpen] = useState<boolean>(false);
  const [initialApp, setInitialApp] = useState<string>('studenthub');
  const [audioActive, setAudioActive] = useState<boolean>(false);
  const [visualMode, setVisualMode] = useState<VisualCompositorMode>('hybrid');
  const [continuousScroll, setContinuousScroll] = useState<boolean>(true);
  const [serverXp, setServerXp] = useState<number | null>(null);
  const [serverSynced, setServerSynced] = useState<boolean>(false);

  const smoothMasterRef = useRef<number>(0);
  const targetMasterRef = useRef<number>(0);
  const currentSceneRef = useRef<number>(1);
  const wasInTransitionRef = useRef<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const sceneConfig: Record<
    number,
    { xp: number; progress: number; dark: boolean; milestoneId: string }
  > = {
    1: { xp: 100, progress: -18, dark: false, milestoneId: 'SCENE_1_SHATTER' },
    2: { xp: 200, progress: -7, dark: true, milestoneId: 'SCENE_1_SHATTER' },
    3: { xp: 300, progress: 45, dark: true, milestoneId: 'SCENE_1_SHATTER' },
    4: { xp: 400, progress: 75, dark: true, milestoneId: 'SCENE_4_PORTAL_WARP' },
    5: { xp: 500, progress: 100, dark: true, milestoneId: 'SCENE_5_CITY_UNLOCK' },
  };

  const activeMeta = sceneConfig[currentScene] || sceneConfig[1];

  // Pre-decode all 5 AI-Enhanced 3D images into GPU memory on mount so scene swaps have 0ms texture decode lag!
  useEffect(() => {
    PRELOAD_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {});
      }
    });
  }, []);

  // Procedural WebAudio API feedback
  const playTransitionChime = useCallback(
    (sceneNum: number) => {
      if (!audioActive) return;
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const freqs = [220, 185, 293.66, 392, 523.25];
        osc.type = sceneNum === 2 ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(
          freqs[(sceneNum - 1) % freqs.length],
          ctx.currentTime
        );
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } catch {
        // Ignore audio autoplay block
      }
    },
    [audioActive]
  );

  // Sync milestone XP with Server-Authoritative Backend
  useEffect(() => {
    const milestone = sceneConfig[currentScene]?.milestoneId;
    if (!milestone) return;

    fetch(`${API_BASE}/api/v1/xp/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'SV-2026-001',
        milestone_id: milestone,
        idempotency_key: `intro_scene_${currentScene}_sv2026`,
      }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.total_xp === 'number') {
          setServerXp(data.total_xp);
          setServerSynced(true);
        }
      })
      .catch(() => {
        setServerSynced(false);
      });
  }, [currentScene]);

  // 120FPS Zero-Re-Render Scrollytelling Loop
  useEffect(() => {
    if (!continuousScroll || isNovaOsOpen) return;

    let rafId: number;

    const onScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      targetMasterRef.current = Math.min(
        1,
        Math.max(0, window.scrollY / maxScroll)
      );
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const tick = () => {
      const prev = smoothMasterRef.current;
      const target = targetMasterRef.current;
      const diff = target - prev;

      if (Math.abs(diff) > 0.00005) {
        const next = Math.abs(diff) < 0.0002 ? target : prev + diff * 0.14;
        smoothMasterRef.current = next;

        const sceneIdx = Math.min(5, Math.max(1, Math.floor(next * 5) + 1));
        const localProg = Math.min(1, Math.max(0, (next - (sceneIdx - 1) * 0.2) / 0.2));

        // ONLY call React setState when crossing a scene boundary (at peak transition cover!)
        if (sceneIdx !== currentSceneRef.current) {
          currentSceneRef.current = sceneIdx;
          setCurrentScene(sceneIdx);
          playTransitionChime(sceneIdx);
        }

        // Dispatch direct DOM event for HybridSceneStage & TopTimeline (Zero React Re-render!)
        window.dispatchEvent(
          new CustomEvent<ScrollScrubTelemetry>('nova-scroll-telemetry', {
            detail: {
              masterProgress: next,
              sceneIndex: sceneIdx,
              localProgress: localProg,
              velocity: diff,
            },
          })
        );

        // Check if inside any inter-scene transition window (0.2, 0.4, 0.6, 0.8)
        let activeBoundary: (typeof BOUNDARIES)[0] | null = null;
        let tProg = 0;
        for (const b of BOUNDARIES) {
          const dist = next - b.center;
          if (Math.abs(dist) < b.halfWidth) {
            activeBoundary = b;
            tProg = (dist + b.halfWidth) / (b.halfWidth * 2);
            break;
          }
        }

        if (activeBoundary) {
          wasInTransitionRef.current = true;
          window.dispatchEvent(
            new CustomEvent<TransitionEventPayload>('nova-transition-frame', {
              detail: {
                progress: tProg,
                type: activeBoundary.type,
                from: diff >= 0 ? activeBoundary.from : activeBoundary.to,
                to: diff >= 0 ? activeBoundary.to : activeBoundary.from,
              },
            })
          );
        } else if (wasInTransitionRef.current) {
          wasInTransitionRef.current = false;
          window.dispatchEvent(
            new CustomEvent<TransitionEventPayload>('nova-transition-frame', {
              detail: {
                progress: 0,
                type: 'shatter_shockwave',
                from: sceneIdx,
                to: sceneIdx,
              },
            })
          );
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [continuousScroll, isNovaOsOpen, playTransitionChime]);

  // Smooth jump to a specific scene (1..5), triggering the full transition curtain
  const navigateToScene = useCallback(
    (targetScene: number) => {
      const clamped = Math.min(5, Math.max(1, targetScene));
      const anchors = [0.04, 0.3, 0.5, 0.7, 0.94];

      if (continuousScroll) {
        const maxScroll = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight
        );
        const destY = anchors[clamped - 1] * maxScroll;
        window.scrollTo({ top: destY, behavior: 'smooth' });
      } else {
        const from = currentSceneRef.current;
        if (from === clamped) return;
        const typeMap: Record<number, TransitionType> = {
          1: 'shatter_shockwave',
          2: 'fire_burn_wall',
          3: 'quantum_iris',
          4: 'cloud_warp_dive',
        };
        const tType = typeMap[Math.min(from, clamped)] || 'shatter_shockwave';
        const start = performance.now();
        const dur = 520;

        const runStepCurtain = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          window.dispatchEvent(
            new CustomEvent<TransitionEventPayload>('nova-transition-frame', {
              detail: {
                progress: p < 1 ? p : 0,
                type: tType,
                from,
                to: clamped,
              },
            })
          );
          if (p >= 0.5 && currentSceneRef.current !== clamped) {
            currentSceneRef.current = clamped;
            setCurrentScene(clamped);
            playTransitionChime(clamped);
          }
          if (p < 1) {
            requestAnimationFrame(runStepCurtain);
          }
        };
        requestAnimationFrame(runStepCurtain);
      }
    },
    [continuousScroll, playTransitionChime]
  );

  // Keyboard shortcuts (1..5 or ArrowRight/ArrowLeft)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isNovaOsOpen) return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName))
        return;
      if (e.key >= '1' && e.key <= '5') {
        navigateToScene(Number(e.key));
      } else if (e.key === 'ArrowRight') {
        navigateToScene(currentScene + 1);
      } else if (e.key === 'ArrowLeft') {
        navigateToScene(currentScene - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentScene, isNovaOsOpen, navigateToScene]);

  const handleOpenApp = (appId: string) => {
    setInitialApp(appId);
    setIsNovaOsOpen(true);
  };

  const displayedXp =
    serverXp !== null ? Math.max(activeMeta.xp, serverXp) : activeMeta.xp;

  return (
    <div className="relative min-h-screen w-full bg-slate-950 font-sans text-slate-100 overflow-x-hidden">
      {/* Persistent Zero.University Style HUD */}
      {!isNovaOsOpen && (
        <>
          <TopTimeline
            progressPercent={activeMeta.progress}
            sceneIndex={currentScene}
            isDarkTheme={activeMeta.dark}
            audioActive={audioActive}
            onToggleAudio={() => setAudioActive(!audioActive)}
            visualMode={visualMode}
            onChangeVisualMode={(mode) => setVisualMode(mode)}
            continuousScroll={continuousScroll}
            onToggleScrollMode={() => setContinuousScroll((prev) => !prev)}
            onSelectScene={navigateToScene}
            onEnterWorkMode={() => {
              setInitialApp('passport');
              setIsNovaOsOpen(true);
            }}
            targetXp={displayedXp}
            xpLabel="SEC-XP"
            serverSynced={serverSynced}
          />

          <FloatingDock
            currentScene={currentScene}
            isNovaOsOpen={isNovaOsOpen}
            onSelectScene={navigateToScene}
            onLaunchNovaOs={() => {
              setInitialApp('studenthub');
              setIsNovaOsOpen(true);
            }}
          />
        </>
      )}

      {/* 120FPS Zero-React-Re-Render Inter-Scene Transition Curtain */}
      {!isNovaOsOpen && <CinematicTransitionDirector />}

      {/* Pinned Viewport Stage */}
      <div
        className={
          continuousScroll && !isNovaOsOpen
            ? 'fixed inset-0 w-full h-screen overflow-hidden z-10'
            : 'relative w-full z-10'
        }
      >
        {currentScene === 1 && (
          <Scene1Utopia
            visualMode={visualMode}
            onNext={() => navigateToScene(2)}
          />
        )}

        {currentScene === 2 && (
          <Scene2Shatter
            visualMode={visualMode}
            onPrev={() => navigateToScene(1)}
            onNext={() => navigateToScene(3)}
          />
        )}

        {currentScene === 3 && (
          <Scene3FourLayers
            visualMode={visualMode}
            onPrev={() => navigateToScene(2)}
            onNext={() => navigateToScene(4)}
          />
        )}

        {currentScene === 4 && (
          <Scene4Portal
            visualMode={visualMode}
            onPrev={() => navigateToScene(3)}
            onNext={() => navigateToScene(5)}
            onLaunchNovaOs={() => {
              setInitialApp('studenthub');
              setIsNovaOsOpen(true);
            }}
          />
        )}

        {currentScene === 5 && (
          <Scene5CyberCity
            visualMode={visualMode}
            onPrev={() => navigateToScene(4)}
            onOpenApp={handleOpenApp}
            onLaunchNovaOs={() => {
              setInitialApp('studenthub');
              setIsNovaOsOpen(true);
            }}
          />
        )}
      </div>

      {/* Virtual 520vh Scroll Runway for Continuous Mouse-Wheel Scrollytelling */}
      {continuousScroll && !isNovaOsOpen && (
        <div
          aria-hidden="true"
          className="relative w-full pointer-events-none select-none"
          style={{ height: '520vh' }}
        />
      )}

      {/* Integrated Nova OS Virtual Desktop */}
      {isNovaOsOpen && (
        <NovaDesktop
          initialApp={initialApp}
          onClose={() => setIsNovaOsOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
