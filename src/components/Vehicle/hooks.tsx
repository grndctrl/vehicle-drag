import { DynamicRayCastVehicleController } from '@dimforge/rapier3d-compat';
import { RefObject, useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';
import {
  RapierRigidBody,
  useAfterPhysicsStep,
  useRapier,
} from '../../lib/react-three-rapier';

const suspensionRestLength = 0.75;
const suspensionStiffness = 24;
const maxSuspensionTravel = 0.5;
const suspensionDamping = 0.9;

export function useVehicleController(
  chassisRef: RefObject<RapierRigidBody>,
  wheels: Vector3[]
) {
  const { world } = useRapier();
  const vehicleControllerRef = useRef<DynamicRayCastVehicleController>();
  const [vehicleController, setVehicleController] =
    useState<DynamicRayCastVehicleController>();

  // useEffect(() => {
  //   const { current: chassis } = chassisRef;

  //   if (!chassis) return;
  //   vehicleControllerRef.current = world.createVehicleController(chassis);
  //   setVehicleController(world.createVehicleController(chassis));

  //   const { current: vehicle } = vehicleControllerRef;

  //   wheels.forEach((position) => {
  //     vehicle.addWheel(
  //       position,
  //       new Vector3(0, -1, 0),
  //       new Vector3(0, 0, 1),
  //       suspensionRestLength,
  //       0.3
  //     );
  //   });

  //   wheels.forEach((_wheel, index) => {
  //     vehicle.setWheelSuspensionStiffness(index, suspensionStiffness);
  //     vehicle.setWheelMaxSuspensionTravel(index, maxSuspensionTravel);
  //     vehicle.setWheelSuspensionCompression(index, suspensionDamping);
  //     vehicle.setWheelSuspensionRelaxation(index, suspensionDamping);
  //   });
  // }, []);

  useEffect(() => {
    const { current: chassis } = chassisRef;

    if (!chassis) return;

    const vehicle = world.createVehicleController(chassis);

    wheels.forEach((position) => {
      vehicle.addWheel(
        position,
        new Vector3(0, -1, 0),
        new Vector3(0, 0, 1),
        suspensionRestLength,
        0.3
      );
    });

    wheels.forEach((_wheel, index) => {
      vehicle.setWheelSuspensionStiffness(index, suspensionStiffness);
      vehicle.setWheelMaxSuspensionTravel(index, maxSuspensionTravel);
      vehicle.setWheelSuspensionCompression(index, suspensionDamping);
      vehicle.setWheelSuspensionRelaxation(index, suspensionDamping);
    });

    setVehicleController(vehicle);
  }, []);

  useAfterPhysicsStep((world) => {
    if (!vehicleController) return;

    vehicleController.updateVehicle(world.timestep);
  });

  return {
    vehicleController,
    wheels: [],
  };
}
