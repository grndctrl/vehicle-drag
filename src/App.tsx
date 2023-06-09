import { Canvas } from '@react-three/fiber';
import { folder, useControls } from 'leva';
import Scene from './components/Scene';
import { Physics } from './lib/react-three-rapier';

function App() {
  const { debug } = useControls({
    physics: folder({
      debug: false,
    }),
  });

  return (
    <div className="w-full h-screen touch-none">
      <Canvas shadows>
        <Physics debug={debug}>
          <Scene vehicle={'truck'} />
        </Physics>
      </Canvas>

      {/* <div className="absolute inset-0 flex flex-col justify-between p-20 pointer-events-none">
        <div className="">
          <h1 className="text-5xl font-black leading-10 tracking-tight">
            Vehicle
            <br /> Controller
          </h1>
          <ul className="mt-10">
            <li>
              <button
                className={tractorButton}
                onClick={() => setVehicle('tractor')}
              >
                Tractor
              </button>
            </li>
            <li>
              <button
                className={truckButton}
                onClick={() => setVehicle('truck')}
              >
                Truck
              </button>
            </li>
          </ul>
        </div>
        <div className="text-xl">
          <div className="inline-block pb-8 text-sm leading-loose border-b border-current">
            <span className="font-bold">Use arrows or WASD</span> <br />
            <span>Use mouse to control camera</span> <br />
          </div>
        </div>
      </div>*/}
    </div>
  );
}

export default App;
