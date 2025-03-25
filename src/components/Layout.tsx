import { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface LayoutProps {
  children: ReactNode;
}

interface SectionProps {
  children: ReactNode;
  name: string;
}

const Section = ({ children, name }: SectionProps) => (
  <ErrorBoundary
    fallback={
      <div className="section-error">
        <h3>Error in {name}</h3>
        <p>This section encountered an error. Please try refreshing the page.</p>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Section name="Header">
        <header className="header">
          <h1>GetIt</h1>
          <p>Search videos, articles, and businesses</p>
        </header>
      </Section>

      <Section name="Main Content">
        <main className="main-content">
          {children}
        </main>
      </Section>

      <Section name="Footer">
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} GetIt. All rights reserved.</p>
        </footer>
      </Section>
    </div>
  );
} 