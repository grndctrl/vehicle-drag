import { Shape } from '@react-three/drei';
import { Object3DProps, useLoader } from '@react-three/fiber';
import { forwardRef, useState } from 'react';
import * as THREE from 'three';
import { SVGLoader, SVGResult } from 'three-stdlib';

type DragIndicatorProps = Object3DProps;

const DragIndicator = forwardRef<THREE.Object3D, DragIndicatorProps>(
  (props, ref) => {
    const { paths }: SVGResult = useLoader(SVGLoader, '/direction.svg');
    const [shapes] = useState<THREE.Shape[]>(() =>
      paths
        .map((path) => {
          console.log('doing paths again');
          return SVGLoader.createShapes(path);
        })
        .flat()
    );

    return (
      <object3D ref={ref} {...props}>
        {shapes.map((shape) => (
          <Shape
            key={shape.uuid}
            args={[shape]}
            rotation={[Math.PI * -0.5, 0, Math.PI * -0.5]}
            position={[-50, 0, -50]}
          >
            <meshBasicMaterial color={'#fff'} toneMapped={false} />
          </Shape>
        ))}
      </object3D>
    );
  }
);

export default DragIndicator;
