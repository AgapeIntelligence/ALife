import { Feature } from "./mesoStructures";

export function generateAgapeFeedbackField(features: Feature[], size: number): Float32Array {
  const field = new Float32Array(size * size).fill(0.5); // Neutral baseline

  for (const f of features) {
    const idx = f.index;
    if (idx < 0 || idx >= field.length) continue;

    if (f.type === "COHERENCE_CLUSTER") {
      field[idx] += f.strength * 0.3; // Support integrated regions
    } else if (f.type === "VORTEX") {
      field[idx] -= f.strength * 0.2; // Counterbalance high chaotic spin
    } else if (f.type === "ENERGY_SHELL") {
      field[idx] += f.strength * 0.1; 
    }
  }

  return smoothField(field, size);
}

function smoothField(field: Float32Array, size: number): Float32Array {
  const smoothed = new Float32Array(field.length);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = y * size + x;
      const xm = (x - 1 + size) % size;
      const xp = (x + 1) % size;
      const ym = (y - 1 + size) % size;
      const yp = (y + 1) % size;

      smoothed[idx] = (
        field[idx] * 0.4 +
        (field[y * size + xm] + field[y * size + xp] + field[ym * size + x] + field[yp * size + x]) * 0.15
      );
    }
  }
  return smoothed;
}