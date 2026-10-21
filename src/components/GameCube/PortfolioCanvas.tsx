"use client";

import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { GameCubeCube } from "@/components/GameCube/GameCubeCube";
import { BackgroundCubes } from "@/components/GameCube/BackgroundCubes";
import { SECTION_ACCENTS, type CubeSection } from "@/components/GameCube/CubePreview";
import { type ViewState } from "@/lib/navigation";
import type { BootPhase } from "@/lib/boot";
import * as THREE from "three";

function getSceneTransform(
  width: number,
  height: number,
  view: ViewState
): { scale: number; y: number } {
  const aspect = width / height;
  const isPortrait = aspect < 1;

  let scale: number;
  if (isPortrait) {
    scale = THREE.MathUtils.clamp(0.52 + height / 2200, 0.56, 0.68);
  } else if (height <= 720) {
    scale = THREE.MathUtils.clamp(0.68 + height / 3200, 0.72, 0.82);
  } else if (height <= 900) {
    scale = THREE.MathUtils.clamp(0.78 + height / 4200, 0.82, 0.9);
  } else {
    scale = THREE.MathUtils.clamp(0.88 + height / 6000, 0.9, 1);
  }

  const isHome = view === "HOME";

  // A selected face is the reading state: give it more room after the hero exits.
  if (!isHome) {
    scale = THREE.MathUtils.clamp(scale * 1.22, 0.88, 1.08);
  }

  let y = isHome ? -0.26 : -0.02;

  if (height <= 720) {
    y += isHome ? 0.06 : -0.04;
  }
  if (isPortrait) {
    y += 0.04;
  }

  return { scale, y };
}

function SmoothedScene({
  scale,
  y,
  children,
}: {
  scale: number;
  y: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const current = useRef({ scale, y });

  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;
    const k = 1 - Math.exp(-7 * Math.min(delta, 0.05));
    current.current.scale += (scale - current.current.scale) * k;
    current.current.y += (y - current.current.y) * k;
    group.scale.setScalar(current.current.scale);
    group.position.y = current.current.y;
  });

  return (
    <group ref={ref} scale={scale} position={[0, y, 0]}>
      {children}
    </group>
  );
}

function ResponsiveScene({
  targetQuaternion,
  interactionEnabled,
  cubeRef,
  activeSection,
  onOpen,
  onSelectSection,
  view,
  bootPhase,
  onBootComplete,
}: {
  targetQuaternion: THREE.Quaternion;
  interactionEnabled: boolean;
  cubeRef: React.RefObject<THREE.Group | null>;
  activeSection: CubeSection | null;
  onOpen: () => void;
  onSelectSection?: (section: CubeSection) => void;
  view: ViewState;
  bootPhase: BootPhase;
  onBootComplete: () => void;
}) {
  const { size } = useThree();
  const { scale, y } = useMemo(
    () => getSceneTransform(size.width, size.height, view),
    [size.width, size.height, view]
  );

  return (
    <SmoothedScene scale={scale} y={y}>
      <GameCubeCube
        ref={cubeRef}
        targetQuaternion={targetQuaternion}
        interactionEnabled={interactionEnabled}
        activeSection={activeSection}
        onOpen={onOpen}
        onSelectSection={onSelectSection}
        bootPhase={bootPhase}
        onBootComplete={onBootComplete}
      />
      <BackgroundCubes activeSection={activeSection} />
    </SmoothedScene>
  );
}

interface PortfolioCanvasProps {
  targetQuaternion: THREE.Quaternion;
  interactionEnabled: boolean;
  cubeRef: React.RefObject<THREE.Group | null>;
  activeSection: CubeSection | null;
  onOpen: () => void;
  onSelectSection?: (section: CubeSection) => void;
  view: ViewState;
  isModalOpen: boolean;
  bootPhase: BootPhase;
  onBootComplete: () => void;
}

export default function PortfolioCanvas({
  targetQuaternion,
  interactionEnabled,
  cubeRef,
  activeSection,
  onOpen,
  onSelectSection,
  view,
  isModalOpen,
  bootPhase,
  onBootComplete,
}: PortfolioCanvasProps) {
  const glowRgb = activeSection ? SECTION_ACCENTS[activeSection].rgb : "139, 92, 246";

  // Stable element identity: EffectComposer rebuilds its passes whenever `children`
  // changes, and that rebuild drops a frame (the whole scene blinks).
  const postprocessing = useMemo(
    () => (
      <EffectComposer multisampling={4}>
        <Bloom
          luminanceThreshold={0.78}
          luminanceSmoothing={0.4}
          mipmapBlur
          intensity={0.55}
        />
      </EffectComposer>
    ),
    []
  );

  return (
    <div
      className={`portfolio-canvas-backdrop absolute inset-0 z-0 ${
        isModalOpen ? "pointer-events-none" : "pointer-events-auto"
      }`}
      style={{ "--scene-glow-rgb": glowRgb } as React.CSSProperties}
      role="img"
      aria-label="Interactive 3D portfolio navigation cube"
    >
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 40 }}
        dpr={[1, 1.5]}
        gl={{ alpha: false, antialias: false, powerPreference: "high-performance" }}
        style={{ pointerEvents: isModalOpen ? "none" : "auto" }}
        onCreated={({ gl }) => {
          // Opaque clear. A transparent drawing buffer makes the transmission pass
          // clear to white every frame and lets bloom punch alpha holes.
          gl.setClearColor("#05050a", 1);
        }}
      >
        <color attach="background" args={["#05050a"]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={5} color="#a855f7" />
        <spotLight
          position={[-10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={3}
          color="#5d3fd3"
        />

        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#5d3fd3" wireframe />
            </mesh>
          }
        >
          <ResponsiveScene
            targetQuaternion={targetQuaternion}
            interactionEnabled={interactionEnabled}
            cubeRef={cubeRef}
            activeSection={activeSection}
            onOpen={onOpen}
            onSelectSection={onSelectSection}
            view={view}
            bootPhase={bootPhase}
            onBootComplete={onBootComplete}
          />

          <ContactShadows
            position={[0, -2.4, 0]}
            opacity={0.45}
            scale={14}
            blur={3.2}
            far={4.2}
            color="#000000"
            resolution={256}
          />

          <Environment preset="city" />

          {postprocessing}
        </Suspense>
      </Canvas>
    </div>
  );
}
