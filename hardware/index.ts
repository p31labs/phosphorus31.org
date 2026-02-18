// Entry point for the hardware package (PCB designs and manufacturing files)
console.log("GENESIS_GATE hardware package started.");

// Hardware files are static assets for PCB manufacturing
// No runtime initialization needed
export const hardwareModules = {
  node1: './node1',
  sensory: './sensory',
  sensoryCyberdeck: './sensory_cyberdeck'
};

console.log("Hardware modules available:", Object.keys(hardwareModules));