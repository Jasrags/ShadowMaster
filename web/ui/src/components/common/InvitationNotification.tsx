import { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-aria-components';
import { campaignApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import type { CampaignPlayer } from '../../lib/types';

interface InvitationNotificationProps {
  onInvitationAccepted?: () => void;
}

export function InvitationNotification({ onInvitationAccepted }: InvitationNotificationProps) {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [invitations, setInvitations] = useState<Array<{ campaign_id: string; campaign_name: string; player: CampaignPlayer }>>([]);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const loadInvitations = useCallback(async () => {
    if (!user) return;

    try {
      const data = await campaignApi.getUserInvitations();
      setInvitations(data || []);
    } catch {
      // Silently fail - notifications are not critical
      setInvitations([]);
    }
  }, [user]);

  useEffect(() => {
    loadInvitations();
    // Poll for new invitations every 30 seconds
    const interval = setInterval(loadInvitations, 30000);
    return () => clearInterval(interval);
  }, [loadInvitations]);

  const handleAccept = async (playerId: string) => {
    setIsProcessing(playerId);
    try {
      await campaignApi.acceptInvitation(playerId);
      showSuccess('Invitation accepted', 'You have joined the campaign');
      await loadInvitations();
      onInvitationAccepted?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept invitation';
      showError('Failed to accept invitation', errorMessage);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDecline = async (playerId: string) => {
    setIsProcessing(playerId);
    try {
      await campaignApi.declineInvitation(playerId);
      showSuccess('Invitation declined', 'The invitation has been declined');
      await loadInvitations();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decline invitation';
      showError('Failed to decline invitation', errorMessage);
    } finally {
      setIsProcessing(null);
    }
  };

  if (!user || invitations.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {invitations.map((item) => (
        <div
          key={item.player.id}
          className="bg-sr-gray border border-sr-accent rounded-lg shadow-lg p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-100 mb-1">
                Campaign Invitation
              </h3>
              <p className="text-sm text-gray-300">
                You've been invited to join <span className="font-medium">{item.campaign_name}</span>
              </p>
            </div>
            <button
              onClick={() => {
                setInvitations(prev => prev.filter(inv => inv.player.id !== item.player.id));
              }}
              className="ml-2 text-gray-400 hover:text-gray-100"
              aria-label="Dismiss notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex gap-2">
            <Button
              onPress={() => handleAccept(item.player.id)}
              isDisabled={isProcessing === item.player.id}
              className="flex-1 px-3 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing === item.player.id ? 'Processing...' : 'Accept'}
            </Button>
            <Button
              onPress={() => handleDecline(item.player.id)}
              isDisabled={isProcessing === item.player.id}
              className="flex-1 px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Decline
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

