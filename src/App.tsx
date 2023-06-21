import { Canvas } from '@react-three/fiber';
import { folder, useControls } from 'leva';
import Scene from './components/Scene';
import { Physics } from './lib/react-three-rapier';

function App() {
  return (
    <div className="w-full h-screen touch-none">
      <Canvas shadows>
        <Physics timeStep={'vary'}>
          <Scene />
        </Physics>
      </Canvas>
    </div>
  );
}

export default App;
