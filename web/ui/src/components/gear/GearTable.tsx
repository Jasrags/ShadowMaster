import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Gear } from '../../lib/types';
import { GearViewModal } from './GearViewModal';
import { CategoryFilter } from './CategoryFilter';
import { SourceFilter } from '../common/SourceFilter';
import { getCategoryDisplayName } from './categoryUtils';
import { formatCost } from '../../lib/formatUtils';

interface GearTableProps {
  gear: Gear[];
}

export const GearTable = memo(function GearTable({ gear }: GearTableProps) {
  const [selectedGear, setSelectedGear] = useState<Gear | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter gear by selected categories and sources
  const filteredGear = useMemo(() => {
    let filtered = gear;

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => selectedCategories.includes(item.category));
    }

    // Filter by source
    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => {
        const source = typeof item.source === 'string' ? item.source : item.source?.source;
        return source && selectedSources.includes(source);
      });
    }

    return filtered;
  }, [gear, selectedCategories, selectedSources]);

  const handleNameClick = useCallback((gearItem: Gear) => {
    setSelectedGear(gearItem);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<Gear>[] = useMemo(() => [
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
      accessor: (row: Gear) => getCategoryDisplayName(row.category),
      sortable: true,
    },
    {
      id: 'subcategory',
      header: 'Subcategory',
      accessor: (row: Gear) => row.subcategory || '-',
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row: Gear) => typeof row.source === 'string' ? row.source : row.source?.source || '-',
      sortable: true,
    },
    {
      id: 'page',
      header: 'Page',
      accessor: (row: Gear) => row.page || (typeof row.source === 'object' ? row.source?.page : '-') || '-',
      sortable: true,
    },
    {
      id: 'rating',
      header: 'Rating',
      accessor: (row: Gear) => row.rating !== undefined ? String(row.rating) : (row.rating as string | undefined) || '-',
      sortable: true,
    },
    {
      id: 'avail',
      header: 'Availability',
      accessor: (row: Gear) => row.availability || row.avail || '-',
      sortable: true,
    },
    {
      id: 'cost',
      header: 'Cost',
      accessor: (row: Gear) => {
        if (row.cost !== undefined) {
          const formattedCost = formatCost(String(row.cost));
          return row.cost_per_rating ? `${formattedCost} per rating` : formattedCost;
        }
        return formatCost(row.cost as string | undefined);
      },
      sortable: true,
    },
    {
      id: 'costfor',
      header: 'Cost For',
      accessor: 'costfor',
      sortable: true,
    },
  ], [handleNameClick]);

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
            items={gear}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
            getSource={(g) => (typeof g.source === 'string' ? g.source : g.source?.source) || 'Unknown'}
          />
        </div>
      </div>
      <DataTable
        data={filteredGear}
        columns={columns}
        searchFields={['name', 'category', 'subcategory', 'source']}
        searchPlaceholder="Search gear by name, category, subcategory, or source..."
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
});

