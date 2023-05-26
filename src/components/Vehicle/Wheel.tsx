import { Cylinder } from '@react-three/drei';
import { forwardRef } from 'react';
import { Object3D, Vector3 } from 'three';

export type WheelType = {
  origin: Vector3;
  position: Vector3;
  rotation: Quaternion;
  steering: number;
  radius: number;
};

export type WheelProps = {
  // position: Vector3;
  // steering: number;
  radius: number;
};

export type WheelRef = Object3D;

const Wheel = forwardRef<WheelRef, WheelProps>(({ radius }, ref) => {
  // const wheelRef = useRef<Group>(null);

  // useFrame(() => {
  //   const { current: wheel } = ref;
  //
  //   if (!wheel) return;
  //
  //   wheel.position.set(position.x, position.y, position.z);
  //   wheel.rotation.y = steering;
  // });

  return (
    <object3D ref={ref}>
      <Cylinder
        args={[radius, radius, 0.25, 32]}
        rotation={[Math.PI * 0.5, 0, 0]}
      >
        <meshBasicMaterial color={'#161616'} />
      </Cylinder>
    </object3D>
  );
});

// function Wheel({ position, steering, radius }: WheelProps) {
//   const wheelRef = useRef<Group>(null);
//
//   useFrame(() => {
//     const { current: wheel } = wheelRef;
//
//     if (!wheel) return;
//
//     wheel.position.set(position.x, position.y, position.z);
//     wheel.rotation.y = steering;
//   });
//
//   return (
//     <group ref={wheelRef}>
//       <Cylinder
//         args={[radius, radius, 0.25, 32]}
//         rotation={[Math.PI * 0.5, 0, 0]}
//       >
//         <meshBasicMaterial color={'#161616'} />
//       </Cylinder>
//     </group>
//   );
// }

export default Wheel;
