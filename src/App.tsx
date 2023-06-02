import { Canvas } from '@react-three/fiber';
import classNames from 'classnames';
import { folder, useControls } from 'leva';
import { useState } from 'react';
import Scene from './components/Scene';
import { Physics } from './lib/react-three-rapier';

function App() {
  const { debug } = useControls({
    physics: folder({
      debug: false,
    }),
  });

  const [vehicle, setVehicle] = useState<'tractor' | 'truck'>('tractor');

  const truckButton = classNames(
    'transition-colors',
    'uppercase',
    'font-bold',
    'rounded-xl',
    'my-2',
    'py-2',
    'w-32',
    'hover:bg-white',
    'hover:text-green-400',
    {
      'text-white': vehicle === 'truck',
      'text-gray-400': vehicle !== 'truck',
      'bg-green-400': vehicle === 'truck',
      'bg-gray-200': vehicle !== 'truck',
    }
  );

  const tractorButton = classNames(
    'transition-colors',
    'uppercase',
    'font-bold',
    'rounded-xl',
    'my-2',
    'py-2',
    'w-32',
    'hover:bg-white',
    'hover:text-indigo-500',
    {
      'text-white': vehicle === 'tractor',
      'text-gray-400': vehicle !== 'tractor',
      'bg-indigo-500': vehicle === 'tractor',
      'bg-gray-200': vehicle !== 'tractor',
    }
  );

  return (
    <div className="w-full h-screen">
      <Canvas camera={{ fov: 24, position: [15, 10, 10] }} shadows>
        <Physics debug={debug}>
          <Scene vehicle={vehicle} />
        </Physics>
      </Canvas>
      <div className="absolute inset-0 flex flex-col justify-between p-20 pointer-events-none">
        <div className="">
          <h1 className="text-5xl font-black leading-10 tracking-tight">
            Vehicle
            <br /> Controller
          </h1>
          <ul className="mt-10 pointer-events-auto">
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
      </div>
    </div>
  );
}

export default App;
