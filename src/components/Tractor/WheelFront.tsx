/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Mesh_wheelTractorFront: THREE.Mesh;
    Mesh_wheelTractorFront_1: THREE.Mesh;
  };
  materials: {
    carTire: THREE.MeshStandardMaterial;
    paintYellow: THREE.MeshStandardMaterial;
  };
};

export default function WheelFront(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(
    '/assets/wheelTractorFront.glb'
  ) as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mesh_wheelTractorFront.geometry}
        material={materials.carTire}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mesh_wheelTractorFront_1.geometry}
        material={materials.paintYellow}
      />
    </group>
  );
}

useGLTF.preload('/assets/wheelTractorFront.glb');
