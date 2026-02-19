export const COLORS = {
  phosphor: "#39FF14",
  cyan: "#06B6D4",
  amber: "#F59E0B",
  violet: "#8B5CF6",
  void: "#050508",
  dim: "#666680",
  gold: "#FFD700",
  red: "#ef4444",
} as const;

export const VERTEX_LABELS = [
  { label: "SHELTER", sublabel: "Score your messages", color: COLORS.phosphor, status: "LIVE" },
  { label: "NODE ONE", sublabel: "Hold the thick click", color: COLORS.cyan, status: "DESIGNED" },
  { label: "THE FOLD", sublabel: "Trust the geometry", color: COLORS.amber, status: "COMING SOON" },
  { label: "GENESIS GATE", sublabel: "Infrastructure", color: COLORS.violet, status: "BUILDING" },
] as const;

export const SHELTER_URL = "https://p31ca.org";

export const MAR10_START = new Date("2026-02-18");
export const MAR10_END = new Date("2026-03-11");

export function isMAR10Active(): boolean {
  const now = new Date();
  return now >= MAR10_START && now < MAR10_END;
}
