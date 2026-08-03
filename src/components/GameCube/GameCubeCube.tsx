"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";
import { CubePreview, type CubeSection } from "./CubePreview";
import { isBootPreFall, type BootPhase } from "@/lib/boot";

interface GameCubeCubeProps {
  targetQuaternion: THREE.Quaternion;
  interactionEnabled?: boolean;
  activeSection?: CubeSection | null;
  onOpen?: () => void;
  bootPhase?: BootPhase;
  onBootComplete?: () => void;
}

// Keep the HTML screen nearly flush with the physical 1.7-unit face.
const FACE_HTML_SIZE = 480;
const FACE_DISTANCE_FACTOR = 1.45;
const FALL_START_Y = 8;
const SPRING_STIFFNESS = 17;
const SPRING_DAMPING = 6;
const SPIN_DECAY_BASE = 0.55;
const SETTLE_POS = 0.05;
const SETTLE_VEL = 0.1;
const SETTLE_ANGLE = 0.1;
const ORIENT_PULL_MAX = 4.4;

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
  (
    {
      targetQuaternion,
      interactionEnabled = true,
      activeSection,
      onOpen,
      bootPhase = "idle",
      onBootComplete,
    },
    ref
  ) => {
    const meshRef = useRef<THREE.Group>(null);
    const outerMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
    const innerMatRef = useRef<THREE.MeshStandardMaterial>(null);
    const impactLightRef = useRef<THREE.PointLight>(null);
    const reducedMotionRef = useRef(false);
    const idleTimeRef = useRef(0);
    const _tempEuler = useRef(new THREE.Euler());
    const _tempQuat = useRef(new THREE.Quaternion());
    const _finalQuat = useRef(new THREE.Quaternion());
    const _spinDelta = useRef(new THREE.Quaternion());
    const _spinEuler = useRef(new THREE.Euler());

    const fallState = useRef({
      y: FALL_START_Y,
      velY: 0,
      spinX: 0,
      spinY: 0,
      spinZ: 0,
      started: false,
      impactFlashed: false,
      completed: false,
      flashT: 0,
      elapsed: 0,
    });

    useImperativeHandle(ref, () => meshRef.current as THREE.Group, []);

    useEffect(() => {
      reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);

    useEffect(() => {
      const state = fallState.current;
      if (bootPhase === "falling") {
        state.y = FALL_START_Y;
        state.velY = -4;
        // Slower tumble — readable GameCube-style drop
        state.spinX = 4.6;
        state.spinY = 6.0;
        state.spinZ = 3.5;
        state.started = true;
        state.impactFlashed = false;
        state.completed = false;
        state.flashT = 0;
        state.elapsed = 0;
        idleTimeRef.current = 0;
        if (meshRef.current) {
          meshRef.current.position.y = FALL_START_Y;
          // Start tipped away from HOME so the tumble resolves into place
          _spinEuler.current.set(2.1, -1.35, 0.9);
          meshRef.current.quaternion.setFromEuler(_spinEuler.current);
          meshRef.current.visible = true;
        }
      } else if (isBootPreFall(bootPhase)) {
        state.started = false;
        state.completed = false;
        state.y = FALL_START_Y;
        if (meshRef.current) {
          meshRef.current.position.y = FALL_START_Y;
          meshRef.current.visible = false;
        }
      } else if (bootPhase === "idle") {
        state.completed = true;
        state.y = 0;
        idleTimeRef.current = 0;
        if (meshRef.current) {
          meshRef.current.position.y = 0;
          meshRef.current.visible = true;
        }
      }
    }, [bootPhase]);

    useFrame((_state, delta) => {
      if (!meshRef.current) return;

      const reduced = reducedMotionRef.current;
      const dt = Math.min(delta, 0.05);
      const phase = bootPhase;
      const fall = fallState.current;

      if (isBootPreFall(phase)) {
        meshRef.current.position.y = FALL_START_Y;
        meshRef.current.visible = false;
        return;
      }

      if (phase === "falling" && !fall.completed) {
        meshRef.current.visible = true;

        if (reduced) {
          meshRef.current.position.y = 0;
          meshRef.current.quaternion.copy(targetQuaternion);
          fall.completed = true;
          idleTimeRef.current = 0;
          queueMicrotask(() => onBootComplete?.());
          return;
        }

        fall.elapsed += dt;

        // Spring toward y = 0
        const force = -SPRING_STIFFNESS * fall.y - SPRING_DAMPING * fall.velY;
        fall.velY += force * dt;
        fall.y += fall.velY * dt;

        // Closer to the ground → kill spin harder and pull toward HOME harder
        const heightNorm = THREE.MathUtils.clamp(Math.abs(fall.y) / FALL_START_Y, 0, 1);
        const groundFactor = 1 - heightNorm; // 0 at top, 1 at bottom
        const approach = THREE.MathUtils.smoothstep(groundFactor, 0.42, 0.96);

        const spinDecay = SPIN_DECAY_BASE + approach * 4;
        const spinFade = Math.exp(-spinDecay * dt);
        fall.spinX *= spinFade;
        fall.spinY *= spinFade;
        fall.spinZ *= spinFade;

        _spinEuler.current.set(fall.spinX * dt, fall.spinY * dt, fall.spinZ * dt);
        _spinDelta.current.setFromEuler(_spinEuler.current);
        meshRef.current.quaternion.multiply(_spinDelta.current);

        // Continuous orient pull — grows late so tumble reads longer
        const orientPull = 0.15 + approach * ORIENT_PULL_MAX;
        meshRef.current.quaternion.slerp(targetQuaternion, 1 - Math.exp(-orientPull * dt));

        meshRef.current.position.y = fall.y;

        if (!fall.impactFlashed && fall.y < 0.7 && fall.velY < 0) {
          fall.impactFlashed = true;
          fall.flashT = 1;
        }

        if (fall.flashT > 0) {
          fall.flashT = Math.max(0, fall.flashT - dt * 1.8);
          const intensity = fall.flashT * 3.2;
          if (impactLightRef.current) {
            impactLightRef.current.intensity = intensity;
          }
          if (outerMatRef.current) {
            outerMatRef.current.emissiveIntensity = 0.2 + fall.flashT * 1.4;
          }
          if (innerMatRef.current) {
            innerMatRef.current.emissiveIntensity = 1.2 + fall.flashT * 2.5;
          }
        } else if (impactLightRef.current) {
          impactLightRef.current.intensity = 0;
        }

        const angle = meshRef.current.quaternion.angleTo(targetQuaternion);
        const settled =
          Math.abs(fall.y) < SETTLE_POS &&
          Math.abs(fall.velY) < SETTLE_VEL &&
          Math.abs(fall.spinX) + Math.abs(fall.spinY) + Math.abs(fall.spinZ) < 0.4 &&
          angle < SETTLE_ANGLE;

        if (settled || fall.elapsed > 3.5) {
          fall.y = 0;
          fall.velY = 0;
          fall.spinX = 0;
          fall.spinY = 0;
          fall.spinZ = 0;
          fall.completed = true;
          meshRef.current.position.y = 0;
          // Leave quaternion as-is (already near HOME); idle slerp finishes the last degrees
          if (impactLightRef.current) impactLightRef.current.intensity = 0;
          if (outerMatRef.current) {
            outerMatRef.current.emissiveIntensity = activeSection ? 0.35 : 0.2;
          }
          if (innerMatRef.current) innerMatRef.current.emissiveIntensity = 1.2;
          idleTimeRef.current = 0;
          queueMicrotask(() => onBootComplete?.());
        }
        return;
      }

      // Idle float / wobble / face slerp — soft-start from idleTime = 0
      meshRef.current.visible = true;
      idleTimeRef.current += dt;
      const time = idleTimeRef.current;

      meshRef.current.position.y = reduced ? 0 : Math.sin(time * 0.6) * 0.18;

      const wobbleX = reduced ? 0 : Math.sin(time * 0.7) * 0.08;
      const wobbleY = reduced ? 0 : Math.cos(time * 0.5) * 0.04;
      const wobbleZ = reduced ? 0 : Math.sin(time * 0.4) * 0.06;

      const mouseTiltX = interactionEnabled && !reduced ? -_state.pointer.y * 0.05 : 0;
      const mouseTiltY = interactionEnabled && !reduced ? _state.pointer.x * 0.05 : 0;

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
    const baseEmissive = activeSection ? 0.35 : 0.2;

    return (
      <group ref={meshRef} visible={bootPhase === "idle" || bootPhase === "falling"}>
        <pointLight
          ref={impactLightRef}
          position={[0, 0, 0]}
          color="#a855f7"
          intensity={0}
          distance={8}
          decay={2}
        />

        <RoundedBox args={[2, 2, 2]} radius={0.12} smoothness={4}>
          <meshPhysicalMaterial
            ref={outerMatRef}
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
            emissiveIntensity={baseEmissive}
          />
        </RoundedBox>

        <RoundedBox args={[1.85, 1.85, 1.85]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            ref={innerMatRef}
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
