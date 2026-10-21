/**
 * Short tactile console power-button chirp on click.
 */
export function playPowerSwitchSound(options?: { muted?: boolean }): void {
  if (options?.muted) return;
  if (typeof window === "undefined") return;

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;

  let ctx: AudioContext;
  try {
    ctx = new AudioCtx();
  } catch {
    return;
  }

  void ctx.resume().then(() => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    const t0 = ctx.currentTime;
    osc.frequency.setValueAtTime(520, t0);
    osc.frequency.exponentialRampToValueAtTime(880, t0 + 0.09);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.16, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.14);
    window.setTimeout(() => {
      void ctx.close();
    }, 300);
  });
}

/**
 * Original GameCube-inspired boot motif (synthesized via Web Audio API).
 * Synchronized with the 3D cube tumble and landing impact (~0.85s).
 */
export function playBootJingle(options?: { muted?: boolean }): void {
  if (options?.muted) return;
  if (typeof window === "undefined") return;

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;

  let ctx: AudioContext;
  try {
    ctx = new AudioCtx();
  } catch {
    return;
  }

  const master = ctx.createGain();
  master.gain.value = 0.24;
  master.connect(ctx.destination);

  // Sparkling marimba-like arpeggio during the 3D tumble, resolving on landing (~0.85s)
  const notes = [
    { freq: 392.0, start: 0.04, dur: 0.2 }, // G4
    { freq: 440.0, start: 0.18, dur: 0.2 }, // A4
    { freq: 493.88, start: 0.32, dur: 0.2 }, // B4
    { freq: 587.33, start: 0.46, dur: 0.22 }, // D5
    { freq: 659.25, start: 0.6, dur: 0.22 }, // E5
    { freq: 783.99, start: 0.78, dur: 0.9 }, // G5 (landing resolution)
  ];

  const playTone = (
    freq: number,
    start: number,
    dur: number,
    type: OscillatorType = "triangle",
    peak = 0.75
  ) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

    const t0 = ctx.currentTime + start;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(gain);
    gain.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  };

  void ctx.resume().then(() => {
    for (const note of notes) {
      playTone(note.freq, note.start, note.dur, "triangle", 0.8);
    }

    // Warm resonant chord + bass thump on cube landing (~0.78s)
    playTone(392.0, 0.78, 0.95, "sine", 0.35); // G4
    playTone(493.88, 0.78, 0.95, "sine", 0.3); // B4
    playTone(196.0, 0.78, 1.05, "sine", 0.45); // G3 bass pad

    // Subtle percussive sub-thump on impact
    const thump = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    const tImpact = ctx.currentTime + 0.78;
    thump.type = "sine";
    thump.frequency.setValueAtTime(140, tImpact);
    thump.frequency.exponentialRampToValueAtTime(42, tImpact + 0.22);
    thumpGain.gain.setValueAtTime(0.0001, tImpact);
    thumpGain.gain.exponentialRampToValueAtTime(0.55, tImpact + 0.015);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, tImpact + 0.26);
    thump.connect(thumpGain);
    thumpGain.connect(master);
    thump.start(tImpact);
    thump.stop(tImpact + 0.3);

    window.setTimeout(() => {
      void ctx.close();
    }, 2200);
  });
}
