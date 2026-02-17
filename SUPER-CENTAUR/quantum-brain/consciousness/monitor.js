const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Consciousness State Tracking
let consciousnessState = {
  coherenceLevel: 0.5,
  cognitiveLoad: 0,
  floatingNeutralDetected: false,
  lastUpdate: new Date().toISOString(),
  neurodivergentProfile: null,
  childrenInvolved: false,
  economicContext: null
};

// Floating Neutral Detection with Enhanced Analysis
function detectFloatingNeutral(decisionHistory, currentContext) {
  const recentDecisions = decisionHistory.slice(-5);
  const highStressCount = recentDecisions.filter(d => d.cognitiveLoad > 7).length;
  const indecisionCount = recentDecisions.filter(d => d.indecisionDuration > 30).length;
  
  // Enhanced detection with context awareness
  const stressThreshold = currentContext.neurodivergentProfile ? 5 : 7;
  const stressBasedDetection = highStressCount >= 3;
  const indecisionBasedDetection = indecisionCount >= 2;
  
  return {
    detected: stressBasedDetection || indecisionBasedDetection,
    stressLevel: highStressCount,
    indecisionLevel: indecisionCount,
    triggers: identifyTriggers(currentContext),
    recommendations: generateFloatingNeutralRecommendations(currentContext)
  };
}

// Child Protection Consciousness Monitoring
function monitorChildProtectionConsciousness(currentContext) {
  if (!currentContext.childrenInvolved) {
    return { status: 'not_applicable', recommendations: [] };
  }
  
  const childProtectionMetrics = {
    safetyAwareness: assessSafetyAwareness(currentContext),
    stabilityFocus: assessStabilityFocus(currentContext),
    developmentalAwareness: assessDevelopmentalAwareness(currentContext),
    emotionalRegulation: assessEmotionalRegulation(currentContext)
  };
  
  const protectionLevel = calculateChildProtectionLevel(childProtectionMetrics);
  
  return {
    protectionLevel,
    metrics: childProtectionMetrics,
    recommendations: generateChildProtectionRecommendations(currentContext)
  };
}

// Neurodivergent Consciousness Optimization
function optimizeNeurodivergentConsciousness(currentContext) {
  if (!currentContext.neurodivergentProfile) {
    return { status: 'standard_optimization', recommendations: [] };
  }
  
  const neurodivergentOptimization = {
    sensoryEnvironment: optimizeSensoryEnvironment(currentContext),
    processingSupport: provideProcessingSupport(currentContext),
    energyManagement: manageEnergyLevels(currentContext),
    communicationOptimization: optimizeCommunication(currentContext)
  };
  
  return {
    optimizationLevel: 'enhanced',
    strategies: neurodivergentOptimization,
    recommendations: generateNeurodivergentRecommendations(currentContext)
  };
}

// Economic Revolution Consciousness Alignment
function alignEconomicConsciousness(currentContext) {
  if (!currentContext.economicContext) {
    return { status: 'standard_alignment', recommendations: [] };
  }
  
  const economicAlignment = {
    empowermentFocus: alignEmpowermentFocus(currentContext),
    sovereigntyAwareness: enhanceSovereigntyAwareness(currentContext),
    communityMindset: cultivateCommunityMindset(currentContext),
    revolutionaryClarity: enhanceRevolutionaryClarity(currentContext)
  };
  
  return {
    alignmentLevel: 'revolutionary',
    focusAreas: economicAlignment,
    recommendations: generateEconomicRevolutionRecommendations(currentContext)
  };
}

// Consciousness API
app.get('/status', (req, res) => {
  res.json({
    ...consciousnessState,
    recommendations: getRecommendations(),
    childProtectionStatus: monitorChildProtectionConsciousness(consciousnessState),
    neurodivergentOptimization: optimizeNeurodivergentConsciousness(consciousnessState),
    economicAlignment: alignEconomicConsciousness(consciousnessState)
  });
});

app.post('/update', (req, res) => {
  const { coherenceLevel, cognitiveLoad, decisionHistory, currentContext } = req.body;
  
  consciousnessState = {
    coherenceLevel,
    cognitiveLoad,
    floatingNeutralDetected: detectFloatingNeutral(decisionHistory || [], currentContext || {}),
    lastUpdate: new Date().toISOString(),
    neurodivergentProfile: currentContext?.neurodivergentProfile,
    childrenInvolved: currentContext?.childrenInvolved,
    economicContext: currentContext?.economicContext
  };

  res.json(consciousnessState);
});

app.post('/optimize', (req, res) => {
  const { optimizationTarget, currentContext } = req.body;
  
  const optimization = {
    target: optimizationTarget,
    strategies: generateOptimizationStrategies(optimizationTarget, currentContext),
    timeline: calculateOptimizationTimeline(optimizationTarget),
    successMetrics: defineSuccessMetrics(optimizationTarget)
  };
  
  res.json(optimization);
});

// Helper Functions

function getRecommendations() {
  const recommendations = [];
  
  if (consciousnessState.coherenceLevel < 0.3) {
    recommendations.push("⚠️ Low coherence detected. Take 5-minute breathing break.");
  }
  
  if (consciousnessState.cognitiveLoad > 7) {
    recommendations.push("🔥 High cognitive load. Delegate or postpone non-urgent decisions.");
  }
  
  if (consciousnessState.floatingNeutralDetected?.detected) {
    recommendations.push("⚡ Floating Neutral detected. Ground yourself with physical activity.");
  }
  
  // Child-specific recommendations
  if (consciousnessState.childrenInvolved) {
    recommendations.push("🛡️ Child protection protocols active. Prioritize safety and stability.");
  }
  
  // Neurodivergent-specific recommendations
  if (consciousnessState.neurodivergentProfile) {
    recommendations.push("🌟 Neurodivergent support active. Use accommodations and breaks as needed.");
  }
  
  // Economic revolution recommendations
  if (consciousnessState.economicContext) {
    recommendations.push("💚 Economic revolution alignment active. Focus on empowerment and sovereignty.");
  }

  return recommendations;
}

function identifyTriggers(currentContext) {
  const triggers = [];
  
  if (currentContext.stressLevel > 7) triggers.push("High stress");
  if (currentContext.cognitiveLoad > 7) triggers.push("Cognitive overload");
  if (currentContext.sensoryOverload) triggers.push("Sensory overload");
  if (currentContext.timePressure) triggers.push("Time pressure");
  if (currentContext.uncertainty) triggers.push("Uncertainty");
  
  return triggers;
}

function generateFloatingNeutralRecommendations(currentContext) {
  const recommendations = [];
  
  if (currentContext.neurodivergentProfile) {
    recommendations.push("Use sensory grounding techniques");
    recommendations.push("Break decision into smaller, manageable steps");
    recommendations.push("Allow extra processing time");
  }
  
  if (currentContext.childrenInvolved) {
    recommendations.push("Ensure child safety before making decisions");
    recommendations.push("Consider long-term impact on children");
    recommendations.push("Involve trusted support system");
  }
  
  recommendations.push("Practice deep breathing and grounding");
  recommendations.push("Take physical break from decision-making");
  recommendations.push("Reassess priorities and constraints");
  
  return recommendations;
}

function assessSafetyAwareness(context) {
  return {
    physicalSafety: context.physicalSafety || 'medium',
    emotionalSafety: context.emotionalSafety || 'medium',
    psychologicalSafety: context.psychologicalSafety || 'medium',
    overallSafety: 'high'
  };
}

function assessStabilityFocus(context) {
  return {
    routineStability: context.routineStability || 'medium',
    emotionalStability: context.emotionalStability || 'medium',
    financialStability: context.financialStability || 'medium',
    overallStability: 'medium'
  };
}

function assessDevelopmentalAwareness(context) {
  return {
    developmentalNeeds: context.developmentalNeeds || 'high',
    growthSupport: context.growthSupport || 'medium',
    learningEnvironment: context.learningEnvironment || 'medium',
    overallDevelopment: 'high'
  };
}

function assessEmotionalRegulation(context) {
  return {
    emotionalAwareness: context.emotionalAwareness || 'medium',
    regulationSkills: context.regulationSkills || 'medium',
    supportSystems: context.supportSystems || 'medium',
    overallRegulation: 'medium'
  };
}

function calculateChildProtectionLevel(metrics) {
  const averageScore = (metrics.safetyAwareness.overallSafety === 'high' ? 9 : 5) +
                      (metrics.stabilityFocus.overallStability === 'high' ? 9 : 5) +
                      (metrics.developmentalAwareness.overallDevelopment === 'high' ? 9 : 5) +
                      (metrics.emotionalRegulation.overallRegulation === 'high' ? 9 : 5);
  
  return averageScore > 30 ? 'excellent' : averageScore > 20 ? 'good' : 'needs_improvement';
}

function generateChildProtectionRecommendations(context) {
  const recommendations = [];
  
  recommendations.push("Prioritize child safety above all else");
  recommendations.push("Maintain stable routines and environment");
  recommendations.push("Monitor child's emotional and developmental needs");
  recommendations.push("Seek professional support when needed");
  recommendations.push("Document all protective measures taken");
  
  return recommendations;
}

function optimizeSensoryEnvironment(context) {
  const profile = context.neurodivergentProfile;
  return {
    noiseLevel: profile.sensitivity?.noise ? 'quiet' : 'normal',
    lighting: profile.sensitivity?.light ? 'soft' : 'normal',
    stimulation: profile.sensitivity?.stimulation ? 'low' : 'moderate',
    space: profile.sensitivity?.space ? 'spacious' : 'standard'
  };
}

function provideProcessingSupport(context) {
  const profile = context.neurodivergentProfile;
  return {
    informationDelivery: profile.processing?.speed === 'slow' ? 'chunked' : 'standard',
    decisionPace: profile.processing?.speed === 'slow' ? 'extended' : 'standard',
    supportTools: profile.processing?.tools || ['visual aids', 'checklists'],
    breaks: profile.processing?.breaks || 'frequent'
  };
}

function manageEnergyLevels(context) {
  const profile = context.neurodivergentProfile;
  return {
    energyMonitoring: 'continuous',
    recoveryTime: profile.energy?.recovery || 'extended',
    activityPacing: 'balanced',
    supportNeeds: profile.energy?.support || 'high'
  };
}

function optimizeCommunication(context) {
  const profile = context.neurodivergentProfile;
  return {
    communicationStyle: profile.communication?.style || 'direct',
    clarityLevel: 'high',
    patienceLevel: 'high',
    accommodations: profile.communication?.accommodations || ['extra time', 'clear language']
  };
}

function generateNeurodivergentRecommendations(context) {
  const profile = context.neurodivergentProfile;
  const recommendations = [];
  
  if (profile.autism) {
    recommendations.push("Use clear, literal communication");
    recommendations.push("Provide sensory-friendly environment");
    recommendations.push("Allow for special interests and routines");
    recommendations.push("Give extra processing time for decisions");
  }
  
  if (profile.adhd) {
    recommendations.push("Break tasks into smaller steps");
    recommendations.push("Use visual aids and timers");
    recommendations.push("Allow for movement and fidgeting");
    recommendations.push("Provide immediate feedback");
  }
  
  recommendations.push("Respect neurodivergent identity and needs");
  recommendations.push("Use accommodations without stigma");
  recommendations.push("Focus on strengths and capabilities");
  
  return recommendations;
}

function alignEmpowermentFocus(context) {
  return {
    individualEmpowerment: context.economicContext?.individualEmpowerment || 'high',
    communityEmpowerment: context.economicContext?.communityEmpowerment || 'high',
    systemicChange: context.economicContext?.systemicChange || 'high',
    sovereigntyFocus: 'maximum'
  };
}

function enhanceSovereigntyAwareness(context) {
  return {
    financialSovereignty: context.economicContext?.financialSovereignty || 'developing',
    decisionSovereignty: 'enhanced',
    personalAgency: 'maximized',
    communityAutonomy: context.economicContext?.communityAutonomy || 'developing'
  };
}

function cultivateCommunityMindset(context) {
  return {
    collectiveWellBeing: context.economicContext?.collectiveWellBeing || 'high',
    sharedResources: context.economicContext?.sharedResources || 'medium',
    mutualSupport: 'strong',
    communityEngagement: 'active'
  };
}

function enhanceRevolutionaryClarity(context) {
  return {
    revolutionaryVision: context.economicContext?.revolutionaryVision || 'clear',
    liberationFocus: 'strong',
    systemicAwareness: 'enhanced',
    actionOrientation: 'proactive'
  };
}

function generateEconomicRevolutionRecommendations(context) {
  const recommendations = [];
  
  recommendations.push("Focus on individual and community sovereignty");
  recommendations.push("Prioritize equitable wealth distribution");
  recommendations.push("Build cooperative economic structures");
  recommendations.push("Support local and community-based economies");
  recommendations.push("Challenge existing power structures");
  recommendations.push("Invest in sustainable and ethical practices");
  recommendations.push("Educate others about economic liberation");
  recommendations.push("Practice economic self-determination");
  
  return recommendations;
}

function generateOptimizationStrategies(target, context) {
  const strategies = [];
  
  switch (target) {
    case 'coherence':
      strategies.push("Meditation and mindfulness practices");
      strategies.push("Breathing exercises and grounding techniques");
      strategies.push("Reduce sensory overload and distractions");
      break;
      
    case 'cognitiveLoad':
      strategies.push("Break complex tasks into smaller steps");
      strategies.push("Use decision support tools and checklists");
      strategies.push("Delegate non-essential tasks");
      break;
      
    case 'childProtection':
      strategies.push("Establish safety protocols and routines");
      strategies.push("Build support network of trusted individuals");
      strategies.push("Document and review protection measures regularly");
      break;
      
    case 'neurodivergentSupport':
      strategies.push("Implement sensory accommodations");
      strategies.push("Use processing time and communication accommodations");
      strategies.push("Create supportive and understanding environment");
      break;
      
    case 'economicRevolution':
      strategies.push("Build alternative economic systems");
      strategies.push("Support cooperative and community ownership");
      strategies.push("Challenge and transform existing structures");
      break;
  }
  
  return strategies;
}

function calculateOptimizationTimeline(target) {
  const timelines = {
    coherence: '1-2 weeks for noticeable improvement',
    cognitiveLoad: '3-5 days for immediate relief',
    childProtection: 'ongoing, with immediate safety measures',
    neurodivergentSupport: '2-4 weeks for full accommodation setup',
    economicRevolution: 'long-term, with immediate actionable steps'
  };
  
  return timelines[target] || 'varies based on individual needs';
}

function defineSuccessMetrics(target) {
  const metrics = {
    coherence: ['Improved decision quality', 'Reduced stress levels', 'Enhanced focus'],
    cognitiveLoad: ['Task completion rate', 'Mental clarity', 'Energy levels'],
    childProtection: ['Child safety incidents', 'Stability measures', 'Developmental progress'],
    neurodivergentSupport: ['Accommodation effectiveness', 'Stress reduction', 'Functionality improvement'],
    economicRevolution: ['Community empowerment', 'Wealth distribution', 'Systemic change']
  };
  
  return metrics[target] || ['Individualized success criteria'];
}

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'consciousness-monitor',
    port: PORT,
    timestamp: new Date().toISOString(),
    features: {
      floatingNeutralDetection: true,
      childProtectionMonitoring: true,
      neurodivergentOptimization: true,
      economicRevolutionAlignment: true
    }
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🧠 Consciousness Monitor running on port ${PORT}`);
  console.log(`🛡️  Child Protection Monitoring Active`);
  console.log(`🌟 Neurodivergent Support Optimization Active`);
  console.log(`💚 Economic Revolution Consciousness Alignment Active`);
  console.log(`⚡ Floating Neutral Detection Active`);
  console.log(`🧠 Consciousness State Tracking Active`);
});
