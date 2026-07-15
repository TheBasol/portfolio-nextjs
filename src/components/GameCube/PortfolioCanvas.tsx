"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { GameCubeCube } from "@/components/GameCube/GameCubeCube";
import { BackgroundCubes } from "@/components/GameCube/BackgroundCubes";
import { type CubeSection } from "@/components/GameCube/CubePreview";
import { type ViewState } from "@/lib/navigation";
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

  let y = isHome ? -0.42 : -0.02;

  if (height <= 720) {
    y += isHome ? 0.06 : -0.04;
  }
  if (isPortrait) {
    y += 0.04;
  }

  return { scale, y };
}

function ResponsiveScene({
  targetQuaternion,
  interactionEnabled,
  cubeRef,
  activeSection,
  onOpen,
  view,
}: {
  targetQuaternion: THREE.Quaternion;
  interactionEnabled: boolean;
  cubeRef: React.RefObject<THREE.Group | null>;
  activeSection: CubeSection | null;
  onOpen: () => void;
  view: ViewState;
}) {
  const { size } = useThree();
  const { scale, y } = useMemo(
    () => getSceneTransform(size.width, size.height, view),
    [size.width, size.height, view]
  );

  return (
    <group scale={scale} position={[0, y, 0]}>
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

interface PortfolioCanvasProps {
  targetQuaternion: THREE.Quaternion;
  interactionEnabled: boolean;
  cubeRef: React.RefObject<THREE.Group | null>;
  activeSection: CubeSection | null;
  onOpen: () => void;
  view: ViewState;
  isModalOpen: boolean;
}

export default function PortfolioCanvas({
  targetQuaternion,
  interactionEnabled,
  cubeRef,
  activeSection,
  onOpen,
  view,
  isModalOpen,
}: PortfolioCanvasProps) {
  return (
    <div
      className={`absolute inset-0 z-0 ${isModalOpen ? "pointer-events-none" : "pointer-events-auto"}`}
      role="img"
      aria-label="Interactive 3D portfolio navigation cube"
    >
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
            view={view}
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
  );
}
