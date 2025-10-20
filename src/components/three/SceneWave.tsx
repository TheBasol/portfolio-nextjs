// En Scene.tsx
'use client';

import { Particles, Wave } from '@/components';
import FixedCameraView from '@/components/three/FixedCameraView';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

export default function SceneWave() {
  const { isMobile, isTablet } = useDeviceDetection();

  // Camera configurations for different devices
  const getCameraConfig = () => {
    if (isMobile) {
      return {
        position: [8, 2, 12] as [number, number, number], // Closer and higher for mobile
        target: [0, -1, 0] as [number, number, number],   // Look at wave center
        fov: 60, // Wider field of view for mobile
        particleCount: 500 // Fewer particles for performance
      };
    } else if (isTablet) {
      return {
        position: [12, 0, 10] as [number, number, number], // Medium distance for tablet
        target: [-0.2, -1.8, 1.5] as [number, number, number],
        fov: 50,
        particleCount: 750
      };
    } else {
      return {
        position: [15.68, -0.83, 7.24] as [number, number, number], // Original desktop position
        target: [-0.55, -2.51, 3.15] as [number, number, number],
        fov: 45,
        particleCount: 1000
      };
    }
  };

  const cameraConfig = getCameraConfig();

return (
    <div style={{ width: '100%', height: '100%', background: '#030014' }}>
      <Canvas camera={{ fov: cameraConfig.fov, near: 0.1, far: 1000 }}>
        <color attach="background" args={['#030014']} />
        <fog attach="fog" args={['#030014', 5, 25]} />
        
        <Wave />
        {/* Wave plane is 30x30 and positioned at [0, -1, 0] in Wave.tsx */}
        <Particles 
          count={cameraConfig.particleCount} 
          center={[0, -1, 0]} 
          areaRadius={isMobile ? 12 : 15} 
          verticalAmplitude={isMobile ? 0.2 : 0.3}
          driftAmplitude={isMobile ? 0.04 : 0.06}
        />
        <FixedCameraView position={cameraConfig.position} target={cameraConfig.target} />

        <EffectComposer>
            <Bloom    
                intensity={isMobile ? 1.0 : 1.5}
                luminanceThreshold={0.15}
                luminanceSmoothing={0.6}
                height={isMobile ? 500 : 1000}
            />
        </EffectComposer>
      </Canvas>
    </div>
  );
};