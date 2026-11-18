import { useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, Check, Copy, FileText, Github, Linkedin, Mail, type LucideIcon } from 'lucide-react';
import { Scene } from '@/components/scene/Scene';
import { Logo } from '@/components/brand/Logo';
import { MagneticButton } from '@/components/buttons/MagneticButton';
import { profile } from '@/data/profile';
import { chapter } from '@/data/navigation';
import type { SocialLink } from '@/types';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/animations/gsap';
import { revealOnScroll } from '@/animations/transitions';
import { scrollToSection } from '@/animations/scroll';
import { copyEmail, gmailComposeUrl, mailtoUrl } from '@/lib/email';
import './Contact.css';
import { sectionPath } from '@/app/routes';

const ICON: Record<SocialLink['kind'], LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  resume: FileText,
  website: ArrowUpRight,
  x: ArrowUpRight,
};

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState(false);

  useGsap(
    () => {
      if (reduced) return;
      revealOnScroll(ref.current!);
      gsap.fromTo(
        '[data-contact-scene] [data-layer="sky"]',
        { yPercent: -10 },
        { yPercent: 6, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: true } },
      );
      gsap.from('[data-contact-line]', {
        yPercent: 105,
        duration: 1.3,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-contact-title]', start: 'top 80%', once: true },
      });
    },
    ref,
    [reduced],
  );

  // Copying on every email click means the visitor has the address even when their
  // machine has no mail app for mailto: to open.
  const copy = async () => {
    if (!(await copyEmail())) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 4000);
  };

  return (
    <section ref={ref} id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact__scene" data-contact-scene>
        <Scene variant="horizon" idPrefix="contact" />
      </div>
      <div className="contact__shade" aria-hidden="true" />

      <div className="contact__content container-x">
        <p className="eyebrow contact__kicker" data-reveal>
          <span>{chapter('contact')}</span>
          <span aria-hidden="true" className="inline-block h-px w-10 bg-current opacity-60" />
          <span>Final mission</span>
        </p>
        <h2 id="contact-title" className="display contact__title" data-contact-title>
          <span className="contact__line">
            <span data-contact-line>Have a problem</span>
          </span>
          <span className="contact__line">
            <span data-contact-line>worth solving?</span>
          </span>
          <span className="contact__line">
            <span data-contact-line>Let&rsquo;s build something.</span>
          </span>
        </h2>
        <p className="contact__lede" data-reveal>
          Happy to talk about a role or a project, whether it&rsquo;s a new product or an existing app that needs an
          engineer across mobile, web and backend. Email is the fastest way to reach me.
        </p>

        <div className="contact__email" data-reveal>
          <MagneticButton variant="primary" href={mailtoUrl()} onClick={copy} strength={0.2} className="contact__email-btn">
            <Mail size={18} aria-hidden="true" /> {profile.email}
          </MagneticButton>
          <button type="button" className="contact__copy" onClick={copy} aria-label={copied ? 'Email copied' : 'Copy email address'}>
            {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <a className="contact__copy" href={gmailComposeUrl()} target="_blank" rel="noreferrer">
            <ArrowUpRight size={18} aria-hidden="true" />
            <span>Open in Gmail</span>
          </a>
          <p className="contact__hint" aria-live="polite">
            {copied ? 'Address copied. If no email app opened, paste it into your email.' : ''}
          </p>
        </div>

        <ul className="contact__links" data-reveal>
          {profile.socials.map((s) => {
            const Icon = ICON[s.kind];
            const external = s.kind !== 'resume';
            return (
              <li key={s.kind}>
                <a className="contact__link" href={s.href} target="_blank" rel={external ? 'noreferrer' : undefined}>
                  <Icon size={22} aria-hidden="true" />
                  <span className="contact__link-text">
                    <span className="contact__link-label">{s.label}</span>
                    <span className="contact__link-handle">{s.handle}</span>
                  </span>
                  <ArrowUpRight className="contact__link-arrow" size={20} aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <footer className="contact__footer container-x">
        <Logo />
        <p className="eyebrow">
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <a
          href={sectionPath('home')}
          className="contact__top eyebrow"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
        >
          Back to top <ArrowUp size={14} aria-hidden="true" />
        </a>
      </footer>
    </section>
  );
}
