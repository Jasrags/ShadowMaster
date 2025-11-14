import { useEffect, useState } from 'react';
import { campaignApi } from '../../lib/api';
import type { CampaignResponse } from '../../lib/types';
import { CampaignCard } from './CampaignCard';

export function CampaignList() {
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await campaignApi.getCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load campaigns');
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

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-md text-red-400">
        <p className="font-medium mb-2">Error loading campaigns</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={loadCampaigns}
          className="mt-4 px-4 py-2 bg-sr-accent hover:bg-sr-accent-dark text-sr-dark font-medium rounded-md transition-colors"
        >
          Retry
        </button>
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

