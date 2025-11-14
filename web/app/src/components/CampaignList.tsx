import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CampaignSummary } from '../types/campaigns';
import { ShadowmasterAuthState } from '../types/auth';
import { UserSummary } from '../types/editions';
import { ShadowmasterLegacyApp } from '../types/legacy';
import { CampaignTable } from './CampaignTable';
import { CampaignManageDrawer } from './CampaignManageDrawer';
import { CampaignViewDrawer } from './CampaignViewDrawer';

interface Props {
  targetId?: string;
}

const CAMPAIGNS_ROOT_ID = 'campaigns-list';

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export function CampaignList({ targetId = CAMPAIGNS_ROOT_ID }: Props) {
  const [container, setContainer] = useState<Element | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionInFlightId, setActionInFlightId] = useState<string | null>(null);
  const [campaignToView, setCampaignToView] = useState<CampaignSummary | null>(null);
  const [campaignToManage, setCampaignToManage] = useState<CampaignSummary | null>(null);
  const [gmUsers, setGmUsers] = useState<UserSummary[]>([]);
  const [currentUser, setCurrentUser] = useState<ShadowmasterAuthState | null>(
    window.ShadowmasterAuth ?? null,
  );

  useEffect(() => {
    setContainer(document.getElementById(targetId));
  }, [targetId]);

  useEffect(() => {
    document.body.classList.add('react-campaign-enabled');
    return () => {
      document.body.classList.remove('react-campaign-enabled');
    };
  }, []);

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const payload = await request<CampaignSummary[]>('/api/campaigns');
      setCampaigns(Array.isArray(payload) ? payload : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load campaigns.';
      setLoadError(message);
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchGamemasters = useCallback(async () => {
    try {
      const payload = await request<UserSummary[]>('/api/users?role=gamemaster,administrator');
      setGmUsers(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.warn('Failed to load gamemaster roster', err);
      setGmUsers([]);
    }
  }, []);

  useEffect(() => {
    void fetchCampaigns();
    void fetchGamemasters();
  }, [fetchCampaigns, fetchGamemasters]);

  useEffect(() => {
    const handler = () => {
      void fetchCampaigns();
    };
    window.addEventListener('shadowmaster:campaigns:refresh', handler);
    return () => {
      window.removeEventListener('shadowmaster:campaigns:refresh', handler);
    };
  }, [fetchCampaigns]);

  useEffect(() => {
    window.ShadowmasterLegacyApp = Object.assign(
      (window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined) ?? {},
      {
        loadCampaigns: () => {
          void fetchCampaigns();
        },
      },
    );

    return () => {
      const legacy = window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined;
      if (legacy) {
        legacy.loadCampaigns = undefined;
      }
    };
  }, [fetchCampaigns]);

  useEffect(() => {
    const authListener = (event: Event) => {
      const detail = (event as CustomEvent<ShadowmasterAuthState>).detail;
      setCurrentUser(detail ?? null);
    };
    window.addEventListener('shadowmaster:auth', authListener);
    return () => {
      window.removeEventListener('shadowmaster:auth', authListener);
    };
  }, []);

  useEffect(() => {
    if (!actionSuccess) {
      return;
    }
    const timeout = window.setTimeout(() => setActionSuccess(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [actionSuccess]);

  const handleDelete = useCallback(
    async (campaign: CampaignSummary) => {
      if (!campaign.can_delete && !currentUser?.isAdministrator) {
        return;
      }
      const confirmed = window.confirm(
        `Delete campaign "${campaign.name}"? This action cannot be undone.`,
      );
      if (!confirmed) {
        return;
      }
      setActionError(null);
      setActionSuccess(null);
      setActionInFlightId(campaign.id);
      try {
        await request(`/api/campaigns/${campaign.id}`, { method: 'DELETE' });
        setActionSuccess(`Campaign "${campaign.name}" deleted.`);
        await fetchCampaigns();
        window.dispatchEvent(new Event('shadowmaster:campaigns:refresh'));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete campaign.';
        setActionError(message);
      } finally {
        setActionInFlightId(null);
      }
    },
    [currentUser?.isAdministrator, fetchCampaigns],
  );

  const handleSave = useCallback(
    async (updates: Partial<CampaignSummary>) => {
      if (!campaignToManage) {
        return;
      }
      setActionError(null);
      setActionSuccess(null);
      setActionInFlightId(campaignToManage.id);
      try {
        const body = JSON.stringify({
          name: updates.name,
          gm_name: updates.gm_name,
          gm_user_id: updates.gm_user_id,
          status: updates.status,
          theme: updates.theme,
          house_rule_notes: updates.house_rule_notes,
          automation: updates.automation,
          factions: updates.factions,
          locations: updates.locations,
          placeholders: updates.placeholders,
          session_seed: updates.session_seed,
          player_user_ids: updates.player_user_ids,
          players: updates.players,
          house_rules: updates.house_rules,
          enabled_books: updates.enabled_books,
        });
        const payload = await request<CampaignSummary>(`/api/campaigns/${campaignToManage.id}`, {
          method: 'PUT',
          body,
        });
        setCampaigns((previous) =>
          previous.map((campaign) => (campaign.id === payload.id ? payload : campaign)),
        );
        setActionSuccess(`Campaign "${payload.name}" updated.`);
        window.dispatchEvent(new Event('shadowmaster:campaigns:refresh'));
        setCampaignToManage(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update campaign.';
        setActionError(message);
      } finally {
        setActionInFlightId(null);
      }
    },
    [campaignToManage],
  );

  if (!container) {
    return null;
  }

  return createPortal(
    <section className="campaigns-react-shell">
      {actionSuccess && <p className="campaigns-table__status">{actionSuccess}</p>}
      {actionError && <p className="campaigns-table__error">{actionError}</p>}
      <CampaignTable
        campaigns={campaigns}
        loading={isLoading}
        error={loadError}
        onView={(campaign) => setCampaignToView(campaign)}
        onEdit={(campaign) => setCampaignToManage(campaign)}
        onDelete={handleDelete}
        currentUser={currentUser}
        actionInFlightId={actionInFlightId}
      />
      {campaignToView && (
        <CampaignViewDrawer
          campaign={campaignToView}
          onClose={() => setCampaignToView(null)}
        />
      )}
      {campaignToManage && (
        <CampaignManageDrawer
          campaign={campaignToManage}
          gmUsers={gmUsers}
          gameplayRules={campaignToManage.gameplay_rules}
          onClose={() => setCampaignToManage(null)}
          onSave={handleSave}
        />
      )}
    </section>,
    container,
  );
}


