import type { Character } from '../../lib/types';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import { Button } from 'react-aria-components';
import { DeleteConfirmationDialog } from '../common/DeleteConfirmationDialog';
import { useState } from 'react';
import { characterApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

interface CharacterTableProps {
  characters: Character[];
  onCharacterUpdated?: () => void;
}

const getStatusColor = (status?: string) => {
  if (!status) return 'text-gray-300';
  switch (status.toLowerCase()) {
    case 'active':
      return 'text-green-400';
    case 'inactive':
      return 'text-gray-400';
    default:
      return 'text-gray-300';
  }
};

export function CharacterTable({ characters, onCharacterUpdated }: CharacterTableProps) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleView = (character: Character) => {
    // TODO: Navigate to character view page when implemented
    console.log('View character:', character.id);
  };

  const handleDelete = async (character: Character) => {
    setIsDeleting(character.id);
    try {
      await characterApi.deleteCharacter(character.id);
      showSuccess('Character deleted', `Character "${character.name}" has been deleted.`);
      if (onCharacterUpdated) {
        onCharacterUpdated();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete character';
      showError('Failed to delete character', errorMessage);
    } finally {
      setIsDeleting(null);
    }
  };

  const columns: ColumnDefinition<Character>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
    },
    {
      id: 'player_name',
      header: 'Player',
      accessor: 'player_name',
      sortable: true,
      render: (value: unknown) => <span>{value ? String(value) : '-'}</span>,
    },
    {
      id: 'edition',
      header: 'Edition',
      accessor: 'edition',
      sortable: true,
    },
    {
      id: 'is_npc',
      header: 'Type',
      accessor: 'is_npc',
      sortable: true,
      render: (value: unknown) => (
        <span>{value ? 'NPC' : 'PC'}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value: unknown) => (
        <span className={getStatusColor(value as string)}>
          {value ? String(value) : '-'}
        </span>
      ),
    },
    {
      id: 'created_at',
      header: 'Created',
      accessor: 'created_at',
      sortable: true,
      render: (value: unknown) => {
        if (!value) return '-';
        const date = new Date(String(value));
        return <span>{date.toLocaleDateString()}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      render: (_value: unknown, row: Character) => (
        <div className="flex items-center gap-2">
          <Button
            onPress={() => handleView(row)}
            aria-label={`View character ${row.name}`}
            className="px-2 py-1 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-sm transition-colors"
          >
            View
          </Button>
          <DeleteConfirmationDialog
            title="Delete Character"
            message={`Are you sure you want to delete "${row.name}"? This action cannot be undone.`}
            onConfirm={() => handleDelete(row)}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            trigger={
              <Button
                aria-label={`Delete character ${row.name}`}
                isDisabled={isDeleting === row.id}
                className="px-2 py-1 bg-sr-gray border border-sr-danger rounded-md text-gray-100 hover:bg-sr-danger/20 focus:outline-none focus:ring-2 focus:ring-sr-danger focus:border-transparent text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting === row.id ? 'Deleting...' : 'Delete'}
              </Button>
            }
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={characters}
      columns={columns}
      searchFields={['name', 'player_name', 'edition', 'status']}
      searchPlaceholder="Search characters..."
      defaultSortColumn="created_at"
      defaultSortDirection="desc"
      emptyMessage="No characters available"
      emptySearchMessage="No characters found. Try adjusting your search."
      ariaLabel="Characters table"
    />
  );
}

