import { DynamicRayCastVehicleController } from '@dimforge/rapier3d-compat';
import { RefObject, useCallback, useEffect, useState } from 'react';
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

const suspensionRestLength = 0.125;
const suspensionStiffness = 32;
const maxSuspensionTravel = 0.125;
const suspensionDamping = 0.9;

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
      vehicle.setWheelSuspensionCompression(index, suspensionDamping);
      vehicle.setWheelSuspensionRelaxation(index, suspensionDamping);
    });

    setVehicleController(vehicle);
  }, []);

  useAfterPhysicsStep((world) => {
    if (!vehicleController) return;

    vehicleController.updateVehicle(world.timestep);

    const { current: wheels } = wheelsRef;

    wheels?.forEach((wheel, index) => {
      const wheelOrientation = calcWheelOrientation(wheel, index);

      if (!wheelOrientation) return;

      const { position, rotation } = wheelOrientation;

      wheel.position.set(position.x, position.y, position.z);
      wheel.rotation.setFromQuaternion(rotation);
    });
  });

  const calcWheelOrientation = useCallback(
    (wheel: Object3D, index: number) => {
      const { current: chassis } = chassisRef;

      if (!chassis || !vehicleController) return;

      const wheelConnection =
        vehicleController.wheelChassisConnectionPointCs(index);
      const wheelSteering = vehicleController.wheelSteering(index);

      if (!wheelConnection || wheelSteering === null) return;

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
        .setFromAxisAngle(new Vector3(0, 1, 0), wheelSteering)
        .multiply(chassisRotation);

      const wheelPosition = new Vector3(
        wheelConnection.x,
        wheelConnection.y,
        wheelConnection.z
      )
        .clone()
        .sub(
          new Vector3(0, vehicleController.wheelSuspensionLength(index) || 0, 0)
        )
        .applyQuaternion(chassisRotation)
        .add(chassisPosition);

      return { position: wheelPosition, rotation: wheelRotation };
    },

    [chassisRef, vehicleController]
  );

  return {
    vehicleController,
    wheels: [],
  };
}
