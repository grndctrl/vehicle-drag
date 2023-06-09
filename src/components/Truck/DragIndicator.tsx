import { Shape } from '@react-three/drei';
import { Object3DProps, useFrame, useLoader } from '@react-three/fiber';
import { LayerMaterial } from 'lamina';
import { LayerMaterial as Material } from 'lamina/vanilla';
import { RefObject, forwardRef, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SVGLoader, SVGResult } from 'three-stdlib';

type DragIndicatorProps = Object3DProps & {
  isVisible: RefObject<boolean>;
};

const DragIndicator = forwardRef<THREE.Object3D, DragIndicatorProps>(
  ({ isVisible, ...props }, ref) => {
    const materialRef = useRef<Material>(null);
    const { paths }: SVGResult = useLoader(SVGLoader, '/direction.svg');

    const shapes = paths
      .map((path) => {
        return SVGLoader.createShapes(path);
      })
      .flat();

    useFrame(() => {
      // console.log('isVisible', isVisible);
      const { current: material } = materialRef;

      // console.log('🚀 ~ file: DragIndicator.tsx:38 ~ material:', material);
      if (!material) return;

      const currentTransmission = material.transmission;
      const lerpTransmission = THREE.MathUtils.lerp(
        currentTransmission,
        isVisible.current ? 0 : 1,
        0.1
      );

      material.transmission = lerpTransmission;
    });

    useEffect(() => {
      console.log('test');
    }, []);

    return (
      <object3D ref={ref} {...props}>
        {shapes.map((shape) => (
          <Shape
            key={shape.uuid}
            args={[shape]}
            rotation={[Math.PI * -0.5, 0, Math.PI * -0.5]}
            position={[-50, 0, -50]}
          >
            <LayerMaterial
              ref={materialRef}
              color={'#ffffff'}
              lighting={'physical'} //
              transmission={1}
              roughness={0}
              thickness={0}
            />
          </Shape>
        ))}
      </object3D>
    );
  }
);

export default DragIndicator;
