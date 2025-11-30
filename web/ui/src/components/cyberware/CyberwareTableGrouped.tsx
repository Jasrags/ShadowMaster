import { useState, useMemo, memo, useCallback } from 'react';
import type { Cyberware } from '../../lib/types';
import { CyberwareViewModal } from './CyberwareViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { GroupedTable, type GroupedTableColumn } from '../common/GroupedTable';

interface CyberwareTableGroupedProps {
  cyberware: Cyberware[];
}

export const CyberwareTableGrouped = memo(function CyberwareTableGrouped({ cyberware }: CyberwareTableGroupedProps) {
  const [selectedCyberware, setSelectedCyberware] = useState<Cyberware | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter cyberware by selected sources
  const filteredCyberware = useMemo(() => {
    if (selectedSources.length === 0) return cyberware;
    return cyberware.filter(item => {
      const source = item.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [cyberware, selectedSources]);

  const handleNameClick = useCallback((item: Cyberware) => {
    setSelectedCyberware(item);
    setIsModalOpen(true);
  }, []);

  // Helper to get group key (group by part)
  const getGroupKey = (item: Cyberware): string => {
    return item.part || 'Unknown';
  };

  // Helper to get group label
  const getGroupLabel = (groupKey: string): string => {
    return groupKey || 'Unknown';
  };

  const columns: GroupedTableColumn<Cyberware>[] = [
    {
      header: 'Device',
      accessor: (item) => (
        <button
          onClick={() => handleNameClick(item)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left pl-4"
        >
          {item.device}
        </button>
      ),
    },
    {
      header: 'Essence',
      accessor: (item) => item.essence || item.essence_formula?.formula || '-',
    },
    {
      header: 'Capacity',
      accessor: (item) => item.capacity || item.capacity_formula?.formula || '-',
    },
    {
      header: 'Cost',
      accessor: (item) => item.cost || item.cost_formula?.formula || '-',
    },
    {
      header: 'Availability',
      accessor: (item) => item.availability || item.availability_formula?.formula || '-',
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
          items={cyberware}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
      </div>

      <GroupedTable
        items={filteredCyberware}
        getGroupKey={getGroupKey}
        getGroupLabel={getGroupLabel}
        columns={columns}
        searchFields={['device', 'part', 'essence', 'capacity', 'cost', 'availability']}
        searchPlaceholder="Search cyberware by device, part, essence, capacity, cost, or availability..."
        renderItemRow={(item, index) => (
          <tr
            key={`${getGroupKey(item)}-${item.device}-${index}`}
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

      <CyberwareViewModal
        cyberware={selectedCyberware}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});
