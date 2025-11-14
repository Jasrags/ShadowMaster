import { FormEvent, RefObject, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useEdition } from '../hooks/useEdition';
import { CharacterCreationData, CreationMethodDefinition, SourceBook, UserSummary } from '../types/editions';
import { loadLocalPlayerDirectory } from '../utils/playerDirectory';
import { CharacterSummary } from '../types/characters';
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

const AUTOMATION_DEFAULTS = AUTOMATION_TOGGLES.map((toggle) => toggle.key);

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

function resolveApiPath(path: string): string {
  if (typeof window === 'undefined' || !window.location?.origin) {
    return path;
  }
  try {
    return new URL(path, window.location.origin).toString();
  } catch {
    return path;
  }
}

function shouldSkipPlayerFetch(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test') {
    return true;
  }
  return false;
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

interface DraftState {
  name: string;
  description: string;
  theme: string;
  selectedPlayers: string[];
  selectedPlayerUserIds: string[];
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
  | { type: 'ADD_PLACEHOLDER_WITH_ID'; id: string; name: string; role: string }
  | { type: 'REMOVE_PLACEHOLDER'; id: string }
  | { type: 'UPDATE_FACTION'; id: string; field: keyof DraftState['factions'][number]; value: string }
  | { type: 'ADD_FACTION' }
  | { type: 'ADD_FACTION_WITH_ID'; id: string }
  | { type: 'REMOVE_FACTION'; id: string }
  | { type: 'UPDATE_LOCATION'; id: string; field: keyof DraftState['locations'][number]; value: string }
  | { type: 'ADD_LOCATION' }
  | { type: 'ADD_LOCATION_WITH_ID'; id: string }
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
  selectedPlayerUserIds: [],
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
    case 'ADD_PLACEHOLDER_WITH_ID':
      return {
        ...state,
        placeholders: [
          ...state.placeholders,
          {
            id: action.id,
            name: action.name,
            role: action.role,
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
    case 'ADD_FACTION_WITH_ID':
      return {
        ...state,
        factions: [
          ...state.factions,
          {
            id: action.id,
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
    case 'ADD_LOCATION_WITH_ID':
      return {
        ...state,
        locations: [
          ...state.locations,
          {
            id: action.id,
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
    campaignCharacterCreation,
    reloadEditionData,
    setEdition,
  } = useEdition();

  const preferredEdition = useMemo(() => {
    const sr5 = supportedEditions.find((edition) => edition.key === 'sr5');
    return sr5 ? sr5.key : activeEdition.key;
  }, [activeEdition.key, supportedEditions]);

  const [container, setContainer] = useState<Element | null>(null);
  const [selectedEdition, setSelectedEdition] = useState(preferredEdition);
  const [editionData, setEditionData] = useState<CharacterCreationData | undefined>(characterCreationData);
  const [gameplayLevels, setGameplayLevels] = useState<Option[]>([]);
  const [availableCharacters, setAvailableCharacters] = useState<CharacterSummary[]>([]);
  const [gmUserId, setGmUserId] = useState<string>('');
  const [selectedGameplayLevel, setSelectedGameplayLevel] = useState<string>('experienced');
  const [selectedCreationMethod, setSelectedCreationMethod] = useState<string>('priority');
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [playerUsers, setPlayerUsers] = useState<UserSummary[]>(() => loadLocalPlayerDirectory());
  const [creationMethods, setCreationMethods] = useState<Record<string, CreationMethodDefinition>>({});
  const [creationMethodOptions, setCreationMethodOptions] = useState<Option[]>(DEFAULT_CREATION_METHOD_OPTIONS);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [draft, dispatchDraft] = useReducer(draftReducer, defaultDraft);
  const [availableBooks, setAvailableBooks] = useState<SourceBook[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>(() => [deriveDefaultBookCode(preferredEdition)]);
  const [booksExpanded, setBooksExpanded] = useState(false);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [bookLoadError, setBookLoadError] = useState<string | null>(null);
  const { pushNotification } = useNotifications();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});
  const [isFactionLibraryOpen, setFactionLibraryOpen] = useState(false);
  const [isLocationLibraryOpen, setLocationLibraryOpen] = useState(false);
  const [isPlaceholderLibraryOpen, setPlaceholderLibraryOpen] = useState(false);
  const [isPlayerLibraryOpen, setPlayerLibraryOpen] = useState(false);
  const [isSessionSeedLibraryOpen, setSessionSeedLibraryOpen] = useState(false);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const themeRef = useRef<HTMLInputElement | null>(null);
  const gmRef = useRef<HTMLSelectElement | null>(null);
  const overviewRef = useRef<HTMLTextAreaElement | null>(null);
  const rosterRef = useRef<HTMLDivElement | null>(null);
  const backboneRef = useRef<HTMLDivElement | null>(null);
  const sessionSeedRef = useRef<HTMLDivElement | null>(null);

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
    setSelectedEdition(preferredEdition);
  }, [preferredEdition]);

  useEffect(() => {
    if (activeEdition.key !== preferredEdition) {
      setEdition(preferredEdition);
    }
  }, [activeEdition.key, preferredEdition, setEdition]);

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
    let cancelled = false;

    async function loadPlayers() {
      if (shouldSkipPlayerFetch()) {
        return;
      }
      try {
        const response = await fetch(resolveApiPath('/api/users?role=player'), {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`Failed to load player roster (${response.status})`);
        }
        const payload = (await response.json()) as unknown;
        const normalized = normalizeUserSummaries(payload)
          .filter((user) => Array.isArray(user.roles) && user.roles.includes('player'))
          .map((user) => ({
            ...user,
            username: user.username.trim(),
          }));
        if (!cancelled && normalized.length > 0) {
          setPlayerUsers(normalized);
        }
      } catch (err) {
        console.warn('Failed to load player roster', err);
      }
    }

    void loadPlayers();

    return () => {
      cancelled = true;
    };
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
    const options = Object.entries(creationMethods)
      .map(([value, definition]) => ({
      value,
      label: definition.label || value,
      }))
      .sort((a, b) => {
        if (a.value === 'priority') return -1;
        if (b.value === 'priority') return 1;
        return a.label.localeCompare(b.label);
      });
    setCreationMethodOptions(options);
  }, [creationMethods, editionData]);

  useEffect(() => {
    if (creationMethodOptions.length === 0) {
      return;
    }
    if (!creationMethodOptions.some((option) => option.value === selectedCreationMethod)) {
      const priorityOption = creationMethodOptions.find((option) => option.value === 'priority');
      setSelectedCreationMethod(priorityOption?.value ?? creationMethodOptions[0].value);
      return;
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

  const playerRosterLookup = useMemo(() => {
    const map = new Map<string, UserSummary>();
    playerUsers.forEach((user) => {
      if (user?.id) {
        map.set(user.id, user);
      }
    });
    return map;
  }, [playerUsers]);

  const selectedPlayerDetails = useMemo(() => {
    return draft.selectedPlayerUserIds
      .map((id) => playerRosterLookup.get(id))
      .filter((user): user is UserSummary => Boolean(user));
  }, [draft.selectedPlayerUserIds, playerRosterLookup]);

  const sortedSelectedPlayerDetails = useMemo(() => {
    return [...selectedPlayerDetails].sort((a, b) => {
      const aPrimary = (a.username || a.id || '').toLowerCase();
      const bPrimary = (b.username || b.id || '').toLowerCase();
      const comparison = aPrimary.localeCompare(bPrimary);
      if (comparison !== 0) {
        return comparison;
      }
      return (a.id ?? '').localeCompare(b.id ?? '');
    });
  }, [selectedPlayerDetails]);

  const campaignSupport = useMemo(() => {
    return campaignCharacterCreation?.campaign_support ?? characterCreationData?.campaign_support;
  }, [campaignCharacterCreation?.campaign_support, characterCreationData?.campaign_support]);

  const factionLibrary = campaignSupport?.factions ?? [];
  const locationLibrary = campaignSupport?.locations ?? [];
  const placeholderLibrary = campaignSupport?.placeholders ?? [];
  const sessionSeedLibrary = campaignSupport?.session_seeds ?? [];

  const [factionFilter, setFactionFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [placeholderFilter, setPlaceholderFilter] = useState('');
  const [playerFilter, setPlayerFilter] = useState('');
  const [sessionSeedFilter, setSessionSeedFilter] = useState('');

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

  const filteredPlaceholderLibrary = useMemo(() => {
    if (!placeholderFilter.trim()) {
      return placeholderLibrary;
    }
    const term = placeholderFilter.toLowerCase();
    return placeholderLibrary.filter((preset) => {
      return (
        preset.name.toLowerCase().includes(term) ||
        (preset.role ?? '').toLowerCase().includes(term)
      );
    });
  }, [placeholderFilter, placeholderLibrary]);

  const selectedPlayerIdSet = useMemo(
    () => new Set(draft.selectedPlayerUserIds),
    [draft.selectedPlayerUserIds],
  );

  const filteredPlayerUsers = useMemo(() => {
    if (!playerFilter.trim()) {
      return playerUsers;
    }
    const term = playerFilter.toLowerCase();
    return playerUsers.filter((user) => {
      const username = (user.username ?? '').toLowerCase();
      return username.includes(term);
    });
  }, [playerFilter, playerUsers]);

  const filteredSessionSeedLibrary = useMemo(() => {
    if (!sessionSeedFilter.trim()) {
      return sessionSeedLibrary;
    }
    const term = sessionSeedFilter.toLowerCase();
    return sessionSeedLibrary.filter((preset) => {
      return (
        preset.title.toLowerCase().includes(term) ||
        (preset.objectives ?? '').toLowerCase().includes(term) ||
        (preset.scene_template ?? '').toLowerCase().includes(term) ||
        (preset.summary ?? '').toLowerCase().includes(term)
      );
    });
  }, [sessionSeedFilter, sessionSeedLibrary]);

  const resetWizard = useCallback(
    (overrideDefaultBook?: string) => {
      const nextDefault = overrideDefaultBook ?? deriveDefaultBookCode(selectedEdition);
      dispatchDraft({ type: 'RESET', payload: { ...defaultDraft } });
      setSelectedGameplayLevel('experienced');
      setSelectedCreationMethod(creationMethodOptions[0]?.value ?? 'priority');
      setGmUserId(users[0]?.id ?? '');
      setError(null);
      setFieldErrors({});
      setStepErrors({});
      setCurrentStep(0);
      setSelectedBooks([nextDefault]);
      setBooksExpanded(false);
      setBookLoadError(null);
      setPlayerLibraryOpen(false);
      setPlayerFilter('');
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
    const errors: Record<string, string> = {};
    let summary: string | undefined;

    if (step === 0) {
      if (!draft.name.trim()) {
        errors.name = 'Campaign name is required.';
        summary = 'Provide a campaign name before continuing.';
      }
      if (users.length > 0 && !gmUserId) {
        errors.gm = 'Assign a gamemaster.';
        summary = summary ?? 'Assign a gamemaster before continuing.';
    }
    }

    if (step === 1 &&
      draft.selectedPlayers.length === 0 &&
      draft.placeholders.length === 0 &&
      draft.selectedPlayerUserIds.length === 0) {
      errors.roster = 'Select at least one player, existing character, or create a placeholder runner.';
      summary = 'Attach players or runners before continuing.';
    }

    if (step === 2 && draft.factions.length === 0 && draft.locations.length === 0) {
      errors.backbone = 'Add at least one faction or location, or use the quick-add template.';
      summary = 'Capture at least one faction or location before continuing.';
    }

    if (step === 4 && !draft.sessionSeed.skip && !draft.sessionSeed.title.trim()) {
      errors.sessionSeed = 'Provide a title for the initial session or choose to skip.';
      summary = 'Name your first session or choose to skip.';
    }

    if (Object.keys(errors).length > 0) {
      applyErrors(step, errors, summary);
      return false;
    }

    setError(null);
    setFieldErrors({});
    clearStepError(step);
    return true;
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }
    const nextStep = Math.min(currentStep + 1, STEP_LABELS.length - 1);
    setFieldErrors({});
    setCurrentStep(nextStep);
    if (stepErrors[nextStep]?.length) {
      validateStep(nextStep);
    } else {
      if (!Object.values(stepErrors).some((messages) => messages?.length)) {
        setError(null);
      }
    }
  };

  const focusField = (ref?: RefObject<Element | null>) => {
    if (!ref?.current || !(ref.current instanceof HTMLElement)) {
      return;
    }
    ref.current.focus({ preventScroll: true });
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const applyErrors = (step: number, errors: Record<string, string>, summary?: string) => {
    const errorKeys = Object.keys(errors);
    const firstField = errorKeys[0];

    const messages =
      summary != null
        ? [
            summary,
            ...errorKeys
              .filter((field) => field !== firstField)
              .map((field) => errors[field])
              .filter((message) => message && message !== summary),
          ]
        : errorKeys.map((field) => errors[field]);

    setError(messages[0] ?? null);
    setFieldErrors(errors);
    setStepErrors((prev) => ({
      ...prev,
      [step]: messages.length > 0 ? messages : ['Please resolve the highlighted fields.'],
    }));

    if (firstField) {
      switch (firstField) {
        case 'name':
          focusField(nameRef);
          break;
        case 'theme':
          focusField(themeRef);
          break;
        case 'gm':
          focusField(gmRef);
          break;
        case 'overview':
          focusField(overviewRef);
          break;
        case 'roster':
          focusField(rosterRef);
          break;
        case 'backbone':
          focusField(backboneRef);
          break;
        case 'sessionSeed':
          focusField(sessionSeedRef);
          break;
        default:
          break;
      }
    }
  };

  const clearStepError = (step: number) => {
    setStepErrors((prev) => {
      if (!(step in prev)) {
        return prev;
      }
      const { [step]: _removed, ...rest } = prev;
      if (Object.keys(rest).length === 0) {
        setError(null);
      }
      return rest;
    });
  };

  const clearFieldError = (field: string, step = currentStep) => {
    setFieldErrors((prev) => {
      if (!(field in prev)) {
        return prev;
      }
      const copy = { ...prev };
      delete copy[field];
      if (Object.keys(copy).length === 0) {
        if (step === currentStep) {
          setError(null);
        }
        clearStepError(step);
      }
      return copy;
    });
  };

  const handleQuickAddFaction = useCallback(() => {
    const newId = generateId('faction');
    dispatchDraft({ type: 'ADD_FACTION_WITH_ID', id: newId });
    dispatchDraft({ type: 'UPDATE_FACTION', id: newId, field: 'name', value: 'Ares Macrotechnology' });
    dispatchDraft({ type: 'UPDATE_FACTION', id: newId, field: 'tags', value: 'Corporate, AAA' });
    dispatchDraft({
      type: 'UPDATE_FACTION',
      id: newId,
      field: 'notes',
      value: 'Megacorp interested in experimental weapons testing.',
    });
    clearFieldError('backbone', 2);
  }, [clearFieldError]);

  const handleQuickAddLocation = useCallback(() => {
    const newId = generateId('location');
    dispatchDraft({ type: 'ADD_LOCATION_WITH_ID', id: newId });
    dispatchDraft({ type: 'UPDATE_LOCATION', id: newId, field: 'name', value: 'Downtown Seattle Safehouse' });
    dispatchDraft({
      type: 'UPDATE_LOCATION',
      id: newId,
      field: 'descriptor',
      value: 'Secure condo with rating 4 security and friendly neighbors.',
    });
    clearFieldError('backbone', 2);
  }, [clearFieldError]);

  const handleBack = () => {
    const targetStep = Math.max(currentStep - 1, 0);
    setFieldErrors({});
    setCurrentStep(targetStep);
    if (stepErrors[targetStep]?.length) {
      validateStep(targetStep);
    } else {
      if (!Object.values(stepErrors).some((messages) => messages?.length)) {
    setError(null);
      }
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateStep(currentStep)) {
      return;
    }

    const outstandingStep = Object.entries(stepErrors).find(
      ([index, messages]) => Number(index) !== currentStep && messages?.length,
    );
    if (outstandingStep) {
      const nextStep = Number(outstandingStep[0]);
      setFieldErrors({});
      setCurrentStep(nextStep);
      validateStep(nextStep);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});
    clearStepError(currentStep);

    try {
      const gmUser = users.find((user) => user.id === gmUserId);
      const campaignName = draft.name.trim() || 'Campaign';

      const structuredHouseRules = prepareStructuredHouseRules();
      const legacyHouseRulesPayload: Record<string, unknown> = {
        automation: structuredHouseRules.automation,
      };
      if (structuredHouseRules.houseRuleNotes) {
        legacyHouseRulesPayload.notes = structuredHouseRules.houseRuleNotes;
      }
      if (structuredHouseRules.theme) {
        legacyHouseRulesPayload.theme = structuredHouseRules.theme;
      }
      if (structuredHouseRules.factions.length > 0) {
        legacyHouseRulesPayload.factions = structuredHouseRules.factions;
      }
      if (structuredHouseRules.locations.length > 0) {
        legacyHouseRulesPayload.locations = structuredHouseRules.locations;
      }
      if (structuredHouseRules.placeholders.length > 0) {
        legacyHouseRulesPayload.placeholders = structuredHouseRules.placeholders;
      }
      if (structuredHouseRules.sessionSeed) {
        legacyHouseRulesPayload.session_seed = structuredHouseRules.sessionSeed;
      }
      if (structuredHouseRules.players.length > 0) {
        legacyHouseRulesPayload.players = structuredHouseRules.players;
      }

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
          theme: structuredHouseRules.theme,
          house_rule_notes: structuredHouseRules.houseRuleNotes,
          automation: structuredHouseRules.automation,
          factions: structuredHouseRules.factions,
          locations: structuredHouseRules.locations,
          placeholders: structuredHouseRules.placeholders,
          session_seed: structuredHouseRules.sessionSeed,
          player_user_ids: structuredHouseRules.playerUserIds,
          players: structuredHouseRules.players,
          house_rules: JSON.stringify(legacyHouseRulesPayload),
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

  function prepareStructuredHouseRules() {
    const automationKeys = new Set<string>([
      ...AUTOMATION_DEFAULTS,
      ...Object.keys(draft.houseRules ?? {}),
    ]);
    const automation: Record<string, boolean> = {};
    automationKeys.forEach((key) => {
      automation[key] = Boolean(draft.houseRules?.[key]);
    });

    const sanitize = (value: string) => value.trim();

    const factions = draft.factions
      .map((faction) => ({
        id: faction.id || generateId('faction'),
        name: sanitize(faction.name),
        tags: faction.tags?.trim() || undefined,
        notes: faction.notes?.trim() || undefined,
      }))
      .filter((faction) => faction.name.length > 0);

    const locations = draft.locations
      .map((location) => ({
        id: location.id || generateId('location'),
        name: sanitize(location.name),
        descriptor: location.descriptor?.trim() || undefined,
      }))
      .filter((location) => location.name.length > 0);

    const placeholders = draft.placeholders
      .map((placeholder) => ({
        id: placeholder.id || generateId('placeholder'),
        name: sanitize(placeholder.name),
        role: placeholder.role.trim(),
      }))
      .filter((placeholder) => placeholder.name.length > 0);

    let sessionSeed: { title?: string; objectives?: string; sceneTemplate?: string; summary?: string; skip: boolean } | null;
    if (draft.sessionSeed.skip) {
      sessionSeed = { skip: true };
    } else {
      const normalized = {
        title: sanitize(draft.sessionSeed.title) || undefined,
        objectives: sanitize(draft.sessionSeed.objectives) || undefined,
        sceneTemplate: sanitize(draft.sessionSeed.sceneTemplate) || undefined,
        summary: sanitize(draft.sessionSeed.summary) || undefined,
        skip: false,
      };
      const hasContent =
        normalized.title || normalized.objectives || normalized.sceneTemplate || normalized.summary;
      sessionSeed = hasContent ? normalized : null;
    }

    const playerUserIds = Array.from(
      new Set(
        draft.selectedPlayerUserIds
          .map((id) => id.trim())
          .filter((id) => id.length > 0),
      ),
    );

    const players = playerUserIds
      .map((id) => {
        const user = playerRosterLookup.get(id);
        if (!user) {
          return null;
        }
        const username = user.username?.trim() || user.email?.trim() || '';
        return { id, username };
      })
      .filter(
        (player): player is { id: string; username: string } =>
          Boolean(player),
      );

    return {
      theme: sanitize(draft.theme),
      houseRuleNotes: sanitize(draft.houseRuleNotes),
      automation,
      factions,
      locations,
      placeholders,
      sessionSeed,
      playerUserIds,
      players,
    };
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
                  onChange={(event) => {
                    dispatchDraft({ type: 'UPDATE_FIELD', field: 'name', value: event.target.value });
                    clearFieldError('name');
                  }}
                  autoFocus
                  maxLength={80}
                  required
                  placeholder="e.g., Emerald City Heist"
                  ref={nameRef}
                  className={fieldErrors.name ? 'input--invalid' : undefined}
                  aria-invalid={fieldErrors.name ? 'true' : 'false'}
                  aria-describedby={fieldErrors.name ? 'campaign-name-error' : undefined}
                />
                <p className="form-help">This title appears in dashboards, notifications, and session summaries.</p>
                {fieldErrors.name && (
                  <p id="campaign-name-error" className="form-error" role="alert">
                    {fieldErrors.name}
                  </p>
                )}
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
                  ref={themeRef}
                />
                <p className="form-help">A short hook that sets tone for players and appears alongside the title.</p>
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
                          <span className="book-option">
                            {book.name} <span className="book-code">({code})</span>
                            {disabled && <span className="book-required">(required)</span>}
                          </span>
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
                onChange={(event) => {
                  setGmUserId(event.target.value);
                  clearFieldError('gm');
                }}
                ref={gmRef}
                className={fieldErrors.gm ? 'input--invalid' : undefined}
                aria-invalid={fieldErrors.gm ? 'true' : 'false'}
                aria-describedby={fieldErrors.gm ? 'campaign-gm-error' : undefined}
              >
                {gmOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldErrors.gm && (
                <p id="campaign-gm-error" className="form-error" role="alert">
                  {fieldErrors.gm}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="campaign-description">Campaign Overview</label>
              <textarea
                id="campaign-description"
                name="campaign-description"
                value={draft.description}
                onChange={(event) => {
                  dispatchDraft({ type: 'UPDATE_FIELD', field: 'description', value: event.target.value });
                  clearFieldError('overview');
                }}
                placeholder="Outline the premise, tone, and first planned arc. Include touchstones players can latch onto."
                rows={6}
                ref={overviewRef}
                className={`campaign-form__textarea ${fieldErrors.overview ? 'input--invalid' : ''}`.trim()}
                aria-invalid={fieldErrors.overview ? 'true' : 'false'}
                aria-describedby={fieldErrors.overview ? 'campaign-description-error' : undefined}
              />
              <p className="form-help">
                Use this space for the elevator pitch—players will see it at a glance when they open the campaign.
              </p>
              {fieldErrors.overview && (
                <p id="campaign-description-error" className="form-error" role="alert">
                  {fieldErrors.overview}
                </p>
              )}
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
                <div className="character-checkboxes" ref={rosterRef} tabIndex={-1}>
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
                            clearFieldError('roster');
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
            {fieldErrors.roster && (
              <p className="form-error" role="alert">
                {fieldErrors.roster}
              </p>
            )}
            <div className="form-group">
              <label>Player Characters</label>
              <p className="form-help">
                Assign registered players to this campaign and use placeholders to capture any remaining runner concepts.
              </p>
              {playerUsers.length === 0 ? (
                <p className="form-help">No player accounts found yet. Invite players or create accounts to assign them here.</p>
              ) : (
                <div className="backbone-library">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setPlayerLibraryOpen((open) => !open)}
                    aria-expanded={isPlayerLibraryOpen}
                    aria-controls="creation-player-library"
                  >
                    {isPlayerLibraryOpen ? 'Hide player search' : 'Search player accounts'}
                  </button>
                  {isPlayerLibraryOpen && (
                    <div
                      id="creation-player-library"
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
                          filteredPlayerUsers.map((player, index) => {
                            const id = player.id ?? '';
                            const alreadySelected = id.length > 0 && selectedPlayerIdSet.has(id);
                            return (
                              <button
                                key={player.id ?? player.email ?? player.username ?? `player-${index}`}
                                type="button"
                                className={`campaign-manage__preset-option${
                                  alreadySelected ? ' campaign-manage__preset-option--disabled' : ''
                                }`}
                                onClick={() => {
                                  if (alreadySelected || id.length === 0) {
                                    return;
                                  }
                                  dispatchDraft({
                                    type: 'UPDATE_FIELD',
                                    field: 'selectedPlayerUserIds',
                                    value: Array.from(new Set([...draft.selectedPlayerUserIds, id])),
                                  });
                                  clearFieldError('roster', 1);
                                }}
                                disabled={alreadySelected || id.length === 0}
                              >
                                <span className="campaign-manage__preset-name">
                                  {player.username || player.email || id || 'Unknown player'}
                                </span>
                                {player.email && player.username && (
                                  <span className="campaign-manage__preset-tags">{player.email}</span>
                                )}
                                {alreadySelected && (
                                  <span className="campaign-manage__preset-tags">Already added</span>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {draft.selectedPlayerUserIds.length > 0 ? (
                <div className="campaign-selected-players__table-wrapper">
                  <table className="campaign-selected-players__table">
                    <thead>
                      <tr>
                        <th scope="col">Player Username</th>
                        <th scope="col" className="campaign-selected-players__actions-header">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSelectedPlayerDetails.map((player) => (
                        <tr key={`selected-player-${player.id}`}>
                          <td data-label="Player Username">
                            <span className="campaign-selected-players__username">
                              {player.username || player.email || player.id}
                            </span>
                          </td>
                          <td className="campaign-selected-players__actions">
                            <button
                              type="button"
                              className="btn-link"
                              onClick={() =>
                                dispatchDraft({
                                  type: 'UPDATE_FIELD',
                                  field: 'selectedPlayerUserIds',
                                  value: draft.selectedPlayerUserIds.filter((id) => id !== player.id),
                                })
                              }
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="form-help">No players selected yet.</p>
              )}

              {placeholderLibrary.length > 0 && (
                <div className="backbone-library">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setPlaceholderLibraryOpen((open) => !open)}
                    aria-expanded={isPlaceholderLibraryOpen}
                    aria-controls="creation-placeholder-library"
                  >
                    {isPlaceholderLibraryOpen ? 'Hide library' : 'Browse library'}
                  </button>
                  {isPlaceholderLibraryOpen && (
                    <div
                      id="creation-placeholder-library"
                      className="campaign-manage__preset-panel"
                      role="region"
                      aria-label="Placeholder library"
                    >
                      <input
                        type="search"
                        placeholder="Search placeholder library…"
                        value={placeholderFilter}
                        onChange={(event) => setPlaceholderFilter(event.target.value)}
                      />
                      <div className="campaign-manage__preset-scroll">
                        {filteredPlaceholderLibrary.length === 0 ? (
                          <p className="campaign-manage__empty">No matches.</p>
                        ) : (
                          filteredPlaceholderLibrary.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              className="campaign-manage__preset-option"
                              onClick={() => {
                                const newId = generateId('placeholder');
                                dispatchDraft({
                                  type: 'ADD_PLACEHOLDER_WITH_ID',
                                  id: newId,
                                  name: preset.name,
                                  role: preset.role ?? '',
                                });
                                clearFieldError('roster', 1);
                                setPlaceholderLibraryOpen(false);
                              }}
                            >
                              <span className="campaign-manage__preset-name">{preset.name}</span>
                              {preset.role && <span className="campaign-manage__preset-tags">{preset.role}</span>}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    dispatchDraft({ type: 'ADD_PLACEHOLDER' });
                    clearFieldError('roster', 1);
                  }}
                >
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
            <div ref={backboneRef} tabIndex={-1}>
            <div className="form-grid">
                  <div className="form-group">
                    <label>Factions</label>
                    {factionLibrary.length > 0 && (
                      <div className="backbone-library">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setFactionLibraryOpen((open) => !open)}
                          aria-expanded={isFactionLibraryOpen}
                          aria-controls="creation-faction-library"
                        >
                          {isFactionLibraryOpen ? 'Hide library' : 'Browse library'}
                        </button>
                        {isFactionLibraryOpen && (
                          <div
                            id="creation-faction-library"
                            className="campaign-manage__preset-panel"
                            role="region"
                            aria-label="Faction library"
                          >
                            <input
                              type="search"
                              placeholder="Search faction library…"
                              value={factionFilter}
                              onChange={(event) => setFactionFilter(event.target.value)}
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
                                      const newId = generateId('faction');
                                      dispatchDraft({ type: 'ADD_FACTION_WITH_ID', id: newId });
                                      dispatchDraft({ type: 'UPDATE_FACTION', id: newId, field: 'name', value: preset.name });
                                      dispatchDraft({ type: 'UPDATE_FACTION', id: newId, field: 'tags', value: preset.tags ?? '' });
                                      dispatchDraft({ type: 'UPDATE_FACTION', id: newId, field: 'notes', value: preset.notes ?? '' });
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
                    {locationLibrary.length > 0 && (
                      <div className="backbone-library">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setLocationLibraryOpen((open) => !open)}
                          aria-expanded={isLocationLibraryOpen}
                          aria-controls="creation-location-library"
                        >
                          {isLocationLibraryOpen ? 'Hide library' : 'Browse library'}
                        </button>
                        {isLocationLibraryOpen && (
                          <div
                            id="creation-location-library"
                            className="campaign-manage__preset-panel"
                            role="region"
                            aria-label="Location library"
                          >
                            <input
                              type="search"
                              placeholder="Search location library…"
                              value={locationFilter}
                              onChange={(event) => setLocationFilter(event.target.value)}
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
                                      const newId = generateId('location');
                                      dispatchDraft({ type: 'ADD_LOCATION_WITH_ID', id: newId });
                                      dispatchDraft({ type: 'UPDATE_LOCATION', id: newId, field: 'name', value: preset.name });
                                      dispatchDraft({
                                        type: 'UPDATE_LOCATION',
                                        id: newId,
                                        field: 'descriptor',
                                        value: preset.descriptor ?? '',
                                      });
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
            </div>
            {fieldErrors.backbone && (
              <p className="form-error" role="alert">
                {fieldErrors.backbone}
              </p>
            )}
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
            <h4>Session Planning</h4>
            <p>Outline the opening session runners can expect.</p>
            {sessionSeedLibrary.length > 0 && (
              <div className="backbone-library">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSessionSeedLibraryOpen((open) => !open)}
                  aria-expanded={isSessionSeedLibraryOpen}
                  aria-controls="creation-session-library"
                >
                  {isSessionSeedLibraryOpen ? 'Hide templates' : 'Browse templates'}
                </button>
                {isSessionSeedLibraryOpen && (
                  <div
                    id="creation-session-library"
                    className="campaign-manage__preset-panel"
                    role="region"
                    aria-label="Session seed library"
                  >
                    <input
                      type="search"
                      placeholder="Search session templates…"
                      value={sessionSeedFilter}
                      onChange={(event) => setSessionSeedFilter(event.target.value)}
                    />
                    <div className="campaign-manage__preset-scroll">
                      {filteredSessionSeedLibrary.length === 0 ? (
                        <p className="campaign-manage__empty">No matches.</p>
                      ) : (
                        filteredSessionSeedLibrary.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            className="campaign-manage__preset-option"
                            onClick={() => {
                              dispatchDraft({ type: 'UPDATE_SESSION_SEED', field: 'skip', value: false });
                              dispatchDraft({ type: 'UPDATE_SESSION_SEED', field: 'title', value: preset.title });
                              dispatchDraft({
                                type: 'UPDATE_SESSION_SEED',
                                field: 'objectives',
                                value: preset.objectives ?? '',
                              });
                              dispatchDraft({
                                type: 'UPDATE_SESSION_SEED',
                                field: 'sceneTemplate',
                                value: preset.scene_template ?? draft.sessionSeed.sceneTemplate,
                              });
                              dispatchDraft({
                                type: 'UPDATE_SESSION_SEED',
                                field: 'summary',
                                value: preset.summary ?? '',
                              });
                              clearFieldError('sessionSeed', 4);
                              setSessionSeedLibraryOpen(false);
                            }}
                          >
                            <span className="campaign-manage__preset-name">{preset.title}</span>
                            {preset.objectives && (
                              <span className="campaign-manage__preset-tags">{preset.objectives}</span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            <label className="campaign-manage__checkbox">
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
              <span>Skip planning for now</span>
            </label>
            {!draft.sessionSeed.skip && (
              <div className="campaign-manage__session-grid">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    value={draft.sessionSeed.title}
                    onChange={(event) =>
                      dispatchDraft({
                        type: 'UPDATE_SESSION_SEED',
                        field: 'title',
                        value: event.target.value,
                      })
                    }
                    placeholder="Session 0, The Run, etc."
                  />
                </div>
                <div className="form-group">
                  <label>Scene Template</label>
                  <input
                    value={draft.sessionSeed.sceneTemplate}
                    onChange={(event) =>
                      dispatchDraft({
                        type: 'UPDATE_SESSION_SEED',
                        field: 'sceneTemplate',
                        value: event.target.value,
                      })
                    }
                    placeholder="social_meetup, extraction, heist..."
                  />
                </div>
                <div className="form-group">
                  <label>Objectives</label>
                  <textarea
                    rows={3}
                    value={draft.sessionSeed.objectives}
                    onChange={(event) =>
                      dispatchDraft({
                        type: 'UPDATE_SESSION_SEED',
                        field: 'objectives',
                        value: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Summary</label>
                  <textarea
                    rows={3}
                    value={draft.sessionSeed.summary}
                    onChange={(event) =>
                      dispatchDraft({
                        type: 'UPDATE_SESSION_SEED',
                        field: 'summary',
                        value: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
            {fieldErrors.sessionSeed && (
              <p className="form-error" role="alert">
                {fieldErrors.sessionSeed}
              </p>
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
                  <strong>Players:</strong>{' '}
                  {selectedPlayerDetails.length > 0
                    ? selectedPlayerDetails.map((player) => player.username || player.email).join(', ')
                    : '—'}
                </p>
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
              {STEP_LABELS.map((label, index) => {
                const isActive = currentStep === index;
                const isCompleted = currentStep > index;
                const hasError = Boolean(stepErrors[index]?.length);
                return (
                <button
                  key={label}
                  type="button"
                  className={`campaign-wizard__step ${
                      isActive ? 'campaign-wizard__step--active' : ''
                    } ${isCompleted ? 'campaign-wizard__step--completed' : ''} ${
                      hasError ? 'campaign-wizard__step--error' : ''
                    }`}
                    onClick={() => {
                      setFieldErrors({});
                      setCurrentStep(index);
                      if (stepErrors[index]?.length) {
                        validateStep(index);
                      } else {
                        setError(null);
                      }
                    }}
                >
                  <span className="campaign-wizard__step-index">{index + 1}</span>
                  <span>{label}</span>
                    {hasError && <span className="campaign-wizard__step-error-indicator" aria-hidden="true">!</span>}
                </button>
                );
              })}
            </nav>
          </div>

          <form className="campaign-wizard__form campaign-form" onSubmit={handleSubmit} noValidate>
            {renderStep()}

            {(stepErrors[currentStep]?.length || error) && (
              <div className="form-error form-error--banner" role="alert" aria-live="assertive">
                <ul className="form-error__list">
                  {(stepErrors[currentStep] ?? (error ? [error] : [])).map((message, idx) => (
                    <li key={`step-${currentStep}-error-${idx}`}>{message}</li>
                  ))}
                </ul>
              </div>
            )}

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

