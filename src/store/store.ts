import * as THREE from 'three';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  translation: THREE.Vector3;
  setTranslation: (translation: THREE.Vector3) => void;
}

const useStore = create<State>()(
  devtools(
    (set) => ({
      translation: new THREE.Vector3(),
      setTranslation: (translation) => set(() => ({ translation })),
    }),
    {
      name: 'store',
    }
  )
);

export { useStore };
