import { useState, useMemo, useEffect } from 'react';
import { Dialog, Modal, Heading, Button, Input, TextField } from 'react-aria-components';
import type { PriorityOption } from '../../lib/types';

interface MagicOption {
  id: string;
  name: string;
  priority: string;
  priorityOption: PriorityOption;
}

interface MagicResonanceSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  magicPriorities: Record<string, PriorityOption>;
  currentMagicType?: string;
  currentPriority?: string;
  onSelect: (magicType: string, priority: string) => void;
}

export function MagicResonanceSelectionModal({ 
  isOpen, 
  onOpenChange, 
  magicPriorities,
  currentMagicType,
  currentPriority,
  onSelect 
}: MagicResonanceSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState<MagicOption | null>(null);
  const [category, setCategory] = useState('Everything');

  // Build magic options from priority data, filtered by currentPriority if provided
  const magicOptions = useMemo(() => {
    const options: MagicOption[] = [];
    
    // If priority is provided, only show options for that priority
    if (currentPriority) {
      const priorityOption = magicPriorities[currentPriority];
      if (!priorityOption) {
        return options; // No options for this priority
      }
      
      // Add "None" option for Priority E (mundane)
      if (currentPriority === 'E') {
        options.push({
          id: 'none',
          name: 'None',
          priority: 'E',
          priorityOption: priorityOption,
        });
      } else {
        // Add available types for this priority
        if (priorityOption.available_types && priorityOption.available_types.length > 0) {
          priorityOption.available_types.forEach(type => {
            options.push({
              id: `${type.toLowerCase().replace(/\s+/g, '-')}-${currentPriority}`,
              name: type,
              priority: currentPriority,
              priorityOption: priorityOption,
            });
          });
        }
      }
    } else {
      // No priority selected - show all options (for reference)
      // Add "None" option for Priority E (mundane)
      if (magicPriorities['E']) {
        options.push({
          id: 'none',
          name: 'None',
          priority: 'E',
          priorityOption: magicPriorities['E'],
        });
      }

      // Extract unique magic types from all priorities
      const typeSet = new Set<string>();
      Object.values(magicPriorities).forEach(option => {
        if (option.available_types) {
          option.available_types.forEach(type => typeSet.add(type));
        }
      });

      // Create options for each type at each priority where it's available
      typeSet.forEach(type => {
        Object.entries(magicPriorities).forEach(([priority, option]) => {
          if (option.available_types?.includes(type)) {
            options.push({
              id: `${type.toLowerCase().replace(/\s+/g, '-')}-${priority}`,
              name: type,
              priority,
              priorityOption: option,
            });
          }
        });
      });
    }

    return options;
  }, [magicPriorities, currentPriority]);

  const filteredOptions = magicOptions.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Set initial selection based on current magic type and priority
  useEffect(() => {
    if (currentMagicType && currentPriority && magicOptions.length > 0) {
      const matching = magicOptions.find(
        opt => opt.name === currentMagicType && opt.priority === currentPriority
      );
      if (matching) {
        setSelectedOption(matching);
      }
    }
  }, [currentMagicType, currentPriority, magicOptions]);

  const formatPriorityBenefits = (option: PriorityOption): string[] => {
    const benefits: string[] = [];
    
    if (option.magic_rating !== undefined) {
      if (option.magic_rating === 0) {
        benefits.push('Mundane (no magic or resonance)');
      } else {
        const rating = option.magic_rating;
        const freeSpells = option.free_spells || 0;
        const freeSkills = option.label.includes('skill') ? 'with skills' : '';
        
        if (freeSpells > 0) {
          benefits.push(`Magic/Resonance ${rating}, ${freeSpells} free spells`);
        } else {
          benefits.push(`Magic/Resonance ${rating}`);
        }
      }
    }
    
    return benefits;
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={() => onOpenChange(false)} />
        <Dialog className="relative bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col outline-none">
          <Heading className="text-xl font-semibold text-gray-100 p-6 border-b border-sr-light-gray">
            Choose a magic or resonance option for your character
            {currentPriority && (
              <span className="text-sm font-normal text-gray-400 ml-2">(Priority {currentPriority})</span>
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
                  <span className="text-xs text-gray-400">(all {filteredOptions.length} items)</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {!currentPriority ? (
                  <div className="p-4 text-center text-gray-400">
                    <p className="text-sm">Please select a magic/resonance priority first.</p>
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    <p className="text-sm">No magic/resonance options available for Priority {currentPriority}.</p>
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedOption(option)}
                      className={`w-full text-left px-4 py-3 border-b border-sr-light-gray/50 hover:bg-sr-light-gray/30 transition-colors ${
                        selectedOption?.id === option.id
                          ? 'bg-sr-accent/20 border-l-4 border-l-sr-accent'
                          : ''
                      }`}
                    >
                      <span className="text-gray-100 font-medium">{option.name}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel - Details */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedOption ? (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-100">{selectedOption.name}</h3>
                  
                  {selectedOption.priorityOption.label && (
                    <div className="text-sm text-gray-300">
                      <strong className="text-gray-100">Priority {selectedOption.priority}:</strong> {selectedOption.priorityOption.label}
                    </div>
                  )}

                  {selectedOption.priorityOption.summary && (
                    <div className="text-sm text-gray-300">
                      {selectedOption.priorityOption.summary}
                    </div>
                  )}

                  {formatPriorityBenefits(selectedOption.priorityOption).length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-200 mb-2">Priority Benefits:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                        {formatPriorityBenefits(selectedOption.priorityOption).map((benefit, idx) => (
                          <li key={idx}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedOption.priorityOption.available_types && selectedOption.priorityOption.available_types.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-200 mb-2">Available Types:</h4>
                      <div className="text-sm text-gray-300">
                        {selectedOption.priorityOption.available_types.join(', ')}
                      </div>
                    </div>
                  )}

                  {selectedOption.priorityOption.description && (
                    <div className="text-sm text-gray-300">
                      {selectedOption.priorityOption.description}
                    </div>
                  )}

                  {/* Add type-specific descriptions based on name */}
                  {selectedOption.name === 'Magician' && (
                    <div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                        <li>Magicians can astrally perceive.</li>
                        <li>Magicians can astrally project.</li>
                        <li>Magicians can choose freely from the magical skills or skill groups (Sorcery, Conjuring, Enchanting).</li>
                        <li>Magicians can cast spells, conjure spirits, or enchant magical items.</li>
                        <li>At character creation, magicians who cast spells, perform rituals, or create alchemical preparations may know a maximum number of formulae from each group equal to their Magic Rating x 2 (i.e., Magic Rating of 4 allows 8 spells, 8 rituals, 8 alchemical preparations).</li>
                      </ul>
                    </div>
                  )}

                  {selectedOption.name === 'Adept' && (
                    <div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                        <li>Adepts can astrally perceive.</li>
                        <li>Adepts cannot astrally project.</li>
                        <li>Adepts use Power Points to purchase adept powers.</li>
                      </ul>
                    </div>
                  )}

                  {selectedOption.name === 'Mystic Adept' && (
                    <div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                        <li>Mystic Adepts can astrally perceive.</li>
                        <li>Mystic Adepts can astrally project.</li>
                        <li>Mystic Adepts can use both adept powers and magical skills.</li>
                      </ul>
                    </div>
                  )}

                  {selectedOption.name === 'Technomancer' && (
                    <div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                        <li>Technomancers can astrally perceive.</li>
                        <li>Technomancers cannot astrally project.</li>
                        <li>Technomancers use Resonance instead of Magic.</li>
                        <li>Technomancers can compile sprites, register sprites, and use complex forms.</li>
                      </ul>
                    </div>
                  )}

                  {selectedOption.name === 'None' && (
                    <div>
                      <p className="text-sm text-gray-300">
                        Mundane character with no magical or resonance abilities.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-12">
                  Select an option to view details
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
                if (selectedOption) {
                  onSelect(selectedOption.name, selectedOption.priority);
                }
              }}
              isDisabled={!selectedOption}
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

