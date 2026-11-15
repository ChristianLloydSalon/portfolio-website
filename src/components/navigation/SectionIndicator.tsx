import { navigation } from '@/data/navigation';
import { scrollToSection } from '@/animations/scroll';

export function SectionIndicator({ active }: { active: string }) {
  return (
    <nav className="section-indicator" aria-label="Sections">
      <ol>
        {navigation.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={active === item.id ? 'is-active' : ''}
              aria-current={active === item.id ? 'location' : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
              }}
            >
              <span className="section-indicator__label">
                <span className="opacity-60">{String(i + 1).padStart(2, '0')}</span> {item.label}
              </span>
              <span className="section-indicator__tick" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
