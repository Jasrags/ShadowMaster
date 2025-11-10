import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CharacterCreationData } from '../types/editions';

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

export interface EditionContextValue {
  activeEdition: EditionMetadata;
  setEdition: (key: EditionKey) => void;
  supportedEditions: EditionMetadata[];
  characterCreationData?: CharacterCreationData;
  reloadEditionData: (key?: EditionKey) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

const defaultEdition: EditionMetadata = {
  key: 'sr5',
  label: 'Shadowrun 5th Edition',
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
  isLoading: false,
  error: undefined,
};

const EditionContext = createContext<EditionContextValue>(fallbackValue);

export function EditionProvider({ children }: PropsWithChildren) {
  const [activeEdition, setActiveEdition] = useState<EditionMetadata>(defaultEdition);
  const [editionDataMap, setEditionDataMap] = useState<Record<EditionKey, EditionDataState>>({});

  const supportedEditions = useMemo<EditionMetadata[]>(
    () => [
      defaultEdition,
      {
        key: 'sr3',
        label: 'Shadowrun 3rd Edition',
        isPrimary: false,
        mockDataLoaded: false,
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

  const value = useMemo<EditionContextValue>(() => {
    const activeDataState = editionDataMap[activeEdition.key];

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
      characterCreationData: activeDataState?.data,
      reloadEditionData: loadEditionData,
      isLoading: activeDataState?.loading ?? false,
      error: activeDataState?.error,
    };
  }, [activeEdition, editionDataMap, loadEditionData, supportedEditions]);

  useEffect(() => {
    const state = editionDataMap[activeEdition.key];
    if (!state?.data && !state?.loading) {
      void loadEditionData(activeEdition.key);
    }
  }, [activeEdition.key, editionDataMap, loadEditionData]);

  useEffect(() => {
    const state = editionDataMap[activeEdition.key];
    if (state?.data && typeof window !== 'undefined') {
      window.ShadowmasterLegacyApp?.setEditionData?.(activeEdition.key, state.data);
    }
  }, [activeEdition.key, editionDataMap]);

  return <EditionContext.Provider value={value}>{children}</EditionContext.Provider>;
}

export function useEditionContext() {
  const context = useContext(EditionContext);
  if (!context) {
    throw new Error('useEditionContext must be used within an EditionProvider.');
  }
  return context;
}
