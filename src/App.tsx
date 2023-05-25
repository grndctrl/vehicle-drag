import { Box } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import { Physics } from './lib/react-three-rapier';

function App() {
  return (
    <div className="w-full h-screen">
      <Canvas>
        <Physics debug timeStep={1 / 60}>
          <Scene />
        </Physics>
      </Canvas>
    </div>
  );
}

export default App;
