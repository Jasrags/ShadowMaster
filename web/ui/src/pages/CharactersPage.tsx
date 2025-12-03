import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-aria-components';
import type { Character } from '../lib/types';
import { charactersApi } from '../lib/api';
import { DataTable, type ColumnDefinition } from '../components/table/DataTable';
import { DeleteConfirmModal } from '../components/table/DeleteConfirmModal';
import {
  CharacterCreateModal,
  type CharacterType,
  type Edition,
  type CreationMethod,
  type PlayLevel,
} from '../components/characters/CharacterCreateModal';

export function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await charactersApi.getCharacters();
      setCharacters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load characters');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (character: Character) => {
    setCharacterToDelete(character);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!characterToDelete) return;

    setIsDeleting(true);
    try {
      await charactersApi.deleteCharacter(characterToDelete.id);
      setCharacterToDelete(null);
      setIsDeleteModalOpen(false);
      await loadCharacters();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete character');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCharacterCreate = async (characterData: {
    type: CharacterType;
    edition: Edition;
    creationMethod: CreationMethod;
    playLevel: PlayLevel;
  }) => {
    // Modal handles the API call and navigation to character sheet page
    // This callback is optional and called before the API call
  };

  const formatCharacterState = (state: Character['state']): string => {
    switch (state) {
      case 'creation':
        return 'Creation';
      case 'gm_review':
        return 'GM Review';
      case 'advancement':
        return 'Advancement';
      default:
        return state;
    }
  };

  const columns: ColumnDefinition<Character>[] = [
    {
      key: 'name',
      label: 'Character Name',
      isRowHeader: true,
      sortable: true,
      render: (character) => (
        <Link
          to={`/characters/${character.id}`}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline transition-colors"
        >
          {character.name}
        </Link>
      ),
    },
    {
      key: 'player',
      label: 'Player',
      sortable: false,
      render: () => 'Jasrags', // Hardcoded for now
    },
    {
      key: 'state',
      label: 'State',
      sortable: true,
      sortValue: (character) => character.state,
      render: (character) => (
        <span className="px-2 py-1 bg-sr-accent/20 border border-sr-accent rounded text-sr-accent text-sm">
          {formatCharacterState(character.state)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (character) => (
        <Button
          onPress={() => handleDeleteClick(character)}
          className="px-3 py-1 bg-sr-danger border border-sr-danger rounded-md text-gray-100 
                     data-[hovered]:bg-sr-danger/80 
                     data-[pressed]:bg-sr-danger-dark
                     data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                     data-[focus-visible]:ring-sr-danger data-[focus-visible]:border-transparent 
                     transition-colors text-sm font-medium"
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-tech text-4xl text-glow-cyan">Characters</h1>
          <Button
            onPress={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 
                     data-[hovered]:bg-sr-accent/80 
                     data-[pressed]:bg-sr-accent-dark
                     data-[focus-visible]:outline-2 data-[focus-visible]:outline-sr-accent 
                     transition-colors font-medium"
          >
            Create Character
          </Button>
        </div>
        <div className="card-cyber p-8">
          <DataTable
            ariaLabel="Characters table"
            columns={columns}
            data={characters}
            getRowId={(character) => character.id}
            isLoading={isLoading}
            loadingMessage="Loading characters..."
            emptyMessage="No characters found. Create your first character to get started."
            error={error}
            searchPlaceholder="Search by character name or state..."
            searchKeys={['name', 'state']}
          />
        </div>
      </div>

      <CharacterCreateModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreate={handleCharacterCreate}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        item={characterToDelete}
        itemName={(character) => character.name}
        title="Delete Character"
        message="This action will soft delete the character. They will no longer appear in the character list."
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
