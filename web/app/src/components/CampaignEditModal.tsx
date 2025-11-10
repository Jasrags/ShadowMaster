import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useEdition } from '../hooks/useEdition';
import { Campaign } from '../types/campaigns';
import { GameplayRules, UserSummary } from '../types/editions';

interface Props {
  campaign: Campaign;
  gmUsers: UserSummary[];
  gameplayRules?: GameplayRules;
  onClose: () => void;
  onSave: (updates: Partial<Campaign>) => Promise<void>;
}

const STATUS_OPTIONS = ['Active', 'Paused', 'Completed'] as const;

export function CampaignEditModal({ campaign, gmUsers, gameplayRules, onClose, onSave }: Props) {
  const { loadCampaignCharacterCreation } = useEdition();

  const [name, setName] = useState(campaign.name);
  const [gmUserId, setGmUserId] = useState(campaign.gm_user_id ?? '');
  const [status, setStatus] = useState(campaign.status ?? 'Active');
  const [houseRules, setHouseRules] = useState(campaign.house_rules ?? '');
  const [gameplayLevel, setGameplayLevel] = useState(campaign.gameplay_level ?? 'experienced');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gmOptions = useMemo(() => {
    if (gmUsers.length === 0) {
      return [{ label: 'No gamemasters found', value: '' }];
    }
    return gmUsers.map((user) => ({
      label: `${user.username} (${user.email})`,
      value: user.id,
    }));
  }, [gmUsers]);

  useEffect(() => {
    setName(campaign.name);
    setGmUserId(campaign.gm_user_id ?? '');
    setStatus(campaign.status ?? 'Active');
    setHouseRules(campaign.house_rules ?? '');
    setGameplayLevel(campaign.gameplay_level ?? 'experienced');
  }, [campaign]);

  const disableSave = isSaving || name.trim().length === 0 || (gmUsers.length > 0 && !gmUserId);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disableSave) {
      return;
    }
    setIsSaving(true);
    setError(null);

    try {
      const gmUser = gmUsers.find((user) => user.id === gmUserId);
      await onSave({
        name: name.trim(),
        gm_user_id: gmUserId || undefined,
        gm_name: gmUser?.username ?? gmUser?.email ?? '',
        status,
        house_rules: houseRules,
        gameplay_level: gameplayLevel,
      });
      await loadCampaignCharacterCreation(campaign.id);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update campaign.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="modal" style={{ display: 'block' }} role="dialog" aria-modal="true">
      <div className="modal-content">
        <header className="modal-header">
          <h3>Edit Campaign</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close edit campaign form">
            ×
          </button>
        </header>

        <form className="campaign-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-campaign-name">Campaign Name</label>
            <input
              id="edit-campaign-name"
              name="campaign-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-campaign-gm">Gamemaster</label>
            <select
              id="edit-campaign-gm"
              name="campaign-gm"
              value={gmUserId}
              onChange={(event) => setGmUserId(event.target.value)}
            >
              {gmOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="edit-campaign-status">Status</label>
            <select
              id="edit-campaign-status"
              name="campaign-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="edit-campaign-gameplay-level">Gameplay Level</label>
            <select
              id="edit-campaign-gameplay-level"
              name="campaign-gameplay-level"
              value={gameplayLevel}
              onChange={(event) => setGameplayLevel(event.target.value)}
            >
              <option value={campaign.gameplay_level ?? 'experienced'}>
                {gameplayRules?.label || campaign.gameplay_level || 'Experienced'}
              </option>
            </select>
            <small>Gameplay level selections are constrained by the active edition.</small>
          </div>

          <div className="form-group">
            <label htmlFor="edit-campaign-house-rules">House Rules</label>
            <textarea
              id="edit-campaign-house-rules"
              name="campaign-house-rules"
              rows={3}
              value={houseRules}
              onChange={(event) => setHouseRules(event.target.value)}
            />
          </div>

          {error && (
            <div className="form-feedback form-feedback--error" role="alert">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="button button--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button--primary" disabled={disableSave}>
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

