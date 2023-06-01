import {
  Box,
  Cone,
  Environment,
  OrbitControls,
  useTexture,
} from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { RepeatWrapping } from 'three';
import { RigidBody } from '../lib/react-three-rapier';
import Vehicle from './Vehicle';

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
  const red = useTexture(
    'https://raw.githubusercontent.com/pmndrs/drei-assets/master/prototype/red/texture_02.png'
  );
  const green = useTexture(
    'https://raw.githubusercontent.com/pmndrs/drei-assets/master/prototype/green/texture_02.png'
  );

  return (
    <>
      <RigidBody type="dynamic" colliders="cuboid" position={[0, 0.5, 4]}>
        <Box args={[1, 0.2, 1]}>
          <meshStandardMaterial
            map={red}
            map-repeat={[0.5, 0.5]}
            map-wrapS={RepeatWrapping}
            map-wrapT={RepeatWrapping}
          />
        </Box>
      </RigidBody>

      <RigidBody type="dynamic" colliders="hull" position={[2, 0.5, 4]}>
        <Box args={[1, 0.2, 1]}>
          <meshStandardMaterial
            map={red}
            map-repeat={[0.5, 0.5]}
            map-wrapS={RepeatWrapping}
            map-wrapT={RepeatWrapping}
          />
        </Box>
      </RigidBody>

      <RigidBody type="dynamic" colliders="hull" position={[-3, 0.5, 3]}>
        <Box args={[1, 0.2, 1]}>
          <meshStandardMaterial
            map={red}
            map-repeat={[0.5, 0.5]}
            map-wrapS={RepeatWrapping}
            map-wrapT={RepeatWrapping}
          />
        </Box>
      </RigidBody>

      <RigidBody type="dynamic" colliders="hull" position={[4, 2, 2]}>
        <Cone args={[1, 2, 4]}>
          <meshStandardMaterial map={green} />
        </Cone>
      </RigidBody>
    </>
  );
}

function Scene() {
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
      <Vehicle />
      <Ground />
      <Obstacles />
    </>
  );
}

export default Scene;
