/**
 * INTENT DECLARATION SYSTEM
 *
 * Purpose: Establish clear, binding intent for sovereignty operations
 * Method: Validate commitment, understanding, and responsibility acceptance
 * Style: Clear, methodical, neurodivergent-friendly
 *
 * "Clear intent is required for binding ritual"
 */
export class IntentDeclaration {
    declarationState: {
        lastValidation: null;
        intentValidated: boolean;
        commitmentLevel: number;
        understandingConfirmed: boolean;
        responsibilityAccepted: boolean;
        consequencesAcknowledged: boolean;
        declarationHistory: never[];
    };
    validationCriteria: {
        purpose: {
            required: boolean;
            acceptablePurposes: string[];
        };
        commitment: {
            required: boolean;
            commitmentLevels: string[];
        };
        responsibility: {
            required: boolean;
            responsibilities: string[];
        };
        consequences: {
            required: boolean;
            consequences: string[];
        };
    };
    /**
     * Validate intent declaration
     * Why: Clear intent is required for binding ritual
     */
    validate(): Promise<{
        passed: boolean;
        details: string;
        validationScore: number;
        intentData: {
            purpose: string;
            commitmentLevel: string;
            understandingLevel: number;
            responsibilityAcknowledgment: number;
            consequenceAwareness: number;
            motivation: number;
            readiness: number;
        };
        commitmentLevel: string;
        understandingConfirmed: boolean;
        responsibilityAccepted: boolean;
        consequencesAcknowledged: boolean;
        timestamp: string;
        error?: undefined;
    } | {
        passed: boolean;
        details: string;
        error: any;
        timestamp: string;
        validationScore?: undefined;
        intentData?: undefined;
        commitmentLevel?: undefined;
        understandingConfirmed?: undefined;
        responsibilityAccepted?: undefined;
        consequencesAcknowledged?: undefined;
    }>;
    /**
     * Gather current intent state
     * Why: We need to assess current commitment and understanding
     */
    gatherIntentData(): Promise<{
        purpose: string;
        commitmentLevel: string;
        understandingLevel: number;
        responsibilityAcknowledgment: number;
        consequenceAwareness: number;
        motivation: number;
        readiness: number;
    }>;
    /**
     * Analyze intent clarity
     * Why: We need to methodically assess the clarity of intent
     */
    analyzeIntentClarity(intentData: any): {
        clarityScore: number;
        message: string;
        issues: {
            category: string;
            issue: string;
            severity: string;
        }[];
        clarityLevel: string;
    };
    /**
     * Validate commitment level
     * Why: Binding commitment is required for sovereignty operations
     */
    validateCommitment(intentData: any): {
        valid: boolean;
        level: any;
        score: number;
        confirmed: boolean;
    };
    /**
     * Validate understanding
     * Why: Full understanding is required for informed consent
     */
    validateUnderstanding(intentData: any): {
        score: number;
        sufficient: boolean;
        confirmed: boolean;
    };
    /**
     * Validate responsibility acceptance
     * Why: Accepting responsibility is fundamental to sovereignty
     */
    validateResponsibility(intentData: any): {
        score: number;
        accepted: boolean;
        acknowledgment: any;
    };
    /**
     * Validate consequence acknowledgment
     * Why: Acknowledging consequences is required for informed decision-making
     */
    validateConsequences(intentData: any): {
        score: number;
        acknowledged: boolean;
        awareness: any;
    };
    /**
     * Calculate overall validation score
     * Why: We need a comprehensive assessment of intent validity
     */
    calculateValidationScore(analysis: any, commitment: any, understanding: any, responsibility: any, consequences: any): number;
    /**
     * Get clarity level description
     * Why: We need clear descriptions of intent clarity
     */
    getClarityLevel(score: any): "CRITICAL" | "EXCELLENT" | "GOOD" | "MODERATE" | "POOR";
    /**
     * Get current intent declaration status
     * Why: We need to track intent validation over time
     */
    getIntentStatus(): {
        intentValidated: boolean;
        commitmentLevel: number;
        understandingConfirmed: boolean;
        responsibilityAccepted: boolean;
        consequencesAcknowledged: boolean;
        lastValidation: null;
        declarationHistory: never[];
    };
    /**
     * Generate intent clarification recommendations
     * Why: We need actionable steps to improve intent clarity
     */
    generateClarificationRecommendations(analysis: any, commitment: any, understanding: any, responsibility: any, consequences: any): {
        category: string;
        priority: string;
        action: string;
        steps: string[];
    }[];
    getMockPurpose(): string;
    getMockCommitmentLevel(): string;
    getMockUnderstandingLevel(): number;
    getMockResponsibilityAcknowledgment(): number;
    getMockConsequenceAwareness(): number;
    getMockMotivation(): number;
    getMockReadiness(): number;
    /**
     * Reset declaration state
     * Why: Sometimes we need to clear accumulated data for fresh validation
     */
    reset(): void;
}
//# sourceMappingURL=intent-declaration.d.ts.map