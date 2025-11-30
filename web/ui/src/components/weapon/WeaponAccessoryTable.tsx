import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { WeaponAccessoryItem } from '../../lib/types';
import { SourceFilter } from '../common/SourceFilter';
import { WeaponAccessoryViewModal } from './WeaponAccessoryViewModal';
import { formatCost } from '../../lib/formatUtils';

interface WeaponAccessoryTableProps {
  accessories: WeaponAccessoryItem[];
}

export const WeaponAccessoryTable = memo(function WeaponAccessoryTable({ accessories }: WeaponAccessoryTableProps) {
  const [selectedAccessory, setSelectedAccessory] = useState<WeaponAccessoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter accessories by selected sources
  const filteredAccessories = useMemo(() => {
    let filtered = accessories;

    // Filter by source
    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => selectedSources.includes(item.source));
    }

    return filtered;
  }, [accessories, selectedSources]);

  const handleNameClick = useCallback((accessory: WeaponAccessoryItem) => {
    setSelectedAccessory(accessory);
    setIsModalOpen(true);
  }, []);

  const columns: ColumnDefinition<WeaponAccessoryItem>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: WeaponAccessoryItem) => (
        <button
          onClick={() => handleNameClick(row)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left"
        >
          {String(value || '')}
        </button>
      ),
    },
    {
      id: 'mount',
      header: 'Mount',
      accessor: 'mount',
      sortable: true,
    },
    {
      id: 'rating',
      header: 'Rating',
      accessor: 'rating',
      sortable: true,
      render: (value: unknown) => (value ? String(value) : '-'),
    },
    {
      id: 'accuracy',
      header: 'Accuracy',
      accessor: 'accuracy',
      sortable: true,
      render: (value: unknown) => (value ? String(value) : '-'),
    },
    {
      id: 'rc',
      header: 'RC',
      accessor: 'rc',
      sortable: true,
      render: (value: unknown) => (value ? String(value) : '-'),
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

  // uniqueSources removed - unused

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <SourceFilter
            items={accessories}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
            getSource={(acc) => acc.source || 'Unknown'}
          />
        </div>
      </div>
      <DataTable
        data={filteredAccessories}
        columns={columns}
        searchFields={['name', 'mount', 'source']}
        searchPlaceholder="Search accessories by name, mount, or source..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No weapon accessories available"
        emptySearchMessage="No weapon accessories found matching your search criteria."
        ariaLabel="Weapon accessories data table"
      />
      <WeaponAccessoryViewModal
        accessory={selectedAccessory}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

