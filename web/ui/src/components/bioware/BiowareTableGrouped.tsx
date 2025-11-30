import { useState, useMemo, memo, useCallback } from 'react';
import type { Bioware } from '../../lib/types';
import { BiowareViewModal } from './BiowareViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { GroupedTable, type GroupedTableColumn } from '../common/GroupedTable';

interface BiowareTableGroupedProps {
  bioware: Bioware[];
}

export const BiowareTableGrouped = memo(function BiowareTableGrouped({ bioware }: BiowareTableGroupedProps) {
  const [selectedBioware, setSelectedBioware] = useState<Bioware | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter bioware by selected sources
  const filteredBioware = useMemo(() => {
    if (selectedSources.length === 0) return bioware;
    return bioware.filter(item => {
      const source = item.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [bioware, selectedSources]);

  const handleNameClick = useCallback((item: Bioware) => {
    setSelectedBioware(item);
    setIsModalOpen(true);
  }, []);

  // Helper to get group key (group by type)
  const getGroupKey = (item: Bioware): string => {
    return item.type || 'Unknown';
  };

  // Helper to get group label
  const getGroupLabel = (groupKey: string): string => {
    return groupKey || 'Unknown';
  };

  const columns: GroupedTableColumn<Bioware>[] = [
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
          items={bioware}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
      </div>

      <GroupedTable
        items={filteredBioware}
        getGroupKey={getGroupKey}
        getGroupLabel={getGroupLabel}
        columns={columns}
        searchFields={['device', 'type', 'essence', 'cost', 'availability']}
        searchPlaceholder="Search bioware by device, type, essence, cost, or availability..."
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

      <BiowareViewModal
        bioware={selectedBioware}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});
