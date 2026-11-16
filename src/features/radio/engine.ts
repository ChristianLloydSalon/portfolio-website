import type { StationId } from './stations';

/**
 * Radio audio engine. Every station is lo-fi synthwave synthesized live with the
 * Web Audio API: no audio files to download or license. Each station rotates through
 * its own tracks (tempo, chords, seeded melody, ~1 minute each).
 *
 * Loaded lazily with the wheel; the AudioContext is only created inside the click that
 * picks a station (a user gesture, so browsers allow sound).
 */

/* ---------------------------------------------------------------- building blocks */

const mtof = (m: number) => 440 * 2 ** ((m - 69) / 12);

/** Small deterministic RNG, so a track's melody is the same every time it plays. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let noise: AudioBuffer | null = null;
function noiseBuffer(ctx: AudioContext) {
  if (noise) return noise;
  noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noise;
}

interface ToneOpts {
  type: OscillatorType;
  freq: number;
  t: number;
  dur: number;
  gain: number;
  attack?: number;
  release?: number;
  detune?: number;
  /** AudioParam source (e.g. a wobble LFO) connected to the oscillator's detune. */
  wobble?: AudioNode;
}

/** One enveloped oscillator note. */
function tone(ctx: AudioContext, out: AudioNode, o: ToneOpts) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  const a = o.attack ?? 0.01;
  const r = o.release ?? 0.2;
  osc.type = o.type;
  osc.frequency.value = o.freq;
  osc.detune.value = o.detune ?? 0;
  if (o.wobble) o.wobble.connect(osc.detune);
  g.gain.setValueAtTime(0, o.t);
  g.gain.linearRampToValueAtTime(o.gain, o.t + a);
  g.gain.setValueAtTime(o.gain, o.t + Math.max(a, o.dur - r));
  g.gain.linearRampToValueAtTime(0, o.t + o.dur);
  osc.connect(g).connect(out);
  osc.start(o.t);
  osc.stop(o.t + o.dur + 0.05);
  osc.onended = () => {
    if (o.wobble) o.wobble.disconnect(osc.detune);
  };
}

/** Short filtered noise hit (hats, snares, static). */
function burst(ctx: AudioContext, out: AudioNode, t: number, dur: number, gain: number, filter: BiquadFilterType, freq: number, q = 0.8) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx);
  const f = ctx.createBiquadFilter();
  f.type = filter;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(out);
  src.start(t, Math.random() * 1.5);
  src.stop(t + dur + 0.02);
}

function kick(ctx: AudioContext, out: AudioNode, t: number, gain: number) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.frequency.setValueAtTime(140, t);
  osc.frequency.exponentialRampToValueAtTime(42, t + 0.12);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + 0.4);
}

function feedbackDelay(ctx: AudioContext, out: AudioNode, time: number, feedback: number, wet: number, tone = 2600) {
  const input = ctx.createGain();
  const delay = ctx.createDelay(2);
  delay.delayTime.value = time;
  const fb = ctx.createGain();
  fb.gain.value = feedback;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = tone;
  const w = ctx.createGain();
  w.gain.value = wet;
  input.connect(out); // dry
  input.connect(delay);
  delay.connect(lp).connect(fb).connect(delay);
  lp.connect(w).connect(out);
  return input;
}

/** Vinyl crackle + hiss bed, looping. */
function crackle(ctx: AudioContext, out: AudioNode, level: number) {
  const len = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    d[i] = (Math.random() * 2 - 1) * 0.02 + (Math.random() < 0.0006 ? (Math.random() * 2 - 1) * 0.9 : 0);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = 3000;
  f.Q.value = 0.4;
  const g = ctx.createGain();
  g.gain.value = level;
  src.connect(f).connect(g).connect(out);
  src.start();
  return () => src.stop();
}

/* ---------------------------------------------------------------- stations */

interface Track {
  title: string;
  bpm: number;
  /** Four chords, one bar each (MIDI notes). */
  chords: number[][];
  /** Notes the melody may use (MIDI). */
  scale: number[];
  seed: number;
}

/** A station's sound: how its drums, bass, arp and pads are played. */
interface Style {
  pad: OscillatorType;
  padGain: number;
  /** Lowpass on the whole station: lower = more muffled, more lo-fi. */
  tone: number;
  swing: number;
  crackle: number;
  drums: 'bap' | 'soft' | 'drive';
  bass: 'synco' | 'sparse' | 'eighths';
  arp: 'updown' | 'quarters' | 'sixteenths';
  lead: OscillatorType;
  tracks: Track[];
}

const STYLES: Record<StationId, Style> = {
  // 98.5 Bohol Dusk FM: warm tropical lo-fi, boom-bap drums, syncopated bass.
  dusk: {
    pad: 'sawtooth',
    padGain: 0.03,
    tone: 2600,
    swing: 0.16,
    crackle: 0.5,
    drums: 'bap',
    bass: 'synco',
    arp: 'updown',
    lead: 'square',
    tracks: [
      { title: 'Panglao Sunset', bpm: 82, seed: 11, chords: [[53, 57, 60, 64], [55, 59, 62, 64], [52, 55, 59, 62], [57, 60, 64, 67]], scale: [69, 72, 74, 76, 79, 81] },
      { title: 'Chocolate Hills Drive', bpm: 88, seed: 23, chords: [[49, 53, 56, 60], [48, 51, 55, 58], [53, 56, 60, 63], [46, 49, 53, 56]], scale: [65, 68, 70, 72, 75, 77] },
      { title: 'Loboc River Glow', bpm: 76, seed: 37, chords: [[48, 52, 55, 59], [45, 52, 55, 60], [50, 53, 57, 64], [43, 50, 53, 57]], scale: [72, 74, 76, 79, 81, 84] },
      { title: 'Alona Night Market', bpm: 92, seed: 41, chords: [[51, 55, 58, 62], [48, 51, 55, 58], [44, 51, 55, 60], [46, 53, 58, 62]], scale: [75, 77, 79, 82, 84, 87] },
    ],
  },
  // 104.2 Clean Arch Radio: slow and soft, sparse bass, gentle quarter-note arp.
  arch: {
    pad: 'triangle',
    padGain: 0.05,
    tone: 1700,
    swing: 0.2,
    crackle: 0.7,
    drums: 'soft',
    bass: 'sparse',
    arp: 'quarters',
    lead: 'sine',
    tracks: [
      { title: 'Dependency Injection', bpm: 72, seed: 5, chords: [[50, 54, 57, 61], [47, 54, 57, 62], [43, 50, 54, 59], [45, 52, 54, 57]], scale: [74, 76, 78, 81, 83, 86] },
      { title: 'Pure Functions', bpm: 70, seed: 17, chords: [[45, 52, 55, 60], [52, 55, 59, 62], [53, 57, 60, 64], [48, 55, 59, 64]], scale: [69, 72, 74, 76, 79, 81] },
      { title: 'Layered Calm', bpm: 74, seed: 29, chords: [[51, 55, 58, 62], [43, 50, 53, 58], [44, 51, 55, 60], [46, 51, 53, 58]], scale: [75, 77, 79, 82, 84, 87] },
      { title: 'Immutable State', bpm: 68, seed: 31, chords: [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]], scale: [72, 74, 76, 79, 81, 84] },
    ],
  },
  // 88.8 Midnight Deploy FM: darker minor keys, driving eighth-note bass, 16th arps.
  deploy: {
    pad: 'sawtooth',
    padGain: 0.026,
    tone: 3400,
    swing: 0.04,
    crackle: 0.3,
    drums: 'drive',
    bass: 'eighths',
    arp: 'sixteenths',
    lead: 'sawtooth',
    tracks: [
      { title: 'Hotfix at 3 AM', bpm: 96, seed: 3, chords: [[45, 52, 57, 60], [41, 53, 57, 60], [48, 52, 55, 60], [43, 50, 55, 59]], scale: [69, 72, 74, 76, 79, 81] },
      { title: 'Green Pipeline', bpm: 100, seed: 13, chords: [[52, 55, 59, 64], [48, 52, 55, 60], [43, 50, 55, 59], [50, 54, 57, 62]], scale: [76, 79, 81, 83, 86, 88] },
      { title: 'Merge Conflict', bpm: 94, seed: 19, chords: [[50, 53, 57, 62], [46, 53, 58, 62], [43, 50, 55, 58], [45, 52, 57, 61]], scale: [74, 77, 79, 81, 84, 86] },
      { title: 'Rollback Romance', bpm: 90, seed: 47, chords: [[53, 56, 60, 65], [49, 53, 56, 61], [44, 51, 56, 60], [51, 55, 58, 63]], scale: [77, 80, 82, 84, 87, 89] },
    ],
  },
};

/** Bars per track: intro 0–3, groove 4–11, full 12–19, outro 20–23. ~1 minute at these tempos. */
const BARS = 24;

/** A two-bar melody (32 sixteenth steps, null = rest), stepping mostly between neighbouring notes. */
function motif(track: Track) {
  const r = rng(track.seed);
  const notes: (number | null)[] = [];
  let idx = Math.floor(r() * track.scale.length);
  for (let i = 0; i < 32; i++) {
    const strong = i % 4 === 0;
    if (r() < (strong ? 0.7 : 0.18)) {
      idx = Math.min(track.scale.length - 1, Math.max(0, idx + Math.round((r() - 0.5) * 3)));
      notes.push(track.scale[idx]);
    } else notes.push(null);
  }
  return notes;
}

interface Playing {
  stop: () => void;
}

function station(ctx: AudioContext, out: AudioNode, s: Style, onTrack: (title: string) => void): Playing {
  // Whole-station lowpass = the lo-fi "tape" colour.
  const master = ctx.createBiquadFilter();
  master.type = 'lowpass';
  master.frequency.value = s.tone;
  master.Q.value = 0.5;
  master.connect(out);

  // Tape wobble: a slow detune LFO shared by pads and keys.
  const wob = ctx.createOscillator();
  const wobAmt = ctx.createGain();
  wob.frequency.value = 0.35;
  wobAmt.gain.value = 7;
  wob.connect(wobAmt);
  wob.start();

  const pads = ctx.createBiquadFilter();
  pads.type = 'lowpass';
  pads.frequency.value = 1300;
  pads.connect(master);
  const drums = ctx.createGain();
  drums.gain.value = 0.9;
  drums.connect(master);

  const stopCrackle = crackle(ctx, out, s.crackle);

  let ti = Math.floor(Math.random() * s.tracks.length); // tune in on a random track, like a real station
  let bar = 0;
  let pos = 0;
  let melody = motif(s.tracks[ti]);
  let next = ctx.currentTime + 0.12;
  const timers: number[] = [];
  onTrack(s.tracks[ti].title);

  const schedule = (t: number, step: number) => {
    const tr = s.tracks[ti];
    const c = tr.chords[bar % 4];
    const root = c[0] - 12;
    const intro = bar < 4;
    const outro = bar >= 20;
    const full = bar >= 12 && !outro;
    const swung = t + (pos % 2 === 1 ? step * s.swing : 0);
    const barDur = step * 16;

    // Pads: whole-bar chord, detuned pair per note.
    if (pos === 0) {
      const fade = outro ? 1 - (bar - 19) / 5 : 1;
      for (const n of c) {
        for (const det of [-8, 8]) {
          tone(ctx, pads, { type: s.pad, freq: mtof(n), t, dur: barDur + 0.2, gain: s.padGain * fade, attack: 0.45, release: 0.7, detune: det, wobble: wobAmt });
        }
      }
    }

    // Bass.
    if (!intro) {
      const b = (len: number, n = root, g = 0.3) => tone(ctx, master, { type: 'triangle', freq: mtof(n), t: swung, dur: step * len, gain: g, release: 0.08 });
      if (s.bass === 'synco' && [0, 6, 8, 14].includes(pos)) b(pos === 14 ? 1.6 : 2.6, pos === 14 ? root + 12 : root);
      if (s.bass === 'sparse' && (pos === 0 || pos === 10)) b(pos === 0 ? 8 : 3, root, 0.28);
      if (s.bass === 'eighths' && pos % 2 === 0) b(1.7, pos % 8 === 6 ? root + 12 : root, 0.24);
    }

    // Arp (full section and outro).
    if (full || outro) {
      const keys = (n: number, len: number, g: number, type: OscillatorType) =>
        tone(ctx, arpBus, { type, freq: mtof(n + 12), t: swung, dur: step * len, gain: g, release: 0.1, wobble: wobAmt });
      if (s.arp === 'updown' && pos % 2 === 0) keys(c[[0, 1, 2, 3, 2, 1, 2, 3][pos / 2]], 0.9, 0.022, 'square');
      if (s.arp === 'quarters' && pos % 4 === 0) keys(c[[0, 2, 1, 3][pos / 4]], 3.2, 0.04, 'triangle');
      if (s.arp === 'sixteenths') keys(c[pos % 4], 0.7, 0.018, 'square');
    }

    // Lead melody in the full section.
    if (full) {
      const n = melody[(bar % 2) * 16 + pos];
      if (n !== null) tone(ctx, leadBus, { type: s.lead, freq: mtof(n), t: swung, dur: step * 1.8, gain: s.lead === 'sine' ? 0.06 : 0.026, attack: 0.02, release: 0.25, wobble: wobAmt });
    }

    // Drums. Hats from the start; kick and snare from the groove; out for the outro.
    const hat = (g: number) => burst(ctx, drums, swung, 0.045, g, 'highpass', 7500);
    if (s.drums === 'drive') {
      if (!outro && (pos % 2 === 0 || !intro)) hat(pos % 4 === 2 ? 0.06 : 0.03);
    } else if (pos % 2 === 0 || (!intro && Math.random() < 0.2)) hat(pos % 4 === 2 ? 0.06 : 0.035);

    if (!intro && !outro) {
      if (s.drums === 'bap') {
        if (pos === 0 || pos === 8 || (pos === 10 && bar % 4 === 3)) kick(ctx, drums, t, 0.75);
        if (pos === 4 || pos === 12) {
          burst(ctx, drums, t, 0.2, 0.22, 'bandpass', 1700, 0.7);
          tone(ctx, drums, { type: 'triangle', freq: 185, t, dur: 0.09, gain: 0.12, release: 0.06 });
        }
      } else if (s.drums === 'soft') {
        if (pos === 0 || pos === 10) kick(ctx, drums, t, 0.55);
        if (pos === 8) burst(ctx, drums, t, 0.14, 0.12, 'bandpass', 2400, 1.2);
      } else {
        if (pos % 4 === 0) kick(ctx, drums, t, 0.55);
        if (pos === 4 || pos === 12) burst(ctx, drums, t, 0.32, 0.2, 'bandpass', 1500, 0.6);
      }
    }
  };

  const arpBus = feedbackDelay(ctx, master, 0.3, 0.38, 0.4);
  const leadBus = feedbackDelay(ctx, master, 0.45, 0.42, 0.5, 2200);

  const tick = () => {
    while (next < ctx.currentTime + 0.25) {
      const step = 60 / s.tracks[ti].bpm / 4;
      schedule(next, step);
      next += step;
      if (++pos === 16) {
        pos = 0;
        if (++bar === BARS) {
          bar = 0;
          ti = (ti + 1) % s.tracks.length;
          melody = motif(s.tracks[ti]);
          // A beat of air between tracks, then announce the new one as it starts.
          next += (60 / s.tracks[ti].bpm) * 1;
          const title = s.tracks[ti].title;
          timers.push(window.setTimeout(() => onTrack(title), Math.max(0, (next - ctx.currentTime) * 1000)));
        }
      }
    }
  };
  tick();
  const id = window.setInterval(tick, 50);

  return {
    stop() {
      window.clearInterval(id);
      timers.forEach((t) => window.clearTimeout(t));
      stopCrackle();
      wob.stop();
    },
  };
}

/* ---------------------------------------------------------------- engine */

let ctx: AudioContext | null = null;
let output: GainNode | null = null;
let current: { playing: Playing; gain: GainNode } | null = null;

function ensureContext() {
  if (!ctx) {
    ctx = new AudioContext();
    const comp = ctx.createDynamicsCompressor();
    output = ctx.createGain();
    output.gain.value = 0.55;
    output.connect(comp).connect(ctx.destination);
    document.addEventListener('visibilitychange', onVisibility);
  }
  if (ctx.state === 'suspended' && !document.hidden) void ctx.resume();
  return ctx;
}

/** Pause while the tab is hidden; pick up again when the visitor comes back. */
function onVisibility() {
  if (!ctx || !current) return;
  if (document.hidden) void ctx.suspend();
  else void ctx.resume();
}

/** The "between stations" static you hear while the dial moves. */
function tuneStatic(c: AudioContext) {
  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = 2;
  f.frequency.setValueAtTime(600, t);
  f.frequency.exponentialRampToValueAtTime(4200, t + 0.35);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.35, t + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
  src.connect(f).connect(g).connect(output!);
  src.start(t);
  src.stop(t + 0.45);
}

function fadeOut(entry: NonNullable<typeof current>, c: AudioContext) {
  const g = entry.gain.gain;
  g.cancelScheduledValues(c.currentTime);
  g.setValueAtTime(g.value, c.currentTime);
  g.linearRampToValueAtTime(0, c.currentTime + 0.3);
  entry.playing.stop();
  window.setTimeout(() => entry.gain.disconnect(), 400);
}

/** Tune to a station. onTrack fires with each track title as it starts. */
export function play(id: StationId, onTrack: (title: string) => void) {
  const c = ensureContext();
  if (current) fadeOut(current, c);
  tuneStatic(c);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(1, c.currentTime + 1.2);
  gain.connect(output!);
  current = { playing: station(c, gain, STYLES[id], onTrack), gain };
}

export function stop() {
  if (!ctx || !current) return;
  fadeOut(current, ctx);
  current = null;
}
