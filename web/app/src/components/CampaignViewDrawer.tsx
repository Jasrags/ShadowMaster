import { useMemo } from 'react';

import { CampaignSummary } from '../types/campaigns';

interface Props {
  campaign: CampaignSummary;
  onClose: () => void;
}

interface HouseRulesSummary {
  theme?: string;
  notes?: string;
  automation: Record<string, boolean>;
  factions: Array<{ name: string; tags?: string; notes?: string }>;
  locations: Array<{ name: string; descriptor?: string }>;
  placeholders: Array<{ name: string; role?: string }>;
  sessionSeed?: {
    title?: string;
    objectives?: string;
    sceneTemplate?: string;
    summary?: string;
    skip?: boolean;
  };
  raw?: string;
  isValid: boolean;
}

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

function parseLegacyHouseRulesSummary(raw?: string | null): HouseRulesSummary {
  if (!raw) {
    return {
      automation: {},
      factions: [],
      locations: [],
      placeholders: [],
      isValid: true,
    };
  }

  try {
    const payload = JSON.parse(raw) as Record<string, unknown>;

    const automation: Record<string, boolean> = {};
    if (payload.automation && typeof payload.automation === 'object') {
      Object.entries(payload.automation as Record<string, unknown>).forEach(([key, value]) => {
        automation[key] = Boolean(value);
      });
    }

    const factions = Array.isArray(payload.factions)
      ? (payload.factions as Array<Record<string, unknown>>).map((entry) => ({
          name: typeof entry.name === 'string' ? entry.name : '',
          tags: typeof entry.tags === 'string' ? entry.tags : undefined,
          notes: typeof entry.notes === 'string' ? entry.notes : undefined,
        }))
      : [];

    const locations = Array.isArray(payload.locations)
      ? (payload.locations as Array<Record<string, unknown>>).map((entry) => ({
          name: typeof entry.name === 'string' ? entry.name : '',
          descriptor: typeof entry.descriptor === 'string' ? entry.descriptor : undefined,
        }))
      : [];

    const placeholders = Array.isArray(payload.placeholders)
      ? (payload.placeholders as Array<Record<string, unknown>>).map((entry) => ({
          name: typeof entry.name === 'string' ? entry.name : '',
          role: typeof entry.role === 'string' ? entry.role : undefined,
        }))
      : [];

    const sessionSource = payload.session_seed as Record<string, unknown> | undefined;
    const sessionSeed = sessionSource
      ? {
          title: typeof sessionSource.title === 'string' ? sessionSource.title : undefined,
          objectives: typeof sessionSource.objectives === 'string' ? sessionSource.objectives : undefined,
          sceneTemplate:
            typeof sessionSource.sceneTemplate === 'string' ? sessionSource.sceneTemplate : undefined,
          summary: typeof sessionSource.summary === 'string' ? sessionSource.summary : undefined,
          skip: Boolean(sessionSource.skip),
        }
      : undefined;

    return {
      theme: typeof payload.theme === 'string' ? payload.theme : undefined,
      notes: typeof payload.notes === 'string' ? payload.notes : undefined,
      automation,
      factions,
      locations,
      placeholders,
      sessionSeed,
      isValid: true,
    };
  } catch {
    return {
      automation: {},
      factions: [],
      locations: [],
      placeholders: [],
      raw,
      isValid: false,
    };
  }
}

function deriveHouseRulesSummary(campaign: CampaignSummary): HouseRulesSummary {
  const hasStructured =
    typeof campaign.theme === 'string' ||
    typeof campaign.house_rule_notes === 'string' ||
    (campaign.automation && Object.keys(campaign.automation).length > 0) ||
    (campaign.factions && campaign.factions.length > 0) ||
    (campaign.locations && campaign.locations.length > 0) ||
    (campaign.placeholders && campaign.placeholders.length > 0) ||
    campaign.session_seed;

  if (hasStructured) {
    const automation: Record<string, boolean> = {};
    if (campaign.automation) {
      Object.entries(campaign.automation).forEach(([key, value]) => {
        if (key.trim().length === 0) {
          return;
        }
        automation[key] = Boolean(value);
      });
    }

    const factions = (campaign.factions ?? [])
      .map((faction) => ({
        name: faction.name?.trim() ?? '',
        tags: faction.tags?.trim() || undefined,
        notes: faction.notes?.trim() || undefined,
      }))
      .filter((faction) => faction.name.length > 0);

    const locations = (campaign.locations ?? [])
      .map((location) => ({
        name: location.name?.trim() ?? '',
        descriptor: location.descriptor?.trim() || undefined,
      }))
      .filter((location) => location.name.length > 0);

    const placeholders = (campaign.placeholders ?? [])
      .map((placeholder) => ({
        name: placeholder.name?.trim() ?? '',
        role: placeholder.role?.trim() || undefined,
      }))
      .filter((placeholder) => placeholder.name.length > 0);

    const sessionSeedSource = campaign.session_seed;
    let sessionSeed: HouseRulesSummary['sessionSeed'];
    if (sessionSeedSource) {
      if (sessionSeedSource.skip) {
        sessionSeed = { skip: true };
      } else if (
        sessionSeedSource.title ||
        sessionSeedSource.objectives ||
        sessionSeedSource.sceneTemplate ||
        sessionSeedSource.summary
      ) {
        sessionSeed = {
          title: sessionSeedSource.title?.trim() || undefined,
          objectives: sessionSeedSource.objectives?.trim() || undefined,
          sceneTemplate: sessionSeedSource.sceneTemplate?.trim() || undefined,
          summary: sessionSeedSource.summary?.trim() || undefined,
        };
      }
    }

    return {
      theme: campaign.theme?.trim() || undefined,
      notes: campaign.house_rule_notes?.trim() || undefined,
      automation,
      factions,
      locations,
      placeholders,
      sessionSeed,
      isValid: true,
    };
  }

  return parseLegacyHouseRulesSummary(campaign.house_rules);
}

export function CampaignViewDrawer({ campaign, onClose }: Props) {
  const houseRules = useMemo(() => deriveHouseRulesSummary(campaign), [campaign]);

  const editionLabel = campaign.edition?.toUpperCase() ?? 'SR5';
  const creationMethodLabel = toStartCase(campaign.creation_method);
  const gameplayLevelLabel = toStartCase(campaign.gameplay_level ?? campaign.gameplay_rules?.label);

  const updatedAt = formatDate(campaign.updated_at);
  const createdAt = formatDate(campaign.created_at);
  const lockedAt = formatDate(campaign.setup_locked_at);

  const enabledBooks = campaign.enabled_books ?? [];

  return (
    <div className="campaign-manage campaign-view">
      <div className="campaign-manage__backdrop" aria-hidden="true" />
      <section
        className="campaign-manage__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-view-heading"
      >
        <header className="campaign-manage__header">
          <div>
            <h3 id="campaign-view-heading">{campaign.name}</h3>
            <p className="campaign-manage__subtitle">
              {editionLabel} · {creationMethodLabel || 'Unknown method'} · {gameplayLevelLabel || 'Gameplay level unset'}
            </p>
          </div>
        </header>

        <div className="campaign-manage__body campaign-view__body">
          <section className="campaign-view__section">
            <h4 className="campaign-manage__section-title">Summary</h4>
            <dl className="campaign-view__list">
              <div>
                <dt>Gamemaster</dt>
                <dd>{campaign.gm_name ?? '—'}</dd>
              </div>
              <div>
                <dt>Edition</dt>
                <dd>{editionLabel}</dd>
              </div>
              <div>
                <dt>Creation Method</dt>
                <dd>{creationMethodLabel || '—'}</dd>
              </div>
              <div>
                <dt>Gameplay Level</dt>
                <dd>{gameplayLevelLabel || '—'}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{campaign.status ?? '—'}</dd>
              </div>
            </dl>
          </section>

          <section className="campaign-view__section">
            <h4 className="campaign-manage__section-title">Timeline</h4>
            <dl className="campaign-view__list">
              <div>
                <dt>Created</dt>
                <dd>{createdAt ?? '—'}</dd>
              </div>
              <div>
                <dt>Last Updated</dt>
                <dd>{updatedAt ?? '—'}</dd>
              </div>
              <div>
                <dt>Setup Locked</dt>
                <dd>{lockedAt ?? 'Not locked'}</dd>
              </div>
            </dl>
          </section>

          <section className="campaign-view__section">
            <h4 className="campaign-manage__section-title">Players</h4>
            {campaign.players && campaign.players.length > 0 ? (
              <ul className="campaign-view__pill-list">
                {campaign.players.map((player) => (
                  <li key={player.id} className="pill">
                    {player.username ?? player.id}
                  </li>
                ))}
              </ul>
            ) : campaign.player_user_ids && campaign.player_user_ids.length > 0 ? (
              <ul className="campaign-view__pill-list">
                {campaign.player_user_ids.map((id) => (
                  <li key={id} className="pill">
                    {id}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="campaign-view__empty">No players assigned yet.</p>
            )}
          </section>

          <section className="campaign-view__section">
            <h4 className="campaign-manage__section-title">Enabled Sourcebooks</h4>
            {enabledBooks.length === 0 ? (
              <p className="campaign-view__empty">No additional sourcebooks enabled.</p>
            ) : (
              <ul className="campaign-view__pill-list">
                {enabledBooks.map((code) => (
                  <li key={code} className="pill">
                    {code}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="campaign-view__section">
            <h4 className="campaign-manage__section-title">House Rules</h4>
            {houseRules.theme && <p><strong>Theme:</strong> {houseRules.theme}</p>}
            {houseRules.notes && <p><strong>Notes:</strong> {houseRules.notes}</p>}

            {houseRules.automation && Object.keys(houseRules.automation).length > 0 && (
              <div className="campaign-view__subsection">
                <h5>Automation Toggles</h5>
                <ul>
                  {Object.entries(houseRules.automation).map(([key, enabled]) => (
                    <li key={key}>
                      <span className={enabled ? 'campaign-view__badge campaign-view__badge--on' : 'campaign-view__badge campaign-view__badge--off'}>
                        {enabled ? 'On' : 'Off'}
                      </span>{' '}
                      {toStartCase(key)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {houseRules.factions.length > 0 && (
              <div className="campaign-view__subsection">
                <h5>Factions</h5>
                <ul>
                  {houseRules.factions.map((faction, index) => (
                    <li key={`${faction.name}-${index}`}>
                      <strong>{faction.name || 'Unnamed faction'}</strong>
                      {faction.tags ? ` — ${faction.tags}` : ''}
                      {faction.notes ? ` (${faction.notes})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {houseRules.locations.length > 0 && (
              <div className="campaign-view__subsection">
                <h5>Locations</h5>
                <ul>
                  {houseRules.locations.map((location, index) => (
                    <li key={`${location.name}-${index}`}>
                      <strong>{location.name || 'Unnamed location'}</strong>
                      {location.descriptor ? ` — ${location.descriptor}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {houseRules.placeholders.length > 0 && (
              <div className="campaign-view__subsection">
                <h5>Runner Placeholders</h5>
                <ul>
                  {houseRules.placeholders.map((placeholder, index) => (
                    <li key={`${placeholder.name}-${index}`}>
                      <strong>{placeholder.name || 'Placeholder'}</strong>
                      {placeholder.role ? ` — ${placeholder.role}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {houseRules.sessionSeed && !houseRules.sessionSeed.skip && (
              <div className="campaign-view__subsection">
                <h5>Session Seed</h5>
                <dl>
                  {houseRules.sessionSeed.title && (
                    <div>
                      <dt>Title</dt>
                      <dd>{houseRules.sessionSeed.title}</dd>
                    </div>
                  )}
                  {houseRules.sessionSeed.objectives && (
                    <div>
                      <dt>Objectives</dt>
                      <dd>{houseRules.sessionSeed.objectives}</dd>
                    </div>
                  )}
                  {houseRules.sessionSeed.sceneTemplate && (
                    <div>
                      <dt>Scene Template</dt>
                      <dd>{houseRules.sessionSeed.sceneTemplate}</dd>
                    </div>
                  )}
                  {houseRules.sessionSeed.summary && (
                    <div>
                      <dt>Summary</dt>
                      <dd>{houseRules.sessionSeed.summary}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {houseRules.sessionSeed?.skip && (
              <p className="campaign-view__empty">Session seed intentionally skipped.</p>
            )}

            {!houseRules.isValid && houseRules.raw && (
              <div className="campaign-view__subsection">
                <h5>Raw House Rules</h5>
                <pre className="campaign-view__code-block">{houseRules.raw}</pre>
              </div>
            )}

            {houseRules.isValid &&
              houseRules.theme === undefined &&
              houseRules.notes === undefined &&
              Object.keys(houseRules.automation).length === 0 &&
              houseRules.factions.length === 0 &&
              houseRules.locations.length === 0 &&
              houseRules.placeholders.length === 0 &&
              !houseRules.sessionSeed && (
                <p className="campaign-view__empty">No additional house rules configured.</p>
              )}
          </section>
        </div>

        <footer className="campaign-view__footer">
          <span className={`pill pill--status-${(campaign.status ?? 'unknown').toLowerCase()}`}>
            {campaign.status ?? 'Unknown'}
          </span>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </footer>
      </section>
    </div>
  );
}
