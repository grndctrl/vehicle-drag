import { GroupProps } from '@react-three/fiber';
import { ReactNode } from 'react';
import { RigidBody } from '../../lib/react-three-rapier';
import { TreeA } from './TreeA';

type ObstacleProps = GroupProps & {
  children: ReactNode;
};

function Obstacle({ children, ...props }: ObstacleProps) {
  return (
    <group {...props}>
      <RigidBody colliders="trimesh" type="fixed">
        {children}
      </RigidBody>
    </group>
  );
}

function ObstacleTreeA(props: GroupProps) {
  return (
    <Obstacle {...props}>
      <TreeA />
    </Obstacle>
  );
}

Obstacle.TreeA = ObstacleTreeA;

export default Obstacle;
