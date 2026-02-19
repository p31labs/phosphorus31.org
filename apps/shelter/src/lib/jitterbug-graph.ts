/**
 * Jitterbug navigation — DAG for IVM-style fractal tetrahedron.
 * Each node has 0–4 children. Never more than four choices at a time.
 */

import type { Tab } from "@/stores/shelter-store";

export type NodeAction = { type: "tab"; tab: Tab } | { type: "sub" };

export interface JitterbugNode {
  id: string;
  label: string;
  icon: string;
  children: JitterbugNode[];
  action?: NodeAction;
}

/** Root tetrahedron: Buffer, Body, Connect, Self (Hull, Engine, Crew, Void). */
export const ROOT_GRAPH: JitterbugNode[] = [
  {
    id: "buffer",
    label: "Buffer",
    icon: "⬡",
    children: [
      { id: "buffer-score", label: "Score", icon: "📊", children: [], action: { type: "tab", tab: "buffer" } },
      { id: "buffer-rewrite", label: "Rewrite", icon: "✎", children: [], action: { type: "tab", tab: "buffer" } },
      { id: "buffer-defer", label: "Defer", icon: "⏸", children: [], action: { type: "tab", tab: "buffer" } },
      { id: "buffer-queue", label: "Queue", icon: "📋", children: [], action: { type: "tab", tab: "buffer" } },
    ],
    action: { type: "tab", tab: "buffer" },
  },
  {
    id: "body",
    label: "Body",
    icon: "🌊",
    children: [
      { id: "body-breathe", label: "Breathe", icon: "🌊", children: [], action: { type: "tab", tab: "breathe" } },
      { id: "body-calibrate", label: "Calibrate", icon: "🥄", children: [], action: { type: "tab", tab: "settings" } },
      { id: "body-checkin", label: "Check-in", icon: "✓", children: [], action: { type: "tab", tab: "stats" } },
      { id: "body-rest", label: "Rest", icon: "◇", children: [], action: { type: "tab", tab: "breathe" } },
    ],
    action: { type: "tab", tab: "breathe" },
  },
  {
    id: "connect",
    label: "Connect",
    icon: ">>",
    children: [
      { id: "connect-tandem", label: "Tandem", icon: ">>", children: [], action: { type: "tab", tab: "tandem" } },
      { id: "connect-quests", label: "Quests", icon: "📋", children: [], action: { type: "tab", tab: "quests" } },
      { id: "connect-stats", label: "Stats", icon: "📊", children: [], action: { type: "tab", tab: "stats" } },
      { id: "connect-brain", label: "Brain", icon: "🧠", children: [], action: { type: "tab", tab: "brain" } },
    ],
    action: { type: "tab", tab: "tandem" },
  },
  {
    id: "self",
    label: "Self",
    icon: "◇",
    children: [
      { id: "self-brain", label: "Brain", icon: "🧠", children: [], action: { type: "tab", tab: "brain" } },
      { id: "self-stats", label: "Stats", icon: "📊", children: [], action: { type: "tab", tab: "stats" } },
      { id: "self-settings", label: "Settings", icon: "⚙️", children: [], action: { type: "tab", tab: "settings" } },
      { id: "self-quests", label: "Quests", icon: "📋", children: [], action: { type: "tab", tab: "quests" } },
    ],
    action: { type: "tab", tab: "brain" },
  },
];

/**
 * Kids "Show me your shape" — feeling-based tetrahedron.
 * Same navigation; different graph. Geometric drill-down by feeling.
 */
export const FEELING_GRAPH: JitterbugNode[] = [
  {
    id: "mad",
    label: "Mad",
    icon: "😤",
    children: [
      { id: "mad-hungry", label: "Hungry", icon: "🍽", children: [], action: { type: "tab", tab: "buffer" } },
      { id: "mad-tired", label: "Tired", icon: "😴", children: [], action: { type: "tab", tab: "breathe" } },
      { id: "mad-overwhelmed", label: "Overwhelmed", icon: "🌀", children: [], action: { type: "tab", tab: "breathe" } },
      { id: "mad-unfair", label: "Unfair", icon: "⚖", children: [], action: { type: "tab", tab: "brain" } },
    ],
    action: { type: "sub" },
  },
  {
    id: "sad",
    label: "Sad",
    icon: "😢",
    children: [
      { id: "sad-miss", label: "Miss someone", icon: "💜", children: [], action: { type: "tab", tab: "tandem" } },
      { id: "sad-lonely", label: "Lonely", icon: "🌙", children: [], action: { type: "tab", tab: "tandem" } },
      { id: "sad-bored", label: "Bored", icon: "📋", children: [], action: { type: "tab", tab: "quests" } },
      { id: "sad-hurt", label: "Hurt", icon: "🩹", children: [], action: { type: "tab", tab: "breathe" } },
    ],
    action: { type: "sub" },
  },
  {
    id: "scared",
    label: "Scared",
    icon: "😰",
    children: [
      { id: "scared-new", label: "Something new", icon: "🆕", children: [], action: { type: "tab", tab: "breathe" } },
      { id: "scared-dark", label: "Dark", icon: "🌑", children: [], action: { type: "tab", tab: "breathe" } },
      { id: "scared-loud", label: "Too loud", icon: "🔊", children: [], action: { type: "tab", tab: "breathe" } },
      { id: "scared-sick", label: "Not feeling well", icon: "🤒", children: [], action: { type: "tab", tab: "breathe" } },
    ],
    action: { type: "sub" },
  },
  {
    id: "okay",
    label: "Okay",
    icon: "😊",
    children: [
      { id: "okay-happy", label: "Happy", icon: "✨", children: [], action: { type: "tab", tab: "quests" } },
      { id: "okay-calm", label: "Calm", icon: "🌊", children: [], action: { type: "tab", tab: "breathe" } },
      { id: "okay-excited", label: "Excited", icon: "🎉", children: [], action: { type: "tab", tab: "quests" } },
      { id: "okay-curious", label: "Curious", icon: "🧠", children: [], action: { type: "tab", tab: "brain" } },
    ],
    action: { type: "sub" },
  },
];

export const ROOT_NODE_ID = "root";

/** Get the four nodes to display at the current level. */
export function getNodesAt(
  graph: JitterbugNode[],
  currentNodeId: string | null
): JitterbugNode[] {
  if (!currentNodeId || currentNodeId === ROOT_NODE_ID) return graph;
  const found = findNode(graph, currentNodeId);
  return found?.children ?? graph;
}

function findNode(nodes: JitterbugNode[], id: string): JitterbugNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    const inChild = findNode(n.children, id);
    if (inChild) return inChild;
  }
  return null;
}

/** Get parent node id for back navigation. Root-level nodes have parent "root". */
export function getParentId(
  graph: JitterbugNode[],
  currentNodeId: string | null
): string | null {
  if (!currentNodeId || currentNodeId === ROOT_NODE_ID) return null;
  return findParent(graph, ROOT_NODE_ID, currentNodeId);
}

function findParent(
  nodes: JitterbugNode[],
  parentId: string,
  targetId: string
): string | null {
  for (const n of nodes) {
    if (n.id === targetId) return parentId;
    const inChild = findParent(n.children, n.id, targetId);
    if (inChild !== null) return inChild;
  }
  return null;
}
