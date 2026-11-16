import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { navigation } from '@/data/navigation';
import { profile } from '@/data/profile';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { gsap } from '@/animations/gsap';
import { lockScroll, scrollToSection } from '@/animations/scroll';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface Props {
  open: boolean;
  active: string;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLElement>;
}

export function MenuOverlay({ open, active, onClose, returnFocusRef }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open, onClose, returnFocusRef);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    lockScroll('menu', open);
    const reduced = prefersReducedMotion();
    const links = el.querySelectorAll('[data-menu-item]');
    gsap.killTweensOf([el, links]);
    if (open) {
      gsap.set(el, { visibility: 'visible' });
      if (reduced) {
        gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)' });
        gsap.set(links, { yPercent: 0, opacity: 1 });
        return;
      }
      gsap.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'expo.inOut' });
      gsap.fromTo(links, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.05, delay: 0.3, ease: 'expo.out' });
    } else {
      if (reduced) {
        gsap.set(el, { visibility: 'hidden' });
        return;
      }
      gsap.to(el, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.6,
        ease: 'expo.inOut',
        onComplete: () => {
          gsap.set(el, { visibility: 'hidden' });
        },
      });
    }
  }, [open]);

  return (
    <div
      ref={ref}
      id="site-menu"
      className="menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      data-lenis-prevent
      // inert keeps hidden menu links out of the tab order
      {...(!open ? { inert: '' } : {})}
    >
      <div className="menu-overlay__glow" aria-hidden="true" />
      <div className="menu-overlay__inner container-x">
        <nav aria-label="Primary">
          <ol className="menu-list">
            {navigation.map((item, i) => (
              <li key={item.id} className="menu-list__row">
                <a
                  href={`#${item.id}`}
                  data-menu-item
                  className={`menu-link ${active === item.id ? 'is-active' : ''}`}
                  aria-current={active === item.id ? 'location' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    // Wait for the menu to start closing before scrolling.
                    window.setTimeout(() => scrollToSection(item.id), prefersReducedMotion() ? 0 : 350);
                  }}
                >
                  <span className="menu-link__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="menu-link__label display">{item.label}</span>
                  <span className="menu-link__caption eyebrow">{item.caption}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <aside className="menu-aside" data-menu-item>
          <div>
            <p className="eyebrow opacity-70">Theme</p>
            <ThemeToggle showLabel className="mt-3" />
          </div>
          <div>
            <p className="eyebrow opacity-70">Links</p>
            <ul className="mt-3 space-y-2">
              {profile.socials.map((s) => (
                <li key={s.kind}>
                  <a className="menu-social" href={s.href} target={s.kind === 'resume' ? undefined : '_blank'} rel="noreferrer">
                    {s.label} <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow opacity-70">Base</p>
            <p className="mt-3 font-mono text-sm">{profile.location}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
