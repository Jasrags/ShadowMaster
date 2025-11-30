import { useState } from 'react';
import { Dialog, Modal, Heading, Button } from 'react-aria-components';
import type { Weapon, WeaponAccessoryItem } from '../../lib/types';
import { WeaponAccessoryViewModal } from './WeaponAccessoryViewModal';
import { formatCost } from '../../lib/formatUtils';
import { formatValue, formatArray } from '../../lib/viewModalUtils';

interface WeaponViewModalProps {
  weapon: Weapon | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  accessoryMap: Map<string, WeaponAccessoryItem>;
}

export function WeaponViewModal({ weapon, isOpen, onOpenChange, accessoryMap }: WeaponViewModalProps) {
  const [selectedAccessory, setSelectedAccessory] = useState<WeaponAccessoryItem | null>(null);
  const [isAccessoryModalOpen, setIsAccessoryModalOpen] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
  };

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
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ zIndex: 50 }}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={handleClose} />
        <Dialog className="relative bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden outline-none flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-sr-light-gray">
            <Heading
              slot="title"
              className="text-2xl font-semibold text-gray-100"
            >
              {weapon.name}
            </Heading>
            <Button
              onPress={handleClose}
              aria-label="Close weapon view"
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
                    <p className="text-gray-100 mt-1">{weapon.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Category</label>
                    <p className="text-gray-100 mt-1">{weapon.category}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Type</label>
                    <p className="text-gray-100 mt-1">{weapon.type}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Source</label>
                    <p className="text-gray-100 mt-1">{weapon.source}</p>
                  </div>
                  {weapon.page && (
                    <div>
                      <label className="text-sm text-gray-400">Page</label>
                      <p className="text-gray-100 mt-1">{weapon.page}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Weapon Stats */}
              <section>
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Weapon Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {weapon.damage && (
                    <div>
                      <label className="text-sm text-gray-400">Damage</label>
                      <p className="text-gray-100 mt-1">{weapon.damage}</p>
                    </div>
                  )}
                  {weapon.accuracy && (
                    <div>
                      <label className="text-sm text-gray-400">Accuracy</label>
                      <p className="text-gray-100 mt-1">{weapon.accuracy}</p>
                    </div>
                  )}
                  {weapon.ap && (
                    <div>
                      <label className="text-sm text-gray-400">Armor Penetration (AP)</label>
                      <p className="text-gray-100 mt-1">{weapon.ap}</p>
                    </div>
                  )}
                  {weapon.conceal && (
                    <div>
                      <label className="text-sm text-gray-400">Concealability</label>
                      <p className="text-gray-100 mt-1">{weapon.conceal}</p>
                    </div>
                  )}
                  {weapon.reach && (
                    <div>
                      <label className="text-sm text-gray-400">Reach</label>
                      <p className="text-gray-100 mt-1">{weapon.reach}</p>
                    </div>
                  )}
                  {weapon.mode && (
                    <div>
                      <label className="text-sm text-gray-400">Firing Mode</label>
                      <p className="text-gray-100 mt-1">{weapon.mode}</p>
                    </div>
                  )}
                  {weapon.rc && (
                    <div>
                      <label className="text-sm text-gray-400">Recoil Compensation (RC)</label>
                      <p className="text-gray-100 mt-1">{weapon.rc}</p>
                    </div>
                  )}
                  {weapon.ammo && (
                    <div>
                      <label className="text-sm text-gray-400">Ammunition</label>
                      <p className="text-gray-100 mt-1">{weapon.ammo}</p>
                    </div>
                  )}
                  {weapon.range && (
                    <div>
                      <label className="text-sm text-gray-400">Range</label>
                      <p className="text-gray-100 mt-1">{weapon.range}</p>
                    </div>
                  )}
                  {weapon.avail && (
                    <div>
                      <label className="text-sm text-gray-400">Availability</label>
                      <p className="text-gray-100 mt-1">{weapon.avail}</p>
                    </div>
                  )}
                  {weapon.cost && (
                    <div>
                      <label className="text-sm text-gray-400">Cost</label>
                      <p className="text-gray-100 mt-1">{formatCost(weapon.cost)}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Skills */}
              {(weapon.useskill || weapon.useskillspec) && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Skills</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {weapon.useskill && (
                      <div>
                        <label className="text-sm text-gray-400">Use Skill</label>
                        <p className="text-gray-100 mt-1">{weapon.useskill}</p>
                      </div>
                    )}
                    {weapon.useskillspec && (
                      <div>
                        <label className="text-sm text-gray-400">Skill Specialization</label>
                        <p className="text-gray-100 mt-1">{weapon.useskillspec}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Accessories */}
              {weapon.accessories?.accessory && weapon.accessories.accessory.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Pre-installed Accessories</h2>
                  <div className="space-y-2">
                    {weapon.accessories.accessory.map((accessory, idx) => {
                      const fullAccessory = getAccessoryByName(accessory.name);
                      const isClickable = fullAccessory !== undefined;
                      
                      return (
                        <div key={idx} className="p-3 bg-sr-darker rounded-md">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                              <div>
                                <label className="text-sm text-gray-400">Mount</label>
                                <p className="text-gray-100 mt-1">{accessory.mount}</p>
                              </div>
                            )}
                            {accessory.avail && (
                              <div>
                                <label className="text-sm text-gray-400">Availability</label>
                                <p className="text-gray-100 mt-1">{accessory.avail}</p>
                              </div>
                            )}
                            {accessory.cost && (
                              <div>
                                <label className="text-sm text-gray-400">Cost</label>
                                <p className="text-gray-100 mt-1">{formatCost(accessory.cost)}</p>
                              </div>
                            )}
                            {accessory.rating && (
                              <div>
                                <label className="text-sm text-gray-400">Rating</label>
                                <p className="text-gray-100 mt-1">{accessory.rating}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Accessory Mounts */}
              {weapon.accessorymounts?.mount && weapon.accessorymounts.mount.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Available Accessory Mounts</h2>
                  <div className="flex flex-wrap gap-2">
                    {weapon.accessorymounts.mount.map((mount, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 bg-sr-accent/20 border border-sr-accent/50 rounded-md text-sm text-gray-200"
                      >
                        {mount}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Additional Weapon Fields */}
              {(weapon.addweapon || weapon.allowaccessory || weapon.allowgear || weapon.ammocategory || 
                weapon.ammoslots || weapon.cyberware || weapon.extramount || weapon.maxrating || 
                weapon.mount || weapon.requireammo || weapon.shortburst || weapon.singleshot || 
                weapon.sizecategory || weapon.spec || weapon.spec2 || weapon.underbarrels || 
                weapon.weapontype || weapon.alternaterange) && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Additional Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {weapon.addweapon && (
                      <div>
                        <label className="text-sm text-gray-400">Add Weapon</label>
                        <p className="text-gray-100 mt-1">{formatArray(weapon.addweapon)}</p>
                      </div>
                    )}
                    {weapon.allowaccessory && (
                      <div>
                        <label className="text-sm text-gray-400">Allow Accessory</label>
                        <p className="text-gray-100 mt-1">{weapon.allowaccessory}</p>
                      </div>
                    )}
                    {weapon.allowgear && (
                      <div>
                        <label className="text-sm text-gray-400">Allow Gear</label>
                        <p className="text-gray-100 mt-1">{formatArray(weapon.allowgear)}</p>
                      </div>
                    )}
                    {weapon.ammocategory && (
                      <div>
                        <label className="text-sm text-gray-400">Ammo Category</label>
                        <p className="text-gray-100 mt-1">{weapon.ammocategory}</p>
                      </div>
                    )}
                    {weapon.ammoslots && (
                      <div>
                        <label className="text-sm text-gray-400">Ammo Slots</label>
                        <p className="text-gray-100 mt-1">{weapon.ammoslots}</p>
                      </div>
                    )}
                    {weapon.cyberware && (
                      <div>
                        <label className="text-sm text-gray-400">Cyberware</label>
                        <p className="text-gray-100 mt-1">{weapon.cyberware}</p>
                      </div>
                    )}
                    {weapon.extramount && (
                      <div>
                        <label className="text-sm text-gray-400">Extra Mount</label>
                        <p className="text-gray-100 mt-1">{weapon.extramount}</p>
                      </div>
                    )}
                    {weapon.maxrating && (
                      <div>
                        <label className="text-sm text-gray-400">Max Rating</label>
                        <p className="text-gray-100 mt-1">{weapon.maxrating}</p>
                      </div>
                    )}
                    {weapon.mount && (
                      <div>
                        <label className="text-sm text-gray-400">Mount</label>
                        <p className="text-gray-100 mt-1">{weapon.mount}</p>
                      </div>
                    )}
                    {weapon.requireammo && (
                      <div>
                        <label className="text-sm text-gray-400">Require Ammo</label>
                        <p className="text-gray-100 mt-1">{weapon.requireammo}</p>
                      </div>
                    )}
                    {weapon.shortburst && (
                      <div>
                        <label className="text-sm text-gray-400">Short Burst</label>
                        <p className="text-gray-100 mt-1">{weapon.shortburst}</p>
                      </div>
                    )}
                    {weapon.singleshot && (
                      <div>
                        <label className="text-sm text-gray-400">Single Shot</label>
                        <p className="text-gray-100 mt-1">{weapon.singleshot}</p>
                      </div>
                    )}
                    {weapon.sizecategory && (
                      <div>
                        <label className="text-sm text-gray-400">Size Category</label>
                        <p className="text-gray-100 mt-1">{weapon.sizecategory}</p>
                      </div>
                    )}
                    {weapon.spec && (
                      <div>
                        <label className="text-sm text-gray-400">Specialization</label>
                        <p className="text-gray-100 mt-1">{weapon.spec}</p>
                      </div>
                    )}
                    {weapon.spec2 && (
                      <div>
                        <label className="text-sm text-gray-400">Specialization 2</label>
                        <p className="text-gray-100 mt-1">{weapon.spec2}</p>
                      </div>
                    )}
                    {weapon.underbarrels && (
                      <div>
                        <label className="text-sm text-gray-400">Underbarrels</label>
                        <p className="text-gray-100 mt-1">{formatArray(weapon.underbarrels)}</p>
                      </div>
                    )}
                    {weapon.weapontype && (
                      <div>
                        <label className="text-sm text-gray-400">Weapon Type</label>
                        <p className="text-gray-100 mt-1">{weapon.weapontype}</p>
                      </div>
                    )}
                    {weapon.alternaterange && (
                      <div>
                        <label className="text-sm text-gray-400">Alternate Range</label>
                        <p className="text-gray-100 mt-1">{weapon.alternaterange}</p>
                      </div>
                    )}
                    {weapon.doubledcostaccessorymounts !== undefined && (
                      <div>
                        <label className="text-sm text-gray-400">Double Cost Accessory Mounts</label>
                        <p className="text-gray-100 mt-1">{formatValue(weapon.doubledcostaccessorymounts)}</p>
                      </div>
                    )}
                    {weapon.hide !== undefined && (
                      <div>
                        <label className="text-sm text-gray-400">Hide</label>
                        <p className="text-gray-100 mt-1">{formatValue(weapon.hide)}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Requirements */}
              {weapon.required && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Requirements</h2>
                  <div className="p-4 bg-sr-darker rounded-md">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                      {JSON.stringify(weapon.required, null, 2)}
                    </pre>
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
      <WeaponAccessoryViewModal
        accessory={selectedAccessory}
        isOpen={isAccessoryModalOpen}
        onOpenChange={setIsAccessoryModalOpen}
      />
    </Modal>
  );
}

