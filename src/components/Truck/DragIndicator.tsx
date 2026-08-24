import { Shape } from '@react-three/drei';
import { ThreeElements, useLoader } from '@react-three/fiber';
import { forwardRef, useState } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

type DragIndicatorProps = ThreeElements['object3D'];

const DragIndicator = forwardRef<THREE.Object3D, DragIndicatorProps>(
  (props, ref) => {
    const { paths } = useLoader(SVGLoader, '/direction.svg');
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
