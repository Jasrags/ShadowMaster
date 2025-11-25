import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Spell } from '../../lib/types';
import { SpellViewModal } from './SpellViewModal';
import { SourceFilter } from '../common/SourceFilter';

interface SpellsTableProps {
  spells: Spell[];
}

export const SpellsTable = memo(function SpellsTable({ spells }: SpellsTableProps) {
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  const filteredSpells = useMemo(() => {
    if (selectedSources.length === 0) return spells;
    return spells.filter(item => {
      const source = item.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [spells, selectedSources]);

  const handleNameClick = useCallback((item: Spell) => {
    setSelectedSpell(item);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<Spell>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Spell) => (
        <button
          onClick={() => handleNameClick(row)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left"
        >
          {String(value || '')}
        </button>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      accessor: (row: Spell) => row.category ? row.category.charAt(0).toUpperCase() + row.category.slice(1) : '-',
      sortable: true,
    },
    {
      id: 'type',
      header: 'Type',
      accessor: (row: Spell) => row.type ? row.type.charAt(0).toUpperCase() + row.type.slice(1) : '-',
      sortable: true,
    },
    {
      id: 'range',
      header: 'Range',
      accessor: 'range',
      sortable: true,
      render: (value: unknown) => (value ? String(value) : '-'),
    },
    {
      id: 'drain',
      header: 'Drain',
      accessor: (row: Spell) => row.drain?.formula || '-',
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row: Spell) => row.source?.source || '-',
      sortable: true,
    },
  ], [handleNameClick]);

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={spells}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
      </div>
      <DataTable
        data={filteredSpells}
        columns={columns}
        searchFields={['name', 'category', 'type', 'range', 'drain']}
        searchPlaceholder="Search spells by name, category, type, or range..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No spells available"
        emptySearchMessage="No spells found matching your search criteria."
        ariaLabel="Spells data table"
      />
      <SpellViewModal
        spell={selectedSpell}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

