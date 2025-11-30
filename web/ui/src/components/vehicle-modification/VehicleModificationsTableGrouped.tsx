import { useState, useMemo, memo, useCallback } from 'react';
import type { VehicleModification } from '../../lib/types';
import { VehicleModificationViewModal } from './VehicleModificationViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { GroupedTable, type GroupedTableColumn } from '../common/GroupedTable';

interface VehicleModificationsTableGroupedProps {
  modifications: VehicleModification[];
}

export const VehicleModificationsTableGrouped = memo(function VehicleModificationsTableGrouped({ modifications }: VehicleModificationsTableGroupedProps) {
  const [selectedModification, setSelectedModification] = useState<VehicleModification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter modifications by selected sources
  const filteredModifications = useMemo(() => {
    if (selectedSources.length === 0) return modifications;
    return modifications.filter(mod => {
      const source = mod.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [modifications, selectedSources]);

  const handleNameClick = useCallback((modification: VehicleModification) => {
    setSelectedModification(modification);
    setIsModalOpen(true);
  }, []);

  // Helper to get group key
  const getGroupKey = (item: VehicleModification): string => {
    return item.type || 'base_mods';
  };

  // Helper to get group label
  const getGroupLabel = (groupKey: string): string => {
    return groupKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const columns: GroupedTableColumn<VehicleModification>[] = [
    {
      header: 'Name',
      accessor: (item) => (
        <button
          onClick={() => handleNameClick(item)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left pl-4"
        >
          {item.name}
        </button>
      ),
    },
    {
      header: 'Slots',
      accessor: (item) => item.slots?.description || '-',
    },
    {
      header: 'Cost',
      accessor: (item) => item.cost?.formula || '-',
    },
    {
      header: 'Availability',
      accessor: (item) => {
        if (item.availability) {
          let avail = String(item.availability.value || '');
          if (item.availability.restricted) avail += 'R';
          if (item.availability.forbidden) avail += 'F';
          return avail || item.availability.formula || '-';
        }
        return '-';
      },
    },
    {
      header: 'Source',
      accessor: (item) => item.source?.source || '-',
    },
  ];

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={modifications}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
      </div>

      <GroupedTable
        items={filteredModifications}
        getGroupKey={getGroupKey}
        getGroupLabel={getGroupLabel}
        columns={columns}
        searchFields={['name', 'type', 'description']}
        searchPlaceholder="Search vehicle modifications by name, type, or description..."
        renderItemRow={(item, index) => (
          <tr
            key={`${getGroupKey(item)}-${item.name}-${index}`}
            className="border-b border-sr-light-gray/50 hover:bg-sr-light-gray/20 transition-colors"
          >
            <td className="px-4 py-2"></td>
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                className={`px-4 py-2 text-gray-300 ${column.className || ''}`}
              >
                {column.accessor(item)}
              </td>
            ))}
          </tr>
        )}
      />

      <VehicleModificationViewModal
        modification={selectedModification}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

