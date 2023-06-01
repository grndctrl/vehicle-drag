import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, Object3D } from 'three';
import { useControls } from '../../hooks/useControls';
import { useVehicleController } from '../../hooks/vehicleController';
import { RapierRigidBody, RigidBody } from '../../lib/react-three-rapier';

import Chassis from './Chassis';
import Wheel from './Wheel';

function Vehicle() {
  const chassisRef = useRef<RapierRigidBody>(null);
  const wheelsRef = useRef<Object3D[]>([]);

  const { vehicleController } = useVehicleController(chassisRef, wheelsRef);

  const { controls } = useControls();

  useFrame(({ clock }) => {
    if (!vehicleController) return;

    const accelerateForce = 24;
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

    const steering = MathUtils.damp(
      currentSteering,
      steerAngle * steerDirection,
      128,
      clock.getDelta()
    );

    vehicleController.setWheelSteering(0, steering);
    vehicleController.setWheelSteering(1, steering);
  });

  return (
    <>
      <RigidBody
        canSleep={false}
        ref={chassisRef}
        colliders={'hull'}
        position={[0, 1, 0]}
        type="dynamic"
      >
        <Chassis rotation={[0, Math.PI * -0.5, 0]} />
      </RigidBody>

      {/* front left */}
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
    </>
  );
}

export default Vehicle;
