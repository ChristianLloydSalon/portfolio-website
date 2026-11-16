import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BatteryFull, ChevronLeft, Contact, MessageCircle, Radio, Signal, Wifi, X, type LucideIcon } from 'lucide-react';
import { gsap } from '@/animations/gsap';
import { lockScroll } from '@/animations/scroll';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import { radioStore, useRadio } from '@/features/radio/radioStore';
import { stationById } from '@/features/radio/stations';
import { phoneStore, usePhone, type PhoneApp } from './phoneStore';
import { MessagesApp } from './apps/MessagesApp';
import { RadioApp } from './apps/RadioApp';
import { ContactsApp } from './apps/ContactsApp';
import './Phone.css';

/**
 * Lazy chunk: the in-world phone. A drawn handset in the corner on wider screens; on
 * phones (under 640px) the real screen becomes the phone, full screen, no frame.
 */

const MOBILE = '(max-width: 639px)';

const APPS: { id: Exclude<PhoneApp, 'home'>; name: string; icon: LucideIcon }[] = [
  { id: 'messages', name: 'Messages', icon: MessageCircle },
  { id: 'radio', name: 'Radio', icon: Radio },
  { id: 'contacts', name: 'Contacts', icon: Contact },
];
const TITLES: Record<PhoneApp, string> = { home: 'Home', messages: 'Christian', radio: 'Radio', contacts: 'Contacts' };

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}

function StatusBar({ now }: { now: Date }) {
  return (
    <div className="phone-status" aria-hidden="true">
      <span className="phone-status__time">{now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M$/i, '')}</span>
      <span className="phone-status__island" />
      <span className="phone-status__icons">
        <Signal size={13} strokeWidth={2.6} />
        <Wifi size={13} strokeWidth={2.6} />
        <BatteryFull size={17} strokeWidth={2} />
      </span>
    </div>
  );
}

function Home({ now, onClose }: { now: Date; onClose: () => void }) {
  const { unread } = usePhone();
  const { station, track } = useRadio();
  const playing = station ? stationById(station) : null;

  return (
    <div className="phone-home">
      <span className="phone-home__wall" aria-hidden="true">
        <span className="phone-home__sun" />
        <span className="phone-home__grid" />
      </span>
      <button type="button" className="phone-iconbtn phone-home__close" aria-label="Close phone" onClick={onClose}>
        <X size={18} />
      </button>
      <div className="phone-home__clock" aria-hidden="true">
        <span className="phone-home__date">{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        <span className="phone-home__time">{now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M$/i, '')}</span>
      </div>

      {playing && (
        <button type="button" className="phone-widget" onClick={() => phoneStore.set({ app: 'radio' })}>
          <span className={`phone-widget__art phone-art--${playing.id}`} aria-hidden="true" />
          <span className="phone-widget__text">
            <span className="phone-widget__eyebrow">Now playing · {playing.freq}</span>
            <span className="phone-widget__title">{track ?? playing.name}</span>
          </span>
          <span className="phone-eq" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      )}

      <ul className="phone-apps" role="list">
        {APPS.map(({ id, name, icon: Icon }) => {
          const badge = id === 'messages' && unread;
          return (
            <li key={id}>
              <button
                type="button"
                className="phone-app"
                aria-label={badge ? `${name}, 1 new message` : name}
                data-autofocus={id === 'messages' ? true : undefined}
                onClick={() => phoneStore.set({ app: id })}
              >
                <span className={`phone-app__icon phone-app__icon--${id}`} aria-hidden="true">
                  <Icon size={26} strokeWidth={2} />
                  {badge && <span className="phone-app__badge">1</span>}
                </span>
                <span className="phone-app__name" aria-hidden="true">
                  {name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="phone-home__hint" aria-hidden="true">
        <b>P</b> opens · <b>Esc</b> closes
      </p>
    </div>
  );
}

export default function Phone() {
  const { open, app } = usePhone();
  const mobile = useMediaQuery(MOBILE);
  const now = useClock();
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => phoneStore.set({ open: false }), []);
  const goHome = useCallback(() => phoneStore.set({ app: 'home' }), []);
  // Esc backs out of an app first, then closes, like a phone's back button.
  const onEscape = useCallback(() => (phoneStore.get().app === 'home' ? close() : goHome()), [close, goHome]);

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.querySelector<HTMLElement>('[data-phone-btn]');
    setMounted(true);
  }, [open]);

  useFocusTrap(overlayRef, mounted && open, onEscape, returnTo);

  // Switching apps replaces the focused control: move focus into the new screen.
  const shownApp = useRef(app);
  useEffect(() => {
    if (shownApp.current === app) return;
    shownApp.current = app;
    const root = deviceRef.current;
    (root?.querySelector<HTMLElement>('[data-autofocus]') ?? root?.querySelector<HTMLElement>('button'))?.focus({ preventScroll: true });
  }, [app]);

  useEffect(() => {
    if (!mounted) return;
    lockScroll('phone', open);
    radioStore.set({ quiet: open });
    return () => {
      lockScroll('phone', false);
      radioStore.set({ quiet: false });
    };
  }, [mounted, open]);

  // Mobile: opening adds a history entry, so the system Back closes the phone instead of leaving.
  useEffect(() => {
    if (!open || !mobile) return;
    let pushed = true;
    history.pushState({ ...(history.state ?? {}), phone: true }, '');
    const onPop = () => {
      pushed = false;
      close();
    };
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      if (pushed) history.back();
    };
  }, [open, mobile, close]);

  // Mobile: fit the visible viewport, so the on-screen keyboard never covers the reply box.
  useEffect(() => {
    const vv = window.visualViewport;
    const device = deviceRef.current;
    if (!mounted || !mobile || !vv || !device) return;
    const fit = () => {
      device.style.height = `${vv.height}px`;
      device.style.top = `${vv.offsetTop}px`;
    };
    fit();
    vv.addEventListener('resize', fit);
    vv.addEventListener('scroll', fit);
    return () => {
      vv.removeEventListener('resize', fit);
      vv.removeEventListener('scroll', fit);
      device.style.height = '';
      device.style.top = '';
    };
  }, [mounted, mobile]);

  // Slide up out of the corner (desktop) or the bottom edge (mobile); back down to close.
  useLayoutEffect(() => {
    if (!mounted) return;
    const overlay = overlayRef.current!;
    const device = deviceRef.current!;
    const reduced = prefersReducedMotion();
    gsap.killTweensOf([overlay, device]);
    if (open) {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
      if (reduced) gsap.fromTo(device, { opacity: 0 }, { opacity: 1, y: 0, duration: 0.2 });
      else gsap.fromTo(device, { yPercent: 110, rotate: mobile ? 0 : 6, opacity: 1, y: 0 }, { yPercent: 0, rotate: 0, duration: 0.55, ease: 'back.out(1.15)' });
    } else {
      gsap.to(overlay, { opacity: 0, duration: 0.25, delay: reduced ? 0 : 0.1, ease: 'power2.in', onComplete: () => setMounted(false) });
      if (!reduced) gsap.to(device, { yPercent: 110, rotate: mobile ? 0 : 4, duration: 0.35, ease: 'power2.in' });
    }
  }, [open, mounted, mobile]);

  // Swipe the top of the phone down to put it away (touch).
  const drag = useRef<{ y: number; id: number } | null>(null);
  const onDragStart = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    drag.current = { y: e.clientY, id: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onDragMove = (e: React.PointerEvent) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    gsap.set(deviceRef.current, { y: Math.max(0, e.clientY - drag.current.y) });
  };
  const onDragEnd = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dy = e.clientY - drag.current.y;
    drag.current = null;
    if (dy > 90) close();
    else gsap.to(deviceRef.current, { y: 0, duration: 0.3, ease: 'power3.out' });
  };

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="phone-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Phone: ${TITLES[app]}`}
      data-lenis-prevent
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div ref={deviceRef} className="phone">
        <div className={`phone__screen phone__screen--${app}`}>
          <div className="phone__grab" onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={onDragEnd} onPointerCancel={onDragEnd}>
            <StatusBar now={now} />
          </div>

          {app === 'home' ? (
            <Home now={now} onClose={close} />
          ) : (
            <div className="phone-appview" key={app}>
              <div className="phone-bar">
                <button type="button" className="phone-iconbtn" aria-label="Back to home screen" data-autofocus onClick={goHome}>
                  <ChevronLeft size={22} />
                </button>
                <span className="phone-bar__title">{app === 'messages' ? <MessagesTitle /> : TITLES[app]}</span>
                <button type="button" className="phone-iconbtn" aria-label="Close phone" onClick={close}>
                  <X size={18} />
                </button>
              </div>
              <div className="phone-appview__body">
                {app === 'messages' && <MessagesApp onNavigate={close} />}
                {app === 'radio' && <RadioApp />}
                {app === 'contacts' && <ContactsApp />}
              </div>
            </div>
          )}

          <button type="button" className="phone__homebar" aria-label={app === 'home' ? 'Close phone' : 'Back to home screen'} onClick={app === 'home' ? close : goHome}>
            <span />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessagesTitle() {
  return (
    <span className="phone-contact">
      <span className="phone-avatar" aria-hidden="true">
        CS
      </span>
      <span className="phone-contact__text">
        <span className="phone-contact__name">Christian</span>
        <span className="phone-contact__status">Pre-written replies</span>
      </span>
    </span>
  );
}
