import type { ThemeName } from '@/types';

export const THEME_STORAGE_KEY = 'cs:theme';
export const DEFAULT_THEME: ThemeName = 'dusk';

export interface ThemeMeta {
  name: ThemeName;
  label: string;
  caption: string;
  metaColor: string;
}

export const themes: Record<ThemeName, ThemeMeta> = {
  sunrise: { name: 'sunrise', label: 'Sunrise', caption: 'Early morning: clear sky, calm water', metaColor: '#E8F2F3' },
  dusk: { name: 'dusk', label: 'Dusk', caption: 'Blue hour, city lights on', metaColor: '#10182B' },
};

export function isThemeName(value: unknown): value is ThemeName {
  return value === 'sunrise' || value === 'dusk';
}

export function readStoredTheme(): ThemeName | null {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    const v = raw === 'sunset' ? 'sunrise' : raw; // the light theme was renamed
    return isThemeName(v) ? v : null;
  } catch {
    return null;
  }
}

export function storeTheme(theme: ThemeName) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* storage unavailable (private mode); theme still applies for this visit */
  }
}

/** Writes the theme to the DOM. Mirrors the inline script in index.html. */
export function applyThemeToDocument(theme: ThemeName) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme === 'dusk' ? 'dark' : 'light';
  document.getElementById('meta-theme-color')?.setAttribute('content', themes[theme].metaColor);
}
