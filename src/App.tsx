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
        <div className="text-5xl font-black leading-10 tracking-tight">
          Vehicle
          <br /> Controller
        </div>
        <div className="text-xl">
          <div className="inline-block pb-8 text-sm leading-loose border-b border-current">
            <span className="font-bold">Use arrows or WASD</span> <br />
            <span>Use mouse to control camera</span> <br />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
