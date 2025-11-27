import { useEffect, useState, useCallback } from 'react';
import { Button } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import { characterApi } from '../lib/api';
import type { Character } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { CharacterTable } from '../components/characters/CharacterTable';

export function CharactersPage() {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCharacters = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await characterApi.getCharacters();
      setCharacters(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load characters';
      showError('Failed to load characters', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  const handleCreate = () => {
    navigate('/characters/create');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading characters...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Characters</h2>
        <Button
          onPress={handleCreate}
          aria-label="Create new character"
          className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors text-sm font-medium"
        >
          Create
        </Button>
      </div>
      <CharacterTable characters={characters} onCharacterUpdated={loadCharacters} />
    </div>
  );
}

