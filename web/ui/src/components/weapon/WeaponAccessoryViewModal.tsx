import { type ReactNode } from 'react';
import type { WeaponAccessoryItem } from '../../lib/types';
import { formatCost } from '../../lib/formatUtils';
import { formatValue, formatArray, toReactNode } from '../../lib/viewModalUtils';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue, ArrayDisplay } from '../common/FieldDisplay';

interface WeaponAccessoryViewModalProps {
  accessory: WeaponAccessoryItem | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}


// Component to display special properties for weapon accessories
function SpecialPropertiesDisplay({ properties }: { properties: unknown }) {
  if (!properties || typeof properties !== 'object') {
    return <p className="text-gray-400 text-sm">No special properties</p>;
  }

  const props = properties as Record<string, unknown>;
  const items: JSX.Element[] = [];

  // Recoil Compensation
  if (props.recoil_compensation !== undefined && Number(props.recoil_compensation) > 0) {
    items.push(
      <div key="recoil">
        <span className="text-gray-400">Recoil Compensation:</span>{' '}
        <span className="text-green-400">+{toReactNode(props.recoil_compensation)}</span>
      </div>
    );
  }

  // Accuracy Bonus
  if (props.accuracy_bonus !== undefined && Number(props.accuracy_bonus) > 0) {
    items.push(
      <div key="accuracy">
        <span className="text-gray-400">Accuracy Bonus:</span>{' '}
        <span className="text-green-400">+{toReactNode(props.accuracy_bonus)}</span>
      </div>
    );
  }

  // Concealability Modifier
  if (props.concealability_modifier !== undefined) {
    items.push(
      <div key="concealability">
        <span className="text-gray-400">Concealability Modifier:</span>{' '}
        <span className={Number(props.concealability_modifier) < 0 ? 'text-green-400' : 'text-gray-200'}>
          {Number(props.concealability_modifier) > 0 ? '+' : ''}{toReactNode(props.concealability_modifier)}
        </span>
      </div>
    );
  }

  // Quick Draw Threshold Modifier
  if (props.quick_draw_threshold_modifier !== undefined) {
    items.push(
      <div key="quick_draw_mod">
        <span className="text-gray-400">Quick Draw Threshold Modifier:</span>{' '}
        <span className={Number(props.quick_draw_threshold_modifier) < 0 ? 'text-green-400' : 'text-gray-200'}>
          {Number(props.quick_draw_threshold_modifier) > 0 ? '+' : ''}{toReactNode(props.quick_draw_threshold_modifier)}
        </span>
      </div>
    );
  }

  // Quick Draw Threshold
  if (props.quick_draw_threshold !== undefined) {
    items.push(
      <div key="quick_draw">
        <span className="text-gray-400">Quick Draw Threshold:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.quick_draw_threshold)}</span>
      </div>
    );
  }

  // Rating
  if (props.rating !== undefined) {
    items.push(
      <div key="rating">
        <span className="text-gray-400">Rating:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.rating)}</span>
      </div>
    );
  }

  // Max Rating
  if (props.max_rating !== undefined) {
    items.push(
      <div key="max_rating">
        <span className="text-gray-400">Max Rating:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.max_rating)}</span>
      </div>
    );
  }

  // Capacity
  if (props.capacity !== undefined) {
    items.push(
      <div key="capacity">
        <span className="text-gray-400">Capacity:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.capacity)}</span>
      </div>
    );
  }

  // Requires Wireless
  if (props.requires_wireless === true) {
    items.push(
      <div key="requires_wireless">
        <span className="text-gray-400">Requires Wireless:</span>{' '}
        <span className="text-yellow-400">Yes</span>
      </div>
    );
  }

  // Cannot Be Removed
  if (props.cannot_be_removed === true) {
    items.push(
      <div key="cannot_be_removed">
        <span className="text-gray-400">Cannot Be Removed:</span>{' '}
        <span className="text-yellow-400">Yes</span>
      </div>
    );
  }

  // Installation Time
  if (props.installation_time) {
    items.push(
      <div key="installation_time">
        <span className="text-gray-400">Installation Time:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.installation_time)}</span>
      </div>
    );
  }

  // Installation Test
  if (props.installation_test) {
    items.push(
      <div key="installation_test">
        <span className="text-gray-400">Installation Test:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.installation_test)}</span>
      </div>
    );
  }

  // Attachment Time
  if (props.attachment_time) {
    items.push(
      <div key="attachment_time">
        <span className="text-gray-400">Attachment Time:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.attachment_time)}</span>
      </div>
    );
  }

  // Deployment Action
  if (props.deployment_action) {
    items.push(
      <div key="deployment_action">
        <span className="text-gray-400">Deployment Action:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.deployment_action)}</span>
      </div>
    );
  }

  // Removal Action
  if (props.removal_action) {
    items.push(
      <div key="removal_action">
        <span className="text-gray-400">Removal Action:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.removal_action)}</span>
      </div>
    );
  }

  // Activation Action
  if (props.activation_action) {
    items.push(
      <div key="activation_action">
        <span className="text-gray-400">Activation Action:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.activation_action)}</span>
      </div>
    );
  }

  // Compatible Weapon Types
  if (props.compatible_weapon_types && Array.isArray(props.compatible_weapon_types) && props.compatible_weapon_types.length > 0) {
    items.push(
      <div key="compatible_weapon_types">
        <span className="text-gray-400">Compatible Weapon Types:</span>{' '}
        <span className="text-gray-200">{formatArray(props.compatible_weapon_types)}</span>
      </div>
    );
  }

  // Incompatible Weapon Types
  if (props.incompatible_weapon_types && Array.isArray(props.incompatible_weapon_types) && props.incompatible_weapon_types.length > 0) {
    items.push(
      <div key="incompatible_weapon_types">
        <span className="text-gray-400">Incompatible Weapon Types:</span>{' '}
        <span className="text-red-400">{formatArray(props.incompatible_weapon_types)}</span>
      </div>
    );
  }

  // Weapon Size Restriction
  if (props.weapon_size_restriction) {
    items.push(
      <div key="weapon_size_restriction">
        <span className="text-gray-400">Weapon Size Restriction:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.weapon_size_restriction)}</span>
      </div>
    );
  }

  // Perception Modifier
  if (props.perception_modifier !== undefined) {
    items.push(
      <div key="perception_modifier">
        <span className="text-gray-400">Perception Modifier:</span>{' '}
        <span className={Number(props.perception_modifier) < 0 ? 'text-green-400' : 'text-gray-200'}>
          {Number(props.perception_modifier) > 0 ? '+' : ''}{String(props.perception_modifier)}
        </span>
      </div>
    );
  }

  // Corner Shot Penalty Modifier
  if (props.corner_shot_penalty_modifier !== undefined) {
    items.push(
      <div key="corner_shot">
        <span className="text-gray-400">Corner Shot Penalty Modifier:</span>{' '}
        <span className={Number(props.corner_shot_penalty_modifier) > 0 ? 'text-green-400' : 'text-gray-200'}>
          {Number(props.corner_shot_penalty_modifier) > 0 ? '+' : ''}{String(props.corner_shot_penalty_modifier)}
        </span>
      </div>
    );
  }

  // Scatter Distance Modifier
  if (props.scatter_distance_modifier) {
    items.push(
      <div key="scatter_distance">
        <span className="text-gray-400">Scatter Distance Modifier:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.scatter_distance_modifier)}</span>
      </div>
    );
  }

  // Firing Arc
  if (props.firing_arc) {
    items.push(
      <div key="firing_arc">
        <span className="text-gray-400">Firing Arc:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.firing_arc)}</span>
      </div>
    );
  }

  // Inclination
  if (props.inclination) {
    items.push(
      <div key="inclination">
        <span className="text-gray-400">Inclination:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.inclination)}</span>
      </div>
    );
  }

  // Device Rating
  if (props.device_rating !== undefined) {
    items.push(
      <div key="device_rating">
        <span className="text-gray-400">Device Rating:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.device_rating)}</span>
      </div>
    );
  }

  // Autosofts
  if (props.autosofts && Array.isArray(props.autosofts) && props.autosofts.length > 0) {
    items.push(
      <div key="autosofts">
        <span className="text-gray-400">Autosofts:</span>{' '}
        <span className="text-gray-200">{formatArray(props.autosofts)}</span>
      </div>
    );
  }

  // Initiative Dice
  if (props.initiative_dice) {
    items.push(
      <div key="initiative_dice">
        <span className="text-gray-400">Initiative Dice:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.initiative_dice)}</span>
      </div>
    );
  }

  // Reload Time Modifier
  if (props.reload_time_modifier) {
    items.push(
      <div key="reload_time">
        <span className="text-gray-400">Reload Time Modifier:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.reload_time_modifier)}</span>
      </div>
    );
  }

  // Price Multiplier
  if (props.price_multiplier !== undefined) {
    items.push(
      <div key="price_multiplier">
        <span className="text-gray-400">Price Multiplier:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.price_multiplier)}×</span>
      </div>
    );
  }

  // Price Formula
  if (props.price_formula) {
    items.push(
      <div key="price_formula">
        <span className="text-gray-400">Price Formula:</span>{' '}
        <span className="text-gray-200">{toReactNode(props.price_formula)}</span>
      </div>
    );
  }

  // Availability Modifier
  if (props.availability_modifier !== undefined) {
    items.push(
      <div key="availability_modifier">
        <span className="text-gray-400">Availability Modifier:</span>{' '}
        <span className={Number(props.availability_modifier) > 0 ? 'text-red-400' : 'text-gray-200'}>
          {Number(props.availability_modifier) > 0 ? '+' : ''}{String(props.availability_modifier)}
        </span>
      </div>
    );
  }

  // Built-in Features
  if (props.built_in_features && Array.isArray(props.built_in_features) && props.built_in_features.length > 0) {
    items.push(
      <div key="built_in_features">
        <span className="text-gray-400">Built-in Features:</span>{' '}
        <span className="text-gray-200">{formatArray(props.built_in_features)}</span>
      </div>
    );
  }

  // Can Upgrade With Vision Enhancements
  if (props.can_upgrade_with_vision_enhancements === true) {
    items.push(
      <div key="vision_enhancements">
        <span className="text-gray-400">Can Upgrade With Vision Enhancements:</span>{' '}
        <span className="text-green-400">Yes</span>
      </div>
    );
  }

  // Can Share Line Of Sight
  if (props.can_share_line_of_sight === true) {
    items.push(
      <div key="share_los">
        <span className="text-gray-400">Can Share Line Of Sight:</span>{' '}
        <span className="text-green-400">Yes</span>
      </div>
    );
  }

  // Requires Smartlink
  if (props.requires_smartlink === true) {
    items.push(
      <div key="requires_smartlink">
        <span className="text-gray-400">Requires Smartlink:</span>{' '}
        <span className="text-yellow-400">Yes</span>
      </div>
    );
  }

  // Requires Smartgun
  if (props.requires_smartgun === true) {
    items.push(
      <div key="requires_smartgun">
        <span className="text-gray-400">Requires Smartgun:</span>{' '}
        <span className="text-yellow-400">Yes</span>
      </div>
    );
  }

  // Can Fire Remotely
  if (props.can_fire_remotely === true) {
    items.push(
      <div key="can_fire_remotely">
        <span className="text-gray-400">Can Fire Remotely:</span>{' '}
        <span className="text-green-400">Yes</span>
      </div>
    );
  }

  // Movement Modifier Neutralization
  if (props.movement_modifier_neutralization !== undefined && Number(props.movement_modifier_neutralization) > 0) {
    items.push(
      <div key="movement_modifier">
        <span className="text-gray-400">Movement Modifier Neutralization:</span>{' '}
        <span className="text-green-400">+{String(props.movement_modifier_neutralization)}</span>
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-gray-400 text-sm">No special properties</p>;
  }

  return <div className="space-y-2">{items}</div>;
}

// Component to display wireless bonuses
function WirelessBonusDisplay({ bonus }: { bonus: unknown }) {
  if (!bonus || typeof bonus !== 'object') {
    return <p className="text-gray-400 text-sm">No wireless bonuses</p>;
  }

  const bonusObj = bonus as Record<string, unknown>;
  const items: JSX.Element[] = [];

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

export function WeaponAccessoryViewModal({ accessory, isOpen, onOpenChange }: WeaponAccessoryViewModalProps) {
  if (!accessory || !isOpen) {
    return null;
  }

  // Extract conditions to help TypeScript with type inference
  const hasSpecialProperties: boolean = accessory.special_properties != null && typeof accessory.special_properties === 'object';
  const hasWirelessBonus: boolean = accessory.wireless_bonus != null && typeof accessory.wireless_bonus === 'object';

  return (
    <ViewModal
      item={accessory}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Description */}
        {accessory.description && (
          <Section title="Description">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{accessory.description}</p>
          </Section>
        )}

        {/* Basic Information */}
        <Section title="Basic Information">
          <FieldGrid columns={2}>
            <LabelValue label="Name" value={accessory.name} />
            <LabelValue label="Mount" value={accessory.mount || '—'} />
            {accessory.extramount && (
              <LabelValue label="Extra Mount" value={accessory.extramount} />
            )}
            {accessory.addmount && (
              <LabelValue label="Add Mount" value={accessory.addmount} />
            )}
            <LabelValue label="Source" value={accessory.source} />
            {accessory.page && (
              <LabelValue label="Page" value={accessory.page} />
            )}
          </FieldGrid>
        </Section>

        {/* Statistics */}
        <Section title="Statistics">
          <FieldGrid columns={2}>
            {accessory.rating && (
              <LabelValue label="Rating" value={accessory.rating} />
            )}
            {accessory.accuracy && (
              <LabelValue label="Accuracy" value={accessory.accuracy} />
            )}
            {accessory.rc && (
              <LabelValue label="Recoil Compensation (RC)" value={accessory.rc} />
            )}
            {accessory.rcdeployable && (
              <LabelValue label="RC Deployable" value={accessory.rcdeployable} />
            )}
            {accessory.rcgroup !== undefined && (
              <LabelValue label="RC Group" value={accessory.rcgroup} />
            )}
            {accessory.damage && (
              <LabelValue label="Damage" value={accessory.damage} />
            )}
            {accessory.damagetype && (
              <LabelValue label="Damage Type" value={accessory.damagetype} />
            )}
            {accessory.dicepool !== undefined && (
              <LabelValue label="Dice Pool" value={accessory.dicepool} />
            )}
            {accessory.conceal && (
              <LabelValue label="Concealability" value={accessory.conceal} />
            )}
            {accessory.avail && (
              <LabelValue label="Availability" value={accessory.avail} />
            )}
            {accessory.cost && (
              <LabelValue label="Cost" value={formatCost(accessory.cost)} />
            )}
            {accessory.accessorycostmultiplier && (
              <LabelValue label="Accessory Cost Multiplier" value={accessory.accessorycostmultiplier} />
            )}
          </FieldGrid>
        </Section>

        {/* Special Properties */}
        {hasSpecialProperties && (
          <Section title="Special Properties">
            <div className="p-4 bg-sr-darker rounded-md">
              <SpecialPropertiesDisplay properties={accessory.special_properties as Record<string, unknown>} />
            </div>
          </Section>
        )}

        {/* Wireless Bonus */}
        {hasWirelessBonus && (
          <Section title="Wireless Bonus">
            <div className="p-4 bg-sr-darker rounded-md">
              <WirelessBonusDisplay bonus={accessory.wireless_bonus as Record<string, unknown>} />
            </div>
          </Section>
        )}

        {/* Ammo Modifications */}
        {(accessory.ammobonus || accessory.ammoreplace || accessory.ammoslots || accessory.modifyammocapacity) && (
          <Section title="Ammunition Modifications">
            <FieldGrid columns={2}>
              {accessory.ammobonus && (
                <LabelValue label="Ammo Bonus" value={accessory.ammobonus} />
              )}
              {accessory.ammoreplace && (
                <LabelValue label="Ammo Replace" value={accessory.ammoreplace} />
              )}
              {accessory.ammoslots && (
                <LabelValue label="Ammo Slots" value={accessory.ammoslots} />
              )}
              {accessory.modifyammocapacity && (
                <LabelValue label="Modify Ammo Capacity" value={accessory.modifyammocapacity} />
              )}
            </FieldGrid>
          </Section>
        )}

        {/* Range Modifications */}
        {accessory.replacerange && (
          <Section title="Range Modifications">
            <FieldGrid columns={2}>
              <LabelValue label="Replace Range" value={accessory.replacerange} />
            </FieldGrid>
          </Section>
        )}

        {/* Additional Features */}
        {(accessory.addunderbarrels || accessory.allowgear || accessory.gears || accessory.wirelessweaponbonus) && (
          <Section title="Additional Features">
            <div className="space-y-4">
              {accessory.addunderbarrels?.weapon && accessory.addunderbarrels.weapon.length > 0 && (
                <div>
                  <label className="text-sm text-gray-400">Add Underbarrel Weapons</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <ArrayDisplay
                      items={accessory.addunderbarrels.weapon}
                      itemClassName="inline-flex items-center px-3 py-1 bg-sr-accent/20 border border-sr-accent/50 rounded-md text-sm text-gray-200"
                    />
                  </div>
                </div>
              )}
              {accessory.allowgear?.gearcategory && accessory.allowgear.gearcategory.length > 0 && (
                <div>
                  <label className="text-sm text-gray-400">Allow Gear Categories</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <ArrayDisplay
                      items={accessory.allowgear.gearcategory}
                      itemClassName="inline-flex items-center px-3 py-1 bg-sr-accent/20 border border-sr-accent/50 rounded-md text-sm text-gray-200"
                    />
                  </div>
                </div>
              )}
              {accessory.gears && (
                <div>
                  <label className="text-sm text-gray-400">Gears</label>
                  <div className="p-4 bg-sr-darker rounded-md mt-2">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                      {JSON.stringify(accessory.gears, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              {accessory.wirelessweaponbonus && (
                <div>
                  <label className="text-sm text-gray-400">Wireless Weapon Bonus</label>
                  <div className="p-4 bg-sr-darker rounded-md mt-2">
                    <FieldGrid columns={2}>
                      {accessory.wirelessweaponbonus.accuracy && (
                        <LabelValue label="Accuracy" value={accessory.wirelessweaponbonus.accuracy} />
                      )}
                      {accessory.wirelessweaponbonus.accuracyreplace && (
                        <LabelValue label="Accuracy Replace" value={accessory.wirelessweaponbonus.accuracyreplace} />
                      )}
                      {accessory.wirelessweaponbonus.ap && (
                        <LabelValue label="AP" value={accessory.wirelessweaponbonus.ap} />
                      )}
                      {accessory.wirelessweaponbonus.apreplace && (
                        <LabelValue label="AP Replace" value={accessory.wirelessweaponbonus.apreplace} />
                      )}
                      {accessory.wirelessweaponbonus.damage && (
                        <LabelValue label="Damage" value={accessory.wirelessweaponbonus.damage} />
                      )}
                      {accessory.wirelessweaponbonus.damagereplace && (
                        <LabelValue label="Damage Replace" value={accessory.wirelessweaponbonus.damagereplace} />
                      )}
                      {accessory.wirelessweaponbonus.damagetype && (
                        <LabelValue label="Damage Type" value={accessory.wirelessweaponbonus.damagetype} />
                      )}
                      {accessory.wirelessweaponbonus.mode && (
                        <LabelValue label="Mode" value={accessory.wirelessweaponbonus.mode} />
                      )}
                      {accessory.wirelessweaponbonus.modereplace && (
                        <LabelValue label="Mode Replace" value={accessory.wirelessweaponbonus.modereplace} />
                      )}
                      {accessory.wirelessweaponbonus.pool && (
                        <LabelValue label="Pool" value={accessory.wirelessweaponbonus.pool} />
                      )}
                      {accessory.wirelessweaponbonus.rangebonus !== undefined && (
                        <LabelValue label="Range Bonus" value={accessory.wirelessweaponbonus.rangebonus} />
                      )}
                      {accessory.wirelessweaponbonus.rc && (
                        <LabelValue label="RC" value={accessory.wirelessweaponbonus.rc} />
                      )}
                      {accessory.wirelessweaponbonus.smartlinkpool && (
                        <LabelValue label="Smartlink Pool" value={accessory.wirelessweaponbonus.smartlinkpool} />
                      )}
                      {accessory.wirelessweaponbonus.userange && (
                        <LabelValue label="Use Range" value={accessory.wirelessweaponbonus.userange} />
                      )}
                    </FieldGrid>
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Requirements */}
        {accessory.required && (
          <Section title="Requirements">
            <div className="p-4 bg-sr-darker rounded-md">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                {JSON.stringify(accessory.required, null, 2)}
              </pre>
            </div>
          </Section>
        )}

        {/* Forbidden */}
        {accessory.forbidden && (
          <Section title="Forbidden">
            <div className="p-4 bg-sr-darker rounded-md">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                {JSON.stringify(accessory.forbidden, null, 2)}
              </pre>
            </div>
          </Section>
        )}

        {/* Additional Fields */}
        {(accessory.hide !== undefined || accessory.ignoresourcedisabled !== undefined) && (
          <Section title="Additional Information">
            <FieldGrid columns={2}>
              {accessory.hide !== undefined && (
                <LabelValue label="Hide" value={formatValue(accessory.hide)} />
              )}
              {accessory.ignoresourcedisabled !== undefined && (
                <LabelValue label="Ignore Source Disabled" value={formatValue(accessory.ignoresourcedisabled)} />
              )}
            </FieldGrid>
          </Section>
        )}
      </div>
    </ViewModal>
  );
}

