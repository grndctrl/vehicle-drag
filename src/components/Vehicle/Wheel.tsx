import { Cylinder } from '@react-three/drei';
import { Object3DProps } from '@react-three/fiber';
import { forwardRef } from 'react';
import { Object3D } from 'three';

// export type WheelType = {
//   origin: Vector3;
//   position: Vector3;
//   rotation: Quaternion;
//   steering: number;
//   radius: number;
// };

// export type WheelProps = {
//   // position: Vector3;
//   // steering: number;
//   radius: number;
// };

export type WheelRef = Object3D;

const Wheel = forwardRef<WheelRef, Object3DProps>((props, ref) => {
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
    <object3D ref={ref} {...props}>
      <Cylinder args={[0.3, 0.3, 0.25, 32]} rotation={[Math.PI * 0.5, 0, 0]}>
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
