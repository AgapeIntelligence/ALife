export class ALifeEngine {
  size: number;
  U: Float32Array;
  V: Float32Array;
  phase: Float32Array;
  
  // Dynamic metabolic fields instead of static constants
  F: Float32Array;
  K: Float32Array;

  constructor(size: number) {
    this.size = size;
    const n = size * size;

    this.U = new Float32Array(n).map(() => 1.0);
    this.V = new Float32Array(n).map(() => 0.0);
    this.phase = new Float32Array(n);
    
    // Baseline parameter fields
    this.F = new Float32Array(n).map(() => 0.035);
    this.K = new Float32Array(n).map(() => 0.065);

    // Initial chaotic spark to let emergence organize out of noise
    const center = Math.floor(size / 2);
    for (let y = center - 6; y < center + 6; y++) {
      for (let x = center - 6; x < center + 6; x++) {
        const idx = y * size + x;
        this.U[idx] = 0.5 + Math.random() * 0.1;
        this.V[idx] = 0.25 + Math.random() * 0.1;
      }
    }
  }

  /**
   * Pushes global topological constraints back down into the local phase space
   * @param agapeFeedback A spatial density field representing global system coherence
   */
  injectAgapeConstraints(agapeFeedback: Float32Array) {
    for (let i = 0; i < this.phase.length; i++) {
      const coherence = agapeFeedback[i];

      // Krystic Alignment: Scale local parameters based on systemic coherence.
      // High coherence stabilizes the field; high decay/chaos shifts parameter space 
      // to seek new stable organizational forms.
      this.F[i] = 0.02 + coherence * 0.025; 
      this.K[i] = 0.05 + (1.0 - coherence) * 0.02;
    }
  }

  step() {
    const n = this.U.length;
    const nextU = new Float32Array(n);
    const nextV = new Float32Array(n);
    const dt = 1.0;

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const i = y * this.size + x;
        const u = this.U[i];
        const v = this.V[i];
        const uvv = u * v * v;

        const lapU = this.laplace2D(x, y, this.U);
        const lapV = this.laplace2D(x, y, this.V);

        // Read dynamically generated local constraints
        const currentF = this.F[i];
        const currentK = this.K[i];

        // Reaction equations running on evolved parameter landscapes
        const nu = u + dt * (0.16 * lapU - uvv + currentF * (1.0 - u));
        const nv = v + dt * (0.08 * lapV + uvv - (currentF + currentK) * v);

        nextU[i] = this.clamp(nu);
        nextV[i] = this.clamp(nv);

        // The phase tracks the real-time evolutionary velocity of the cell
        const phaseDelta = (nextU[i] - nextV[i]) * 0.02;
        
        // Wrap phase rotation around a continuous U(1) circle (Möbius/Krystic proxy)
        this.phase[i] = (this.phase[i] + phaseDelta) % (2 * Math.PI);
      }
    }

    this.U = nextU;
    this.V = nextV;

    return { U: this.U, V: this.V, phase: this.phase };
  }

  private laplace2D(x: number, y: number, arr: Float32Array): number {
    const w = this.size;
    const xm = (x - 1 + w) % w;
    const xp = (x + 1) % w;
    const ym = (y - 1 + w) % w;
    const yp = (y + 1) % w;

    return arr[y * w + xm] + arr[y * w + xp] + arr[ym * w + x] + arr[yp * w + x] - 4 * arr[y * w + x];
  }

  private clamp(x: number) {
    return Math.max(0, Math.min(1, x));
  }
}