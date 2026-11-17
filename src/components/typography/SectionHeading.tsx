import type { ReactNode } from 'react';

interface Props {
  id: string;
  chapter: string;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  /** Replaces the default title size, for long statement-style titles. */
  titleClassName?: string;
}

/** Chapter-style heading: "CHAPTER 02 — FEATURED BUILDS" over a huge display title. */
export function SectionHeading({ id, chapter, kicker, title, intro, align = 'left', className = '', titleClassName }: Props) {
  const center = align === 'center';
  return (
    <header className={`${center ? 'text-center mx-auto' : ''} max-w-6xl ${className}`} data-reveal-group>
      <p className={`eyebrow flex items-center gap-3 text-ink-2 ${center ? 'justify-center' : ''}`} data-reveal>
        <span className="text-accent-ink">{chapter}</span>
        <span aria-hidden="true" className="inline-block h-px w-10 bg-current opacity-50" />
        <span>{kicker}</span>
      </p>
      <h2 id={id} className={`display mt-5 ${titleClassName ?? 'text-[clamp(3.4rem,11vw,10rem)]'}`} data-reveal>
        {title}
      </h2>
      {intro && (
        <p className={`mt-6 max-w-2xl text-lg text-ink-2 md:text-xl ${center ? 'mx-auto' : ''}`} data-reveal>
          {intro}
        </p>
      )}
    </header>
  );
}
