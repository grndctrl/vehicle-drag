import {
  Box,
  FirstPersonControls,
  GizmoHelper,
  GizmoViewcube,
  OrthographicCamera,
  SoftShadows,
  useTexture,
} from '@react-three/drei';
import { Object3DProps } from '@react-three/fiber';
import { forwardRef, useEffect, useRef } from 'react';
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

// function IsometricCamera() {
//   const cameraRef = useRef<THREE.OrthographicCamera>(null);

//   useEffect(() => {
//     const { current: camera } = cameraRef;

//     if (!camera) return;

//     camera.rotation.order = 'YXZ';
//     camera.translateZ(10);
//   }, [cameraRef]);

//   return (
//     <OrthographicCamera
//       ref={cameraRef}
//       makeDefault
//       zoom={50}
//       near={-100}
//       far={500}
//       rotation={[Math.atan(-1 / Math.sqrt(2)), Math.PI / 4, 0]}
//       onUpdate={(self) => self.updateProjectionMatrix()}
//     />
//   );
// }

function Scene() {
  const groundRef = useRef<THREE.Mesh>(null);

  return (
    <>
      <IsometricCamera />
      {/* <FirstPersonControls /> */}

      {/* <GizmoHelper
        alignment="bottom-right" // widget alignment within scene
        margin={[80, 80]} // widget margins (X, Y)
      >
        <GizmoViewcube />
      </GizmoHelper> */}

      <SoftShadows size={10} samples={20} />

      <Truck groundRef={groundRef} />

      <Ground ref={groundRef} />

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
    </>
  );
}

export default Scene;
