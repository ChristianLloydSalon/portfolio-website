/**
 * Lets any section open a project's case study ("View case study" in Impact, project
 * tiles in the experiments collection). The Projects section listens and opens its overlay.
 */
const EVENT = 'cs:open-project';

export function openProject(id: string, trigger?: HTMLElement | null) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { id, trigger: trigger ?? null } }));
}

export function onOpenProject(handler: (id: string, trigger: HTMLElement | null) => void) {
  const listener = (e: Event) => {
    const { id, trigger } = (e as CustomEvent<{ id: string; trigger: HTMLElement | null }>).detail;
    handler(id, trigger);
  };
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
