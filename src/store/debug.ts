import * as THREE from 'three';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface DebugState {
  target: THREE.Vector2;
  setTarget: (translation: THREE.Vector2) => void;
}

const useDebugStore = create<DebugState>()(
  devtools(
    (set) => ({
      target: new THREE.Vector2(),
      setTarget: (target) => set(() => ({ target })),
    }),
    {
      name: 'store',
    }
  )
);

export { useDebugStore };
