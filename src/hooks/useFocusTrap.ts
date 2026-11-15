import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab focus inside `container` while active, closes on Escape and
 * returns focus to `returnTo` (or the previously focused element) afterwards.
 *
 * Sets up once per activation. Callbacks are read through refs, so callers can pass
 * inline functions: a re-render (e.g. new dialog content) must not tear the trap down,
 * which would bounce focus out of the dialog and back.
 */
export function useFocusTrap(
  container: RefObject<HTMLElement>,
  active: boolean,
  onEscape: () => void,
  returnTo?: RefObject<HTMLElement>,
) {
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;
  const returnToRef = useRef(returnTo);
  returnToRef.current = returnTo;

  useEffect(() => {
    if (!active) return;
    const el = container.current;
    if (!el) return;
    const previous = document.activeElement as HTMLElement | null;

    const first = el.querySelector<HTMLElement>(FOCUSABLE);
    // Defer so the element is visible before focusing.
    const t = window.setTimeout(() => first?.focus({ preventScroll: true }), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscapeRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      (returnToRef.current?.current ?? previous)?.focus({ preventScroll: true });
    };
  }, [active, container]);
}
