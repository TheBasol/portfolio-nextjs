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

const FaceText = ({ position, rotation, text, color, fontSize = 0.25, vertical = false, letterSpacing = 0.15 }: {
  position: [number, number, number],
  rotation: [number, number, number],
  text: string,
  color: string,
  fontSize?: number,
  vertical?: boolean,
  letterSpacing?: number
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

export const GameCubeCube = React.forwardRef<THREE.Group, GameCubeCubeProps>(
  ({ targetQuaternion, interactionEnabled = true, activeSection, onOpen }, ref) => {
    const meshRef = useRef<THREE.Group>(null);

    useImperativeHandle(ref, () => meshRef.current as THREE.Group, []);

    useFrame((state) => {
      if (meshRef.current) {
        const time = state.clock.elapsedTime;

        // Position Bobbing
        meshRef.current.position.y = Math.sin(time * 0.6) * 0.18;

        // Subtle Tilt Wobble
        const wobbleX = Math.sin(time * 0.7) * 0.08;
        const wobbleY = Math.cos(time * 0.5) * 0.04;
        const wobbleZ = Math.sin(time * 0.4) * 0.06;

        // Mouse-based Tilt
        const mouseTiltX = interactionEnabled ? -state.pointer.y * 0.05 : 0;
        const mouseTiltY = interactionEnabled ? state.pointer.x * 0.05 : 0;

        const tiltWobble = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(mouseTiltX + wobbleX, mouseTiltY + wobbleY, wobbleZ)
        );

        const finalTarget = targetQuaternion.clone().multiply(tiltWobble);
        meshRef.current.quaternion.slerp(finalTarget, 0.1);
      }
    });

    const handleOpen = () => {
      if (onOpen) onOpen();
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
        {/* Outer Crystal Shell — more transparent to reveal embedded faces */}
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

        {/* Inner Glowing Core */}
        <RoundedBox args={[1.85, 1.85, 1.85]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color="#4c1d95"
            emissive="#7c3aed"
            emissiveIntensity={1.2}
            transparent
            opacity={0.4}
          />
        </RoundedBox>

        {/* Glowing Edge Outlines */}
        <RoundedBox args={[2.005, 2.005, 2.005]} radius={0.12} smoothness={4}>
          <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.2} />
        </RoundedBox>

        {/* ── Interior Lights — glow from active face ── */}
        {activeSection && (
          <pointLight
            position={
              activeSection === "PROJECTS" ? [0, 0.6, 0] :
              activeSection === "ABOUT" ? [0, -0.6, 0] :
              activeSection === "EXPERIENCE" ? [-0.6, 0, 0] :
              [0.6, 0, 0]
            }
            color={sectionColors[activeSection]}
            intensity={0.5}
            distance={2.5}
            decay={2}
          />
        )}

        {/* Navigation Text (Front Face) */}
        <group position={[0, 0, 1.01]}>
          <FaceText position={[0, 0.65, 0]} rotation={[0, 0, 0]} text="PROJECTS" color="#fff" fontSize={0.16} />
          {!activeSection && <FaceText position={[0, 0.82, 0]} rotation={[0, 0, 0]} text="▲" color="#a855f7" fontSize={0.12} />}
          
          <FaceText position={[0, -0.65, 0]} rotation={[0, 0, 0]} text="ABOUT ME" color="#fff" fontSize={0.16} />
          {!activeSection && <FaceText position={[0, -0.82, 0]} rotation={[0, 0, 0]} text="▼" color="#a855f7" fontSize={0.12} />}
          
          <FaceText position={[-0.65, 0, 0]} rotation={[0, 0, 0]} text="EXPERIENCE" color="#fff" fontSize={0.16} vertical />
          {!activeSection && <FaceText position={[-0.82, 0, 0]} rotation={[0, 0, 0]} text="◀" color="#a855f7" fontSize={0.12} />}
          
          <FaceText position={[0.65, 0, 0]} rotation={[0, 0, 0]} text="CONTACT" color="#fff" fontSize={0.16} vertical />
          {!activeSection && <FaceText position={[0.82, 0, 0]} rotation={[0, 0, 0]} text="▶" color="#a855f7" fontSize={0.12} />}
        </group>

        {/* ── PROJECTS (Top Face) ── */}
        <group position={[0, 1.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* Embedded screen backing plane */}
          {isActive("PROJECTS") && (
            <mesh position={[0, 0, -0.015]}>
              <planeGeometry args={[1.7, 1.7]} />
              <meshStandardMaterial
                color="#000000"
                emissive="#06b6d4"
                emissiveIntensity={0.15}
                transparent
                opacity={0.35}
                side={THREE.FrontSide}
              />
            </mesh>
          )}
          <Html
            transform
            distanceFactor={1.5}
            pointerEvents={isActive("PROJECTS") ? "auto" : "none"}
            style={{
              width: "480px",
              height: "480px",
              transition: "opacity 0.6s ease",
              opacity: isActive("PROJECTS") ? 1 : 0,
              animation: isActive("PROJECTS") ? "cube-face-materialize 0.7s ease-out" : "none",
            }}
          >
            <CubePreview section="PROJECTS" isEmbedded onOpen={handleOpen} />
          </Html>
        </group>

        {/* ── ABOUT (Bottom Face) ── */}
        <group position={[0, -1.005, 0]} rotation={[Math.PI / 2, 0, 0]}>
          {isActive("ABOUT") && (
            <mesh position={[0, 0, -0.015]}>
              <planeGeometry args={[1.7, 1.7]} />
              <meshStandardMaterial
                color="#000000"
                emissive="#f97316"
                emissiveIntensity={0.15}
                transparent
                opacity={0.35}
                side={THREE.FrontSide}
              />
            </mesh>
          )}
          <Html
            transform
            distanceFactor={1.5}
            pointerEvents={isActive("ABOUT") ? "auto" : "none"}
            style={{
              width: "480px",
              height: "480px",
              transition: "opacity 0.6s ease",
              opacity: isActive("ABOUT") ? 1 : 0,
              animation: isActive("ABOUT") ? "cube-face-materialize 0.7s ease-out" : "none",
            }}
          >
            <CubePreview section="ABOUT" isEmbedded onOpen={handleOpen} />
          </Html>
        </group>

        {/* ── EXPERIENCE (Left Face) ── */}
        <group position={[-1.005, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          {isActive("EXPERIENCE") && (
            <mesh position={[0, 0, -0.015]}>
              <planeGeometry args={[1.7, 1.7]} />
              <meshStandardMaterial
                color="#000000"
                emissive="#10b981"
                emissiveIntensity={0.15}
                transparent
                opacity={0.35}
                side={THREE.FrontSide}
              />
            </mesh>
          )}
          <Html
            transform
            distanceFactor={1.5}
            pointerEvents={isActive("EXPERIENCE") ? "auto" : "none"}
            style={{
              width: "480px",
              height: "480px",
              transition: "opacity 0.6s ease",
              opacity: isActive("EXPERIENCE") ? 1 : 0,
              animation: isActive("EXPERIENCE") ? "cube-face-materialize 0.7s ease-out" : "none",
            }}
          >
            <CubePreview section="EXPERIENCE" isEmbedded onOpen={handleOpen} />
          </Html>
        </group>

        {/* ── CONTACT (Right Face) ── */}
        <group position={[1.005, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          {isActive("CONTACT") && (
            <mesh position={[0, 0, -0.015]}>
              <planeGeometry args={[1.7, 1.7]} />
              <meshStandardMaterial
                color="#000000"
                emissive="#94a3b8"
                emissiveIntensity={0.15}
                transparent
                opacity={0.35}
                side={THREE.FrontSide}
              />
            </mesh>
          )}
          <Html
            transform
            distanceFactor={1.5}
            pointerEvents={isActive("CONTACT") ? "auto" : "none"}
            style={{
              width: "480px",
              height: "480px",
              transition: "opacity 0.6s ease",
              opacity: isActive("CONTACT") ? 1 : 0,
              animation: isActive("CONTACT") ? "cube-face-materialize 0.7s ease-out" : "none",
            }}
          >
            <CubePreview section="CONTACT" isEmbedded onOpen={handleOpen} />
          </Html>
        </group>

      </group>
    );
  }
);

GameCubeCube.displayName = "GameCubeCube";

