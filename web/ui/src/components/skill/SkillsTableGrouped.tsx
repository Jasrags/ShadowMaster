import { useState, useMemo } from 'react';
import type { Skill } from '../../lib/types';
import { SkillViewModal } from './SkillViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { GroupedTable, type GroupedTableColumn } from '../common/GroupedTable';

interface SkillsTableGroupedProps {
  skills: Skill[];
}

// Helper to format category name for display
const formatCategoryName = (category: string): string => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper to format type name for display
const formatTypeName = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Helper to format attribute name to Title Case
const formatAttributeName = (attribute: string): string => {
  if (!attribute || attribute === '-') return '-';
  return attribute.charAt(0).toUpperCase() + attribute.slice(1).toLowerCase();
};

export function SkillsTableGrouped({ skills }: SkillsTableGroupedProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Filter skills by selected sources
  const filteredSkills = useMemo(() => {
    if (selectedSources.length === 0) return skills;
    return skills.filter(item => {
      const skillSource = item.source?.source || 'Unknown';
      return selectedSources.includes(skillSource);
    });
  }, [skills, selectedSources]);

  const handleNameClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  // Helper to get group key (flatten nested grouping: Type - Category)
  const getGroupKey = (item: Skill): string => {
    const type = item.type || 'unknown';
    const category = item.category || 'unknown';
    return `${type} - ${category}`;
  };

  // Helper to get group label
  const getGroupLabel = (groupKey: string): string => {
    const [type, category] = groupKey.split(' - ');
    return `${formatTypeName(type)} - ${formatCategoryName(category)}`;
  };

  const columns: GroupedTableColumn<Skill>[] = [
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
      header: 'Attribute',
      accessor: (item) => formatAttributeName(item.linked_attribute || '-'),
    },
    {
      header: 'Default',
      accessor: (item) => item.can_default ? 'Yes' : 'No',
    },
    {
      header: 'Skill Group',
      accessor: (item) => item.skill_group || '-',
    },
    {
      header: 'Source',
      accessor: (item) => item.source?.source || '-',
    },
    {
      header: 'Page',
      accessor: (item) => item.source?.page || '-',
    },
  ];

  return (
    <>
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          <SourceFilter
            items={skills}
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
            getSource={(s) => s.source?.source || 'Unknown'}
          />
        </div>
      </div>

      <GroupedTable
        items={filteredSkills}
        getGroupKey={getGroupKey}
        getGroupLabel={getGroupLabel}
        columns={columns}
        searchFields={['name', 'category', 'linked_attribute', 'description']}
        searchPlaceholder="Search skills by name, category, attribute, or description..."
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

      <SkillViewModal
        skill={selectedSkill}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
