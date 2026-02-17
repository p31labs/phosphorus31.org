/**
 * COGNITIVE LOAD ASSESSOR
 *
 * Purpose: Measure and optimize cognitive resources for sovereignty
 * Method: Monitor attention, memory, and processing capacity
 * Style: Clear, methodical, neurodivergent-friendly
 *
 * "Clear thinking is required for Mesh integration"
 */
export class CognitiveLoadAssessor {
    assessmentState: {
        lastAssessment: null;
        cognitiveProfile: null;
        loadScore: number;
        capacityReserves: number;
        attentionMetrics: {};
        workingMemoryMetrics: {};
        processingMetrics: {};
    };
    cognitiveThresholds: {
        spoons: {
            minimum: number;
            optimal: number;
            maximum: number;
            units: string;
        };
        focusLevel: {
            minimum: number;
            optimal: number;
            maximum: number;
            units: string;
        };
        workingMemory: {
            minimum: number;
            optimal: number;
            maximum: number;
            units: string;
        };
        reactionTime: {
            minimum: number;
            optimal: number;
            maximum: number;
            units: string;
        };
        decisionFatigue: {
            minimum: number;
            optimal: number;
            maximum: number;
            units: string;
        };
        stressLevel: {
            minimum: number;
            optimal: number;
            maximum: number;
            units: string;
        };
    };
    /**
     * Measure cognitive load and capacity
     * Why: Clear thinking is required before Mesh integration
     */
    measure(): Promise<{
        passed: boolean;
        details: string;
        loadScore: number;
        capacityReserves: number;
        cognitiveProfile: {
            currentSpoons: number;
            spoonReserves: number;
            spoonDrainRate: number;
            focusLevel: number;
            attentionSpan: number;
            distractionFrequency: number;
            workingMemoryCapacity: number;
            memoryRetention: number;
            recallSpeed: number;
            reactionTime: number;
            processingSpeed: number;
            decisionAccuracy: number;
            stressLevel: number;
            decisionFatigue: number;
            mentalClarity: number;
            emotionalStability: number;
        };
        attentionMetrics: {
            load: number;
            focusLevel: any;
            attentionSpan: any;
            distractions: any;
        };
        workingMemoryMetrics: {
            load: number;
            capacity: any;
            retention: any;
            recallSpeed: any;
        };
        processingMetrics: {
            load: number;
            reactionTime: any;
            processingSpeed: any;
            decisionAccuracy: any;
        };
        timestamp: string;
        error?: undefined;
    } | {
        passed: boolean;
        details: string;
        error: any;
        timestamp: string;
        loadScore?: undefined;
        capacityReserves?: undefined;
        cognitiveProfile?: undefined;
        attentionMetrics?: undefined;
        workingMemoryMetrics?: undefined;
        processingMetrics?: undefined;
    }>;
    /**
     * Gather current cognitive data
     * Why: We need real-time cognitive metrics for accurate assessment
     */
    gatherCognitiveData(): Promise<{
        currentSpoons: number;
        spoonReserves: number;
        spoonDrainRate: number;
        focusLevel: number;
        attentionSpan: number;
        distractionFrequency: number;
        workingMemoryCapacity: number;
        memoryRetention: number;
        recallSpeed: number;
        reactionTime: number;
        processingSpeed: number;
        decisionAccuracy: number;
        stressLevel: number;
        decisionFatigue: number;
        mentalClarity: number;
        emotionalStability: number;
    }>;
    /**
     * Analyze cognitive load
     * Why: We need to methodically assess all cognitive functions
     */
    analyzeCognitiveLoad(cognitiveData: any): {
        loadScore: number;
        message: string;
        attentionMetrics: {
            load: number;
            focusLevel: any;
            attentionSpan: any;
            distractions: any;
        };
        workingMemoryMetrics: {
            load: number;
            capacity: any;
            retention: any;
            recallSpeed: any;
        };
        processingMetrics: {
            load: number;
            reactionTime: any;
            processingSpeed: any;
            decisionAccuracy: any;
        };
        stressMetrics: {
            load: number;
            stressLevel: any;
            decisionFatigue: any;
            mentalClarity: any;
            emotionalStability: any;
        };
    };
    /**
     * Calculate attention load
     * Why: Attention is a critical resource for sovereignty tasks
     */
    calculateAttentionLoad(cognitiveData: any): number;
    /**
     * Calculate memory load
     * Why: Working memory is essential for complex sovereignty operations
     */
    calculateMemoryLoad(cognitiveData: any): number;
    /**
     * Calculate processing load
     * Why: Processing speed affects sovereignty task performance
     */
    calculateProcessingLoad(cognitiveData: any): number;
    /**
     * Calculate stress load
     * Why: Stress directly impacts cognitive performance
     */
    calculateStressLoad(cognitiveData: any): number;
    /**
     * Calculate cognitive capacity reserves
     * Why: We need to know available cognitive resources
     */
    calculateCapacityReserves(analysis: any): number;
    /**
     * Get current cognitive load status
     * Why: We need to track cognitive state over time
     */
    getCognitiveStatus(): {
        loadScore: number;
        capacityReserves: number;
        lastAssessment: null;
        cognitiveProfile: null;
        attentionMetrics: {};
        workingMemoryMetrics: {};
        processingMetrics: {};
    };
    /**
     * Generate cognitive optimization recommendations
     * Why: We need actionable steps to improve cognitive clarity
     */
    generateOptimizationRecommendations(analysis: any): {
        domain: string;
        priority: string;
        action: string;
        steps: string[];
    }[];
    getMockCurrentSpoons(): number;
    getMockSpoonReserves(): number;
    getMockSpoonDrainRate(): number;
    getMockFocusLevel(): number;
    getMockAttentionSpan(): number;
    getMockDistractionFrequency(): number;
    getMockWorkingMemoryCapacity(): number;
    getMockMemoryRetention(): number;
    getMockRecallSpeed(): number;
    getMockReactionTime(): number;
    getMockProcessingSpeed(): number;
    getMockDecisionAccuracy(): number;
    getMockStressLevel(): number;
    getMockDecisionFatigue(): number;
    getMockMentalClarity(): number;
    getMockEmotionalStability(): number;
    /**
     * Reset assessment state
     * Why: Sometimes we need to clear accumulated data for fresh assessment
     */
    reset(): void;
}
//# sourceMappingURL=cognitive-load-assessor.d.ts.map