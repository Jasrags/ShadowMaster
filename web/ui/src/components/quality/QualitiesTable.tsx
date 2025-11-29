import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Quality } from '../../lib/types';
import { QualityViewModal } from './QualityViewModal';
import { QualitySourceFilter } from './QualitySourceFilter';

interface QualitiesTableProps {
  qualities: Quality[];
}

export const QualitiesTable = memo(function QualitiesTable({ qualities }: QualitiesTableProps) {
  const [selectedQuality, setSelectedQuality] = useState<Quality | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter qualities by selected sources
  const filteredQualities = useMemo(() => {
    let filtered = qualities;

    // Filter by source
    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => {
        const source = typeof item.source === 'string' ? item.source : item.source?.source;
        return source && selectedSources.includes(source);
      });
    }

    return filtered;
  }, [qualities, selectedSources]);

  const handleNameClick = useCallback((quality: Quality) => {
    setSelectedQuality(quality);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<Quality>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Quality) => (
        <button
          onClick={() => handleNameClick(row)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left"
        >
          {String(value || '')}
        </button>
      ),
    },
    {
      id: 'cost',
      header: 'Cost',
      accessor: (row: Quality) => row.cost.per_rating ? `${row.cost.base_cost} per rating` : String(row.cost.base_cost),
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row: Quality) => row.source?.source || '',
      sortable: true,
    },
    {
      id: 'page',
      header: 'Page',
      accessor: (row: Quality) => row.source?.page || '',
      sortable: true,
    },
  ], [handleNameClick]);

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <QualitySourceFilter
            qualities={qualities}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
          />
        </div>
      </div>
      <DataTable
        data={filteredQualities}
        columns={columns}
        searchFields={['name', 'source']}
        searchPlaceholder="Search qualities by name or source..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No qualities available"
        emptySearchMessage="No qualities found matching your search criteria."
        ariaLabel="Qualities data table"
      />
      <QualityViewModal
        quality={selectedQuality}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

