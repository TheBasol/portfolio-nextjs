"use client";
import Link from "next/link";
import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { SceneLoader } from "@/components/GameCube/SceneLoader";
import { SECTION_ACCENTS, type CubeSection } from "@/components/GameCube/CubePreview";
import { CubeModal } from "@/components/GameCube/CubeModal";
import { NavigationGuide } from "@/components/portfolio/NavigationGuide";
import {
  type ViewState,
  resolveViewFromInput,
  isEditableTarget,
  SECTION_LABELS,
} from "@/lib/navigation";
import type { BootPhase } from "@/lib/boot";
import * as THREE from "three";

const DynamicCanvas = dynamic(
  () => import("@/components/GameCube/PortfolioCanvas"),
  { ssr: false }
);

let hasSessionBooted = false;

export default function Home() {
  const [view, setView] = useState<ViewState>("HOME");
  const [targetQuaternion, setTargetQuaternion] = useState(new THREE.Quaternion());
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bootPhase, setBootPhase] = useState<BootPhase>(() =>
    hasSessionBooted ? "idle" : "loading"
  );
  const cubeRef = useRef<THREE.Group | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const bootCompleteFired = useRef(false);

  const isBootIdle = bootPhase === "idle";
  const showBootChrome = bootPhase === "falling" || bootPhase === "idle";

  const activeSection = useMemo(() => {
    if (view === "HOME") return null;
    return view as CubeSection;
  }, [view]);

  const viewRotations: Record<ViewState, THREE.Quaternion> = useMemo(
    () => ({
      HOME: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
      PROJECTS: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)),
      ABOUT: new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)),
      EXPERIENCE: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)),
      CONTACT: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0)),
    }),
    []
  );

  const handleInput = useCallback(
    (key: string) => {
      if (!isBootIdle || isModalOpen) return;
      setView((prev) => resolveViewFromInput(prev, key));
    },
    [isBootIdle, isModalOpen]
  );

  const openModal = useCallback(() => {
    if (!isBootIdle) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setIsModalOpen(true);
  }, [isBootIdle]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    requestAnimationFrame(() => {
      lastFocusedRef.current?.focus();
    });
  }, []);

  const onReady = useCallback(() => {
    setBootPhase((prev) => (prev === "loading" ? "ready" : prev));
  }, []);

  // Safety net: if the boot phase is stuck on "loading" for too long
  // force the transition so the user is never stuck.
  useEffect(() => {
    if (bootPhase !== "loading") return;
    const safety = setTimeout(() => {
      setBootPhase((prev) => (prev === "loading" ? (hasSessionBooted ? "idle" : "ready") : prev));
    }, 5000);
    return () => clearTimeout(safety);
  }, [bootPhase]);

  const onPowerOn = useCallback(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setBootPhase("brand");
      return;
    }
    setBootPhase("bootFlash");
    window.setTimeout(() => {
      setBootPhase((prev) => (prev === "bootFlash" ? "brand" : prev));
    }, 550);
  }, []);

  const onBrandComplete = useCallback(() => {
    bootCompleteFired.current = false;
    setBootPhase("falling");
  }, []);

  const onBootComplete = useCallback(() => {
    if (bootCompleteFired.current) return;
    bootCompleteFired.current = true;
    hasSessionBooted = true;
    setBootPhase("idle");
  }, []);

  const handleReboot = useCallback(() => {
    setIsModalOpen(false);
    setView("HOME");
    hasSessionBooted = false;
    bootCompleteFired.current = false;
    setBootPhase("ready");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "escape" && isModalOpen) {
        e.preventDefault();
        closeModal();
        return;
      }

      if (isEditableTarget(e.target) && key !== "escape") {
        return;
      }

      if (isModalOpen || !isBootIdle) return;

      if (key === "enter" && view !== "HOME") {
        e.preventDefault();
        openModal();
        return;
      }

      handleInput(key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal, handleInput, isBootIdle, isModalOpen, openModal, view]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (!isBootIdle || isModalOpen) return;
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isBootIdle || isModalOpen) return;
    if (!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;

    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      handleInput(dx > 0 ? "arrowright" : "arrowleft");
    } else {
      handleInput(dy > 0 ? "arrowdown" : "arrowup");
    }
    setTouchStart(null);
  };

  useEffect(() => {
    setTargetQuaternion(viewRotations[view]);
  }, [view, viewRotations]);

  useEffect(() => {
    if (view === "HOME") {
      setIsModalOpen(false);
    }
  }, [view]);

  const liveMessage =
    !isBootIdle
      ? "Boot sequence in progress."
      : view === "HOME"
        ? "Home screen. Select a section using arrows, WASD, swipe, or section buttons."
        : `${SECTION_LABELS[view]} selected. Press Enter to open. Press opposite direction or center to return home.`;

  return (
    <main
      className="portfolio-shell relative w-full min-h-dvh h-dvh bg-[#05050d] overflow-hidden touch-none overscroll-none"
      onTouchStart={onTouchStart}
      onTouchMove={() => {}}
      onTouchEnd={onTouchEnd}
    >
      <SceneLoader
        bootPhase={bootPhase}
        onReady={onReady}
        onPowerOn={onPowerOn}
        onBrandComplete={onBrandComplete}
        onFastBootComplete={onBootComplete}
      />

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </p>

      {/* Hero zone (GameCube System Menu Header) */}
      <div
        className={`portfolio-hero-zone absolute top-0 left-0 right-0 z-10 px-4 sm:px-6 transition-all duration-1000 pointer-events-none select-none
          ${
            showBootChrome && view === "HOME"
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-16 pointer-events-none"
          }`}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-1.5 sm:gap-2 text-center">
          <p className="portfolio-eyebrow cube-ui-mono text-[10px] sm:text-xs uppercase tracking-[0.28em] text-purple-300/65">
            System Menu // BIOS Ready
          </p>

          <div className="max-w-4xl space-y-1">
            <h1 className="portfolio-hero-title cube-ui font-black italic tracking-tighter text-white">
              HI, I&apos;M A{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-400 to-cyan-300">
                FULL-STACK SOFTWARE DEVELOPER
              </span>
            </h1>
            <p className="portfolio-hero-subtitle mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-2.5 gap-y-1 font-medium tracking-wide text-slate-400">
              <span>Building AI-Powered Applications</span>
              <span>C# / .NET</span>
              <span>TypeScript / Next.js</span>
              <span>Python</span>
            </p>
          </div>

          <p className="cube-ui-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 sm:text-xs">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-emerald-400/80" />
            Player 01
            <span className="ml-1.5 font-semibold tracking-[0.18em] text-slate-300">
              ENRIQUE_VAZQUEZ
            </span>
          </p>
        </div>
      </div>

      <DynamicCanvas
        targetQuaternion={targetQuaternion}
        interactionEnabled={isBootIdle && !isModalOpen}
        cubeRef={cubeRef}
        activeSection={activeSection}
        onOpen={openModal}
        onSelectSection={(s) => {
          if (!isBootIdle || isModalOpen) return;
          setView(s);
        }}
        view={view}
        isModalOpen={isModalOpen}
        bootPhase={bootPhase}
        onBootComplete={onBootComplete}
      />

      <CubeModal
        isOpen={isModalOpen}
        section={activeSection}
        onClose={closeModal}
      />

      {/* HUD zone (GameCube Console Bottom Bar) */}
      <div
        className={`portfolio-hud-zone absolute bottom-0 left-0 right-0 z-10 pointer-events-none px-3 sm:px-6 lg:px-10 transition-opacity duration-1000
          ${showBootChrome ? "opacity-100" : "opacity-0"}`}
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-2.5 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
          {/* Left: System telemetry + Reboot button */}
          <div className="hidden lg:flex items-center gap-3 pointer-events-auto">
            <button
              type="button"
              onClick={handleReboot}
              disabled={!isBootIdle}
              title="Reboot GameCube System Intro"
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-purple-500/30 bg-purple-950/30 hover:bg-purple-500/20 hover:border-cyan-400/50 backdrop-blur-sm transition-all cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-purple-400 group-hover:bg-cyan-300 shadow-[0_0_8px_#a855f7] transition-colors" />
              <span className="cube-ui-mono text-[10px] uppercase tracking-[0.2em] text-purple-200 group-hover:text-white">
                ⏻ Reboot
              </span>
            </button>
            <span className="portfolio-hud-meta cube-ui-mono uppercase tracking-widest" aria-hidden="true">
              BIOS VER 2026.04
            </span>
          </div>

          {/* Center: GameCube BIOS Status & Section Controls */}
          <div className="flex flex-col items-center gap-1.5 pointer-events-auto lg:col-start-2">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-purple-500/35 bg-purple-950/40 backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <span className="portfolio-hud-functional cube-ui-mono text-[11px] sm:text-xs tracking-[0.18em] uppercase text-center">
                {view === "HOME" ? (
                  "Select Section"
                ) : (
                  <>
                    Slot:{" "}
                    <span style={{ color: SECTION_ACCENTS[view].hex }} className="font-bold">
                      {SECTION_LABELS[view]}
                    </span>
                  </>
                )}
              </span>
              <span className="text-purple-300/70 text-xs cube-ui-mono" aria-hidden="true">
                {view === "HOME" ? "▲ ▼ ◀ ▶" : "↵ ENTER"}
              </span>
              {view !== "HOME" && (
                <button
                  type="button"
                  onClick={() => setView("HOME")}
                  className="ml-1 px-2 py-0.5 rounded border border-white/15 bg-white/5 hover:bg-white/15 cube-ui-mono text-[10px] uppercase tracking-wider text-slate-200 transition-colors cursor-pointer"
                >
                  B / Back
                </button>
              )}
            </div>
          </div>

          {/* Right: Memory Card (Notes) */}
          <div className="flex justify-center lg:justify-end items-end gap-4 lg:pr-[calc(3rem+4.5rem)] pointer-events-auto mt-1 lg:mt-0">
            <div className="portfolio-hud-meta text-center lg:text-right">
              <Link
                href="/notes"
                className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-purple-500/12 hover:bg-purple-500/28 border border-purple-400/35 hover:border-cyan-400/65 rounded-lg backdrop-blur-md transition-all shadow-[0_0_18px_rgba(168,85,247,0.22)] hover:shadow-[0_0_28px_rgba(34,211,238,0.35)]"
                tabIndex={isBootIdle ? 0 : -1}
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                <span className="cube-ui-mono text-[10px] sm:text-xs text-white group-hover:text-cyan-100 uppercase tracking-[0.18em]">
                  Memory Card (Notes)
                </span>
              </Link>
              <div className="hidden lg:block cube-ui-mono text-[9px] text-purple-300/50 uppercase tracking-[0.22em] mt-1.5">
                SLOT A // DISC: PORTFOLIO_V2
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* D-Pad */}
      <div
        className={`absolute bottom-[var(--portfolio-safe-bottom)] right-3 sm:right-6 lg:right-10 z-20 transition-opacity duration-1000
          ${showBootChrome ? "opacity-100" : "opacity-0"} ${
            isBootIdle ? "pointer-events-auto" : "pointer-events-none"
          }`}
      >
        <NavigationGuide currentView={view} onNavigate={handleInput} />
      </div>

      {/* Decorative GameCube BIOS corners */}
      <div
        className={`hidden md:block absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-purple-500/25 rounded-tl-md m-5 pointer-events-none transition-opacity duration-1000 ${
          showBootChrome ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`hidden md:block absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-purple-500/25 rounded-tr-md m-5 pointer-events-none transition-opacity duration-1000 ${
          showBootChrome ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`hidden md:block absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-purple-500/25 rounded-bl-md m-5 pointer-events-none transition-opacity duration-1000 ${
          showBootChrome ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`hidden md:block absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-purple-500/25 rounded-br-md m-5 pointer-events-none transition-opacity duration-1000 ${
          showBootChrome ? "opacity-100" : "opacity-0"
        }`}
      />
    </main>
  );
}
