import React, { useState, useMemo, useEffect } from 'react';
import { Button } from 'react-aria-components';
import type { Gear } from '../../lib/types';
import { GearViewModal } from './GearViewModal';
import { SourceFilter } from './SourceFilter';
import { filterData } from '../../lib/tableUtils';

interface GearTableGroupedProps {
  gear: Gear[];
}

interface GroupedGear {
  category: string;
  gear: Gear[];
  isExpanded: boolean;
}

export function GearTableGrouped({ gear }: GearTableGroupedProps) {
  const [selectedGear, setSelectedGear] = useState<Gear | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Filter gear by selected sources and search term
  const filteredGear = useMemo(() => {
    let filtered = gear;

    // Filter by source
    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => selectedSources.includes(item.source));
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filterData(filtered, searchTerm, {}, ['name', 'category', 'source']);
    }

    return filtered;
  }, [gear, selectedSources, searchTerm]);

  // Group gear by category
  const groupedGear = useMemo(() => {
    const groups = new Map<string, Gear[]>();
    
    filteredGear.forEach(item => {
      const category = item.category || 'Unknown';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(item);
    });

    // Convert to array and sort
    return Array.from(groups.entries())
      .map(([category, gear]) => ({
        category,
        gear: gear.sort((a, b) => a.name.localeCompare(b.name)),
        isExpanded: expandedGroups.has(category),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [filteredGear, expandedGroups]);

  // Auto-expand categories that have matching gear when searching
  useEffect(() => {
    if (searchTerm.trim()) {
      // Find categories that have matching gear
      const categoriesWithMatches = new Set<string>();
      filteredGear.forEach(item => {
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
  }, [searchTerm, filteredGear]);

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
    const allCategories = new Set(groupedGear.map(g => g.category));
    setExpandedGroups(allCategories);
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  const handleNameClick = (gearItem: Gear) => {
    setSelectedGear(gearItem);
    setIsModalOpen(true);
  };

  const totalGear = filteredGear.length;
  const totalGroups = groupedGear.length;

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <SourceFilter
            gear={gear}
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
              placeholder="Search gear by name, category, or source..."
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Source</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Page</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Rating</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Availability</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Cost</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Cost For</th>
              </tr>
            </thead>
            <tbody>
              {groupedGear.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    No gear found matching your criteria.
                  </td>
                </tr>
              ) : (
                groupedGear.map((group) => (
                  <React.Fragment key={group.category}>
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
                            {group.gear.length} {group.gear.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </td>
                      <td colSpan={6} className="px-4 py-3 text-sm text-gray-400">
                        Click to {group.isExpanded ? 'collapse' : 'expand'}
                      </td>
                    </tr>

                    {/* Group Gear Rows */}
                    {group.isExpanded && group.gear.map((item, index) => (
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
                        <td className="px-4 py-2 text-gray-300">{item.source || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{item.page || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{item.rating || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{item.avail || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{item.cost || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{item.costfor || '-'}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="px-4 py-3 bg-sr-darker border-t border-sr-light-gray text-sm text-gray-400">
          Showing {totalGear} {totalGear === 1 ? 'item' : 'items'} in {totalGroups} {totalGroups === 1 ? 'category' : 'categories'}
        </div>
      </div>

      <GearViewModal
        gear={selectedGear}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

