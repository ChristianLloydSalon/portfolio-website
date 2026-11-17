import { useCallback, useEffect, useRef, useState } from 'react';
import { useRoute } from 'wouter';
import { ThemeProvider } from '@/features/theme/ThemeProvider';
import { Navbar } from '@/components/navigation/Navbar';
import { MenuOverlay } from '@/components/navigation/MenuOverlay';
import { SectionIndicator } from '@/components/navigation/SectionIndicator';
import { Intro } from '@/components/transitions/Intro';
import { Hero } from '@/sections/Hero/Hero';
import { About } from '@/sections/About/About';
import { Impact } from '@/sections/Impact/Impact';
import { Projects } from '@/sections/Projects/Projects';
import { ProjectOverlay } from '@/sections/Projects/ProjectOverlay';
import { Build } from '@/sections/Build/Build';
import { Experience } from '@/sections/Experience/Experience';
import { Arsenal } from '@/sections/Arsenal/Arsenal';
import { OpenSource } from '@/sections/OpenSource/OpenSource';
import { Contact } from '@/sections/Contact/Contact';
import { navigation } from '@/data/navigation';
import { projects } from '@/data/projects';
import { RadioHost } from '@/features/radio/RadioHost';
import { PhoneHost } from '@/features/phone/PhoneHost';
import { useActiveSection } from '@/hooks/useActiveSection';
import { ScrollTrigger } from '@/animations/gsap';
import {
  isProgrammaticScroll,
  jumpToSection,
  scrollToSection,
  startSmoothScroll,
  stopSmoothScroll,
  syncUrlToSection,
} from '@/animations/scroll';
import { PROJECT_ROUTE, resolvePath, sectionPath } from './routes';

const SECTION_IDS = navigation.map((n) => n.id);
const noop = () => {};

export function App() {
  const [introDone, setIntroDone] = useState(false);
  // Loading screen fully gone and scrolling unlocked: only then can we scroll the page.
  const [introSettled, setIntroSettled] = useState(false);
  // True when the loading-screen logo flies into the hero mark (so the hero skips its own mark entrance).
  const [logoHandoff, setLogoHandoff] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(SECTION_IDS);
  // Build-time prerender of /projects/:id: the case study is the whole page, so crawlers
  // read it as its own document rather than as the home page with a dialog appended.
  // The browser renders from scratch (createRoot, no hydration) and shows the overlay as usual.
  const [onProjectRoute, routeParams] = useRoute<{ id: string }>(PROJECT_ROUTE);
  const pageIndex = import.meta.env.SSR && onProjectRoute ? projects.findIndex((p) => p.id === routeParams.id) : -1;
  const pageFocusRef = useRef<HTMLElement>(null);

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

  // Deep links (/projects, /projects/:id …) after the layout settles. URL syncing waits
  // until the link has been handled, so the hero (visible during the intro) can't
  // overwrite it. A project overlay only opens once the page underneath is in place.
  const urlSyncReady = useRef(false);
  const [routesReady, setRoutesReady] = useState(false);
  useEffect(() => {
    if (!introSettled) return;
    // Old #section links still work: rewrite them to the path form.
    const legacy = location.hash.slice(1);
    if (legacy && SECTION_IDS.includes(legacy)) history.replaceState(history.state, '', sectionPath(legacy) + location.search);
    const target = resolvePath(location.pathname);
    const finish = () => {
      urlSyncReady.current = true;
      setRoutesReady(true);
    };
    if (target.kind === 'project') {
      // Sit on the projects section so closing the overlay lands somewhere sensible.
      window.setTimeout(() => {
        jumpToSection('projects');
        finish();
      }, 100);
    } else if (target.kind === 'section' && target.id !== 'home') {
      window.setTimeout(() => {
        scrollToSection(target.id);
        finish();
      }, 100);
    } else {
      finish();
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
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          // Move focus without writing #main into the address bar.
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to content
      </a>
      <Intro onDone={handleIntroDone} onSettled={handleIntroSettled} />
      <Navbar active={active} menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((o) => !o)} menuButtonRef={menuButtonRef} />
      <MenuOverlay open={menuOpen} active={active} onClose={closeMenu} returnFocusRef={menuButtonRef} />
      <SectionIndicator active={active} />

      <main id="main" tabIndex={-1} className="outline-none">
        {pageIndex >= 0 ? (
          <ProjectOverlay index={pageIndex} origin={null} onClose={noop} onStep={noop} returnFocusRef={pageFocusRef} asPage />
        ) : (
          <>
            <Hero ready={introDone} logoHandoff={logoHandoff} />
            <About />
            <Impact />
            <Projects ready={routesReady || import.meta.env.SSR} />
            <Build />
            <Experience />
            <Arsenal />
            <OpenSource />
            <Contact />
          </>
        )}
      </main>

      <RadioHost />
      <PhoneHost enabled={introSettled} />
      <div className="grain" aria-hidden="true" />
    </ThemeProvider>
  );
}
