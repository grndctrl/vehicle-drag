import { OrthographicCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../store/store';

function IsometricCamera() {
  const translation = useStore((state) => state.translation);
  const cameraRef = useRef<THREE.OrthographicCamera>(null);
  const cameraOrientationRef = useRef({
    position: new THREE.Vector3(),
    target: new THREE.Vector3(),
  });

  useEffect(() => {
    const { current: camera } = cameraRef;

    if (!camera) return;

    camera.rotation.order = 'YXZ';
    camera.translateZ(10);
  }, [cameraRef]);

  useFrame(({ camera }) => {
    const { current: cameraOrientation } = cameraOrientationRef;

    cameraOrientation.position.set(
      translation.x + 2,
      translation.y + 2,
      translation.z + 2
    );
    cameraOrientation.target.lerp(translation, 0.05);

    camera.position.lerp(cameraOrientation.position, 0.05);
    camera.lookAt(cameraOrientation.target);
  });

  return (
    <OrthographicCamera
      ref={cameraRef}
      makeDefault
      zoom={50}
      near={-100}
      far={500}
      rotation={[Math.atan(-1 / Math.sqrt(2)), Math.PI / 4, 0]}
      onUpdate={(self) => self.updateProjectionMatrix()}
    />
  );
}

export default IsometricCamera;
