import { useState } from 'react';
import { Dialog, Modal, Heading, Button } from 'react-aria-components';
import type { Armor, Gear } from '../../lib/types';
import { GearViewModal } from '../gear/GearViewModal';
import { BonusDisplay } from '../gear/BonusDisplay';

interface ArmorViewModalProps {
  armor: Armor | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  gearMap: Map<string, Gear>;
}

// Helper function to format values for display
const formatValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

// Helper to format array values
const formatArray = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return String(formatValue(value));
};

export function ArmorViewModal({ armor, isOpen, onOpenChange, gearMap }: ArmorViewModalProps) {
  const [selectedGear, setSelectedGear] = useState<Gear | null>(null);
  const [isGearModalOpen, setIsGearModalOpen] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
  };

  // Helper to get gear by ID or name
  const getGearById = (idOrName: string): Gear | undefined => {
    // Try exact match first (for IDs like "concealable_holster")
    if (gearMap.has(idOrName)) {
      return gearMap.get(idOrName);
    }
    // Try lowercase match
    if (gearMap.has(idOrName.toLowerCase())) {
      return gearMap.get(idOrName.toLowerCase());
    }
    // Try matching by name (case-insensitive)
    for (const gear of gearMap.values()) {
      if (gear.name.toLowerCase() === idOrName.toLowerCase()) {
        return gear;
      }
    }
    return undefined;
  };

  const handleGearClick = (idOrName: string) => {
    const gear = getGearById(idOrName);
    if (gear) {
      setSelectedGear(gear);
      setIsGearModalOpen(true);
    }
  };

  if (!armor || !isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ zIndex: 50 }}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={handleClose} />
        <Dialog className="relative bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden outline-none flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-sr-light-gray">
            <Heading
              slot="title"
              className="text-2xl font-semibold text-gray-100"
            >
              {armor.name}
            </Heading>
            <Button
              onPress={handleClose}
              aria-label="Close armor view"
              className="p-2 text-gray-400 hover:text-gray-100 hover:bg-sr-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-sr-accent transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <section>
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Name</label>
                    <p className="text-gray-100 mt-1">{armor.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Category</label>
                    <p className="text-gray-100 mt-1">{armor.category}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Source</label>
                    <p className="text-gray-100 mt-1">{armor.source}</p>
                  </div>
                </div>
              </section>

              {/* Armor Stats */}
              <section>
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Armor Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Armor</label>
                    <p className="text-gray-100 mt-1">{formatValue(armor.armor)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Armor Capacity</label>
                    <p className="text-gray-100 mt-1">{formatValue(armor.armorcapacity)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Availability</label>
                    <p className="text-gray-100 mt-1">{formatValue(armor.avail)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Cost</label>
                    <p className="text-gray-100 mt-1">{formatValue(armor.cost)}</p>
                  </div>
                  {armor.rating !== undefined && (
                    <div>
                      <label className="text-sm text-gray-400">Rating</label>
                      <p className="text-gray-100 mt-1">{armor.rating}</p>
                    </div>
                  )}
                  {armor.armoroverride && (
                    <div>
                      <label className="text-sm text-gray-400">Armor Override</label>
                      <p className="text-gray-100 mt-1">{formatValue(armor.armoroverride)}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Modifications */}
              {(armor.addmodcategory || armor.selectmodsfromcategory) && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Modifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {armor.addmodcategory && (
                      <div>
                        <label className="text-sm text-gray-400">Add Mod Category</label>
                        <p className="text-gray-100 mt-1">{formatValue(armor.addmodcategory)}</p>
                      </div>
                    )}
                    {armor.selectmodsfromcategory && (
                      <div>
                        <label className="text-sm text-gray-400">Select Mods From Category</label>
                        <p className="text-gray-100 mt-1">{formatValue(armor.selectmodsfromcategory.category)}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Gears */}
              {armor.gears?.usegear && armor.gears.usegear.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Gears</h2>
                  <div className="flex flex-wrap gap-2">
                    {armor.gears.usegear.map((gearId, index) => {
                      const gear = getGearById(gearId);
                      const displayName = gear ? gear.name : gearId;
                      const isClickable = gear !== undefined;
                      
                      return isClickable ? (
                        <button
                          key={index}
                          onClick={() => handleGearClick(gearId)}
                          className="px-3 py-1 bg-sr-accent/20 border border-sr-accent/50 rounded-md text-sr-accent hover:bg-sr-accent/30 hover:border-sr-accent focus:outline-none focus:ring-2 focus:ring-sr-accent transition-colors text-sm"
                        >
                          {displayName}
                        </button>
                      ) : (
                        <span
                          key={index}
                          className="px-3 py-1 bg-sr-light-gray/30 border border-sr-light-gray/50 rounded-md text-gray-300 text-sm"
                        >
                          {displayName}
                        </span>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Weapon */}
              {armor.addweapon !== undefined && armor.addweapon !== null && armor.addweapon !== '' && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Weapon</h2>
                  <p className="text-gray-100">{String(formatValue(armor.addweapon))}</p>
                </section>
              )}

              {/* Mods */}
              {armor.mods?.name && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Pre-installed Mods</h2>
                  <p className="text-gray-100">{String(formatArray(armor.mods.name))}</p>
                </section>
              )}

              {/* Bonuses */}
              {armor.bonus !== undefined && armor.bonus !== null && (
                <BonusDisplay bonus={armor.bonus} title="Bonuses" />
              )}

              {/* Wireless Bonuses */}
              {armor.wirelessbonus !== undefined && armor.wirelessbonus !== null && (
                <BonusDisplay bonus={armor.wirelessbonus} title="Wireless Bonuses" />
              )}
            </div>
          </div>

          <div className="p-6 border-t border-sr-light-gray flex justify-end">
            <Button
              onPress={handleClose}
              className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors"
            >
              Close
            </Button>
          </div>
        </Dialog>
      </div>
      <GearViewModal
        gear={selectedGear}
        isOpen={isGearModalOpen}
        onOpenChange={setIsGearModalOpen}
      />
    </Modal>
  );
}

