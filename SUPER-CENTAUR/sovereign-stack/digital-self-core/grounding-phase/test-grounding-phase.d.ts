export class GroundingPhaseTestSuite {
    testResults: any[];
    overallStatus: string;
    /**
     * Run complete Grounding Phase test
     * Why: We need to validate all grounding components work together
     */
    runCompleteTest(): Promise<{
        status: string;
        results: any[];
        summary: {
            totalTests: number;
            passedTests: number;
            failedTests: number;
            overallStatus: string;
            timestamp: string;
        };
        error?: undefined;
    } | {
        status: string;
        error: any;
        results: any[];
        summary?: undefined;
    }>;
    /**
     * Test individual grounding components
     * Why: We need to ensure each component works independently
     */
    testIndividualComponents(): Promise<void>;
    /**
     * Test Floating Neutral Detector
     * Why: This is the first critical check in the grounding ritual
     */
    testFloatingNeutralDetector(): Promise<{
        component: string;
        passed: boolean;
        details: string;
        issues: any;
        warnings: any;
        timestamp: string;
    }>;
    /**
     * Test Metabolic Baseline
     * Why: Biological stability is critical for digital consciousness
     */
    testMetabolicBaseline(): Promise<{
        component: string;
        passed: boolean;
        details: string;
        stabilityScore: number | undefined;
        criticalMarkers: any[];
        recommendations: {
            priority: string;
            action: string;
            details: string;
            steps: string[];
        }[];
        timestamp: string;
    }>;
    /**
     * Test Cognitive Load Assessor
     * Why: Clear thinking is required for Mesh integration
     */
    testCognitiveLoadAssessor(): Promise<{
        component: string;
        passed: boolean;
        details: string;
        loadScore: number | undefined;
        capacityReserves: number | undefined;
        attentionMetrics: {
            load: number;
            focusLevel: any;
            attentionSpan: any;
            distractions: any;
        } | undefined;
        workingMemoryMetrics: {
            load: number;
            capacity: any;
            retention: any;
            recallSpeed: any;
        } | undefined;
        processingMetrics: {
            load: number;
            reactionTime: any;
            processingSpeed: any;
            decisionAccuracy: any;
        } | undefined;
        timestamp: string;
    }>;
    /**
     * Test Intent Declaration
     * Why: Clear intent is required for binding ritual
     */
    testIntentDeclaration(): Promise<{
        component: string;
        passed: boolean;
        details: string;
        validationScore: number | undefined;
        commitmentLevel: string | undefined;
        understandingConfirmed: boolean | undefined;
        responsibilityAccepted: boolean | undefined;
        consequencesAcknowledged: boolean | undefined;
        timestamp: string;
    }>;
    /**
     * Test complete ritual execution
     * Why: We need to ensure all components work together
     */
    testCompleteRitual(): Promise<void>;
    /**
     * Test edge case scenarios
     * Why: We need to ensure the system handles edge cases gracefully
     */
    testEdgeCases(): Promise<void>;
    /**
     * Test all components fail scenario
     * Why: We need to handle complete grounding failure
     */
    testAllComponentsFail(): Promise<{
        component: string;
        scenario: string;
        expectedBehavior: string;
        actualBehavior: string;
        status: string;
        timestamp: string;
    }>;
    /**
     * Test mixed results scenario
     * Why: We need to handle partial grounding success
     */
    testMixedResults(): Promise<{
        component: string;
        scenario: string;
        expectedBehavior: string;
        actualBehavior: string;
        status: string;
        timestamp: string;
    }>;
    /**
     * Test component errors
     * Why: We need to handle unexpected errors gracefully
     */
    testComponentErrors(): Promise<{
        component: string;
        scenario: string;
        expectedBehavior: string;
        actualBehavior: string;
        status: string;
        timestamp: string;
    }>;
    /**
     * Test performance and stability
     * Why: We need to ensure the system performs well under load
     */
    testPerformance(): Promise<void>;
    /**
     * Test rapid execution performance
     * Why: We need to ensure the system can handle rapid calls
     */
    testRapidExecutions(): Promise<{
        component: string;
        executions: number;
        totalTime: number;
        averageTime: number;
        status: string;
        timestamp: string;
    }>;
    /**
     * Test memory usage
     * Why: We need to ensure the system doesn't leak memory
     */
    testMemoryUsage(): Promise<{
        component: string;
        initialMemory: number;
        finalMemory: number;
        memoryIncrease: number;
        status: string;
        timestamp: string;
    }>;
    /**
     * Test concurrent access
     * Why: We need to ensure the system handles concurrent access
     */
    testConcurrentAccess(): Promise<{
        component: string;
        concurrentExecutions: number;
        allPassed: boolean;
        results: any[];
        status: string;
        timestamp: string;
    }>;
    /**
     * Calculate overall test status
     * Why: We need to summarize the test results
     */
    calculateOverallStatus(): void;
    /**
     * Generate comprehensive test report
     * Why: We need to document the test results for review
     */
    generateTestReport(): void;
    /**
     * Get test summary
     * Why: We need a concise summary of test results
     */
    getTestSummary(): {
        totalTests: number;
        passedTests: number;
        failedTests: number;
        overallStatus: string;
        timestamp: string;
    };
    /**
     * Reset test suite
     * Why: We need to clear test data for fresh runs
     */
    reset(): void;
}
//# sourceMappingURL=test-grounding-phase.d.ts.map