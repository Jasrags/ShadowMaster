import { useState, useMemo } from 'react';
import type { Armor, Gear } from '../../lib/types';
import { ArmorViewModal } from './ArmorViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { GroupedTable, type GroupedTableColumn } from '../common/GroupedTable';
import { formatCost } from '../../lib/formatUtils';

interface ArmorTableGroupedProps {
  armor: Armor[];
  gearMap: Map<string, Gear>;
}

export function ArmorTableGrouped({ armor, gearMap }: ArmorTableGroupedProps) {
  const [selectedArmor, setSelectedArmor] = useState<Armor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter armor by selected sources
  const filteredArmor = useMemo(() => {
    if (selectedSources.length === 0) return armor;
    return armor.filter(item => selectedSources.includes(item.source));
  }, [armor, selectedSources]);

  const handleNameClick = (armorItem: Armor) => {
    setSelectedArmor(armorItem);
    setIsModalOpen(true);
  };

  const columns: GroupedTableColumn<Armor>[] = [
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
      header: 'Armor',
      accessor: (item) => item.armor || '-',
    },
    {
      header: 'Capacity',
      accessor: (item) => item.armorcapacity || '-',
    },
    {
      header: 'Source',
      accessor: (item) => item.source || '-',
    },
    {
      header: 'Availability',
      accessor: (item) => item.avail || '-',
    },
    {
      header: 'Cost',
      accessor: (item) => formatCost(item.cost as string | undefined),
    },
  ];

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <SourceFilter
            items={armor}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
            getSource={(a) => a.source || 'Unknown'}
          />
        </div>
      </div>

      <GroupedTable
        items={filteredArmor}
        getGroupKey={(item) => item.category || 'Unknown'}
        getGroupLabel={(category) => category}
        columns={columns}
        searchFields={['name', 'category', 'source']}
        searchPlaceholder="Search armor by name, category, or source..."
        renderItemRow={(item, index) => (
          <tr
            key={`${item.category}-${item.name}-${index}`}
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

      <ArmorViewModal
        armor={selectedArmor}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        gearMap={gearMap}
      />
    </>
  );
}

