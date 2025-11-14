import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { CampaignSummary } from '../types/campaigns';

interface CampaignDashboardProps {
  targetId?: string;
  campaign?: CampaignSummary | null;
  onClose?: () => void;
}

interface HouseRulesPayload {
  automation?: Record<string, boolean>;
  notes?: string;
  theme?: string;
  factions?: Array<{ id?: string; name: string; tags?: string; notes?: string }>;
  locations?: Array<{ id?: string; name: string; descriptor?: string }>;
  placeholders?: Array<{ name: string; role: string }>;
  session_seed?: {
    title?: string;
    objectives?: string;
    sceneTemplate?: string;
    summary?: string;
    skip?: boolean;
  };
}

export function CampaignDashboard({ targetId = 'campaign-dashboard-root', campaign, onClose }: CampaignDashboardProps) {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    setContainer(document.getElementById(targetId));
  }, [targetId]);

  const houseRules: HouseRulesPayload = useMemo(() => {
    if (!campaign) {
      return {};
    }

    const hasStructured =
      typeof campaign.theme === 'string' ||
      typeof campaign.house_rule_notes === 'string' ||
      (campaign.automation && Object.keys(campaign.automation).length > 0) ||
      (campaign.factions && campaign.factions.length > 0) ||
      (campaign.locations && campaign.locations.length > 0) ||
      (campaign.placeholders && campaign.placeholders.length > 0) ||
      campaign.session_seed;

    if (hasStructured) {
      const automation = campaign.automation
        ? Object.fromEntries(
            Object.entries(campaign.automation).map(([key, value]) => [key, Boolean(value)]),
          )
        : undefined;

      const factions = campaign.factions
        ?.map((faction) => ({
          id: faction.id,
          name: faction.name?.trim() ?? '',
          tags: faction.tags?.trim() || undefined,
          notes: faction.notes?.trim() || undefined,
        }))
        .filter((faction) => faction.name.length > 0);

      const locations = campaign.locations
        ?.map((location) => ({
          id: location.id,
          name: location.name?.trim() ?? '',
          descriptor: location.descriptor?.trim() || undefined,
        }))
        .filter((location) => location.name.length > 0);

      const placeholders = campaign.placeholders
        ?.map((placeholder) => ({
          name: placeholder.name?.trim() ?? '',
          role: placeholder.role?.trim() || '',
        }))
        .filter((placeholder) => placeholder.name.length > 0);

      let sessionSeed: HouseRulesPayload['session_seed'];
      if (campaign.session_seed) {
        if (campaign.session_seed.skip) {
          sessionSeed = { skip: true };
        } else if (
          campaign.session_seed.title ||
          campaign.session_seed.objectives ||
          campaign.session_seed.sceneTemplate ||
          campaign.session_seed.summary
        ) {
          sessionSeed = {
            title: campaign.session_seed.title?.trim() || undefined,
            objectives: campaign.session_seed.objectives?.trim() || undefined,
            sceneTemplate: campaign.session_seed.sceneTemplate?.trim() || undefined,
            summary: campaign.session_seed.summary?.trim() || undefined,
            skip: false,
          };
        }
      }

      return {
        automation,
        notes: campaign.house_rule_notes?.trim() || undefined,
        theme: campaign.theme?.trim() || undefined,
        factions,
        locations,
        placeholders,
        session_seed: sessionSeed,
      };
    }

    if (!campaign.house_rules) {
      return {};
    }
    try {
      return JSON.parse(campaign.house_rules) as HouseRulesPayload;
    } catch (err) {
      console.warn('Failed to parse campaign house rules payload', err);
      return {};
    }
  }, [campaign]);

  if (!container || !campaign) {
    return null;
  }

  const playerNames =
    campaign.players && campaign.players.length > 0
      ? campaign.players.map((player) => player.username ?? player.id)
      : campaign.player_user_ids ?? [];

  const automationToggles = Object.entries(houseRules.automation ?? {}).filter(([, enabled]) => enabled);
  const hasWorldDetails = (houseRules.factions?.length ?? 0) > 0 || (houseRules.locations?.length ?? 0) > 0;
  const sessionSeed = houseRules.session_seed;

  return createPortal(
    <section className="campaign-dashboard">
      <header className="campaign-dashboard__header">
        <div>
          <h3>{campaign.name}</h3>
          <p>
            {campaign.edition.toUpperCase()} · {campaign.creation_method} · {campaign.gameplay_level ?? 'experienced'}
          </p>
        </div>
        <div className="campaign-dashboard__actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Dismiss
          </button>
        </div>
      </header>

      {houseRules.theme && (
        <p className="campaign-dashboard__theme">
          <strong>Theme:</strong> {houseRules.theme}
        </p>
      )}

      <div className="campaign-dashboard__grid">
        <section className="campaign-dashboard__card">
          <h4>Roster</h4>
          <p>
            <strong>Players:</strong> {playerNames.length > 0 ? playerNames.join(', ') : 'No assigned players'}
          </p>
          <p>
            <strong>Placeholders:</strong>{' '}
            {houseRules.placeholders?.length
              ? houseRules.placeholders.map((placeholder) => placeholder.name).join(', ')
              : 'None captured'}
          </p>
        </section>

        <section className="campaign-dashboard__card">
          <h4>Automation</h4>
          {automationToggles.length > 0 ? (
            <ul>
              {automationToggles.map(([key]) => (
                <li key={key}>{key.replace(/_/g, ' ')}</li>
              ))}
            </ul>
          ) : (
            <p>No automation modules selected.</p>
          )}
          {houseRules.notes && (
            <p className="campaign-dashboard__notes">
              <strong>House rule notes:</strong> {houseRules.notes}
            </p>
          )}
        </section>

        <section className="campaign-dashboard__card">
          <h4>World Backbone</h4>
          {hasWorldDetails ? (
            <>
              {houseRules.factions && houseRules.factions.length > 0 && (
                <div>
                  <strong>Factions</strong>
                  <ul>
                    {houseRules.factions.map((faction) => (
                      <li key={faction.id ?? faction.name}>
                        <span>{faction.name}</span>
                        {faction.tags && <small> · {faction.tags}</small>}
                        {faction.notes && <p>{faction.notes}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {houseRules.locations && houseRules.locations.length > 0 && (
                <div>
                  <strong>Locations</strong>
                  <ul>
                    {houseRules.locations.map((location) => (
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
            <p>No factions or locations recorded yet.</p>
          )}
        </section>

        <section className="campaign-dashboard__card">
          <h4>Session Seed</h4>
          {sessionSeed?.skip ? (
            <p>Session planning skipped for now.</p>
          ) : sessionSeed ? (
            <ul>
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
            <p>No session seed captured.</p>
          )}
        </section>
      </div>
    </section>,
    container,
  );
}

