'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type ParticlesProps = {
  count?: number;
  verticalAmplitude?: number; // how much they move up/down
  verticalSpeed?: number; // speed multiplier for vertical motion
  driftAmplitude?: number; // small horizontal drift
  driftSpeed?: number;
  maxRadius?: number; // maximum distance from base position
  center?: [number, number, number]; // center of the area (x,y,z)
  areaRadius?: number; // radius of the allowed area (based on Wave size)
};

export const Particles: React.FC<ParticlesProps> = ({
  count = 2000,
  verticalAmplitude = 0.6,
  verticalSpeed = 0.40,
  driftAmplitude = 0.1,
  driftSpeed = 0.06,
  maxRadius = 20,
  center = [0, -1, 0],
  areaRadius = 15,
}) => {
  const pointsRef = useRef<THREE.Points>(null!);

  // Store initial positions and per-particle params
  const { basePositions, currentPositions, baseY, phases, vSpeeds, dPhases, dSpeeds } = useMemo(() => {
    const basePositions = new Float32Array(count * 3);
    const currentPositions = new Float32Array(count * 3);
    const baseY = new Float32Array(count);
    const phases = new Float32Array(count);
    const vSpeeds = new Float32Array(count);
    const dPhases = new Float32Array(count);
    const dSpeeds = new Float32Array(count);


    for (let i = 0; i < count; i++) {

      // Initialize positions inside a circle centered on `center` with radius `areaRadius`.
      // Use sqrt(random) for even area distribution.
      const theta = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * areaRadius * 0.9; // start inside 90% of the area
      const ix = center[0] + Math.cos(theta) * r;
      const iz = center[2] + Math.sin(theta) * r;
      // small vertical spread around the Wave's Y position
      const iy = center[1] + (Math.random() - 0.5) * 1.0;

      basePositions[i * 3 + 0] = ix;
      basePositions[i * 3 + 1] = iy;
      basePositions[i * 3 + 2] = iz;

      // start current positions equal to base
      currentPositions[i * 3 + 0] = ix;
      currentPositions[i * 3 + 1] = iy;
      currentPositions[i * 3 + 2] = iz;

      baseY[i] = iy;
      phases[i] = Math.random() * Math.PI * 2;
      vSpeeds[i] = 0.5 + Math.random() * 0.8; // vary vertical speed
      dPhases[i] = Math.random() * Math.PI * 2;
      dSpeeds[i] = 0.2 + Math.random() * 0.4; // vary drift speed
    }

    return { basePositions, currentPositions, baseY, phases, vSpeeds, dPhases, dSpeeds };
  }, [count]);

  // Animate
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!pointsRef.current) return;

  const geom = pointsRef.current.geometry as THREE.BufferGeometry;
  const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
  const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      // vertical oscillation (slow)
      const vy = baseY[i] + Math.sin(t * verticalSpeed * vSpeeds[i] + phases[i]) * verticalAmplitude * 0.5;

      // subtle horizontal drift
      const dx = Math.sin(t * driftSpeed * dSpeeds[i] + dPhases[i]) * driftAmplitude;
      const dz = Math.cos(t * driftSpeed * dSpeeds[i] + dPhases[i]) * driftAmplitude * 0.6;

      // Smooth movement with lerp to avoid sudden runaway behavior
      const lerpFactor = 0.08; // lower = more inertia

      const baseX = basePositions[idx + 0];
      const baseZ = basePositions[idx + 2];

      const targetX = baseX + dx;
      const targetY = vy;
      const targetZ = baseZ + dz;

      // Lerp current position toward target
      array[idx + 0] = array[idx + 0] + (targetX - array[idx + 0]) * lerpFactor;
      array[idx + 1] = array[idx + 1] + (targetY - array[idx + 1]) * lerpFactor;
      array[idx + 2] = array[idx + 2] + (targetZ - array[idx + 2]) * lerpFactor;

      // Ensure particle doesn't drift too far from its base position
      const dxFromBase = array[idx + 0] - baseX;
      const dzFromBase = array[idx + 2] - baseZ;
      const dist = Math.sqrt(dxFromBase * dxFromBase + dzFromBase * dzFromBase);
      if (dist > maxRadius) {
        // push back to maxRadius on the radial direction
        const clampFactor = maxRadius / dist;
        array[idx + 0] = baseX + dxFromBase * clampFactor;
        array[idx + 2] = baseZ + dzFromBase * clampFactor;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={currentPositions}
          count={count}
          itemSize={3}
          args={[currentPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={6}
        color="#ffffff"
        sizeAttenuation={false} /* render as screen-space dots for visibility */
        depthWrite={false}
        transparent={true}
        opacity={1}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default Particles;