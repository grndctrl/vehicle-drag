import {
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  View,
  useHelper,
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../store/store';

function IsometricCamera() {
  const translation = useStore((state) => state.translation);
  const cameraRef = useRef<THREE.Camera>();
  // const sunRef = useRef<THREE.OrthographicCamera>();
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const cameraOrientationRef = useRef({
    position: new THREE.Vector3(),
    target: new THREE.Vector3(),
  });

  const { scene } = useThree();

  useEffect(() => {
    const { current: camera } = cameraRef;

    if (!camera) return;

    camera.rotation.order = 'YXZ';
    camera.translateZ(10);
  }, [cameraRef]);

  useEffect(() => {
    const { current: sun } = sunRef;
    if (!sun) return;

    scene.add(sun.target);
  }, []);

  const lightShift = new THREE.Vector3(10, 10, 5);

  useFrame(({ camera }) => {
    const { current: cameraOrientation } = cameraOrientationRef;

    cameraOrientation.position.set(
      translation.x + 12,
      translation.y + 12,
      translation.z + 12
    );
    cameraOrientation.target.lerp(translation, 0.05);

    camera.position.lerp(cameraOrientation.position, 0.05);
    camera.lookAt(cameraOrientation.target);

    //

    const { current: sun } = sunRef;
    if (!sun) return;

    sun.target.position.copy(translation);
    sun.position.copy(sun.target.position).add(lightShift);
    sun.target.updateMatrixWorld();
  });

  return (
    <>
      <OrthographicCamera
        makeDefault
        zoom={64}
        near={0}
        far={128}
        rotation={[Math.atan(-1 / Math.sqrt(2)), Math.PI / 4, 0]}
        onUpdate={(self) => self.updateProjectionMatrix()}
      />
      <directionalLight
        color="white"
        intensity={2}
        position={[30, 20, 30]}
        castShadow
        shadow-mapSize={1024}
        shadow-bias={-0.0004}
        ref={sunRef}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-4, 4, 4, -4, 1, 100]}
        />
      </directionalLight>
    </>
  );
}

export default IsometricCamera;
