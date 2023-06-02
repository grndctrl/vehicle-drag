import { useFrame } from '@react-three/fiber';
import { useControls as useLeva } from 'leva';
import { useEffect, useRef } from 'react';
import { MathUtils, Object3D } from 'three';
import { useControls } from '../../hooks/useControls';
import { useVehicleController } from '../../hooks/vehicleController';
import {
  MeshCollider,
  RapierRigidBody,
  RigidBody,
} from '../../lib/react-three-rapier';

import Chassis from './Chassis';
import Wheel from './Wheel';

function Vehicle() {
  const chassisRef = useRef<RapierRigidBody>(null);
  const wheelsRef = useRef<Object3D[]>([]);

  const { stiffness, rest, travel } = useLeva({
    stiffness: {
      value: 35,
      min: 12,
      max: 80,
      step: 1,
    },
    rest: {
      value: 0.2,
      min: 0,
      max: 0.5,
      step: 0.025,
    },
    travel: {
      value: 0.15,
      min: 0,
      max: 0.5,
      step: 0.025,
    },
  });

  const { vehicleController } = useVehicleController(chassisRef, wheelsRef);

  const { controls } = useControls();

  useEffect(() => {
    if (!vehicleController) return;

    vehicleController.setWheelSuspensionStiffness(0, stiffness);
    vehicleController.setWheelSuspensionStiffness(1, stiffness);
    vehicleController.setWheelSuspensionStiffness(2, stiffness);
    vehicleController.setWheelSuspensionStiffness(3, stiffness);

    vehicleController.setWheelSuspensionRestLength(0, rest);
    vehicleController.setWheelSuspensionRestLength(1, rest);
    vehicleController.setWheelSuspensionRestLength(2, rest);
    vehicleController.setWheelSuspensionRestLength(3, rest);

    vehicleController.setWheelMaxSuspensionTravel(0, travel);
    vehicleController.setWheelMaxSuspensionTravel(1, travel);
    vehicleController.setWheelMaxSuspensionTravel(2, travel);
    vehicleController.setWheelMaxSuspensionTravel(3, travel);
  }, [rest, stiffness, travel, vehicleController]);

  useFrame(({ clock }) => {
    if (!vehicleController) return;

    const accelerateForce = 48;
    const brakeForce = 12;
    const steerAngle = Math.PI / 6;

    const engineForce =
      Number(controls.accelerate) * accelerateForce -
      Number(controls.brake) * brakeForce;

    vehicleController.setWheelEngineForce(0, engineForce);
    vehicleController.setWheelEngineForce(1, engineForce);

    const currentSteering = vehicleController.wheelSteering(0) || 0;
    const steerDirection =
      Number(controls.steerLeft) + Number(controls.steerRight) * -1;

    const steering = MathUtils.lerp(
      currentSteering,
      steerAngle * steerDirection,
      0.5
    );

    vehicleController.setWheelSteering(0, steering);
    vehicleController.setWheelSteering(1, steering);
  });

  return (
    <>
      <RigidBody
        linearDamping={0.5}
        canSleep={false}
        ref={chassisRef}
        colliders={false}
        position={[0, 1, 0]}
        type="dynamic"
      >
        <MeshCollider type="hull">
          <Chassis rotation={[0, Math.PI * -0.5, 0]} />
        </MeshCollider>

        <object3D
          position={[0.65, 0.1, -0.6]}
          ref={(ref: Object3D) => (wheelsRef.current[0] = ref)}
        >
          <Wheel rotation={[0, Math.PI * -0.5, 0]} />
        </object3D>

        <object3D
          position={[0.65, 0.1, 0.6]}
          ref={(ref: Object3D) => (wheelsRef.current[1] = ref)}
        >
          <Wheel rotation={[0, Math.PI * 0.5, 0]} />
        </object3D>

        <object3D
          position={[-0.95, 0.1, -0.6]}
          ref={(ref: Object3D) => (wheelsRef.current[2] = ref)}
        >
          <Wheel rotation={[0, Math.PI * -0.5, 0]} />
        </object3D>

        <object3D
          position={[-0.95, 0.1, 0.6]}
          ref={(ref: Object3D) => (wheelsRef.current[3] = ref)}
        >
          <Wheel rotation={[0, Math.PI * 0.5, 0]} />
        </object3D>
      </RigidBody>
    </>
  );
}

export default Vehicle;
