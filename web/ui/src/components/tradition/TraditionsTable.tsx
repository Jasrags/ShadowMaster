import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Tradition } from '../../lib/types';
import { TraditionViewModal } from './TraditionViewModal';
import { SourceFilter } from '../common/SourceFilter';

interface TraditionsTableProps {
  traditions: Tradition[];
}

export const TraditionsTable = memo(function TraditionsTable({ traditions }: TraditionsTableProps) {
  const [selectedTradition, setSelectedTradition] = useState<Tradition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  const filteredTraditions = useMemo(() => {
    if (selectedSources.length === 0) return traditions;
    return traditions.filter(item => {
      const source = item.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [traditions, selectedSources]);

  const handleNameClick = useCallback((item: Tradition) => {
    setSelectedTradition(item);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<Tradition>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Tradition) => (
        <button
          onClick={() => handleNameClick(row)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left"
        >
          {String(value || '')}
        </button>
      ),
    },
    {
      id: 'drain_formula',
      header: 'Drain Formula',
      accessor: 'drain_formula',
      sortable: true,
      render: (value: unknown) => (value ? String(value) : '-'),
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row: Tradition) => row.source?.source || '-',
      sortable: true,
    },
  ], [handleNameClick]);

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={traditions}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
      </div>
      <DataTable
        data={filteredTraditions}
        columns={columns}
        searchFields={['name', 'drain_formula', 'description']}
        searchPlaceholder="Search traditions by name or drain formula..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No traditions available"
        emptySearchMessage="No traditions found matching your search criteria."
        ariaLabel="Traditions data table"
      />
      <TraditionViewModal
        tradition={selectedTradition}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

