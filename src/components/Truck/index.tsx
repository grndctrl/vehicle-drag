import { useFrame, useThree } from '@react-three/fiber';
import { RefObject, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useVehicleController } from '../../hooks/vehicleController';
import {
  MeshCollider,
  RapierRigidBody,
  RigidBody,
} from '../../lib/react-three-rapier';

import { useDrag } from '@use-gesture/react';
import { useDebugStore } from '../../store/debug';
import { useStore } from '../../store/store';
import { isLeft } from '../../utilities/vector';
import Chassis from './Chassis';
import DragIndicator from './DragIndicator';
import Wheel from './Wheel';

function calcPropulsion(chassis: RapierRigidBody, target: THREE.Vector2) {
  const rotation = chassis.rotation() as THREE.Quaternion;

  const position = new THREE.Vector2(
    chassis.translation().x,
    chassis.translation().z
  );

  const forward = new THREE.Vector3(1, 0, 0).applyQuaternion(rotation);

  let angle = target
    .clone()
    .sub(position)
    .angleTo(new THREE.Vector2(forward.x, forward.z));

  let engineForce = 40;
  let steering = 0;
  const steeringDirection = isLeft(
    position,
    position.clone().add(new THREE.Vector2(forward.x, forward.z)),
    target
  )
    ? 1
    : -1;

  if (angle > Math.PI / 2) {
    engineForce = -12;
    angle = Math.PI - angle;
  }

  if (angle > Math.PI / 24) {
    steering = Math.min(angle, Math.PI / 4) * steeringDirection;
  }

  return { engineForce, steering };
}

type VehicleProps = {
  groundRef: RefObject<THREE.Mesh>;
};

function Vehicle({ groundRef }: VehicleProps) {
  // state
  const chassisRef = useRef<RapierRigidBody>(null);
  const wheelsRef = useRef<THREE.Object3D[]>([]);
  const dragIndicatorRef = useRef<THREE.Object3D>(null);
  const steeringRef = useRef<number>(0);
  const engineForceRef = useRef<number>(0);
  const [isDragIndicator, toggleDragIndicator] = useState<boolean>(false);

  // hooks
  const setTranslation = useStore((state) => state.setTranslation);
  const setTarget = useDebugStore((state) => state.setTarget);
  const { vehicleController } = useVehicleController(chassisRef, wheelsRef);
  const { raycaster, camera, pointer } = useThree();

  const bind = useDrag(({ down }) => {
    const { current: ground } = groundRef;
    if (!ground || !vehicleController) return;

    if (down) {
      toggleDragIndicator(true);

      raycaster.setFromCamera(pointer, camera);
      const intersections = raycaster.intersectObject(ground);

      if (intersections.length > 0) {
        const { point } = intersections[0];
        const target = new THREE.Vector2(point.x, point.z);
        setTarget(target);
        const { steering, engineForce } = calcPropulsion(
          vehicleController.chassis(),
          target
        );

        steeringRef.current = steering;
        engineForceRef.current = engineForce;
      }
    } else {
      toggleDragIndicator(false);
    }
  });

  // effects
  useEffect(() => {
    if (!isDragIndicator) {
      steeringRef.current = 0;
      engineForceRef.current = 0;
    }
  }, [isDragIndicator]);

  useEffect(() => {
    if (!vehicleController) return;

    const stiffness = 35;
    const rest = 0.2;
    const travel = 0.15;

    for (let index = 0; index < 4; index++) {
      vehicleController.setWheelSuspensionStiffness(index, stiffness);
      vehicleController.setWheelSuspensionRestLength(index, rest);
      vehicleController.setWheelMaxSuspensionTravel(index, travel);
    }
  }, [vehicleController]);

  // animation loop
  useFrame(() => {
    if (!vehicleController) return;

    const { current: steering } = steeringRef;
    const { current: engineForce } = engineForceRef;

    const currentSteering = vehicleController.wheelSteering(0) || 0;
    const lerpSteering = THREE.MathUtils.lerp(currentSteering, steering, 0.25);

    vehicleController.setWheelSteering(0, lerpSteering);
    vehicleController.setWheelSteering(1, lerpSteering);

    vehicleController.setWheelEngineForce(0, engineForce);
    vehicleController.setWheelEngineForce(1, engineForce);

    //

    const { current: chassis } = chassisRef;

    if (!chassis) return;

    setTranslation(chassis.translation() as THREE.Vector3);

    const { current: dragIndicator } = dragIndicatorRef;
    if (!dragIndicator) return;

    dragIndicator.position.setX(chassis.translation().x);
    dragIndicator.position.setZ(chassis.translation().z);

    const rotation = new THREE.Quaternion(
      chassis.rotation().x,
      chassis.rotation().y,
      chassis.rotation().z,
      chassis.rotation().w
    );

    const euler = new THREE.Euler().setFromQuaternion(rotation);

    const forward = new THREE.Vector3(1, 0, 0).applyQuaternion(rotation);

    let angle = euler.y;
    if (forward.x < 0) {
      angle = Math.PI - angle;
    }

    angle += engineForce < 0 ? Math.PI - lerpSteering : lerpSteering;

    dragIndicator.rotation.set(0, angle, 0);
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
          {/* @ts-ignore  */}
          <object3D {...bind()}>
            <Chassis rotation={[0, Math.PI * -0.5, 0]} />
          </object3D>
        </MeshCollider>

        <object3D
          position={[0.65, 0.1, -0.6]}
          ref={(ref: THREE.Object3D) => (wheelsRef.current[0] = ref)}
        >
          <Wheel rotation={[0, Math.PI * -0.5, 0]} />
        </object3D>

        <object3D
          position={[0.65, 0.1, 0.6]}
          ref={(ref: THREE.Object3D) => (wheelsRef.current[1] = ref)}
        >
          <Wheel rotation={[0, Math.PI * 0.5, 0]} />
        </object3D>

        <object3D
          position={[-0.95, 0.1, -0.6]}
          ref={(ref: THREE.Object3D) => (wheelsRef.current[2] = ref)}
        >
          <Wheel rotation={[0, Math.PI * -0.5, 0]} />
        </object3D>

        <object3D
          position={[-0.95, 0.1, 0.6]}
          ref={(ref: THREE.Object3D) => (wheelsRef.current[3] = ref)}
        >
          <Wheel rotation={[0, Math.PI * 0.5, 0]} />
        </object3D>
      </RigidBody>

      <DragIndicator
        ref={dragIndicatorRef}
        visible={isDragIndicator}
        position={[0, 0.1, 0]}
        scale={[0.05, 0.05, 0.05]}
      />
    </>
  );
}

export default Vehicle;
