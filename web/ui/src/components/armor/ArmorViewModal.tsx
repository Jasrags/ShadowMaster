import { useState, type ReactNode } from 'react';
import { Dialog, Modal, Heading, Button } from 'react-aria-components';
import type { Armor, Gear } from '../../lib/types';
import { GearViewModal } from '../gear/GearViewModal';
import { BonusDisplay } from '../gear/BonusDisplay';
import { formatCost } from '../../lib/formatUtils';

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

// Helper function to safely convert unknown to ReactNode
const toReactNode = (value: unknown): ReactNode => {
  if (value === null || value === undefined) return null;
  return String(value);
};

// Helper to format array values
const formatArray = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return String(formatValue(value));
};

// Component to display special properties
function SpecialPropertiesDisplay({ properties }: { properties: unknown }): ReactNode {
  if (!properties || typeof properties !== 'object') {
    return null;
  }

  const props = properties as Record<string, unknown>;
  const items: ReactNode[] = [];

  if (props.concealability_modifier !== undefined) {
    items.push(
      <div key="concealability">
        <span className="text-gray-400">Concealability Modifier:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.concealability_modifier)}</span>
      </div>
    );
  }

  if (props.sneaking_bonus !== undefined && Number(props.sneaking_bonus) > 0) {
    items.push(
      <div key="sneaking">
        <span className="text-gray-400">Sneaking Bonus:</span>{' '}
        <span className="text-green-400">+{toReactNode(props.sneaking_bonus)}</span>
      </div>
    );
  }

  if (props.built_in_features && Array.isArray(props.built_in_features) && props.built_in_features.length > 0) {
    items.push(
      <div key="features">
        <span className="text-gray-400">Built-in Features:</span>{' '}
        <span className="text-gray-200">{formatArray(props.built_in_features)}</span>
      </div>
    );
  }

  if (props.physical_limit_modifier !== undefined) {
    items.push(
      <div key="physlimit">
        <span className="text-gray-400">Physical Limit Modifier:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.physical_limit_modifier)}</span>
      </div>
    );
  }

  if (props.environmental_adaptation === true) {
    items.push(
      <div key="envadapt">
        <span className="text-gray-400">Environmental Adaptation:</span>{' '}
        <span className="text-gray-200">Yes</span>
      </div>
    );
  }

  if (props.chemically_sealable === true) {
    items.push(
      <div key="chemseal">
        <span className="text-gray-400">Chemically Sealable:</span>{' '}
        <span className="text-gray-200">Yes</span>
      </div>
    );
  }

  if (props.color_changeable === true) {
    items.push(
      <div key="color">
        <span className="text-gray-400">Color Changeable:</span>{' '}
        <span className="text-gray-200">Yes</span>
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-gray-400 text-sm">No special properties</p>;
  }

  return <div className="space-y-2">{items}</div>;
}

// Component to display modification effects
function ModificationEffectsDisplay({ effects }: { effects: unknown }) {
  if (!effects) {
    return null;
  }

  const effectsArray = Array.isArray(effects) ? effects : [effects];
  const validEffects = effectsArray.filter((e): e is Record<string, unknown> => 
    e !== null && typeof e === 'object'
  );

  if (validEffects.length === 0) {
    return <p className="text-gray-400 text-sm">No modification effects</p>;
  }

  return (
    <div className="space-y-4">
      {validEffects.map((effect, idx) => (
        <div key={idx} className="border-b border-sr-light-gray/30 pb-3 last:border-0 last:pb-0">
          {effect.type != null && (
            <div className="mb-2">
              <span className="text-sm font-semibold text-gray-300">Type: </span>
              <span className="text-gray-200">{toReactNode(effect.type)}</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {effect.armor_bonus !== undefined && Number(effect.armor_bonus) !== 0 && (
              <div>
                <span className="text-gray-400">Armor Bonus:</span>{' '}
                {Number(effect.armor_bonus) > 0 ? (
                  <span className="text-green-400">+{String(effect.armor_bonus)}</span>
                ) : (
                  <span className="text-gray-300">Rating-based</span>
                )}
              </div>
            )}
            {effect.resistance_test_bonus !== undefined && (
              <div>
                <span className="text-gray-400">Resistance Test Bonus:</span>{' '}
                {Number(effect.resistance_test_bonus) > 0 ? (
                  <span className="text-green-400">+{String(effect.resistance_test_bonus)}</span>
                ) : (
                  <span className="text-gray-300">Rating-based</span>
                )}
                {effect.test_type != null && (
                  <span className="text-gray-400 ml-1">({toReactNode(effect.test_type)})</span>
                )}
              </div>
            )}
            {effect.limit_bonus !== undefined && Number(effect.limit_bonus) !== 0 && (
              <div>
                <span className="text-gray-400">Limit Bonus:</span>{' '}
                {Number(effect.limit_bonus) > 0 ? (
                  <span className="text-green-400">+{String(effect.limit_bonus)}</span>
                ) : (
                  <span className="text-gray-300">Rating-based</span>
                )}
                {effect.test_type != null && (
                  <span className="text-gray-400 ml-1">({toReactNode(effect.test_type)})</span>
                )}
              </div>
            )}
            {effect.dice_pool_bonus !== undefined && Number(effect.dice_pool_bonus) !== 0 && (
              <div>
                <span className="text-gray-400">Dice Pool Bonus:</span>{' '}
                {Number(effect.dice_pool_bonus) > 0 ? (
                  <span className="text-green-400">+{String(effect.dice_pool_bonus)}</span>
                ) : (
                  <span className="text-gray-300">Rating-based</span>
                )}
                {effect.test_type != null && (
                  <span className="text-gray-400 ml-1">({toReactNode(effect.test_type)})</span>
                )}
              </div>
            )}
            {effect.test_type != null && !effect.resistance_test_bonus && !effect.limit_bonus && !effect.dice_pool_bonus && (
              <div>
                <span className="text-gray-400">Test Type:</span>{' '}
                <span className="text-gray-200">{toReactNode(effect.test_type)}</span>
              </div>
            )}
            {effect.complete_protection === true && (
              <div>
                <span className="text-gray-400">Complete Protection:</span>{' '}
                <span className="text-green-400">Yes</span>
              </div>
            )}
            {effect.duration_limit != null && (
              <div>
                <span className="text-gray-400">Duration:</span>{' '}
                <span className="text-gray-200">{toReactNode(effect.duration_limit)}</span>
              </div>
            )}
            {effect.activation_action != null && (
              <div>
                <span className="text-gray-400">Activation:</span>{' '}
                <span className="text-gray-200">{toReactNode(effect.activation_action)}</span>
              </div>
            )}
            {effect.damage_info != null && (
              <div>
                <span className="text-gray-400">Damage:</span>{' '}
                <span className="text-gray-200">{toReactNode(effect.damage_info)}</span>
              </div>
            )}
            {effect.charges != null && (
              <div>
                <span className="text-gray-400">Charges:</span>{' '}
                <span className="text-gray-200">{toReactNode(effect.charges)}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Component to display wireless bonuses
function WirelessBonusDisplay({ bonus }: { bonus: unknown }): ReactNode {
  if (!bonus || typeof bonus !== 'object') {
    return <p className="text-gray-400 text-sm">No wireless bonuses</p>;
  }

  const bonusObj = bonus as Record<string, unknown>;
  const items: ReactNode[] = [];

  // Description (usually the main text)
  if (bonusObj.description) {
    items.push(
      <div key="description" className="mb-3 pb-3 border-b border-sr-light-gray/30">
        <p className="text-gray-200 text-sm leading-relaxed">{toReactNode(bonusObj.description)}</p>
      </div>
    );
  }

  // Action Change
  if (bonusObj.action_change) {
    items.push(
      <div key="action_change">
        <span className="text-gray-400 text-sm">Action Change:</span>{' '}
        <span className="text-gray-200 text-sm">{toReactNode(bonusObj.action_change)}</span>
      </div>
    );
  }

  // Dice Pool Bonus
  if (bonusObj.dice_pool_bonus !== undefined) {
    const bonusValue = Number(bonusObj.dice_pool_bonus);
    if (bonusValue > 0) {
      items.push(
        <div key="dice_pool">
          <span className="text-gray-400 text-sm">Dice Pool Bonus:</span>{' '}
          <span className="text-green-400 text-sm">+{bonusValue}</span>
        </div>
      );
    } else if (bonusValue === 0) {
      items.push(
        <div key="dice_pool">
          <span className="text-gray-400 text-sm">Dice Pool Bonus:</span>{' '}
          <span className="text-gray-300 text-sm">Rating-based</span>
        </div>
      );
    }
  }

  // Limit Bonus
  if (bonusObj.limit_bonus !== undefined) {
    const bonusValue = Number(bonusObj.limit_bonus);
    if (bonusValue > 0) {
      items.push(
        <div key="limit">
          <span className="text-gray-400 text-sm">Limit Bonus:</span>{' '}
          <span className="text-green-400 text-sm">+{bonusValue}</span>
        </div>
      );
    } else if (bonusValue === 0) {
      items.push(
        <div key="limit">
          <span className="text-gray-400 text-sm">Limit Bonus:</span>{' '}
          <span className="text-gray-300 text-sm">Rating-based</span>
        </div>
      );
    }
  }

  // Rating Bonus
  if (bonusObj.rating_bonus !== undefined) {
    const bonusValue = Number(bonusObj.rating_bonus);
    if (bonusValue > 0) {
      items.push(
        <div key="rating">
          <span className="text-gray-400 text-sm">Rating Bonus:</span>{' '}
          <span className="text-green-400 text-sm">+{bonusValue}</span>
        </div>
      );
    }
  }

  // Skill Substitution
  if (bonusObj.skill_substitution) {
    items.push(
      <div key="skill_sub">
        <span className="text-gray-400 text-sm">Skill Substitution:</span>{' '}
        <span className="text-gray-200 text-sm">{toReactNode(bonusObj.skill_substitution)}</span>
      </div>
    );
  }

  // Range Change
  if (bonusObj.range_change) {
    items.push(
      <div key="range">
        <span className="text-gray-400 text-sm">Range Change:</span>{' '}
        <span className="text-gray-200 text-sm">{toReactNode(bonusObj.range_change)}</span>
      </div>
    );
  }

  // Other Effects
  if (bonusObj.other_effects) {
    items.push(
      <div key="other">
        <span className="text-gray-400 text-sm">Other Effects:</span>{' '}
        <span className="text-gray-200 text-sm">{toReactNode(bonusObj.other_effects)}</span>
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-gray-400 text-sm">No wireless bonuses</p>;
  }

  return <div className="space-y-2">{items}</div>;
}

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
              {/* Description */}
              {armor.description != null && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Description</h2>
                  <p className="text-gray-300 leading-relaxed">{armor.description}</p>
                </section>
              )}

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
                  {armor.requires != null && (
                    <div>
                      <label className="text-sm text-gray-400">Requires</label>
                      <p className="text-gray-100 mt-1">{armor.requires}</p>
                    </div>
                  )}
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
                    <p className="text-gray-100 mt-1">{formatCost(armor.cost as string | undefined)}</p>
                  </div>
                  {armor.rating !== undefined && armor.rating > 0 && (
                    <div>
                      <label className="text-sm text-gray-400">Rating</label>
                      <p className="text-gray-100 mt-1">{armor.rating}</p>
                    </div>
                  )}
                  {armor.max_rating !== undefined && armor.max_rating > 0 && (
                    <div>
                      <label className="text-sm text-gray-400">Max Rating</label>
                      <p className="text-gray-100 mt-1">{armor.max_rating}</p>
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

              {/* Special Properties */}
              {armor.special_properties && typeof armor.special_properties === 'object' && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Special Properties</h2>
                  <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
                    <SpecialPropertiesDisplay properties={armor.special_properties} />
                  </div>
                </section>
              )}

              {/* Compatible With */}
              {armor.compatible_with && armor.compatible_with.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Compatible With</h2>
                  <div className="flex flex-wrap gap-2">
                    {armor.compatible_with.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-sr-light-gray/30 border border-sr-light-gray/50 rounded-md text-gray-300 text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Modification Effects */}
              {armor.modification_effects && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Modification Effects</h2>
                  <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
                    <ModificationEffectsDisplay effects={armor.modification_effects} />
                  </div>
                </section>
              )}

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
                  <p className="text-gray-100">{formatValue(armor.addweapon)}</p>
                </section>
              )}

              {/* Mods */}
              {armor.mods?.name && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Pre-installed Mods</h2>
                  <p className="text-gray-100">{formatArray(armor.mods.name)}</p>
                </section>
              )}

              {/* Bonuses - only show if we don't have modification_effects (which is shown above) */}
              {armor.bonus !== undefined && armor.bonus !== null && !armor.modification_effects && (
                <BonusDisplay bonus={armor.bonus} title="Bonuses" />
              )}

              {/* Wireless Bonuses */}
              {armor.wirelessbonus !== undefined && armor.wirelessbonus !== null && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Wireless Bonuses</h2>
                  <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
                    <WirelessBonusDisplay bonus={armor.wirelessbonus} />
                  </div>
                </section>
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

