import { ArrowRight } from 'lucide-react';
import type { CaseStudy } from '@/types';
import { asset } from '@/lib/assets';
import { BASIS_LABEL } from './projectStatus';
import './CaseStudy.css';

/** Headline numbers, shown right under the project details so they're seen first. */
export function CaseStudyResults({ results }: { results: NonNullable<CaseStudy['results']> }) {
  return (
    <section className="cs-results" aria-label="Results" data-ov-swap>
      <ul>
        {results.map((r) => (
          <li key={r.label}>
            <span className="display cs-results__value">{r.value}</span>
            <span className="cs-results__label">{r.label}</span>
            <span className={`cs-basis is-${r.basis}`}>{BASIS_LABEL[r.basis]}</span>
            {r.source && <span className="cs-results__source">Source: {r.source}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Context, problem and solution: why the software exists, before how it was built. */
export function CaseStudyBrief({ context, problem, solution }: { context?: string; problem: string; solution?: string }) {
  const parts = [
    { key: 'context', label: 'Business context', text: context },
    { key: 'problem', label: 'The problem', text: problem },
    { key: 'solution', label: 'The solution', text: solution },
  ].filter((p): p is typeof p & { text: string } => !!p.text);
  return (
    <section className="cs-brief" aria-label="The business case" data-ov-swap>
      <ol>
        {parts.map((p) => (
          <li key={p.key} className={`cs-brief__part is-${p.key}`}>
            <h3 className="eyebrow cs-brief__label">{p.label}</h3>
            <p>{p.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Technical decisions (with the reasoning) and the operational impact. */
export function CaseStudyDecisions({ study }: { study: CaseStudy }) {
  if (!study.decisions?.length && !study.impact?.length) return null;
  return (
    <div className="cs cs--lead" data-ov-swap>
      {study.decisions && (
        <section className="cs-block" aria-labelledby="cs-decisions">
          <h3 id="cs-decisions" className="eyebrow text-ink-2">
            Technical decisions
          </h3>
          <ol className="cs-decisions">
            {study.decisions.map((d, i) => (
              <li key={d.title}>
                <span className="cs-challenge__num">{String(i + 1).padStart(2, '0')}</span>
                <h4 className="cs-decisions__title">{d.title}</h4>
                <p>{d.why}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
      {study.impact && (
        <section className="cs-block" aria-labelledby="cs-impact">
          <h3 id="cs-impact" className="eyebrow text-ink-2">
            Business &amp; operational impact
          </h3>
          <ul className="cs-impact">
            {study.impact.map((m) => (
              <li key={m.title}>
                <h4 className="display cs-impact__title">{m.title}</h4>
                <p>{m.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/** Demos, architecture, challenges and code. Each part renders only when it has content. */
export function CaseStudySections({ study }: { study: CaseStudy }) {
  const media = (study.media ?? [])
    .map((m) => ({ ...m, src: asset(m.asset) }))
    .filter((m): m is typeof m & { src: string } => !!m.src);

  return (
    <div className="cs" data-ov-swap>
      {media.length > 0 && (
        <section className="cs-block" aria-labelledby="cs-demos">
          <h3 id="cs-demos" className="eyebrow text-ink-2">
            Demos
          </h3>
          <ul className="cs-media">
            {media.map((m) => (
              <li key={m.asset}>
                <figure>
                  <div className="cs-media__frame">
                    <img src={m.src} alt={m.alt} loading="lazy" decoding="async" />
                  </div>
                  <figcaption>{m.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      )}

      {study.architecture && (
        <section className="cs-block" aria-labelledby="cs-arch">
          <h3 id="cs-arch" className="eyebrow text-ink-2">
            Architecture
          </h3>
          <ol className="cs-arch" aria-label="Architecture, from left to right">
            {study.architecture.map((tier, i) => (
              <li key={tier.title} className="cs-arch__tier">
                <span className="cs-arch__title">{tier.title}</span>
                <ul>
                  {tier.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                {i < study.architecture!.length - 1 && <ArrowRight className="cs-arch__arrow" size={18} aria-hidden="true" />}
              </li>
            ))}
          </ol>
          {study.architectureNote && <p className="cs-note">{study.architectureNote}</p>}
        </section>
      )}

      {study.challenges && (
        <section className="cs-block" aria-labelledby="cs-challenges">
          <h3 id="cs-challenges" className="eyebrow text-ink-2">
            Engineering challenges
          </h3>
          <ol className="cs-challenges">
            {study.challenges.map((c, i) => (
              <li key={c.title} className="cs-challenge">
                <span className="cs-challenge__num">{String(i + 1).padStart(2, '0')}</span>
                <h4 className="display cs-challenge__title">{c.title}</h4>
                <p>
                  <span className="cs-challenge__label">Problem</span>
                  {c.problem}
                </p>
                <p>
                  <span className="cs-challenge__label is-solution">Solution</span>
                  {c.solution}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {study.code && (
        <section className="cs-block" aria-labelledby="cs-code">
          <h3 id="cs-code" className="eyebrow text-ink-2">
            Get started
          </h3>
          <div className="cs-code">
            {study.code.map((c) => (
              <figure key={c.label}>
                <figcaption>{c.label}</figcaption>
                <pre>
                  <code>{c.code}</code>
                </pre>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
