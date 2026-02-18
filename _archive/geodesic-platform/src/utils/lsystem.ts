/**
 * L-system turtle graphics — produces vertices and edges from axiom + rules.
 */
export function generateLSystem(
  axiom: string,
  iterations: number,
  angleDeg: number
): { vertices: number[]; edges: number[] } {
  const rules: Record<string, string> = {
    F: 'F+F--F+F',
    X: 'F+[[X]-X]-F[-FX]+X',
    Y: 'YF+XF+Y',
  };
  let current = axiom;
  for (let i = 0; i < iterations; i++) {
    let next = '';
    for (const ch of current) {
      next += rules[ch] ?? ch;
    }
    current = next;
  }

  const vertices: number[] = [];
  const edges: number[] = [];
  let x = 0,
    y = 0,
    z = 0;
  let dir = 0;
  const stack: { x: number; y: number; z: number; dir: number }[] = [];
  vertices.push(x, y, z);
  let lastIdx = 0;

  for (const ch of current) {
    switch (ch) {
      case 'F':
      case 'G': {
        const rad = (dir * Math.PI) / 180;
        const newX = x + Math.sin(rad);
        const newY = y + Math.cos(rad);
        const newZ = z;
        vertices.push(newX, newY, newZ);
        const newIdx = vertices.length / 3 - 1;
        edges.push(lastIdx, newIdx);
        x = newX;
        y = newY;
        z = newZ;
        lastIdx = newIdx;
        break;
      }
      case '+':
        dir += angleDeg;
        break;
      case '-':
        dir -= angleDeg;
        break;
      case '[':
        stack.push({ x, y, z, dir });
        break;
      case ']': {
        const state = stack.pop();
        if (state) {
          x = state.x;
          y = state.y;
          z = state.z;
          dir = state.dir;
          vertices.push(x, y, z);
          lastIdx = vertices.length / 3 - 1;
        }
        break;
      }
    }
  }
  return { vertices, edges };
}
