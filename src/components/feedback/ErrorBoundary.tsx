import { Component, type ErrorInfo, type ReactNode } from 'react';
import { LogoMark } from '@/components/brand/Logo';
import { profile } from '@/data/profile';
import './ErrorBoundary.css';

interface State {
  error: Error | null;
}

/**
 * Catches render errors anywhere below it and shows a branded fallback instead of a
 * blank page. Must be a class component: React only supports error boundaries as classes.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep the details in the console for debugging; visitors see the fallback.
    console.error('Uncaught render error:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    // The page may be scroll-locked (menu, overlay or loading screen) when it crashed.
    document.documentElement.style.overflow = '';
    return (
      <main className="fault" role="alert" aria-labelledby="fault-title">
        <div className="fault__panel">
          <LogoMark className="fault__mark" />
          <p className="fault__eyebrow">Something went wrong</p>
          <h1 id="fault-title" className="fault__title">
            This page hit an error
          </h1>
          <p className="fault__text">
            It&rsquo;s a bug on my side, not something you did. Reloading usually fixes it.
          </p>
          <div className="fault__actions">
            <button type="button" className="fault__btn fault__btn--primary" onClick={() => window.location.reload()}>
              Reload page
            </button>
            <a className="fault__btn" href={`mailto:${profile.email}?subject=${encodeURIComponent('Portfolio error')}`}>
              Report it
            </a>
          </div>
        </div>
      </main>
    );
  }
}
