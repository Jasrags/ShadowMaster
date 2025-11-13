import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AuthPanel } from './components/AuthPanel';
import { CharactersActions } from './components/CharactersActions';
import { CharacterList } from './components/CharacterList';
import { CampaignCreation } from './components/CampaignCreation';
import { CampaignList } from './components/CampaignList';
import { MainNavigation } from './components/MainNavigation';
import { CampaignDashboard } from './components/CampaignDashboard';
import { CampaignSummary } from './types/campaigns';
import { useEdition } from './hooks/useEdition';
import { NotificationProvider } from './context/NotificationContext';
import { CharacterWizard } from './components/CharacterWizard';
import { useWizard } from './context/WizardContext';

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

export function App() {
  const { activeEdition, isLoading, error, characterCreationData } = useEdition();
  const [dashboardCampaign, setDashboardCampaign] = useState<CampaignSummary | null>(null);
  const { isOpen: isWizardOpen, campaignId: wizardCampaignId, closeWizard } = useWizard();

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
      <CharacterList />
      <CharacterWizard
        isOpen={isWizardOpen}
        onClose={closeWizard}
        campaignId={wizardCampaignId}
      />
    </NotificationProvider>
  );
}
