import { useEffect, useRef } from 'react';

export function useKeyPress(keys: string[], fn: (isDown: boolean) => void) {
  useEffect(() => {
    const handleKeyDown = ({ key }: KeyboardEvent) =>
      keys.indexOf(key) !== -1 && fn(true);
    const handleKeyUp = ({ key }: KeyboardEvent) =>
      keys.indexOf(key) !== -1 && fn(false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
}

export function useControls() {
  const controls = useRef({
    accelerate: false,
    brake: false,
    steerLeft: false,
    steerRight: false,
  });

  useKeyPress(
    ['ArrowUp', 'w'],
    (pressed) => (controls.current.accelerate = pressed)
  );
  useKeyPress(
    ['ArrowDown', 's'],
    (pressed) => (controls.current.brake = pressed)
  );
  useKeyPress(
    ['ArrowLeft', 'a'],
    (pressed) => (controls.current.steerLeft = pressed)
  );
  useKeyPress(
    ['ArrowRight', 'd'],
    (pressed) => (controls.current.steerRight = pressed)
  );

  return { controls: controls.current };
}
