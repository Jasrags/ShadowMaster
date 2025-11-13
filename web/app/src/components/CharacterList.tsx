import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CharacterSummary } from '../types/characters';
import type { ShadowmasterLegacyApp } from '../types/legacy';
import { CharacterTable } from './CharacterTable';

const CHARACTERS_ROOT_ID = 'characters-list';

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

export function CharacterList({ targetId = CHARACTERS_ROOT_ID }: { targetId?: string }) {
  const [container, setContainer] = useState<Element | null>(null);
  const [characters, setCharacters] = useState<CharacterSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setContainer(document.getElementById(targetId));
  }, [targetId]);

  useEffect(() => {
    document.body.classList.add('react-characters-enabled');
    return () => {
      document.body.classList.remove('react-characters-enabled');
    };
  }, []);

  const fetchCharacters = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const payload = await request<CharacterSummary[]>('/api/characters');
      setCharacters(Array.isArray(payload) ? payload : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load characters.';
      setLoadError(message);
      setCharacters([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCharacters();
  }, [fetchCharacters]);

  useEffect(() => {
    const handler = () => {
      void fetchCharacters();
    };
    window.addEventListener('shadowmaster:characters:refresh', handler);
    return () => {
      window.removeEventListener('shadowmaster:characters:refresh', handler);
    };
  }, [fetchCharacters]);

  useEffect(() => {
    window.ShadowmasterLegacyApp = Object.assign(
      (window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined) ?? {},
      {
        loadCharacters: () => {
          void fetchCharacters();
        },
      },
    );

    return () => {
      const legacy = window.ShadowmasterLegacyApp as ShadowmasterLegacyApp | undefined;
      if (legacy) {
        legacy.loadCharacters = undefined;
      }
    };
  }, [fetchCharacters]);

  const handleView = useCallback((character: CharacterSummary) => {
    const legacyView = (window as unknown as { viewCharacterSheet?: (id: string) => void }).viewCharacterSheet;
    if (typeof legacyView === 'function') {
      legacyView(character.id);
    } else {
      console.warn('viewCharacterSheet is not available in the legacy application.');
    }
  }, []);

  if (!container) {
    return null;
  }

  return createPortal(
    <section className="characters-react-shell">
      <CharacterTable
        characters={characters}
        loading={isLoading}
        error={loadError}
        onView={handleView}
      />
    </section>,
    container,
  );
}


