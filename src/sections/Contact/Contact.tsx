import { useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, Check, Copy, FileText, Github, Linkedin, Mail, type LucideIcon } from 'lucide-react';
import { Scene } from '@/components/scene/Scene';
import { Logo } from '@/components/brand/Logo';
import { MagneticButton } from '@/components/buttons/MagneticButton';
import { profile } from '@/data/profile';
import type { SocialLink } from '@/types';
import { useGsap } from '@/hooks/useGsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/animations/gsap';
import { revealOnScroll } from '@/animations/transitions';
import { scrollToSection } from '@/animations/scroll';
import './Contact.css';

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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section ref={ref} id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact__scene" data-contact-scene>
        <Scene variant="horizon" idPrefix="contact" />
      </div>
      <div className="contact__shade" aria-hidden="true" />

      <div className="contact__content container-x">
        <p className="eyebrow contact__kicker" data-reveal>
          <span>Chapter 06</span>
          <span aria-hidden="true" className="inline-block h-px w-10 bg-current opacity-60" />
          <span>Final mission</span>
        </p>
        <h2 id="contact-title" className="display contact__title" data-contact-title>
          <span className="contact__line">
            <span data-contact-line>Let&rsquo;s build</span>
          </span>
          <span className="contact__line">
            <span data-contact-line>something worth</span>
          </span>
          <span className="contact__line">
            <span data-contact-line>remembering.</span>
          </span>
        </h2>
        <p className="contact__lede" data-reveal>
          Looking for someone to build your next application, improve your engineering workflow, or bring an idea
          to life? Let&rsquo;s talk.
        </p>

        <div className="contact__email" data-reveal>
          <MagneticButton variant="primary" href={`mailto:${profile.email}`} strength={0.2} className="contact__email-btn">
            <Mail size={18} aria-hidden="true" /> {profile.email}
          </MagneticButton>
          <button type="button" className="contact__copy" onClick={copy} aria-label={copied ? 'Email copied' : 'Copy email address'}>
            {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? 'Email address copied to clipboard' : ''}
          </span>
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
          href="#home"
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
