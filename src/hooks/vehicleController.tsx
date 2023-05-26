import { DynamicRayCastVehicleController } from '@dimforge/rapier3d-compat';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Quaternion, Vector3 } from 'three';
import {
  RapierRigidBody,
  useAfterPhysicsStep,
  useRapier,
} from '../lib/react-three-rapier';

export type WheelType = {
  connection: Vector3;
  steering: number;
  radius: number;
  worldPosition: Vector3;
  worldRotation: Quaternion;
};

const suspensionRestLength = 0.75;
const suspensionStiffness = 24;
const maxSuspensionTravel = 0.5;
const suspensionDamping = 0.9;

export function useVehicleController(
  chassisRef: RefObject<RapierRigidBody>
  // wheels: { position: Vector3; radius: number }[]
) {
  const { world } = useRapier();
  const vehicleControllerRef = useRef<DynamicRayCastVehicleController>();
  const [wheelStates, setWheelStates] = useState<WheelType[]>(
    wheels.map(({ position, radius }) => ({
      origin: position.clone(),
      position,
      radius,
      steering: 0,
      rotation: new Quaternion(),
    }))
  );

  const updateWheel = useCallback((wheel: WheelType, index: number) => {
    const { current: chassis } = chassisRef;
    const { current: vehicle } = vehicleControllerRef;

    if (!chassis || !vehicle) {
      return { position: wheel.position, rotation: new Quaternion() };
    }

    const chassisPosition = new Vector3(
      chassis.translation().x,
      chassis.translation().y,
      chassis.translation().z
    );
    const chassisRotation = new Quaternion(
      chassis.rotation().x,
      chassis.rotation().y,
      chassis.rotation().z,
      chassis.rotation().w
    );

    const wheelRotation = new Quaternion()
      .setFromAxisAngle(new Vector3(0, 1, 0), wheel.steering)
      .multiply(chassisRotation);

    const wheelPosition = wheel.origin
      .clone()
      .sub(new Vector3(0, vehicle.wheelSuspensionLength(index) || 0, 0))
      .applyQuaternion(chassisRotation)
      .add(chassisPosition);

    return { position: wheelPosition, rotation: wheelRotation };
  }, []);

  useEffect(() => {
    const { current: chassis } = chassisRef;

    if (!chassis) return;

    vehicleControllerRef.current = world.createVehicleController(chassis);

    const { current: vehicle } = vehicleControllerRef;

    wheels.forEach(({ position, radius }) => {
      vehicle.addWheel(
        position,
        new Vector3(0, -1, 0),
        new Vector3(0, 0, 1),
        suspensionRestLength,
        radius
      );
    });

    wheels.forEach((_wheel, index) => {
      vehicle.setWheelSuspensionStiffness(index, suspensionStiffness);
      vehicle.setWheelMaxSuspensionTravel(index, maxSuspensionTravel);
      vehicle.setWheelSuspensionCompression(index, suspensionDamping);
      vehicle.setWheelSuspensionRelaxation(index, suspensionDamping);
    });
  }, []);

  useAfterPhysicsStep((world) => {
    const { current: vehicle } = vehicleControllerRef;
    const { current: chassis } = chassisRef;

    if (!vehicle || !chassis) return;

    vehicle.updateVehicle(world.timestep);

    const updatedWheels = wheelStates.map((wheel, index) => {
      // const suspension = -1 * (vehicle.wheelSuspensionLength(index) || 0);
      // const { y } = wheel.origin;

      const { position, rotation } = updateWheel(wheel, index);

      wheel.position = position;
      wheel.rotation = rotation;
      wheel.steering = vehicle.wheelSteering(index) || 0;

      return wheel;
    });

    setWheelStates(updatedWheels);
  });

  return {
    vehicleController: vehicleControllerRef.current,
    wheels: wheelStates,
  };
}
