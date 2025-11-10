import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  CampaignCharacterCreationResponse,
  CharacterCreationData,
  GameplayRules,
  PriorityCode,
} from '../types/editions';

export type EditionKey = 'sr3' | 'sr5';

export interface EditionMetadata {
  key: EditionKey;
  label: string;
  isPrimary: boolean;
  mockDataLoaded: boolean;
}

interface EditionDataState {
  data?: CharacterCreationData;
  loading: boolean;
  error?: string;
}

interface CampaignCreationState {
  campaignId: string;
  edition: EditionKey;
  data?: CharacterCreationData;
  gameplayRules?: GameplayRules;
  creationMethod?: string;
  loading: boolean;
  error?: string;
}

export interface EditionContextValue {
  activeEdition: EditionMetadata;
  setEdition: (key: EditionKey) => void;
  supportedEditions: EditionMetadata[];
  characterCreationData?: CharacterCreationData;
  reloadEditionData: (key?: EditionKey) => Promise<void>;
  loadCampaignCharacterCreation: (campaignId: string) => Promise<void>;
  clearCampaignCharacterCreation: () => void;
  isLoading: boolean;
  error?: string;
  campaignId?: string;
  campaignCharacterCreation?: CharacterCreationData;
  campaignGameplayRules?: GameplayRules;
  campaignLoading: boolean;
  campaignError?: string;
  campaignCreationMethod?: string;
}

const defaultEdition: EditionMetadata = {
  key: 'sr3',
  label: 'Shadowrun 3rd Edition',
  isPrimary: true,
  mockDataLoaded: true,
};

const fallbackValue: EditionContextValue = {
  activeEdition: defaultEdition,
  setEdition: () => {
    // no-op fallback
  },
  supportedEditions: [defaultEdition],
  characterCreationData: undefined,
  reloadEditionData: async () => {
    // no-op fallback
  },
  loadCampaignCharacterCreation: async () => {
    // no-op fallback
  },
  clearCampaignCharacterCreation: () => {
    // no-op fallback
  },
  isLoading: false,
  error: undefined,
  campaignId: undefined,
  campaignCharacterCreation: undefined,
  campaignGameplayRules: undefined,
  campaignLoading: false,
  campaignError: undefined,
  campaignCreationMethod: undefined,
};

const EditionContext = createContext<EditionContextValue>(fallbackValue);

export function EditionProvider({ children }: PropsWithChildren) {
  const [activeEdition, setActiveEdition] = useState<EditionMetadata>(defaultEdition);
  const [editionDataMap, setEditionDataMap] = useState<Record<EditionKey, EditionDataState>>({});
  const [campaignState, setCampaignState] = useState<CampaignCreationState | null>(null);

  const supportedEditions = useMemo<EditionMetadata[]>(
    () => [
      defaultEdition,
      {
        key: 'sr5',
        label: 'Shadowrun 5th Edition',
        isPrimary: false,
        mockDataLoaded: true,
      },
    ],
    [],
  );

  const loadEditionData = useCallback(
    async (targetKey?: EditionKey) => {
      const editionKey = targetKey ?? activeEdition.key;

      setEditionDataMap((prev) => ({
        ...prev,
        [editionKey]: {
          data: prev[editionKey]?.data,
          loading: true,
          error: undefined,
        },
      }));

      if (typeof fetch !== 'function') {
        setEditionDataMap((prev) => ({
          ...prev,
          [editionKey]: {
            data: prev[editionKey]?.data,
            loading: false,
            error: 'fetch is not available in this environment',
          },
        }));
        return;
      }

      try {
        const response = await fetch(`/api/editions/${editionKey}/character-creation`);
        if (!response.ok) {
          throw new Error(`Failed to load edition data (${response.status})`);
        }

        const payload = await response.json();
        const data: CharacterCreationData = payload?.character_creation ?? payload;

        setEditionDataMap((prev) => ({
          ...prev,
          [editionKey]: {
            data,
            loading: false,
            error: undefined,
          },
        }));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error loading edition data';
        setEditionDataMap((prev) => ({
          ...prev,
          [editionKey]: {
            data: prev[editionKey]?.data,
            loading: false,
            error: message,
          },
        }));
      }
    },
    [activeEdition.key],
  );

  const formatNuyen = useCallback((amount: number) => {
    return `${new Intl.NumberFormat('en-US').format(amount)}¥`;
  }, []);

  const cloneCharacterCreationData = useCallback((data: CharacterCreationData) => {
    return JSON.parse(JSON.stringify(data)) as CharacterCreationData;
  }, []);

  const applyGameplayRules = useCallback(
    (base: CharacterCreationData, gameplayRules?: GameplayRules) => {
      if (!gameplayRules) {
        return cloneCharacterCreationData(base);
      }

      const merged = cloneCharacterCreationData(base);
      if (gameplayRules.resources && merged.priorities?.resources) {
        const table = merged.priorities.resources;
        Object.entries(gameplayRules.resources).forEach(([code, value]) => {
          const priorityCode = code as PriorityCode;
          if (typeof value === 'number' && table[priorityCode]) {
            table[priorityCode] = {
              ...table[priorityCode],
              label: formatNuyen(value),
            };
          }
        });
      }

      return merged;
    },
    [cloneCharacterCreationData, formatNuyen],
  );

  const loadCampaignCharacterCreation = useCallback(
    async (campaignId: string) => {
      if (!campaignId) {
        return;
      }

      setCampaignState((previous) => {
        if (previous?.campaignId === campaignId) {
          return { ...previous, loading: true, error: undefined };
        }
        return {
          campaignId,
          edition: activeEdition.key,
          data: previous?.data,
          gameplayRules: previous?.gameplayRules,
          creationMethod: previous?.creationMethod,
          loading: true,
          error: undefined,
        };
      });

      try {
        const response = await fetch(`/api/campaigns/${campaignId}/character-creation`);
        if (!response.ok) {
          throw new Error(`Failed to load campaign character creation (${response.status})`);
        }
        const payload: CampaignCharacterCreationResponse = await response.json();
        const editionKey = (payload.edition?.toLowerCase?.() as EditionKey) ?? activeEdition.key;
        const editionData = payload.edition_data;

        if (editionData) {
          setEditionDataMap((prev) => ({
            ...prev,
            [editionKey]: {
              data: prev[editionKey]?.data ?? editionData,
              loading: false,
              error: undefined,
            },
          }));
        }

        setCampaignState(() => ({
          campaignId,
          edition: editionKey,
          data: editionData ? applyGameplayRules(editionData, payload.gameplay_rules) : undefined,
          gameplayRules: payload.gameplay_rules,
          creationMethod: payload.creation_method ?? undefined,
          loading: false,
          error: undefined,
        }));
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unknown error loading campaign character creation data';
        setCampaignState({
          campaignId,
          edition: activeEdition.key,
          data: undefined,
          gameplayRules: undefined,
          creationMethod: undefined,
          loading: false,
          error: message,
        });
        throw error;
      }
    },
    [activeEdition.key, applyGameplayRules],
  );

  const clearCampaignCharacterCreation = useCallback(() => {
    setCampaignState(null);
  }, []);

  const value = useMemo<EditionContextValue>(() => {
    const activeDataState = editionDataMap[activeEdition.key];
    const campaignMatchesActive =
      campaignState &&
      !campaignState.loading &&
      !campaignState.error &&
      campaignState.edition === activeEdition.key;
    const effectiveData =
      campaignMatchesActive && campaignState.data ? campaignState.data : activeDataState?.data;

    const campaignCreationMethod = campaignMatchesActive ? campaignState?.creationMethod : undefined;

    return {
      activeEdition,
      supportedEditions,
      setEdition: (key: EditionKey) => {
        const next = supportedEditions.find((edition) => edition.key === key);
        if (next) {
          setActiveEdition(next);
        } else {
          console.warn(`Edition '${key}' is not registered; keeping current edition.`);
        }
      },
      characterCreationData: effectiveData,
      reloadEditionData: loadEditionData,
      loadCampaignCharacterCreation,
      clearCampaignCharacterCreation,
      isLoading: activeDataState?.loading ?? false,
      error: activeDataState?.error,
      campaignId: campaignState?.campaignId,
      campaignCharacterCreation: campaignMatchesActive ? campaignState?.data : undefined,
      campaignGameplayRules: campaignMatchesActive ? campaignState?.gameplayRules : undefined,
      campaignLoading: campaignState?.loading ?? false,
      campaignError: campaignState?.error,
      campaignCreationMethod,
    };
  }, [
    activeEdition,
    campaignState,
    clearCampaignCharacterCreation,
    editionDataMap,
    loadCampaignCharacterCreation,
    loadEditionData,
    supportedEditions,
  ]);

  useEffect(() => {
    const state = editionDataMap[activeEdition.key];
    if (!state?.data && !state?.loading) {
      void loadEditionData(activeEdition.key);
    }
  }, [activeEdition.key, editionDataMap, loadEditionData]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
      loadCampaignCharacterCreation,
      clearCampaignCharacterCreation,
    });
  }, [clearCampaignCharacterCreation, loadCampaignCharacterCreation]);

  useEffect(() => {
    const activeState = editionDataMap[activeEdition.key];
    const campaignMatchesActive =
      campaignState &&
      !campaignState.loading &&
      !campaignState.error &&
      campaignState.edition === activeEdition.key;
    const effectiveData =
      campaignMatchesActive && campaignState.data ? campaignState.data : activeState?.data;

    if (effectiveData && typeof window !== 'undefined') {
      window.ShadowmasterLegacyApp?.setEditionData?.(activeEdition.key, effectiveData);
    }

    if (typeof window !== 'undefined') {
      if (campaignMatchesActive) {
        window.ShadowmasterLegacyApp?.applyCampaignCreationDefaults?.({
          campaignId: campaignState.campaignId,
          edition: campaignState.edition,
          gameplayRules: campaignState.gameplayRules ?? null,
        });
      } else {
        window.ShadowmasterLegacyApp?.applyCampaignCreationDefaults?.(null);
      }
    }
  }, [activeEdition.key, campaignState, editionDataMap]);

  return <EditionContext.Provider value={value}>{children}</EditionContext.Provider>;
}

export function useEditionContext() {
  const context = useContext(EditionContext);
  if (!context) {
    throw new Error('useEditionContext must be used within an EditionProvider.');
  }
  return context;
}
