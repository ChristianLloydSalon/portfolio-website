import { useSyncExternalStore } from 'react';

/**
 * Phone easter egg state. The navbar button and the keyboard shortcut live in the main
 * bundle and only touch this; the phone itself (apps, chat script, radio player) is a
 * lazy chunk, fetched on first intent.
 */
export type PhoneApp = 'home' | 'messages' | 'radio' | 'contacts';

interface PhoneState {
  open: boolean;
  /** The phone chunk has been requested at least once (mounts the lazy phone). */
  loaded: boolean;
  app: PhoneApp;
  /** A text is waiting in Messages until the visitor first opens it. */
  unread: boolean;
}

let state: PhoneState = { open: false, loaded: false, app: 'home', unread: true };
const listeners = new Set<() => void>();

export const phoneStore = {
  get: () => state,
  set(patch: Partial<PhoneState>) {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function usePhone() {
  return useSyncExternalStore(phoneStore.subscribe, phoneStore.get, phoneStore.get);
}

export const loadPhone = () => import('./Phone');

const SEEN_KEY = 'phone:read';

/** Remember (per browser) that the visitor has read the first text. */
export function markRead() {
  phoneStore.set({ unread: false });
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* storage blocked: the badge just comes back next visit */
  }
}

/** Called after hydration, so the prerendered HTML and the first client render agree. */
export function restoreRead() {
  try {
    if (localStorage.getItem(SEEN_KEY)) phoneStore.set({ unread: false });
  } catch {
    /* ignore */
  }
}

export function openPhone(app?: PhoneApp) {
  phoneStore.set({ loaded: true, open: true, ...(app ? { app } : {}) });
}
