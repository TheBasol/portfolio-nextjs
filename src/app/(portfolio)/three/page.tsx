// En Scene.tsx
'use client';

import { Particles, Wave } from '@/components';
import FixedCameraView from '@/components/three/FixedCameraView';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';


export default function Scene() {

  const cameraPosition: [number, number, number] = [15.68, -0.83, 7.24];
  const cameraTarget: [number, number, number] = [-0.55, -2.51, 3.15];

return (
    <div style={{ width: '100vw', height: '100vh', background: '#030014' }}>
      <Canvas camera={{ fov: 45, near: 0.1, far: 1000 }}>
        <color attach="background" args={['#030014']} />
        <fog attach="fog" args={['#030014', 5, 25]} />
        
        <Wave />
        {/* Wave plane is 30x30 and positioned at [0, -1, 0] in Wave.tsx */}
        <Particles count={1000} center={[2, -1, 0]} areaRadius={15} />
        <FixedCameraView position={cameraPosition} target={cameraTarget} />

        <EffectComposer>
            <Bloom    
                intensity={1.5}
                luminanceThreshold={0.15}
                luminanceSmoothing={0.6}
                height={1000}
            />
        </EffectComposer>
      </Canvas>
    </div>
  );
};