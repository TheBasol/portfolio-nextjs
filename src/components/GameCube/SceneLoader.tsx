"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { playBootJingle, playPowerSwitchSound } from "@/lib/bootJingle";
import type { BootPhase } from "@/lib/boot";

interface SceneLoaderProps {
  bootPhase: BootPhase;
  onReady: () => void;
  onPowerOn: () => void;
  onBrandComplete: () => void;
  onFastBootComplete?: () => void;
}

export function SceneLoader({
  bootPhase,
  onReady,
  onPowerOn,
  onBrandComplete,
}: SceneLoaderProps) {
  const { progress } = useProgress();
  const progressRef = useRef(progress);
  const [visualProgress, setVisualProgress] = useState(0);
  const [statusText, setStatusText] = useState("CHECKING_SYSTEM_MEMORY");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [brandFading, setBrandFading] = useState(false);
  const [overlayFading, setOverlayFading] = useState(false);

  const readyFired = useRef(false);
  const sequenceStarted = useRef(false);
  const brandCompleteFired = useRef(false);

  const onReadyRef = useRef(onReady);
  const onBrandCompleteRef = useRef(onBrandComplete);
  useEffect(() => {
    onReadyRef.current = onReady;
    onBrandCompleteRef.current = onBrandComplete;
  }, [onReady, onBrandComplete]);

  // Keep progressRef updated without re-triggering the animation loop
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Reset internal guards if a reboot is triggered from the HUD
  useEffect(() => {
    if (bootPhase === "loading") {
      readyFired.current = false;
      sequenceStarted.current = false;
      brandCompleteFired.current = false;
      setOverlayFading(false);
      setBrandFading(false);
      setVisualProgress(0);
    } else if (bootPhase === "ready") {
      sequenceStarted.current = false;
      brandCompleteFired.current = false;
      setOverlayFading(false);
      setBrandFading(false);
    }
  }, [bootPhase]);

  // Sync status text with animated visual progress
  useEffect(() => {
    if (visualProgress < 25) setStatusText("CHECKING_SYSTEM_MEMORY");
    else if (visualProgress < 50) setStatusText("MOUNTING_OPTICAL_DISC");
    else if (visualProgress < 75) setStatusText("READING_MEMORY_CARD_A");
    else if (visualProgress < 98) setStatusText("STREAMING_CUBE_SHADERS");
    else setStatusText("BIOS_SYSTEM_READY");
  }, [visualProgress]);

  // Smooth 2-second loader animation before transitioning to 'ready'
  useEffect(() => {
    if (bootPhase !== "loading") return;

    let startTime: number | null = null;
    const duration = 2000; // 2 seconds animation
    let animId: number;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const timePercent = Math.min(100, (elapsed / duration) * 100);

      // Advance visual progress smoothly up to 90% if three.js progress is still loading
      const currentThreeProgress = progressRef.current;
      const cap = currentThreeProgress >= 100 ? 100 : 90;
      const targetPercent = Math.min(timePercent, cap);

      // Monotonically increase visual progress: it can NEVER decrease!
      setVisualProgress((prev) => Math.max(prev, targetPercent));

      if (elapsed < duration || currentThreeProgress < 100 || targetPercent < 100) {
        animId = requestAnimationFrame(step);
      } else {
        setVisualProgress(100);
        if (!readyFired.current) {
          readyFired.current = true;
          setTimeout(() => {
            onReadyRef.current();
          }, 200);
        }
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [bootPhase]);

  // Brand beat → fade overlay → hand off to cube fall
  useEffect(() => {
    if (bootPhase !== "brand") return;
    brandCompleteFired.current = false;

    if (reducedMotion) {
      const t = setTimeout(() => {
        if (brandCompleteFired.current) return;
        brandCompleteFired.current = true;
        setOverlayFading(true);
        setTimeout(() => onBrandCompleteRef.current(), 150);
      }, 100);
      return () => clearTimeout(t);
    }

    setBrandFading(false);
    const hold = setTimeout(() => setBrandFading(true), 380);
    const done = setTimeout(() => {
      if (brandCompleteFired.current) return;
      brandCompleteFired.current = true;
      setOverlayFading(true);
      playBootJingle({ muted: reducedMotion });
      setTimeout(() => onBrandCompleteRef.current(), 220);
    }, 620);

    return () => {
      clearTimeout(hold);
      clearTimeout(done);
      brandCompleteFired.current = false;
    };
  }, [bootPhase, reducedMotion]);

  const handlePowerOn = useCallback(() => {
    if (sequenceStarted.current || bootPhase !== "ready") return;
    sequenceStarted.current = true;
    playPowerSwitchSound({ muted: reducedMotion });
    onPowerOn();
  }, [bootPhase, onPowerOn, reducedMotion]);

  // Allow pressing Enter or Space to Power On like pressing Start on a controller
  useEffect(() => {
    if (bootPhase !== "ready") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handlePowerOn();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bootPhase, handlePowerOn]);

  // Overlay gone once cube is falling / idle
  if (bootPhase === "falling" || bootPhase === "idle") return null;

  const showLoading = bootPhase === "loading";
  const showPowerOn = bootPhase === "ready";
  const showSystem = bootPhase === "bootFlash";
  const showBrand = bootPhase === "brand";
  const isCinematic = showSystem || showBrand;

  return (
    <div
      className={`boot-overlay fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#05050d] px-6 py-6 sm:px-10 sm:py-8 select-none overflow-hidden transition-opacity duration-[380ms] ease-out
        ${overlayFading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      role="status"
      aria-live="polite"
      aria-label={
        showPowerOn
          ? "System ready. Press Power On to start."
          : showLoading
            ? `Loading portfolio scene, ${Math.round(visualProgress)} percent`
            : "Boot sequence in progress"
      }
    >
      {/* Ambient glow and subtle perspective floor */}
      <div className="boot-ambient-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="boot-grid-floor absolute inset-x-0 bottom-0 h-[35%] pointer-events-none opacity-20" aria-hidden="true" />

      {isCinematic && !reducedMotion && (
        <div
          className="boot-screen-flash boot-screen-flash-active absolute inset-0 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Top minimal bar */}
      <div
        className={`relative z-10 flex w-full max-w-5xl items-center justify-between transition-opacity duration-300 ${
          isCinematic ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
          <span className="cube-ui-mono text-[10px] sm:text-xs uppercase tracking-[0.26em] text-slate-400">
            Portfolio // 2026
          </span>
        </div>
        <div className="cube-ui-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-slate-500">
          {showPowerOn ? "READY" : "LOADING"}
        </div>
      </div>

      {/* Center stage */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center w-full max-w-xl">
        {(showLoading || showPowerOn) && (
          <div className="relative flex flex-col items-center">
            {/* 3D Rotating GameCube-inspired Holo-Cube */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center mb-7">
              {/* Outer orbital halo */}
              <div
                className={`absolute inset-0 rounded-full border border-purple-400/25 shadow-[0_0_40px_rgba(139,92,246,0.25)] ${
                  showPowerOn ? "scale-110 border-cyan-400/35" : ""
                } transition-all duration-500`}
              />
              <div className="absolute inset-3 rounded-full border border-dashed border-indigo-400/20" />

              <div className="w-24 h-24 perspective-1000">
                <div
                  className={`cube-loader-wrapper w-full h-full preserve-3d ${
                    reducedMotion ? "" : "animate-cube-rotate"
                  }`}
                >
                  <div className="boot-holo-face boot-face-front" />
                  <div className="boot-holo-face boot-face-back" />
                  <div className="boot-holo-face boot-face-right" />
                  <div className="boot-holo-face boot-face-left" />
                  <div className="boot-holo-face boot-face-top" />
                  <div className="boot-holo-face boot-face-bottom" />
                </div>
              </div>

              {/* Inner glowing core */}
              <div
                className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full blur-xl transition-colors duration-500 ${
                  showPowerOn ? "bg-cyan-400/80" : "bg-purple-500/80"
                } ${reducedMotion ? "" : "animate-pulse"}`}
              />
            </div>

            {showLoading && (
              <div className="flex flex-col items-center gap-4 w-full max-w-xs px-4 animate-[cube-pop_260ms_ease-out]">
                <span className="cube-ui-mono text-xs uppercase tracking-[0.25em] text-slate-400">
                  {statusText.replace(/_/g, " ")}
                </span>

                <div className="relative h-1 w-48 sm:w-56 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-300 rounded-full transition-all duration-150 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    style={{ width: `${Math.max(6, visualProgress)}%` }}
                  />
                </div>

                <span className="cube-ui-mono text-[10px] tracking-[0.2em] text-slate-500">
                  {Math.round(visualProgress)}%
                </span>
              </div>
            )}

            {showPowerOn && (
              <div className="flex flex-col items-center gap-5 text-center px-4 animate-[cube-pop_260ms_ease-out]">
                <div className="space-y-1">
                  <h2 className="cube-ui text-lg sm:text-xl font-bold tracking-[0.22em] uppercase text-white/95">
                    Enrique Vázquez
                  </h2>
                  <p className="cube-ui-mono text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-purple-300/60">
                    Interactive Portfolio
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePowerOn}
                  autoFocus
                  className="group relative inline-flex items-center gap-2.5 px-8 py-3 rounded-full border border-purple-400/30 bg-purple-950/30 hover:bg-purple-900/40 hover:border-cyan-400/60 text-white backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.18)] hover:shadow-[0_0_30px_rgba(34,211,238,0.35)] active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 text-cyan-400 group-hover:text-cyan-300 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path d="M12 3v9" strokeLinecap="round" />
                    <path d="M17.66 6.34a8 8 0 1 1-11.32 0" strokeLinecap="round" />
                  </svg>
                  <span className="cube-ui-mono text-xs font-semibold uppercase tracking-[0.24em] text-slate-100 group-hover:text-white">
                    Power On
                  </span>
                </button>

                <p className="cube-ui-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Press <span className="text-slate-400">Enter</span> to start
                </p>
              </div>
            )}
          </div>
        )}

        {showSystem && (
          <div
            className={`flex flex-col items-center gap-2 ${
              reducedMotion ? "" : "boot-system-flicker"
            }`}
          >
            <span className="cube-ui text-4xl sm:text-6xl font-black italic uppercase tracking-[0.4em] text-white drop-shadow-[0_0_30px_rgba(168,85,247,0.7)]">
              SYSTEM
            </span>
          </div>
        )}

        {showBrand && (
          <div
            className={`flex flex-col items-center gap-2 text-center ${
              brandFading ? "boot-brand-fade-out" : "boot-brand-visible"
            }`}
          >
            <h1 className="boot-brand-name text-3xl sm:text-5xl md:text-6xl font-black italic uppercase text-white drop-shadow-[0_0_35px_rgba(139,92,246,0.65)]">
              Enrique Vázquez
            </h1>
          </div>
        )}
      </div>

      {/* Bottom minimal footer */}
      <div
        className={`relative z-10 flex w-full max-w-5xl items-center justify-between cube-ui-mono text-[10px] uppercase tracking-[0.2em] text-slate-600 transition-opacity duration-300 ${
          isCinematic ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
      >
        <span>Interactive Experience</span>
        <span>GameCube Edition</span>
      </div>
    </div>
  );
}
