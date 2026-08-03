"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { playBootJingle } from "@/lib/bootJingle";
import type { BootPhase } from "@/lib/boot";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
  onFastBootComplete,
}: SceneLoaderProps) {
  const { progress } = useProgress();
  const [isFastBoot, setIsFastBoot] = useState(false);
  const [statusText, setStatusText] = useState("INITIALIZING_SYSTEM");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [brandFading, setBrandFading] = useState(false);
  const [overlayFading, setOverlayFading] = useState(false);
  const readyFired = useRef(false);
  const sequenceStarted = useRef(false);
  const brandCompleteFired = useRef(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (progress < 20) setStatusText("CONNECTING_TO_KERNEL");
    else if (progress < 40) setStatusText("MOUNTING_DISC_IMAGE");
    else if (progress < 60) setStatusText("READING_MEM_CARD_A");
    else if (progress < 80) setStatusText("STREAMING_GEOMETRY");
    else if (progress < 100) setStatusText("COMPILING_SHADERS");
    else setStatusText("SYSTEM_READY");
  }, [progress]);

  // Fire onReady once progress reaches 100.
  // Using layout effect so we catch the case where progress is already 100
  // on mount (assets cached from a previous visit / back-navigation).
  useIsomorphicLayoutEffect(() => {
    const isFast = sessionStorage.getItem("portfolio_boot_seen") === "true";
    setIsFastBoot(isFast);

    if (progress >= 100 && !readyFired.current) {
      readyFired.current = true;
      let timer: NodeJS.Timeout;
      
      if (isFast && onFastBootComplete) {
        setOverlayFading(true);
        timer = setTimeout(() => onFastBootComplete(), 400);
      } else {
        timer = setTimeout(() => onReady(), 400);
      }
      
      return () => {
        clearTimeout(timer);
        readyFired.current = false;
      };
    }
  }, [progress, onReady, onFastBootComplete]);

  // Brand beat → fade overlay → hand off to cube fall
  useEffect(() => {
    if (bootPhase !== "brand") return;
    brandCompleteFired.current = false;

    if (reducedMotion) {
      const t = setTimeout(() => {
        if (brandCompleteFired.current) return;
        brandCompleteFired.current = true;
        setOverlayFading(true);
        setTimeout(() => onBrandComplete(), 150);
      }, 100);
      return () => clearTimeout(t);
    }

    setBrandFading(false);
    const hold = setTimeout(() => setBrandFading(true), 500);
    const done = setTimeout(() => {
      if (brandCompleteFired.current) return;
      brandCompleteFired.current = true;
      setOverlayFading(true);
      setTimeout(() => onBrandComplete(), 400);
    }, 800);

    return () => {
      clearTimeout(hold);
      clearTimeout(done);
      brandCompleteFired.current = false;
    };
  }, [bootPhase, reducedMotion, onBrandComplete]);

  const handlePowerOn = () => {
    if (sequenceStarted.current || bootPhase !== "ready") return;
    sequenceStarted.current = true;
    playBootJingle({ muted: reducedMotion });
    onPowerOn();
  };

  // Overlay gone once cube is falling / idle
  if (bootPhase === "falling" || bootPhase === "idle") return null;

  if (isFastBoot) {
    return (
      <div
        className={`fixed inset-0 z-[100] bg-[#060606] transition-opacity duration-[400ms] ease-out
          ${overlayFading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        aria-hidden="true"
      />
    );
  }

  const showLoading = bootPhase === "loading";
  const showPowerOn = bootPhase === "ready";
  const showSystem = bootPhase === "bootFlash";
  const showBrand = bootPhase === "brand";
  const isCinematic = showSystem || showBrand;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#060606] transition-opacity duration-[400ms] ease-out
        ${overlayFading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      role="status"
      aria-live="polite"
      aria-label={
        showPowerOn
          ? "System ready. Press Power On to start."
          : showLoading
            ? `Loading portfolio scene, ${Math.round(progress)} percent`
            : "Boot sequence in progress"
      }
    >
      {!isCinematic && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.12),transparent_70%)]" />
      )}

      {isCinematic && !reducedMotion && (
        <div className="boot-screen-flash boot-screen-flash-active absolute inset-0 pointer-events-none" aria-hidden="true" />
      )}

      {showLoading && (
        <>
          <div className="relative w-32 h-32 perspective-1000 mb-12">
            <div
              className={`cube-loader-wrapper w-full h-full preserve-3d ${
                reducedMotion ? "" : "animate-cube-rotate"
              }`}
            >
              <div className="absolute inset-0 bg-indigo-600/20 border border-indigo-400/40 backdrop-blur-sm translate-z-64" />
              <div className="absolute inset-0 bg-indigo-600/20 border border-indigo-400/40 backdrop-blur-sm -translate-z-64 rotate-y-180" />
              <div className="absolute inset-0 bg-indigo-600/20 border border-indigo-400/40 backdrop-blur-sm translate-x-64 rotate-y-90" />
              <div className="absolute inset-0 bg-indigo-600/20 border border-indigo-400/40 backdrop-blur-sm -translate-x-64 -rotate-y-90" />
              <div className="absolute inset-0 bg-indigo-600/20 border border-indigo-400/40 backdrop-blur-sm -translate-y-64 rotate-x-90" />
              <div className="absolute inset-0 bg-indigo-600/20 border border-indigo-400/40 backdrop-blur-sm translate-y-64 -rotate-x-90" />
            </div>

            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-cyan-400 rounded-full blur-xl ${
                reducedMotion ? "" : "animate-pulse"
              }`}
            />
          </div>

          <div className="relative flex flex-col items-center gap-6 max-w-xs w-full px-8">
            <div className="flex flex-col items-center gap-1">
              <span className="text-5xl font-black italic tracking-tighter text-white">
                {Math.round(progress)}
                <span className="text-indigo-500 text-3xl">%</span>
              </span>
              <span className="cube-ui-mono text-xs uppercase tracking-[0.25em] text-indigo-300/90">
                {statusText}
              </span>
            </div>

            <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-cyan-400 shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex flex-col gap-1 w-full mt-2" aria-hidden="true">
              <div className="flex justify-between cube-ui-mono text-[10px] sm:text-xs text-slate-500 tracking-wider">
                <span>MEM_ADDR_0x00FF</span>
                <span>OK</span>
              </div>
              <div className="flex justify-between cube-ui-mono text-[10px] sm:text-xs text-slate-500 tracking-wider">
                <span>GPU_PIPELINE_INIT</span>
                <span className={progress > 80 ? "text-cyan-400/80" : ""}>
                  {progress > 80 ? "SUCCESS" : "WAITING"}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {showPowerOn && (
        <div className="relative flex flex-col items-center gap-8 px-8">
          <p className="cube-ui-mono text-xs uppercase tracking-[0.35em] text-indigo-300/80">
            SYSTEM_READY
          </p>
          <button
            type="button"
            onClick={handlePowerOn}
            className={`boot-power-on cube-ui-mono text-xl sm:text-2xl uppercase tracking-[0.4em] text-cyan-300 border border-cyan-400/40 bg-cyan-500/5 px-10 py-4 rounded-sm
              hover:bg-cyan-500/15 hover:border-cyan-300/70 hover:text-cyan-100
              transition-colors ${reducedMotion ? "" : "boot-power-on-blink"}`}
          >
            POWER ON
          </button>
          <p className="cube-ui-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
            Press to initialize
          </p>
        </div>
      )}

      {showSystem && (
        <span
          className={`cube-ui-mono text-3xl sm:text-5xl uppercase tracking-[0.5em] text-white ${
            reducedMotion ? "" : "boot-system-flicker"
          }`}
        >
          SYSTEM
        </span>
      )}

      {showBrand && (
        <h1
          className={`boot-brand-name text-2xl sm:text-4xl md:text-5xl uppercase text-white ${
            brandFading ? "boot-brand-fade-out" : "boot-brand-visible"
          }`}
        >
          Enrique Vazquez
        </h1>
      )}

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
    </div>
  );
}
