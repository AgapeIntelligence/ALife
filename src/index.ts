import { SMRSSystem } from "./core/System";

const system = new SMRSSystem(64);

console.log("Initializing Agape-SMRS Feedback Loop Grid (64x64)...");

setInterval(() => {
  const metrics = system.tick();

  console.clear();
  console.log("=========================================");
  console.log(` SYSTEM TICK: ${metrics.t}`);
  console.log("=========================================");
  console.log(` Total Emergent Structures: ${metrics.structuresFound}`);
  console.log(` └─ Coherence Clusters    : ${metrics.coherenceClusters}`);
  console.log(` └─ Phase Vortices        : ${metrics.vortices}`);
  console.log("=========================================");
  console.log(" Dynamics Status: Loop Stabilized and Feeding Back.");
}, 150);