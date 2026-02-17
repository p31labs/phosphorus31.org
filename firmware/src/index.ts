// Entry point for the firmware package (ESP32 hardware firmware)
console.log("GENESIS_GATE firmware package started.");

// Firmware files are static assets for ESP32 deployment
// No runtime initialization needed
export const firmwareModules = {
  helloWorld: './hello_world',
  tetrahedron: './tetrahedron',
  walkieTalkie: './walkie_talkie'
};

console.log("Firmware modules available:", Object.keys(firmwareModules));