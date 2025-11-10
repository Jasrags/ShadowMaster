import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { EditionProvider } from './context/EditionContext';
import { App } from './App';
import type { PriorityCode } from './types/editions';

const existingHost = document.getElementById('shadowmaster-react-root');
const container = existingHost ?? createContainer();

function createContainer() {
  const host = document.createElement('div');
  host.id = 'shadowmaster-react-root';
  host.dataset.controller = 'react-shell';
  host.style.display = 'contents';
  document.body.appendChild(host);
  return host;
}

function Root() {
  useEffect(() => {
    if (window.ShadowmasterLegacyApp?.initialize && !window.ShadowmasterLegacyApp.isInitialized?.()) {
      window.ShadowmasterLegacyApp.initialize();
    }
  }, []);

  return (
    <StrictMode>
      <EditionProvider>
        <App />
      </EditionProvider>
    </StrictMode>
  );
}

const root = createRoot(container);
root.render(<Root />);

declare global {
  interface Window {
    ShadowmasterLegacyApp?: {
      initialize: () => void;
      isInitialized?: () => boolean;
      setEditionData?: (edition: string, data: unknown) => void;
      setPriorities?: (assignments: Record<string, PriorityCode | null>) => void;
      getPriorities?: () => Record<string, PriorityCode | null>;
    };
  }
}
