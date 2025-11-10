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
    if (!campaign?.house_rules) {
      return {};
    }
    try {
      return JSON.parse(campaign.house_rules) as HouseRulesPayload;
    } catch (err) {
      console.warn('Failed to parse campaign house rules payload', err);
      return {};
    }
  }, [campaign?.house_rules]);

  if (!container || !campaign) {
    return null;
  }

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

