const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
app.use(cors());
app.use(express.json());

// Neo4j Connection
const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'password')
);

// Basic MCDA Decision Engine
function calculateDecisionScore(alternatives, criteria, weights) {
  return alternatives.map(alt => {
    const score = criteria.reduce((total, criterion, index) => {
      const altScore = alt.scores[index] || 0;
      return total + (altScore * weights[index]);
    }, 0);
    return { ...alt, finalScore: score };
  }).sort((a, b) => b.finalScore - a.finalScore);
}

// Consciousness-Enhanced Decision Analysis
function analyzeConsciousnessImpact(decisionContext) {
  const { cognitiveLoad, emotionalState, stressLevel, timeOfDay } = decisionContext;
  
  // Calculate consciousness optimization factors
  const consciousnessFactors = {
    optimalTiming: timeOfDay >= 9 && timeOfDay <= 17, // Business hours optimal
    cognitiveCapacity: cognitiveLoad < 5, // Low cognitive load optimal
    emotionalClarity: emotionalState === 'calm' || emotionalState === 'focused',
    stressImpact: stressLevel < 3, // Low stress optimal
    overallOptimization: (cognitiveLoad < 5 && stressLevel < 3) ? 'optimal' : 'suboptimal'
  };
  
  return consciousnessFactors;
}

// Child Protection Decision Analysis
function analyzeChildImpact(decisionContext) {
  const { childrenInvolved, childAge, childNeeds, familyImpact } = decisionContext;
  
  if (!childrenInvolved) return { childImpact: 'none', recommendations: [] };
  
  const childImpactAnalysis = {
    immediateImpact: calculateImmediateChildImpact(childNeeds, familyImpact),
    longTermImpact: calculateLongTermChildImpact(childAge, decisionContext),
    protectionLevel: determineProtectionLevel(decisionContext),
    recommendations: generateChildProtectionRecommendations(decisionContext)
  };
  
  return childImpactAnalysis;
}

// Neurodivergent Support Analysis
function analyzeNeurodivergentSupport(decisionContext) {
  const { neurodivergentProfile, sensorySensitivity, processingSpeed, socialEnergy } = decisionContext;
  
  if (!neurodivergentProfile) return { neurodivergentSupport: 'standard', recommendations: [] };
  
  const supportAnalysis = {
    sensoryOptimization: optimizeSensoryEnvironment(sensorySensitivity),
    processingAccommodation: accommodateProcessingSpeed(processingSpeed),
    socialEnergyManagement: manageSocialEnergy(socialEnergy),
    neurodivergentRecommendations: generateNeurodivergentRecommendations(neurodivergentProfile)
  };
  
  return supportAnalysis;
}

// Economic Revolution Analysis
function analyzeEconomicImpact(decisionContext) {
  const { economicModel, wealthDistribution, communityImpact, sustainability } = decisionContext;
  
  const economicAnalysis = {
    empowermentLevel: calculateEmpowermentLevel(economicModel),
    wealthEquity: assessWealthEquity(wealthDistribution),
    communityBenefit: calculateCommunityBenefit(communityImpact),
    sustainabilityScore: assessSustainability(sustainability),
    revolutionaryPotential: calculateRevolutionaryPotential(decisionContext)
  };
  
  return economicAnalysis;
}

// API Endpoint
app.post('/decide', async (req, res) => {
  try {
    const { context, alternatives, criteria, weights, decisionContext } = req.body;
    
    // Calculate basic decision scores
    const rankedAlternatives = calculateDecisionScore(alternatives, criteria, weights);
    
    // Enhanced analysis
    const consciousnessAnalysis = analyzeConsciousnessImpact(decisionContext || {});
    const childImpactAnalysis = analyzeChildImpact(decisionContext || {});
    const neurodivergentAnalysis = analyzeNeurodivergentSupport(decisionContext || {});
    const economicAnalysis = analyzeEconomicImpact(decisionContext || {});
    
    // Save to Neo4j
    const session = driver.session();
    await session.run(
      `CREATE (d:Decision {context: $context, timestamp: timestamp(), decisionType: $decisionType})
       WITH d
       UNWIND $alternatives AS alt
       CREATE (a:Alternative {name: alt.name, score: alt.finalScore, decisionType: $decisionType})
       CREATE (d)-[:HAS_ALTERNATIVE]->(a)
       RETURN d, a`,
      { 
        context, 
        alternatives: rankedAlternatives,
        decisionType: decisionContext?.decisionType || 'general'
      }
    );
    session.close();

    res.json({
      context,
      rankedAlternatives,
      consciousnessAnalysis,
      childImpactAnalysis,
      neurodivergentAnalysis,
      economicAnalysis,
      timestamp: new Date().toISOString(),
      decisionType: decisionContext?.decisionType || 'general'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Consciousness Optimization Endpoint
app.post('/optimize', async (req, res) => {
  try {
    const { currentConsciousnessState, decisionContext } = req.body;
    
    const optimization = {
      recommendedTiming: optimizeTiming(currentConsciousnessState),
      cognitiveLoadReduction: reduceCognitiveLoad(currentConsciousnessState),
      emotionalStateOptimization: optimizeEmotionalState(currentConsciousnessState),
      neurodivergentAccommodations: optimizeForNeurodivergence(decisionContext),
      childProtectionProtocols: optimizeForChildren(decisionContext),
      economicEmpowerment: optimizeForEconomicRevolution(decisionContext)
    };
    
    res.json(optimization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper Functions

function calculateImmediateChildImpact(childNeeds, familyImpact) {
  // Calculate immediate impact on children
  return {
    safetyLevel: familyImpact.safety || 'high',
    stabilityLevel: familyImpact.stability || 'medium',
    emotionalImpact: childNeeds.emotional || 'moderate',
    developmentalImpact: childNeeds.developmental || 'low'
  };
}

function calculateLongTermChildImpact(childAge, decisionContext) {
  // Calculate long-term impact based on child age and decision
  const ageFactor = childAge < 5 ? 1.5 : childAge < 12 ? 1.2 : 1.0;
  return {
    educationalImpact: ageFactor * (decisionContext.educationalImpact || 1),
    emotionalDevelopment: ageFactor * (decisionContext.emotionalImpact || 1),
    futureOpportunities: ageFactor * (decisionContext.futureImpact || 1)
  };
}

function determineProtectionLevel(decisionContext) {
  // Determine protection level needed
  const riskFactors = decisionContext.riskFactors || [];
  return riskFactors.length > 3 ? 'high' : riskFactors.length > 1 ? 'medium' : 'low';
}

function generateChildProtectionRecommendations(decisionContext) {
  const recommendations = [];
  
  if (decisionContext.childrenInvolved) {
    recommendations.push("Prioritize child safety and well-being");
    recommendations.push("Consider long-term developmental impact");
    recommendations.push("Ensure stable and supportive environment");
  }
  
  if (decisionContext.legalContext) {
    recommendations.push("Document child protection measures");
    recommendations.push("Consult child welfare experts");
  }
  
  return recommendations;
}

function optimizeSensoryEnvironment(sensitivity) {
  return {
    noiseLevel: sensitivity.noise ? 'quiet' : 'normal',
    lighting: sensitivity.light ? 'soft' : 'normal',
    stimulation: sensitivity.stimulation ? 'low' : 'moderate',
    recommendations: generateSensoryRecommendations(sensitivity)
  };
}

function accommodateProcessingSpeed(speed) {
  return {
    decisionPace: speed === 'slow' ? 'extended' : 'standard',
    informationDelivery: speed === 'slow' ? 'chunked' : 'standard',
    responseTime: speed === 'slow' ? 'generous' : 'standard'
  };
}

function manageSocialEnergy(energy) {
  return {
    socialInteraction: energy.level === 'low' ? 'minimal' : 'standard',
    recoveryTime: energy.level === 'low' ? 'extended' : 'standard',
    supportNeeds: energy.level === 'low' ? 'high' : 'moderate'
  };
}

function generateNeurodivergentRecommendations(profile) {
  const recommendations = [];
  
  if (profile.autism) {
    recommendations.push("Provide clear, direct communication");
    recommendations.push("Allow for sensory breaks");
    recommendations.push("Use structured decision-making process");
  }
  
  if (profile.adhd) {
    recommendations.push("Break decisions into smaller steps");
    recommendations.push("Use visual aids and checklists");
    recommendations.push("Allow for movement and fidgeting");
  }
  
  return recommendations;
}

function calculateEmpowermentLevel(model) {
  // Calculate economic empowerment level
  return {
    individualEmpowerment: model.individual ? 9 : 5,
    communityEmpowerment: model.community ? 9 : 5,
    systemicChange: model.systemic ? 9 : 5,
    overallScore: model.individual && model.community && model.systemic ? 9 : 5
  };
}

function assessWealthEquity(distribution) {
  // Assess wealth distribution equity
  return {
    equalityLevel: distribution.equality || 'medium',
    accessLevel: distribution.access || 'medium',
    opportunityLevel: distribution.opportunity || 'medium',
    equityScore: 7 // Placeholder score
  };
}

function calculateCommunityBenefit(impact) {
  // Calculate community benefit
  return {
    localImpact: impact.local || 'medium',
    sharedValue: impact.sharedValue || 'medium',
    sustainability: impact.sustainability || 'medium',
    communityScore: 7 // Placeholder score
  };
}

function assessSustainability(sustainability) {
  // Assess sustainability factors
  return {
    environmentalImpact: sustainability.environmental || 'medium',
    economicViability: sustainability.economic || 'medium',
    socialResponsibility: sustainability.social || 'medium',
    longTermViability: sustainability.longTerm || 'medium'
  };
}

function calculateRevolutionaryPotential(context) {
  // Calculate revolutionary potential
  const factors = [
    context.empowermentLevel || 5,
    context.wealthEquity || 5,
    context.communityBenefit || 5,
    context.sustainability || 5
  ];
  
  return {
    revolutionaryScore: factors.reduce((a, b) => a + b, 0) / factors.length,
    transformationLevel: 'high',
    impactRadius: 'global',
    timeline: 'immediate to long-term'
  };
}

function optimizeTiming(consciousnessState) {
  const { timeOfDay, energyLevel, focusLevel } = consciousnessState;
  
  if (energyLevel > 7 && focusLevel > 7 && timeOfDay >= 9 && timeOfDay <= 11) {
    return { optimalTime: 'morning', recommendation: 'Execute decision now' };
  } else if (energyLevel > 5 && focusLevel > 5) {
    return { optimalTime: 'within 2 hours', recommendation: 'Prepare and execute soon' };
  } else {
    return { optimalTime: 'delay 4+ hours', recommendation: 'Rest and optimize before deciding' };
  }
}

function reduceCognitiveLoad(consciousnessState) {
  const { cognitiveLoad, stressLevel } = consciousnessState;
  
  return {
    currentLoad: cognitiveLoad,
    recommendedReduction: cognitiveLoad > 7 ? 'high' : cognitiveLoad > 4 ? 'medium' : 'low',
    strategies: [
      'Break decision into smaller steps',
      'Use decision support tools',
      'Take breaks between analysis',
      'Prioritize most important factors'
    ]
  };
}

function optimizeEmotionalState(consciousnessState) {
  const { emotionalState, stressLevel } = consciousnessState;
  
  return {
    currentEmotionalState: emotionalState,
    recommendedState: stressLevel < 3 ? 'optimal' : 'needs calming',
    strategies: [
      'Deep breathing exercises',
      'Grounding techniques',
      'Emotional regulation practices',
      'Support system engagement'
    ]
  };
}

function optimizeForNeurodivergence(decisionContext) {
  if (!decisionContext.neurodivergentProfile) return { accommodations: 'standard' };
  
  return {
    sensoryAccommodations: 'quiet environment, minimal distractions',
    processingAccommodations: 'extended time, chunked information',
    communicationAccommodations: 'clear, direct communication',
    supportAccommodations: 'fidget tools, movement breaks'
  };
}

function optimizeForChildren(decisionContext) {
  if (!decisionContext.childrenInvolved) return { protocols: 'none needed' };
  
  return {
    protectionLevel: 'maximum',
    timingConsiderations: 'when children are not present or during calm periods',
    communicationStyle: 'age-appropriate, reassuring',
    supportSystem: 'involve trusted caregivers and child specialists'
  };
}

function optimizeForEconomicRevolution(decisionContext) {
  return {
    empowermentFocus: 'maximize individual and community sovereignty',
    wealthDistribution: 'prioritize equitable distribution',
    sustainability: 'ensure long-term viability',
    revolutionaryImpact: 'align with economic liberation principles',
    communityBenefit: 'maximize collective well-being'
  };
}

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'decision-engine',
    port: PORT,
    timestamp: new Date().toISOString(),
    features: {
      consciousnessEnhanced: true,
      childProtection: true,
      neurodivergentSupport: true,
      economicRevolution: true
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Decision Engine running on port ${PORT}`);
  console.log(`🧠 Consciousness-Enhanced Decision Making Active`);
  console.log(`🛡️  Child Protection Protocols Active`);
  console.log(`🌟 Neurodivergent Support Active`);
  console.log(`💚 Economic Revolution Optimization Active`);
});
