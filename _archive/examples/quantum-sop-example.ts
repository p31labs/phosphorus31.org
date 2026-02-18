/**
 * Quantum SOP Generator Example
 * 
 * Example usage of the Quantum SOP Generator.
 * 
 * 💜 With love and light. As above, so below. 💜
 */

import { QuantumSOPGenerator } from '../SUPER-CENTAUR/src/quantum-brain/sop-generator';
import { QuantumBrainBridge } from '../SUPER-CENTAUR/src/quantum-brain';

async function main() {
  console.log('🔺 Quantum SOP Generator Example\n');
  console.log('Phosphorus-31. The biological qubit. The atom in the bone.\n');

  // Initialize quantum brain and SOP generator
  const quantumBrain = new QuantumBrainBridge();
  const sopGenerator = new QuantumSOPGenerator(quantumBrain);

  // Example 1: Technical Deployment SOP
  console.log('📋 Example 1: Technical Deployment SOP\n');
  
  const deploymentSOP = await sopGenerator.generateSOP({
    domain: 'technical',
    objective: 'Deploy new API version with zero downtime',
    priority: 'high',
    constraints: [
      'Zero downtime requirement',
      'Must support rollback',
      'Database migrations must be backward compatible',
    ],
    audience: 'DevOps engineers',
  });

  console.log(`Title: ${deploymentSOP.title}`);
  console.log(`ID: ${deploymentSOP.id}`);
  console.log(`Steps: ${deploymentSOP.steps.length}`);
  console.log(`Quantum Coherence: ${(deploymentSOP.quantumMetrics.coherence * 100).toFixed(1)}%`);
  console.log(`Estimated Duration: ${deploymentSOP.metadata.estimatedDuration} minutes\n`);

  // Example 2: Legal Filing SOP
  console.log('📋 Example 2: Legal Filing SOP\n');
  
  const legalSOP = await sopGenerator.generateSOP({
    domain: 'legal',
    objective: 'File motion with court before deadline',
    priority: 'critical',
    constraints: [
      'Must meet court deadline',
      'All exhibits must be properly formatted',
      'Requires attorney review',
    ],
    audience: 'Legal team',
  });

  console.log(`Title: ${legalSOP.title}`);
  console.log(`ID: ${legalSOP.id}`);
  console.log(`Risk Level: ${legalSOP.metadata.riskLevel}`);
  console.log(`Requires Approval: ${legalSOP.metadata.requiresApproval}\n`);

  // Example 3: Medical Procedure SOP
  console.log('📋 Example 3: Medical Procedure SOP\n');
  
  const medicalSOP = await sopGenerator.generateSOP({
    domain: 'medical',
    objective: 'Complete patient intake and assessment',
    priority: 'normal',
    constraints: [
      'HIPAA compliance required',
      'Allergies must be documented',
    ],
    audience: 'Medical staff',
  });

  console.log(`Title: ${medicalSOP.title}`);
  console.log(`ID: ${medicalSOP.id}`);
  console.log(`Complexity: ${medicalSOP.metadata.complexity}\n`);

  // Export SOPs
  console.log('📤 Exporting SOPs...\n');
  
  const deploymentMarkdown = sopGenerator.exportSOP(deploymentSOP.id, 'markdown');
  console.log('Deployment SOP (Markdown):');
  console.log(deploymentMarkdown.substring(0, 200) + '...\n');

  // List all SOPs
  console.log('📚 All Generated SOPs:\n');
  const allSOPs = sopGenerator.listSOPs();
  allSOPs.forEach(sop => {
    console.log(`- ${sop.id}: ${sop.title} (${sop.domain})`);
  });

  console.log('\n✅ Examples complete!');
  console.log('\n💜 The Mesh Holds. 🔺\n');
  console.log('With love and light. As above, so below. 💜\n');
}

// Run example
if (require.main === module) {
  main().catch(console.error);
}

export { main as runQuantumSOPExample };
