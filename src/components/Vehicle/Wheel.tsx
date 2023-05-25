import { Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group, Vector3 } from 'three';

export type WheelType = {
  origin: Vector3;
  position: Vector3;
  steering: number;
  radius: number;
};

export type WheelProps = {
  position: Vector3;
  steering: number;
  radius: number;
};

function Wheel({ position, steering, radius }: WheelProps) {
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

export default Wheel;
