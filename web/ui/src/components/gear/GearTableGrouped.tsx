import { useState, useMemo } from 'react';
import type { Gear } from '../../lib/types';
import { GearViewModal } from './GearViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { GroupedTable, type GroupedTableColumn } from '../common/GroupedTable';
import { getCategoryDisplayName } from './categoryUtils';
import { formatCost } from '../../lib/formatUtils';

interface GearTableGroupedProps {
  gear: Gear[];
}

export function GearTableGrouped({ gear }: GearTableGroupedProps) {
  const [selectedGear, setSelectedGear] = useState<Gear | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter gear by selected sources
  const filteredGear = useMemo(() => {
    if (selectedSources.length === 0) return gear;
    return gear.filter(item => {
      const source = typeof item.source === 'string' ? item.source : item.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [gear, selectedSources]);

  const handleNameClick = (gearItem: Gear) => {
    setSelectedGear(gearItem);
    setIsModalOpen(true);
  };

  // Helper to get group key (flatten nested grouping: Category - Subcategory, or just Category if single subcategory)
  // We'll use a composite key that includes subcategory, and GroupedTable will handle the grouping
  const getGroupKey = (item: Gear): string => {
    const category = item.category || 'Unknown';
    const subcategory = item.subcategory || 'Uncategorized';
    
    // Always use composite key - GroupedTable will group by this key
    // This effectively flattens the nested structure while preserving the hierarchy in the label
    return `${category} - ${subcategory}`;
  };

  // Helper to get group label
  const getGroupLabel = (groupKey: string): string => {
    if (groupKey.includes(' - ')) {
      const [category, subcategory] = groupKey.split(' - ');
      return `${getCategoryDisplayName(category)} - ${subcategory}`;
    }
    return getCategoryDisplayName(groupKey);
  };

  const columns: GroupedTableColumn<Gear>[] = [
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
      header: 'Source',
      accessor: (item) => typeof item.source === 'string' ? item.source : item.source?.source || '-',
    },
    {
      header: 'Page',
      accessor: (item) => item.page || (typeof item.source === 'object' ? item.source?.page : '-') || '-',
    },
    {
      header: 'Rating',
      accessor: (item) => item.rating !== undefined ? String(item.rating) : (item.rating as string | undefined) || '-',
    },
    {
      header: 'Availability',
      accessor: (item) => item.availability || item.avail || '-',
    },
    {
      header: 'Cost',
      accessor: (item) => {
        if (item.cost !== undefined) {
          return item.cost_per_rating
            ? `${formatCost(String(item.cost))} per rating`
            : formatCost(String(item.cost));
        }
        return formatCost(item.cost as string | undefined);
      },
    },
    {
      header: 'Cost For',
      accessor: (item) => item.costfor || '-',
    },
  ];

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <SourceFilter
            items={gear}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
            getSource={(g) => (typeof g.source === 'string' ? g.source : g.source?.source) || 'Unknown'}
          />
        </div>
      </div>

      <GroupedTable
        items={filteredGear}
        getGroupKey={getGroupKey}
        getGroupLabel={getGroupLabel}
        columns={columns}
        searchFields={['name', 'category', 'subcategory', 'description']}
        searchPlaceholder="Search gear by name, category, subcategory, or description..."
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

      <GearViewModal
        gear={selectedGear}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

