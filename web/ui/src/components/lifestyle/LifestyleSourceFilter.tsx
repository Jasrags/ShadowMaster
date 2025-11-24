import { useState, useMemo, useRef, useEffect } from 'react';
import { Button, TextField, Input } from 'react-aria-components';
import type { Lifestyle } from '../../lib/types';

interface LifestyleSourceFilterProps {
  lifestyles: Lifestyle[];
  selectedSources: string[];
  onSourcesChange: (sources: string[]) => void;
}

export function LifestyleSourceFilter({ lifestyles, selectedSources, onSourcesChange }: LifestyleSourceFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Get all unique sources with counts
  const sourcesWithCounts = useMemo(() => {
    const sourceMap = new Map<string, number>();
    lifestyles.forEach(item => {
      const source = item.source || 'Unknown';
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    });
    
    return Array.from(sourceMap.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => a.source.localeCompare(b.source));
  }, [lifestyles]);

  // Filter sources based on search
  const filteredSources = useMemo(() => {
    if (!searchTerm) return sourcesWithCounts;
    const lowerSearch = searchTerm.toLowerCase();
    return sourcesWithCounts.filter(item => 
      item.source.toLowerCase().includes(lowerSearch)
    );
  }, [sourcesWithCounts, searchTerm]);

  const handleToggleSource = (source: string) => {
    if (selectedSources.includes(source)) {
      onSourcesChange(selectedSources.filter(s => s !== source));
    } else {
      onSourcesChange([...selectedSources, source]);
    }
  };

  const handleClearAll = () => {
    onSourcesChange([]);
    setSearchTerm('');
  };

  const handleSelectAll = () => {
    onSourcesChange(sourcesWithCounts.map(item => item.source));
  };

  return (
    <div className="space-y-3">
      {/* Source Filter Dropdown */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            ref={buttonRef}
            onPress={() => setIsOpen(!isOpen)}
            aria-label="Filter by source"
            aria-expanded={isOpen}
            className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-sm font-medium text-left flex items-center justify-between min-w-[200px]"
          >
            <span>
              {selectedSources.length === 0
                ? 'All Sources'
                : `${selectedSources.length} source${selectedSources.length === 1 ? '' : 's'} selected`}
            </span>
            <svg
              className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 mt-1 max-h-96 w-[300px] overflow-hidden rounded-md border border-sr-light-gray bg-sr-gray shadow-lg z-50"
            >
              <div className="p-2 border-b border-sr-light-gray">
                <TextField
                  value={searchTerm}
                  onChange={setSearchTerm}
                  className="flex flex-col gap-1"
                >
                  <Input
                    placeholder="Search sources..."
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-sm"
                    autoFocus
                  />
                </TextField>
                <div className="flex items-center justify-between mt-2">
                  <Button
                    onPress={handleSelectAll}
                    className="px-2 py-1 text-xs text-sr-accent hover:text-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent rounded"
                  >
                    Select All
                  </Button>
                  {selectedSources.length > 0 && (
                    <Button
                      onPress={handleClearAll}
                      className="px-2 py-1 text-xs text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sr-accent rounded"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
              <div className="p-1 max-h-64 overflow-auto">
                {filteredSources.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-400 text-center">
                    No sources found
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredSources.map(({ source, count }) => {
                      const isSelected = selectedSources.includes(source);
                      return (
                        <button
                          key={source}
                          onClick={() => handleToggleSource(source)}
                          className={`w-full px-3 py-2 rounded cursor-pointer text-gray-100 text-sm outline-none focus:bg-sr-light-gray hover:bg-sr-light-gray flex items-center justify-between text-left ${
                            isSelected ? 'bg-sr-light-gray/50' : ''
                          }`}
                        >
                          <span>{source}</span>
                          <span className="text-xs text-gray-400 ml-2">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Clear All Button */}
        {selectedSources.length > 0 && (
          <Button
            onPress={handleClearAll}
            className="px-3 py-2 bg-sr-light-gray border border-sr-light-gray rounded-md text-gray-300 hover:bg-sr-accent hover:text-sr-dark focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent text-sm font-medium transition-colors"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Selected Source Chips */}
      {selectedSources.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSources.map((source) => {
            const count = sourcesWithCounts.find(s => s.source === source)?.count || 0;
            return (
              <div
                key={source}
                className="inline-flex items-center gap-2 px-3 py-1 bg-sr-accent/20 border border-sr-accent/50 rounded-md text-sm"
              >
                <span className="text-gray-200">{source}</span>
                <span className="text-xs text-gray-400">({count})</span>
                <button
                  onClick={() => handleToggleSource(source)}
                  className="ml-1 text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent rounded"
                  aria-label={`Remove ${source} filter`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

