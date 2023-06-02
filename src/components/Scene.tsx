import { Box, Environment, OrbitControls, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
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
      <Box args={[100, 100, 0.5]} rotation={[Math.PI * -0.5, 0, 0]}>
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

  useEffect(() => {
    camera.position.setY(2);
  });

  return (
    <>
      <Environment
        blur={1} // blur factor between 0 and 1 (default: 0, only works with three 0.146 and up)
        preset={'city'}
      />
      <OrbitControls />
      {/* <Vehicle /> */}
      {vehicle === 'tractor' && <Tractor />}
      {vehicle === 'truck' && <Truck />}
      <Ground />
      <Obstacles />
    </>
  );
}

export default Scene;
