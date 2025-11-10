import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AuthPanel } from './components/AuthPanel';
import { CharactersActions } from './components/CharactersActions';
import { CampaignCreation } from './components/CampaignCreation';
import { CampaignList } from './components/CampaignList';
import { MainNavigation } from './components/MainNavigation';
import { PriorityAssignment } from './components/PriorityAssignment';
import { MetatypeSelection } from './components/MetatypeSelection';
import { MagicalAbilitiesSelection, MagicalSelection } from './components/MagicalAbilitiesSelection';
import { CampaignDashboard } from './components/CampaignDashboard';
import { CampaignSummary } from './types/campaigns';
import { useEdition } from './hooks/useEdition';
import { GameplayRules } from './types/editions';
import { NotificationProvider } from './context/NotificationContext';
import type { NotificationDescriptor } from './context/NotificationContext';

function AuthPortal() {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    setContainer(document.getElementById('auth-root'));
  }, []);

  if (!container) {
    return null;
  }

  return createPortal(<AuthPanel />, container);
}

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

function MagicalAbilitiesPortal() {
  const [container, setContainer] = useState<Element | null>(null);
  const [state, setState] = useState<MagicalSelection & { priority: string }>({
    priority: '',
    type: null,
    tradition: null,
    totem: null,
  });

  useEffect(() => {
    setContainer(document.getElementById('magical-abilities-react-root'));
  }, []);

  useEffect(() => {
    const legacy = window.ShadowmasterLegacyApp;
    if (!legacy) return;

    const subscription = () => {
      const magicState = legacy.getMagicState?.();
      if (magicState) {
        setState({
          priority: magicState.priority || '',
          type: magicState.type || null,
          tradition: magicState.tradition || null,
          totem: magicState.totem || null,
        });
      }
    };

    subscription();
    legacy.subscribeMagicState?.(subscription);

    return () => {
      legacy.unsubscribeMagicState?.(subscription);
    };
  }, []);

  if (!container) {
    return null;
  }

  return createPortal(
    <MagicalAbilitiesSelection
      priority={state.priority}
      selection={{ type: state.type, tradition: state.tradition, totem: state.totem }}
      onChange={(next) => {
        window.ShadowmasterLegacyApp?.setMagicState?.(next);
      }}
    />, container);
}

export function App() {
  const { activeEdition, isLoading, error, characterCreationData } = useEdition();
  const [dashboardCampaign, setDashboardCampaign] = useState<CampaignSummary | null>(null);

  let status = '· data pending';
  if (isLoading) {
    status = '· loading edition data…';
  } else if (error) {
    status = `· failed to load data: ${error}`;
  } else if (characterCreationData) {
    status = '· edition data loaded';
  }

  return (
    <NotificationProvider>
      <div className="react-banner" data-active-edition={activeEdition.key}>
        <small>
          React shell active — controlling edition context for <strong>{activeEdition.label}</strong> {status}
        </small>
      </div>
      <AuthPortal />
      <MainNavigation />
      <CampaignCreation onCreated={(campaign) => setDashboardCampaign(campaign)} />
      <CampaignDashboard campaign={dashboardCampaign} onClose={() => setDashboardCampaign(null)} />
      <CampaignList />
      <CharactersActions />
      <PriorityAssignmentPortal />
      <MetatypeSelectionPortal />
      <MagicalAbilitiesPortal />
    </NotificationProvider>
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
      getMagicState?: () => { priority: string; type: string | null; tradition: string | null; totem: string | null };
      setMagicState?: (state: MagicalSelection) => void;
      subscribeMagicState?: (listener: () => void) => void;
      unsubscribeMagicState?: (listener: () => void) => void;
      showWizardStep?: (step: number) => void;
      loadCampaignCharacterCreation?: (campaignId: string) => Promise<void>;
      clearCampaignCharacterCreation?: () => void;
      applyCampaignCreationDefaults?: (payload: {
        campaignId: string | null;
        edition?: string;
        gameplayRules?: GameplayRules | null;
      } | null) => void;
    };
    showCreateCharacterModal?: (options?: { campaignId?: string }) => void;
    ShadowmasterNotify?: (descriptor: NotificationDescriptor) => string;
  }
}
