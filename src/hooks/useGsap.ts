import { useLayoutEffect, type DependencyList, type RefObject } from 'react';
import { gsap } from '@/animations/gsap';

/**
 * Runs GSAP code inside a scoped gsap.context and reverts every tween and
 * ScrollTrigger on cleanup (StrictMode-safe, no leaked triggers).
 */
export function useGsap(
  setup: (ctx: gsap.Context) => void | (() => void),
  scope: RefObject<HTMLElement | null>,
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    if (!scope.current) return;
    let extraCleanup: void | (() => void);
    const ctx = gsap.context((self) => {
      extraCleanup = setup(self);
    }, scope);
    return () => {
      if (typeof extraCleanup === 'function') extraCleanup();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
