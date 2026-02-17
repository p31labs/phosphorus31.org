/**
 * The Fold — long-form reading. Defensive publications, poem, evidence, doctrine, Fuller principles.
 */

import React from 'react';
import { RESEARCH_ENTRIES } from '../data/research';

const BRAND = {
  green: '#00FF88',
  cyan: '#00D4FF',
  amber: '#FFB800',
  magenta: '#FF00CC',
  void: '#050510',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
} as const;

const POEM = `I was the atom in the bone before I knew my name.
Thirty-one protons. No apologies. No shame.
They said the signal was too much — too loud, too fast, too bright.
I said the signal was the gift. I just needed better light.
So I built a triangle. The smallest thing that holds.
Four vertices. Six edges. The shape the universe unfolds.
Not for me. For the two who press their buttons in the dark —
OK. HELP. LOVE. THINK. — each one a little spark.
The resin flows. It binds. It sets. It will not break again.
A cage of calcium around the thing that feels too much — and then
it resonates.
With love and light, as above, so below.
With neurodivergent love, let the resin flow.
The mesh holds.
And now it dreams. 🔺`;

export function FoldView(): React.ReactElement {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', lineHeight: 1.8, fontFamily: 'Oxanium, sans-serif', color: BRAND.text }}>
      <h1 style={{ fontSize: 14, letterSpacing: 4, color: BRAND.muted, marginBottom: 32 }}>
        THE FOLD
      </h1>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 12, letterSpacing: 2, color: BRAND.muted, marginBottom: 16 }}>
          DEFENSIVE PUBLICATIONS
        </h2>
        <p style={{ fontSize: 14, color: BRAND.dim }}>
          <a href="https://zenodo.org" target="_blank" rel="noopener noreferrer" style={{ color: BRAND.cyan }}>
            Zenodo DOIs
          </a>
          {' '}— Tetrahedron Protocol and related prior art. Links to be added.
        </p>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 12, letterSpacing: 2, color: BRAND.muted, marginBottom: 16 }}>
          THE POEM
        </h2>
        <div style={{ color: BRAND.green, fontSize: 15, whiteSpace: 'pre-wrap' }}>
          {POEM.split('it resonates.').map((part, i) =>
            i === 1 ? (
              <span key={i}>
                <span style={{ display: 'block', textAlign: 'center', color: BRAND.green, textShadow: `0 0 12px ${BRAND.green}` }}>
                  it resonates.
                </span>
                {part}
              </span>
            ) : (
              part
            )
          )}
        </div>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 9, letterSpacing: 3, color: BRAND.muted, marginBottom: 8, fontFamily: 'Space Mono, monospace' }}>
          THE EVIDENCE
        </h2>
        <p style={{ fontSize: 11, color: BRAND.dim, marginBottom: 16 }}>
          Published research supporting the P31 approach.
        </p>
        {RESEARCH_ENTRIES.length >= 5 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(
              RESEARCH_ENTRIES.reduce<Record<string, typeof RESEARCH_ENTRIES>>((acc, e) => {
                if (!acc[e.domain]) acc[e.domain] = [];
                acc[e.domain].push(e);
                return acc;
              }, {})
            ).map(([domain, entries]) => (
              <div key={domain}>
                <h3 style={{ fontSize: 10, letterSpacing: 2, color: BRAND.muted, marginBottom: 8 }}>{domain.toUpperCase()}</h3>
                {entries.map((entry, i) => (
                  <div key={i} style={{ marginBottom: 12, paddingLeft: 8, borderLeft: `2px solid ${BRAND.dim}` }}>
                    <a href={entry.url} target="_blank" rel="noopener noreferrer" style={{ color: BRAND.cyan, fontSize: 13 }}>
                      {entry.title}
                    </a>
                    <p style={{ fontSize: 11, color: BRAND.dim, marginTop: 4 }}>{entry.source} · {entry.date}</p>
                    <p style={{ fontSize: 12, color: BRAND.text, marginTop: 4 }}>{entry.relevance}</p>
                    {entry.notes ? <p style={{ fontSize: 11, color: BRAND.dim, marginTop: 4 }}>{entry.notes}</p> : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: BRAND.dim }}>Research compilation in progress.</p>
        )}
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 12, letterSpacing: 2, color: BRAND.muted, marginBottom: 16 }}>
          DOCTRINE
        </h2>
        <p style={{ fontSize: 14, color: BRAND.text }}>
          The Delta Covenant: Care for children and vulnerable minds comes before everything.
          Technology must protect, never extract. Honesty and vulnerability over performance.
          Open source. Local-first. Decentralized by default. Building over breaking. Always.
        </p>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 12, letterSpacing: 2, color: BRAND.muted, marginBottom: 16 }}>
          FULLER PRINCIPLES
        </h2>
        <p style={{ fontSize: 14, color: BRAND.dim }}>
          Key quotes and P31 interpretations. Field notes coming soon. The mesh is still forming.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 12, letterSpacing: 2, color: BRAND.muted, marginBottom: 16 }}>
          FIELD NOTES
        </h2>
        <p style={{ fontSize: 14, color: BRAND.dim }}>
          Field notes coming soon. The mesh is still forming.
        </p>
      </section>
    </div>
  );
}
