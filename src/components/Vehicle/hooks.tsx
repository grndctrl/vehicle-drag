import { DynamicRayCastVehicleController } from '@dimforge/rapier3d-compat';
import { RefObject, useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';
import {
  RapierRigidBody,
  useAfterPhysicsStep,
  useRapier,
} from '../../lib/react-three-rapier';
import { WheelType } from './Wheel';

export function useVehicleController(
  chassisRef: RefObject<RapierRigidBody>,
  wheels: { position: Vector3; radius: number }[]
) {
  const { world } = useRapier();
  const vehicleControllerRef = useRef<DynamicRayCastVehicleController>();
  const [wheelStates, setWheelStates] = useState<WheelType[]>(
    wheels.map(({ position, radius }) => ({
      origin: position.clone(),
      position,
      radius,
      steering: 0,
    }))
  );

  const suspensionRestLength = 0.5;
  const suspensionStiffness = 24;
  const maxSuspensionTravel = 0.5;
  const suspensionDamping = 0.9;

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

    wheels.forEach((wheel, index) => {
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
      const suspension = -1 * (vehicle.wheelSuspensionLength(index) || 0);
      const { y } = wheel.origin;

      wheel.position.setY(y + suspension);
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
