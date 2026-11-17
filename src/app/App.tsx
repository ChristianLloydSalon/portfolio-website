import { useCallback, useEffect, useRef, useState } from 'react';
import { ThemeProvider } from '@/features/theme/ThemeProvider';
import { Navbar } from '@/components/navigation/Navbar';
import { MenuOverlay } from '@/components/navigation/MenuOverlay';
import { SectionIndicator } from '@/components/navigation/SectionIndicator';
import { Intro } from '@/components/transitions/Intro';
import { Hero } from '@/sections/Hero/Hero';
import { About } from '@/sections/About/About';
import { Impact } from '@/sections/Impact/Impact';
import { Projects } from '@/sections/Projects/Projects';
import { Build } from '@/sections/Build/Build';
import { Experience } from '@/sections/Experience/Experience';
import { Arsenal } from '@/sections/Arsenal/Arsenal';
import { OpenSource } from '@/sections/OpenSource/OpenSource';
import { Contact } from '@/sections/Contact/Contact';
import { navigation } from '@/data/navigation';
import { RadioHost } from '@/features/radio/RadioHost';
import { PhoneHost } from '@/features/phone/PhoneHost';
import { useActiveSection } from '@/hooks/useActiveSection';
import { ScrollTrigger } from '@/animations/gsap';
import { isProgrammaticScroll, scrollToSection, startSmoothScroll, stopSmoothScroll, syncUrlToSection } from '@/animations/scroll';

const SECTION_IDS = navigation.map((n) => n.id);

export function App() {
  const [introDone, setIntroDone] = useState(false);
  // Loading screen fully gone and scrolling unlocked: only then can we scroll the page.
  const [introSettled, setIntroSettled] = useState(false);
  // True when the loading-screen logo flies into the hero mark (so the hero skips its own mark entrance).
  const [logoHandoff, setLogoHandoff] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    startSmoothScroll();
    // Web fonts change text metrics; re-measure pinned sections once they load.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => {
      window.removeEventListener('load', onLoad);
      stopSmoothScroll();
    };
  }, []);

  // Deep links (#projects etc.) after the layout settles. URL syncing waits until the
  // link has been handled, so the hero (visible during the intro) can't overwrite it.
  const urlSyncReady = useRef(false);
  useEffect(() => {
    if (!introSettled) return;
    const id = location.hash.slice(1);
    if (id && SECTION_IDS.includes(id)) {
      window.setTimeout(() => {
        scrollToSection(id);
        urlSyncReady.current = true;
      }, 100);
    } else {
      urlSyncReady.current = true;
    }
  }, [introSettled]);

  // Keep the address bar on the section being read (manual scrolling only).
  useEffect(() => {
    if (!introSettled || !urlSyncReady.current || isProgrammaticScroll()) return;
    syncUrlToSection(active);
  }, [active, introSettled]);

  const handleIntroDone = useCallback((handoff: boolean) => {
    setLogoHandoff(handoff);
    setIntroDone(true);
  }, []);
  const handleIntroSettled = useCallback(() => setIntroSettled(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <ThemeProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Intro onDone={handleIntroDone} onSettled={handleIntroSettled} />
      <Navbar active={active} menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((o) => !o)} menuButtonRef={menuButtonRef} />
      <MenuOverlay open={menuOpen} active={active} onClose={closeMenu} returnFocusRef={menuButtonRef} />
      <SectionIndicator active={active} />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero ready={introDone} logoHandoff={logoHandoff} />
        <About />
        <Impact />
        <Projects />
        <Build />
        <Experience />
        <Arsenal />
        <OpenSource />
        <Contact />
      </main>

      <RadioHost />
      <PhoneHost enabled={introSettled} />
      <div className="grain" aria-hidden="true" />
    </ThemeProvider>
  );
}
