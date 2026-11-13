import { PENTATONIC_FREQS } from './constants';

class BalloonAudioEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private noteIndex = 0;

  private ensureContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public unlock() {
    this.ensureContext();
  }

  public playPopSound(isGolden = false) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Soft rubbery balloon pop pitch drop
    const popOsc = ctx.createOscillator();
    const popGain = ctx.createGain();
    popOsc.type = 'sine';
    const basePitch = 360 + Math.random() * 80;
    popOsc.frequency.setValueAtTime(basePitch, now);
    popOsc.frequency.exponentialRampToValueAtTime(basePitch * 1.9, now + 0.028);
    popOsc.frequency.exponentialRampToValueAtTime(110, now + 0.095);

    popGain.gain.setValueAtTime(0.001, now);
    popGain.gain.linearRampToValueAtTime(0.28, now + 0.01);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    popOsc.connect(popGain);
    popGain.connect(ctx.destination);
    popOsc.start(now);
    popOsc.stop(now + 0.12);

    // 2. Cheerful marimba / glockenspiel pentatonic chime
    const freq = PENTATONIC_FREQS[this.noteIndex % PENTATONIC_FREQS.length];
    this.noteIndex = (this.noteIndex + 1) % PENTATONIC_FREQS.length;

    const chimeOsc = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chimeOsc.type = 'triangle';
    chimeOsc.frequency.setValueAtTime(freq, now + 0.015);

    chimeGain.gain.setValueAtTime(0.001, now + 0.015);
    chimeGain.gain.linearRampToValueAtTime(0.22, now + 0.032);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

    chimeOsc.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chimeOsc.start(now + 0.015);
    chimeOsc.stop(now + 0.36);

    if (isGolden) {
      // Extra sparkle harmonic for golden Star Puppy
      const sparkleOsc = ctx.createOscillator();
      const sparkleGain = ctx.createGain();
      sparkleOsc.type = 'sine';
      sparkleOsc.frequency.setValueAtTime(freq * 1.5, now + 0.06);
      sparkleOsc.frequency.exponentialRampToValueAtTime(freq * 2, now + 0.25);

      sparkleGain.gain.setValueAtTime(0.001, now + 0.06);
      sparkleGain.gain.linearRampToValueAtTime(0.16, now + 0.09);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      sparkleOsc.connect(sparkleGain);
      sparkleGain.connect(ctx.destination);
      sparkleOsc.start(now + 0.06);
      sparkleOsc.stop(now + 0.44);
    }
  }

  public playSkyTapSound() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.07);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playStartChime() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99];
    const now = ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const t = now + idx * 0.07;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  public playCelebrationFanfare() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    const now = ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const t = now + idx * 0.085;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.48);
    });
  }
}

export const audioEngine = new BalloonAudioEngine();
