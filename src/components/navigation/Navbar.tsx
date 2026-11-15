import { useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { navigation } from '@/data/navigation';
import { scrollToSection } from '@/animations/scroll';
import './Navigation.css';

interface Props {
  active: string;
  menuOpen: boolean;
  onMenuToggle: () => void;
  menuButtonRef: React.RefObject<HTMLButtonElement>;
}

export function Navbar({ active, menuOpen, onMenuToggle, menuButtonRef }: Props) {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const pastHero = y > window.innerHeight * 0.85;
        setSolid(pastHero);
        if (!pastHero) {
          setHidden(false);
          lastY.current = y;
          return;
        }
        // Smooth scrolling moves a few px per frame, so only react once the
        // scroll has travelled far enough in one direction; otherwise keep state.
        const dy = y - lastY.current;
        if (Math.abs(dy) < 12) return;
        setHidden(dy > 0);
        lastY.current = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const current = navigation.findIndex((n) => n.id === active);
  const item = navigation[Math.max(0, current)];

  return (
    <header
      className={`navbar ${solid ? 'is-solid' : ''} ${hidden && !menuOpen ? 'is-hidden' : ''} ${menuOpen ? 'is-menu' : ''}`}
    >
      <div className="navbar__inner container-x">
        <a
          href="#home"
          className="navbar__brand"
          aria-label="Christian Lloyd Salon, back to top"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
        >
          <Logo />
        </a>

        <p className="navbar__status eyebrow" aria-hidden="true">
          <span className="navbar__status-num">{String(Math.max(0, current) + 1).padStart(2, '0')}</span>
          <span aria-hidden="true" className="navbar__status-bar" />
          <span>{item.label}</span>
        </p>

        <div className="navbar__actions">
          <ThemeToggle className="navbar__theme" />
          <button
            ref={menuButtonRef}
            type="button"
            className={`menu-btn ${menuOpen ? 'is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={onMenuToggle}
          >
            <span className="menu-btn__label">{menuOpen ? 'Close' : 'Menu'}</span>
            <span className="menu-btn__icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
