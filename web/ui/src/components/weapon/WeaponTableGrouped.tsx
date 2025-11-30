import { useState, useMemo, useEffect, Fragment } from 'react';
import { Button } from 'react-aria-components';
import type { Weapon, WeaponAccessoryItem } from '../../lib/types';
import { WeaponViewModal } from './WeaponViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { filterData } from '../../lib/tableUtils';
import { formatCost } from '../../lib/formatUtils';

interface WeaponTableGroupedProps {
  weapons: Weapon[];
  accessoryMap: Map<string, WeaponAccessoryItem>;
}

// GroupedWeapons interface removed - unused

export function WeaponTableGrouped({ weapons, accessoryMap }: WeaponTableGroupedProps) {
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Filter weapons by selected sources and search term
  const filteredWeapons = useMemo(() => {
    let filtered = weapons;

    // Filter by source
    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => selectedSources.includes(item.source));
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filterData(filtered, searchTerm, {}, ['name', 'category', 'type', 'source']);
    }

    return filtered;
  }, [weapons, selectedSources, searchTerm]);

  // Group weapons by category
  const groupedWeapons = useMemo(() => {
    const groups = new Map<string, Weapon[]>();
    
    filteredWeapons.forEach(item => {
      const category = item.category || 'Unknown';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(item);
    });

    // Convert to array and sort
    return Array.from(groups.entries())
      .map(([category, weapons]) => ({
        category,
        weapons: weapons.sort((a, b) => a.name.localeCompare(b.name)),
        isExpanded: expandedGroups.has(category),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [filteredWeapons, expandedGroups]);

  // Auto-expand categories that have matching weapons when searching
  useEffect(() => {
    if (searchTerm.trim()) {
      // Find categories that have matching weapons
      const categoriesWithMatches = new Set<string>();
      filteredWeapons.forEach(item => {
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
  }, [searchTerm, filteredWeapons]);

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
    const allCategories = new Set(groupedWeapons.map(g => g.category));
    setExpandedGroups(allCategories);
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  const handleNameClick = (weaponItem: Weapon) => {
    setSelectedWeapon(weaponItem);
    setIsModalOpen(true);
  };

  const totalWeapons = filteredWeapons.length;
  const totalGroups = groupedWeapons.length;

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <SourceFilter
            items={weapons}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
            getSource={(w) => w.source || 'Unknown'}
          />
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search weapons by name, category, type, or source..."
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Damage</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Accuracy</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">AP</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Source</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Availability</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Cost</th>
              </tr>
            </thead>
            <tbody>
              {groupedWeapons.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    No weapons found matching your criteria.
                  </td>
                </tr>
              ) : (
                groupedWeapons.map((group) => (
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
                            {group.weapons.length} {group.weapons.length === 1 ? 'weapon' : 'weapons'}
                          </span>
                        </div>
                      </td>
                      <td colSpan={7} className="px-4 py-3 text-sm text-gray-400">
                        Click to {group.isExpanded ? 'collapse' : 'expand'}
                      </td>
                    </tr>

                    {/* Group Weapons Rows */}
                    {group.isExpanded && group.weapons.map((weapon, index) => (
                      <tr
                        key={`${group.category}-${weapon.name}-${index}`}
                        className="border-b border-sr-light-gray/50 hover:bg-sr-light-gray/20 transition-colors"
                      >
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleNameClick(weapon)}
                            className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left pl-4"
                          >
                            {weapon.name}
                          </button>
                        </td>
                        <td className="px-4 py-2 text-gray-300">{weapon.type || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{weapon.damage || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{weapon.accuracy || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{weapon.ap || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{weapon.source || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{weapon.avail || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{formatCost(weapon.cost)}</td>
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
          Showing {totalWeapons} {totalWeapons === 1 ? 'weapon' : 'weapons'} in {totalGroups} {totalGroups === 1 ? 'category' : 'categories'}
        </div>
      </div>

      <WeaponViewModal
        weapon={selectedWeapon}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        accessoryMap={accessoryMap}
      />
    </>
  );
}

