import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { WeaponConsumable } from '../../lib/types';
import { WeaponConsumableViewModal } from './WeaponConsumableViewModal';
import { WeaponConsumableSourceFilter } from './WeaponConsumableSourceFilter';
import { formatCost } from '../../lib/formatUtils';

interface WeaponConsumablesTableProps {
  consumables: WeaponConsumable[];
}

export const WeaponConsumablesTable = memo(function WeaponConsumablesTable({ consumables }: WeaponConsumablesTableProps) {
  const [selectedConsumable, setSelectedConsumable] = useState<WeaponConsumable | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter consumables by selected sources
  const filteredConsumables = useMemo(() => {
    if (selectedSources.length === 0) {
      return consumables;
    }
    return consumables.filter(consumable => selectedSources.includes(consumable.source));
  }, [consumables, selectedSources]);

  const handleNameClick = useCallback((consumable: WeaponConsumable) => {
    setSelectedConsumable(consumable);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<WeaponConsumable>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: WeaponConsumable) => (
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
      id: 'cost',
      header: 'Cost',
      accessor: 'cost',
      sortable: true,
      render: (value: unknown) => formatCost(value as string | undefined),
    },
    {
      id: 'availability',
      header: 'Availability',
      accessor: 'availability',
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: 'source',
      sortable: true,
    },
  ], [handleNameClick]);

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <WeaponConsumableSourceFilter
            consumables={consumables}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
          />
        </div>
      </div>
      <DataTable
        data={filteredConsumables}
        columns={columns}
        searchFields={['name', 'category', 'cost', 'availability', 'source', 'description']}
        searchPlaceholder="Search weapon consumables by name, category, cost, availability, or source..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No weapon consumables available"
        emptySearchMessage="No weapon consumables found matching your search criteria."
        ariaLabel="Weapon consumables data table"
      />
      <WeaponConsumableViewModal
        consumable={selectedConsumable}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

