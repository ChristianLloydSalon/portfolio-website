import { Moon, Sun } from 'lucide-react';
import { useTheme } from './useTheme';
import { themes } from './theme.config';
import './ThemeToggle.css';

interface Props {
  /** Show the theme name next to the switch. */
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ showLabel = false, className = '' }: Props) {
  const { theme, toggleTheme } = useTheme();
  const isDusk = theme === 'dusk';
  const nextLabel = isDusk ? themes.sunrise.label : themes.dusk.label;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDusk}
      aria-label={`Dusk theme. Currently ${themes[theme].label}. Switch to ${nextLabel}.`}
      title={`Switch to ${nextLabel}`}
      className={`theme-toggle ${className}`}
      data-theme-state={theme}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__icon theme-toggle__icon--sun"><Sun size={14} strokeWidth={2.4} /></span>
        <span className="theme-toggle__icon theme-toggle__icon--moon"><Moon size={14} strokeWidth={2.4} /></span>
        <span className="theme-toggle__thumb" />
      </span>
      {showLabel && (
        <span className="theme-toggle__label" aria-hidden="true">
          {themes[theme].label}
        </span>
      )}
    </button>
  );
}
