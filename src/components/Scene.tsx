import { Box, useTexture } from '@react-three/drei';
import { Object3DProps } from '@react-three/fiber';
import { EffectComposer, TiltShift2 } from '@react-three/postprocessing';
import { forwardRef, useRef } from 'react';
import * as THREE from 'three';
import { RigidBody } from '../lib/react-three-rapier';
import IsometricCamera from './IsometricCamera';
import Truck from './Truck';

type GroundProps = Object3DProps;

const Ground = forwardRef<THREE.Mesh, GroundProps>((props, ref) => {
  const texture = useTexture(
    'https://raw.githubusercontent.com/pmndrs/drei-assets/master/prototype/light/texture_08.png'
  );

  return (
    <object3D {...props}>
      <RigidBody type="fixed" colliders="cuboid">
        <Box
          ref={ref}
          position={[0, -0.5, 0]}
          args={[100, 1, 100]}
          receiveShadow
        >
          <meshStandardMaterial
            map={texture}
            map-repeat={[10, 10]}
            map-wrapS={THREE.RepeatWrapping}
            map-wrapT={THREE.RepeatWrapping}
          />
        </Box>
      </RigidBody>
    </object3D>
  );
});

function Scene() {
  const groundRef = useRef<THREE.Mesh>(null);

  return (
    <>
      <IsometricCamera />

      {/* <SoftShadows size={10} samples={20} /> */}

      <Truck groundRef={groundRef} />

      <Ground ref={groundRef} />
      {/* 
      <directionalLight
        color={'#bcbffe'}
        intensity={0.5}
        position={[-10, 2, -6]}
        shadow-mapSize={[1024, 1024]}
      />

      <ambientLight intensity={0.1} />

      <directionalLight
        color={'#feefc4'}
        intensity={2}
        position={[10, 12, 6]}
        shadow-mapSize={[1024, 1024]}
      ></directionalLight> */}

      <hemisphereLight intensity={0.5} color="white" groundColor="#f88" />

      <EffectComposer disableNormalPass multisampling={8}>
        {/* <N8AO
          aoRadius={50}
          distanceFalloff={0.2}
          intensity={6}
          screenSpaceRadius
          halfRes
        /> */}
        <TiltShift2 />
      </EffectComposer>

      {/* <BakeShadows /> */}
    </>
  );
}

export default Scene;
