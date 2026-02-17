/**
 * FLOATING NEUTRAL DETECTOR
 *
 * Purpose: Detect when sovereignty grounding is compromised
 * Method: Monitor biological and cognitive stability indicators
 * Style: Clear, methodical, neurodivergent-friendly
 *
 * "Floating Neutral: When the external world loses its reference ground"
 */
export class FloatingNeutralDetector {
    detectorState: {
        lastCheck: null;
        stabilityHistory: never[];
        groundingStatus: string;
        riskFactors: never[];
    };
    thresholds: {
        calcium: {
            minimum: number;
            optimal: number;
            maximum: number;
        };
        spoons: {
            minimum: number;
            optimal: number;
            maximum: number;
        };
        stress: {
            maximum: number;
            optimal: number;
            minimum: number;
        };
        focus: {
            minimum: number;
            optimal: number;
            maximum: number;
        };
    };
    /**
     * Check for Floating Neutral conditions
     * Why: We need to detect when external chaos compromises internal stability
     */
    check(): Promise<{
        passed: boolean;
        status: string;
        details: string;
        issues: {
            type: string;
            factor: string;
            severity: string;
            value: any;
            threshold: number;
            description: string;
        }[];
        warnings: {
            type: string;
            factor: string;
            severity: string;
            value: any;
            description: string;
        }[];
        riskFactors: never[];
        timestamp: string;
    } | {
        passed: boolean;
        details: string;
        error: any;
        timestamp: string;
    }>;
    /**
     * Gather biological stability data
     * Why: Biological stability is the foundation of digital sovereignty
     */
    gatherBiologicalData(): Promise<{
        calciumLevel: number;
        heartRate: number;
        respiratoryRate: number;
        galvanicSkinResponse: number;
        bodyTemperature: number;
    }>;
    /**
     * Gather cognitive stability data
     * Why: Cognitive clarity is required for sovereignty maintenance
     */
    gatherCognitiveData(): Promise<{
        spoonReserves: number;
        focusLevel: number;
        reactionTime: number;
        workingMemory: number;
        decisionFatigue: number;
    }>;
    /**
     * Gather environmental stability data
     * Why: External chaos can cause Floating Neutral conditions
     */
    gatherEnvironmentalData(): Promise<{
        stressLevel: number;
        externalChaos: number;
        communicationVolume: number;
        financialPressure: number;
        socialStability: number;
    }>;
    /**
     * Analyze data for Floating Neutral indicators
     * Why: We need to methodically identify when grounding is compromised
     */
    analyzeFloatingNeutral(biologicalData: any, cognitiveData: any, environmentalData: any): {
        passed: boolean;
        status: string;
        details: string;
        issues: {
            type: string;
            factor: string;
            severity: string;
            value: any;
            threshold: number;
            description: string;
        }[];
        warnings: {
            type: string;
            factor: string;
            severity: string;
            value: any;
            description: string;
        }[];
        riskFactors: never[];
        timestamp: string;
    };
    /**
     * Get mock calcium level (for development)
     * Why: We need realistic biological data for testing
     */
    getMockCalciumLevel(): number;
    /**
     * Get mock heart rate
     * Why: Heart rate indicates biological stress levels
     */
    getMockHeartRate(): number;
    /**
     * Get mock respiratory rate
     * Why: Breathing patterns indicate stress and stability
     */
    getMockRespiratoryRate(): number;
    /**
     * Get mock galvanic skin response
     * Why: GSR indicates emotional and stress states
     */
    getMockGalvanicSkinResponse(): number;
    /**
     * Get mock body temperature
     * Why: Temperature affects cognitive function
     */
    getMockBodyTemperature(): number;
    /**
     * Get mock spoon reserves
     * Why: Spoon theory measures cognitive energy reserves
     */
    getMockSpoonReserves(): number;
    /**
     * Get mock focus level
     * Why: Focus is required for sovereignty operations
     */
    getMockFocusLevel(): number;
    /**
     * Get mock reaction time
     * Why: Reaction time indicates cognitive processing speed
     */
    getMockReactionTime(): number;
    /**
     * Get mock working memory capacity
     * Why: Working memory is essential for complex sovereignty tasks
     */
    getMockWorkingMemory(): number;
    /**
     * Get mock decision fatigue level
     * Why: Decision fatigue compromises sovereignty maintenance
     */
    getMockDecisionFatigue(): number;
    /**
     * Get mock stress level
     * Why: Stress directly impacts sovereignty grounding
     */
    getMockStressLevel(): number;
    /**
     * Get mock external chaos level
     * Why: External chaos can cause Floating Neutral conditions
     */
    getMockExternalChaos(): number;
    /**
     * Get mock communication volume
     * Why: High communication volume can overwhelm sovereignty systems
     */
    getMockCommunicationVolume(): number;
    /**
     * Get mock financial pressure level
     * Why: Financial stress can compromise sovereignty grounding
     */
    getMockFinancialPressure(): number;
    /**
     * Get mock social stability level
     * Why: Social instability affects sovereignty grounding
     */
    getMockSocialStability(): number;
    /**
     * Get current grounding status
     * Why: We need to track sovereignty grounding over time
     */
    getGroundingStatus(): {
        status: string;
        lastCheck: null;
        riskFactors: never[];
        stabilityHistory: never[];
    };
    /**
     * Reset detector state
     * Why: Sometimes we need to clear accumulated data for fresh analysis
     */
    reset(): void;
}
//# sourceMappingURL=floating-neutral-detector.d.ts.map