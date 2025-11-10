import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PriorityAssignment } from './components/PriorityAssignment';
import { MetatypeSelection } from './components/MetatypeSelection';
import { useEdition } from './hooks/useEdition';

function PriorityAssignmentPortal() {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    setContainer(document.getElementById('priority-assignment-react-root'));
  }, []);

  if (!container) {
    return null;
  }

  return createPortal(<PriorityAssignment />, container);
}

function MetatypeSelectionPortal() {
  const [container, setContainer] = useState<Element | null>(null);
  const [priority, setPriority] = useState('');
  const [selectedMetatype, setSelectedMetatype] = useState<string | null>(null);

  useEffect(() => {
    setContainer(document.getElementById('metatype-selection-react-root'));
  }, []);

  useEffect(() => {
    const legacy = window.ShadowmasterLegacyApp;
    if (!legacy) return;

    const subscription = () => {
      setPriority(legacy.getMetatypePriority?.() ?? '');
      setSelectedMetatype(legacy.getMetatypeSelection?.() ?? null);
    };

    subscription();
    legacy.subscribeMetatypeState?.(subscription);

    return () => {
      legacy.unsubscribeMetatypeState?.(subscription);
    };
  }, []);

  if (!container) {
    return null;
  }

  return createPortal(
    <MetatypeSelection
      priority={priority}
      selectedMetatype={selectedMetatype}
      onSelect={(id) => {
        setSelectedMetatype(id);
        window.ShadowmasterLegacyApp?.setMetatypeSelection?.(id);
      }}
    />, container);
}

export function App() {
  const { activeEdition, isLoading, error, characterCreationData } = useEdition();

  let status = '· data pending';
  if (isLoading) {
    status = '· loading edition data…';
  } else if (error) {
    status = `· failed to load data: ${error}`;
  } else if (characterCreationData) {
    status = '· edition data loaded';
  }

  return (
    <>
      <div className="react-banner" data-active-edition={activeEdition.key}>
        <small>
          React shell active — controlling edition context for <strong>{activeEdition.label}</strong> {status}
        </small>
      </div>
      <PriorityAssignmentPortal />
      <MetatypeSelectionPortal />
    </>
  );
}

declare global {
  interface Window {
    ShadowmasterLegacyApp?: {
      getPriorities?: () => Record<string, string | null>;
      setPriorities?: (assignments: Record<string, string | null>) => void;
      getMetatypePriority?: () => string;
      getMetatypeSelection?: () => string | null;
      setMetatypeSelection?: (id: string) => void;
      subscribeMetatypeState?: (listener: () => void) => void;
      unsubscribeMetatypeState?: (listener: () => void) => void;
    };
  }
}
