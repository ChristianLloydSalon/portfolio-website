import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Desktop layouts with a fine pointer get the heaviest scroll choreography. */
export const DESKTOP_QUERY = '(min-width: 1024px)';
export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';
