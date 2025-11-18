import { useEffect, useState, useCallback } from 'react';
import { Button } from 'react-aria-components';
import { campaignApi } from '../lib/api';
import type { CampaignResponse } from '../lib/types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { CampaignTable } from './campaigns/CampaignTable';
import { CampaignCreationWizard } from './campaigns/CampaignCreationWizard';
import { InvitationNotification } from '../components/common/InvitationNotification';

export function HomePage() {
  const { user } = useAuth();
  const { showError } = useToast();
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const loadCampaigns = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await campaignApi.getCampaigns();
      setCampaigns(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load campaigns';
      showError('Failed to load campaigns', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  // Determine heading based on user roles
  const getHeading = () => {
    if (!user) return 'Campaigns';
    
    if (user.roles.includes('administrator')) {
      return 'All Campaigns';
    }
    if (user.roles.includes('gamemaster')) {
      return 'My GM Campaigns';
    }
    if (user.roles.includes('player')) {
      return 'My Campaigns';
    }
    
    return 'Campaigns';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-100">{getHeading()}</h2>
        <Button
          onPress={() => setIsWizardOpen(true)}
          aria-label="Create new campaign"
          className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors text-sm font-medium"
        >
          Create
        </Button>
      </div>
        <CampaignTable campaigns={campaigns} onCampaignUpdated={loadCampaigns} />
        <CampaignCreationWizard
          isOpen={isWizardOpen}
          onOpenChange={setIsWizardOpen}
          onSuccess={loadCampaigns}
        />
        <InvitationNotification onInvitationAccepted={loadCampaigns} />
      </div>
    );
  }

