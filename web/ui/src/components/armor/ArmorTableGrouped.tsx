import { useState, useMemo, useEffect, Fragment } from 'react';
import { Button } from 'react-aria-components';
import type { Armor, Gear } from '../../lib/types';
import { ArmorViewModal } from './ArmorViewModal';
import { ArmorSourceFilter } from './ArmorSourceFilter';
import { filterData } from '../../lib/tableUtils';
import { formatCost } from '../../lib/formatUtils';

interface ArmorTableGroupedProps {
  armor: Armor[];
  gearMap: Map<string, Gear>;
}

export function ArmorTableGrouped({ armor, gearMap }: ArmorTableGroupedProps) {
  const [selectedArmor, setSelectedArmor] = useState<Armor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Filter armor by selected sources and search term
  const filteredArmor = useMemo(() => {
    let filtered = armor;

    // Filter by source
    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => selectedSources.includes(item.source));
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filterData(filtered, searchTerm, {}, ['name', 'category', 'source']);
    }

    return filtered;
  }, [armor, selectedSources, searchTerm]);

  // Group armor by category
  const groupedArmor = useMemo(() => {
    const groups = new Map<string, Armor[]>();
    
    filteredArmor.forEach(item => {
      const category = item.category || 'Unknown';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(item);
    });

    // Convert to array and sort
    return Array.from(groups.entries())
      .map(([category, armor]) => ({
        category,
        armor: armor.sort((a, b) => a.name.localeCompare(b.name)),
        isExpanded: expandedGroups.has(category),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [filteredArmor, expandedGroups]);

  // Auto-expand categories that have matching armor when searching
  useEffect(() => {
    if (searchTerm.trim()) {
      // Find categories that have matching armor
      const categoriesWithMatches = new Set<string>();
      filteredArmor.forEach(item => {
        const category = item.category || 'Unknown';
        categoriesWithMatches.add(category);
      });
      
      // Add categories with matches to expanded groups
      if (categoriesWithMatches.size > 0) {
        setExpandedGroups(prev => {
          const newExpanded = new Set(prev);
          categoriesWithMatches.forEach(cat => newExpanded.add(cat));
          return newExpanded;
        });
      }
    }
  }, [searchTerm, filteredArmor]);

  const toggleGroup = (category: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedGroups(newExpanded);
  };

  const expandAll = () => {
    const allCategories = new Set(groupedArmor.map(g => g.category));
    setExpandedGroups(allCategories);
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  const handleNameClick = (armorItem: Armor) => {
    setSelectedArmor(armorItem);
    setIsModalOpen(true);
  };

  const totalArmor = filteredArmor.length;
  const totalGroups = groupedArmor.length;

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <ArmorSourceFilter
            armor={armor}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
          />
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search armor by name, category, or source..."
              className="w-full px-4 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onPress={expandAll}
              className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-300 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent text-sm"
            >
              Expand All
            </Button>
            <Button
              onPress={collapseAll}
              className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-300 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent text-sm"
            >
              Collapse All
            </Button>
          </div>
        </div>
      </div>

      {/* Grouped Table */}
      <div className="bg-sr-gray border border-sr-light-gray rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-sr-darker border-b border-sr-light-gray">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300 w-12"></th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Armor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Capacity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Source</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Availability</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Cost</th>
              </tr>
            </thead>
            <tbody>
              {groupedArmor.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No armor found matching your criteria.
                  </td>
                </tr>
              ) : (
                groupedArmor.map((group) => (
                  <Fragment key={group.category}>
                    {/* Group Header Row */}
                    <tr
                      className="bg-sr-light-gray/30 border-b border-sr-light-gray cursor-pointer hover:bg-sr-light-gray/50 transition-colors"
                      onClick={() => toggleGroup(group.category)}
                    >
                      <td className="px-4 py-3">
                        <button
                          className="text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent rounded"
                          aria-label={group.isExpanded ? `Collapse ${group.category}` : `Expand ${group.category}`}
                        >
                          <svg
                            className={`w-5 h-5 transition-transform ${group.isExpanded ? 'rotate-90' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-200">{group.category}</span>
                          <span className="text-xs text-gray-400 bg-sr-gray px-2 py-1 rounded">
                            {group.armor.length} {group.armor.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </td>
                      <td colSpan={5} className="px-4 py-3 text-sm text-gray-400">
                        Click to {group.isExpanded ? 'collapse' : 'expand'}
                      </td>
                    </tr>

                    {/* Group Armor Rows */}
                    {group.isExpanded && group.armor.map((item, index) => (
                      <tr
                        key={`${group.category}-${item.name}-${index}`}
                        className="border-b border-sr-light-gray/50 hover:bg-sr-light-gray/20 transition-colors"
                      >
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleNameClick(item)}
                            className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left pl-4"
                          >
                            {item.name}
                          </button>
                        </td>
                        <td className="px-4 py-2 text-gray-300">{item.armor || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{item.armorcapacity || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{item.source || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{item.avail || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{formatCost(item.cost as string | undefined)}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="px-4 py-3 bg-sr-darker border-t border-sr-light-gray text-sm text-gray-400">
          Showing {totalArmor} {totalArmor === 1 ? 'item' : 'items'} in {totalGroups} {totalGroups === 1 ? 'category' : 'categories'}
        </div>
      </div>

      <ArmorViewModal
        armor={selectedArmor}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        gearMap={gearMap}
      />
    </>
  );
}

