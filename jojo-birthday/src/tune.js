// "Happy Birthday" played with the browser's built-in synth, so no audio file is needed.
const NOTES = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
const BEAT = 0.42;
const SONG = [
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  ['G4', 0.75], ['G4', 0.25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
  ['F5', 0.75], ['F5', 0.25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2],
];

let ctx = null;

// Call from a click/submit so the browser lets us play sound later.
export function primeTune() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC || ctx) return;
  ctx = new AC();
  ctx.resume?.();
}

export function playTune() {
  primeTune();
  if (!ctx) return;
  const master = ctx.createGain();
  master.gain.value = 0.2;
  master.connect(ctx.destination);

  let t = ctx.currentTime + 0.1;
  for (const [note, beats] of SONG) {
    const dur = beats * BEAT;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = NOTES[note];
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(1, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.95);
    osc.connect(gain).connect(master);
    osc.start(t);
    osc.stop(t + dur);
    t += dur;
  }
}

export function stopTune() {
  ctx?.close();
  ctx = null;
}
