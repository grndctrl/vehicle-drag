import { Box } from '@react-three/drei';
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
      position: new Vector3(2, 0, -1),
      radius: 0.75,
    },
    // front right
    {
      position: new Vector3(2, 0, 1),
      radius: 0.75,
    },
    // back left
    {
      position: new Vector3(-2, 0, -1),
      radius: 1,
    },
    // back right
    {
      position: new Vector3(-2, 0, 1),
      radius: 1,
    },
  ]);

  const { controls } = useControls();

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
        <CuboidCollider args={[2, 0.5, 0.5]}>
          <Box args={[4, 1, 1]}>
            <meshNormalMaterial />
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
