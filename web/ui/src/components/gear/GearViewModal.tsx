import { Dialog, Modal, Heading, Button } from 'react-aria-components';
import type { Gear } from '../../lib/types';
import { RequirementsDisplay } from './RequirementsDisplay';
import { BonusDisplay } from './BonusDisplay';

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
                    <p className="text-gray-100 mt-1">{gear.category}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Source</label>
                    <p className="text-gray-100 mt-1">{gear.source}</p>
                  </div>
                  {gear.page && (
                    <div>
                      <label className="text-sm text-gray-400">Page</label>
                      <p className="text-gray-100 mt-1">{gear.page}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Stats */}
              <section>
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gear.rating && (
                    <div>
                      <label className="text-sm text-gray-400">Rating</label>
                      <p className="text-gray-100 mt-1">{gear.rating}</p>
                    </div>
                  )}
                  {gear.avail && (
                    <div>
                      <label className="text-sm text-gray-400">Availability</label>
                      <p className="text-gray-100 mt-1">{gear.avail}</p>
                    </div>
                  )}
                  {gear.cost && (
                    <div>
                      <label className="text-sm text-gray-400">Cost</label>
                      <p className="text-gray-100 mt-1">{gear.cost}</p>
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

