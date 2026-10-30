import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TapHoldTriggerProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  holdDurationMs?: number; // duration to fill circle in ms, default 1500
  labelTop?: string;
  labelBottom?: string;
  className?: string;
  primaryColor?: string; // e.g. '#10b981'
  darkText?: boolean;
}

export const TapHoldTrigger: React.FC<TapHoldTriggerProps> = ({
  onComplete,
  onProgress,
  holdDurationMs = 1500,
  labelTop = 'TAP',
  labelBottom = 'HOLD',
  className = '',
  primaryColor = '#10b981',
  darkText = false,
}) => {
  const [progress, setProgress] = useState(0); // 0 to 1
  const [isPressing, setIsPressing] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const radius = 48;
  const stroke = 4.5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  const updateProgressState = useCallback(
    (val: number) => {
      setProgress(val);
      onProgress?.(val);
    },
    [onProgress]
  );

  const handleComplete = useCallback(() => {
    setIsPressing(false);
    updateProgressState(1);
    onComplete?.();
  }, [onComplete, updateProgressState]);

  useEffect(() => {
    if (isPressing) {
      startTimeRef.current = performance.now() - progress * holdDurationMs;
      const update = (now: number) => {
        if (!startTimeRef.current) return;
        const elapsed = now - startTimeRef.current;
        const p = Math.min(elapsed / holdDurationMs, 1);
        updateProgressState(p);

        if (p < 1) {
          animFrameRef.current = requestAnimationFrame(update);
        } else {
          handleComplete();
        }
      };
      animFrameRef.current = requestAnimationFrame(update);
    } else {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      startTimeRef.current = null;
      const decay = () => {
        setProgress((prev) => {
          if (prev <= 0.03) {
            onProgress?.(0);
            return 0;
          }
          const next = prev * 0.82;
          onProgress?.(next);
          animFrameRef.current = requestAnimationFrame(decay);
          return next;
        });
      };
      animFrameRef.current = requestAnimationFrame(decay);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPressing, holdDurationMs, handleComplete, onProgress]);

  const startPress = () => setIsPressing(true);
  const endPress = () => setIsPressing(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault();
      startPress();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      endPress();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${labelTop} ${labelBottom} (Nhấn giữ chuột hoặc giữ phím Space/Enter)`}
      className={`inline-flex items-center gap-4 select-none cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-full pr-4 ${className}`}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Glow behind */}
        <div
          className={`absolute inset-0 rounded-full blur-xl transition-all duration-300 ${
            isPressing ? 'opacity-90 scale-125' : 'opacity-30 scale-95 group-hover:opacity-55'
          }`}
          style={{ backgroundColor: primaryColor }}
        />

        {/* Outer Pulse Ring when pressing */}
        {isPressing && (
          <div
            className="absolute inset-1 rounded-full border-2 animate-ping opacity-40"
            style={{ borderColor: primaryColor }}
          />
        )}

        {/* SVG Circle Progress */}
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          <circle
            stroke={darkText ? 'rgba(15, 23, 42, 0.22)' : 'rgba(255, 255, 255, 0.25)'}
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={primaryColor}
            fill="transparent"
            strokeWidth={stroke + 1.5}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: isPressing ? 'none' : 'stroke-dashoffset 0.12s ease-out',
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center Target Disc */}
        <div
          className={`absolute w-13 h-13 rounded-full border flex flex-col items-center justify-center backdrop-blur-md transition-all duration-200 ${
            isPressing
              ? 'scale-90 bg-emerald-400 text-slate-950 border-emerald-300 font-black shadow-[0_0_25px_rgba(52,211,153,0.9)]'
              : darkText
              ? 'scale-100 bg-slate-900/85 text-white border-slate-700 group-hover:scale-105'
              : 'scale-100 bg-white/15 text-white border-white/40 group-hover:scale-105'
          }`}
        >
          <span className="text-xs leading-none">{progress > 0.05 ? `${Math.round(progress * 100)}%` : '◎'}</span>
        </div>
      </div>

      {/* Label Text */}
      <div className="flex flex-col text-left leading-tight font-sans">
        <span
          className={`text-sm font-black tracking-widest uppercase transition-colors ${
            darkText ? 'text-slate-900 group-hover:text-emerald-700' : 'text-white group-hover:text-emerald-300'
          }`}
        >
          {labelTop}
        </span>
        <span
          className="text-sm font-black tracking-widest uppercase"
          style={{ color: darkText ? '#047857' : primaryColor }}
        >
          {labelBottom}
        </span>
        <span
          className={`text-[10px] font-mono mt-1 ${
            darkText ? 'text-slate-600' : 'text-slate-400'
          }`}
        >
          [Giữ Chuột hoặc Phím Space]
        </span>
      </div>
    </div>
  );
};

export default TapHoldTrigger;
