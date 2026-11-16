import type { StationId } from './stations';

/**
 * Radio audio engine. Every station is lo-fi synthwave synthesized live with the
 * Web Audio API: no audio files to download or license.
 *
 * Each station has its own instruments, drums, texture and ident (the sound you hear
 * as you tune in), and rotates through its own tracks; each track has its own tempo,
 * chords, groove, lead instrument and seeded melody (~1 minute each).
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
  /** AudioParam source (the tape-wobble LFO) connected to the oscillator's detune. */
  wobble?: AudioNode;
}

/** Sustained note: attack, hold, release. */
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
  osc.onended = () => o.wobble?.disconnect(osc.detune);
}

/** Struck note: instant attack, natural decay (pianos, plucks, bells). */
function struck(ctx: AudioContext, out: AudioNode, type: OscillatorType, freq: number, t: number, gain: number, decay: number, wobble?: AudioNode) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  if (wobble) wobble.connect(osc.detune);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.006);
  g.gain.setTargetAtTime(0, t + 0.006, decay / 3);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + decay * 1.6);
  osc.onended = () => wobble?.disconnect(osc.detune);
}

/** Short filtered noise hit. */
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

function kick(ctx: AudioContext, out: AudioNode, t: number, gain: number, low = 42, len = 0.38) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(low, t + 0.11);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + len + 0.02);
}

/** 80s gated snare: a burst of noise held, then cut dead. */
function gatedSnare(ctx: AudioContext, out: AudioNode, t: number, gain: number) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx);
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = 1300;
  f.Q.value = 0.5;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.setValueAtTime(gain * 0.6, t + 0.17);
  g.gain.linearRampToValueAtTime(0, t + 0.2);
  src.connect(f).connect(g).connect(out);
  src.start(t, Math.random());
  src.stop(t + 0.22);
  struck(ctx, out, 'triangle', 200, t, gain * 0.6, 0.08);
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

/** Looping filtered noise: ocean swell (slow LFO on its level) or steady rain. */
function texture(ctx: AudioContext, out: AudioNode, kind: 'ocean' | 'rain') {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx);
  src.loop = true;
  const f = ctx.createBiquadFilter();
  const g = ctx.createGain();
  const stops: (() => void)[] = [() => src.stop()];
  if (kind === 'ocean') {
    f.type = 'lowpass';
    f.frequency.value = 520;
    g.gain.value = 0.07;
    const lfo = ctx.createOscillator();
    const amt = ctx.createGain();
    lfo.frequency.value = 0.09; // one wave every ~11s
    amt.gain.value = 0.065;
    lfo.connect(amt).connect(g.gain);
    lfo.start();
    stops.push(() => lfo.stop());
  } else {
    f.type = 'highpass';
    f.frequency.value = 2200;
    g.gain.value = 0.03;
  }
  src.connect(f).connect(g).connect(out);
  src.start();
  return () => stops.forEach((s) => s());
}

/* ---------------------------------------------------------------- tracks */

type Lead = 'flute' | 'pluck' | 'ep' | 'chip' | 'bell' | 'felt' | 'glide';

interface Track {
  title: string;
  bpm: number;
  /** Four chords, one bar each (MIDI notes). */
  chords: number[][];
  /** Notes the melody may use (MIDI). */
  scale: number[];
  seed: number;
  lead: Lead;
  /** Rhythm variant (drums, bass, comping) within the station's style. */
  groove: 0 | 1 | 2 | 3;
}

const TRACKS: Record<StationId, Track[]> = {
  dusk: [
    { title: 'Panglao Sunset', bpm: 82, seed: 11, lead: 'flute', groove: 0, chords: [[53, 57, 60, 64], [55, 59, 62, 64], [52, 55, 59, 62], [57, 60, 64, 67]], scale: [69, 72, 74, 76, 79, 81] },
    { title: 'Chocolate Hills Drive', bpm: 88, seed: 23, lead: 'pluck', groove: 1, chords: [[49, 53, 56, 60], [48, 51, 55, 58], [53, 56, 60, 63], [46, 49, 53, 56]], scale: [65, 68, 70, 72, 75, 77] },
    { title: 'Loboc River Glow', bpm: 76, seed: 37, lead: 'ep', groove: 2, chords: [[48, 52, 55, 59], [45, 52, 55, 60], [50, 53, 57, 64], [43, 50, 53, 57]], scale: [72, 74, 76, 79, 81, 84] },
    { title: 'Alona Night Market', bpm: 92, seed: 41, lead: 'chip', groove: 3, chords: [[51, 55, 58, 62], [48, 51, 55, 58], [44, 51, 55, 60], [46, 53, 58, 62]], scale: [75, 77, 79, 82, 84, 87] },
  ],
  arch: [
    { title: 'Dependency Injection', bpm: 72, seed: 5, lead: 'bell', groove: 0, chords: [[50, 54, 57, 61], [47, 54, 57, 62], [43, 50, 54, 59], [45, 52, 54, 57]], scale: [74, 76, 78, 81, 83, 86] },
    { title: 'Pure Functions', bpm: 70, seed: 17, lead: 'felt', groove: 1, chords: [[45, 52, 55, 60], [52, 55, 59, 62], [53, 57, 60, 64], [48, 55, 59, 64]], scale: [69, 72, 74, 76, 79, 81] },
    { title: 'Layered Calm', bpm: 66, seed: 29, lead: 'flute', groove: 2, chords: [[51, 55, 58, 62], [43, 50, 53, 58], [44, 51, 55, 60], [46, 51, 53, 58]], scale: [75, 77, 79, 82, 84, 87] },
    { title: 'Immutable State', bpm: 74, seed: 31, lead: 'bell', groove: 3, chords: [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]], scale: [72, 74, 76, 79, 81, 84] },
  ],
  deploy: [
    { title: 'Hotfix at 3 AM', bpm: 96, seed: 3, lead: 'glide', groove: 0, chords: [[45, 52, 57, 60], [41, 53, 57, 60], [48, 52, 55, 60], [43, 50, 55, 59]], scale: [69, 72, 74, 76, 79, 81] },
    { title: 'Green Pipeline', bpm: 104, seed: 13, lead: 'chip', groove: 1, chords: [[52, 55, 59, 64], [48, 52, 55, 60], [43, 50, 55, 59], [50, 54, 57, 62]], scale: [76, 79, 81, 83, 86, 88] },
    { title: 'Merge Conflict', bpm: 94, seed: 19, lead: 'glide', groove: 2, chords: [[50, 53, 57, 62], [46, 53, 58, 62], [43, 50, 55, 58], [45, 52, 57, 61]], scale: [74, 77, 79, 81, 84, 86] },
    { title: 'Rollback Romance', bpm: 88, seed: 47, lead: 'pluck', groove: 3, chords: [[53, 56, 60, 65], [49, 53, 56, 61], [44, 51, 56, 60], [51, 55, 58, 63]], scale: [77, 80, 82, 84, 87, 89] },
  ],
};

/** Bars per track: intro 0–1, groove 2–9, full 10–19, outro 20–23. ~1 minute at these tempos. */
const BARS = 24;

/** A two-bar melody (32 sixteenth steps, null = rest), stepping mostly between neighbouring notes. */
function motif(track: Track) {
  const r = rng(track.seed);
  const notes: (number | null)[] = [];
  let idx = Math.floor(r() * track.scale.length);
  // Sustained leads play fewer, longer notes.
  const density = track.lead === 'flute' || track.lead === 'glide' ? 0.55 : 0.7;
  for (let i = 0; i < 32; i++) {
    const strong = i % 4 === 0;
    if (r() < (strong ? density : 0.16)) {
      idx = Math.min(track.scale.length - 1, Math.max(0, idx + Math.round((r() - 0.5) * 3)));
      notes.push(track.scale[idx]);
    } else notes.push(null);
  }
  return notes;
}

/* ---------------------------------------------------------------- station */

interface Playing {
  stop: () => void;
}

/**
 * Per-station mix: lowpass "tape" colour, swing, crackle level, wobble depth (cents),
 * and a level trim so switching stations doesn't jump in volume (balanced by measured RMS).
 */
const MIX: Record<StationId, { tone: number; swing: number; crackle: number; wobble: number; level: number }> = {
  dusk: { tone: 3200, swing: 0.18, crackle: 0.35, wobble: 6, level: 1 },
  arch: { tone: 1500, swing: 0.22, crackle: 0.85, wobble: 12, level: 0.8 },
  deploy: { tone: 6000, swing: 0, crackle: 0.12, wobble: 3, level: 1.65 },
};

function station(ctx: AudioContext, out: AudioNode, id: StationId, onTrack: (title: string) => void): Playing {
  const tracks = TRACKS[id];
  const mix = MIX[id];
  const stops: (() => void)[] = [];

  const master = ctx.createBiquadFilter();
  master.type = 'lowpass';
  master.frequency.value = mix.tone;
  master.Q.value = 0.5;
  const trim = ctx.createGain();
  trim.gain.value = mix.level;
  master.connect(trim).connect(out);

  // Tape wobble: a slow detune LFO shared by pitched instruments.
  const wob = ctx.createOscillator();
  const wobble = ctx.createGain();
  wob.frequency.value = 0.35;
  wobble.gain.value = mix.wobble;
  wob.connect(wobble);
  wob.start();
  stops.push(() => wob.stop());

  // Harmony bus. On Midnight Deploy it "pumps" (ducks under each kick), the synthwave signature.
  const harmony = ctx.createGain();
  harmony.connect(master);
  const drums = ctx.createGain();
  drums.connect(master);
  const keys = feedbackDelay(ctx, master, 0.3, 0.35, 0.35);
  const leadBus = feedbackDelay(ctx, master, 0.42, 0.42, 0.5, 2400);

  stops.push(crackle(ctx, out, mix.crackle));
  if (id === 'dusk') stops.push(texture(ctx, out, 'ocean'));
  if (id === 'arch') stops.push(texture(ctx, out, 'rain'));

  // Gliding saw lead: one oscillator that slides between notes.
  let glide: { osc: OscillatorNode; g: GainNode } | null = null;
  const glideNote = (freq: number, t: number, dur: number) => {
    if (!glide) {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1900;
      const g = ctx.createGain();
      g.gain.value = 0;
      wobble.connect(osc.detune);
      osc.connect(lp).connect(g).connect(leadBus);
      osc.frequency.value = freq;
      osc.start();
      glide = { osc, g };
      stops.push(() => osc.stop());
    }
    glide.osc.frequency.setTargetAtTime(freq, t, 0.035);
    glide.g.gain.setTargetAtTime(0.03, t, 0.015);
    glide.g.gain.setTargetAtTime(0, t + dur, 0.06);
  };

  const playLead = (lead: Lead, n: number, t: number, step: number) => {
    const f = mtof(n);
    switch (lead) {
      case 'flute':
        tone(ctx, leadBus, { type: 'sine', freq: f, t, dur: step * 3, gain: 0.07, attack: 0.07, release: 0.2, wobble });
        burst(ctx, leadBus, t, 0.08, 0.02, 'bandpass', f * 2, 3);
        break;
      case 'pluck':
        struck(ctx, leadBus, 'triangle', f, t, 0.1, 0.5, wobble);
        struck(ctx, leadBus, 'square', f, t, 0.025, 0.15);
        break;
      case 'ep':
        struck(ctx, leadBus, 'sine', f, t, 0.09, 1.2, wobble);
        struck(ctx, leadBus, 'sine', f * 2, t, 0.025, 0.35);
        break;
      case 'chip':
        tone(ctx, leadBus, { type: 'square', freq: f, t, dur: step * 0.9, gain: 0.022, release: 0.05 });
        break;
      case 'bell':
        struck(ctx, leadBus, 'sine', f, t, 0.07, 2.4, wobble);
        struck(ctx, leadBus, 'sine', f * 3.01, t, 0.012, 0.5);
        break;
      case 'felt':
        struck(ctx, leadBus, 'triangle', f, t, 0.09, 1.6, wobble);
        struck(ctx, leadBus, 'sine', f * 2, t, 0.02, 0.4);
        break;
      case 'glide':
        glideNote(f, t, step * 2.5);
        break;
    }
  };

  /** Electric piano: sine body + bright 2nd partial + tiny tine. */
  const ep = (n: number, t: number, g: number) => {
    const f = mtof(n);
    struck(ctx, harmony, 'sine', f, t, g, 1.4, wobble);
    struck(ctx, harmony, 'sine', f * 2, t, g * 0.25, 0.35, wobble);
    struck(ctx, harmony, 'sine', f * 7, t, g * 0.04, 0.08);
  };
  /** Soft felt piano for Clean Arch. */
  const felt = (n: number, t: number, g: number) => {
    struck(ctx, keys, 'triangle', mtof(n), t, g, 2.2, wobble);
    struck(ctx, keys, 'sine', mtof(n) * 2, t, g * 0.18, 0.5);
  };

  const pump = (t: number) => {
    harmony.gain.setValueAtTime(0.3, t);
    harmony.gain.linearRampToValueAtTime(1, t + 0.3);
  };

  /* ---- station idents: the first second you hear after the static ---- */
  const ident = (t: number, tr: Track) => {
    const c = tr.chords[0];
    if (id === 'dusk') c.forEach((n, k) => ep(n + 12, t + k * 0.05, 0.1));
    if (id === 'arch') {
      const s = tr.scale; // three falling bell notes in the track's key
      [s[s.length - 1], s[s.length - 3], s[1]].forEach((n, k) => playLead('bell', n, t + k * 0.28, 0.2));
    }
    if (id === 'deploy') {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(ctx);
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.Q.value = 3;
      f.frequency.setValueAtTime(300, t);
      f.frequency.exponentialRampToValueAtTime(6000, t + 0.9);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.85);
      g.gain.linearRampToValueAtTime(0, t + 0.95);
      src.connect(f).connect(g).connect(master);
      src.start(t);
      src.stop(t + 1);
      c.forEach((n) => tone(ctx, harmony, { type: 'sawtooth', freq: mtof(n), t: t + 0.95, dur: 1.2, gain: 0.03, attack: 0.005, release: 0.9 }));
      kick(ctx, drums, t + 0.95, 0.8);
    }
  };

  // Tune in mid-song on a random track, like a real station.
  let ti = Math.floor(Math.random() * tracks.length);
  let bar = 2 + Math.floor(Math.random() * 10);
  let pos = 0;
  let melody = motif(tracks[ti]);
  const timers: number[] = [];
  const start = ctx.currentTime + 0.1;
  ident(start, tracks[ti]);
  let next = start + 1.0; // music comes in under the ident's tail
  onTrack(tracks[ti].title);

  const schedule = (t: number, step: number) => {
    const tr = tracks[ti];
    const gv = tr.groove;
    const c = tr.chords[bar % 4];
    const root = c[0] - 12;
    const intro = bar < 2;
    const outro = bar >= 20;
    const full = bar >= 10 && !outro;
    const band = !intro && !outro; // drums + bass
    const sw = t + (pos % 2 === 1 ? step * mix.swing : 0);
    const barDur = step * 16;
    const fade = outro ? 1 - (bar - 19) / 5 : 1;

    if (id === 'dusk') {
      // Soft pad bed + electric-piano comping in a bouncy rhythm.
      if (pos === 0) c.forEach((n) => tone(ctx, harmony, { type: 'sawtooth', freq: mtof(n), t, dur: barDur + 0.2, gain: 0.009 * fade, attack: 0.5, release: 0.6, wobble }));
      const comp = [[0, 6], [0, 3, 10], [0, 8], [0, 6, 11]][gv];
      if (comp.includes(pos) && (pos === 0 || !intro)) c.forEach((n, k) => ep(n, t + k * 0.012, (pos === 0 ? 0.075 : 0.055) * fade));
      if (band) {
        const bassPos = [[0, 6, 8, 14], [0, 3, 8, 11], [0, 10], [0, 6, 10, 14]][gv];
        if (bassPos.includes(pos)) tone(ctx, master, { type: 'sine', freq: mtof(pos === 14 ? root + 12 : root), t: sw, dur: step * (pos === 0 && gv === 2 ? 8 : 2.4), gain: 0.28, release: 0.08 });
        const kicks = [[0, 8], [0, 7, 8], [0, 9], [0, 8, 11]][gv];
        if (kicks.includes(pos) || (gv === 0 && pos === 10 && bar % 4 === 3)) kick(ctx, drums, t, 0.8);
        if ((gv === 2 ? [8] : [4, 12]).includes(pos)) {
          burst(ctx, drums, t, 0.2, 0.24, 'bandpass', 1700, 0.7);
          struck(ctx, drums, 'triangle', 185, t, 0.13, 0.09);
        }
      }
      if (!outro && (pos % 2 === 0 || (!intro && Math.random() < 0.25))) burst(ctx, drums, sw, 0.045, pos % 4 === 2 ? 0.07 : 0.04, 'highpass', 7500);
      if (band) burst(ctx, drums, sw, 0.03, 0.012 + Math.random() * 0.012, 'highpass', 9000); // shaker
    }

    if (id === 'arch') {
      // Warm pad + slow broken-chord felt piano; deep sustained bass; brushy kit.
      if (pos === 0) {
        c.forEach((n, k) => tone(ctx, harmony, { type: k === 0 ? 'sine' : 'triangle', freq: mtof(n), t, dur: barDur + 1.5, gain: (k === 0 ? 0.05 : 0.02) * fade, attack: 1.2, release: 1.4, wobble }));
      }
      const broken = [
        [0, 4, 8, 12],
        [0, 3, 6, 10, 12],
        [0, 6, 8, 14],
        [0, 2, 4, 8, 10, 12],
      ][gv];
      const at = broken.indexOf(pos);
      if (at >= 0) felt(c[[0, 2, 1, 3, 2, 3][at % 6]] + 12, sw, 0.07 * fade);
      if (band && pos === 0) tone(ctx, master, { type: 'sine', freq: mtof(root), t, dur: step * 12, gain: 0.38, attack: 0.05, release: 0.6 });
      if (band && gv !== 2) {
        if (pos === 0 || pos === 9) kick(ctx, drums, t, 0.5, 46, 0.3);
        if (pos === 8) burst(ctx, drums, t, 0.05, 0.12, 'bandpass', 3200, 4); // rim click
      }
      if (!intro) burst(ctx, drums, sw, 0.035, 0.008 + Math.random() * 0.016, 'highpass', 6000); // shaker / brush
    }

    if (id === 'deploy') {
      // Big saw pads that pump under the kick; driving saw bass; four-on-the-floor.
      if (pos === 0) {
        for (const n of [...c, c[1] + 12]) {
          for (const det of [-10, 10]) tone(ctx, harmony, { type: 'sawtooth', freq: mtof(n), t, dur: barDur + 0.1, gain: 0.028 * fade, attack: 0.25, release: 0.4, detune: det, wobble });
        }
      }
      if (band) {
        const hit = [pos % 2 === 0, pos % 4 !== 1, pos % 4 === 2, pos % 2 === 0][gv];
        if (hit) {
          const n = gv === 0 && pos % 4 === 2 ? root + 12 : root;
          const osc = ctx.createOscillator();
          const lp = ctx.createBiquadFilter();
          const g = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.value = mtof(n);
          lp.type = 'lowpass';
          lp.frequency.setValueAtTime(1400, sw);
          lp.frequency.exponentialRampToValueAtTime(180, sw + step * 1.4);
          g.gain.setValueAtTime(0.42, sw);
          g.gain.exponentialRampToValueAtTime(0.0001, sw + step * 1.6);
          osc.connect(lp).connect(g).connect(master);
          osc.start(sw);
          osc.stop(sw + step * 1.7);
        }
        if (pos % 4 === 0) {
          kick(ctx, drums, t, 0.95, 40, 0.32);
          pump(t);
        }
        if (pos === 4 || pos === 12) gatedSnare(ctx, drums, t, 0.3);
        burst(ctx, drums, t, pos % 4 === 2 ? 0.16 : 0.035, pos % 4 === 2 ? 0.05 : 0.03, 'highpass', 8000);
      } else if (!outro && pos % 4 === 2) burst(ctx, drums, t, 0.16, 0.04, 'highpass', 8000);
      if (full || outro) {
        const order = [[0, 1, 2, 3], [3, 2, 1, 0], [0, 2, 1, 3], [0, 1, 2, 3, 2, 1]][gv];
        if (gv !== 2 || pos % 2 === 0) {
          const n = c[order[(gv === 2 ? pos / 2 : pos) % order.length]] + 24;
          tone(ctx, keys, { type: 'square', freq: mtof(n), t, dur: step * 0.7, gain: 0.014 * fade, release: 0.05 });
        }
      }
    }

    // Lead melody, full section only.
    if (full) {
      const n = melody[(bar % 2) * 16 + pos];
      if (n !== null) playLead(tr.lead, n, sw, step);
    }
  };

  const tick = () => {
    while (next < ctx.currentTime + 0.25) {
      const step = 60 / tracks[ti].bpm / 4;
      schedule(next, step);
      next += step;
      if (++pos === 16) {
        pos = 0;
        if (++bar === BARS) {
          bar = 0;
          ti = (ti + 1) % tracks.length;
          melody = motif(tracks[ti]);
          // A beat of air between tracks, then announce the new one as it starts.
          next += 60 / tracks[ti].bpm;
          const title = tracks[ti].title;
          timers.push(window.setTimeout(() => onTrack(title), Math.max(0, (next - ctx.currentTime) * 1000)));
        }
      }
    }
  };
  tick();
  const interval = window.setInterval(tick, 50);

  return {
    stop() {
      window.clearInterval(interval);
      timers.forEach((t) => window.clearTimeout(t));
      stops.forEach((s) => s());
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
  gain.gain.linearRampToValueAtTime(1, c.currentTime + 0.4);
  gain.connect(output!);
  current = { playing: station(c, gain, id, onTrack), gain };
}

export function stop() {
  if (!ctx || !current) return;
  fadeOut(current, ctx);
  current = null;
}
