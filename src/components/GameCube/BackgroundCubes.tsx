"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";

export function BackgroundCubes() {
  const groupRef = useRef<THREE.Group>(null);

  const cubes = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 20, // Tighter horizontal spread
        (Math.random() - 0.5) * 15, // Tighter vertical spread
        (Math.random() - 0.5) * 10 - 2, // Closer to camera (Z axis)
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.15, // Slightly larger base size
      color: i % 2 === 0 ? "#4c1d95" : "#312e81",
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Animate the entire group of instanced meshes for massive CPU savings
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.02;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <Instances limit={80} range={80}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial wireframe transparent opacity={0.2} />
        {cubes.map((props, i) => (
          <Instance
            key={i}
            position={props.position}
            scale={props.scale}
            color={props.color}
            rotation={props.rotation}
          />
        ))}
      </Instances>
    </group>
  );
}
