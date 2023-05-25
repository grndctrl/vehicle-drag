import { Box, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from '../../lib/react-three-rapier';
import { useControls } from '../hooks/useControls';
import Wheel from './Wheel';
import { useVehicleController } from './hooks';

function Vehicle() {
  const chassisRef = useRef<RapierRigidBody>(null);

  const { vehicleController, wheels } = useVehicleController(chassisRef, [
    // front left
    {
      position: new Vector3(1.5, 0, -1),
      radius: 0.25,
    },
    // front right
    {
      position: new Vector3(1.5, 0, 1),
      radius: 0.25,
    },
    // back left
    {
      position: new Vector3(-1.5, 0, -1),
      radius: 0.3,
    },
    // back right
    {
      position: new Vector3(-1.5, 0, 1),
      radius: 0.3,
    },
  ]);

  const { controls } = useControls();

  const texture = useTexture(
    'https://raw.githubusercontent.com/pmndrs/drei-assets/master/prototype/purple/texture_04.png'
  );
  useFrame(() => {
    if (!vehicleController) return;
    const accelerateForce = 12;
    const brakeForce = 8;
    const steerAngle = Math.PI / 8;

    const engineForce =
      Number(controls.accelerate) * accelerateForce -
      Number(controls.brake) * brakeForce;

    vehicleController.setWheelEngineForce(0, engineForce);
    vehicleController.setWheelEngineForce(1, engineForce);

    const steerDirection =
      Number(controls.steerLeft) + Number(controls.steerRight) * -1;

    vehicleController.setWheelSteering(0, steerAngle * steerDirection);
    vehicleController.setWheelSteering(1, steerAngle * steerDirection);
  });

  return (
    <>
      <RigidBody
        ref={chassisRef}
        colliders={false}
        position={[0, 3, 0]}
        type="dynamic"
      >
        <CuboidCollider args={[2, 0.5, 1]}>
          <Box args={[2, 1, 2]} position={[1, 0, 0]}>
            <meshBasicMaterial map={texture} />
          </Box>
          <Box args={[2, 1, 2]} position={[-1, 0, 0]}>
            <meshBasicMaterial map={texture} />
          </Box>
        </CuboidCollider>

        {wheels.map(({ position, steering, radius }, index) => (
          <Wheel key={`wheel-${index}`} {...{ position, steering, radius }} />
        ))}
      </RigidBody>
    </>
  );
}

export default Vehicle;