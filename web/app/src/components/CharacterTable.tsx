import { useMemo } from 'react';
import { DataTable, DataTableColumn } from './DataTable';
import { CharacterSummary } from '../types/characters';
import { formatDate } from '../utils/dates';

interface Props {
  characters: CharacterSummary[];
  loading: boolean;
  error: string | null;
  onView: (character: CharacterSummary) => void;
}

export function CharacterTable({ characters, loading, error, onView }: Props) {
  const columns: DataTableColumn<CharacterSummary>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Character',
        sortable: true,
        accessor: (character) => character.name ?? '',
      },
      {
        key: 'player_name',
        header: 'Player',
        sortable: true,
        accessor: (character) => character.player_name ?? '',
        render: (character) => character.player_name ?? '—',
      },
      {
        key: 'edition',
        header: 'Edition',
        sortable: true,
        accessor: (character) => character.edition?.toUpperCase() ?? '',
        render: (character) => character.edition?.toUpperCase() ?? '—',
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        accessor: (character) => character.status ?? '',
        render: (character) => (
          <span className={`status-badge status-${(character.status ?? 'unknown').toLowerCase()}`}>
            {character.status ?? '—'}
          </span>
        ),
      },
      {
        key: 'updated_at',
        header: 'Updated',
        sortable: true,
        accessor: (character) => (character.updated_at ? new Date(character.updated_at) : null),
        render: (character) => formatDate(character.updated_at),
      },
      {
        key: 'actions',
        header: 'Actions',
        sortable: false,
        align: 'right',
        render: (character) => (
          <div className="table-actions">
            <button
              type="button"
              className="button button--table"
              onClick={() => onView(character)}
            >
              Open
            </button>
          </div>
        ),
      },
    ],
    [onView],
  );

  return (
    <div className="characters-table">
      {error && (
        <div className="form-feedback form-feedback--error" role="alert">
          {error}
        </div>
      )}
      <DataTable
        columns={columns}
        data={characters}
        loading={loading}
        getRowId={(character) => character.id}
        emptyState="No characters yet. Create one to get started!"
        searchPlaceholder="Search characters…"
      />
    </div>
  );
}


