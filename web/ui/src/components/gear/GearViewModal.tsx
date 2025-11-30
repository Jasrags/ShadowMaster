import type { Gear } from '../../lib/types';
import { RequirementsDisplay } from './RequirementsDisplay';
import { BonusDisplay } from './BonusDisplay';
import { getCategoryDisplayName } from './categoryUtils';
import { formatCost } from '../../lib/formatUtils';
import { formatValue, formatArray } from '../../lib/viewModalUtils';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue } from '../common/FieldDisplay';

interface GearViewModalProps {
  gear: Gear | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function GearViewModal({ gear, isOpen, onOpenChange }: GearViewModalProps) {
  if (!gear || !isOpen) {
    return null;
  }

  return (
    <ViewModal
      item={gear}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Description */}
        {gear.description && (
          <Section title="Description">
            <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
              <p className="text-gray-200 text-sm whitespace-pre-wrap">{gear.description}</p>
            </div>
          </Section>
        )}

        {/* Basic Information */}
        <Section title="Basic Information">
          <FieldGrid columns={2}>
            <LabelValue label="Name" value={gear.name} />
            <LabelValue label="Category" value={getCategoryDisplayName(gear.category)} />
            {gear.subcategory && (
              <LabelValue label="Subcategory" value={gear.subcategory} />
            )}
            <LabelValue
              label="Source"
              value={typeof gear.source === 'string' ? gear.source : gear.source?.source || '-'}
            />
            {(gear.page || (typeof gear.source === 'object' && gear.source?.page)) && (
              <LabelValue
                label="Page"
                value={gear.page || (typeof gear.source === 'object' ? gear.source?.page : '-')}
              />
            )}
          </FieldGrid>
        </Section>

        {/* Stats */}
        {(gear.rating !== undefined || gear.availability || gear.cost !== undefined || gear.avail || gear.costfor || gear.device_rating || gear.device_type) && (
          <Section title="Statistics">
            <FieldGrid columns={2}>
              {gear.rating !== undefined && (
                <LabelValue label="Rating" value={gear.rating} />
              )}
              {gear.device_type && (
                <LabelValue label="Device Type" value={gear.device_type} />
              )}
              {gear.device_rating !== undefined && (
                <LabelValue label="Device Rating" value={gear.device_rating} />
              )}
              {(gear.availability || gear.avail) && (
                <LabelValue label="Availability" value={gear.availability || gear.avail} />
              )}
              {gear.cost !== undefined && (
                <LabelValue
                  label="Cost"
                  value={gear.cost_per_rating ? `${formatCost(String(gear.cost))} per rating` : formatCost(String(gear.cost))}
                />
              )}
              {gear.costfor && (
                <LabelValue label="Cost For" value={gear.costfor} />
              )}
            </FieldGrid>
          </Section>
        )}

        {/* Mechanical Effects */}
        {gear.mechanical_effects && (
          <Section title="Mechanical Effects">
            <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
              <FieldGrid columns={2}>
                {gear.mechanical_effects.dice_pool_bonus !== undefined && (
                  <LabelValue
                    label="Dice Pool Bonus"
                    value={
                      <>
                        {gear.mechanical_effects.dice_pool_bonus > 0 ? '+' : ''}{gear.mechanical_effects.dice_pool_bonus}
                        {gear.mechanical_effects.test_type && ` to ${gear.mechanical_effects.test_type}`}
                      </>
                    }
                  />
                )}
                {gear.mechanical_effects.limit_bonus !== undefined && (
                  <LabelValue
                    label="Limit Bonus"
                    value={
                      <>
                        {gear.mechanical_effects.limit_bonus > 0 ? '+' : ''}{gear.mechanical_effects.limit_bonus}
                        {gear.mechanical_effects.test_type && ` to ${gear.mechanical_effects.test_type}`}
                      </>
                    }
                  />
                )}
                {gear.mechanical_effects.rating_bonus !== undefined && (
                  <LabelValue label="Rating Bonus" value={`+${gear.mechanical_effects.rating_bonus}`} />
                )}
                {gear.mechanical_effects.perception_penalty !== undefined && (
                  <LabelValue
                    label="Perception Penalty"
                    value={<span className="text-red-400">{gear.mechanical_effects.perception_penalty}</span>}
                  />
                )}
                {gear.mechanical_effects.noise_reduction !== undefined && (
                  <LabelValue label="Noise Reduction" value={gear.mechanical_effects.noise_reduction} />
                )}
                {gear.mechanical_effects.damage_value && (
                  <LabelValue label="Damage Value" value={gear.mechanical_effects.damage_value} />
                )}
                {gear.mechanical_effects.range && (
                  <LabelValue label="Range" value={gear.mechanical_effects.range} />
                )}
                {gear.mechanical_effects.duration && (
                  <LabelValue label="Duration" value={gear.mechanical_effects.duration} />
                )}
                {gear.mechanical_effects.charges && (
                  <LabelValue label="Charges" value={gear.mechanical_effects.charges} />
                )}
                {gear.mechanical_effects.other_effects && (
                  <div className="md:col-span-2">
                    <LabelValue label="Other Effects" value={gear.mechanical_effects.other_effects} />
                  </div>
                )}
              </FieldGrid>
            </div>
          </Section>
        )}

        {/* Special Properties */}
        {gear.special_properties && (
          <Section title="Special Properties">
            <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
              <FieldGrid columns={2}>
                {gear.special_properties.concealability_modifier !== undefined && (
                  <LabelValue
                    label="Concealability Modifier"
                    value={`${gear.special_properties.concealability_modifier > 0 ? '+' : ''}${gear.special_properties.concealability_modifier}`}
                  />
                )}
                {gear.special_properties.capacity !== undefined && (
                  <LabelValue label="Capacity" value={gear.special_properties.capacity} />
                )}
                {gear.special_properties.max_rating !== undefined && (
                  <LabelValue label="Max Rating" value={gear.special_properties.max_rating} />
                )}
                {gear.special_properties.size && (
                  <LabelValue label="Size" value={gear.special_properties.size} />
                )}
                {gear.special_properties.compatible_with && gear.special_properties.compatible_with.length > 0 && (
                  <LabelValue
                    label="Compatible With"
                    value={gear.special_properties.compatible_with.join(', ')}
                  />
                )}
                {gear.special_properties.requires && gear.special_properties.requires.length > 0 && (
                  <LabelValue
                    label="Requires"
                    value={gear.special_properties.requires.join(', ')}
                  />
                )}
                {gear.special_properties.optical_only && (
                  <LabelValue label="Optical Only" value="Yes" />
                )}
                {gear.special_properties.wireless_required && (
                  <LabelValue label="Wireless Required" value="Yes" />
                )}
                {gear.special_properties.no_wireless_capability && (
                  <LabelValue label="No Wireless Capability" value="Yes" />
                )}
                {gear.special_properties.emp_hardened && (
                  <LabelValue label="EMP Hardened" value="Yes" />
                )}
              </FieldGrid>
            </div>
          </Section>
        )}

        {/* Wireless Bonus */}
        {gear.wireless_bonus && (
          <Section title="Wireless Bonus">
            <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
              {gear.wireless_bonus.description && (
                <p className="text-gray-200 text-sm mb-3">{gear.wireless_bonus.description}</p>
              )}
              <FieldGrid columns={2}>
                {gear.wireless_bonus.action_change && (
                  <LabelValue label="Action Change" value={gear.wireless_bonus.action_change} />
                )}
                {gear.wireless_bonus.dice_pool_bonus !== undefined && (
                  <LabelValue
                    label="Dice Pool Bonus"
                    value={<span className="text-green-400">+{gear.wireless_bonus.dice_pool_bonus}</span>}
                  />
                )}
                {gear.wireless_bonus.limit_bonus !== undefined && (
                  <LabelValue
                    label="Limit Bonus"
                    value={<span className="text-green-400">+{gear.wireless_bonus.limit_bonus}</span>}
                  />
                )}
                {gear.wireless_bonus.rating_bonus !== undefined && (
                  <LabelValue
                    label="Rating Bonus"
                    value={<span className="text-green-400">+{gear.wireless_bonus.rating_bonus}</span>}
                  />
                )}
                {gear.wireless_bonus.range_change && (
                  <LabelValue label="Range Change" value={gear.wireless_bonus.range_change} />
                )}
                {gear.wireless_bonus.skill_substitution && (
                  <div className="md:col-span-2">
                    <LabelValue label="Skill Substitution" value={gear.wireless_bonus.skill_substitution} />
                  </div>
                )}
              </FieldGrid>
            </div>
          </Section>
        )}

        {/* Weapon Information */}
        {(gear.addweapon || gear.weaponbonus || gear.flechetteweaponbonus || gear.ammoforweapontype || gear.isflechetteammo !== undefined) && (
          <Section title="Weapon Information">
            <FieldGrid columns={2}>
              {gear.addweapon && (
                <LabelValue label="Add Weapon" value={gear.addweapon} />
              )}
              {gear.ammoforweapontype && (
                <LabelValue label="Ammo For Weapon Type" value={gear.ammoforweapontype} />
              )}
              {gear.isflechetteammo !== undefined && (
                <LabelValue label="Is Flechette Ammo" value={formatValue(gear.isflechetteammo)} />
              )}
              {gear.weaponbonus && (
                <LabelValue label="Weapon Bonus" value={gear.weaponbonus} />
              )}
              {gear.flechetteweaponbonus && (
                <LabelValue label="Flechette Weapon Bonus" value={gear.flechetteweaponbonus} />
              )}
            </FieldGrid>
          </Section>
        )}

        {/* Addon Category */}
        {gear.addoncategory && (
          <Section title="Addon Category">
            <p className="text-gray-100">{formatArray(gear.addoncategory)}</p>
          </Section>
        )}

        {/* Requirements */}
        {gear.required && (
          <Section title="Requirements">
            <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
              <RequirementsDisplay required={gear.required} />
            </div>
          </Section>
        )}

        {gear.requireparent !== undefined && (
          <Section title="Requires Parent">
            <p className="text-gray-100">{gear.requireparent ? 'Yes' : 'No'}</p>
          </Section>
        )}

        {/* Bonuses */}
        {gear.bonus != null && <BonusDisplay bonus={gear.bonus} />}
      </div>
    </ViewModal>
  );
}

