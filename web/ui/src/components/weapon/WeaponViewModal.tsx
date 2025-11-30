import { useState } from 'react';
import type { Weapon, WeaponAccessoryItem } from '../../lib/types';
import { WeaponAccessoryViewModal } from './WeaponAccessoryViewModal';
import { formatCost } from '../../lib/formatUtils';
import { formatValue, formatArray } from '../../lib/viewModalUtils';
import { ViewModal } from '../common/ViewModal';
import { Section, FieldGrid, LabelValue, ArrayDisplay } from '../common/FieldDisplay';

interface WeaponViewModalProps {
  weapon: Weapon | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  accessoryMap: Map<string, WeaponAccessoryItem>;
}

export function WeaponViewModal({ weapon, isOpen, onOpenChange, accessoryMap }: WeaponViewModalProps) {
  const [selectedAccessory, setSelectedAccessory] = useState<WeaponAccessoryItem | null>(null);
  const [isAccessoryModalOpen, setIsAccessoryModalOpen] = useState(false);

  // Helper to get accessory by name (handles both string and string[])
  const getAccessoryByName = (nameOrNames: string | string[]): WeaponAccessoryItem | undefined => {
    const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];
    for (const name of names) {
      const accessory = accessoryMap.get(name.toLowerCase());
      if (accessory) {
        return accessory;
      }
    }
    return undefined;
  };

  const handleAccessoryClick = (nameOrNames: string | string[]) => {
    const accessory = getAccessoryByName(nameOrNames);
    if (accessory) {
      setSelectedAccessory(accessory);
      setIsAccessoryModalOpen(true);
    }
  };

  if (!weapon || !isOpen) {
    return null;
  }

  return (
    <ViewModal
      item={weapon}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      maxWidth="4xl"
      nestedModals={
        <WeaponAccessoryViewModal
          accessory={selectedAccessory}
          isOpen={isAccessoryModalOpen}
          onOpenChange={setIsAccessoryModalOpen}
        />
      }
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <Section title="Basic Information">
          <FieldGrid columns={2}>
            <LabelValue label="Name" value={weapon.name} />
            <LabelValue label="Category" value={weapon.category} />
            <LabelValue label="Type" value={weapon.type} />
            <LabelValue label="Source" value={weapon.source} />
            {weapon.page && (
              <LabelValue label="Page" value={weapon.page} />
            )}
          </FieldGrid>
        </Section>

        {/* Weapon Stats */}
        <Section title="Weapon Statistics">
          <FieldGrid columns={2}>
            {weapon.damage && (
              <LabelValue label="Damage" value={weapon.damage} />
            )}
            {weapon.accuracy && (
              <LabelValue label="Accuracy" value={weapon.accuracy} />
            )}
            {weapon.ap && (
              <LabelValue label="Armor Penetration (AP)" value={weapon.ap} />
            )}
            {weapon.conceal && (
              <LabelValue label="Concealability" value={weapon.conceal} />
            )}
            {weapon.reach && (
              <LabelValue label="Reach" value={weapon.reach} />
            )}
            {weapon.mode && (
              <LabelValue label="Firing Mode" value={weapon.mode} />
            )}
            {weapon.rc && (
              <LabelValue label="Recoil Compensation (RC)" value={weapon.rc} />
            )}
            {weapon.ammo && (
              <LabelValue label="Ammunition" value={weapon.ammo} />
            )}
            {weapon.range && (
              <LabelValue label="Range" value={weapon.range} />
            )}
            {weapon.avail && (
              <LabelValue label="Availability" value={weapon.avail} />
            )}
            {weapon.cost && (
              <LabelValue label="Cost" value={formatCost(weapon.cost)} />
            )}
          </FieldGrid>
        </Section>

        {/* Skills */}
        {(weapon.useskill || weapon.useskillspec) && (
          <Section title="Skills">
            <FieldGrid columns={2}>
              {weapon.useskill && (
                <LabelValue label="Use Skill" value={weapon.useskill} />
              )}
              {weapon.useskillspec && (
                <LabelValue label="Skill Specialization" value={weapon.useskillspec} />
              )}
            </FieldGrid>
          </Section>
        )}

        {/* Accessories */}
        {weapon.accessories?.accessory && weapon.accessories.accessory.length > 0 && (
          <Section title="Pre-installed Accessories">
            <div className="space-y-2">
              {weapon.accessories.accessory.map((accessory, idx) => {
                const fullAccessory = getAccessoryByName(accessory.name);
                const isClickable = fullAccessory !== undefined;
                
                return (
                  <div key={idx} className="p-3 bg-sr-darker rounded-md">
                    <FieldGrid columns={2}>
                      <div>
                        <label className="text-sm text-gray-400">Name</label>
                        {isClickable ? (
                          <button
                            onClick={() => handleAccessoryClick(accessory.name)}
                            className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left mt-1 block"
                          >
                            {formatArray(accessory.name)}
                          </button>
                        ) : (
                          <p className="text-gray-100 mt-1">{formatArray(accessory.name)}</p>
                        )}
                      </div>
                      {accessory.mount && (
                        <LabelValue label="Mount" value={accessory.mount} />
                      )}
                      {accessory.avail && (
                        <LabelValue label="Availability" value={accessory.avail} />
                      )}
                      {accessory.cost && (
                        <LabelValue label="Cost" value={formatCost(accessory.cost)} />
                      )}
                      {accessory.rating && (
                        <LabelValue label="Rating" value={accessory.rating} />
                      )}
                    </FieldGrid>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Accessory Mounts */}
        {weapon.accessorymounts?.mount && weapon.accessorymounts.mount.length > 0 && (
          <Section title="Available Accessory Mounts">
            <ArrayDisplay
              items={weapon.accessorymounts.mount}
              itemClassName="inline-flex items-center px-3 py-1 bg-sr-accent/20 border border-sr-accent/50 rounded-md text-sm text-gray-200"
            />
          </Section>
        )}

        {/* Additional Weapon Fields */}
        {(weapon.addweapon || weapon.allowaccessory || weapon.allowgear || weapon.ammocategory || 
          weapon.ammoslots || weapon.cyberware || weapon.extramount || weapon.maxrating || 
          weapon.mount || weapon.requireammo || weapon.shortburst || weapon.singleshot || 
          weapon.sizecategory || weapon.spec || weapon.spec2 || weapon.underbarrels || 
          weapon.weapontype || weapon.alternaterange) && (
          <Section title="Additional Information">
            <FieldGrid columns={2}>
              {weapon.addweapon && (
                <LabelValue label="Add Weapon" value={formatArray(weapon.addweapon)} />
              )}
              {weapon.allowaccessory && (
                <LabelValue label="Allow Accessory" value={weapon.allowaccessory} />
              )}
              {weapon.allowgear && (
                <LabelValue label="Allow Gear" value={formatArray(weapon.allowgear)} />
              )}
              {weapon.ammocategory && (
                <LabelValue label="Ammo Category" value={weapon.ammocategory} />
              )}
              {weapon.ammoslots && (
                <LabelValue label="Ammo Slots" value={weapon.ammoslots} />
              )}
              {weapon.cyberware && (
                <LabelValue label="Cyberware" value={weapon.cyberware} />
              )}
              {weapon.extramount && (
                <LabelValue label="Extra Mount" value={weapon.extramount} />
              )}
              {weapon.maxrating && (
                <LabelValue label="Max Rating" value={weapon.maxrating} />
              )}
              {weapon.mount && (
                <LabelValue label="Mount" value={weapon.mount} />
              )}
              {weapon.requireammo && (
                <LabelValue label="Require Ammo" value={weapon.requireammo} />
              )}
              {weapon.shortburst && (
                <LabelValue label="Short Burst" value={weapon.shortburst} />
              )}
              {weapon.singleshot && (
                <LabelValue label="Single Shot" value={weapon.singleshot} />
              )}
              {weapon.sizecategory && (
                <LabelValue label="Size Category" value={weapon.sizecategory} />
              )}
              {weapon.spec && (
                <LabelValue label="Specialization" value={weapon.spec} />
              )}
              {weapon.spec2 && (
                <LabelValue label="Specialization 2" value={weapon.spec2} />
              )}
              {weapon.underbarrels && (
                <LabelValue label="Underbarrels" value={formatArray(weapon.underbarrels)} />
              )}
              {weapon.weapontype && (
                <LabelValue label="Weapon Type" value={weapon.weapontype} />
              )}
              {weapon.alternaterange && (
                <LabelValue label="Alternate Range" value={weapon.alternaterange} />
              )}
              {weapon.doubledcostaccessorymounts !== undefined && (
                <LabelValue label="Double Cost Accessory Mounts" value={formatValue(weapon.doubledcostaccessorymounts)} />
              )}
              {weapon.hide !== undefined && (
                <LabelValue label="Hide" value={formatValue(weapon.hide)} />
              )}
            </FieldGrid>
          </Section>
        )}

        {/* Requirements */}
        {weapon.required && (
          <Section title="Requirements">
            <div className="p-4 bg-sr-darker rounded-md">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                {JSON.stringify(weapon.required, null, 2)}
              </pre>
            </div>
          </Section>
        )}
      </div>
    </ViewModal>
  );
}

