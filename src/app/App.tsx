import { useCallback, useEffect, useRef, useState } from 'react';
import { ThemeProvider } from '@/features/theme/ThemeProvider';
import { Navbar } from '@/components/navigation/Navbar';
import { MenuOverlay } from '@/components/navigation/MenuOverlay';
import { SectionIndicator } from '@/components/navigation/SectionIndicator';
import { Intro } from '@/components/transitions/Intro';
import { Hero } from '@/sections/Hero/Hero';
import { About } from '@/sections/About/About';
import { Projects } from '@/sections/Projects/Projects';
import { Experience } from '@/sections/Experience/Experience';
import { Arsenal } from '@/sections/Arsenal/Arsenal';
import { OpenSource } from '@/sections/OpenSource/OpenSource';
import { Contact } from '@/sections/Contact/Contact';
import { navigation } from '@/data/navigation';
import { useActiveSection } from '@/hooks/useActiveSection';
import { ScrollTrigger } from '@/animations/gsap';
import { scrollToSection, startSmoothScroll, stopSmoothScroll } from '@/animations/scroll';

const SECTION_IDS = navigation.map((n) => n.id);

export function App() {
  const [introDone, setIntroDone] = useState(false);
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

  // Deep links (#projects etc.) after the layout settles.
  useEffect(() => {
    if (!introDone) return;
    const id = location.hash.slice(1);
    if (id && SECTION_IDS.includes(id)) window.setTimeout(() => scrollToSection(id), 100);
  }, [introDone]);

  const handleIntroDone = useCallback((handoff: boolean) => {
    setLogoHandoff(handoff);
    setIntroDone(true);
  }, []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <ThemeProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Intro onDone={handleIntroDone} />
      <Navbar active={active} menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((o) => !o)} menuButtonRef={menuButtonRef} />
      <MenuOverlay open={menuOpen} active={active} onClose={closeMenu} returnFocusRef={menuButtonRef} />
      <SectionIndicator active={active} />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero ready={introDone} logoHandoff={logoHandoff} />
        <About />
        <Projects />
        <Experience />
        <Arsenal />
        <OpenSource />
        <Contact />
      </main>

      <div className="grain" aria-hidden="true" />
    </ThemeProvider>
  );
}
