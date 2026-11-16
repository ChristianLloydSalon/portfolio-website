import { useSyncExternalStore } from 'react';
import type { StationId } from './stations';

/**
 * Shared radio state: the navbar button reads it on every page; the wheel, toast and
 * audio engine (a lazy chunk) write it. Kept tiny so it costs nothing until used.
 */
interface RadioState {
  /** Station playing now; null = radio off. */
  station: StationId | null;
  /** Title of the track playing now (null when off). */
  track: string | null;
  wheelOpen: boolean;
  /** The wheel chunk has been requested at least once (mounts the lazy panel). */
  loaded: boolean;
}

let state: RadioState = { station: null, track: null, wheelOpen: false, loaded: false };
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
