import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useEdition } from '../hooks/useEdition';
import { CampaignSummary } from '../types/campaigns';
import { GameplayRules, UserSummary } from '../types/editions';
import { loadLocalPlayerDirectory } from '../utils/playerDirectory';

interface Props {
  campaign: CampaignSummary;
  gmUsers: UserSummary[];
  gameplayRules?: GameplayRules;
  onClose: () => void;
  onSave: (updates: Partial<CampaignSummary>) => Promise<void>;
}

type Faction = { id: string; name: string; tags?: string; notes?: string };
type Location = { id: string; name: string; descriptor?: string };
type Placeholder = { id: string; name: string; role: string };
type SessionSeedState = {
  title: string;
  objectives: string;
  sceneTemplate: string;
  summary: string;
  skip: boolean;
};

type StructuredHouseRules = {
  automation: Record<string, boolean>;
  notes: string;
  theme: string;
  factions: Faction[];
  locations: Location[];
  placeholders: Placeholder[];
  sessionSeed: SessionSeedState;
};

type ParsedHouseRules =
  | { valid: true; value: StructuredHouseRules }
  | { valid: false; raw: string };

const STATUS_OPTIONS = ['Active', 'Paused', 'Completed'] as const;
const AUTOMATION_DEFAULTS = [
  'initiative_automation',
  'recoil_tracking',
  'matrix_trace',
] as const;

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

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function extractCampaignPlayerIds(campaign: CampaignSummary): string[] {
  const ids = new Set<string>();
  (campaign.player_user_ids ?? []).forEach((id) => {
    if (typeof id === 'string' && id.trim().length > 0) {
      ids.add(id.trim());
    }
  });
  (campaign.players ?? []).forEach((player) => {
    if (typeof player?.id === 'string' && player.id.trim().length > 0) {
      ids.add(player.id.trim());
    }
  });
  return Array.from(ids);
}

function isUserSummary(value: unknown): value is UserSummary {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const entry = value as Partial<UserSummary>;
  return (
    typeof entry.id === 'string' &&
    entry.id.trim().length > 0 &&
    typeof entry.email === 'string' &&
    typeof entry.username === 'string'
  );
}

function normalizeUserSummaries(payload: unknown): UserSummary[] {
  if (Array.isArray(payload)) {
    return payload.filter(isUserSummary);
  }
  if (payload && typeof payload === 'object' && Array.isArray((payload as { users?: unknown }).users)) {
    return (payload as { users: unknown[] }).users.filter(isUserSummary);
  }
  return [];
}

function ensureCollectionIds<T extends { id?: string }>(items: T[], prefix: string): Array<T & { id: string }> {
  return items.map((item) => ({
    id: item.id ?? generateId(prefix),
    ...item,
  }));
}

function createDefaultHouseRules(): StructuredHouseRules {
  return {
    automation: Object.fromEntries(AUTOMATION_DEFAULTS.map((key) => [key, false])),
    notes: '',
    theme: '',
    factions: [],
    locations: [],
    placeholders: [],
    sessionSeed: { title: '', objectives: '', sceneTemplate: '', summary: '', skip: false },
  };
}

function parseLegacyHouseRules(source?: string | null): ParsedHouseRules {
  if (!source) {
    return { valid: true, value: createDefaultHouseRules() };
  }

  try {
    const payload = JSON.parse(source) as Record<string, unknown>;
    const automationEntries = new Set<string>(AUTOMATION_DEFAULTS);
    if (payload.automation && typeof payload.automation === 'object') {
      Object.keys(payload.automation as Record<string, unknown>).forEach((key) => automationEntries.add(key));
    }

    const automation: Record<string, boolean> = {};
    automationEntries.forEach((key) => {
      automation[key] =
        typeof payload.automation === 'object' && payload.automation !== null
          ? Boolean((payload.automation as Record<string, unknown>)[key])
          : false;
    });

    const factions = Array.isArray(payload.factions)
      ? ensureCollectionIds(
          (payload.factions as Array<Record<string, unknown>>).map((entry) => ({
            id: typeof entry.id === 'string' ? entry.id : undefined,
            name: typeof entry.name === 'string' ? entry.name : '',
            tags: typeof entry.tags === 'string' ? entry.tags : '',
            notes: typeof entry.notes === 'string' ? entry.notes : '',
          })),
          'faction',
        )
      : [];

    const locations = Array.isArray(payload.locations)
      ? ensureCollectionIds(
          (payload.locations as Array<Record<string, unknown>>).map((entry) => ({
            id: typeof entry.id === 'string' ? entry.id : undefined,
            name: typeof entry.name === 'string' ? entry.name : '',
            descriptor: typeof entry.descriptor === 'string' ? entry.descriptor : '',
          })),
          'location',
        )
      : [];

    const placeholders = Array.isArray(payload.placeholders)
      ? ensureCollectionIds(
          (payload.placeholders as Array<Record<string, unknown>>).map((entry) => ({
            id: typeof entry.id === 'string' ? entry.id : undefined,
            name: typeof entry.name === 'string' ? entry.name : '',
            role: typeof entry.role === 'string' ? entry.role : '',
          })),
          'placeholder',
        )
      : [];

    const sessionSeedSource = payload.session_seed as Record<string, unknown> | undefined;
    const sessionSeed: SessionSeedState = {
      title: typeof sessionSeedSource?.title === 'string' ? sessionSeedSource.title : '',
      objectives: typeof sessionSeedSource?.objectives === 'string' ? sessionSeedSource.objectives : '',
      sceneTemplate:
        typeof sessionSeedSource?.sceneTemplate === 'string' ? sessionSeedSource.sceneTemplate : '',
      summary: typeof sessionSeedSource?.summary === 'string' ? sessionSeedSource.summary : '',
      skip: Boolean(sessionSeedSource?.skip),
    };

    return {
      valid: true,
      value: {
        automation,
        notes: typeof payload.notes === 'string' ? payload.notes : '',
        theme: typeof payload.theme === 'string' ? payload.theme : '',
        factions,
        locations,
        placeholders,
        sessionSeed,
      },
    };
  } catch {
    return { valid: false, raw: source };
  }
}

function deriveHouseRulesStateFromCampaign(campaign: CampaignSummary) {
  const defaults = createDefaultHouseRules();
  const hasStructured =
    typeof campaign.theme === 'string' ||
    typeof campaign.house_rule_notes === 'string' ||
    (campaign.automation && Object.keys(campaign.automation).length > 0) ||
    (campaign.factions && campaign.factions.length > 0) ||
    (campaign.locations && campaign.locations.length > 0) ||
    (campaign.placeholders && campaign.placeholders.length > 0) ||
    campaign.session_seed;

  if (hasStructured) {
    const automation = { ...defaults.automation };
    if (campaign.automation) {
      Object.entries(campaign.automation).forEach(([key, value]) => {
        if (key.trim().length === 0) {
          return;
        }
        automation[key] = Boolean(value);
      });
    }

    const factions = ensureCollectionIds(
      (campaign.factions ?? []).map((faction) => ({
        id: faction.id,
        name: faction.name ?? '',
        tags: faction.tags ?? '',
        notes: faction.notes ?? '',
      })),
      'faction',
    );

    const locations = ensureCollectionIds(
      (campaign.locations ?? []).map((location) => ({
        id: location.id,
        name: location.name ?? '',
        descriptor: location.descriptor ?? '',
      })),
      'location',
    );

    const placeholders = ensureCollectionIds(
      (campaign.placeholders ?? []).map((placeholder) => ({
        id: placeholder.id,
        name: placeholder.name ?? '',
        role: placeholder.role ?? '',
      })),
      'placeholder',
    );

    const sessionSeedSource = campaign.session_seed;
    const sessionSeed: SessionSeedState = sessionSeedSource
      ? {
          title: sessionSeedSource.title ?? '',
          objectives: sessionSeedSource.objectives ?? '',
          sceneTemplate: sessionSeedSource.sceneTemplate ?? '',
          summary: sessionSeedSource.summary ?? '',
          skip: Boolean(sessionSeedSource.skip),
        }
      : defaults.sessionSeed;

    return {
      structured: {
        automation,
        notes: campaign.house_rule_notes ?? '',
        theme: campaign.theme ?? '',
        factions,
        locations,
        placeholders,
        sessionSeed,
      },
      rawLegacy: '',
      isRawMode: false,
    };
  }

  const legacy = parseLegacyHouseRules(campaign.house_rules);
  if (legacy.valid) {
    return {
      structured: legacy.value,
      rawLegacy: '',
      isRawMode: false,
    };
  }

  return {
    structured: defaults,
    rawLegacy: legacy.raw,
    isRawMode: true,
  };
}

function buildHouseRulesPayload(state: StructuredHouseRules) {
  const defaults = createDefaultHouseRules();
  const automationKeys = new Set<string>([
    ...Object.keys(defaults.automation),
    ...Object.keys(state.automation ?? {}),
  ]);

  const automation: Record<string, boolean> = {};
  automationKeys.forEach((key) => {
    automation[key] = Boolean(state.automation?.[key]);
  });

  const sanitize = (value: string) => value.trim();

  const factions = ensureCollectionIds(
    state.factions
      .map((faction) => ({
        id: faction.id,
        name: sanitize(faction.name),
        tags: faction.tags?.trim() || undefined,
        notes: faction.notes?.trim() || undefined,
      }))
      .filter((faction) => faction.name.length > 0),
    'faction',
  );

  const locations = ensureCollectionIds(
    state.locations
      .map((location) => ({
        id: location.id,
        name: sanitize(location.name),
        descriptor: location.descriptor?.trim() || undefined,
      }))
      .filter((location) => location.name.length > 0),
    'location',
  );

  const placeholders = ensureCollectionIds(
    state.placeholders
      .map((placeholder) => ({
        id: placeholder.id,
        name: sanitize(placeholder.name),
        role: sanitize(placeholder.role),
      }))
      .filter((placeholder) => placeholder.name.length > 0),
    'placeholder',
  );

  const sessionSeed: SessionSeedState = {
    title: sanitize(state.sessionSeed.title),
    objectives: sanitize(state.sessionSeed.objectives),
    sceneTemplate: sanitize(state.sessionSeed.sceneTemplate),
    summary: sanitize(state.sessionSeed.summary),
    skip: Boolean(state.sessionSeed.skip),
  };

  const structured: StructuredHouseRules = {
    automation,
    notes: sanitize(state.notes),
    theme: sanitize(state.theme),
    factions,
    locations,
    placeholders,
    sessionSeed,
  };

  const legacyPayload: Record<string, unknown> = { automation };
  if (structured.theme) {
    legacyPayload.theme = structured.theme;
  }
  if (structured.notes) {
    legacyPayload.notes = structured.notes;
  }
  if (structured.factions.length > 0) {
    legacyPayload.factions = structured.factions;
  }
  if (structured.locations.length > 0) {
    legacyPayload.locations = structured.locations;
  }
  if (structured.placeholders.length > 0) {
    legacyPayload.placeholders = structured.placeholders;
  }

  const hasSessionSeedContent =
    sessionSeed.skip ||
    sessionSeed.title ||
    sessionSeed.objectives ||
    sessionSeed.sceneTemplate ||
    sessionSeed.summary;

  if (hasSessionSeedContent) {
    legacyPayload.session_seed = sessionSeed.skip
      ? { skip: true }
      : {
          title: sessionSeed.title || undefined,
          objectives: sessionSeed.objectives || undefined,
          sceneTemplate: sessionSeed.sceneTemplate || undefined,
          summary: sessionSeed.summary || undefined,
          skip: false,
        };
  }

  return {
    structured,
    legacy: JSON.stringify(legacyPayload, null, 2),
  };
}

export function CampaignManageDrawer({ campaign, gmUsers, gameplayRules, onClose, onSave }: Props) {
  const {
    loadCampaignCharacterCreation,
    campaignCharacterCreation,
    characterCreationData,
  } = useEdition();

  const [name, setName] = useState(campaign.name);
  const [gmUserId, setGmUserId] = useState(campaign.gm_user_id ?? '');
  const [status, setStatus] = useState(campaign.status ?? 'Active');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialHouseRules = useMemo(() => deriveHouseRulesStateFromCampaign(campaign), [campaign]);

  const [rawHouseRules, setRawHouseRules] = useState(initialHouseRules.rawLegacy);
  const [isRawMode, setIsRawMode] = useState(initialHouseRules.isRawMode);

  const [theme, setTheme] = useState(initialHouseRules.structured.theme);
  const [notes, setNotes] = useState(initialHouseRules.structured.notes);
  const [automation, setAutomation] = useState<Record<string, boolean>>(initialHouseRules.structured.automation);
  const [factions, setFactions] = useState<Faction[]>(initialHouseRules.structured.factions);
  const [locations, setLocations] = useState<Location[]>(initialHouseRules.structured.locations);
  const [placeholders, setPlaceholders] = useState<Placeholder[]>(initialHouseRules.structured.placeholders);
  const [sessionSeed, setSessionSeed] = useState<SessionSeedState>(initialHouseRules.structured.sessionSeed);
  const [factionFilter, setFactionFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [isFactionLibraryOpen, setFactionLibraryOpen] = useState(false);
  const [isLocationLibraryOpen, setLocationLibraryOpen] = useState(false);
  const [playerUsers, setPlayerUsers] = useState<UserSummary[]>(() => loadLocalPlayerDirectory());
  const [playerFilter, setPlayerFilter] = useState('');
  const [isPlayerLibraryOpen, setPlayerLibraryOpen] = useState(false);
  const [selectedPlayerUserIds, setSelectedPlayerUserIds] = useState<string[]>(() =>
    extractCampaignPlayerIds(campaign),
  );

  useEffect(() => {
    setName(campaign.name);
    setGmUserId(campaign.gm_user_id ?? '');
    setStatus(campaign.status ?? 'Active');

    const next = deriveHouseRulesStateFromCampaign(campaign);
    setRawHouseRules(next.rawLegacy);
    setIsRawMode(next.isRawMode);
    setTheme(next.structured.theme);
    setNotes(next.structured.notes);
    setAutomation(next.structured.automation);
    setFactions(next.structured.factions);
    setLocations(next.structured.locations);
    setPlaceholders(next.structured.placeholders);
    setSessionSeed(next.structured.sessionSeed);
    setSelectedPlayerUserIds(extractCampaignPlayerIds(campaign));
    setPlayerFilter('');
    setPlayerLibraryOpen(false);
  }, [campaign]);

  useEffect(() => {
    void loadCampaignCharacterCreation(campaign.id);
  }, [campaign.id, loadCampaignCharacterCreation]);

  const gmOptions = useMemo(() => {
    if (gmUsers.length === 0) {
      return [{ label: 'No gamemasters found', value: '' }];
    }
    return gmUsers.map((user) => ({
      label: `${user.username} (${user.email})`,
      value: user.id,
    }));
  }, [gmUsers]);

  const playerRosterLookup = useMemo(() => {
    const map = new Map<string, { username?: string | null; email?: string | null }>();
    (campaign.players ?? []).forEach((player) => {
      if (player?.id) {
        map.set(player.id, { username: player.username ?? null, email: null });
      }
    });
    playerUsers.forEach((user) => {
      if (user?.id) {
        map.set(user.id, { username: user.username ?? null, email: user.email ?? null });
      }
    });
    return map;
  }, [campaign.players, playerUsers]);

  const selectedPlayerDetails = useMemo(
    () =>
      selectedPlayerUserIds.map((id) => {
        const entry = playerRosterLookup.get(id);
        const username = entry?.username?.trim() || id;
        const email = entry?.email?.trim() || null;
        return { id, username, email };
      }),
    [playerRosterLookup, selectedPlayerUserIds],
  );

  const sortedSelectedPlayerDetails = useMemo(() => {
    return [...selectedPlayerDetails].sort((a, b) => {
      const aPrimary = (a.username || a.id || '').toLowerCase();
      const bPrimary = (b.username || b.id || '').toLowerCase();
      const comparison = aPrimary.localeCompare(bPrimary);
      if (comparison !== 0) {
        return comparison;
      }
      return a.id.localeCompare(b.id);
    });
  }, [selectedPlayerDetails]);

  const selectedPlayerIds = useMemo(() => new Set(selectedPlayerUserIds), [selectedPlayerUserIds]);

  const filteredPlayerUsers = useMemo(() => {
    const normalizedFilter = playerFilter.trim().toLowerCase();
    if (!normalizedFilter) {
      return playerUsers;
    }
    return playerUsers.filter((user) => {
      const username = (user.username ?? '').toLowerCase();
      return username.includes(normalizedFilter);
    });
  }, [playerFilter, playerUsers]);

  const disableSave = isSaving || name.trim().length === 0 || (gmUsers.length > 0 && !gmUserId);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disableSave) return;

    setIsSaving(true);
    setError(null);

    try {
      const gmUser = gmUsers.find((user) => user.id === gmUserId);

      const normalizedPlayerIds = Array.from(
        new Set(
          selectedPlayerUserIds
            .map((id) => id.trim())
            .filter((id) => id.length > 0),
        ),
      );

      const detailMap = new Map(selectedPlayerDetails.map((player) => [player.id, player]));
      const playersPayload = normalizedPlayerIds.map((id) => {
        const detail = detailMap.get(id);
        const username = detail?.username?.trim() || id;
        return { id, username };
      });

      if (isRawMode) {
        await onSave({
          name: name.trim(),
          gm_user_id: gmUserId || undefined,
          gm_name: gmUser?.username ?? gmUser?.email ?? '',
          status,
          player_user_ids: normalizedPlayerIds,
          players: playersPayload,
          house_rules: rawHouseRules.trim(),
        });
      } else {
        const { structured, legacy } = buildHouseRulesPayload({
          automation,
          notes,
          theme,
          factions,
          locations,
          placeholders,
          sessionSeed,
        });

        const hasSessionSeedContent =
          structured.sessionSeed.skip ||
          structured.sessionSeed.title ||
          structured.sessionSeed.objectives ||
          structured.sessionSeed.sceneTemplate ||
          structured.sessionSeed.summary;

        const sessionSeedPayload = hasSessionSeedContent
          ? structured.sessionSeed.skip
            ? { skip: true }
            : {
                title: structured.sessionSeed.title || undefined,
                objectives: structured.sessionSeed.objectives || undefined,
                sceneTemplate: structured.sessionSeed.sceneTemplate || undefined,
                summary: structured.sessionSeed.summary || undefined,
                skip: false,
              }
          : null;

        await onSave({
          name: name.trim(),
          gm_user_id: gmUserId || undefined,
          gm_name: gmUser?.username ?? gmUser?.email ?? '',
          status,
          theme: structured.theme,
          house_rule_notes: structured.notes,
          automation: structured.automation,
          factions: structured.factions,
          locations: structured.locations,
          placeholders: structured.placeholders,
          session_seed: sessionSeedPayload ?? undefined,
          player_user_ids: normalizedPlayerIds,
          players: playersPayload,
          house_rules: legacy,
        });
      }
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

  const automationEntries = Object.entries(automation);
  const hasWorldDetails = factions.length > 0 || locations.length > 0;

  const campaignSupport = useMemo(
    () => campaignCharacterCreation?.campaign_support ?? characterCreationData?.campaign_support,
    [campaignCharacterCreation?.campaign_support, characterCreationData?.campaign_support],
  );

  const automationOptions = useMemo(() => {
    const keys = new Set<string>([...AUTOMATION_DEFAULTS]);
    automationEntries.forEach(([key]) => keys.add(key));
    return Array.from(keys);
  }, [automationEntries]);

  const factionLibrary = campaignSupport?.factions ?? [];
  const locationLibrary = campaignSupport?.locations ?? [];
  const filteredFactionLibrary = useMemo(() => {
    if (!factionFilter.trim()) {
      return factionLibrary;
    }
    const term = factionFilter.toLowerCase();
    return factionLibrary.filter((preset) => {
      return (
        preset.name.toLowerCase().includes(term) ||
        (preset.tags ?? '').toLowerCase().includes(term) ||
        (preset.notes ?? '').toLowerCase().includes(term)
      );
    });
  }, [factionFilter, factionLibrary]);

  const filteredLocationLibrary = useMemo(() => {
    if (!locationFilter.trim()) {
      return locationLibrary;
    }
    const term = locationFilter.toLowerCase();
    return locationLibrary.filter((preset) => {
      return (
        preset.name.toLowerCase().includes(term) ||
        (preset.descriptor ?? '').toLowerCase().includes(term)
      );
    });
  }, [locationFilter, locationLibrary]);

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
              <h4 className="campaign-manage__section-title">Players</h4>
              <p className="campaign-manage__hint">
                Assign registered players to give them dashboard access and keep everyone in sync.
              </p>
              {playerUsers.length > 0 ? (
                <div className="campaign-manage__preset">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setPlayerLibraryOpen((open) => !open)}
                    aria-expanded={isPlayerLibraryOpen}
                    aria-controls="campaign-player-search-panel"
                  >
                    {isPlayerLibraryOpen ? 'Hide player search' : 'Search player accounts'}
                  </button>
                  {isPlayerLibraryOpen && (
                    <div
                      id="campaign-player-search-panel"
                      className="campaign-manage__preset-panel"
                      role="region"
                      aria-label="Player account search"
                    >
                      <input
                        type="search"
                        placeholder="Search players by username…"
                        value={playerFilter}
                        onChange={(event) => setPlayerFilter(event.target.value)}
                      />
                      <div className="campaign-manage__preset-scroll">
                        {filteredPlayerUsers.length === 0 ? (
                          <p className="campaign-manage__empty">No players match that search.</p>
                        ) : (
                          filteredPlayerUsers.map((player, index) => (
                            <button
                              key={player.id ?? player.email ?? player.username ?? `player-${index}`}
                              type="button"
                              className={`campaign-manage__preset-option${
                                player.id && selectedPlayerIds.has(player.id) ? ' campaign-manage__preset-option--disabled' : ''
                              }`}
                              onClick={() => {
                                if (!player.id || selectedPlayerIds.has(player.id)) {
                                  return;
                                }
                                setSelectedPlayerUserIds((current) => [...current, player.id ?? '']);
                              }}
                              disabled={!player.id || selectedPlayerIds.has(player.id)}
                            >
                              <span className="campaign-manage__preset-name">
                                {player.username || player.id || 'Unknown player'}
                              </span>
                              {player.id && selectedPlayerIds.has(player.id) && (
                                <span className="campaign-manage__preset-tags">Already added</span>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="campaign-manage__empty">
                  No player accounts found yet. Invite players to assign them here.
                </p>
              )}
              {sortedSelectedPlayerDetails.length > 0 ? (
                <ul className="campaign-selected-players">
                  {sortedSelectedPlayerDetails.map((player) => (
                    <li key={player.id} className="campaign-selected-players__item">
                      <div>
                        <strong>{player.username || player.id}</strong>
                      </div>
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() =>
                          setSelectedPlayerUserIds((current) => current.filter((id) => id !== player.id))
                        }
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="campaign-manage__empty">No players assigned yet.</p>
              )}
            </section>

            {isRawMode ? (
              <section>
                <h4 className="campaign-manage__section-title">House Rules JSON</h4>
                <textarea
                  id="edit-campaign-house-rules"
                  name="campaign-house-rules"
                  rows={10}
                  value={rawHouseRules}
                  onChange={(event) => setRawHouseRules(event.target.value)}
                  placeholder="Paste house rule JSON configuration..."
                />
                <small>
                  We could not parse the existing house rules into structured sections. Update the JSON directly
                  and save to keep your changes.
                </small>
              </section>
            ) : (
              <>
                <section>
                  <h4 className="campaign-manage__section-title">Table Guidance</h4>
                  <div className="form-group">
                    <label htmlFor="campaign-theme">Theme / Tagline</label>
                    <input
                      id="campaign-theme"
                      name="campaign-theme"
                      value={theme}
                      onChange={(event) => setTheme(event.target.value)}
                      placeholder="Neo-Tokyo corporate intrigue, deep-space survival, etc."
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="campaign-notes">GM Notes</label>
                    <textarea
                      id="campaign-notes"
                      name="campaign-notes"
                      rows={4}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Session pacing tweaks, houseruled limits, table reminders..."
                    />
                  </div>
                </section>

                <section>
                  <h4 className="campaign-manage__section-title">Automation Toggles</h4>
                  <div className="campaign-manage__toggle-grid">
                    {automationOptions.map((key) => (
                      <label key={key} className="campaign-manage__toggle">
                        <input
                          type="checkbox"
                          checked={Boolean(automation[key])}
                          onChange={(event) =>
                            setAutomation((current) => ({
                              ...current,
                              [key]: event.target.checked,
                            }))
                          }
                        />
                        <span>{toStartCase(key)}</span>
                      </label>
                    ))}
                  </div>
                  <small className="campaign-manage__hint">
                    These options mirror the automation helpers available in the wizard.
                  </small>
                </section>

                <section>
                  <div className="campaign-manage__section-heading">
                    <h4 className="campaign-manage__section-title">Factions</h4>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        setFactions((current) => [
                          ...current,
                          { id: generateId('faction'), name: '', tags: '', notes: '' },
                        ])
                      }
                    >
                      Add Faction
                    </button>
                  </div>
                  {factionLibrary.length > 0 && (
                    <div className="campaign-manage__preset">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setFactionLibraryOpen((open) => !open)}
                        aria-expanded={isFactionLibraryOpen}
                        aria-controls="campaign-faction-library-panel"
                      >
                        {isFactionLibraryOpen ? 'Hide library' : 'Browse library'}
                      </button>
                      {isFactionLibraryOpen && (
                        <div
                          id="campaign-faction-library-panel"
                          className="campaign-manage__preset-panel"
                          role="region"
                          aria-label="Faction library"
                        >
                          <input
                            id="campaign-faction-filter"
                            type="search"
                            placeholder="Search faction library…"
                            value={factionFilter}
                            onChange={(event) => {
                              setFactionFilter(event.target.value);
                            }}
                          />
                          <div className="campaign-manage__preset-scroll">
                            {filteredFactionLibrary.length === 0 ? (
                              <p className="campaign-manage__empty">No matches.</p>
                            ) : (
                              filteredFactionLibrary.map((preset) => (
                                <button
                                  key={preset.id}
                                  type="button"
                                  className="campaign-manage__preset-option"
                                  onClick={() => {
                                    setFactions((current) => [
                                      ...current,
                                      {
                                        id: generateId('faction'),
                                        name: preset.name,
                                        tags: preset.tags ?? '',
                                        notes: preset.notes ?? '',
                                      },
                                    ]);
                                    setFactionLibraryOpen(false);
                                  }}
                                >
                                  <span className="campaign-manage__preset-name">{preset.name}</span>
                                  {preset.tags && <span className="campaign-manage__preset-tags">{preset.tags}</span>}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {factions.length === 0 ? (
                    <p className="campaign-manage__empty">No factions captured yet.</p>
                  ) : (
                    <div className="campaign-manage__collection">
                      {factions.map((faction) => (
                        <div key={faction.id} className="campaign-manage__collection-card">
                          <div className="campaign-manage__collection-header">
                            <strong>Faction</strong>
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() =>
                                setFactions((current) => current.filter((entry) => entry.id !== faction.id))
                              }
                            >
                              Remove
                            </button>
                          </div>
                          <div className="form-group">
                            <label>Name</label>
                            <input
                              value={faction.name}
                              onChange={(event) =>
                                setFactions((current) =>
                                  current.map((entry) =>
                                    entry.id === faction.id ? { ...entry, name: event.target.value } : entry,
                                  ),
                                )
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label>Tags</label>
                            <input
                              value={faction.tags ?? ''}
                              onChange={(event) =>
                                setFactions((current) =>
                                  current.map((entry) =>
                                    entry.id === faction.id ? { ...entry, tags: event.target.value } : entry,
                                  ),
                                )
                              }
                              placeholder="Megacorp, Syndicate, Magical society..."
                            />
                          </div>
                          <div className="form-group">
                            <label>Notes</label>
                            <textarea
                              rows={3}
                              value={faction.notes ?? ''}
                              onChange={(event) =>
                                setFactions((current) =>
                                  current.map((entry) =>
                                    entry.id === faction.id ? { ...entry, notes: event.target.value } : entry,
                                  ),
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section>
                  <div className="campaign-manage__section-heading">
                    <h4 className="campaign-manage__section-title">Locations</h4>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        setLocations((current) => [
                          ...current,
                          { id: generateId('location'), name: '', descriptor: '' },
                        ])
                      }
                    >
                      Add Location
                    </button>
                  </div>
                  {locationLibrary.length > 0 && (
                    <div className="campaign-manage__preset">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setLocationLibraryOpen((open) => !open)}
                        aria-expanded={isLocationLibraryOpen}
                        aria-controls="campaign-location-library-panel"
                      >
                        {isLocationLibraryOpen ? 'Hide library' : 'Browse library'}
                      </button>
                      {isLocationLibraryOpen && (
                        <div
                          id="campaign-location-library-panel"
                          className="campaign-manage__preset-panel"
                          role="region"
                          aria-label="Location library"
                        >
                          <input
                            id="campaign-location-filter"
                            type="search"
                            placeholder="Search location library…"
                            value={locationFilter}
                            onChange={(event) => {
                              setLocationFilter(event.target.value);
                            }}
                          />
                          <div className="campaign-manage__preset-scroll">
                            {filteredLocationLibrary.length === 0 ? (
                              <p className="campaign-manage__empty">No matches.</p>
                            ) : (
                              filteredLocationLibrary.map((preset) => (
                                <button
                                  key={preset.id}
                                  type="button"
                                  className="campaign-manage__preset-option"
                                  onClick={() => {
                                    setLocations((current) => [
                                      ...current,
                                      {
                                        id: generateId('location'),
                                        name: preset.name,
                                        descriptor: preset.descriptor ?? '',
                                      },
                                    ]);
                                    setLocationLibraryOpen(false);
                                  }}
                                >
                                  <span className="campaign-manage__preset-name">{preset.name}</span>
                                  {preset.descriptor && (
                                    <span className="campaign-manage__preset-tags">{preset.descriptor}</span>
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {locations.length === 0 ? (
                    <p className="campaign-manage__empty">No safehouses or key locations yet.</p>
                  ) : (
                    <div className="campaign-manage__collection">
                      {locations.map((location) => (
                        <div key={location.id} className="campaign-manage__collection-card">
                          <div className="campaign-manage__collection-header">
                            <strong>Location</strong>
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() =>
                                setLocations((current) =>
                                  current.filter((entry) => entry.id !== location.id),
                                )
                              }
                            >
                              Remove
                            </button>
                          </div>
                          <div className="form-group">
                            <label>Name</label>
                            <input
                              value={location.name}
                              onChange={(event) =>
                                setLocations((current) =>
                                  current.map((entry) =>
                                    entry.id === location.id ? { ...entry, name: event.target.value } : entry,
                                  ),
                                )
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label>Descriptor</label>
                            <textarea
                              rows={3}
                              value={location.descriptor ?? ''}
                              onChange={(event) =>
                                setLocations((current) =>
                                  current.map((entry) =>
                                    entry.id === location.id
                                      ? { ...entry, descriptor: event.target.value }
                                      : entry,
                                  ),
                                )
                              }
                              placeholder="Security rating, vibes, hooks..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section>
                  <div className="campaign-manage__section-heading">
                    <h4 className="campaign-manage__section-title">Placeholder Runners</h4>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        setPlaceholders((current) => [
                          ...current,
                          { id: generateId('placeholder'), name: '', role: '' },
                        ])
                      }
                    >
                      Add Placeholder
                    </button>
                  </div>
                  {placeholders.length === 0 ? (
                    <p className="campaign-manage__empty">No placeholders yet.</p>
                  ) : (
                    <div className="campaign-manage__collection">
                      {placeholders.map((placeholder) => (
                        <div key={placeholder.id} className="campaign-manage__collection-card">
                          <div className="campaign-manage__collection-header">
                            <strong>Runner</strong>
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() =>
                                setPlaceholders((current) =>
                                  current.filter((entry) => entry.id !== placeholder.id),
                                )
                              }
                            >
                              Remove
                            </button>
                          </div>
                          <div className="form-group">
                            <label>Handle</label>
                            <input
                              value={placeholder.name}
                              onChange={(event) =>
                                setPlaceholders((current) =>
                                  current.map((entry) =>
                                    entry.id === placeholder.id
                                      ? { ...entry, name: event.target.value }
                                      : entry,
                                  ),
                                )
                              }
                              placeholder="Maverick, Cipher..."
                            />
                          </div>
                          <div className="form-group">
                            <label>Role</label>
                            <input
                              value={placeholder.role}
                              onChange={(event) =>
                                setPlaceholders((current) =>
                                  current.map((entry) =>
                                    entry.id === placeholder.id
                                      ? { ...entry, role: event.target.value }
                                      : entry,
                                  ),
                                )
                              }
                              placeholder="Face, Rigger, Adept..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section>
                  <h4 className="campaign-manage__section-title">Session Seed</h4>
                  <label className="campaign-manage__checkbox">
                    <input
                      type="checkbox"
                      checked={sessionSeed.skip}
                      onChange={(event) =>
                        setSessionSeed((current) => ({ ...current, skip: event.target.checked }))
                      }
                    />
                    <span>Skip planning for now</span>
                  </label>
                  {!sessionSeed.skip && (
                    <div className="campaign-manage__session-grid">
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          value={sessionSeed.title}
                          onChange={(event) =>
                            setSessionSeed((current) => ({ ...current, title: event.target.value }))
                          }
                          placeholder="Session 0, The Run, etc."
                        />
                      </div>
                      <div className="form-group">
                        <label>Scene Template</label>
                        <input
                          value={sessionSeed.sceneTemplate}
                          onChange={(event) =>
                            setSessionSeed((current) => ({
                              ...current,
                              sceneTemplate: event.target.value,
                            }))
                          }
                          placeholder="social_meetup, extraction, heist..."
                        />
                      </div>
                      <div className="form-group">
                        <label>Objectives</label>
                        <textarea
                          rows={3}
                          value={sessionSeed.objectives}
                          onChange={(event) =>
                            setSessionSeed((current) => ({
                              ...current,
                              objectives: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Summary</label>
                        <textarea
                          rows={3}
                          value={sessionSeed.summary}
                          onChange={(event) =>
                            setSessionSeed((current) => ({ ...current, summary: event.target.value }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </section>
              </>
            )}

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
                  {placeholders.map((placeholder) => (
                    <li key={placeholder.id}>
                      <strong>{placeholder.name || 'Unnamed runner'}</strong>
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

            {!isRawMode && (
              <>
                <section className="campaign-manage__card">
                  <h4>House Rule Snapshot</h4>
                  {theme.trim() && (
                    <p>
                      <strong>Theme:</strong> {theme}
                    </p>
                  )}
                  {automationEntries.some(([, enabled]) => enabled) ? (
                    <div>
                      <strong>Automation:</strong>
                      <ul className="campaign-manage__list">
                        {automationEntries
                          .filter(([, enabled]) => enabled)
                          .map(([key]) => (
                            <li key={key}>{toStartCase(key)}</li>
                          ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No automation modules toggled.</p>
                  )}
                  {notes.trim() && (
                    <p className="campaign-manage__notes">
                      <strong>Notes:</strong> {notes}
                    </p>
                  )}
                </section>

                <section className="campaign-manage__card">
                  <h4>World Backbone</h4>
                  {hasWorldDetails ? (
                    <>
                      {factions.length > 0 && (
                        <div className="campaign-manage__sublist">
                          <strong>Factions</strong>
                          <ul>
                            {factions.map((faction) => (
                              <li key={faction.id}>
                                <span>{faction.name || 'Unnamed faction'}</span>
                                {faction.tags && <small> · {faction.tags}</small>}
                                {faction.notes && <p>{faction.notes}</p>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {locations.length > 0 && (
                        <div className="campaign-manage__sublist">
                          <strong>Locations</strong>
                          <ul>
                            {locations.map((location) => (
                              <li key={location.id}>
                                <span>{location.name || 'Unnamed location'}</span>
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
                  {sessionSeed.skip ? (
                    <p>Session planning skipped for now.</p>
                  ) : (
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
                  )}
                </section>
              </>
            )}

            {isRawMode && (
              <section className="campaign-manage__card">
                <h4>House Rule Snapshot</h4>
                <p>House rules are stored as custom JSON. Edit the raw payload above to make changes.</p>
              </section>
            )}
          </aside>
        </div>

        <footer className="campaign-manage__footer">
          <span className={`pill pill--status-${status.toLowerCase()}`}>{status}</span>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </footer>
      </section>
    </div>
  );
}

