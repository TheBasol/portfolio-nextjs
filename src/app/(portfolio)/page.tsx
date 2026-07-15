"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { SceneLoader } from "@/components/GameCube/SceneLoader";
import { type CubeSection } from "@/components/GameCube/CubePreview";
import { CubeModal } from "@/components/GameCube/CubeModal";
import { NavigationGuide } from "@/components/portfolio/NavigationGuide";
import {
  type ViewState,
  resolveViewFromInput,
  isEditableTarget,
  SECTION_LABELS,
} from "@/lib/navigation";
import * as THREE from "three";

const DynamicCanvas = dynamic(
  () => import("@/components/GameCube/PortfolioCanvas"),
  { ssr: false }
);

export default function Home() {
  const [view, setView] = useState<ViewState>("HOME");
  const [targetQuaternion, setTargetQuaternion] = useState(new THREE.Quaternion());
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cubeRef = useRef<THREE.Group | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

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
      if (isModalOpen) return;
      setView((prev) => resolveViewFromInput(prev, key));
    },
    [isModalOpen]
  );

  const openModal = useCallback(() => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    requestAnimationFrame(() => {
      lastFocusedRef.current?.focus();
    });
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

      if (isModalOpen) return;

      if (key === "enter" && view !== "HOME") {
        e.preventDefault();
        openModal();
        return;
      }

      handleInput(key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal, handleInput, isModalOpen, openModal, view]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (isModalOpen) return;
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (isModalOpen) return;
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
    view === "HOME"
      ? "Home screen. Select a section using arrows, WASD, swipe, or section buttons."
      : `${SECTION_LABELS[view]} selected. Press Enter to open. Press opposite direction or center to return home.`;

  return (
    <main
      className="portfolio-shell relative w-full min-h-dvh h-dvh bg-[#060606] overflow-hidden touch-none overscroll-none"
      onTouchStart={onTouchStart}
      onTouchMove={() => {}}
      onTouchEnd={onTouchEnd}
    >
      <SceneLoader />

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </p>

      {/* Hero zone */}
      <div
        className={`portfolio-hero-zone absolute top-0 left-0 right-0 z-10 px-4 sm:px-6 transition-all duration-700 pointer-events-none select-none
          ${view === "HOME" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-16 pointer-events-none"}`}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-1.5 sm:gap-2 md:gap-3 text-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-px w-6 sm:w-10 bg-purple-500/40" />
            <p className="cube-ui-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-purple-400 animate-pulse">
              System Welcome
            </p>
            <div className="h-px w-6 sm:w-10 bg-purple-500/40" />
          </div>

          <div className="space-y-1 sm:space-y-1.5 max-w-4xl">
            <h1 className="portfolio-hero-title font-black italic tracking-tighter text-white">
              HI, I&apos;M A{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                FULL-STACK SOFTWARE DEVELOPER
              </span>
            </h1>
            <p className="portfolio-hero-subtitle text-slate-400 font-medium tracking-wide max-w-3xl mx-auto">
              Building AI-Powered Applications | C# / .NET | TypeScript / Next.js | Python
            </p>
          </div>

          <div className="portfolio-user-badge mt-1 sm:mt-2">
            <div className="px-3 sm:px-4 py-1.5 border border-cyan-400/20 bg-cyan-500/5 rounded-full">
              <span className="cube-ui-mono text-[11px] sm:text-xs text-slate-400 uppercase tracking-[0.15em] sm:tracking-widest">
                User:{" "}
                <span className="text-cyan-300/90 font-bold ml-1 tracking-[0.2em]">
                  ENRIQUE_VAZQUEZ
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Canvas — cargado dinámicamente */}
      <DynamicCanvas
        targetQuaternion={targetQuaternion}
        interactionEnabled={!isModalOpen}
        cubeRef={cubeRef}
        activeSection={activeSection}
        onOpen={openModal}
        view={view}
        isModalOpen={isModalOpen}
      />

      <CubeModal isOpen={isModalOpen} section={activeSection} onClose={closeModal} />

      {/* HUD zone */}
      <div className="portfolio-hud-zone absolute bottom-0 left-0 right-0 z-10 pointer-events-none px-3 sm:px-6 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-3 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
          <div className="hidden lg:block portfolio-hud-meta uppercase tracking-widest" aria-hidden="true">
            SYSTEM VERSION 2026.04
          </div>

          <div className="flex flex-col items-center gap-2 pointer-events-auto lg:col-start-2">
            <div className="flex items-center gap-2 border-t border-purple-500/30 px-3 py-1.5">
              <span className="portfolio-hud-functional cube-ui-mono text-[11px] sm:text-xs tracking-[0.16em] uppercase text-center">
                {view === "HOME" ? "Select Section" : `View: ${view}`}
              </span>
              <span className="text-purple-300/50 text-xs" aria-hidden="true">
                {view === "HOME" ? "↕" : "↵"}
              </span>
            </div>
          </div>

          <div className="hidden lg:flex justify-end items-end gap-4 pr-[calc(3rem+4.5rem)]">
            <div className="portfolio-hud-meta uppercase tracking-widest text-right" aria-hidden="true">
              MEM CARD: SLOT A EMPTY
              <br />
              DISC: PORTFOLIO_V1
            </div>
          </div>
        </div>
      </div>

      {/* D-Pad */}
      <div className="absolute bottom-[var(--portfolio-safe-bottom)] right-3 sm:right-6 lg:right-10 z-20 pointer-events-auto">
        <NavigationGuide currentView={view} onNavigate={handleInput} />
      </div>

      {/* Decorative corners */}
      <div className="hidden md:block absolute top-0 left-0 w-20 h-20 border-t border-l border-purple-500/20 m-6 pointer-events-none" />
      <div className="hidden md:block absolute top-0 right-0 w-20 h-20 border-t border-r border-purple-500/20 m-6 pointer-events-none" />
      <div className="hidden md:block absolute bottom-0 left-0 w-20 h-20 border-b border-l border-purple-500/20 m-6 pointer-events-none" />
      <div className="hidden md:block absolute bottom-0 right-0 w-20 h-20 border-b border-r border-purple-500/20 m-6 pointer-events-none" />
    </main>
  );
}
