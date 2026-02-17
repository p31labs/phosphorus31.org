/**
 * METABOLIC BASELINE ASSESSOR
 *
 * Purpose: Establish biological stability for digital consciousness
 * Method: Monitor critical metabolic indicators and thresholds
 * Style: Clear, methodical, neurodivergent-friendly
 *
 * "Biological stability is the foundation of digital sovereignty"
 */
export class MetabolicBaseline {
    baselineState: {
        lastAssessment: null;
        metabolicProfile: null;
        stabilityScore: number;
        criticalMarkers: never[];
        recommendations: never[];
    };
    metabolicThresholds: {
        calcium: {
            minimum: number;
            optimal: number;
            maximum: number;
            units: string;
        };
        phosphate: {
            minimum: number;
            optimal: number;
            maximum: number;
            units: string;
        };
        magnesium: {
            minimum: number;
            optimal: number;
            maximum: number;
            units: string;
        };
        potassium: {
            minimum: number;
            optimal: number;
            maximum: number;
            units: string;
        };
        glucose: {
            minimum: number;
            optimal: number;
            maximum: number;
            units: string;
        };
        ph: {
            minimum: number;
            optimal: number;
            maximum: number;
            units: string;
        };
        oxygenSaturation: {
            minimum: number;
            optimal: number;
            maximum: number;
            units: string;
        };
        bodyTemperature: {
            minimum: number;
            optimal: number;
            maximum: number;
            units: string;
        };
    };
    /**
     * Assess metabolic baseline stability
     * Why: Biological stability is required before digital consciousness upload
     */
    assess(): Promise<{
        passed: boolean;
        details: string;
        stabilityScore: number;
        metabolicProfile: {
            calciumLevel: number;
            phosphateLevel: number;
            magnesiumLevel: number;
            potassiumLevel: number;
            glucoseLevel: number;
            bloodPh: number;
            oxygenSaturation: number;
            bodyTemperature: number;
            heartRate: number;
            respiratoryRate: number;
            bloodPressure: {
                systolic: number;
                diastolic: number;
            };
            hydrationLevel: number;
        };
        criticalMarkers: any[];
        recommendations: {
            priority: string;
            action: string;
            details: string;
            steps: string[];
        }[];
        timestamp: string;
        error?: undefined;
    } | {
        passed: boolean;
        details: string;
        error: any;
        timestamp: string;
        stabilityScore?: undefined;
        metabolicProfile?: undefined;
        criticalMarkers?: undefined;
        recommendations?: undefined;
    }>;
    /**
     * Gather current metabolic data
     * Why: We need real-time biological data for accurate assessment
     */
    gatherMetabolicData(): Promise<{
        calciumLevel: number;
        phosphateLevel: number;
        magnesiumLevel: number;
        potassiumLevel: number;
        glucoseLevel: number;
        bloodPh: number;
        oxygenSaturation: number;
        bodyTemperature: number;
        heartRate: number;
        respiratoryRate: number;
        bloodPressure: {
            systolic: number;
            diastolic: number;
        };
        hydrationLevel: number;
    }>;
    /**
     * Analyze metabolic stability
     * Why: We need to methodically assess all critical biological functions
     */
    analyzeMetabolicStability(metabolicData: any): {
        stabilityScore: number;
        message: string;
        criticalMarkers: any[];
        issues: any[];
        physiologicalIssues: {
            scoreImpact: number;
            issues: ({
                marker: string;
                value: any;
                optimal: number;
                deviation: number;
                severity: string;
                description: string;
            } | {
                marker: string;
                value: string;
                optimal: string;
                deviation: number;
                severity: string;
                description: string;
            })[];
        };
    };
    /**
     * Analyze physiological markers
     * Why: Additional physiological factors affect metabolic stability
     */
    analyzePhysiologicalMarkers(metabolicData: any): {
        scoreImpact: number;
        issues: ({
            marker: string;
            value: any;
            optimal: number;
            deviation: number;
            severity: string;
            description: string;
        } | {
            marker: string;
            value: string;
            optimal: string;
            deviation: number;
            severity: string;
            description: string;
        })[];
    };
    /**
     * Calculate deviation from optimal range
     * Why: We need to quantify how far each marker is from optimal
     */
    calculateDeviation(value: any, threshold: any): 2 | 0 | 1 | 8 | 0.5 | 4;
    /**
     * Get severity level for deviation
     * Why: We need to categorize the severity of metabolic issues
     */
    getSeverity(deviationScore: any): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "MINIMAL";
    /**
     * Get issue description
     * Why: We need clear explanations for each metabolic issue
     */
    getIssueDescription(markerName: any, value: any, threshold: any): string;
    /**
     * Generate stabilization recommendations
     * Why: We need actionable steps to improve metabolic stability
     */
    generateRecommendations(analysis: any): {
        priority: string;
        action: string;
        details: string;
        steps: string[];
    }[];
    /**
     * Get critical priority recommendations
     * Why: Critical issues require immediate, specific action
     */
    getCriticalRecommendations(markerName: any): string[];
    /**
     * Get high priority recommendations
     * Why: High priority issues require prompt attention
     */
    getHighPriorityRecommendations(markerName: any): string[];
    getMockCalciumLevel(): number;
    getMockPhosphateLevel(): number;
    getMockMagnesiumLevel(): number;
    getMockPotassiumLevel(): number;
    getMockGlucoseLevel(): number;
    getMockBloodPh(): number;
    getMockOxygenSaturation(): number;
    getMockBodyTemperature(): number;
    getMockHeartRate(): number;
    getMockRespiratoryRate(): number;
    getMockBloodPressure(): {
        systolic: number;
        diastolic: number;
    };
    getMockHydrationLevel(): number;
    /**
     * Get current metabolic baseline status
     * Why: We need to track metabolic stability over time
     */
    getBaselineStatus(): {
        stabilityScore: number;
        lastAssessment: null;
        metabolicProfile: null;
        criticalMarkers: never[];
        recommendations: never[];
    };
    /**
     * Reset baseline state
     * Why: Sometimes we need to clear accumulated data for fresh assessment
     */
    reset(): void;
}
//# sourceMappingURL=metabolic-baseline.d.ts.map