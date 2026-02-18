/**
 * Kid Blocks — Block definitions and code generation for Family Vibe Coding
 * Birthday-quest blocks (Wonky Cap, Sparkle Star, Tunnel Tube) that generate JavaScript for the game engine.
 * Ages 6–10 friendly. Turtle-style cursor; blocks produce atoms at positions.
 *
 * 💜 With love and light. As above, so below. 💜
 */

/** Block kinds for the Kid Blocks palette */
export type KidBlockKind =
  | 'make_wonky_cap'
  | 'make_sparkle_star'
  | 'make_tunnel_tube'
  | 'repeat'
  | 'color'
  | 'move';

/** Single block instance (with optional params and nested repeat body) */
export interface KidBlock {
  id: string;
  kind: KidBlockKind;
  /** For repeat: number of times (default 2). For move: dx, dy, dz. For color: hex. */
  params?: Record<string, number | string>;
  /** Only for repeat: inner block sequence */
  inner?: KidBlock[];
}

/** Default params per kind */
export const KID_BLOCK_DEFAULTS: Record<KidBlockKind, Record<string, number | string>> = {
  make_wonky_cap: {},
  make_sparkle_star: {},
  make_tunnel_tube: {},
  repeat: { times: 3 },
  color: { hex: '#F9D71C' },
  move: { dx: 1, dy: 0, dz: 0 },
};

/** Human-readable labels and emoji for UI */
export const KID_BLOCK_LABELS: Record<KidBlockKind, { label: string; emoji: string; color: string }> = {
  make_wonky_cap: { label: 'Make Wonky Cap', emoji: '🧢', color: '#A855F7' },
  make_sparkle_star: { label: 'Make Sparkle Star', emoji: '✨', color: '#F9D71C' },
  make_tunnel_tube: { label: 'Make Tunnel Tube', emoji: '🔮', color: '#60A5FA' },
  repeat: { label: 'Repeat', emoji: '🔁', color: '#A78BFA' },
  color: { label: 'Color', emoji: '🎨', color: '#F472B6' },
  move: { label: 'Move', emoji: '➡️', color: '#60A5FA' },
};

/** All block kinds in palette order */
export const KID_BLOCK_KINDS: KidBlockKind[] = [
  'make_wonky_cap',
  'make_sparkle_star',
  'make_tunnel_tube',
  'move',
  'color',
  'repeat',
];

const ELEMENT_BY_KIND: Record<string, string> = {
  make_wonky_cap: 'WNC',
  make_sparkle_star: 'SPK',
  make_tunnel_tube: 'TNL',
};

/**
 * Generate JavaScript from a sequence of kid blocks.
 * Code uses a turtle-style cursor and returns { atoms, bonds } for the game engine.
 * Safe to run in VibeCodingManager's executeJavaScript sandbox (no DOM, no THREE).
 */
export function blocksToCode(blocks: KidBlock[]): string {
  const lines: string[] = [
    "// Generated from Kid Blocks 💜",
    "const cursor = { x: 0, y: 0, z: 0 };",
    "let color = '#F9D71C';",
    "const atoms = [];",
    "const bonds = [];",
    "let atomId = 0;",
    "",
  ];

  function emitBlock(block: KidBlock, indent: string) {
    const p = { ...KID_BLOCK_DEFAULTS[block.kind], ...block.params };
    switch (block.kind) {
      case 'make_wonky_cap':
      case 'make_sparkle_star':
      case 'make_tunnel_tube': {
        const el = ELEMENT_BY_KIND[block.kind] ?? 'WNC';
        lines.push(`${indent}atoms.push({ id: 'kid_'+ (++atomId), element: '${el}', position: { x: cursor.x, y: cursor.y, z: cursor.z }, color });`);
        break;
      }
      case 'move':
        lines.push(`${indent}cursor.x += ${Number(p.dx) ?? 1}; cursor.y += ${Number(p.dy) ?? 0}; cursor.z += ${Number(p.dz) ?? 0};`);
        break;
      case 'color':
        lines.push(`${indent}color = ${JSON.stringify(String(p.hex ?? '#F9D71C'))};`);
        break;
      case 'repeat': {
        const times = Math.max(1, Math.min(20, Number(p.times) ?? 3));
        lines.push(`${indent}for (let __i = 0; __i < ${times}; __i++) {`);
        (block.inner ?? []).forEach((b) => emitBlock(b, indent + '  '));
        lines.push(`${indent}}`);
        break;
      }
      default:
        break;
    }
  }

  blocks.forEach((b) => emitBlock(b, ''));
  lines.push('');
  lines.push('return { atoms, bonds };');
  return lines.join('\n');
}

/**
 * Create a new block instance (for palette drag or add).
 */
export function createBlock(kind: KidBlockKind, overrides?: Partial<KidBlock>): KidBlock {
  return {
    id: `block_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    kind,
    params: { ...KID_BLOCK_DEFAULTS[kind], ...overrides?.params },
    inner: overrides?.inner ?? (kind === 'repeat' ? [] : undefined),
  };
}
