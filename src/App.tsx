import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Debug from './components/Debug';
import Scene from './components/Scene';
import { Physics } from './lib/react-three-rapier';
import Lab from './components/Lab';

function App() {
  return (
    <div className="relative w-full h-screen touch-none">
      <Debug />
      <Canvas shadows>
        <Suspense fallback={null}>
          <Physics timeStep={'vary'}>
            <Scene />
          </Physics>
        </Suspense>
      </Canvas>
      <Lab>Click and drag the vehicle to move</Lab>
    </div>
  );
}

export default App;
