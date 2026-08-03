/**
 * Original short boot motif (not the Nintendo GameCube jingle).
 * Must be called from a user gesture so AudioContext can start.
 * Tempo stretched to sit under the cube fall (~15% snappier than prior tuning).
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
  master.gain.value = 0.22;
  master.connect(ctx.destination);

  // Ascending four-note motif — same pitches, stretched timing for the longer fall.
  const notes = [
    { freq: 392.0, start: 0.0, dur: 0.24 }, // G4
    { freq: 493.88, start: 0.21, dur: 0.24 }, // B4
    { freq: 587.33, start: 0.43, dur: 0.24 }, // D5
    { freq: 783.99, start: 0.7, dur: 0.74 }, // G5
  ];

  const playTone = (freq: number, start: number, dur: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

    const t0 = ctx.currentTime + start;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.85, t0 + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(gain);
    gain.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  };

  void ctx.resume().then(() => {
    for (const note of notes) {
      playTone(note.freq, note.start, note.dur);
    }
    // Soft harmonic pad under the last note
    const pad = ctx.createOscillator();
    const padGain = ctx.createGain();
    pad.type = "sine";
    pad.frequency.setValueAtTime(196.0, ctx.currentTime + 0.68);
    padGain.gain.setValueAtTime(0.0001, ctx.currentTime + 0.68);
    padGain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.75);
    padGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.55);
    pad.connect(padGain);
    padGain.connect(master);
    pad.start(ctx.currentTime + 0.68);
    pad.stop(ctx.currentTime + 1.65);

    window.setTimeout(() => {
      void ctx.close();
    }, 2000);
  });
}
