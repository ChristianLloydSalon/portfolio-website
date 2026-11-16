import { useSyncExternalStore } from 'react';
import type { StationId } from './stations';

/**
 * Shared radio state: the navbar button and the phone read it on every page; the wheel,
 * the phone's Radio app and the audio engine (lazy chunks) write it. Kept tiny so it
 * costs nothing until used.
 */
interface RadioState {
  /** Station playing now; null = radio off. */
  station: StationId | null;
  /** Title of the track playing now (null when off). */
  track: string | null;
  /** Counts track starts, so the Now Playing toast fires even when a title repeats. */
  trackN: number;
  /** Last station played, so "play" in the phone resumes it. */
  last: StationId | null;
  wheelOpen: boolean;
  /** The wheel chunk has been requested at least once (mounts the lazy panel). */
  loaded: boolean;
  /** True while the phone is open: it shows what's playing, so no toast on top of it. */
  quiet: boolean;
}

let state: RadioState = { station: null, track: null, trackN: 0, last: null, wheelOpen: false, loaded: false, quiet: false };
const listeners = new Set<() => void>();

export const radioStore = {
  get: () => state,
  set(patch: Partial<RadioState>) {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useRadio() {
  return useSyncExternalStore(radioStore.subscribe, radioStore.get, radioStore.get);
}

/** Fetch the wheel + engine chunk ahead of the click (on hover / focus). */
export const loadRadioPanel = () => import('./RadioPanel');
