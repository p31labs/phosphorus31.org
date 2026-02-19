/**
 * MoleculeHubView — One place for all molecule builder experiences.
 * Bonding game, Studio (clock + world), 3D Molecule Builder, P31 Viewer.
 * "I want it all."
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const BRAND = {
  green: '#00FF88',
  cyan: '#00D4FF',
  amber: '#FFB800',
  magenta: '#FF00CC',
  violet: '#7A27FF',
  void: '#050510',
  surface2: '#12122E',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
} as const;

const CARDS = [
  {
    id: 'bonding',
    title: 'Bonding',
    subtitle: 'Turn-based molecule game',
    description: 'Create or join a game. Place atoms, form bonds, send pings. Earn L.O.V.E.',
    route: '/bonding',
    emoji: '🔗',
    color: BRAND.amber,
  },
  {
    id: 'studio',
    title: 'Studio',
    subtitle: 'Clock & World Builder',
    description: 'Quantum Grandfather–Cuckoo Clock. Build geodesic structures in 3D.',
    route: '/studio',
    emoji: '🎨',
    color: BRAND.violet,
  },
  {
    id: 'builder',
    title: '3D Molecule Builder',
    subtitle: 'Posner & coherence',
    description: 'Build Ca₉(PO₄)₆ and P31 molecules. Save, load, coherence meter, 4D playground.',
    route: '/molecule/builder',
    emoji: '🧬',
    color: BRAND.green,
  },
  {
    id: 'viewer',
    title: 'P31 Viewer',
    subtitle: 'Tetrahedron & mesh',
    description: 'Tetrahedron topology. Operator, Synthetic Body, P31 NodeZero, Node Two.',
    route: '/molecule/viewer',
    emoji: '🔺',
    color: BRAND.cyan,
  },
] as const;

export function MoleculeHubView(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <h1
        style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 11,
          letterSpacing: 6,
          color: BRAND.green,
          marginBottom: 8,
        }}
      >
        MOLECULE — ALL OF IT
      </h1>
      <p style={{ fontSize: 13, color: BRAND.muted, marginBottom: 32 }}>
        Pick one. Bonding game, Studio, 3D builder, or P31 tetrahedron viewer.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 20,
        }}
      >
        {CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => navigate(card.route)}
            style={{
              textAlign: 'left',
              padding: 24,
              background: BRAND.surface2,
              border: `1px solid ${card.color}40`,
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'border-color 0.2s, transform 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = card.color;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${card.color}40`;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            aria-label={`Open ${card.title}: ${card.subtitle}`}
          >
            <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>{card.emoji}</span>
            <span
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 10,
                letterSpacing: 2,
                color: card.color,
                display: 'block',
                marginBottom: 4,
              }}
            >
              {card.title}
            </span>
            <span style={{ fontSize: 9, color: BRAND.dim, display: 'block', marginBottom: 12 }}>
              {card.subtitle}
            </span>
            <p style={{ fontSize: 11, color: BRAND.text, lineHeight: 1.5, margin: 0 }}>
              {card.description}
            </p>
          </button>
        ))}
      </div>

      <p style={{ fontSize: 10, color: BRAND.dim, marginTop: 32, fontStyle: 'italic' }}>
        The mesh holds. As above, so below. 🔺
      </p>
    </div>
  );
}
