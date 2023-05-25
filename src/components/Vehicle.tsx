import { Box, Cylinder } from '@react-three/drei';
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  useBeforePhysicsStep,
  useRapier
} from '../lib/react-three-rapier';
import { useEffect, useRef, useState } from 'react';
import { DynamicRayCastVehicleController } from '@dimforge/rapier3d-compat';
import { AxesHelper, Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

function Wheel({ position, radius }: { position: Vector3; radius: number }) {
  const wheelRef = useRef<Mesh>(null);

  useFrame(() => {
    const { current: wheel } = wheelRef;

    if (!wheel) return;

    wheel.position.set(position.x, position.y, position.z);
  });
  return (
    <Cylinder
      ref={wheelRef}
      args={[radius, radius, 0.1, 64]}
      rotation={[0, 0, Math.PI * 0.5]}
    >
      <meshNormalMaterial />
    </Cylinder>
  );
}

function Vehicle() {
  const { world } = useRapier();
  const chassisRef = useRef<RapierRigidBody>(null);
  const vehicleRef = useRef<DynamicRayCastVehicleController>();

  const [wheelpositions, setWheelPositions] = useState({
    frontLeft: new Vector3(-1, 0, -2),
    frontRight: new Vector3(1, 0, -2),
    backLeft: new Vector3(-1, 0, 2),
    backRight: new Vector3(1, 0, 2)
  });

  const radius = 0.75;
  const suspensionRestLength = 0.5;
  const suspensionStiffness = 0.25;
  const maxSuspensionTravel = 0.5;
  const suspensionDamping = 0.5;

  useEffect(() => {
    const { current: chassis } = chassisRef;

    if (!chassis) return;

    vehicleRef.current = world.createVehicleController(chassis);
    vehicleRef.current.addWheel(
      wheelpositions.frontLeft,
      new Vector3(0, -1, 0),
      new Vector3(1, 0, 0),
      suspensionRestLength,
      radius
    );
    vehicleRef.current.addWheel(
      wheelpositions.frontRight,
      new Vector3(0, -1, 0),
      new Vector3(1, 0, 0),
      suspensionRestLength,
      radius
    );
    vehicleRef.current.addWheel(
      wheelpositions.backLeft,
      new Vector3(0, -1, 0),
      new Vector3(1, 0, 0),
      suspensionRestLength,
      radius
    );
    vehicleRef.current.addWheel(
      wheelpositions.backRight,
      new Vector3(0, -1, 0),
      new Vector3(1, 0, 0),
      suspensionRestLength,
      radius
    );

    [0, 1, 2, 3].forEach((wheel) => {
      vehicleRef.current?.setWheelSuspensionStiffness(
        wheel,
        suspensionStiffness
      );
      vehicleRef.current?.setWheelMaxSuspensionTravel(
        wheel,
        maxSuspensionTravel
      );
      vehicleRef.current?.setWheelSuspensionCompression(
        wheel,
        suspensionDamping
      );
      vehicleRef.current?.setWheelSuspensionRelaxation(
        wheel,
        suspensionDamping
      );
    });
  }, []);

  useBeforePhysicsStep((world) => {
    const { current: vehicle } = vehicleRef;
    const { current: chassis } = chassisRef;

    if (!vehicle || !chassis) return;

    vehicle.updateVehicle(world.timestep);

    setWheelPositions({
      frontLeft: wheelpositions.frontLeft.setY(
        -1 * (vehicle.wheelSuspensionLength(0) || 0)
      ),
      frontRight: wheelpositions.frontRight.setY(
        -1 * (vehicle.wheelSuspensionLength(1) || 0)
      ),
      backLeft: wheelpositions.backLeft.setY(
        -1 * (vehicle.wheelSuspensionLength(2) || 0)
      ),
      backRight: wheelpositions.backRight.setY(
        -1 * (vehicle.wheelSuspensionLength(3) || 0)
      )
    });
  });

  return (
    <>
      <RigidBody
        ref={chassisRef}
        colliders={false}
        position={[0, 3, 0]}
        type="dynamic"
      >
        <CuboidCollider args={[0.5, 0.5, 2]}>
          <Box args={[1, 1, 4]}>
            <meshNormalMaterial />
          </Box>
        </CuboidCollider>
        <Wheel position={wheelpositions.frontLeft} radius={radius} />
        <Wheel position={wheelpositions.frontRight} radius={radius} />
        <Wheel position={wheelpositions.backLeft} radius={radius} />
        <Wheel position={wheelpositions.backRight} radius={radius} />
      </RigidBody>
    </>
  );
}

export default Vehicle;
