import { ChevronRight, Globe, Lock } from 'lucide-react';
import { navigation } from '@/data/navigation';
import { scrollToSection } from '@/animations/scroll';
import { SITE_URL } from '@/seo/site';

/**
 * In-world browser: a bookmarks page for the site's sections. A shortcut only; the same
 * sections are always reachable from the menu and the section indicator.
 */
export function BrowserApp({ onNavigate }: { onNavigate: () => void }) {
  const host = SITE_URL.replace(/^https?:\/\//, '');
  const go = (id: string) => {
    onNavigate();
    // Let the phone slide away and unlock scrolling first.
    window.setTimeout(() => scrollToSection(id), 450);
  };

  return (
    <div className="contacts browser">
      <p className="browser__url" aria-hidden="true">
        <Lock size={12} /> {host}
      </p>
      <h3 className="browser__heading">Bookmarks</h3>
      <ul className="contacts__list" role="list">
        {navigation
          .filter((n) => n.id !== 'home')
          .map((n) => (
            <li key={n.id} className="contacts__row">
              <button type="button" className="contacts__link browser__link" onClick={() => go(n.id)}>
                <Globe size={18} aria-hidden="true" />
                <span>
                  <span className="contacts__value">{n.label}</span>
                  <span className="contacts__label">{n.caption}</span>
                </span>
                <ChevronRight size={16} aria-hidden="true" className="browser__chev" />
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
