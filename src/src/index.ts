import { IncomingMessage, ServerResponse } from 'http';
import { SMRSSystem } from "./core/System";

// Instantiate the system once in global memory space across warm serverless invocations
const system = new SMRSSystem(64);

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Execute a single evolution step of the Agape-SMRS framework
  const metrics = system.tick();

  const dashboardHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>SMRS-ALife Core Monitor</title>
      <style>
        body { background: #0a0a0c; color: #50fa7b; font-family: monospace; padding: 40px; }
        .panel { border: 1px solid #44475a; padding: 20px; border-radius: 4px; max-width: 500px; background: #181920; }
        h1 { color: #8be9fd; font-size: 1.2rem; margin-top: 0; }
        .metric { margin: 10px 0; font-size: 1rem; }
        .value { color: #f1fa8c; }
        .meta { color: #6272a4; margin-top: 20px; font-size: 0.8rem; border-top: 1px solid #282a36; padding-top: 10px; }
      </style>
      <script>
        // Auto-refresh the page every 500ms to pull the next evolutionary frame state
        setTimeout(() => { window.location.reload(); }, 500);
      </script>
    </head>
    <body>
      <div class="panel">
        <h1>AGAPE-SMRS MONITOR PANEL</h1>
        <hr style="border-color: #44475a;">
        <div class="metric">System Tick: <span class="value">${metrics.t}</span></div>
        <div class="metric">Emergent Structures: <span class="value">${metrics.structuresFound}</span></div>
        <div class="metric">├─ Coherence Clusters: <span class="value">${metrics.coherenceClusters}</span></div>
        <div class="metric">└─ Phase Vortices: <span class="value">${metrics.vortices}</span></div>
        <div class="meta">Status: Closed-Loop Inversion Active & Regenerating</div>
      </div>
    </body>
    </html>
  `;

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(dashboardHTML);
}