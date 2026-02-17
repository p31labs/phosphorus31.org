/**
 * Grant pipeline — internal data for Scope or future admin view.
 * Populated after landscape analysis.
 */

export interface GrantOpportunity {
  name: string;
  agency: string;
  url: string;
  deadline: string;
  amount: string;
  relevance: string;
  status: 'researching' | 'preparing' | 'submitted' | 'awarded' | 'declined';
}

export const GRANT_PIPELINE: GrantOpportunity[] = [];
