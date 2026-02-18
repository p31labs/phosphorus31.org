import type { PAMatch } from "./types";

/** Urgency axis patterns */
export const U_HIGH: readonly RegExp[] = [
  /\basap\b/i, /\burgent/i, /\bimmediately\b/i, /\bdeadline/i,
  /\bnow\b/i, /\bcritical/i, /\bemergency/i, /\bfinal notice/i,
  /\blast chance/i, /\btoday\b/i,
];

export const U_MED: readonly RegExp[] = [
  /\bsoon\b/i, /\bthis week/i, /\breminder/i, /\bfollow.?up/i,
  /\bpriority/i, /\bimportant/i,
];

export const U_LOW: readonly RegExp[] = [
  /\bfyi\b/i, /\bno rush/i, /\bwhen(ever)? you can/i, /\bjust wanted/i,
];

/** Emotional axis patterns */
export const E_HIGH: readonly RegExp[] = [
  /\bdisappointed/i, /\bfrustrat/i, /\bangry/i, /per my last/i,
  /\bas I (already|previously)/i, /\bunaccept/i, /!{2,}/,
  /\bconcern(ed|ing)/i, /\bnot sure (why|how)/i,
];

export const E_MED: readonly RegExp[] = [
  /\bconfus/i, /\bworried/i, /\bupset/i, /\bneed to talk/i,
  /\bhonestly\b/i, /\bfrankly\b/i,
];

export const E_LOW: readonly RegExp[] = [
  /\bthanks?\b/i, /\bgreat\b/i, /\bappreciate/i, /\bno worries/i,
];

/** Cognitive axis patterns */
export const C_HIGH: readonly RegExp[] = [
  /\d+\s*(item|point|thing|step|question)/i, /\battach/i,
  /\bspreadsheet/i, /\breview (the|this)/i, /\bcomplex/i,
  /\blegal/i, /\bcontract/i,
];

export const C_MED: readonly RegExp[] = [
  /\bdecision/i, /\bchoose/i, /\boption/i, /\bschedul/i, /\bavailab/i,
];

export const C_LOW: readonly RegExp[] = [
  /\byes\b/i, /\bno\b/i, /\bok\b/i, /\bsounds good/i, /\bconfirm/i,
];

/** Passive-aggressive pattern definitions */
export const PA_PATTERNS: readonly { pattern: RegExp; translation: string }[] = [
  { pattern: /per my last (email|message)/i, translation: "Referencing a previous message you may have missed" },
  { pattern: /as (previously|already) (stated|mentioned|discussed)/i, translation: "They believe this was covered before" },
  { pattern: /going forward/i, translation: "They want to change the approach" },
  { pattern: /just to clarify/i, translation: "They feel there's a misunderstanding" },
  { pattern: /I('m| am) not sure (why|how|what)/i, translation: "Confused or disagrees" },
  { pattern: /with all due respect/i, translation: "They disagree with you" },
  { pattern: /please (advise|confirm|clarify)/i, translation: "They need a response" },
  { pattern: /friendly reminder/i, translation: "They've asked before and want action" },
  { pattern: /I('ll| will) (just )?go ahead and/i, translation: "Planning to act without your input" },
  { pattern: /correct me if I('m| am) wrong/i, translation: "They believe they are right" },
  { pattern: /thanks in advance/i, translation: "They expect you to do this" },
  { pattern: /not sure if you (saw|got|received)/i, translation: "They think you ignored them" },
  { pattern: /hope(fully)? this helps/i, translation: "May feel you should already know" },
  { pattern: /as per (the |my )?(policy|handbook|agreement)/i, translation: "Citing rules to support their position" },
];

/** Detect passive-aggressive patterns in text */
export function detectPassiveAggressive(text: string): readonly PAMatch[] {
  return PA_PATTERNS
    .filter((p) => p.pattern.test(text))
    .map((p) => ({ pattern: p.pattern.source, translation: p.translation }));
}
