import { FormEvent, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { createPortal } from 'react-dom';
import { useEdition } from '../hooks/useEdition';
import { CharacterCreationData, CreationMethodDefinition, SourceBook, UserSummary } from '../types/editions';
import { CampaignSummary } from '../types/campaigns';
import { useNotifications } from '../context/NotificationContext';

interface Props {
  targetId?: string;
  onCreated?: (campaign: CampaignSummary) => void;
}

interface Option<T extends string = string> {
  label: string;
  value: T;
}

const DEFAULT_CREATION_METHOD_OPTIONS: Option[] = [
  { label: 'Priority (default)', value: 'priority' },
  { label: 'Sum-to-Ten (coming soon)', value: 'sum_to_ten' },
  { label: 'Karma (coming soon)', value: 'karma' },
];

const STEP_LABELS = ['Basics', 'Roster', 'World', 'Automation', 'Session Seed', 'Review'];

const AUTOMATION_TOGGLES = [
  {
    key: 'initiative_automation',
    label: 'Automate initiative order',
    description: 'Track initiative passes and reorder combatants automatically.',
  },
  {
    key: 'recoil_tracking',
    label: 'Track recoil and weapon heat',
    description: 'Automatically apply recoil modifiers to firearms.',
  },
  {
    key: 'matrix_trace',
    label: 'Matrix trace timers',
    description: 'Monitor trace attempts and decker timers in the matrix.',
  },
];

const SESSION_TEMPLATES = [
  { value: 'blank', label: 'Blank session', description: 'Start fresh with your own outline.' },
  {
    value: 'social_meetup',
    label: 'Johnson meet-and-greet',
    description: 'Introductory social encounter with your fixer or Johnson.',
  },
  {
    value: 'matrix_recon',
    label: 'Matrix scoping run',
    description: 'Initial matrix reconnaissance to set the stage for future runs.',
  },
  {
    value: 'astral_patrol',
    label: 'Astral patrol',
    description: 'Magically oriented scene to explore astral threats or allies.',
  },
];

function generateId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function deriveDefaultBookCode(edition: string): string {
  return edition.toLowerCase() === 'sr5' ? 'SR5' : edition.toUpperCase();
}

function deriveBookFallbackName(code: string): string {
  if (code === 'SR5') {
    return 'Shadowrun 5th Edition';
  }
  return code;
}

interface RosterPlaceholder {
  id: string;
  name: string;
  role: string;
}

interface CharacterSummary {
  id: string;
  name: string;
  player_name?: string;
  status?: string;
  edition?: string;
}

interface DraftState {
  name: string;
  description: string;
  theme: string;
  selectedPlayers: string[];
  placeholders: RosterPlaceholder[];
  factions: Array<{ id: string; name: string; tags: string; notes: string }>;
  locations: Array<{ id: string; name: string; descriptor: string }>;
  houseRules: Record<string, boolean>;
  houseRuleNotes: string;
  sessionSeed: {
    title: string;
    objectives: string;
    sceneTemplate: string;
    skip: boolean;
    summary: string;
  };
}

type DraftAction =
  | { type: 'RESET'; payload: DraftState }
  | { type: 'UPDATE_FIELD'; field: keyof DraftState; value: DraftState[keyof DraftState] }
  | { type: 'UPDATE_PLACEHOLDER'; id: string; field: keyof RosterPlaceholder; value: string }
  | { type: 'ADD_PLACEHOLDER' }
  | { type: 'REMOVE_PLACEHOLDER'; id: string }
  | { type: 'UPDATE_FACTION'; id: string; field: keyof DraftState['factions'][number]; value: string }
  | { type: 'ADD_FACTION' }
  | { type: 'REMOVE_FACTION'; id: string }
  | { type: 'UPDATE_LOCATION'; id: string; field: keyof DraftState['locations'][number]; value: string }
  | { type: 'ADD_LOCATION' }
  | { type: 'REMOVE_LOCATION'; id: string }
  | {
      type: 'UPDATE_FACTION';
      id: string;
      field: keyof DraftState['factions'][number];
      value: string;
    }
  | { type: 'ADD_FACTION' }
  | { type: 'REMOVE_FACTION'; id: string }
  | {
      type: 'UPDATE_LOCATION';
      id: string;
      field: keyof DraftState['locations'][number];
      value: string;
    }
  | { type: 'ADD_LOCATION' }
  | { type: 'REMOVE_LOCATION'; id: string }
  | { type: 'UPDATE_HOUSE_RULE'; key: string; value: boolean }
  | {
      type: 'UPDATE_SESSION_SEED';
      field: keyof DraftState['sessionSeed'];
      value: DraftState['sessionSeed'][keyof DraftState['sessionSeed']];
    };

const defaultDraft: DraftState = {
  name: '',
  description: '',
  theme: '',
  selectedPlayers: [],
  placeholders: [],
  factions: [],
  locations: [],
  houseRules: {},
  houseRuleNotes: '',
  sessionSeed: {
    title: 'Session 0',
    objectives: '',
    sceneTemplate: 'blank',
    skip: false,
    summary: '',
  },
};

function draftReducer(state: DraftState, action: DraftAction): DraftState {
  switch (action.type) {
    case 'RESET':
      return action.payload;
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'UPDATE_PLACEHOLDER':
      return {
        ...state,
        placeholders: state.placeholders.map((placeholder) =>
          placeholder.id === action.id ? { ...placeholder, [action.field]: action.value } : placeholder,
        ),
      };
    case 'ADD_PLACEHOLDER':
      return {
        ...state,
        placeholders: [
          ...state.placeholders,
          {
            id: generateId('placeholder'),
            name: 'Runner Placeholder',
            role: 'Unassigned',
          },
        ],
      };
    case 'REMOVE_PLACEHOLDER':
      return {
        ...state,
        placeholders: state.placeholders.filter((placeholder) => placeholder.id !== action.id),
      };
    case 'UPDATE_FACTION':
      return {
        ...state,
        factions: state.factions.map((faction) =>
          faction.id === action.id ? { ...faction, [action.field]: action.value } : faction,
        ),
      };
    case 'ADD_FACTION':
      return {
        ...state,
        factions: [
          ...state.factions,
          {
            id: generateId('faction'),
            name: '',
            tags: '',
            notes: '',
          },
        ],
      };
    case 'REMOVE_FACTION':
      return {
        ...state,
        factions: state.factions.filter((faction) => faction.id !== action.id),
      };
    case 'UPDATE_LOCATION':
      return {
        ...state,
        locations: state.locations.map((location) =>
          location.id === action.id ? { ...location, [action.field]: action.value } : location,
        ),
      };
    case 'ADD_LOCATION':
      return {
        ...state,
        locations: [
          ...state.locations,
          {
            id: generateId('location'),
            name: '',
            descriptor: '',
          },
        ],
      };
    case 'REMOVE_LOCATION':
      return {
        ...state,
        locations: state.locations.filter((location) => location.id !== action.id),
      };
    case 'UPDATE_HOUSE_RULE':
      return {
        ...state,
        houseRules: {
          ...state.houseRules,
          [action.key]: action.value,
        },
      };
    case 'UPDATE_SESSION_SEED':
      return {
        ...state,
        sessionSeed: {
          ...state.sessionSeed,
          [action.field]: action.value,
        },
      };
    default:
      return state;
  }
}

export function CampaignCreation({ targetId = 'campaign-creation-react-root', onCreated }: Props) {
  const {
    activeEdition,
    supportedEditions,
    characterCreationData,
    reloadEditionData,
    setEdition,
  } = useEdition();

  const [container, setContainer] = useState<Element | null>(null);
  const [selectedEdition, setSelectedEdition] = useState(activeEdition.key);
  const [editionData, setEditionData] = useState<CharacterCreationData | undefined>(characterCreationData);
  const [gameplayLevels, setGameplayLevels] = useState<Option[]>([]);
  const [availableCharacters, setAvailableCharacters] = useState<CharacterSummary[]>([]);
  const [gmUserId, setGmUserId] = useState<string>('');
  const [selectedGameplayLevel, setSelectedGameplayLevel] = useState<string>('experienced');
  const [selectedCreationMethod, setSelectedCreationMethod] = useState<string>('priority');
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [creationMethods, setCreationMethods] = useState<Record<string, CreationMethodDefinition>>({});
  const [creationMethodOptions, setCreationMethodOptions] = useState<Option[]>(DEFAULT_CREATION_METHOD_OPTIONS);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [draft, dispatchDraft] = useReducer(draftReducer, defaultDraft);
  const [availableBooks, setAvailableBooks] = useState<SourceBook[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>(() => [deriveDefaultBookCode(activeEdition.key)]);
  const [booksExpanded, setBooksExpanded] = useState(false);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [bookLoadError, setBookLoadError] = useState<string | null>(null);
  const { pushNotification } = useNotifications();

  const totalSteps = STEP_LABELS.length;
  const defaultBookCode = useMemo(() => deriveDefaultBookCode(selectedEdition), [selectedEdition]);
  const bookLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    availableBooks.forEach((book) => {
      map.set(book.code.toUpperCase(), book.name);
    });
    return map;
  }, [availableBooks]);
  const selectedBookLabels = useMemo(
    () => selectedBooks.map((code) => bookLabelMap.get(code) ?? code),
    [bookLabelMap, selectedBooks],
  );

  useEffect(() => {
    setContainer(document.getElementById(targetId));
  }, [targetId]);

  useEffect(() => {
    setSelectedEdition(activeEdition.key);
  }, [activeEdition.key]);

  useEffect(() => {
    let cancelled = false;

    async function loadBooks() {
      setIsLoadingBooks(true);
      setBookLoadError(null);
      try {
        const response = await fetch(`/api/editions/${selectedEdition}/books`);
        if (!response.ok) {
          throw new Error(`Failed to load books (${response.status})`);
        }
        const payload = await response.json();
        const books: SourceBook[] = Array.isArray(payload?.books) ? payload.books : [];
        if (cancelled) {
          return;
        }
        const normalized = books
          .map((book) => ({
            ...book,
            code: (book.code || '').toUpperCase(),
          }))
          .filter((book) => book.code);
        const hasDefault = normalized.some((book) => book.code === defaultBookCode);
        const enriched = hasDefault
          ? normalized
          : [
              ...normalized,
              {
                id: defaultBookCode.toLowerCase(),
                name: deriveBookFallbackName(defaultBookCode),
                code: defaultBookCode,
              },
            ];
        enriched.sort((a, b) => a.code.localeCompare(b.code));
        setAvailableBooks(enriched);
        setSelectedBooks((previous) => {
          const next = new Set(previous.map((code) => code.toUpperCase()));
          next.add(defaultBookCode);
          const allowed = new Set(enriched.map((book) => book.code));
          return Array.from(next).filter((code) => allowed.has(code)).sort();
        });
      } catch (err) {
        console.error('Failed to load source books', err);
        if (cancelled) {
          return;
        }
        setBookLoadError('Unable to load source books. Default core book applied.');
        const fallback = [
          { id: defaultBookCode.toLowerCase(), name: deriveBookFallbackName(defaultBookCode), code: defaultBookCode },
        ];
        setAvailableBooks(fallback);
        setSelectedBooks([defaultBookCode]);
      } finally {
        if (!cancelled) {
          setIsLoadingBooks(false);
        }
      }
    }

    void loadBooks();

    return () => {
      cancelled = true;
    };
  }, [defaultBookCode, selectedEdition]);

  useEffect(() => {
    async function loadEdition(key: typeof selectedEdition) {
      try {
        const response = await fetch(`/api/editions/${key}/character-creation`);
        if (!response.ok) {
          throw new Error(`Failed to load edition data (${response.status})`);
        }
        const data = await response.json();
        const creationData: CharacterCreationData = data?.character_creation ?? data;
        setEditionData(creationData);
        setCreationMethods(creationData.creation_methods ?? {});
        const levels = Object.entries(creationData.gameplay_levels ?? {}).map(([value, { label }]) => ({
          value,
          label: label || value,
        }));
        setGameplayLevels(levels);
        if (!levels.some((level) => level.value === selectedGameplayLevel)) {
          setSelectedGameplayLevel(levels[0]?.value ?? 'experienced');
        }
      } catch (err) {
        console.error('Failed to load edition data', err);
      }
    }

    void loadEdition(selectedEdition);
  }, [selectedEdition, selectedGameplayLevel]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch('/api/users?role=gamemaster,administrator');
        if (!response.ok) {
          throw new Error(`Failed to load users (${response.status})`);
        }
        const payload: UserSummary[] = await response.json();
        if (!Array.isArray(payload) || payload.length === 0) {
          setUsers([]);
          return;
        }
        setUsers(payload);
        if (payload.length > 0) {
          setGmUserId((previous) => previous || payload[0].id);
        }
      } catch (err) {
        console.error('Failed to load users', err);
        setUsers([]);
      }
    }

    void loadUsers();
  }, []);

  useEffect(() => {
    async function loadCharacters() {
      try {
        const response = await fetch('/api/characters');
        if (!response.ok) {
          throw new Error(`Failed to load characters (${response.status})`);
        }
        const payload: CharacterSummary[] = await response.json();
        if (!Array.isArray(payload)) {
          setAvailableCharacters([]);
          return;
        }
        setAvailableCharacters(payload);
      } catch (err) {
        console.error('Failed to load characters', err);
        setAvailableCharacters([]);
      }
    }

    void loadCharacters();
  }, []);

  useEffect(() => {
    if (!editionData && characterCreationData) {
      setEditionData(characterCreationData);
      setCreationMethods(characterCreationData.creation_methods ?? {});
    }
  }, [characterCreationData, editionData]);

  useEffect(() => {
    if (!editionData && Object.keys(creationMethods).length === 0) {
      setCreationMethodOptions(DEFAULT_CREATION_METHOD_OPTIONS);
      return;
    }
    if (!creationMethods || Object.keys(creationMethods).length === 0) {
      setCreationMethodOptions(DEFAULT_CREATION_METHOD_OPTIONS);
      return;
    }
    const options = Object.entries(creationMethods).map(([value, definition]) => ({
      value,
      label: definition.label || value,
    }));
    setCreationMethodOptions(options);
  }, [creationMethods, editionData]);

  useEffect(() => {
    if (creationMethodOptions.length === 0) {
      return;
    }
    if (!creationMethodOptions.some((option) => option.value === selectedCreationMethod)) {
      setSelectedCreationMethod(creationMethodOptions[0].value);
    }
  }, [creationMethodOptions, selectedCreationMethod]);

  const editionOptions = useMemo<Option[]>(() => {
    return supportedEditions.map((edition) => ({
      label: edition.label,
      value: edition.key,
    }));
  }, [supportedEditions]);

  const gmOptions = useMemo<Option[]>(() => {
    if (users.length === 0) {
      return [{ label: 'No gamemasters found', value: '' }];
    }
    return users.map((user) => ({
      label: `${user.username} (${user.email})`,
      value: user.id,
    }));
  }, [users]);

  const resetWizard = useCallback(
    (overrideDefaultBook?: string) => {
      const nextDefault = overrideDefaultBook ?? deriveDefaultBookCode(selectedEdition);
      dispatchDraft({ type: 'RESET', payload: { ...defaultDraft } });
      setSelectedGameplayLevel('experienced');
      setSelectedCreationMethod(creationMethodOptions[0]?.value ?? 'priority');
      setGmUserId(users[0]?.id ?? '');
      setError(null);
      setCurrentStep(0);
      setSelectedBooks([nextDefault]);
      setBooksExpanded(false);
      setBookLoadError(null);
    },
    [creationMethodOptions, selectedEdition, users],
  );

  function handleOpen() {
    const initialBook = deriveDefaultBookCode(activeEdition.key);
    setSelectedEdition(activeEdition.key);
    resetWizard(initialBook);
    setIsOpen(true);
  }

  function handleCancel() {
    resetWizard();
    setIsOpen(false);
  }

  function validateStep(step: number): boolean {
    if (step === 0 && !draft.name.trim()) {
      setError('Campaign name is required.');
      return false;
    }
    if (step === 1 && draft.selectedPlayers.length === 0 && draft.placeholders.length === 0) {
      setError('Select at least one existing character or create a placeholder runner.');
      return false;
    }
    if (step === 2 && draft.factions.length === 0 && draft.locations.length === 0) {
      setError('Add at least one faction or location, or use the quick-add template.');
      return false;
    }
    if (step === 4 && !draft.sessionSeed.skip && !draft.sessionSeed.title.trim()) {
      setError('Provide a title for the initial session or choose to skip.');
      return false;
    }
    setError(null);
    return true;
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEP_LABELS.length - 1));
  };
  const handleQuickAddFaction = useCallback(() => {
    const newId = generateId('faction');
    dispatchDraft({ type: 'ADD_FACTION' });
    dispatchDraft({
      type: 'UPDATE_FACTION',
      id: newId,
      field: 'name',
      value: 'Ares Macrotechnology',
    });
    dispatchDraft({
      type: 'UPDATE_FACTION',
      id: newId,
      field: 'tags',
      value: 'Corporate, AAA',
    });
    dispatchDraft({
      type: 'UPDATE_FACTION',
      id: newId,
      field: 'notes',
      value: 'Megacorp interested in experimental weapons testing.',
    });
  }, []);

  const handleQuickAddLocation = useCallback(() => {
    const newId = generateId('location');
    dispatchDraft({ type: 'ADD_LOCATION' });
    dispatchDraft({
      type: 'UPDATE_LOCATION',
      id: newId,
      field: 'name',
      value: 'Downtown Seattle Safehouse',
    });
    dispatchDraft({
      type: 'UPDATE_LOCATION',
      id: newId,
      field: 'descriptor',
      value: 'Secure condo with rating 4 security and friendly neighbors.',
    });
  }, []);

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const gmUser = users.find((user) => user.id === gmUserId);
      const campaignName = draft.name.trim() || 'Campaign';

      const houseRulesPayload = {
        automation: draft.houseRules,
        notes: draft.houseRuleNotes,
        theme: draft.theme,
        factions: draft.factions,
        locations: draft.locations,
        placeholders: draft.placeholders,
        session_seed: draft.sessionSeed,
      };

      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: draft.name.trim(),
          description: draft.description,
          gm_user_id: gmUserId,
          gm_name: gmUser?.username ?? gmUser?.email ?? '',
          edition: selectedEdition,
          gameplay_level: selectedGameplayLevel,
          creation_method: selectedCreationMethod,
          enabled_books: selectedBooks,
          house_rules: JSON.stringify(houseRulesPayload),
          status: 'Active',
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Failed to create campaign (${response.status})`);
      }

      const campaign: CampaignSummary = await response.json();

      const warnings: string[] = [];

      if (draft.placeholders.length > 0) {
        try {
          await Promise.all(
            draft.placeholders.map(async (placeholder) => {
              const characterResponse = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: placeholder.name,
                  player_name: placeholder.role,
                  status: 'Placeholder',
                  edition: selectedEdition,
                  edition_data: {},
                  is_npc: true,
                  campaign_id: campaign.id,
                }),
              });
              if (!characterResponse.ok) {
                const message = await characterResponse.text();
                throw new Error(message || `Failed to create placeholder (${characterResponse.status})`);
              }
            }),
          );
        } catch (placeholderError) {
          console.error('Failed to create placeholder characters', placeholderError);
          warnings.push('Placeholder runners were not saved.');
        }
      }

      if (!draft.sessionSeed.skip) {
        try {
          const sessionResponse = await fetch('/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              campaign_id: campaign.id,
              name: draft.sessionSeed.title || 'Session 0',
              description: draft.sessionSeed.objectives,
              notes: draft.sessionSeed.summary,
              session_date: new Date().toISOString(),
              status: 'Planned',
            }),
          });
          if (!sessionResponse.ok) {
            const message = await sessionResponse.text();
            throw new Error(message || `Failed to create session seed (${sessionResponse.status})`);
          }
        } catch (sessionError) {
          console.error('Failed to create session seed', sessionError);
          warnings.push('Session seed could not be created automatically.');
        }
      }

      resetWizard();
      window.ShadowmasterLegacyApp?.loadCampaigns?.();
      window.dispatchEvent(new Event('shadowmaster:campaigns:refresh'));
      onCreated?.(campaign);
      setIsOpen(false);

      pushNotification({
        type: 'success',
        title: `${campaignName} created`,
        description: 'Campaign is ready for onboarding.',
      });

      if (warnings.length > 0) {
        pushNotification({
          type: 'warning',
          title: 'Campaign created with warnings',
          description: warnings.join('\n'),
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create campaign.';
      setError(message);
      pushNotification({
        type: 'error',
        title: 'Campaign creation failed',
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const editionCreationMethod = creationMethods[selectedCreationMethod];

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <section className="campaign-step">
            <h4>Campaign Essentials</h4>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="campaign-name">Campaign Name</label>
                <input
                  id="campaign-name"
                  name="campaign-name"
                  value={draft.name}
                  onChange={(event) =>
                    dispatchDraft({ type: 'UPDATE_FIELD', field: 'name', value: event.target.value })
                  }
                  required
                  placeholder="Enter campaign title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="campaign-theme">Theme / Tagline</label>
                <input
                  id="campaign-theme"
                  name="campaign-theme"
                  value={draft.theme}
                  onChange={(event) =>
                    dispatchDraft({ type: 'UPDATE_FIELD', field: 'theme', value: event.target.value })
                  }
                  placeholder="e.g., Neo-Tokyo corporate intrigue"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="campaign-edition">Edition</label>
                <select
                  id="campaign-edition"
                  name="campaign-edition"
                  value={selectedEdition}
                  onChange={(event) => {
                    const value = event.target.value as typeof selectedEdition;
                    setSelectedEdition(value);
                    setEdition(value);
                    setSelectedBooks([deriveDefaultBookCode(value)]);
                    setBooksExpanded(false);
                    setBookLoadError(null);
                    void reloadEditionData(value);
                  }}
                >
                  {editionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {gameplayLevels.length > 0 && (
                <div className="form-group">
                  <label htmlFor="campaign-gameplay-level">Gameplay Level</label>
                  <select
                    id="campaign-gameplay-level"
                    name="campaign-gameplay-level"
                    value={selectedGameplayLevel}
                    onChange={(event) => setSelectedGameplayLevel(event.target.value)}
                  >
                    {gameplayLevels.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="campaign-creation-method">Character Creation Method</label>
              <select
                id="campaign-creation-method"
                name="campaign-creation-method"
                value={selectedCreationMethod}
                onChange={(event) => setSelectedCreationMethod(event.target.value)}
              >
                {creationMethodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="form-help">
                {editionCreationMethod?.description && <p>{editionCreationMethod.description}</p>}
                {selectedCreationMethod !== 'priority' && (
                  <p>
                    Support for Sum-to-Ten and Karma methods is still under development. Characters will temporarily
                    default to Priority until the new workflows are implemented.
                  </p>
                )}
              </div>
            </div>

            <div className="collapsible">
              <button
                type="button"
                className="collapsible__trigger"
                aria-expanded={booksExpanded}
                onClick={() => setBooksExpanded((previous) => !previous)}
              >
                <span>Source Books</span>
                <span className="collapsible__chevron" aria-hidden="true">
                  {booksExpanded ? '▾' : '▸'}
                </span>
              </button>
              <div
                className={`collapsible__content ${booksExpanded ? 'collapsible__content--open' : ''}`}
                aria-live="polite"
              >
                <p className="form-help">
                  Enable the references that should be legal at your table. {defaultBookCode} is always required and stays
                  selected.
                </p>
                {bookLoadError && <p className="form-warning">{bookLoadError}</p>}
                {isLoadingBooks ? (
                  <p className="form-help">Loading books…</p>
                ) : (
                  <div className="book-checkboxes">
                    {availableBooks.map((book) => {
                      const code = book.code.toUpperCase();
                      const checked = selectedBooks.includes(code);
                      const disabled = code === defaultBookCode;
                      return (
                        <label key={code} className={`book-checkbox ${disabled ? 'book-checkbox--locked' : ''}`}>
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={(event) => {
                              const isChecked = event.target.checked;
                              setSelectedBooks((previous) => {
                                const next = new Set(previous.map((value) => value.toUpperCase()));
                                if (isChecked) {
                                  next.add(code);
                                } else {
                                  next.delete(code);
                                }
                                if (!next.has(defaultBookCode)) {
                                  next.add(defaultBookCode);
                                }
                                return Array.from(next).sort();
                              });
                            }}
                          />
                          <div>
                            <strong>{book.name}</strong>
                            <span className="book-code">{code}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="campaign-gm">Gamemaster</label>
              <select
                id="campaign-gm"
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
              <label htmlFor="campaign-description">Campaign Overview</label>
              <textarea
                id="campaign-description"
                name="campaign-description"
                value={draft.description}
                onChange={(event) =>
                  dispatchDraft({ type: 'UPDATE_FIELD', field: 'description', value: event.target.value })
                }
                placeholder="Summarize the campaign's premise, tone, and key hooks."
                rows={4}
              />
            </div>
          </section>
        );
      case 1:
        return (
          <section className="campaign-step">
            <h4>Roster & Roles</h4>
            <p>Attach existing player characters or create placeholders to represent expected runners.</p>
            <div className="form-group">
              <label htmlFor="campaign-players">Existing Characters</label>
              {availableCharacters.length === 0 ? (
                <p className="form-help">No characters found yet. You can create placeholders below.</p>
              ) : (
                <div className="character-checkboxes">
                  {availableCharacters.map((character) => {
                    const label = character.player_name
                      ? `${character.name} — ${character.player_name}`
                      : character.name;
                    const checked = draft.selectedPlayers.includes(character.id);
                    return (
                      <label key={character.id} className="character-checkbox">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            dispatchDraft({
                              type: 'UPDATE_FIELD',
                              field: 'selectedPlayers',
                              value: event.target.checked
                                ? [...draft.selectedPlayers, character.id]
                                : draft.selectedPlayers.filter((id) => id !== character.id),
                            });
                          }}
                        />
                        <span>{label}</span>
                        {character.status && <small className="character-status">{character.status}</small>}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Player Characters</label>
              <p className="form-help">
                Player selection is coming soon. Use placeholders to capture your expected team composition.
              </p>
              <div className="placeholder-list">
                {draft.placeholders.map((placeholder) => (
                  <div key={placeholder.id} className="placeholder-card">
                    <input
                      value={placeholder.name}
                      onChange={(event) =>
                        dispatchDraft({
                          type: 'UPDATE_PLACEHOLDER',
                          id: placeholder.id,
                          field: 'name',
                          value: event.target.value,
                        })
                      }
                      placeholder="Runner handle"
                    />
                    <input
                      value={placeholder.role}
                      onChange={(event) =>
                        dispatchDraft({
                          type: 'UPDATE_PLACEHOLDER',
                          id: placeholder.id,
                          field: 'role',
                          value: event.target.value,
                        })
                      }
                      placeholder="Role / specialty"
                    />
                    <button
                      type="button"
                      className="btn-link"
                      onClick={() => dispatchDraft({ type: 'REMOVE_PLACEHOLDER', id: placeholder.id })}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" className="btn-secondary" onClick={() => dispatchDraft({ type: 'ADD_PLACEHOLDER' })}>
                  Add Placeholder
                </button>
              </div>
            </div>
          </section>
        );
      case 2:
        return (
          <section className="campaign-step">
            <h4>World Backbone</h4>
            <p>Capture recurring factions and key locations to anchor your campaign.</p>
            {error && <p className="form-error">{error}</p>}
            <div className="form-grid">
              <div className="form-group">
                <label>Factions</label>
                <div className="backbone-list">
                  {draft.factions.map((faction) => (
                    <div key={faction.id} className="backbone-card">
                      <input
                        value={faction.name}
                        onChange={(event) =>
                          dispatchDraft({
                            type: 'UPDATE_FACTION',
                            id: faction.id,
                            field: 'name',
                            value: event.target.value,
                          })
                        }
                        placeholder="Faction name"
                      />
                      <input
                        value={faction.tags}
                        onChange={(event) =>
                          dispatchDraft({
                            type: 'UPDATE_FACTION',
                            id: faction.id,
                            field: 'tags',
                            value: event.target.value,
                          })
                        }
                        placeholder="Tags (corp, gang, fixer...)"
                      />
                      <textarea
                        value={faction.notes}
                        onChange={(event) =>
                          dispatchDraft({
                            type: 'UPDATE_FACTION',
                            id: faction.id,
                            field: 'notes',
                            value: event.target.value,
                          })
                        }
                        placeholder="Notes / agenda"
                      />
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() => dispatchDraft({ type: 'REMOVE_FACTION', id: faction.id })}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="backbone-actions">
                    <button type="button" className="btn-secondary" onClick={() => dispatchDraft({ type: 'ADD_FACTION' })}>
                      Add Faction
                    </button>
                    <button type="button" className="btn-link" onClick={handleQuickAddFaction}>
                      Quick-add template
                    </button>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Locations</label>
                <div className="backbone-list">
                  {draft.locations.map((location) => (
                    <div key={location.id} className="backbone-card">
                      <input
                        value={location.name}
                        onChange={(event) =>
                          dispatchDraft({
                            type: 'UPDATE_LOCATION',
                            id: location.id,
                            field: 'name',
                            value: event.target.value,
                          })
                        }
                        placeholder="Location name"
                      />
                      <textarea
                        value={location.descriptor}
                        onChange={(event) =>
                          dispatchDraft({
                            type: 'UPDATE_LOCATION',
                            id: location.id,
                            field: 'descriptor',
                            value: event.target.value,
                          })
                        }
                        placeholder="Descriptor (security rating, vibe...)"
                      />
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() => dispatchDraft({ type: 'REMOVE_LOCATION', id: location.id })}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="backbone-actions">
                    <button type="button" className="btn-secondary" onClick={() => dispatchDraft({ type: 'ADD_LOCATION' })}>
                      Add Location
                    </button>
                    <button type="button" className="btn-link" onClick={handleQuickAddLocation}>
                      Quick-add template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      case 3:
        return (
          <section className="campaign-step">
            <h4>House Rules & Automation</h4>
            <p>Toggle planned automation modules or make notes about house rules you plan to apply.</p>
            <div className="automation-grid">
              {AUTOMATION_TOGGLES.map((toggle) => (
                <label key={toggle.key} className="automation-toggle">
                  <input
                    type="checkbox"
                    checked={Boolean(draft.houseRules[toggle.key])}
                    onChange={(event) =>
                      dispatchDraft({
                        type: 'UPDATE_HOUSE_RULE',
                        key: toggle.key,
                        value: event.target.checked,
                      })
                    }
                  />
                  <div>
                    <strong>{toggle.label}</strong>
                    <p>{toggle.description}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="form-group">
              <label htmlFor="house-rule-notes">House Rule Notes</label>
              <textarea
                id="house-rule-notes"
                value={draft.houseRuleNotes}
                onChange={(event) =>
                  dispatchDraft({ type: 'UPDATE_FIELD', field: 'houseRuleNotes', value: event.target.value })
                }
                placeholder="Describe any custom rules, optional modules, or reminders."
                rows={4}
              />
            </div>
          </section>
        );
      case 4:
        return (
          <section className="campaign-step">
            <h4>Session Seed</h4>
            <label className="skip-toggle">
              <input
                type="checkbox"
                checked={draft.sessionSeed.skip}
                onChange={(event) =>
                  dispatchDraft({
                    type: 'UPDATE_SESSION_SEED',
                    field: 'skip',
                    value: event.target.checked,
                  })
                }
              />
              Skip session setup for now
            </label>
            {!draft.sessionSeed.skip && (
              <>
                <div className="form-group">
                  <label htmlFor="session-title">Session Title</label>
                  <input
                    id="session-title"
                    value={draft.sessionSeed.title}
                    onChange={(event) =>
                      dispatchDraft({
                        type: 'UPDATE_SESSION_SEED',
                        field: 'title',
                        value: event.target.value,
                      })
                    }
                    placeholder="Session 0: The job offer"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="session-objectives">Objectives / Notes</label>
                  <textarea
                    id="session-objectives"
                    value={draft.sessionSeed.objectives}
                    onChange={(event) =>
                      dispatchDraft({
                        type: 'UPDATE_SESSION_SEED',
                        field: 'objectives',
                        value: event.target.value,
                      })
                    }
                    placeholder="List your opening beats, key NPCs, or complications."
                    rows={4}
                  />
                </div>
                <div className="form-group">
                  <label>Scene Template</label>
                  <div className="session-template-options">
                    {SESSION_TEMPLATES.map((template) => (
                      <label key={template.value} className="session-template">
                        <input
                          type="radio"
                          name="session-template"
                          value={template.value}
                          checked={draft.sessionSeed.sceneTemplate === template.value}
                          onChange={(event) =>
                            dispatchDraft({
                              type: 'UPDATE_SESSION_SEED',
                              field: 'sceneTemplate',
                              value: event.target.value,
                            })
                          }
                        />
                        <div>
                          <strong>{template.label}</strong>
                          <p>{template.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="session-summary">Session Summary (what happened)</label>
                  <textarea
                    id="session-summary"
                    value={draft.sessionSeed.summary}
                    onChange={(event) =>
                      dispatchDraft({
                        type: 'UPDATE_SESSION_SEED',
                        field: 'summary',
                        value: event.target.value,
                      })
                    }
                    placeholder="Quick notes on outcomes once the session wraps."
                    rows={3}
                  />
                </div>
              </>
            )}
          </section>
        );
      case 5:
        return (
          <section className="campaign-step">
            <h4>Review & Launch</h4>
            <div className="review-grid">
              <div className="review-card">
                <h5>Campaign Overview</h5>
                <ul>
                  <li>
                    <strong>Name:</strong> {draft.name || '—'}
                  </li>
                  <li>
                    <strong>Theme:</strong> {draft.theme || '—'}
                  </li>
                  <li>
                    <strong>Edition:</strong> {selectedEdition.toUpperCase()}
                  </li>
                  <li>
                    <strong>Gameplay Level:</strong> {selectedGameplayLevel}
                  </li>
                  <li>
                    <strong>Creation Method:</strong> {selectedCreationMethod}
                  </li>
                  <li>
                    <strong>Source Books:</strong> {selectedBookLabels.length > 0 ? selectedBookLabels.join(', ') : defaultBookCode}
                  </li>
                  <li>
                    <strong>GM:</strong>{' '}
                    {gmOptions.find((option) => option.value === gmUserId)?.label ?? 'Unassigned'}
                  </li>
                </ul>
              </div>
              <div className="review-card">
                <h5>Roster & World</h5>
                <p>
                  <strong>Placeholders:</strong> {draft.placeholders.length}{' '}
                  {draft.placeholders.length > 0 &&
                    `(${draft.placeholders.map((placeholder) => placeholder.name).join(', ')})`}
                </p>
                <p>
                  <strong>Factions:</strong> {draft.factions.length}
                </p>
                <p>
                  <strong>Locations:</strong> {draft.locations.length}
                </p>
              </div>
              <div className="review-card">
                <h5>Automation & Session</h5>
                <p>
                  <strong>Automation toggles:</strong>{' '}
                  {Object.entries(draft.houseRules)
                    .filter(([, enabled]) => enabled)
                    .map(([key]) => key.replace(/_/g, ' '))
                    .join(', ') || 'None'}
                </p>
                <p>
                  <strong>House rule notes:</strong> {draft.houseRuleNotes || '—'}
                </p>
                <p>
                  <strong>Session seed:</strong>{' '}
                  {draft.sessionSeed.skip
                    ? 'Skipped for now'
                    : `${draft.sessionSeed.title} (${draft.sessionSeed.sceneTemplate})`}
                </p>
              {!draft.sessionSeed.skip && draft.sessionSeed.objectives && (
                <p>
                  <strong>Objectives:</strong> {draft.sessionSeed.objectives}
                </p>
              )}
              </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  if (!container) {
    return null;
  }

  return createPortal(
    <section
      className={`campaign-create-react ${isOpen ? 'campaign-create-react--open' : 'campaign-create-react--collapsed'}`}
    >
      {!isOpen ? (
        <div className="campaign-create-trigger">
          <div className="campaign-create-trigger__copy">
            <h3>Plan Your Next Campaign</h3>
            <p>Select an edition, assign a GM, and lock in gameplay defaults.</p>
          </div>
          <button type="button" className="btn-primary" onClick={handleOpen}>
            Create Campaign
          </button>
        </div>
      ) : (
        <div className="campaign-wizard">
          <div className="campaign-wizard__header">
            <h3>Create Campaign</h3>
            <nav className="campaign-wizard__navigation" aria-label="Campaign creation steps">
              {STEP_LABELS.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  className={`campaign-wizard__step ${
                    currentStep === index ? 'campaign-wizard__step--active' : ''
                  } ${currentStep > index ? 'campaign-wizard__step--completed' : ''}`}
                  onClick={() => setCurrentStep(index)}
                >
                  <span className="campaign-wizard__step-index">{index + 1}</span>
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <form className="campaign-wizard__form" onSubmit={handleSubmit}>
            {renderStep()}

            {error && <p className="form-error">{error}</p>}

            <div className="campaign-wizard__actions">
              <button type="button" className="btn-secondary" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </button>
              <div className="campaign-wizard__actions-right">
                {!isFirstStep && (
                  <button type="button" className="btn-secondary" onClick={handleBack} disabled={isSubmitting}>
                    Back
                  </button>
                )}
                {!isLastStep ? (
                  <button type="button" className="btn-primary" onClick={handleNext} disabled={isSubmitting}>
                    Next
                  </button>
                ) : (
                  <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating…' : 'Create Campaign'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </section>,
    container,
  );
}

