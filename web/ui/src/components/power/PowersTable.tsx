import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Power } from '../../lib/types';
import { PowerViewModal } from './PowerViewModal';
import { SourceFilter } from '../common/SourceFilter';

interface PowersTableProps {
  powers: Power[];
}

export const PowersTable = memo(function PowersTable({ powers }: PowersTableProps) {
  const [selectedPower, setSelectedPower] = useState<Power | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const filteredPowers = useMemo(() => {
    if (selectedSources.length === 0) return powers;
    return powers.filter(item => {
      const source = item.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [powers, selectedSources]);

  const handleNameClick = useCallback((item: Power) => {
    setSelectedPower(item);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<Power>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Power) => (
        <button
          onClick={() => handleNameClick(row)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left"
        >
          {String(value || '')}
        </button>
      ),
    },
    {
      id: 'activation',
      header: 'Activation',
      accessor: (row: Power) => row.activation_description || (row.activation ? row.activation.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : '-'),
      sortable: true,
    },
    {
      id: 'cost',
      header: 'Cost',
      accessor: (row: Power) => row.cost?.formula || '-',
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row: Power) => row.source?.source || '-',
      sortable: true,
    },
  ], [handleNameClick]);

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={powers}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
      </div>
      <DataTable
        data={filteredPowers}
        columns={columns}
        searchFields={['name', 'activation', 'cost', 'description']}
        searchPlaceholder="Search powers by name, activation, or cost..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No powers available"
        emptySearchMessage="No powers found matching your search criteria."
        ariaLabel="Powers data table"
      />
      <PowerViewModal
        power={selectedPower}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

