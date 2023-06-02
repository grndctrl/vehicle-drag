import { Box, Environment, OrbitControls, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { DirectionalLight, RepeatWrapping } from 'three';
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
  const { camera } = useThree();
  const directionalLightRef = useRef<DirectionalLight>(null);

  return (
    <>
      <Environment
        blur={1} // blur factor between 0 and 1 (default: 0, only works with three 0.146 and up)
        preset={'dawn'}
      />
      <OrbitControls />

      {vehicle === 'tractor' && <Tractor />}
      {vehicle === 'truck' && <Truck />}
      <Ground />

      <directionalLight
        castShadow
        color={'#ff8800'}
        intensity={1}
        position={[10, 6, 6]}
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
