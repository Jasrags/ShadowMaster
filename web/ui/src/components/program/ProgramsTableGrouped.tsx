import { useState, useMemo, memo, useCallback } from 'react';
import { Button } from 'react-aria-components';
import type { Program } from '../../lib/types';
import { ProgramViewModal } from './ProgramViewModal';
import { SourceFilter } from '../common/SourceFilter';
import { filterData } from '../../lib/tableUtils';

interface ProgramsTableGroupedProps {
  programs: Program[];
}


export const ProgramsTableGrouped = memo(function ProgramsTableGrouped({ programs }: ProgramsTableGroupedProps) {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());

  const filteredPrograms = useMemo(() => {
    let filtered = programs;

    if (selectedSources.length > 0) {
      filtered = filtered.filter(program => {
        const source = program.source?.source;
        return source && selectedSources.includes(source);
      });
    }

    if (searchTerm) {
      filtered = filterData(filtered, searchTerm, {}, ['name', 'type', 'description']);
    }

    return filtered;
  }, [programs, selectedSources, searchTerm]);

  const groupedPrograms = useMemo(() => {
    const typeMap = new Map<string, Program[]>();

    filteredPrograms.forEach(program => {
      const type = program.type || 'common';
      if (!typeMap.has(type)) {
        typeMap.set(type, []);
      }
      typeMap.get(type)!.push(program);
    });

    return Array.from(typeMap.entries())
      .map(([type, programs]) => ({
        type: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        programs: programs.sort((a, b) => (a.name || '').localeCompare(b.name || '')),
        isExpanded: expandedTypes.has(type),
      }))
      .sort((a, b) => a.type.localeCompare(b.type));
  }, [filteredPrograms, expandedTypes]);

  const toggleType = useCallback((type: string) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedTypes(newExpanded);
  }, [expandedTypes]);

  const handleNameClick = useCallback((program: Program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  }, []);

  return (
    <>
      <div className="space-y-4 mb-4">
        <SourceFilter
          items={programs}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          getSource={(item) => item.source?.source || ''}
        />
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent flex-1 max-w-md"
          />
        </div>
      </div>

      <div className="space-y-4">
        {groupedPrograms.map((group) => (
          <div key={group.type} className="bg-sr-dark border border-sr-light-gray rounded-lg overflow-hidden">
            <Button
              onPress={() => toggleType(group.type.toLowerCase().replace(' ', '_'))}
              className="w-full px-4 py-3 bg-sr-gray hover:bg-sr-light-gray border-b border-sr-light-gray flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{group.isExpanded ? '▼' : '▶'}</span>
                <span className="font-semibold text-gray-100">{group.type}</span>
                <span className="text-sm text-gray-400">({group.programs.length})</span>
              </div>
            </Button>
            {group.isExpanded && (
              <div className="p-4">
                <div className="space-y-2">
                  {group.programs.map((program) => (
                    <div
                      key={program.name}
                      className="flex items-center justify-between p-2 hover:bg-sr-light-gray rounded cursor-pointer"
                      onClick={() => handleNameClick(program)}
                    >
                      <div className="flex-1">
                        <div className="text-gray-100 font-medium">{program.name}</div>
                        {program.description && (
                          <div className="text-sm text-gray-400 mt-1 line-clamp-2">{program.description}</div>
                        )}
                      </div>
                      {program.source?.source && (
                        <div className="text-xs text-gray-500 ml-4">{program.source.source}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ProgramViewModal
        program={selectedProgram}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});

