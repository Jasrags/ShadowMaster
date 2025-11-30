import { useState, useMemo, memo, useCallback } from 'react';
import type { Power } from '../../lib/types';
import { PowerViewModal } from './PowerViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { GroupedTable, type GroupedTableColumn } from '../common/GroupedTable';

interface PowersTableGroupedProps {
  powers: Power[];
}

export const PowersTableGrouped = memo(function PowersTableGrouped({ powers }: PowersTableGroupedProps) {
  const [selectedPower, setSelectedPower] = useState<Power | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  // Filter powers by selected sources
  const filteredPowers = useMemo(() => {
    if (selectedSources.length === 0) return powers;
    return powers.filter(power => {
      const source = power.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [powers, selectedSources]);

  const handleNameClick = useCallback((power: Power) => {
    setSelectedPower(power);
    setIsModalOpen(true);
  }, []);

  // Helper to get group key (group by activation)
  const getGroupKey = (item: Power): string => {
    return item.activation || 'passive';
  };

  // Helper to get group label
  const getGroupLabel = (groupKey: string): string => {
    return groupKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const columns: GroupedTableColumn<Power>[] = [
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
      accessor: (item) => item.cost?.formula || '-',
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
          items={powers}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
      </div>

      <GroupedTable
        items={filteredPowers}
        getGroupKey={getGroupKey}
        getGroupLabel={getGroupLabel}
        columns={columns}
        searchFields={['name', 'activation', 'description']}
        searchPlaceholder="Search powers by name, activation, or description..."
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

      <PowerViewModal
        power={selectedPower}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

