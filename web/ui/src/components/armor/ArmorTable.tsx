import { useState, useMemo } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Armor, Gear } from '../../lib/types';
import { ArmorViewModal } from './ArmorViewModal';
import { ArmorCategoryFilter } from './ArmorCategoryFilter';
import { ArmorSourceFilter } from './ArmorSourceFilter';

interface ArmorTableProps {
  armor: Armor[];
  gearMap: Map<string, Gear>;
}

export function ArmorTable({ armor, gearMap }: ArmorTableProps) {
  const [selectedArmor, setSelectedArmor] = useState<Armor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  // Filter armor by selected categories and sources
  const filteredArmor = useMemo(() => {
    let filtered = armor;

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => selectedCategories.includes(item.category));
    }

    // Filter by source
    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => selectedSources.includes(item.source));
    }

    return filtered;
  }, [armor, selectedCategories, selectedSources]);

  const handleNameClick = (armorItem: Armor) => {
    setSelectedArmor(armorItem);
    setIsModalOpen(true);
  };

  const columns: ColumnDefinition<Armor>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Armor) => (
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
      id: 'armor',
      header: 'Armor',
      accessor: 'armor',
      sortable: true,
    },
    {
      id: 'armorcapacity',
      header: 'Capacity',
      accessor: 'armorcapacity',
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: 'source',
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
  ];

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <ArmorCategoryFilter
            armor={armor}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
          />
          <ArmorSourceFilter
            armor={armor}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
          />
        </div>
      </div>
      <DataTable
        data={filteredArmor}
        columns={columns}
        searchFields={['name', 'category', 'source']}
        searchPlaceholder="Search armor by name, category, or source..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No armor available"
        emptySearchMessage="No armor found matching your search criteria."
        ariaLabel="Armor data table"
      />
      <ArmorViewModal
        armor={selectedArmor}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        gearMap={gearMap}
      />
    </>
  );
}

