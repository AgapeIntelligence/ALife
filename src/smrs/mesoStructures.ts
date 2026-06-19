export type Feature = {
  type: string;
  index: number;
  strength: number;
};

export function detectMesostructures(
  U: Float32Array,
  V: Float32Array,
  phase: Float32Array
): Feature[] {
  const features: Feature[] = [];

  for (let i = 1; i < U.length - 1; i++) {
    const uVar = Math.abs(U[i] - U[i - 1]);
    const vVar = Math.abs(V[i] - V[i - 1]);
    const coherence = 1 - Math.abs(U[i] - V[i]);

    // COHERENCE CLUSTER
    if (coherence > 0.85) {
      features.push({
        type: "COHERENCE_CLUSTER",
        index: i,
        strength: coherence
      });
    }

    // VORTEX (Phase Curl Proxy)
    const phaseCurl = phase[i + 1] - 2 * phase[i] + phase[i - 1];
    if (Math.abs(phaseCurl) > 0.2) {
      features.push({
        type: "VORTEX",
        index: i,
        strength: Math.min(1, Math.abs(phaseCurl))
      });
    }

    // ENERGY SHELL
    if (uVar + vVar > 0.5) {
      features.push({
        type: "ENERGY_SHELL",
        index: i,
        strength: Math.min(1, uVar + vVar)
      });
    }
  }

  return features;
}