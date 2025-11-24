import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { Weapon, WeaponAccessoryItem } from '../../lib/types';
import { WeaponViewModal } from './WeaponViewModal';
import { WeaponCategoryFilter } from './WeaponCategoryFilter';
import { WeaponSourceFilter } from './WeaponSourceFilter';
import { formatCost } from '../../lib/formatUtils';

interface WeaponTableProps {
  weapons: Weapon[];
  accessoryMap: Map<string, WeaponAccessoryItem>;
}

export const WeaponTable = memo(function WeaponTable({ weapons, accessoryMap }: WeaponTableProps) {
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter weapons by selected categories and sources
  const filteredWeapons = useMemo(() => {
    let filtered = weapons;

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => selectedCategories.includes(item.category));
    }

    // Filter by source
    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => selectedSources.includes(item.source));
    }

    return filtered;
  }, [weapons, selectedCategories, selectedSources]);

  const handleNameClick = useCallback((weaponItem: Weapon) => {
    setSelectedWeapon(weaponItem);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<Weapon>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: Weapon) => (
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
      id: 'type',
      header: 'Type',
      accessor: 'type',
      sortable: true,
    },
    {
      id: 'damage',
      header: 'Damage',
      accessor: 'damage',
      sortable: true,
    },
    {
      id: 'accuracy',
      header: 'Accuracy',
      accessor: 'accuracy',
      sortable: true,
    },
    {
      id: 'ap',
      header: 'AP',
      accessor: 'ap',
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
      render: (value: unknown) => formatCost(value as string | undefined),
    },
  ], [handleNameClick]);

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <WeaponCategoryFilter
            weapons={weapons}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
          />
          <WeaponSourceFilter
            weapons={weapons}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
          />
        </div>
      </div>
      <DataTable
        data={filteredWeapons}
        columns={columns}
        searchFields={['name', 'category', 'type', 'source']}
        searchPlaceholder="Search weapons by name, category, type, or source..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No weapons available"
        emptySearchMessage="No weapons found matching your search criteria."
        ariaLabel="Weapons data table"
      />
      <WeaponViewModal
        weapon={selectedWeapon}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        accessoryMap={accessoryMap}
      />
    </>
  );
});

