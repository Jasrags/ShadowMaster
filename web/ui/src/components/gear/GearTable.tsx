import { useState, useMemo } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Gear } from '../../lib/types';
import { GearViewModal } from './GearViewModal';
import { CategoryFilter } from './CategoryFilter';
import { SourceFilter } from './SourceFilter';

interface GearTableProps {
  gear: Gear[];
}

export function GearTable({ gear }: GearTableProps) {
  const [selectedGear, setSelectedGear] = useState<Gear | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  // Filter gear by selected categories and sources
  const filteredGear = useMemo(() => {
    let filtered = gear;

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => selectedCategories.includes(item.category));
    }

    // Filter by source
    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => selectedSources.includes(item.source));
    }

    return filtered;
  }, [gear, selectedCategories, selectedSources]);

  const handleNameClick = (gearItem: Gear) => {
    setSelectedGear(gearItem);
    setIsModalOpen(true);
  };

  const columns: ColumnDefinition<Gear>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Gear) => (
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
      accessor: 'category',
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: 'source',
      sortable: true,
    },
    {
      id: 'page',
      header: 'Page',
      accessor: 'page',
      sortable: true,
    },
    {
      id: 'rating',
      header: 'Rating',
      accessor: 'rating',
      sortable: true,
    },
    {
      id: 'avail',
      header: 'Availability',
      accessor: 'avail',
      sortable: true,
    },
    {
      id: 'cost',
      header: 'Cost',
      accessor: 'cost',
      sortable: true,
    },
    {
      id: 'costfor',
      header: 'Cost For',
      accessor: 'costfor',
      sortable: true,
    },
  ];

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <CategoryFilter
            gear={gear}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
          />
          <SourceFilter
            gear={gear}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
          />
        </div>
      </div>
      <DataTable
        data={filteredGear}
        columns={columns}
        searchFields={['name', 'category', 'source']}
        searchPlaceholder="Search gear by name, category, or source..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No gear available"
        emptySearchMessage="No gear found matching your search criteria."
        ariaLabel="Gear data table"
      />
      <GearViewModal
        gear={selectedGear}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

