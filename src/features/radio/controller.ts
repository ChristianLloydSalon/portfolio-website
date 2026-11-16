import * as engine from './engine';
import { radioStore } from './radioStore';
import type { StationId } from './stations';

/**
 * The one way to change what's playing, shared by the navbar wheel and the phone's
 * Radio app, so both always agree. Lazy (it pulls in the audio engine): only the
 * wheel and phone chunks import it.
 */

const onTrack = (title: string) => radioStore.set({ track: title, trackN: radioStore.get().trackN + 1 });

/** Tune to a station: mid-song like a real radio, or from the top of `track`. */
export function tune(id: StationId, track?: number) {
  // `loaded` mounts the toast host, so track changes announce themselves after the phone closes.
  radioStore.set({ station: id, last: id, loaded: true });
  engine.play(id, onTrack, track);
}

export function turnOff() {
  engine.stop();
  radioStore.set({ station: null, track: null });
}

export const { skip, jumpTo, progress, levels, trackTitles } = engine;
