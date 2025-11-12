import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CampaignSummary } from '../types/campaigns';
import { GameplayRules, UserSummary } from '../types/editions';
import { useEdition } from '../hooks/useEdition';

interface Props {
  campaign: CampaignSummary;
  gmUsers: UserSummary[];
  gameplayRules?: GameplayRules;
  onClose: () => void;
  onSave: (updates: Partial<CampaignSummary>) => Promise<void>;
}

type HouseRulesPayload = {
  automation?: Record<string, boolean>;
  notes?: string;
  theme?: string;
  factions?: Array<{ id?: string; name: string; tags?: string; notes?: string }>;
  locations?: Array<{ id?: string; name: string; descriptor?: string }>;
  placeholders?: Array<{ name: string; role?: string }>;
  session_seed?: {
    title?: string;
    objectives?: string;
    sceneTemplate?: string;
    summary?: string;
    skip?: boolean;
  };
  raw?: string;
};

const STATUS_OPTIONS = ['Active', 'Paused', 'Completed'] as const;

function toStartCase(value?: string | null): string {
  if (!value) return '';
  return value
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function formatDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function CampaignManageDrawer({ campaign, gmUsers, gameplayRules, onClose, onSave }: Props) {
  const { loadCampaignCharacterCreation } = useEdition();

  const [name, setName] = useState(campaign.name);
  const [gmUserId, setGmUserId] = useState(campaign.gm_user_id ?? '');
  const [status, setStatus] = useState(campaign.status ?? 'Active');
  const [houseRules, setHouseRules] = useState(() => {
    if (!campaign.house_rules) return '';
    try {
      return JSON.stringify(JSON.parse(campaign.house_rules), null, 2);
    } catch {
      return campaign.house_rules;
    }
  });
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

  const houseRulesPayload = useMemo<HouseRulesPayload>(() => {
    if (!houseRules.trim()) {
      return {};
    }
    try {
      return JSON.parse(houseRules) as HouseRulesPayload;
    } catch {
      return { raw: houseRules.trim() };
    }
  }, [houseRules]);

  useEffect(() => {
    setName(campaign.name);
    setGmUserId(campaign.gm_user_id ?? '');
    setStatus(campaign.status ?? 'Active');
    setHouseRules(() => {
      if (!campaign.house_rules) return '';
      try {
        return JSON.stringify(JSON.parse(campaign.house_rules), null, 2);
      } catch {
        return campaign.house_rules;
      }
    });
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
        house_rules: houseRules.trim(),
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

  const editionLabel = campaign.edition?.toUpperCase() ?? 'SR5';
  const creationMethodLabel = toStartCase(campaign.creation_method);
  const gameplayLevelLabel =
    gameplayRules?.label ?? toStartCase(campaign.gameplay_level ?? 'Experienced');
  const automationToggles = Object.entries(houseRulesPayload.automation ?? {}).filter(
    ([, enabled]) => enabled,
  );
  const hasWorldDetails =
    (houseRulesPayload.factions?.length ?? 0) > 0 ||
    (houseRulesPayload.locations?.length ?? 0) > 0;
  const sessionSeed = houseRulesPayload.session_seed;
  const placeholders = houseRulesPayload.placeholders ?? [];

  return (
    <div className="campaign-manage">
      <div className="campaign-manage__backdrop" aria-hidden="true" />
      <section
        className="campaign-manage__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-manage-heading"
      >
        <header className="campaign-manage__header">
          <div>
            <h3 id="campaign-manage-heading">{campaign.name}</h3>
            <p className="campaign-manage__subtitle">
              {editionLabel} · {creationMethodLabel} · {gameplayLevelLabel}
            </p>
          </div>
          <div className="campaign-manage__header-actions">
            <span className={`pill pill--status-${status.toLowerCase()}`}>{status}</span>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </header>

        <div className="campaign-manage__body">
          <form className="campaign-manage__form campaign-form" onSubmit={handleSubmit}>
            <section>
              <h4 className="campaign-manage__section-title">Basics</h4>
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
            </section>

            <section>
              <h4 className="campaign-manage__section-title">House Rules</h4>
              <textarea
                id="edit-campaign-house-rules"
                name="campaign-house-rules"
                rows={8}
                value={houseRules}
                onChange={(event) => setHouseRules(event.target.value)}
                placeholder="Examples: Initiative edge, downtime pacing, advancement tweaks…"
              />
              <small>JSON is supported; we’ll store exactly what you paste.</small>
            </section>

            {error && (
              <div className="form-feedback form-feedback--error" role="alert">
                {error}
              </div>
            )}

            <div className="campaign-manage__actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={disableSave}>
                {isSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>

          <aside className="campaign-manage__aside">
            <section className="campaign-manage__card">
              <h4>Roster</h4>
              {placeholders.length > 0 ? (
                <ul className="campaign-manage__list">
                  {placeholders.map((placeholder, index) => (
                    <li key={placeholder.name || index}>
                      <strong>{placeholder.name || `Runner ${index + 1}`}</strong>
                      {placeholder.role && <span> — {placeholder.role}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No placeholder runners captured.</p>
              )}
            </section>

            <section className="campaign-manage__card">
              <h4>Campaign Overview</h4>
              <dl>
                <div>
                  <dt>Edition</dt>
                  <dd>{editionLabel}</dd>
                </div>
                <div>
                  <dt>Creation Method</dt>
                  <dd>{creationMethodLabel}</dd>
                </div>
                <div>
                  <dt>Gameplay Level</dt>
                  <dd>{gameplayLevelLabel}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{status}</dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{formatDate(campaign.created_at) ?? 'Unknown'}</dd>
                </div>
                <div>
                  <dt>Last Updated</dt>
                  <dd>{formatDate(campaign.updated_at) ?? 'Unknown'}</dd>
                </div>
              </dl>
            </section>

            <section className="campaign-manage__card">
              <h4>Source Books</h4>
              {campaign.enabled_books.length > 0 ? (
                <ul className="campaign-manage__list">
                  {campaign.enabled_books.map((code) => (
                    <li key={code}>
                      <span className="pill pill--muted">{code}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No additional source books enabled.</p>
              )}
              <small className="campaign-manage__hint">
                Book availability is locked after creation for fairness.
              </small>
            </section>

            <section className="campaign-manage__card">
              <h4>House Rule Snapshot</h4>
              {houseRulesPayload.theme && (
                <p>
                  <strong>Theme:</strong> {houseRulesPayload.theme}
                </p>
              )}
              {automationToggles.length > 0 ? (
                <div>
                  <strong>Automation:</strong>
                  <ul className="campaign-manage__list">
                    {automationToggles.map(([key]) => (
                      <li key={key}>{toStartCase(key)}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No automation modules toggled.</p>
              )}
              {houseRulesPayload.notes && (
                <p className="campaign-manage__notes">
                  <strong>Notes:</strong> {houseRulesPayload.notes}
                </p>
              )}
              {houseRulesPayload.raw && (
                <p className="campaign-manage__notes">
                  <strong>Notes:</strong> {houseRulesPayload.raw}
                </p>
              )}
            </section>

            <section className="campaign-manage__card">
              <h4>World Backbone</h4>
              {hasWorldDetails ? (
                <>
                  {houseRulesPayload.factions && houseRulesPayload.factions.length > 0 && (
                    <div className="campaign-manage__sublist">
                      <strong>Factions</strong>
                      <ul>
                        {houseRulesPayload.factions.map((faction) => (
                          <li key={faction.id ?? faction.name}>
                            <span>{faction.name}</span>
                            {faction.tags && <small> · {faction.tags}</small>}
                            {faction.notes && <p>{faction.notes}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {houseRulesPayload.locations && houseRulesPayload.locations.length > 0 && (
                    <div className="campaign-manage__sublist">
                      <strong>Locations</strong>
                      <ul>
                        {houseRulesPayload.locations.map((location) => (
                          <li key={location.id ?? location.name}>
                            <span>{location.name}</span>
                            {location.descriptor && <p>{location.descriptor}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p>No factions or locations captured yet.</p>
              )}
            </section>

            <section className="campaign-manage__card">
              <h4>Session Seed</h4>
              {sessionSeed?.skip ? (
                <p>Session planning skipped for now.</p>
              ) : sessionSeed ? (
                <ul className="campaign-manage__list">
                  <li>
                    <strong>Title:</strong> {sessionSeed.title || 'Session 0'}
                  </li>
                  {sessionSeed.sceneTemplate && (
                    <li>
                      <strong>Template:</strong> {sessionSeed.sceneTemplate}
                    </li>
                  )}
                  {sessionSeed.objectives && (
                    <li>
                      <strong>Objectives:</strong> {sessionSeed.objectives}
                    </li>
                  )}
                  {sessionSeed.summary && (
                    <li>
                      <strong>Summary:</strong> {sessionSeed.summary}
                    </li>
                  )}
                </ul>
              ) : (
                <p>No session seed recorded.</p>
              )}
            </section>
          </aside>
        </div>
      </section>
    </div>
  );
}

