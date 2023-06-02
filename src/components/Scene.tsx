import { Box, OrbitControls, SoftShadows, useTexture } from '@react-three/drei';
import { RepeatWrapping } from 'three';
import { RigidBody } from '../lib/react-three-rapier';
import Obstacle from './Obstacle';
import Tractor from './Tractor';
import Truck from './Truck';

function Ground() {
  const texture = useTexture(
    'https://raw.githubusercontent.com/pmndrs/drei-assets/master/prototype/light/texture_08.png'
  );

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <Box position={[0, -0.5, 0]} args={[100, 1, 100]} receiveShadow>
        <meshStandardMaterial
          map={texture}
          map-repeat={[10, 10]}
          map-wrapS={RepeatWrapping}
          map-wrapT={RepeatWrapping}
        />
      </Box>
    </RigidBody>
  );
}

function Obstacles() {
  return (
    <>
      <Obstacle.TreeA position={[0, 0, -5]} scale={[4.5, 4.5, 4.5]} />
      <Obstacle.TreeA position={[5, 0, -5]} scale={[4, 4, 4]} />
      <Obstacle.TreeA position={[0, 0, 5]} scale={[5, 5, 5]} />
      <Obstacle.TreeA position={[-5, 0, 5]} scale={[4, 4, 4]} />
    </>
  );
}

function Scene({ vehicle }: { vehicle: 'tractor' | 'truck' }) {
  return (
    <>
      <OrbitControls />
      <SoftShadows size={10} samples={20} />
      {vehicle === 'tractor' && <Tractor />}
      {vehicle === 'truck' && <Truck />}
      <Ground />

      <directionalLight
        color={'#bcbffe'}
        intensity={0.5}
        position={[-10, 2, -6]}
        shadow-mapSize={[1024, 1024]}
      />

      <ambientLight intensity={0.1} />

      <directionalLight
        castShadow
        color={'#feefc4'}
        intensity={2}
        position={[10, 12, 6]}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera
          attach="shadow-camera"
          left={-20}
          right={20}
          top={20}
          bottom={-20}
        />
      </directionalLight>

      <Obstacles />
    </>
  );
}

export default Scene;
