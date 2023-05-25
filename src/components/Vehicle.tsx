import { Box, Cylinder } from '@react-three/drei';
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  useAfterPhysicsStep,
  useRapier
} from '../lib/react-three-rapier';
import { useEffect, useRef, useState } from 'react';
import { DynamicRayCastVehicleController } from '@dimforge/rapier3d-compat';
import { Group, Vector3, Quaternion } from 'three';
import { useFrame } from '@react-three/fiber';

function Wheel({
  position,
  steering,
  radius
}: {
  position: Vector3;
  steering: number;
  radius: number;
}) {
  const wheelRef = useRef<Group>(null);

  useFrame(() => {
    const { current: wheel } = wheelRef;

    if (!wheel) return;

    wheel.position.set(position.x, position.y, position.z);
    wheel.rotation.y = steering;
  });

  return (
    <group ref={wheelRef}>
      <Cylinder
        args={[radius, radius, 0.5, 32]}
        rotation={[Math.PI * 0.5, 0, 0]}
      >
        <meshNormalMaterial />
      </Cylinder>
    </group>
  );
}

type Wheel = {
  origin: Vector3;
  position: Vector3;
  steering: number;
  radius: number;
};

function Vehicle() {
  const { world } = useRapier();
  const chassisRef = useRef<RapierRigidBody>(null);
  const vehicleRef = useRef<DynamicRayCastVehicleController>();

  const [wheels, setWheels] = useState<Wheel[]>([
    // front left
    {
      origin: new Vector3(2, 0, -1),
      position: new Vector3(2, 0, -1),
      steering: 0,
      radius: 0.75
    },
    // front right
    {
      origin: new Vector3(2, 0, 1),
      position: new Vector3(2, 0, 1),
      steering: 0,
      radius: 0.75
    },
    // back left
    {
      origin: new Vector3(-2, 0, -1),
      position: new Vector3(-2, 0, -1),
      steering: 0,
      radius: 1
    },
    // back right
    {
      origin: new Vector3(-2, 0, 1),
      position: new Vector3(-2, 0, 1),
      steering: 0,
      radius: 1
    }
  ]);

  const suspensionRestLength = 0.5;
  const suspensionStiffness = 24;
  const maxSuspensionTravel = 0.5;
  const suspensionDamping = 0.9;

  useEffect(() => {
    const { current: chassis } = chassisRef;

    if (!chassis) return;

    vehicleRef.current = world.createVehicleController(chassis);

    const { current: vehicle } = vehicleRef;

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

    vehicle.setWheelSteering(0, Math.PI / 8);
    vehicle.setWheelSteering(1, Math.PI / 8);

    vehicle.setWheelEngineForce(0, 1);
    vehicle.setWheelEngineForce(1, 1);
  }, []);

  useAfterPhysicsStep((world) => {
    const { current: vehicle } = vehicleRef;
    const { current: chassis } = chassisRef;

    if (!vehicle || !chassis) return;

    vehicle.updateVehicle(world.timestep);

    const updatedWheels = wheels.map((wheel, index) => {
      const suspension = -1 * (vehicle.wheelSuspensionLength(index) || 0);
      const { y } = wheel.origin;

      wheel.position.setY(y + suspension);
      wheel.steering = vehicle.wheelSteering(index) || 0;

      return wheel;
    });

    setWheels(updatedWheels);
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
