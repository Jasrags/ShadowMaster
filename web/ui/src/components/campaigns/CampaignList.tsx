import { useEffect, useState } from 'react';
import { campaignApi } from '../../lib/api';
import type { CampaignResponse } from '../../lib/types';
import { CampaignCard } from './CampaignCard';
import { useToast } from '../../contexts/ToastContext';

export function CampaignList() {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading campaigns...</div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">No campaigns found</div>
        <p className="text-sm text-gray-500">
          Campaigns you create or join will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}

