import { useEffect, useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { magnetic } from '@/animations/effects';

type Variant = 'primary' | 'ghost' | 'accent';

interface Common {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  strength?: number;
}

type AsLink = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

/** Pill button that drifts toward the pointer (fine pointers only). */
export function MagneticButton(props: AsLink | AsButton) {
  const { variant = 'primary', children, className = '', strength = 0.3, ...rest } = props;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => (ref.current ? magnetic(ref.current, strength) : undefined), [strength]);

  const cls = `btn btn-${variant} ${className}`;
  const inner = <span className="relative inline-flex items-center gap-2.5">{children}</span>;

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a ref={ref as React.RefObject<HTMLAnchorElement>} className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      className={cls}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {inner}
    </button>
  );
}
