import { lazy, Suspense, useEffect } from 'react';
import { loadPhone, openPhone, phoneStore, usePhone } from './phoneStore';

const Phone = lazy(loadPhone);

function isTyping(el: Element | null) {
  return !!el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement || (el as HTMLElement).isContentEditable);
}

/**
 * Mounts the phone chunk only after first use, and owns the keyboard shortcut:
 * P anywhere, or ↑ at the very top of the page (where ↑ has nothing left to scroll).
 * Ignored while typing, with modifier keys, or while another dialog is open.
 */
export function PhoneHost({ enabled }: { enabled: boolean }) {
  const { loaded } = usePhone();

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.repeat || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (phoneStore.get().open || isTyping(document.activeElement)) return;
      if (document.querySelector('[aria-modal="true"]:not([aria-hidden="true"])')) return;
      const atTop = window.scrollY < 4;
      if (e.key === 'p' || e.key === 'P' || (e.key === 'ArrowUp' && atTop)) {
        e.preventDefault();
        openPhone();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);

  if (!loaded) return null;
  return (
    <Suspense fallback={null}>
      <Phone />
    </Suspense>
  );
}
