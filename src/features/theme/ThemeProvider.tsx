import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { ThemeName } from '@/types';
import { DEFAULT_THEME, applyThemeToDocument, isThemeName, storeTheme } from './theme.config';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';

export interface ThemeContextValue {
  theme: ThemeName;
  /** Switch theme. `origin` (viewport coords) centers the reveal animation. */
  setTheme: (theme: ThemeName, origin?: { x: number; y: number }) => void;
  toggleTheme: (origin?: { x: number; y: number }) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function initialTheme(): ThemeName {
  // Build-time prerender (no DOM): use the default; the client render corrects it.
  if (typeof document === 'undefined') return DEFAULT_THEME;
  // The inline script in index.html has already resolved the saved preference.
  const attr = document.documentElement.getAttribute('data-theme');
  return isThemeName(attr) ? attr : DEFAULT_THEME;
}

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(initialTheme);

  const setTheme = useCallback<ThemeContextValue['setTheme']>((next, origin) => {
    if (next === document.documentElement.getAttribute('data-theme')) return;
    storeTheme(next);

    const commit = () => {
      flushSync(() => setThemeState(next));
      applyThemeToDocument(next);
    };

    if (prefersReducedMotion()) {
      commit();
      return;
    }

    const doc = document as ViewTransitionDoc;
    const root = document.documentElement;

    if (typeof doc.startViewTransition === 'function') {
      const x = origin?.x ?? window.innerWidth - 40;
      const y = origin?.y ?? 40;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      root.style.setProperty('--vt-x', `${x}px`);
      root.style.setProperty('--vt-y', `${y}px`);
      root.style.setProperty('--vt-r', `${r}px`);
      doc.startViewTransition(commit);
      return;
    }

    // Fallback: interpolate the registered color properties.
    root.classList.add('theme-animating');
    commit();
    window.setTimeout(() => root.classList.remove('theme-animating'), 950);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme: (origin) => setTheme(theme === 'sunrise' ? 'dusk' : 'sunrise', origin),
    }),
    [theme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
