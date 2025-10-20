'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

interface FixedCameraViewProps {
  position: [number, number, number];
  target: [number, number, number];
}

export const FixedCameraView = ({ position, target }: FixedCameraViewProps) => {
  const { camera } = useThree();

  useEffect(() => {
    // Set camera position
    camera.position.set(...position);
    
    // Make camera look at target
    camera.lookAt(new THREE.Vector3(...target));
    
    // Update projection matrix
    camera.updateProjectionMatrix();
  }, [camera, position, target]);

  return null;
}