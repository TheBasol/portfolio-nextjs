'use client';

import { useEffect, useState,useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, PointerLockControls } from '@react-three/drei';

type ControlsProps = {
  enableFirstPerson?: boolean;
  initialPosition?: [number, number, number];
  initialTarget?: [number, number, number];
};

export default function Controls({ 
  enableFirstPerson = false,
  initialPosition,
  initialTarget 
}: ControlsProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const [firstPerson, setFirstPerson] = useState<boolean>(enableFirstPerson);

  useEffect(() => {
    // Set initial camera position and target if provided
    if (initialPosition) {
      camera.position.set(...initialPosition);
    }
    
    camera.far = 1000;
    camera.updateProjectionMatrix();

    // Set OrbitControls target after they're mounted
    if (initialTarget && controlsRef.current) {
      controlsRef.current.target.set(...initialTarget);
      controlsRef.current.update();
    }
  }, [camera, initialPosition, initialTarget]);

  // Separate effect to ensure OrbitControls target is set after mounting
  useEffect(() => {
    if (initialTarget && controlsRef.current) {
      const timeoutId = setTimeout(() => {
        if (controlsRef.current) {
          controlsRef.current.target.set(...initialTarget);
          controlsRef.current.update();
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [initialTarget, firstPerson]);

  const logCameraState = () => {
    if (!controlsRef.current) return;

    const position = camera.position;
    // La propiedad 'target' vive dentro de los OrbitControls
    const target = controlsRef.current.target;
    
    console.log(
      "%cÁngulo de cámara encontrado:",
      "color: lime; font-weight: bold; font-size: 14px;"
    );
    console.log(
      `Posición: [${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}]`
    );
    console.log(
      `Target:   [${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)}]`
    );
    console.log(camera.rotation);
  };

  return (
    <>
      {!firstPerson && (
        <OrbitControls
          ref={controlsRef}
          enableDamping={true}
          dampingFactor={0.08}
          rotateSpeed={0.6}
          panSpeed={0.6}
          zoomSpeed={0.8}
          minDistance={2}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2 - 0.1}
          onEnd={logCameraState}
        />
      )}

      {firstPerson && (
        <PointerLockControls />
      )}

      {/* Simple UI hook: press 'F' to toggle first-person mode */}
      <ToggleKeyListener onToggle={() => setFirstPerson((v) => !v)} />
    </>
  );
}

function ToggleKeyListener({ onToggle }: { onToggle: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 'f') onToggle();
      if (e.key.toLowerCase() === 'o'){
        
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onToggle]);
  return null;
}
