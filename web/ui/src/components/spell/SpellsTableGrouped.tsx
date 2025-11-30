import { useState, useMemo, memo, useCallback } from 'react';
import type { Spell } from '../../lib/types';
import { SpellViewModal } from './SpellViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { GroupedTable, type GroupedTableColumn } from '../common/GroupedTable';

interface SpellsTableGroupedProps {
  spells: Spell[];
}

export const SpellsTableGrouped = memo(function SpellsTableGrouped({ spells }: SpellsTableGroupedProps) {
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter spells by selected sources
  const filteredSpells = useMemo(() => {
    if (selectedSources.length === 0) return spells;
    return spells.filter(spell => {
      const source = spell.source?.source;
      return source && selectedSources.includes(source);
    });
  }, [spells, selectedSources]);

  const handleNameClick = useCallback((spell: Spell) => {
    setSelectedSpell(spell);
    setIsModalOpen(true);
  }, []);

  // Helper to get group key (group by category)
  const getGroupKey = (item: Spell): string => {
    return item.category || 'combat';
  };

  // Helper to get group label
  const getGroupLabel = (groupKey: string): string => {
    return groupKey.charAt(0).toUpperCase() + groupKey.slice(1);
  };

  const columns: GroupedTableColumn<Spell>[] = [
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
      header: 'Type',
      accessor: (item) => item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : '-',
    },
    {
      header: 'Range',
      accessor: (item) => item.range || '-',
    },
    {
      header: 'Drain',
      accessor: (item) => item.drain?.formula || '-',
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
          items={spells}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
      </div>

      <GroupedTable
        items={filteredSpells}
        getGroupKey={getGroupKey}
        getGroupLabel={getGroupLabel}
        columns={columns}
        searchFields={['name', 'category', 'type', 'description']}
        searchPlaceholder="Search spells by name, category, type, or description..."
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

      <SpellViewModal
        spell={selectedSpell}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

