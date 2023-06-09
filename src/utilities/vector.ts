export function cross(a: THREE.Vector2, b: THREE.Vector2, c: THREE.Vector2) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

export function isLeft(a: THREE.Vector2, b: THREE.Vector2, c: THREE.Vector2) {
  return cross(a, b, c) < 0;
}
