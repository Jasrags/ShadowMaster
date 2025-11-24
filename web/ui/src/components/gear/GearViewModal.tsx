import { Dialog, Modal, Heading, Button } from 'react-aria-components';
import type { Gear } from '../../lib/types';
import { RequirementsDisplay } from './RequirementsDisplay';
import { BonusDisplay } from './BonusDisplay';
import { getCategoryDisplayName } from './categoryUtils';
import { formatCost } from '../../lib/formatUtils';

interface GearViewModalProps {
  gear: Gear | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

// Helper function to format values for display
const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return '-';
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
  return formatValue(value);
};

export function GearViewModal({ gear, isOpen, onOpenChange }: GearViewModalProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  if (!gear || !isOpen) {
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
              {gear.name}
            </Heading>
            <Button
              onPress={handleClose}
              aria-label="Close gear view"
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
              {gear.description && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Description</h2>
                  <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
                    <p className="text-gray-200 text-sm whitespace-pre-wrap">{gear.description}</p>
                  </div>
                </section>
              )}

              {/* Basic Information */}
              <section>
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Name</label>
                    <p className="text-gray-100 mt-1">{gear.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Category</label>
                    <p className="text-gray-100 mt-1">{getCategoryDisplayName(gear.category)}</p>
                  </div>
                  {gear.subcategory && (
                    <div>
                      <label className="text-sm text-gray-400">Subcategory</label>
                      <p className="text-gray-100 mt-1">{gear.subcategory}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-400">Source</label>
                    <p className="text-gray-100 mt-1">
                      {typeof gear.source === 'string' ? gear.source : gear.source?.source || '-'}
                    </p>
                  </div>
                  {(gear.page || (typeof gear.source === 'object' && gear.source?.page)) && (
                    <div>
                      <label className="text-sm text-gray-400">Page</label>
                      <p className="text-gray-100 mt-1">
                        {gear.page || (typeof gear.source === 'object' ? gear.source?.page : '-')}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Stats */}
              {(gear.rating !== undefined || gear.availability || gear.cost !== undefined || gear.avail || gear.costfor || gear.device_rating || gear.device_type) && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Statistics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gear.rating !== undefined && (
                      <div>
                        <label className="text-sm text-gray-400">Rating</label>
                        <p className="text-gray-100 mt-1">{gear.rating}</p>
                      </div>
                    )}
                    {gear.device_type && (
                      <div>
                        <label className="text-sm text-gray-400">Device Type</label>
                        <p className="text-gray-100 mt-1">{gear.device_type}</p>
                      </div>
                    )}
                    {gear.device_rating !== undefined && (
                      <div>
                        <label className="text-sm text-gray-400">Device Rating</label>
                        <p className="text-gray-100 mt-1">{gear.device_rating}</p>
                      </div>
                    )}
                    {(gear.availability || gear.avail) && (
                      <div>
                        <label className="text-sm text-gray-400">Availability</label>
                        <p className="text-gray-100 mt-1">{gear.availability || gear.avail}</p>
                      </div>
                    )}
                    {gear.cost !== undefined && (
                      <div>
                        <label className="text-sm text-gray-400">Cost</label>
                        <p className="text-gray-100 mt-1">
                          {gear.cost_per_rating ? `${formatCost(String(gear.cost))} per rating` : formatCost(String(gear.cost))}
                        </p>
                      </div>
                    )}
                    {gear.costfor && (
                      <div>
                        <label className="text-sm text-gray-400">Cost For</label>
                        <p className="text-gray-100 mt-1">{gear.costfor}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Mechanical Effects */}
              {gear.mechanical_effects && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Mechanical Effects</h2>
                  <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gear.mechanical_effects.dice_pool_bonus !== undefined && (
                        <div>
                          <label className="text-sm text-gray-400">Dice Pool Bonus</label>
                          <p className="text-gray-100 mt-1">
                            {gear.mechanical_effects.dice_pool_bonus > 0 ? '+' : ''}{gear.mechanical_effects.dice_pool_bonus}
                            {gear.mechanical_effects.test_type && ` to ${gear.mechanical_effects.test_type}`}
                          </p>
                        </div>
                      )}
                      {gear.mechanical_effects.limit_bonus !== undefined && (
                        <div>
                          <label className="text-sm text-gray-400">Limit Bonus</label>
                          <p className="text-gray-100 mt-1">
                            {gear.mechanical_effects.limit_bonus > 0 ? '+' : ''}{gear.mechanical_effects.limit_bonus}
                            {gear.mechanical_effects.test_type && ` to ${gear.mechanical_effects.test_type}`}
                          </p>
                        </div>
                      )}
                      {gear.mechanical_effects.rating_bonus !== undefined && (
                        <div>
                          <label className="text-sm text-gray-400">Rating Bonus</label>
                          <p className="text-gray-100 mt-1">+{gear.mechanical_effects.rating_bonus}</p>
                        </div>
                      )}
                      {gear.mechanical_effects.perception_penalty !== undefined && (
                        <div>
                          <label className="text-sm text-gray-400">Perception Penalty</label>
                          <p className="text-red-400 mt-1">{gear.mechanical_effects.perception_penalty}</p>
                        </div>
                      )}
                      {gear.mechanical_effects.noise_reduction !== undefined && (
                        <div>
                          <label className="text-sm text-gray-400">Noise Reduction</label>
                          <p className="text-gray-100 mt-1">{gear.mechanical_effects.noise_reduction}</p>
                        </div>
                      )}
                      {gear.mechanical_effects.damage_value && (
                        <div>
                          <label className="text-sm text-gray-400">Damage Value</label>
                          <p className="text-gray-100 mt-1">{gear.mechanical_effects.damage_value}</p>
                        </div>
                      )}
                      {gear.mechanical_effects.range && (
                        <div>
                          <label className="text-sm text-gray-400">Range</label>
                          <p className="text-gray-100 mt-1">{gear.mechanical_effects.range}</p>
                        </div>
                      )}
                      {gear.mechanical_effects.duration && (
                        <div>
                          <label className="text-sm text-gray-400">Duration</label>
                          <p className="text-gray-100 mt-1">{gear.mechanical_effects.duration}</p>
                        </div>
                      )}
                      {gear.mechanical_effects.charges && (
                        <div>
                          <label className="text-sm text-gray-400">Charges</label>
                          <p className="text-gray-100 mt-1">{gear.mechanical_effects.charges}</p>
                        </div>
                      )}
                      {gear.mechanical_effects.other_effects && (
                        <div className="md:col-span-2">
                          <label className="text-sm text-gray-400">Other Effects</label>
                          <p className="text-gray-100 mt-1">{gear.mechanical_effects.other_effects}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Special Properties */}
              {gear.special_properties && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Special Properties</h2>
                  <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gear.special_properties.concealability_modifier !== undefined && (
                        <div>
                          <label className="text-sm text-gray-400">Concealability Modifier</label>
                          <p className="text-gray-100 mt-1">
                            {gear.special_properties.concealability_modifier > 0 ? '+' : ''}{gear.special_properties.concealability_modifier}
                          </p>
                        </div>
                      )}
                      {gear.special_properties.capacity !== undefined && (
                        <div>
                          <label className="text-sm text-gray-400">Capacity</label>
                          <p className="text-gray-100 mt-1">{gear.special_properties.capacity}</p>
                        </div>
                      )}
                      {gear.special_properties.max_rating !== undefined && (
                        <div>
                          <label className="text-sm text-gray-400">Max Rating</label>
                          <p className="text-gray-100 mt-1">{gear.special_properties.max_rating}</p>
                        </div>
                      )}
                      {gear.special_properties.size && (
                        <div>
                          <label className="text-sm text-gray-400">Size</label>
                          <p className="text-gray-100 mt-1">{gear.special_properties.size}</p>
                        </div>
                      )}
                      {gear.special_properties.compatible_with && gear.special_properties.compatible_with.length > 0 && (
                        <div>
                          <label className="text-sm text-gray-400">Compatible With</label>
                          <p className="text-gray-100 mt-1">{gear.special_properties.compatible_with.join(', ')}</p>
                        </div>
                      )}
                      {gear.special_properties.requires && gear.special_properties.requires.length > 0 && (
                        <div>
                          <label className="text-sm text-gray-400">Requires</label>
                          <p className="text-gray-100 mt-1">{gear.special_properties.requires.join(', ')}</p>
                        </div>
                      )}
                      {gear.special_properties.optical_only && (
                        <div>
                          <label className="text-sm text-gray-400">Optical Only</label>
                          <p className="text-gray-100 mt-1">Yes</p>
                        </div>
                      )}
                      {gear.special_properties.wireless_required && (
                        <div>
                          <label className="text-sm text-gray-400">Wireless Required</label>
                          <p className="text-gray-100 mt-1">Yes</p>
                        </div>
                      )}
                      {gear.special_properties.no_wireless_capability && (
                        <div>
                          <label className="text-sm text-gray-400">No Wireless Capability</label>
                          <p className="text-gray-100 mt-1">Yes</p>
                        </div>
                      )}
                      {gear.special_properties.emp_hardened && (
                        <div>
                          <label className="text-sm text-gray-400">EMP Hardened</label>
                          <p className="text-gray-100 mt-1">Yes</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Wireless Bonus */}
              {gear.wireless_bonus && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Wireless Bonus</h2>
                  <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
                    {gear.wireless_bonus.description && (
                      <p className="text-gray-200 text-sm mb-3">{gear.wireless_bonus.description}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gear.wireless_bonus.action_change && (
                        <div>
                          <label className="text-sm text-gray-400">Action Change</label>
                          <p className="text-gray-100 mt-1">{gear.wireless_bonus.action_change}</p>
                        </div>
                      )}
                      {gear.wireless_bonus.dice_pool_bonus !== undefined && (
                        <div>
                          <label className="text-sm text-gray-400">Dice Pool Bonus</label>
                          <p className="text-green-400 mt-1">+{gear.wireless_bonus.dice_pool_bonus}</p>
                        </div>
                      )}
                      {gear.wireless_bonus.limit_bonus !== undefined && (
                        <div>
                          <label className="text-sm text-gray-400">Limit Bonus</label>
                          <p className="text-green-400 mt-1">+{gear.wireless_bonus.limit_bonus}</p>
                        </div>
                      )}
                      {gear.wireless_bonus.rating_bonus !== undefined && (
                        <div>
                          <label className="text-sm text-gray-400">Rating Bonus</label>
                          <p className="text-green-400 mt-1">+{gear.wireless_bonus.rating_bonus}</p>
                        </div>
                      )}
                      {gear.wireless_bonus.range_change && (
                        <div>
                          <label className="text-sm text-gray-400">Range Change</label>
                          <p className="text-gray-100 mt-1">{gear.wireless_bonus.range_change}</p>
                        </div>
                      )}
                      {gear.wireless_bonus.skill_substitution && (
                        <div className="md:col-span-2">
                          <label className="text-sm text-gray-400">Skill Substitution</label>
                          <p className="text-gray-100 mt-1">{gear.wireless_bonus.skill_substitution}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Weapon Information */}
              {(gear.addweapon || gear.weaponbonus || gear.flechetteweaponbonus || gear.ammoforweapontype || gear.isflechetteammo !== undefined) && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Weapon Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gear.addweapon && (
                      <div>
                        <label className="text-sm text-gray-400">Add Weapon</label>
                        <p className="text-gray-100 mt-1">{gear.addweapon}</p>
                      </div>
                    )}
                    {gear.ammoforweapontype && (
                      <div>
                        <label className="text-sm text-gray-400">Ammo For Weapon Type</label>
                        <p className="text-gray-100 mt-1">{gear.ammoforweapontype}</p>
                      </div>
                    )}
                    {gear.isflechetteammo !== undefined && (
                      <div>
                        <label className="text-sm text-gray-400">Is Flechette Ammo</label>
                        <p className="text-gray-100 mt-1">{formatValue(gear.isflechetteammo)}</p>
                      </div>
                    )}
                    {gear.weaponbonus && (
                      <div>
                        <label className="text-sm text-gray-400">Weapon Bonus</label>
                        <p className="text-gray-100 mt-1">{gear.weaponbonus}</p>
                      </div>
                    )}
                    {gear.flechetteweaponbonus && (
                      <div>
                        <label className="text-sm text-gray-400">Flechette Weapon Bonus</label>
                        <p className="text-gray-100 mt-1">{gear.flechetteweaponbonus}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Addon Category */}
              {gear.addoncategory && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Addon Category</h2>
                  <p className="text-gray-100">{formatArray(gear.addoncategory)}</p>
                </section>
              )}

              {/* Requirements */}
              {gear.required && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Requirements</h2>
                  <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
                    <RequirementsDisplay required={gear.required} />
                  </div>
                </section>
              )}

              {gear.requireparent !== undefined && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Requires Parent</h2>
                  <p className="text-gray-100">{gear.requireparent ? 'Yes' : 'No'}</p>
                </section>
              )}

              {/* Bonuses */}
              {gear.bonus != null && <BonusDisplay bonus={gear.bonus} />}
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
    </Modal>
  );
}

