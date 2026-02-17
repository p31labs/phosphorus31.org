/**
 * Research entries — placeholder for incoming landscape analysis.
 * Displayed in FoldView under "THE EVIDENCE".
 */

export interface ResearchEntry {
  domain: 'scientific' | 'legal' | 'funding' | 'regulatory' | 'competitive' | 'georgia';
  title: string;
  source: string;
  url: string;
  date: string;
  relevance: string;
  actionable: boolean;
  notes: string;
}

export const RESEARCH_ENTRIES: ResearchEntry[] = [
  {
    domain: 'scientific',
    title: 'Fisher 2015 — Quantum Cognition',
    source: 'Annals of Physics',
    url: 'https://doi.org/10.1016/j.aop.2015.09.002',
    date: '2015-10',
    relevance: 'Foundation for Posner molecule theory used in P31 architecture',
    actionable: false,
    notes: 'The paper that started it all. Ca9(PO4)6 as biological qubit.',
  },
];
