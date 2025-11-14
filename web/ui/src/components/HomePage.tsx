import { useEffect, useState } from 'react';
import { campaignApi } from '../lib/api';
import type { CampaignResponse } from '../lib/types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { CampaignTable } from './campaigns/CampaignTable';

export function HomePage() {
  const { user } = useAuth();
  const { showError } = useToast();
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
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
  }

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
      <h2 className="text-2xl font-bold text-gray-100 mb-6">{getHeading()}</h2>
      <CampaignTable campaigns={campaigns} />
    </div>
  );
}

