import { useState, useEffect } from 'react';
import { Dialog, Modal, Heading, Button, Input, TextField } from 'react-aria-components';
import type { MetatypeDefinition } from '../../lib/types';

interface MetatypeSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  metatypes: MetatypeDefinition[];
  currentMetatype?: string;
  priority?: string; // The selected metatype priority (A-E)
  onSelect: (metatype: MetatypeDefinition) => void;
}

export function MetatypeSelectionModal({ 
  isOpen, 
  onOpenChange, 
  metatypes, 
  currentMetatype,
  priority,
  onSelect 
}: MetatypeSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMetatype, setSelectedMetatype] = useState<MetatypeDefinition | null>(null);
  const [category, setCategory] = useState('Everything');

  // Filter metatypes by priority tier if priority is provided
  const availableMetatypes = priority
    ? metatypes.filter(m => m.priority_tiers.includes(priority))
    : metatypes;

  const filteredMetatypes = availableMetatypes.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find current metatype if provided and set as initial selection
  useEffect(() => {
    if (currentMetatype && availableMetatypes.length > 0) {
      const currentMetatypeData = availableMetatypes.find(
        m => m.id === currentMetatype || m.name.toLowerCase() === currentMetatype.toLowerCase()
      );
      if (currentMetatypeData) {
        setSelectedMetatype(currentMetatypeData);
      }
    }
  }, [currentMetatype, availableMetatypes]);

  const formatAttributeRange = (range?: { min?: number; max?: number } | { Min?: number; Max?: number }): string => {
    if (!range) return '1/6';
    // Handle both camelCase and PascalCase
    const min = (range as any).min ?? (range as any).Min ?? 1;
    const max = (range as any).max ?? (range as any).Max ?? 6;
    return `${min}/${max}`;
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={() => onOpenChange(false)} />
        <Dialog className="relative bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col outline-none">
          <Heading className="text-xl font-semibold text-gray-100 p-6 border-b border-sr-light-gray">
            Choose the metatype for your character
            {priority && (
              <span className="text-sm font-normal text-gray-400 ml-2">(Priority {priority})</span>
            )}
          </Heading>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Search and List */}
            <div className="w-1/3 border-r border-sr-light-gray flex flex-col">
              <div className="p-4 border-b border-sr-light-gray space-y-3">
                <TextField className="flex flex-col gap-1">
                  <Input
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Type here to search"
                    className="w-full px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent"
                  />
                </TextField>
                <div className="flex items-center gap-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-sr-accent"
                  >
                    <option>Everything</option>
                  </select>
                  <span className="text-xs text-gray-400">(all {filteredMetatypes.length} items)</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {!priority ? (
                  <div className="p-4 text-center text-gray-400">
                    <p className="text-sm">Please select a metatype priority first.</p>
                  </div>
                ) : filteredMetatypes.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    <p className="text-sm">No metatypes available for Priority {priority}.</p>
                  </div>
                ) : (
                  filteredMetatypes.map((metatype) => (
                    <button
                      key={metatype.id}
                      onClick={() => setSelectedMetatype(metatype)}
                      className={`w-full text-left px-4 py-3 border-b border-sr-light-gray/50 hover:bg-sr-light-gray/30 transition-colors ${
                        selectedMetatype?.id === metatype.id
                          ? 'bg-sr-accent/20 border-l-4 border-l-sr-accent'
                          : ''
                      }`}
                    >
                      <span className="text-gray-100 font-medium">{metatype.name}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel - Details */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedMetatype ? (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-100">{selectedMetatype.name}</h3>
                  
                  {selectedMetatype.special_attribute_points && priority && selectedMetatype.special_attribute_points[priority] !== undefined && (
                    <div>
                      <p className="text-sm text-gray-300">
                        <span className="font-semibold text-gray-200">Special attribute points:</span>{' '}
                        {selectedMetatype.special_attribute_points[priority]}
                      </p>
                    </div>
                  )}

                  {selectedMetatype.attribute_ranges && Object.keys(selectedMetatype.attribute_ranges).length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-200 mb-2">Attributes:</h4>
                      <div className="space-y-1 text-sm text-gray-300">
                        {Object.entries(selectedMetatype.attribute_ranges).map(([attr, range]) => {
                          const formatted = formatAttributeRange(range);
                          return (
                            <div key={attr} className="flex items-center gap-4">
                              <span className="capitalize w-24">{attr}:</span>
                              <span className="font-mono">{formatted}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedMetatype.abilities && selectedMetatype.abilities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-200 mb-2">Metatype Abilities:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                        {selectedMetatype.abilities.map((ability, idx) => (
                          <li key={idx}>{ability}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedMetatype.notes && (
                    <div className="text-sm text-gray-400 italic">
                      {selectedMetatype.notes}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-12">
                  Select a metatype to view details
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-sr-light-gray flex justify-end gap-3">
            <Button
              onPress={() => onOpenChange(false)}
              className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent transition-colors"
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                if (selectedMetatype) {
                  onSelect(selectedMetatype);
                }
              }}
              isDisabled={!selectedMetatype}
              className="px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select
            </Button>
          </div>
        </Dialog>
      </div>
    </Modal>
  );
}

