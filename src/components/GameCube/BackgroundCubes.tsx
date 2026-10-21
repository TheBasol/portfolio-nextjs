"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { SECTION_ACCENTS, type CubeSection } from "./CubePreview";

const NODE_COUNT = 28;
const BASE_COLOR = "#8b5cf6";

export function BackgroundCubes({ activeSection = null }: { activeSection?: CubeSection | null }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const targetColor = useMemo(() => new THREE.Color(BASE_COLOR), []);

  const nodes = useMemo(() => {
    // Deterministic pseudo-random layout so SSR/CSR & hot-reloads look balanced
    return Array.from({ length: NODE_COUNT }).map((_, i) => {
      const angle = (i / NODE_COUNT) * Math.PI * 2 + (i % 3) * 0.45;
      const radius = 3.8 + ((i * 7) % 11) * 0.55;
      const depth = -3.2 - ((i * 5) % 9) * 0.65;
      return {
        position: [
          Math.cos(angle) * radius * 1.35,
          Math.sin(angle) * radius * 0.78,
          depth,
        ] as [number, number, number],
        scale: 0.14 + ((i * 3) % 7) * 0.04,
        rotation: [(i * 0.7) % Math.PI, (i * 1.1) % Math.PI, 0] as [number, number, number],
      };
    });
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.z = t * 0.012;
      groupRef.current.rotation.y = Math.sin(t * 0.06) * 0.06;
      groupRef.current.position.y = Math.sin(t * 0.22) * 0.2;
    }
    if (matRef.current) {
      targetColor.set(activeSection ? SECTION_ACCENTS[activeSection].hex : BASE_COLOR);
      matRef.current.color.lerp(targetColor, 1 - Math.exp(-3 * Math.min(delta, 0.05)));
    }
  });

  const sparkleColor = activeSection ? SECTION_ACCENTS[activeSection].hex : "#c4b5fd";

  return (
    <>
      <group ref={groupRef}>
        <Instances limit={NODE_COUNT} range={NODE_COUNT}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            ref={matRef}
            color={BASE_COLOR}
            wireframe
            transparent
            opacity={0.14}
          />
          {nodes.map((props, i) => (
            <Instance
              key={i}
              position={props.position}
              scale={props.scale}
              rotation={props.rotation}
            />
          ))}
        </Instances>
      </group>

      <Sparkles
        count={45}
        scale={[14, 9, 6]}
        position={[0, 0, -3]}
        size={1.2}
        speed={0.18}
        opacity={0.35}
        color={sparkleColor}
      />
    </>
  );
}
