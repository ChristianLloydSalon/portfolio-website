import { useState } from 'react';
import { Check, Copy, FileText, Github, Linkedin, Mail, MessageCircle, type LucideIcon } from 'lucide-react';
import { profile } from '@/data/profile';
import type { SocialLink } from '@/types';
import { phoneStore } from '../phoneStore';

/** One contact card: Christian, with every way to get in touch. */

const ICONS: Partial<Record<SocialLink['kind'], LucideIcon>> = { linkedin: Linkedin, github: Github, resume: FileText };

export function ContactsApp() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the mailto link still works */
    }
  };

  return (
    <div className="contacts">
      <div className="contacts__card">
        <span className="phone-avatar phone-avatar--lg" aria-hidden="true">
          CS
        </span>
        <span className="contacts__name">{profile.name}</span>
        <span className="contacts__role">{profile.role}</span>
        <span className="contacts__loc">{profile.location}</span>
        <div className="contacts__quick">
          <button type="button" className="contacts__quickbtn" onClick={() => phoneStore.set({ app: 'messages' })}>
            <MessageCircle size={20} aria-hidden="true" />
            Message
          </button>
          <a className="contacts__quickbtn" href={`mailto:${profile.email}`}>
            <Mail size={20} aria-hidden="true" />
            Email
          </a>
        </div>
      </div>

      <ul className="contacts__list" role="list">
        <li className="contacts__row">
          <a className="contacts__link" href={`mailto:${profile.email}`}>
            <Mail size={18} aria-hidden="true" />
            <span>
              <span className="contacts__label">Email</span>
              <span className="contacts__value">{profile.email}</span>
            </span>
          </a>
          <button type="button" className="phone-iconbtn" aria-label={copied ? 'Email copied' : 'Copy email address'} onClick={copy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </li>
        {profile.socials.map((s) => {
          const Icon = ICONS[s.kind] ?? FileText;
          const external = s.href.startsWith('http');
          return (
            <li key={s.kind} className="contacts__row">
              <a className="contacts__link" href={s.href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                <Icon size={18} aria-hidden="true" />
                <span>
                  <span className="contacts__label">{s.label}</span>
                  <span className="contacts__value">{s.handle}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
