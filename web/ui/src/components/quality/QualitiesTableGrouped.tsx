import { useState, useMemo, useEffect, Fragment } from 'react';
import { Button } from 'react-aria-components';
import type { Quality } from '../../lib/types';
import { QualityViewModal } from './QualityViewModal';
import { QualitySourceFilter } from './QualitySourceFilter';
import { filterData } from '../../lib/tableUtils';

interface QualitiesTableGroupedProps {
  qualities: Quality[];
}

// GroupedQualities interface removed - unused

export function QualitiesTableGrouped({ qualities }: QualitiesTableGroupedProps) {
  const [selectedQuality, setSelectedQuality] = useState<Quality | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Helper to get category from type
  const getCategory = (quality: Quality): string => {
    return quality.type === 'positive' ? 'Positive' : 'Negative';
  };

  // Helper to get source string
  const getSource = (quality: Quality): string => {
    return quality.source?.source || 'Unknown';
  };

  // Helper to format karma cost
  const formatKarma = (quality: Quality): string => {
    const cost = quality.cost;
    if (cost.per_rating) {
      if (cost.max_rating > 0) {
        return `${cost.base_cost} per rating (max ${cost.max_rating})`;
      }
      return `${cost.base_cost} per rating`;
    }
    return `${cost.base_cost}`;
  };

  // Filter qualities by selected sources and search term
  const filteredQualities = useMemo(() => {
    let filtered = qualities;

    // Filter by source
    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => {
        const source = getSource(item);
        return selectedSources.includes(source);
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filterData(filtered, searchTerm, {}, ['name']);
    }

    return filtered;
  }, [qualities, selectedSources, searchTerm]);

  // Group qualities by category
  const groupedQualities = useMemo(() => {
    const groups = new Map<string, Quality[]>();
    
    filteredQualities.forEach(item => {
      const category = getCategory(item);
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(item);
    });

    // Convert to array and sort
    return Array.from(groups.entries())
      .map(([category, qualities]) => ({
        category,
        qualities: qualities.sort((a, b) => a.name.localeCompare(b.name)),
        isExpanded: expandedGroups.has(category),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [filteredQualities, expandedGroups]);

  // Auto-expand categories that have matching qualities when searching
  useEffect(() => {
    if (searchTerm.trim()) {
      // Find categories that have matching qualities
      const categoriesWithMatches = new Set<string>();
      filteredQualities.forEach(item => {
        const category = getCategory(item);
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
  }, [searchTerm, filteredQualities]);

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
    const allCategories = new Set(groupedQualities.map(g => g.category));
    setExpandedGroups(allCategories);
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  const handleNameClick = (quality: Quality) => {
    setSelectedQuality(quality);
    setIsModalOpen(true);
  };

  const totalQualities = filteredQualities.length;
  const totalGroups = groupedQualities.length;

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <QualitySourceFilter
            qualities={qualities}
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
              placeholder="Search qualities by name, category, or source..."
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Karma</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Source</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Page</th>
              </tr>
            </thead>
            <tbody>
              {groupedQualities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No qualities found matching your criteria.
                  </td>
                </tr>
              ) : (
                groupedQualities.map((group) => (
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
                          <span className={`font-semibold px-2 py-1 rounded text-sm ${
                            group.category === 'Positive' 
                              ? 'bg-green-900/30 text-green-300' 
                              : 'bg-red-900/30 text-red-300'
                          }`}>
                            {group.category}
                          </span>
                          <span className="text-xs text-gray-400 bg-sr-gray px-2 py-1 rounded">
                            {group.qualities.length} {group.qualities.length === 1 ? 'quality' : 'qualities'}
                          </span>
                        </div>
                      </td>
                      <td colSpan={3} className="px-4 py-3 text-sm text-gray-400">
                        Click to {group.isExpanded ? 'collapse' : 'expand'}
                      </td>
                    </tr>

                    {/* Group Qualities Rows */}
                    {group.isExpanded && group.qualities.map((quality, index) => (
                      <tr
                        key={`${group.category}-${quality.name}-${index}`}
                        className="border-b border-sr-light-gray/50 hover:bg-sr-light-gray/20 transition-colors"
                      >
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleNameClick(quality)}
                            className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left pl-4"
                          >
                            {quality.name}
                          </button>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`font-semibold ${
                            quality.cost.base_cost < 0 ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {formatKarma(quality)}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-300">{getSource(quality)}</td>
                        <td className="px-4 py-2 text-gray-300">{quality.source?.page || '-'}</td>
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
          Showing {totalQualities} {totalQualities === 1 ? 'quality' : 'qualities'} in {totalGroups} {totalGroups === 1 ? 'category' : 'categories'}
        </div>
      </div>

      <QualityViewModal
        quality={selectedQuality}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

