import { useState, useMemo } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Lifestyle } from '../../lib/types';
import { LifestyleViewModal } from './LifestyleViewModal';
import { LifestyleSourceFilter } from './LifestyleSourceFilter';

interface LifestylesTableProps {
  lifestyles: Lifestyle[];
}

export function LifestylesTable({ lifestyles }: LifestylesTableProps) {
  const [selectedLifestyle, setSelectedLifestyle] = useState<Lifestyle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter lifestyles by selected sources
  const filteredLifestyles = useMemo(() => {
    if (selectedSources.length === 0) {
      return lifestyles;
    }
    return lifestyles.filter(lifestyle => selectedSources.includes(lifestyle.source));
  }, [lifestyles, selectedSources]);

  const handleNameClick = (lifestyle: Lifestyle) => {
    setSelectedLifestyle(lifestyle);
    setIsModalOpen(true);
  };

  const columns: ColumnDefinition<Lifestyle>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Lifestyle) => (
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
      accessor: 'cost',
      sortable: true,
    },
    {
      id: 'dice',
      header: 'Dice',
      accessor: 'dice',
      sortable: true,
    },
    {
      id: 'lp',
      header: 'LP',
      accessor: 'lp',
      sortable: true,
    },
    {
      id: 'multiplier',
      header: 'Multiplier',
      accessor: 'multiplier',
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: 'source',
      sortable: true,
    },
  ];

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <LifestyleSourceFilter
            lifestyles={lifestyles}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
          />
        </div>
      </div>
      <DataTable
        data={filteredLifestyles}
        columns={columns}
        searchFields={['name', 'source']}
        searchPlaceholder="Search lifestyles by name or source..."
        rowsPerPageOptions={[25, 50, 100]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No lifestyles available"
        emptySearchMessage="No lifestyles found matching your search criteria."
        ariaLabel="Lifestyles data table"
      />
      <LifestyleViewModal
        lifestyle={selectedLifestyle}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

