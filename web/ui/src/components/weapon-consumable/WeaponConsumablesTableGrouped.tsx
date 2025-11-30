import { useState, useMemo } from 'react';
import type { WeaponConsumable } from '../../lib/types';
import { WeaponConsumableViewModal } from './WeaponConsumableViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { GroupedTable, type GroupedTableColumn } from '../common/GroupedTable';
import { formatCost } from '../../lib/formatUtils';

interface WeaponConsumablesTableGroupedProps {
  consumables: WeaponConsumable[];
}

export function WeaponConsumablesTableGrouped({ consumables }: WeaponConsumablesTableGroupedProps) {
  const [selectedConsumable, setSelectedConsumable] = useState<WeaponConsumable | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter consumables by selected sources
  const filteredConsumables = useMemo(() => {
    if (selectedSources.length === 0) return consumables;
    return consumables.filter(item => {
      const source = item.source?.source || 'Unknown';
      return selectedSources.includes(source);
    });
  }, [consumables, selectedSources]);

  const handleNameClick = (consumable: WeaponConsumable) => {
    setSelectedConsumable(consumable);
    setIsModalOpen(true);
  };

  const columns: GroupedTableColumn<WeaponConsumable>[] = [
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
      header: 'Cost',
      accessor: (item) => formatCost(item.cost),
    },
    {
      header: 'Availability',
      accessor: (item) => item.availability || '-',
    },
    {
      header: 'Source',
      accessor: (item) => item.source?.source || '-',
    },
  ];

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <SourceFilter
            items={consumables}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
            getSource={(c) => c.source?.source || 'Unknown'}
          />
        </div>
      </div>

      <GroupedTable
        items={filteredConsumables}
        getGroupKey={(item) => item.category || 'Unknown'}
        getGroupLabel={(category) => category}
        columns={columns}
        searchFields={['name', 'category', 'description', 'cost', 'availability']}
        searchPlaceholder="Search weapon consumables by name, category, description, or cost..."
        renderItemRow={(item, index) => (
          <tr
            key={`${item.category}-${item.id}-${index}`}
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

      <WeaponConsumableViewModal
        consumable={selectedConsumable}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

