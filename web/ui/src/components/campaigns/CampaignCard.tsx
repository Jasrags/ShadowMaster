import type { Campaign } from '../../lib/types';

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const statusColors = {
    Active: 'bg-green-500/20 text-green-400 border-green-500/50',
    Paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    Completed: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  };

  const statusColor = statusColors[campaign.status as keyof typeof statusColors] || statusColors.Active;

  return (
    <div className="bg-sr-gray border border-sr-light-gray rounded-lg p-6 hover:border-sr-accent/50 transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-gray-100">{campaign.name}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded border ${statusColor}`}>
          {campaign.status}
        </span>
      </div>

      {campaign.description && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{campaign.description}</p>
      )}

      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
        <div>
          <span className="font-medium text-gray-400">Edition:</span> {campaign.edition.toUpperCase()}
        </div>
        {campaign.gameplay_level && (
          <div>
            <span className="font-medium text-gray-400">Level:</span> {campaign.gameplay_level}
          </div>
        )}
        {campaign.gm_name && (
          <div>
            <span className="font-medium text-gray-400">GM:</span> {campaign.gm_name}
          </div>
        )}
      </div>
    </div>
  );
}

