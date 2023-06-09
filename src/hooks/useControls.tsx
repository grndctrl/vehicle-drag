import { useEffect, useRef } from 'react';

function useKeyPress(keys: string[], fn: (isDown: boolean) => void) {
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

function useMousePress(buttons: number[], fn: (isDown: boolean) => void) {
  useEffect(() => {
    const handleMouseDown = ({ button }: MouseEvent) =>
      buttons.indexOf(button) !== -1 && fn(true);
    const handleMouseUp = ({ button }: MouseEvent) =>
      buttons.indexOf(button) !== -1 && fn(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
}

export function useControls() {
  const controls = useRef({
    accelerate: false,
    brake: false,
    steerLeft: false,
    steerRight: false,
    mouseDown: false,
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
  useMousePress([0], (pressed) => (controls.current.mouseDown = pressed));

  return { controls: controls.current };
}
