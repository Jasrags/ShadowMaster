import { useState, useMemo } from 'react';
import type { Lifestyle } from '../../lib/types';
import { LifestyleViewModal } from './LifestyleViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { GroupedTable, type GroupedTableColumn } from '../common/GroupedTable';
import { formatCost } from '../../lib/formatUtils';

interface LifestylesTableGroupedProps {
  lifestyles: Lifestyle[];
}

export function LifestylesTableGrouped({ lifestyles }: LifestylesTableGroupedProps) {
  const [selectedLifestyle, setSelectedLifestyle] = useState<Lifestyle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter lifestyles by selected sources
  const filteredLifestyles = useMemo(() => {
    if (selectedSources.length === 0) return lifestyles;
    return lifestyles.filter(item => selectedSources.includes(item.source));
  }, [lifestyles, selectedSources]);

  const handleNameClick = (lifestyle: Lifestyle) => {
    setSelectedLifestyle(lifestyle);
    setIsModalOpen(true);
  };

  const columns: GroupedTableColumn<Lifestyle>[] = [
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
      header: 'Source',
      accessor: (item) => item.source || '-',
    },
  ];

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <SourceFilter
            items={lifestyles}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
            getSource={(l) => l.source || 'Unknown'}
          />
        </div>
      </div>

      <GroupedTable
        items={filteredLifestyles}
        getGroupKey={(item) => item.category || 'Unknown'}
        getGroupLabel={(category) => category}
        columns={columns}
        searchFields={['name', 'category', 'description', 'cost', 'source']}
        searchPlaceholder="Search lifestyles by name, category, description, or cost..."
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

      <LifestyleViewModal
        lifestyle={selectedLifestyle}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

