import { useState, useMemo, useEffect } from 'react';
import { Button } from 'react-aria-components';
import type { Skill } from '../../lib/types';
import { SkillViewModal } from './SkillViewModal';
import { SkillSourceFilter } from './SkillSourceFilter';
import { filterData } from '../../lib/tableUtils';

interface SkillsTableGroupedProps {
  skills: Skill[];
}

interface GroupedSkills {
  category: string;
  skills: Skill[];
  isExpanded: boolean;
}

export function SkillsTableGrouped({ skills }: SkillsTableGroupedProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Filter skills by selected sources and search term
  const filteredSkills = useMemo(() => {
    let filtered = skills;

    // Filter by source
    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => {
        const skillSource = item.source || 'Unknown';
        return selectedSources.includes(skillSource);
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filterData(filtered, searchTerm, {}, ['name', 'category', 'attribute', 'source']);
    }

    return filtered;
  }, [skills, selectedSources, searchTerm]);

  // Group skills by category
  const groupedSkills = useMemo(() => {
    const groups = new Map<string, Skill[]>();
    
    filteredSkills.forEach(skill => {
      const category = skill.category || 'Unknown';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(skill);
    });

    // Convert to array and sort
    return Array.from(groups.entries())
      .map(([category, skills]) => ({
        category,
        skills: skills.sort((a, b) => a.name.localeCompare(b.name)),
        isExpanded: expandedGroups.has(category),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [filteredSkills, expandedGroups]);

  // Auto-expand categories that have matching skills when searching
  useEffect(() => {
    if (searchTerm.trim()) {
      // Find categories that have matching skills
      const categoriesWithMatches = new Set<string>();
      filteredSkills.forEach(skill => {
        const category = skill.category || 'Unknown';
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
    } else {
      // When search is cleared, don't auto-expand (but keep manually expanded ones)
      // This allows users to keep their manual expansion state
    }
  }, [searchTerm, filteredSkills]);

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
    const allCategories = new Set(groupedSkills.map(g => g.category));
    setExpandedGroups(allCategories);
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  const handleNameClick = (skillItem: Skill) => {
    setSelectedSkill(skillItem);
    setIsModalOpen(true);
  };

  const totalSkills = filteredSkills.length;
  const totalGroups = groupedSkills.length;

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <SkillSourceFilter
            skills={skills}
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
              placeholder="Search skills by name, category, attribute, or source..."
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Attribute</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Default</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Skill Group</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Source</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Page</th>
              </tr>
            </thead>
            <tbody>
              {groupedSkills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No skills found matching your criteria.
                  </td>
                </tr>
              ) : (
                groupedSkills.map((group) => (
                  <>
                    {/* Group Header Row */}
                    <tr
                      key={group.category}
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
                            {group.skills.length} {group.skills.length === 1 ? 'skill' : 'skills'}
                          </span>
                        </div>
                      </td>
                      <td colSpan={5} className="px-4 py-3 text-sm text-gray-400">
                        Click to {group.isExpanded ? 'collapse' : 'expand'}
                      </td>
                    </tr>

                    {/* Group Skills Rows */}
                    {group.isExpanded && group.skills.map((skill, index) => (
                      <tr
                        key={`${group.category}-${skill.name}-${index}`}
                        className="border-b border-sr-light-gray/50 hover:bg-sr-light-gray/20 transition-colors"
                      >
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleNameClick(skill)}
                            className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left pl-4"
                          >
                            {skill.name}
                          </button>
                        </td>
                        <td className="px-4 py-2 text-gray-300">{skill.attribute || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{skill.default || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{skill.skillgroup || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{skill.source || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{skill.page || '-'}</td>
                      </tr>
                    ))}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="px-4 py-3 bg-sr-darker border-t border-sr-light-gray text-sm text-gray-400">
          Showing {totalSkills} {totalSkills === 1 ? 'skill' : 'skills'} in {totalGroups} {totalGroups === 1 ? 'category' : 'categories'}
        </div>
      </div>

      <SkillViewModal
        skill={selectedSkill}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

