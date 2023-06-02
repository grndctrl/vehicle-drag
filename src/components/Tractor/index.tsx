import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { MathUtils, Object3D } from 'three';
import { useControls } from '../../hooks/useControls';
import { useVehicleController } from '../../hooks/vehicleController';
import {
  MeshCollider,
  RapierRigidBody,
  RigidBody,
} from '../../lib/react-three-rapier';

import { folder, useControls as useLeva } from 'leva';
import Chassis from './Chassis';
import WheelBack from './WheelBack';
import WheelFront from './WheelFront';

function Tractor() {
  const chassisRef = useRef<RapierRigidBody>(null);
  const wheelsRef = useRef<Object3D[]>([]);

  const {
    stiffnessFront,
    stiffnessBack,
    restFront,
    restBack,
    travelFront,
    travelBack,
  } = useLeva({
    front: folder({
      stiffnessFront: {
        label: 'stiffness',
        value: 30,
        min: 12,
        max: 80,
        step: 1,
      },
      restFront: {
        label: 'rest',
        value: 0.1,
        min: 0,
        max: 0.5,
        step: 0.025,
      },
      travelFront: {
        label: 'travel',
        value: 0.15,
        min: 0,
        max: 0.5,
        step: 0.025,
      },
    }),
    back: folder({
      stiffnessBack: {
        label: 'stiffness',
        value: 48,
        min: 12,
        max: 80,
        step: 1,
      },
      restBack: {
        label: 'rest',
        value: 0.1,
        min: 0,
        max: 0.5,
        step: 0.025,
      },
      travelBack: {
        label: 'travel',
        value: 0.25,
        min: 0,
        max: 0.5,
        step: 0.025,
      },
    }),
  });

  const { vehicleController } = useVehicleController(chassisRef, wheelsRef);
  const { controls } = useControls();

  useEffect(() => {
    if (!vehicleController) return;

    vehicleController.setWheelSuspensionStiffness(0, stiffnessFront);
    vehicleController.setWheelSuspensionStiffness(1, stiffnessFront);
    vehicleController.setWheelSuspensionStiffness(2, stiffnessBack);
    vehicleController.setWheelSuspensionStiffness(3, stiffnessBack);

    vehicleController.setWheelSuspensionRestLength(0, restFront);
    vehicleController.setWheelSuspensionRestLength(1, restFront);
    vehicleController.setWheelSuspensionRestLength(2, restBack);
    vehicleController.setWheelSuspensionRestLength(3, restBack);

    vehicleController.setWheelMaxSuspensionTravel(0, travelFront);
    vehicleController.setWheelMaxSuspensionTravel(1, travelFront);
    vehicleController.setWheelMaxSuspensionTravel(2, travelBack);
    vehicleController.setWheelMaxSuspensionTravel(3, travelBack);
  }, [
    restBack,
    restFront,
    stiffnessBack,
    stiffnessFront,
    travelBack,
    travelFront,
    vehicleController,
  ]);

  useFrame(({ clock }) => {
    if (!vehicleController) return;

    const accelerateForce = 48;
    const brakeForce = 12;
    const steerAngle = Math.PI / 12;

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
          position={[0.8, 0.3, -0.55]}
          ref={(ref: Object3D) => (wheelsRef.current[0] = ref)}
        >
          <WheelFront rotation={[0, Math.PI * -0.5, 0]} />
        </object3D>

        <object3D
          position={[0.8, 0.3, 0.55]}
          ref={(ref: Object3D) => (wheelsRef.current[1] = ref)}
        >
          <WheelFront rotation={[0, Math.PI * 0.5, 0]} />
        </object3D>

        <object3D
          position={[-0.4, 0.4, -0.75]}
          ref={(ref: Object3D) => (wheelsRef.current[2] = ref)}
        >
          <WheelBack rotation={[0, Math.PI * -0.5, 0]} />
        </object3D>

        <object3D
          position={[-0.4, 0.4, 0.75]}
          ref={(ref: Object3D) => (wheelsRef.current[3] = ref)}
        >
          <WheelBack rotation={[0, Math.PI * 0.5, 0]} />
        </object3D>
      </RigidBody>
    </>
  );
}

export default Tractor;
