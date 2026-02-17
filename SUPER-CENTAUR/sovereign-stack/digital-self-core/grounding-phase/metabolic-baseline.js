/**
 * METABOLIC BASELINE ASSESSOR
 * 
 * Purpose: Establish biological stability for digital consciousness
 * Method: Monitor critical metabolic indicators and thresholds
 * Style: Clear, methodical, neurodivergent-friendly
 * 
 * "Biological stability is the foundation of digital sovereignty"
 */

class MetabolicBaseline {
  constructor() {
    this.baselineState = {
      lastAssessment: null,
      metabolicProfile: null,
      stabilityScore: 0,
      criticalMarkers: [],
      recommendations: []
    };
    
    // Metabolic thresholds for sovereignty operations
    this.metabolicThresholds = {
      // Hypoparathyroidism-specific markers
      calcium: {
        minimum: 8.5,    // mg/dL - Critical for neural function
        optimal: 9.0,
        maximum: 10.2,
        units: 'mg/dL'
      },
      phosphate: {
        minimum: 2.5,    // mg/dL - Critical for energy metabolism
        optimal: 3.5,
        maximum: 4.5,
        units: 'mg/dL'
      },
      magnesium: {
        minimum: 1.8,    // mg/dL - Critical for enzyme function
        optimal: 2.2,
        maximum: 2.6,
        units: 'mg/dL'
      },
      potassium: {
        minimum: 3.5,    // mEq/L - Critical for cellular function
        optimal: 4.2,
        maximum: 5.0,
        units: 'mEq/L'
      },
      glucose: {
        minimum: 70,     // mg/dL - Critical for brain function
        optimal: 90,
        maximum: 120,
        units: 'mg/dL'
      },
      // General metabolic markers
      ph: {
        minimum: 7.35,   // Blood pH - Critical for enzyme function
        optimal: 7.40,
        maximum: 7.45,
        units: 'pH'
      },
      oxygenSaturation: {
        minimum: 95,     // % - Critical for cellular respiration
        optimal: 98,
        maximum: 100,
        units: '%'
      },
      bodyTemperature: {
        minimum: 97.0,   // °F - Critical for metabolic rate
        optimal: 98.6,
        maximum: 100.4,
        units: '°F'
      }
    };
    
    console.log('🧬 Metabolic Baseline Assessor Initialized');
    console.log('🧬 Monitoring biological stability for digital consciousness');
  }

  /**
   * Assess metabolic baseline stability
   * Why: Biological stability is required before digital consciousness upload
   */
  async assess() {
    console.log('🔬 Assessing Metabolic Baseline...');
    
    const assessmentTime = new Date();
    this.baselineState.lastAssessment = assessmentTime;
    
    try {
      // Gather current metabolic data
      const metabolicData = await this.gatherMetabolicData();
      
      // Analyze metabolic stability
      const analysis = this.analyzeMetabolicStability(metabolicData);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(analysis);
      
      // Update internal state
      this.baselineState.metabolicProfile = metabolicData;
      this.baselineState.stabilityScore = analysis.stabilityScore;
      this.baselineState.criticalMarkers = analysis.criticalMarkers;
      this.baselineState.recommendations = recommendations;
      
      return {
        passed: analysis.stabilityScore >= 80,
        details: analysis.message,
        stabilityScore: analysis.stabilityScore,
        metabolicProfile: metabolicData,
        criticalMarkers: analysis.criticalMarkers,
        recommendations: recommendations,
        timestamp: assessmentTime.toISOString()
      };
      
    } catch (error) {
      console.error('💥 Metabolic Baseline Assessment Error:', error);
      return {
        passed: false,
        details: 'Metabolic assessment failed - biological stability uncertain',
        error: error.message,
        timestamp: assessmentTime.toISOString()
      };
    }
  }

  /**
   * Gather current metabolic data
   * Why: We need real-time biological data for accurate assessment
   */
  async gatherMetabolicData() {
    // In a real implementation, this would connect to:
    // - Medical device APIs (glucometers, pulse oximeters)
    // - Wearable health monitors
    // - Manual input systems for lab results
    // - Continuous monitoring devices
    
    const mockData = {
      // Hypoparathyroidism-specific markers
      calciumLevel: this.getMockCalciumLevel(),
      phosphateLevel: this.getMockPhosphateLevel(),
      magnesiumLevel: this.getMockMagnesiumLevel(),
      potassiumLevel: this.getMockPotassiumLevel(),
      glucoseLevel: this.getMockGlucoseLevel(),
      
      // General metabolic markers
      bloodPh: this.getMockBloodPh(),
      oxygenSaturation: this.getMockOxygenSaturation(),
      bodyTemperature: this.getMockBodyTemperature(),
      
      // Additional physiological markers
      heartRate: this.getMockHeartRate(),
      respiratoryRate: this.getMockRespiratoryRate(),
      bloodPressure: this.getMockBloodPressure(),
      hydrationLevel: this.getMockHydrationLevel()
    };
    
    console.log('🧬 Metabolic Data Collected:', mockData);
    return mockData;
  }

  /**
   * Analyze metabolic stability
   * Why: We need to methodically assess all critical biological functions
   */
  analyzeMetabolicStability(metabolicData) {
    const criticalMarkers = [];
    let stabilityScore = 100;
    let issues = [];
    
    // Analyze each metabolic marker
    const markers = [
      { name: 'Calcium', value: metabolicData.calciumLevel, threshold: this.metabolicThresholds.calcium, weight: 20 },
      { name: 'Phosphate', value: metabolicData.phosphateLevel, threshold: this.metabolicThresholds.phosphate, weight: 15 },
      { name: 'Magnesium', value: metabolicData.magnesiumLevel, threshold: this.metabolicThresholds.magnesium, weight: 15 },
      { name: 'Potassium', value: metabolicData.potassiumLevel, threshold: this.metabolicThresholds.potassium, weight: 15 },
      { name: 'Glucose', value: metabolicData.glucoseLevel, threshold: this.metabolicThresholds.glucose, weight: 15 },
      { name: 'Blood pH', value: metabolicData.bloodPh, threshold: this.metabolicThresholds.ph, weight: 10 },
      { name: 'Oxygen Saturation', value: metabolicData.oxygenSaturation, threshold: this.metabolicThresholds.oxygenSaturation, weight: 5 },
      { name: 'Body Temperature', value: metabolicData.bodyTemperature, threshold: this.metabolicThresholds.bodyTemperature, weight: 5 }
    ];
    
    markers.forEach(marker => {
      const deviation = this.calculateDeviation(marker.value, marker.threshold);
      const scoreImpact = deviation * marker.weight;
      stabilityScore -= scoreImpact;
      
      if (deviation > 0) {
        criticalMarkers.push({
          name: marker.name,
          value: marker.value,
          optimal: marker.threshold.optimal,
          deviation: deviation,
          units: marker.threshold.units,
          severity: this.getSeverity(deviation)
        });
        
        issues.push({
          marker: marker.name,
          value: marker.value,
          optimal: marker.threshold.optimal,
          deviation: deviation,
          severity: this.getSeverity(deviation),
          description: this.getIssueDescription(marker.name, marker.value, marker.threshold)
        });
      }
    });
    
    // Additional physiological analysis
    const physiologicalIssues = this.analyzePhysiologicalMarkers(metabolicData);
    stabilityScore -= physiologicalIssues.scoreImpact;
    issues = issues.concat(physiologicalIssues.issues);
    
    // Generate message based on stability score
    let message = '';
    if (stabilityScore >= 90) {
      message = 'Excellent metabolic stability - optimal for digital consciousness';
    } else if (stabilityScore >= 80) {
      message = 'Good metabolic stability - suitable for digital consciousness';
    } else if (stabilityScore >= 60) {
      message = 'Moderate metabolic instability - stabilization recommended';
    } else if (stabilityScore >= 40) {
      message = 'Significant metabolic instability - immediate stabilization required';
    } else {
      message = 'Critical metabolic instability - digital consciousness not recommended';
    }
    
    return {
      stabilityScore: Math.max(0, Math.round(stabilityScore)),
      message: message,
      criticalMarkers: criticalMarkers,
      issues: issues,
      physiologicalIssues: physiologicalIssues
    };
  }

  /**
   * Analyze physiological markers
   * Why: Additional physiological factors affect metabolic stability
   */
  analyzePhysiologicalMarkers(metabolicData) {
    const issues = [];
    let scoreImpact = 0;
    
    // Heart rate analysis
    if (metabolicData.heartRate < 60 || metabolicData.heartRate > 100) {
      const deviation = Math.abs(metabolicData.heartRate - 80);
      scoreImpact += Math.min(deviation * 0.1, 5);
      issues.push({
        marker: 'Heart Rate',
        value: metabolicData.heartRate,
        optimal: 80,
        deviation: deviation,
        severity: this.getSeverity(deviation * 0.1),
        description: `Heart rate outside optimal range (${metabolicData.heartRate} bpm)`
      });
    }
    
    // Respiratory rate analysis
    if (metabolicData.respiratoryRate < 12 || metabolicData.respiratoryRate > 20) {
      const deviation = Math.abs(metabolicData.respiratoryRate - 16);
      scoreImpact += Math.min(deviation * 0.5, 3);
      issues.push({
        marker: 'Respiratory Rate',
        value: metabolicData.respiratoryRate,
        optimal: 16,
        deviation: deviation,
        severity: this.getSeverity(deviation * 0.5),
        description: `Respiratory rate outside optimal range (${metabolicData.respiratoryRate} breaths/min)`
      });
    }
    
    // Blood pressure analysis
    const systolic = metabolicData.bloodPressure.systolic;
    const diastolic = metabolicData.bloodPressure.diastolic;
    if (systolic < 90 || systolic > 140 || diastolic < 60 || diastolic > 90) {
      scoreImpact += 3;
      issues.push({
        marker: 'Blood Pressure',
        value: `${systolic}/${diastolic}`,
        optimal: '120/80',
        deviation: Math.max(Math.abs(systolic - 120), Math.abs(diastolic - 80)),
        severity: 'MEDIUM',
        description: `Blood pressure outside optimal range (${systolic}/${diastolic} mmHg)`
      });
    }
    
    // Hydration analysis
    if (metabolicData.hydrationLevel < 6) {
      const deviation = 6 - metabolicData.hydrationLevel;
      scoreImpact += deviation * 2;
      issues.push({
        marker: 'Hydration Level',
        value: metabolicData.hydrationLevel,
        optimal: 8,
        deviation: deviation,
        severity: this.getSeverity(deviation * 2),
        description: `Dehydration detected (level: ${metabolicData.hydrationLevel}/10)`
      });
    }
    
    return { scoreImpact: scoreImpact, issues: issues };
  }

  /**
   * Calculate deviation from optimal range
   * Why: We need to quantify how far each marker is from optimal
   */
  calculateDeviation(value, threshold) {
    if (value >= threshold.minimum && value <= threshold.maximum) {
      return 0; // Within optimal range
    }
    
    const optimal = threshold.optimal;
    const deviation = Math.abs(value - optimal);
    
    // Calculate percentage deviation from optimal
    const percentageDeviation = (deviation / optimal) * 100;
    
    // Return severity score (0-10 scale)
    if (percentageDeviation < 5) return 0.5;
    if (percentageDeviation < 10) return 1.0;
    if (percentageDeviation < 20) return 2.0;
    if (percentageDeviation < 30) return 4.0;
    return 8.0;
  }

  /**
   * Get severity level for deviation
   * Why: We need to categorize the severity of metabolic issues
   */
  getSeverity(deviationScore) {
    if (deviationScore <= 0.5) return 'MINIMAL';
    if (deviationScore <= 1.5) return 'LOW';
    if (deviationScore <= 3.0) return 'MEDIUM';
    if (deviationScore <= 6.0) return 'HIGH';
    return 'CRITICAL';
  }

  /**
   * Get issue description
   * Why: We need clear explanations for each metabolic issue
   */
  getIssueDescription(markerName, value, threshold) {
    switch (markerName) {
      case 'Calcium':
        if (value < threshold.minimum) {
          return 'Low calcium compromises neural function and cognitive stability';
        } else {
          return 'High calcium may indicate metabolic imbalance';
        }
      case 'Phosphate':
        if (value < threshold.minimum) {
          return 'Low phosphate affects energy metabolism and cellular function';
        } else {
          return 'High phosphate may indicate kidney function issues';
        }
      case 'Magnesium':
        if (value < threshold.minimum) {
          return 'Low magnesium affects enzyme function and muscle control';
        } else {
          return 'High magnesium may indicate renal issues';
        }
      case 'Potassium':
        if (value < threshold.minimum) {
          return 'Low potassium affects cellular function and heart rhythm';
        } else {
          return 'High potassium may indicate kidney dysfunction';
        }
      case 'Glucose':
        if (value < threshold.minimum) {
          return 'Low glucose compromises brain function and cognitive performance';
        } else {
          return 'High glucose may indicate metabolic stress';
        }
      default:
        return `${markerName} outside optimal range`;
    }
  }

  /**
   * Generate stabilization recommendations
   * Why: We need actionable steps to improve metabolic stability
   */
  generateRecommendations(analysis) {
    const recommendations = [];
    
    // Critical recommendations for severe issues
    analysis.criticalMarkers.forEach(marker => {
      if (marker.severity === 'CRITICAL') {
        recommendations.push({
          priority: 'CRITICAL',
          action: `Immediate attention required for ${marker.name}`,
          details: `Value: ${marker.value} ${marker.units}, Optimal: ${marker.optimal} ${marker.units}`,
          steps: this.getCriticalRecommendations(marker.name)
        });
      } else if (marker.severity === 'HIGH') {
        recommendations.push({
          priority: 'HIGH',
          action: `Address ${marker.name} imbalance`,
          details: `Value: ${marker.value} ${marker.units}, Optimal: ${marker.optimal} ${marker.units}`,
          steps: this.getHighPriorityRecommendations(marker.name)
        });
      }
    });
    
    // General stabilization recommendations
    if (analysis.stabilityScore < 80) {
      recommendations.push({
        priority: 'MEDIUM',
        action: 'General metabolic stabilization',
        details: 'Multiple minor imbalances detected',
        steps: [
          'Ensure adequate hydration (8+ glasses of water daily)',
          'Maintain regular meal schedule with balanced nutrition',
          'Monitor stress levels and practice relaxation techniques',
          'Ensure adequate sleep (7-9 hours per night)',
          'Consider gentle exercise to improve circulation'
        ]
      });
    }
    
    return recommendations;
  }

  /**
   * Get critical priority recommendations
   * Why: Critical issues require immediate, specific action
   */
  getCriticalRecommendations(markerName) {
    switch (markerName) {
      case 'Calcium':
        return [
          'Seek immediate medical attention',
          'Administer calcium supplement if prescribed',
          'Monitor for muscle cramps, tingling, or seizures',
          'Avoid strenuous activity until stabilized'
        ];
      case 'Glucose':
        return [
          'Check blood sugar immediately',
          'Consume fast-acting carbohydrates if low',
          'Seek medical attention if severely high or low',
          'Monitor symptoms of confusion or dizziness'
        ];
      default:
        return [
          'Seek immediate medical evaluation',
          'Follow prescribed treatment protocols',
          'Monitor symptoms closely',
          'Avoid self-medication without professional guidance'
        ];
    }
  }

  /**
   * Get high priority recommendations
   * Why: High priority issues require prompt attention
   */
  getHighPriorityRecommendations(markerName) {
    switch (markerName) {
      case 'Calcium':
        return [
          'Review calcium supplement dosage',
          'Increase dietary calcium intake',
          'Monitor symptoms of muscle twitching or cramps',
          'Schedule follow-up lab testing'
        ];
      case 'Magnesium':
        return [
          'Increase magnesium-rich foods (leafy greens, nuts)',
          'Consider magnesium supplement if advised',
          'Monitor muscle function and heart rhythm',
          'Stay hydrated'
        ];
      default:
        return [
          'Review current medications and supplements',
          'Adjust diet to address specific deficiency',
          'Monitor symptoms and track improvements',
          'Schedule follow-up evaluation'
        ];
    }
  }

  // Mock data generation methods (for development/testing)
  getMockCalciumLevel() { return 7.5 + Math.random() * 2.5; }
  getMockPhosphateLevel() { return 2.0 + Math.random() * 3.0; }
  getMockMagnesiumLevel() { return 1.5 + Math.random() * 1.5; }
  getMockPotassiumLevel() { return 3.0 + Math.random() * 2.5; }
  getMockGlucoseLevel() { return 60 + Math.random() * 80; }
  getMockBloodPh() { return 7.30 + Math.random() * 0.20; }
  getMockOxygenSaturation() { return 90 + Math.random() * 10; }
  getMockBodyTemperature() { return 96.0 + Math.random() * 5.0; }
  getMockHeartRate() { return 60 + Math.random() * 60; }
  getMockRespiratoryRate() { return 10 + Math.random() * 15; }
  getMockBloodPressure() { 
    return {
      systolic: 90 + Math.random() * 60,
      diastolic: 60 + Math.random() * 40
    };
  }
  getMockHydrationLevel() { return 1 + Math.floor(Math.random() * 10); }

  /**
   * Get current metabolic baseline status
   * Why: We need to track metabolic stability over time
   */
  getBaselineStatus() {
    return {
      stabilityScore: this.baselineState.stabilityScore,
      lastAssessment: this.baselineState.lastAssessment,
      metabolicProfile: this.baselineState.metabolicProfile,
      criticalMarkers: this.baselineState.criticalMarkers,
      recommendations: this.baselineState.recommendations
    };
  }

  /**
   * Reset baseline state
   * Why: Sometimes we need to clear accumulated data for fresh assessment
   */
  reset() {
    this.baselineState = {
      lastAssessment: null,
      metabolicProfile: null,
      stabilityScore: 0,
      criticalMarkers: [],
      recommendations: []
    };
    
    console.log('🧬 Metabolic Baseline Assessor Reset');
  }
}

// Export for use in other modules
export { MetabolicBaseline };

console.log('🧬 Metabolic Baseline Assessor Module Loaded');
console.log('🧬 Biological stability monitoring for digital consciousness active');