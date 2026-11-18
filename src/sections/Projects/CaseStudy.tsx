import { ArrowDown, ArrowRight, Plus } from 'lucide-react';
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

/**
 * The part of a case study that is always visible: what I personally delivered, the impact,
 * the key technical decisions, demos and how to get started. Each part renders only when it
 * has content. The deeper write-ups live in <CaseStudyDetails>.
 */
export function CaseStudyHighlights({ study }: { study: CaseStudy }) {
  const { contributions, impact, decisions, code } = study;
  const media = (study.media ?? [])
    .map((m) => ({ ...m, src: asset(m.asset) }))
    .filter((m): m is typeof m & { src: string } => !!m.src);
  if (!contributions?.length && !impact?.length && !decisions?.length && !media.length && !code?.length) return null;

  return (
    <div className="cs cs--lead" data-ov-swap>
      {contributions && (
        <section className="cs-block" aria-labelledby="cs-built">
          <div className="cs-block__head">
            <h3 id="cs-built" className="eyebrow text-ink-2">
              Key contributions
            </h3>
            <p className="cs-note">Work I delivered personally. The wider product was built by the team.</p>
          </div>
          <ol className="cs-built">
            {contributions.map((c, i) => (
              <li key={c.title} className="cs-built__item">
                <span className="cs-challenge__num">{String(i + 1).padStart(2, '0')}</span>
                <h4 className="display cs-built__title">{c.title}</h4>
                <ul className="cs-built__layers" aria-label="Layers involved">
                  {c.layers.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
                <p className="cs-built__body">{c.body}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {impact && (
        <section className="cs-block" aria-labelledby="cs-impact">
          <h3 id="cs-impact" className="eyebrow text-ink-2">
            Business &amp; operational impact
          </h3>
          <ul className="cs-impact">
            {impact.map((m) => (
              <li key={m.title}>
                <h4 className="display cs-impact__title">{m.title}</h4>
                <p>{m.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {decisions && (
        <section className="cs-block" aria-labelledby="cs-decisions">
          <h3 id="cs-decisions" className="eyebrow text-ink-2">
            Technical decisions
          </h3>
          <ol className="cs-decisions">
            {decisions.map((d, i) => (
              <li key={d.title}>
                <span className="cs-challenge__num">{String(i + 1).padStart(2, '0')}</span>
                <h4 className="cs-decisions__title">{d.title}</h4>
                <p>{d.why}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

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

      {code && (
        <section className="cs-block" aria-labelledby="cs-code">
          <h3 id="cs-code" className="eyebrow text-ink-2">
            Get started
          </h3>
          <div className="cs-code">
            {code.map((c) => (
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

/**
 * One collapsible part of the technical deep dive. Native <details>: keyboard and screen
 * reader support for free, works without JavaScript, and the prerendered page keeps the
 * full text for crawlers. The summary lists what's inside so it can be scanned closed.
 */
function Expandable({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <details className="cs-expand">
      <summary className="cs-expand__summary">
        <span className="cs-expand__text">
          <span className="display cs-expand__title">{title}</span>
          {hint && <span className="cs-expand__hint">{hint}</span>}
        </span>
        <Plus className="cs-expand__icon" size={20} aria-hidden="true" />
      </summary>
      <div className="cs-expand__body">{children}</div>
    </details>
  );
}

/**
 * The technical deep dive, collapsed by default: architecture, the detailed write-up of
 * each contribution grouped by area (with any workflows for that area), and engineering
 * challenges. Each part renders only when it has content.
 */
export function CaseStudyDetails({ study }: { study: CaseStudy }) {
  const { contributions = [], workflows = [], diagram, approach, architecture, challenges } = study;
  const areas = [...new Set(contributions.map((c) => c.area))];
  const looseWorkflows = workflows.filter((w) => !w.area || !areas.includes(w.area));
  const hasArchitecture = !!diagram || !!approach?.length || !!architecture?.length;
  if (!hasArchitecture && !areas.length && !looseWorkflows.length && !challenges?.length) return null;

  return (
    <section className="cs-details" aria-labelledby="cs-details-title" data-ov-swap>
      <div className="cs-block__head">
        <h3 id="cs-details-title" className="eyebrow text-ink-2">
          Technical deep dive
        </h3>
        <p className="cs-note">Open a section for the implementation details.</p>
      </div>

      {hasArchitecture && (
        <Expandable
          title="Architecture"
          hint={diagram ? 'How the layers fit together · Stack by layer' : architecture?.map((t) => t.title).join(' → ')}
        >
          {diagram && <LayerDiagram diagram={diagram} />}
          {approach && (
            <dl className="cs-approach">
              {approach.map((a) => (
                <div key={a.layer} className="cs-approach__row">
                  <dt>
                    <span className="cs-arch__title">{a.layer}</span>
                    <ul className="cs-approach__tools">
                      {a.tools.map((t) => (
                        <li key={t} className="chip">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </dt>
                  <dd>{a.why}</dd>
                </div>
              ))}
            </dl>
          )}
          {architecture && (
            <ol className="cs-arch" aria-label="Architecture, from left to right">
              {architecture.map((tier, i) => (
                <li key={tier.title} className="cs-arch__tier">
                  <span className="cs-arch__title">{tier.title}</span>
                  <ul>
                    {tier.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                  {i < architecture.length - 1 && <ArrowRight className="cs-arch__arrow" size={18} aria-hidden="true" />}
                </li>
              ))}
            </ol>
          )}
          {study.architectureNote && <p className="cs-note">{study.architectureNote}</p>}
        </Expandable>
      )}

      {areas.map((area) => {
        const items = contributions.filter((c) => c.area === area);
        const flows = workflows.filter((w) => w.area === area);
        return (
          <Expandable key={area} title={area} hint={items.map((c) => c.title).join(' · ')}>
            <ol className="cs-detail-list">
              {items.map((c) => (
                <li key={c.title} className="cs-detail">
                  <h4 className="cs-decisions__title">{c.title}</h4>
                  <dl className="cs-built__parts">
                    <div>
                      <dt className="cs-challenge__label">Challenge</dt>
                      <dd>{c.challenge}</dd>
                    </div>
                    <div>
                      <dt className="cs-challenge__label is-solution">Why it matters</dt>
                      <dd>{c.value}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ol>
            {flows.length > 0 && <Workflows workflows={flows} />}
          </Expandable>
        );
      })}

      {looseWorkflows.length > 0 && (
        <Expandable title="Workflows" hint={looseWorkflows.map((w) => w.title).join(' · ')}>
          <Workflows workflows={looseWorkflows} />
        </Expandable>
      )}

      {challenges && (
        <Expandable title="Engineering challenges" hint={challenges.map((c) => c.title).join(' · ')}>
          <ol className="cs-challenges">
            {challenges.map((c, i) => (
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
        </Expandable>
      )}
    </section>
  );
}

function LayerDiagram({ diagram }: { diagram: NonNullable<CaseStudy['diagram']> }) {
  return (
    <figure className="cs-diagram">
      <ul className="cs-diagram__row is-clients" aria-label="Client applications">
        {diagram.clients.map((n) => (
          <li key={n.label} className="cs-diagram__node">
            <span className="cs-diagram__label">{n.label}</span>
            <span className="cs-diagram__detail">{n.detail}</span>
          </li>
        ))}
      </ul>
      <ArrowDown className="cs-diagram__arrow" size={20} aria-hidden="true" />
      <div className="cs-diagram__node is-core">
        <span className="cs-diagram__label">{diagram.core.label}</span>
        <span className="cs-diagram__detail">{diagram.core.detail}</span>
      </div>
      <ArrowDown className="cs-diagram__arrow" size={20} aria-hidden="true" />
      <ul className="cs-diagram__row is-services" aria-label={`Services used by ${diagram.core.label.toLowerCase()}`}>
        {diagram.services.map((n) => (
          <li key={n.label} className="cs-diagram__node">
            <span className="cs-diagram__label">{n.label}</span>
            <span className="cs-diagram__detail">{n.detail}</span>
          </li>
        ))}
      </ul>
      <figcaption className="cs-note">{diagram.caption}</figcaption>
    </figure>
  );
}

function Workflows({ workflows }: { workflows: NonNullable<CaseStudy['workflows']> }) {
  return (
    <div className="cs-workflows">
      {workflows.map((w) => (
        <article key={w.title} className="cs-workflow">
          <header>
            <h4 className="display cs-built__title">{w.title}</h4>
            <span className="cs-workflow__tool">{w.tool}</span>
          </header>
          <ol className="cs-workflow__steps">
            {w.steps.map((st) => (
              <li key={st}>{st}</li>
            ))}
          </ol>
          {w.comparison && <WorkflowComparison comparison={w.comparison} />}
          <p className="cs-note">{w.note}</p>
        </article>
      ))}
    </div>
  );
}

type Comparison = NonNullable<NonNullable<CaseStudy['workflows']>[number]['comparison']>;

/** Before/after bars, scaled to the larger value. */
function WorkflowComparison({ comparison }: { comparison: Comparison }) {
  const { before, after, basis } = comparison;
  const max = Math.max(before.hours, after.hours);
  return (
    <figure className="cs-compare">
      <figcaption className="cs-challenge__label">Manual regression time per cycle</figcaption>
      {[before, after].map((b, i) => (
        <div key={b.label} className="cs-compare__row">
          <span className="cs-compare__label">{b.label}</span>
          <span className="cs-compare__track" aria-hidden="true">
            <span className={`cs-compare__bar${i === 1 ? ' is-after' : ''}`} style={{ width: `${(b.hours / max) * 100}%` }} />
          </span>
          <span className="cs-compare__value">{b.value}</span>
        </div>
      ))}
      <span className={`cs-basis is-${basis}`}>{BASIS_LABEL[basis]}</span>
    </figure>
  );
}

/** Discreet confidentiality note at the very end of the case study. */
export function CaseStudyDisclaimer({ text }: { text: string }) {
  return (
    <p className="cs-disclaimer" data-ov-swap>
      {text}
    </p>
  );
}
