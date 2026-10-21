"use client";

import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";
import { CubePreview, SECTION_ACCENTS, type CubeSection } from "./CubePreview";
import { isBootPreFall, type BootPhase } from "@/lib/boot";

interface GameCubeCubeProps {
  targetQuaternion: THREE.Quaternion;
  interactionEnabled?: boolean;
  activeSection?: CubeSection | null;
  onOpen?: () => void;
  onSelectSection?: (section: CubeSection) => void;
  bootPhase?: BootPhase;
  onBootComplete?: () => void;
}

// Keep the HTML screen nearly flush with the physical 1.7-unit face.
const FACE_HTML_SIZE = 480;
const FACE_DISTANCE_FACTOR = 1.45;
// Off-screen drop: long spring from above so the cube enters the frame and lands with a soft bounce
const FALL_START_Y = 8;
const SPRING_STIFFNESS = 17;
const SPRING_DAMPING = 6;
const SPIN_DECAY_BASE = 0.55;
const SETTLE_POS = 0.05;
const SETTLE_VEL = 0.1;
const SETTLE_ANGLE = 0.1;
const ORIENT_PULL_MAX = 4.4;

const GAMECUBE_PURPLE = "#8b5cf6";
const GAMECUBE_INDIGO = "#5d3fd3";
const GAMECUBE_DEEP = "#4c1d95";

const SECTION_NORMALS: Record<CubeSection, THREE.Vector3> = {
  PROJECTS: new THREE.Vector3(0, 1, 0),
  ABOUT: new THREE.Vector3(0, -1, 0),
  EXPERIENCE: new THREE.Vector3(-1, 0, 0),
  CONTACT: new THREE.Vector3(1, 0, 0),
};

/** Crisp 3D triangle arrow for the 4 GameCube BIOS directions */
function DirectionArrow({
  position,
  rotationZ = 0,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  rotationZ?: number;
  color: string;
  scale?: number;
}) {
  return (
    <group position={position} rotation={[0, 0, rotationZ]} scale={scale}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <circleGeometry args={[0.055, 3]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

interface BiosFaceLabelProps {
  section: CubeSection;
  label: string;
  position: [number, number, number];
  arrowPosition: [number, number, number];
  arrowRotation: number;
  vertical?: boolean;
  fontSize?: number;
  hitArgs: [number, number];
  accent: string;
  hovered: boolean;
  showArrow: boolean;
  interactive: boolean;
  onHover: (section: CubeSection | null) => void;
  onSelect?: (section: CubeSection) => void;
}

function BiosFaceLabel({
  section,
  label,
  position,
  arrowPosition,
  arrowRotation,
  vertical = false,
  fontSize = 0.145,
  hitArgs,
  accent,
  hovered,
  showArrow,
  interactive,
  onHover,
  onSelect,
}: BiosFaceLabelProps) {
  return (
    <group>
      <mesh
        position={position}
        onClick={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          onSelect?.(section);
        }}
        onPointerOver={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          onHover(section);
        }}
        onPointerOut={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          onHover(null);
        }}
      >
        <planeGeometry args={hitArgs} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Text
        position={position}
        rotation={[0, 0, vertical ? Math.PI / 2 : 0]}
        fontSize={fontSize}
        color={hovered ? accent : "#ffffff"}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.18}
        outlineWidth={0.008}
        outlineColor="#1e1040"
      >
        {label}
      </Text>

      {showArrow && (
        <DirectionArrow
          position={arrowPosition}
          rotationZ={arrowRotation}
          color={hovered ? accent : "#c084fc"}
          scale={hovered ? 1.25 : 1}
        />
      )}
    </group>
  );
}

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
}) => {
  // Mount the DOM face only once it faces the camera. While the cube is turning,
  // drei's CSS matrix hits edge-on and the face flashes.
  if (!isActive) return null;

  return (
    <>
      <FadeFacePlate color={emissiveColor} />
      <Html
        transform
        distanceFactor={FACE_DISTANCE_FACTOR}
        style={{
          width: `${FACE_HTML_SIZE}px`,
          height: `${FACE_HTML_SIZE}px`,
          animation: "cube-face-materialize 0.45s ease-out",
        }}
      >
        <CubePreview section={section} isEmbedded onOpen={onOpen} />
      </Html>
    </>
  );
};

function FadeFacePlate({ color }: { color: string }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    const material = matRef.current;
    if (!material) return;
    const k = 1 - Math.exp(-8 * Math.min(delta, 0.05));
    material.opacity += (0.92 - material.opacity) * k;
  });

  return (
    <mesh position={[0, 0, 0.012]} renderOrder={5}>
      <planeGeometry args={[1.76, 1.76]} />
      <meshStandardMaterial
        ref={matRef}
        color="#070514"
        emissive={color}
        emissiveIntensity={0.22}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

export const GameCubeCube = React.forwardRef<THREE.Group, GameCubeCubeProps>(
  (
    {
      targetQuaternion,
      interactionEnabled = true,
      activeSection,
      onOpen,
      onSelectSection,
      bootPhase = "idle",
      onBootComplete,
    },
    ref
  ) => {
    const meshRef = useRef<THREE.Group>(null);
    const outerMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
    const innerMatRef = useRef<THREE.MeshStandardMaterial>(null);
    const shockwaveRef = useRef<THREE.Mesh>(null);
    const shockwaveMatRef = useRef<THREE.MeshBasicMaterial>(null);
    const impactLightRef = useRef<THREE.PointLight>(null);
    const sectionLightRef = useRef<THREE.PointLight>(null);

    const [hoveredSection, setHoveredSection] = useState<CubeSection | null>(null);
    const [faceReady, setFaceReady] = useState(false);
    const faceReadyRef = useRef(false);
    const _faceNormal = useRef(new THREE.Vector3());
    const swayRef = useRef({ x: 0, y: 0 });

    const reducedMotionRef = useRef(false);
    const idleTimeRef = useRef(0);
    const _tempEuler = useRef(new THREE.Euler());
    const _tempQuat = useRef(new THREE.Quaternion());
    const _finalQuat = useRef(new THREE.Quaternion());
    const _spinDelta = useRef(new THREE.Quaternion());
    const _spinEuler = useRef(new THREE.Euler());

    const fallState = useRef({
      y: FALL_START_Y,
      z: 0,
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


    useEffect(() => {
      if (!activeSection && hoveredSection && interactionEnabled) {
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "";
      }
      return () => {
        document.body.style.cursor = "";
      };
    }, [activeSection, hoveredSection, interactionEnabled]);

    useEffect(() => {
      if (activeSection) setHoveredSection(null);
    }, [activeSection]);

    useImperativeHandle(ref, () => meshRef.current as THREE.Group, []);

    useEffect(() => {
      reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);

    useEffect(() => {
      const state = fallState.current;
      if (bootPhase === "falling") {
        state.y = FALL_START_Y;
        state.z = 0;
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
          meshRef.current.position.set(0, FALL_START_Y, 0);
          // Start tipped away from HOME so the tumble resolves into place
          _spinEuler.current.set(2.1, -1.35, 0.9);
          meshRef.current.quaternion.setFromEuler(_spinEuler.current);
          meshRef.current.visible = true;
        }
      } else if (isBootPreFall(bootPhase)) {
        state.started = false;
        state.completed = false;
        state.y = FALL_START_Y;
        state.z = 0;
        if (meshRef.current) {
          meshRef.current.position.set(0, FALL_START_Y, 0);
          meshRef.current.visible = false;
        }
      } else if (bootPhase === "idle") {
        state.completed = true;
        state.y = 0;
        state.z = 0;
        idleTimeRef.current = 0;
        if (meshRef.current) {
          meshRef.current.position.set(0, 0, 0);
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
        meshRef.current.position.set(0, FALL_START_Y, 0);
        meshRef.current.visible = false;
        return;
      }

      if (phase === "falling" && !fall.completed) {
        meshRef.current.visible = true;

        if (reduced) {
          meshRef.current.position.set(0, 0, 0);
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
        const groundFactor = 1 - heightNorm;
        const approach = THREE.MathUtils.smoothstep(groundFactor, 0.42, 0.96);

        const spinDecay = SPIN_DECAY_BASE + approach * 4;
        const spinFade = Math.exp(-spinDecay * dt);
        fall.spinX *= spinFade;
        fall.spinY *= spinFade;
        fall.spinZ *= spinFade;

        _spinEuler.current.set(fall.spinX * dt, fall.spinY * dt, fall.spinZ * dt);
        _spinDelta.current.setFromEuler(_spinEuler.current);
        meshRef.current.quaternion.multiply(_spinDelta.current);

        // Continuous orient pull — grows late so the tumble reads longer
        const orientPull = 0.15 + approach * ORIENT_PULL_MAX;
        meshRef.current.quaternion.slerp(targetQuaternion, 1 - Math.exp(-orientPull * dt));

        meshRef.current.position.set(0, fall.y, 0);

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
            outerMatRef.current.emissiveIntensity = 0.22 + fall.flashT * 1.5;
          }
          if (innerMatRef.current) {
            innerMatRef.current.emissiveIntensity = 1.25 + fall.flashT * 2.8;
          }
          if (shockwaveRef.current && shockwaveMatRef.current) {
            const waveScale = 1 + (1 - fall.flashT) * 2.8;
            shockwaveRef.current.scale.setScalar(waveScale);
            shockwaveMatRef.current.opacity = fall.flashT * 0.75;
            shockwaveRef.current.visible = true;
          }
        } else {
          if (impactLightRef.current) impactLightRef.current.intensity = 0;
          if (shockwaveRef.current) shockwaveRef.current.visible = false;
        }

        const angle = meshRef.current.quaternion.angleTo(targetQuaternion);
        const settled =
          Math.abs(fall.y) < SETTLE_POS &&
          Math.abs(fall.velY) < SETTLE_VEL &&
          Math.abs(fall.spinX) + Math.abs(fall.spinY) + Math.abs(fall.spinZ) < 0.4 &&
          angle < SETTLE_ANGLE;

        if (settled || fall.elapsed > 3.5) {
          fall.y = 0;
          fall.z = 0;
          fall.velY = 0;
          fall.spinX = 0;
          fall.spinY = 0;
          fall.spinZ = 0;
          fall.completed = true;
          meshRef.current.position.set(0, 0, 0);
          if (impactLightRef.current) impactLightRef.current.intensity = 0;
          if (shockwaveRef.current) shockwaveRef.current.visible = false;
          if (outerMatRef.current) {
            outerMatRef.current.emissiveIntensity = activeSection ? 0.36 : 0.22;
          }
          if (innerMatRef.current) innerMatRef.current.emissiveIntensity = 1.25;
          idleTimeRef.current = 0;
          queueMicrotask(() => onBootComplete?.());
        }
        return;
      }

      // Idle float / wobble / face slerp — soft-start from idleTime = 0
      meshRef.current.visible = true;
      idleTimeRef.current += dt;
      const time = idleTimeRef.current;

      const isHome = !activeSection;
      const pointerActive = interactionEnabled && !reduced;
      const px = pointerActive ? _state.pointer.x : 0;
      const py = pointerActive ? _state.pointer.y : 0;
      const pointerMag = Math.min(1, Math.hypot(px, py));
      // Idle wobble steps aside while the cursor is driving, so the lean stays readable.
      const wobbleScale = 1 - pointerMag * 0.8;

      const restTiltX = 0;
      const restTiltY = 0;

      const wobbleX = reduced ? 0 : Math.sin(time * 0.7) * 0.04 * wobbleScale;
      const wobbleY = reduced ? 0 : Math.cos(time * 0.5) * 0.04 * wobbleScale;
      const wobbleZ = reduced ? 0 : Math.sin(time * 0.4) * 0.03 * wobbleScale;

      const pointerScale = isHome ? 0.06 : 0.025;
      const mouseTiltX = -py * pointerScale;
      const mouseTiltY = px * pointerScale;

      const sway = swayRef.current;
      const swayFollow = 1 - Math.exp(-5 * dt);
      const swayAmount = isHome ? 0.04 : 0.015;
      sway.x += (px * swayAmount - sway.x) * swayFollow;
      sway.y += (py * swayAmount * 0.55 - sway.y) * swayFollow;

      const floatY = reduced ? 0 : Math.sin(time * 0.65) * 0.14;
      meshRef.current.position.set(sway.x, floatY + sway.y, 0);

      _tempEuler.current.set(
        restTiltX + mouseTiltX + wobbleX,
        restTiltY + mouseTiltY + wobbleY,
        wobbleZ
      );
      _tempQuat.current.setFromEuler(_tempEuler.current);

      _finalQuat.current.copy(targetQuaternion).multiply(_tempQuat.current);
      // Big face turns keep the slower ease. Once settled, the cursor lean catches up smoothly.
      const turn = meshRef.current.quaternion.angleTo(_finalQuat.current);
      const follow = 1 - Math.exp((turn > 0.35 ? -6.5 : -9) * dt);
      meshRef.current.quaternion.slerp(_finalQuat.current, follow);

      if (outerMatRef.current) {
        const targetEmissive = activeSection ? 0.36 : 0.22;
        const glowK = 1 - Math.exp(-5 * dt);
        outerMatRef.current.emissiveIntensity +=
          (targetEmissive - outerMatRef.current.emissiveIntensity) * glowK;
      }
      if (sectionLightRef.current) {
        const lightK = 1 - Math.exp(-6 * dt);
        const targetIntensity = activeSection ? 0.75 : 0;
        sectionLightRef.current.intensity +=
          (targetIntensity - sectionLightRef.current.intensity) * lightK;
        if (activeSection) {
          const position =
            activeSection === "PROJECTS"
              ? [0, 0.65, 0]
              : activeSection === "ABOUT"
                ? [0, -0.65, 0]
                : activeSection === "EXPERIENCE"
                  ? [-0.65, 0, 0]
                  : [0.65, 0, 0];
          sectionLightRef.current.position.set(position[0], position[1], position[2]);
          sectionLightRef.current.color.set(SECTION_ACCENTS[activeSection].hex);
        }
      }

      const section = activeSection;
      let showFace = false;
      if (section) {
        _faceNormal.current.copy(SECTION_NORMALS[section]).applyQuaternion(meshRef.current.quaternion);
        const facing = _faceNormal.current.z;
        showFace = faceReadyRef.current ? facing > 0.72 : facing > 0.9;
      }
      if (showFace !== faceReadyRef.current) {
        faceReadyRef.current = showFace;
        setFaceReady(showFace);
      }
    });

    const handleOpen = () => {
      onOpen?.();
    };

    const sectionColors: Record<CubeSection, string> = {
      PROJECTS: SECTION_ACCENTS.PROJECTS.hex,
      ABOUT: SECTION_ACCENTS.ABOUT.hex,
      EXPERIENCE: SECTION_ACCENTS.EXPERIENCE.hex,
      CONTACT: SECTION_ACCENTS.CONTACT.hex,
    };

    const isActive = (s: CubeSection) =>
      faceReady && activeSection === s && interactionEnabled;
    const isHomeInteractive = !activeSection && interactionEnabled;

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

        {/* Expanding GameCube landing shockwave ring on impact */}
        <mesh ref={shockwaveRef} rotation={[Math.PI / 2, 0, 0]} visible={false}>
          <ringGeometry args={[1.05, 1.18, 64]} />
          <meshBasicMaterial
            ref={shockwaveMatRef}
            color="#c084fc"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Opaque shell. Transmission re-renders the scene into a buffer that
            goes stale while the cube turns, which reads as a flicker. */}
        <RoundedBox args={[2, 2, 2]} radius={0.14} smoothness={6}>
          <meshPhysicalMaterial
            ref={outerMatRef}
            color={GAMECUBE_PURPLE}
            roughness={0.16}
            metalness={0.04}
            clearcoat={1}
            clearcoatRoughness={0.18}
            emissive={GAMECUBE_INDIGO}
          />
        </RoundedBox>

        <RoundedBox args={[1.55, 1.55, 1.55]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            ref={innerMatRef}
            color={GAMECUBE_DEEP}
            emissive="#7c3aed"
            emissiveIntensity={0.85}
            roughness={0.45}
          />
        </RoundedBox>


        <pointLight
          ref={sectionLightRef}
          position={[0, 0.65, 0]}
          color={sectionColors.PROJECTS}
          intensity={0}
          distance={2.8}
          decay={2}
        />

        {/* Front (HOME) face: GameCube BIOS 4-Way Menu Labels */}
        <group position={[0, 0, 1.012]} renderOrder={4}>
          <BiosFaceLabel
            section="PROJECTS"
            label="PROJECTS"
            position={[0, 0.64, 0]}
            arrowPosition={[0, 0.81, 0]}
            arrowRotation={0}
            hitArgs={[1.05, 0.32]}
            accent={sectionColors.PROJECTS}
            hovered={hoveredSection === "PROJECTS"}
            showArrow={!activeSection}
            interactive={isHomeInteractive}
            onHover={setHoveredSection}
            onSelect={onSelectSection}
          />

          <BiosFaceLabel
            section="ABOUT"
            label="ABOUT ME"
            position={[0, -0.64, 0]}
            arrowPosition={[0, -0.81, 0]}
            arrowRotation={Math.PI}
            hitArgs={[1.05, 0.32]}
            accent={sectionColors.ABOUT}
            hovered={hoveredSection === "ABOUT"}
            showArrow={!activeSection}
            interactive={isHomeInteractive}
            onHover={setHoveredSection}
            onSelect={onSelectSection}
          />

          <BiosFaceLabel
            section="EXPERIENCE"
            label="EXPERIENCE"
            position={[-0.64, 0, 0]}
            arrowPosition={[-0.81, 0, 0]}
            arrowRotation={Math.PI / 2}
            vertical
            fontSize={0.135}
            hitArgs={[0.32, 1.1]}
            accent={sectionColors.EXPERIENCE}
            hovered={hoveredSection === "EXPERIENCE"}
            showArrow={!activeSection}
            interactive={isHomeInteractive}
            onHover={setHoveredSection}
            onSelect={onSelectSection}
          />

          <BiosFaceLabel
            section="CONTACT"
            label="CONTACT"
            position={[0.64, 0, 0]}
            arrowPosition={[0.81, 0, 0]}
            arrowRotation={-Math.PI / 2}
            vertical
            fontSize={0.135}
            hitArgs={[0.32, 1.1]}
            accent={sectionColors.CONTACT}
            hovered={hoveredSection === "CONTACT"}
            showArrow={!activeSection}
            interactive={isHomeInteractive}
            onHover={setHoveredSection}
            onSelect={onSelectSection}
          />
        </group>

        <group position={[0, 1.005, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={4}>
          <CubeFaceHtml
            section="PROJECTS"
            isActive={isActive("PROJECTS")}
            emissiveColor={sectionColors.PROJECTS}
            onOpen={handleOpen}
          />
        </group>

        <group position={[0, -1.005, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={4}>
          <CubeFaceHtml
            section="ABOUT"
            isActive={isActive("ABOUT")}
            emissiveColor={sectionColors.ABOUT}
            onOpen={handleOpen}
          />
        </group>

        <group position={[-1.005, 0, 0]} rotation={[0, -Math.PI / 2, 0]} renderOrder={4}>
          <CubeFaceHtml
            section="EXPERIENCE"
            isActive={isActive("EXPERIENCE")}
            emissiveColor={sectionColors.EXPERIENCE}
            onOpen={handleOpen}
          />
        </group>

        <group position={[1.005, 0, 0]} rotation={[0, Math.PI / 2, 0]} renderOrder={4}>
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
