/**
 * P31 Language Support for VibeCoder
 * Syntax highlighting and P31-specific features
 *
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 */

import React from 'react';

export const P31LanguageSupport = {
  // P31 keywords
  keywords: [
    'tetrahedron',
    'vertex',
    'edge',
    'mesh',
    'buffer',
    'centaur',
    'scope',
    'node_one',
    'quantum',
    'coherence',
    'entangle',
    'measure',
    'metabolism',
    'spoons',
    'cognitive',
    'intervene',
    'whale_channel',
    'ping',
    'wallet',
    'love',
    'function',
    'let',
    'if',
    'else',
    'for',
    'while',
    'match',
    'try',
    'catch',
    'assert',
    'import',
    'export',
  ],

  // P31 types
  types: [
    'Tetrahedron',
    'Vertex',
    'Edge',
    'Mesh',
    'QuantumState',
    'Metabolism',
    'CognitiveLoad',
    'Message',
    'Task',
    'Note',
    'Transaction',
  ],

  // P31 functions
  functions: [
    'connect',
    'measure_coherence',
    'entangle',
    'measure',
    'consume_spoons',
    'restore_spoons',
    'assess_cognitive_load',
    'send_message',
    'receive_message',
    'whale_channel.send',
    'ping.start',
    'wallet.reward_love_tokens',
  ],

  // Syntax highlighting rules
  highlight: (code: string): string => {
    let highlighted = code;

    // Highlight keywords
    P31LanguageSupport.keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="p31-keyword">${keyword}</span>`);
    });

    // Highlight types
    P31LanguageSupport.types.forEach((type) => {
      const regex = new RegExp(`\\b${type}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="p31-type">${type}</span>`);
    });

    // Highlight functions
    P31LanguageSupport.functions.forEach((func) => {
      const regex = new RegExp(`\\b${func}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="p31-function">${func}</span>`);
    });

    // Highlight strings
    highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="p31-string">"$1"</span>');

    // Highlight numbers
    highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, '<span class="p31-number">$&</span>');

    // Highlight comments
    highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="p31-comment">$&</span>');
    highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="p31-comment">$&</span>');

    return highlighted;
  },
};

// P31 code templates
export const P31Templates = {
  tetrahedron: `tetrahedron my_tetra {
  vertex a: "The Operator";
  vertex b: "The Synthetic Body";
  vertex c: "Node One";
  vertex d: "Node Two";
  
  edge ab: connect(a, b);
  edge ac: connect(a, c);
  edge ad: connect(a, d);
  edge bc: connect(b, c);
  edge bd: connect(b, d);
  edge cd: connect(c, d);
}`,

  metabolism: `let spoons: int = 10;
let max_spoons: int = 20;

function process_with_metabolism(activity: Activity) {
  let load: CognitiveLoad = assess_cognitive_load(activity);
  
  if (load > threshold) {
    intervene(cognitive_prosthetic);
  }
  
  consume_spoons(load.cost);
}`,

  quantum: `let coherence: float = measure_coherence(tetrahedron);
let decay: float = coherence_decay(coherence, rate: 0.1);

entangle(vertex_a, vertex_b) {
  vertex_a.state = vertex_b.state;
}`,

  mesh: `mesh my_mesh {
  tetrahedra: [tetra1, tetra2, tetra3];
  connections: auto_connect();
  validate: enforce_tetrahedron_topology();
}`,
};
