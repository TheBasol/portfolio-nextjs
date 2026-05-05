"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { GameCubeCube } from "@/components/GameCube/GameCubeCube";
import { BackgroundCubes } from "@/components/GameCube/BackgroundCubes";
import { SceneLoader } from "@/components/GameCube/SceneLoader";
import { type CubeSection } from "@/components/GameCube/CubePreview";
import { CubeModal } from "@/components/GameCube/CubeModal";
import { NavigationGuide } from "@/components/portfolio/NavigationGuide";
import * as THREE from "three";

type ViewState = "HOME" | "PROJECTS" | "ABOUT" | "EXPERIENCE" | "CONTACT";

function ResponsiveScene({
  targetQuaternion,
  interactionEnabled,
  cubeRef,
  activeSection,
  onOpen,
}: {
  targetQuaternion: THREE.Quaternion;
  interactionEnabled: boolean;
  cubeRef: React.RefObject<THREE.Group | null>;
  activeSection: CubeSection | null;
  onOpen: () => void;
}) {
  const { viewport } = useThree();
  // If the screen is in portrait mode (mobile), scale the entire scene down
  const isPortrait = viewport.aspect < 1;
  const scale = isPortrait ? 0.6 : 1;

  return (
    <group scale={scale} position={[0, -0.35, 0]}>
      <GameCubeCube
        ref={cubeRef}
        targetQuaternion={targetQuaternion}
        interactionEnabled={interactionEnabled}
        activeSection={activeSection}
        onOpen={onOpen}
      />
      <BackgroundCubes />
    </group>
  );
}

export default function Home() {
  const [view, setView] = useState<ViewState>("HOME");
  const [targetQuaternion, setTargetQuaternion] = useState(new THREE.Quaternion());
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cubeRef = useRef<THREE.Group | null>(null);

  const activeSection = useMemo(() => {
    if (view === "HOME") return null;
    return view as CubeSection;
  }, [view]);

  // Define fixed rotations for each state
  const viewRotations: Record<ViewState, THREE.Quaternion> = {
    HOME: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
    PROJECTS: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)),
    ABOUT: new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)),
    EXPERIENCE: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)),
    CONTACT: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0)),
  };

  const handleInput = (key: string) => {
    if (isModalOpen) return;
    setView((prev) => {
      if (prev === "HOME") {
        if (key === "arrowup" || key === "w") return "PROJECTS";
        if (key === "arrowdown" || key === "s") return "ABOUT";
        if (key === "arrowleft" || key === "d") return "EXPERIENCE";
        if (key === "arrowright" || key === "a") return "CONTACT";
      } else {
        if (prev === "PROJECTS" && (key === "arrowdown" || key === "s")) return "HOME";
        if (prev === "ABOUT" && (key === "arrowup" || key === "w")) return "HOME";
        if (prev === "EXPERIENCE" && (key === "arrowright" || key === "a")) return "HOME";
        if (prev === "CONTACT" && (key === "arrowleft" || key === "d")) return "HOME";
      }
      return prev;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "escape" && isModalOpen) {
        setIsModalOpen(false);
        return;
      }
      if (isModalOpen) return;
      if (key === "enter" && view !== "HOME") {
        setIsModalOpen(true);
        return;
      }
      handleInput(key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInput, isModalOpen, view]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (isModalOpen) return;
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (isModalOpen) return;
    if (!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;

    // Minimum swipe distance
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      handleInput(dx > 0 ? "arrowright" : "arrowleft");
    } else {
      handleInput(dy > 0 ? "arrowdown" : "arrowup");
    }
    setTouchStart(null);
  };

  // Update target quaternion whenever view changes
  useEffect(() => {
    setTargetQuaternion(viewRotations[view]);
  }, [view]);

  useEffect(() => {
    if (view === "HOME") {
      setIsModalOpen(false);
    }
  }, [view]);

  return (
    <main
      className="relative w-full h-screen bg-[#060606] overflow-hidden touch-none overscroll-none"
      onTouchStart={onTouchStart}
      onTouchMove={(e) => { }}
      onTouchEnd={onTouchEnd}
    >
      <SceneLoader />

      {/* GameCube Boot-style Hero Section */}
      <div
        className={`absolute top-8 md:top-12 left-1/2 -translate-x-1/2 z-10 w-full px-6 transition-all duration-700 pointer-events-none select-none
          ${view === "HOME" ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-20 scale-90"}`}
      >
        <div className="flex flex-col items-center gap-2 md:gap-4 text-center">
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-8 md:w-12 bg-purple-500/40" />
            <p className="cube-ui-mono text-[10px] md:text-xs uppercase tracking-[0.6em] text-purple-400 animate-pulse">
              System Welcome
            </p>
            <div className="h-[1px] w-8 md:w-12 bg-purple-500/40" />
          </div>

          <div className="space-y-1 md:space-y-2">
            <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter text-white">
              HI, I&apos;M A <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">SOFTWARE ENGINEER</span>
            </h1>
            <p className="text-xs md:text-lg text-slate-400 font-medium tracking-wide max-w-2xl mx-auto">
              Building modern and responsive applications with the latest technologies
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="px-5 py-2 border border-cyan-400/30 bg-cyan-500/10 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.2)] transform transition hover:scale-105">
              <span className="cube-ui-mono text-[11px] md:text-xs text-slate-300 uppercase tracking-widest">
                User: <span className="text-cyan-300 font-bold ml-1 tracking-[0.3em] drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">ENRIQUE_VAZQUEZ</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Canvas — pointer-events disabled directly when modal is open */}
      <div className={`absolute inset-0 z-0 ${isModalOpen ? 'pointer-events-none' : 'pointer-events-auto'}`}>
        <Canvas
          shadows
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, 1.5]}
          style={{ pointerEvents: isModalOpen ? "none" : "auto" }}
        >
          <color attach="background" args={["#060606"]} />
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={5} color="#a855f7" />
          <spotLight position={[-10, 10, 10]} angle={0.3} penumbra={1} intensity={3} color="#5d3fd3" />

          <Suspense fallback={<mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#5d3fd3" wireframe /></mesh>}>
            <ResponsiveScene
              targetQuaternion={targetQuaternion}
              interactionEnabled={!isModalOpen}
              cubeRef={cubeRef}
              activeSection={activeSection}
              onOpen={() => setIsModalOpen(true)}
            />

            <ContactShadows
              position={[0, -2.5, 0]}
              opacity={0.4}
              scale={15}
              blur={3.5}
              far={4.5}
              color="#000000"
              resolution={256}
            />

            <Environment preset="city" />

            <EffectComposer multisampling={0}>
              <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.2} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      <CubeModal
        isOpen={isModalOpen}
        section={activeSection}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Bottom Navigation Status */}
      <div className="absolute bottom-8 md:bottom-10 left-0 w-full px-4 md:px-10 flex flex-col md:flex-row justify-between items-center md:items-end z-10 pointer-events-none gap-4 md:gap-0">
        <div className="text-purple-900/60 text-[10px] md:text-xs uppercase tracking-widest hidden md:block">
          SYSTEM VERSION 2026.04
        </div>
        <div className="bg-purple-900/10 border border-purple-500/20 px-4 md:px-6 py-2 md:py-3 rounded-full backdrop-blur-sm flex flex-col items-center gap-1">
          <span className="text-purple-400/80 text-xs md:text-sm font-mono tracking-tighter uppercase">
            {view === "HOME" ? "Select Section" : `View: ${view}`}
          </span>
          <span className={`text-purple-300/40 text-[8px] md:text-[9px] uppercase tracking-[0.2em] transition-opacity duration-500
            ${view === "HOME" ? "opacity-100" : "opacity-0"}`}>
            Use D-Pad, Arrows, or Swipe
          </span>
        </div>
        <div className="text-purple-900/60 text-[10px] md:text-xs uppercase tracking-widest text-center md:text-right hidden md:block">
          MEM CARD: SLOT A EMPTY<br />
          DISC: PORTFOLIO_V1
        </div>
      </div>

      {/* Persistent D-Pad Navigation */}
      <div className="absolute bottom-6 right-4 md:bottom-10 md:right-10 z-20 pointer-events-auto scale-75 md:scale-100 origin-bottom-right">
        <NavigationGuide currentView={view} onNavigate={handleInput} />
      </div>

      {/* Decorative corners (Hidden on mobile) */}
      <div className="hidden md:block absolute top-0 left-0 w-20 h-20 border-t border-l border-purple-500/20 m-6" />
      <div className="hidden md:block absolute top-0 right-0 w-20 h-20 border-t border-r border-purple-500/20 m-6" />
      <div className="hidden md:block absolute bottom-0 left-0 w-20 h-20 border-b border-l border-purple-500/20 m-6" />
      <div className="hidden md:block absolute bottom-0 right-0 w-20 h-20 border-b border-r border-purple-500/20 m-6" />
    </main>
  );
}