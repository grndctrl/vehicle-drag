import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import { Physics } from './lib/react-three-rapier';

function App() {
  return (
    <div className="w-full h-screen">
      <Canvas>
        <Physics debug>
          <Scene />
        </Physics>
      </Canvas>
      <div className="absolute inset-0 flex flex-col justify-between p-20 pointer-events-none">
        <div className="text-4xl font-bold">VEHICLE CONTROLLER</div>
        <div className="text-xl">
          <span className="px-6 py-4 text-xl text-white bg-black rounded-xl">
            Use arrows or WASD
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
