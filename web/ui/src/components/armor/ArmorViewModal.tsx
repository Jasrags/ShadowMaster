import { useState, type ReactNode } from 'react';
import type { Armor, Gear } from '../../lib/types';
import { GearViewModal } from '../gear/GearViewModal';
import { BonusDisplay } from '../gear/BonusDisplay';
import { formatCost } from '../../lib/formatUtils';
import { formatValue, formatArray, toReactNode } from '../../lib/viewModalUtils';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue, ArrayDisplay } from '../common/FieldDisplay';

interface ArmorViewModalProps {
  armor: Armor | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  gearMap: Map<string, Gear>;
}

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
    <ViewModal
      item={armor}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      maxWidth="4xl"
      nestedModals={
        <GearViewModal
          gear={selectedGear}
          isOpen={isGearModalOpen}
          onOpenChange={setIsGearModalOpen}
        />
      }
    >
      <div className="space-y-6">
        {/* Description */}
        {armor.description != null && (
          <Section title="Description">
            <p className="text-gray-300 leading-relaxed">{armor.description}</p>
          </Section>
        )}

        {/* Basic Information */}
        <Section title="Basic Information">
          <FieldGrid columns={2}>
            <LabelValue label="Name" value={armor.name} />
            <LabelValue label="Category" value={armor.category} />
            <LabelValue label="Source" value={armor.source} />
            {armor.requires != null && (
              <LabelValue label="Requires" value={armor.requires} />
            )}
          </FieldGrid>
        </Section>

        {/* Armor Stats */}
        <Section title="Armor Statistics">
          <FieldGrid columns={2}>
            <LabelValue label="Armor" value={formatValue(armor.armor)} />
            <LabelValue label="Armor Capacity" value={formatValue(armor.armorcapacity)} />
            <LabelValue label="Availability" value={formatValue(armor.avail)} />
            <LabelValue label="Cost" value={formatCost(armor.cost as string | undefined)} />
            {armor.rating !== undefined && armor.rating > 0 && (
              <LabelValue label="Rating" value={armor.rating} />
            )}
            {armor.max_rating !== undefined && armor.max_rating > 0 && (
              <LabelValue label="Max Rating" value={armor.max_rating} />
            )}
            {armor.armoroverride && (
              <LabelValue label="Armor Override" value={formatValue(armor.armoroverride)} />
            )}
          </FieldGrid>
        </Section>

        {/* Special Properties */}
        {armor.special_properties != null && typeof armor.special_properties === 'object' && (
          <Section title="Special Properties">
            <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
              <SpecialPropertiesDisplay properties={armor.special_properties as Record<string, unknown>} />
            </div>
          </Section>
        )}

        {/* Compatible With */}
        {armor.compatible_with && armor.compatible_with.length > 0 && (
          <Section title="Compatible With">
            <ArrayDisplay
              items={armor.compatible_with}
              itemClassName="px-3 py-1 bg-sr-light-gray/30 border border-sr-light-gray/50 rounded-md text-gray-300 text-sm"
            />
          </Section>
        )}

        {/* Modification Effects */}
        {armor.modification_effects != null && (
          <Section title="Modification Effects">
            <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
              <ModificationEffectsDisplay effects={armor.modification_effects} />
            </div>
          </Section>
        )}

        {/* Modifications */}
        {(armor.addmodcategory || armor.selectmodsfromcategory) && (
          <Section title="Modifications">
            <FieldGrid columns={2}>
              {armor.addmodcategory && (
                <LabelValue label="Add Mod Category" value={formatValue(armor.addmodcategory)} />
              )}
              {armor.selectmodsfromcategory && (
                <LabelValue label="Select Mods From Category" value={formatValue(armor.selectmodsfromcategory.category)} />
              )}
            </FieldGrid>
          </Section>
        )}

        {/* Gears */}
        {armor.gears?.usegear && armor.gears.usegear.length > 0 && (
          <Section title="Gears">
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
          </Section>
        )}

        {/* Weapon */}
        {armor.addweapon !== undefined && armor.addweapon !== null && armor.addweapon !== '' && (
          <Section title="Weapon">
            <p className="text-gray-100">{formatValue(armor.addweapon)}</p>
          </Section>
        )}

        {/* Mods */}
        {armor.mods?.name && (
          <Section title="Pre-installed Mods">
            <p className="text-gray-100">{formatArray(armor.mods.name)}</p>
          </Section>
        )}

        {/* Bonuses - only show if we don't have modification_effects (which is shown above) */}
        {armor.bonus !== undefined && armor.bonus !== null && !armor.modification_effects && (
          <BonusDisplay bonus={armor.bonus} title="Bonuses" />
        )}

        {/* Wireless Bonuses */}
        {armor.wirelessbonus != null && (
          <Section title="Wireless Bonuses">
            <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
              <WirelessBonusDisplay bonus={armor.wirelessbonus} />
            </div>
          </Section>
        )}
      </div>
    </ViewModal>
  );
}

