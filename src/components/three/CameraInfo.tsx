// app/components/FixedCamera.tsx
'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

interface FixedCameraProps {
  position: [number, number, number];
  target: [number, number, number];
}

export const FixedCamera = ({ position, target }: FixedCameraProps) => {
  const { camera, gl } = useThree();

  useEffect(() => {
    // Set camera position
    camera.position.set(...position);
    
    // Look at target
    camera.lookAt(new THREE.Vector3(...target));
    camera.updateProjectionMatrix();

    // Find OrbitControls if they exist and update their target
    // OrbitControls are typically stored in gl.controls or we can find them in the scene
    const controls = (gl as any).controls || 
                    ((camera as any).controls) || 
                    (gl.domElement.parentElement?.querySelector('[data-controls]') as any);
    
    // Alternative approach: search for OrbitControls in the renderer's event handlers
    const orbitControls = (gl as any).__orbitControls;
    
    if (orbitControls) {
      // Set the target of OrbitControls to match our desired target
      orbitControls.target.set(...target);
      orbitControls.update();
    }

    // Delay to ensure OrbitControls are mounted, then try to update them
    const timeoutId = setTimeout(() => {
      // Try to find OrbitControls through the drei ref system
      const controlsElements = document.querySelectorAll('[data-drei-orbit-controls]');
      if (controlsElements.length > 0) {
        // Access the OrbitControls instance if possible
        const controlsElement = controlsElements[0] as any;
        if (controlsElement._orbitControls) {
          controlsElement._orbitControls.target.set(...target);
          controlsElement._orbitControls.update();
        }
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [camera, gl, position, target]);

  return null;
};