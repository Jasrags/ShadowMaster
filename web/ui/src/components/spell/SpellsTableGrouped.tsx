import { useState, useMemo, memo, useCallback } from 'react';
import { Button } from 'react-aria-components';
import type { Spell } from '../../lib/types';
import { SpellViewModal } from './SpellViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { filterData } from '../../lib/tableUtils';

interface SpellsTableGroupedProps {
  spells: Spell[];
}


export const SpellsTableGrouped = memo(function SpellsTableGrouped({ spells }: SpellsTableGroupedProps) {
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const filteredSpells = useMemo(() => {
    let filtered = spells;

    if (selectedSources.length > 0) {
      filtered = filtered.filter(spell => {
        const source = spell.source?.source;
        return source && selectedSources.includes(source);
      });
    }

    if (searchTerm) {
      filtered = filterData(filtered, searchTerm, {}, ['name', 'category', 'type', 'description']);
    }

    return filtered;
  }, [spells, selectedSources, searchTerm]);

  const groupedSpells = useMemo(() => {
    const categoryMap = new Map<string, Spell[]>();

    filteredSpells.forEach(spell => {
      const category = spell.category || 'combat';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(spell);
    });

    return Array.from(categoryMap.entries())
      .map(([category, spells]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        spells: spells.sort((a, b) => (a.name || '').localeCompare(b.name || '')),
        isExpanded: expandedCategories.has(category),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [filteredSpells, expandedCategories]);

  const toggleCategory = useCallback((category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  }, [expandedCategories]);

  const handleNameClick = useCallback((spell: Spell) => {
    setSelectedSpell(spell);
    setIsModalOpen(true);
  }, []);

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={spells}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search spells..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent flex-1 max-w-md"
          />
        </div>
      </div>

      <div className="space-y-4">
        {groupedSpells.map((group) => (
          <div key={group.category} className="bg-sr-dark border border-sr-light-gray rounded-lg overflow-hidden">
            <Button
              onPress={() => toggleCategory(group.category.toLowerCase())}
              className="w-full px-4 py-3 bg-sr-gray hover:bg-sr-light-gray border-b border-sr-light-gray flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{group.isExpanded ? '▼' : '▶'}</span>
                <span className="font-semibold text-gray-100">{group.category}</span>
                <span className="text-sm text-gray-400">({group.spells.length})</span>
              </div>
            </Button>
            {group.isExpanded && (
              <div className="p-4">
                <div className="space-y-2">
                  {group.spells.map((spell) => (
                    <div
                      key={spell.name}
                      className="flex items-center justify-between p-2 hover:bg-sr-light-gray rounded cursor-pointer"
                      onClick={() => handleNameClick(spell)}
                    >
                      <div className="flex-1">
                        <div className="text-gray-100 font-medium">{spell.name}</div>
                        {spell.description && (
                          <div className="text-sm text-gray-400 mt-1 line-clamp-2">{spell.description}</div>
                        )}
                      </div>
                      {spell.source?.source && (
                        <div className="text-xs text-gray-500 ml-4">{spell.source.source}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <SpellViewModal
        spell={selectedSpell}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

