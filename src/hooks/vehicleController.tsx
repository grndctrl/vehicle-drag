import { DynamicRayCastVehicleController } from '@dimforge/rapier3d-compat';
import { RefObject, useEffect, useState } from 'react';
import { Box3, Object3D, Quaternion, Vector3 } from 'three';
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

// default values
const suspensionRestLength = 0.125;
const suspensionStiffness = 24;
const maxSuspensionTravel = 0.125;

export function useVehicleController(
  chassisRef: RefObject<RapierRigidBody>,
  wheelsRef: RefObject<Object3D[]>
) {
  const { world } = useRapier();
  const [vehicleController, setVehicleController] =
    useState<DynamicRayCastVehicleController>();

  useEffect(() => {
    const { current: chassis } = chassisRef;
    const { current: wheels } = wheelsRef;

    if (!chassis || !wheels) return;

    const vehicle = world.createVehicleController(chassis);

    wheels.forEach((wheel) => {
      const boundingBox = new Box3().setFromObject(wheel);
      const radius = (boundingBox.max.y - boundingBox.min.y) * 0.5;

      vehicle.addWheel(
        wheel.position,
        new Vector3(0, -1, 0),
        new Vector3(0, 0, 1),
        suspensionRestLength,
        radius
      );
    });

    wheels.forEach((_wheel, index) => {
      vehicle.setWheelSuspensionStiffness(index, suspensionStiffness);
      vehicle.setWheelMaxSuspensionTravel(index, maxSuspensionTravel);
    });

    setVehicleController(vehicle);
  }, []);

  useAfterPhysicsStep((world) => {
    if (!vehicleController) return;

    vehicleController.updateVehicle(world.timestep);

    const { current: wheels } = wheelsRef;

    wheels?.forEach((wheel, index) => {
      const connection =
        vehicleController.wheelChassisConnectionPointCs(index)?.y || 0;
      const suspension = vehicleController.wheelSuspensionLength(index) || 0;
      const steering = vehicleController.wheelSteering(index) || 0;
      const rotation = vehicleController.wheelRotation(index) || 0;

      wheel.position.setY(connection - suspension);
      wheel.rotation.y = steering;
      wheel.rotation.z = -rotation;
    });
  });

  return {
    vehicleController,
    wheels: [],
  };
}
