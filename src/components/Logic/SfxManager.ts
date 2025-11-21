import * as Tone from 'tone';

class SfxManager {
  // private player: Tone.Player | null = null; // Unused
  private synth: Tone.MembraneSynth | null = null;
  private noise: Tone.NoiseSynth | null = null;

  constructor() {
    // Inicialización perezosa (se llama al primer click)
  }

  init() {
    if (this.synth) return;

    // Click suave UI (Membrane)
    this.synth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 2,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
    }).toDestination();
    this.synth.volume.value = -10;

    // Pasos (Noise burst)
    this.noise = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0 }
    }).toDestination();
    this.noise.volume.value = -20;
  }

  playClick() {
    this.init();
    this.synth?.triggerAttackRelease("C5", "32n");
  }

  playStep() {
    this.init();
    // Variación aleatoria para realismo
    if (Math.random() > 0.5) {
        this.noise?.triggerAttackRelease("32n", undefined, Math.random() * 0.1 + 0.5); // Velocity var
    }
  }
}

export const sfx = new SfxManager();
