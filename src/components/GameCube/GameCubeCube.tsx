"use client";

import React, { useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";
import { CubePreview, type CubeSection } from "./CubePreview";

interface GameCubeCubeProps {
  targetQuaternion: THREE.Quaternion;
  interactionEnabled?: boolean;
  activeSection?: CubeSection | null;
  onOpen?: () => void;
}

// Keep the HTML screen nearly flush with the physical 1.7-unit face.
const FACE_HTML_SIZE = 480;
const FACE_DISTANCE_FACTOR = 1.45;

const FaceText = ({
  position,
  rotation,
  text,
  color,
  fontSize = 0.25,
  vertical = false,
  letterSpacing = 0.15,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  text: string;
  color: string;
  fontSize?: number;
  vertical?: boolean;
  letterSpacing?: number;
}) => {
  return (
    <group position={position} rotation={rotation}>
      <Text
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, vertical ? Math.PI / 2 : 0]}
        letterSpacing={letterSpacing}
      >
        {text}
      </Text>
    </group>
  );
};

const CubeFaceHtml = ({
  section,
  isActive,
  emissiveColor,
  onOpen,
}: {
  section: CubeSection;
  isActive: boolean;
  emissiveColor: string;
  onOpen: () => void;
}) => (
  <>
    {isActive && (
      <mesh position={[0, 0, -0.015]}>
        <planeGeometry args={[1.7, 1.7]} />
        <meshStandardMaterial
          color="#000000"
          emissive={emissiveColor}
          emissiveIntensity={0.15}
          transparent
          opacity={0.35}
          side={THREE.FrontSide}
        />
      </mesh>
    )}
    <Html
      transform
      distanceFactor={FACE_DISTANCE_FACTOR}
      pointerEvents={isActive ? "auto" : "none"}
      style={{
        width: `${FACE_HTML_SIZE}px`,
        height: `${FACE_HTML_SIZE}px`,
        transition: "opacity 0.6s ease",
        opacity: isActive ? 1 : 0,
        animation: isActive ? "cube-face-materialize 0.7s ease-out" : "none",
      }}
    >
      <CubePreview section={section} isEmbedded onOpen={onOpen} />
    </Html>
  </>
);

export const GameCubeCube = React.forwardRef<THREE.Group, GameCubeCubeProps>(
  ({ targetQuaternion, interactionEnabled = true, activeSection, onOpen }, ref) => {
    const meshRef = useRef<THREE.Group>(null);
    const reducedMotionRef = useRef(false);
    const _tempEuler = useRef(new THREE.Euler());
    const _tempQuat = useRef(new THREE.Quaternion());
    const _finalQuat = useRef(new THREE.Quaternion());

    useImperativeHandle(ref, () => meshRef.current as THREE.Group, []);

    React.useEffect(() => {
      reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);

    useFrame((state) => {
      if (!meshRef.current) return;

      const time = state.clock.elapsedTime;
      const reduced = reducedMotionRef.current;

      meshRef.current.position.y = reduced ? 0 : Math.sin(time * 0.6) * 0.18;

      const wobbleX = reduced ? 0 : Math.sin(time * 0.7) * 0.08;
      const wobbleY = reduced ? 0 : Math.cos(time * 0.5) * 0.04;
      const wobbleZ = reduced ? 0 : Math.sin(time * 0.4) * 0.06;

      const mouseTiltX = interactionEnabled && !reduced ? -state.pointer.y * 0.05 : 0;
      const mouseTiltY = interactionEnabled && !reduced ? state.pointer.x * 0.05 : 0;

      _tempEuler.current.set(mouseTiltX + wobbleX, mouseTiltY + wobbleY, wobbleZ);
      _tempQuat.current.setFromEuler(_tempEuler.current);

      _finalQuat.current.copy(targetQuaternion).multiply(_tempQuat.current);
      meshRef.current.quaternion.slerp(_finalQuat.current, 0.1);
    });

    const handleOpen = () => {
      onOpen?.();
    };

    const sectionColors: Record<CubeSection, string> = {
      PROJECTS: "#06b6d4",
      ABOUT: "#f97316",
      EXPERIENCE: "#10b981",
      CONTACT: "#94a3b8",
    };

    const isActive = (s: CubeSection) => activeSection === s && interactionEnabled;

    return (
      <group ref={meshRef}>
        <RoundedBox args={[2, 2, 2]} radius={0.12} smoothness={4}>
          <meshPhysicalMaterial
            color="#8b5cf6"
            thickness={1.5}
            roughness={0.1}
            transmission={0.7}
            ior={1.4}
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
            metalness={0.1}
            clearcoat={1}
            emissive="#5d3fd3"
            emissiveIntensity={activeSection ? 0.35 : 0.2}
          />
        </RoundedBox>

        <RoundedBox args={[1.85, 1.85, 1.85]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color="#4c1d95"
            emissive="#7c3aed"
            emissiveIntensity={1.2}
            transparent
            opacity={0.4}
          />
        </RoundedBox>

        <RoundedBox args={[2.005, 2.005, 2.005]} radius={0.12} smoothness={4}>
          <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.2} />
        </RoundedBox>

        {activeSection && (
          <pointLight
            position={
              activeSection === "PROJECTS"
                ? [0, 0.6, 0]
                : activeSection === "ABOUT"
                  ? [0, -0.6, 0]
                  : activeSection === "EXPERIENCE"
                    ? [-0.6, 0, 0]
                    : [0.6, 0, 0]
            }
            color={sectionColors[activeSection]}
            intensity={0.5}
            distance={2.5}
            decay={2}
          />
        )}

        <group position={[0, 0, 1.01]}>
          <FaceText position={[0, 0.65, 0]} rotation={[0, 0, 0]} text="PROJECTS" color="#fff" fontSize={0.16} />
          {!activeSection && (
            <FaceText position={[0, 0.82, 0]} rotation={[0, 0, 0]} text="▲" color="#a855f7" fontSize={0.12} />
          )}

          <FaceText position={[0, -0.65, 0]} rotation={[0, 0, 0]} text="ABOUT ME" color="#fff" fontSize={0.16} />
          {!activeSection && (
            <FaceText position={[0, -0.82, 0]} rotation={[0, 0, 0]} text="▼" color="#a855f7" fontSize={0.12} />
          )}

          <FaceText
            position={[-0.65, 0, 0]}
            rotation={[0, 0, 0]}
            text="EXPERIENCE"
            color="#fff"
            fontSize={0.14}
            vertical
          />
          {!activeSection && (
            <FaceText position={[-0.82, 0, 0]} rotation={[0, 0, 0]} text="◀" color="#a855f7" fontSize={0.12} />
          )}

          <FaceText position={[0.65, 0, 0]} rotation={[0, 0, 0]} text="CONTACT" color="#fff" fontSize={0.14} vertical />
          {!activeSection && (
            <FaceText position={[0.82, 0, 0]} rotation={[0, 0, 0]} text="▶" color="#a855f7" fontSize={0.12} />
          )}
        </group>

        <group position={[0, 1.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <CubeFaceHtml
            section="PROJECTS"
            isActive={isActive("PROJECTS")}
            emissiveColor={sectionColors.PROJECTS}
            onOpen={handleOpen}
          />
        </group>

        <group position={[0, -1.005, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <CubeFaceHtml
            section="ABOUT"
            isActive={isActive("ABOUT")}
            emissiveColor={sectionColors.ABOUT}
            onOpen={handleOpen}
          />
        </group>

        <group position={[-1.005, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <CubeFaceHtml
            section="EXPERIENCE"
            isActive={isActive("EXPERIENCE")}
            emissiveColor={sectionColors.EXPERIENCE}
            onOpen={handleOpen}
          />
        </group>

        <group position={[1.005, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <CubeFaceHtml
            section="CONTACT"
            isActive={isActive("CONTACT")}
            emissiveColor={sectionColors.CONTACT}
            onOpen={handleOpen}
          />
        </group>
      </group>
    );
  }
);

GameCubeCube.displayName = "GameCubeCube";
