import { Dialog, Modal, Heading, Button } from 'react-aria-components';
import type { Quality } from '../../lib/types';
import { RequirementsDisplay } from '../gear/RequirementsDisplay';
import { BonusDisplay } from '../gear/BonusDisplay';

interface QualityViewModalProps {
  quality: Quality | null;
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

export function QualityViewModal({ quality, isOpen, onOpenChange }: QualityViewModalProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  if (!quality || !isOpen) {
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
              {quality.name}
            </Heading>
            <Button
              onPress={handleClose}
              aria-label="Close quality view"
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
                    <p className="text-gray-100 mt-1">{quality.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Category</label>
                    <p className="text-gray-100 mt-1">
                      <span className={`px-2 py-1 rounded text-sm ${
                        quality.category === 'Positive' 
                          ? 'bg-green-900/30 text-green-300' 
                          : 'bg-red-900/30 text-red-300'
                      }`}>
                        {quality.category}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Karma</label>
                    <p className={`text-gray-100 mt-1 font-semibold ${
                      parseInt(quality.karma) < 0 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {quality.karma}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Source</label>
                    <p className="text-gray-100 mt-1">{quality.source}</p>
                  </div>
                  {quality.page && (
                    <div>
                      <label className="text-sm text-gray-400">Page</label>
                      <p className="text-gray-100 mt-1">{quality.page}</p>
                    </div>
                  )}
                  {quality.limit && (
                    <div>
                      <label className="text-sm text-gray-400">Limit</label>
                      <p className="text-gray-100 mt-1">{quality.limit}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Flags */}
              {(quality.chargenonly !== undefined || 
                quality.careeronly !== undefined || 
                quality.nolevels !== undefined ||
                quality.stagedpurchase !== undefined ||
                quality.refundkarmaonremove !== undefined ||
                quality.metagenic ||
                quality.mutant) && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Flags</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quality.chargenonly !== undefined && (
                      <div>
                        <label className="text-sm text-gray-400">Character Creation Only</label>
                        <p className="text-gray-100 mt-1">{formatValue(quality.chargenonly)}</p>
                      </div>
                    )}
                    {quality.careeronly !== undefined && (
                      <div>
                        <label className="text-sm text-gray-400">Career Only</label>
                        <p className="text-gray-100 mt-1">{formatValue(quality.careeronly)}</p>
                      </div>
                    )}
                    {quality.nolevels !== undefined && (
                      <div>
                        <label className="text-sm text-gray-400">No Levels</label>
                        <p className="text-gray-100 mt-1">{formatValue(quality.nolevels)}</p>
                      </div>
                    )}
                    {quality.stagedpurchase !== undefined && (
                      <div>
                        <label className="text-sm text-gray-400">Staged Purchase</label>
                        <p className="text-gray-100 mt-1">{formatValue(quality.stagedpurchase)}</p>
                      </div>
                    )}
                    {quality.refundkarmaonremove !== undefined && (
                      <div>
                        <label className="text-sm text-gray-400">Refund Karma on Remove</label>
                        <p className="text-gray-100 mt-1">{formatValue(quality.refundkarmaonremove)}</p>
                      </div>
                    )}
                    {quality.metagenic && (
                      <div>
                        <label className="text-sm text-gray-400">Metagenic</label>
                        <p className="text-gray-100 mt-1">{quality.metagenic}</p>
                      </div>
                    )}
                    {quality.mutant && (
                      <div>
                        <label className="text-sm text-gray-400">Mutant</label>
                        <p className="text-gray-100 mt-1">{quality.mutant}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Requirements */}
              {quality.required && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Requirements</h2>
                  <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
                    {quality.required.oneof && (
                      <div className="mb-3">
                        <h3 className="text-sm font-semibold text-gray-300 mb-2">One Of:</h3>
                        {quality.required.oneof.metatype && quality.required.oneof.metatype.length > 0 && (
                          <div className="mb-2">
                            <span className="text-sm text-gray-400">Metatype: </span>
                            <span className="text-gray-100">{quality.required.oneof.metatype.join(', ')}</span>
                          </div>
                        )}
                        {quality.required.oneof.quality && quality.required.oneof.quality.length > 0 && (
                          <div className="mb-2">
                            <span className="text-sm text-gray-400">Quality: </span>
                            <span className="text-gray-100">{quality.required.oneof.quality.join(', ')}</span>
                          </div>
                        )}
                        {quality.required.oneof.power && (
                          <div className="mb-2">
                            <span className="text-sm text-gray-400">Power: </span>
                            <span className="text-gray-100">{quality.required.oneof.power}</span>
                          </div>
                        )}
                        {quality.required.oneof.magenabled !== undefined && (
                          <div className="mb-2">
                            <span className="text-sm text-gray-400">Magic Enabled: </span>
                            <span className="text-gray-100">{formatValue(quality.required.oneof.magenabled)}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {quality.required.allof && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-300 mb-2">All Of:</h3>
                        {quality.required.allof.metatype && (
                          <div className="mb-2">
                            <span className="text-sm text-gray-400">Metatype: </span>
                            <span className="text-gray-100">{quality.required.allof.metatype}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Forbidden */}
              {quality.forbidden && quality.forbidden.oneof && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Forbidden</h2>
                  <div className="p-4 bg-sr-light-gray border border-sr-light-gray rounded-md">
                    {quality.forbidden.oneof.quality && quality.forbidden.oneof.quality.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-400">Quality: </span>
                        <span className="text-gray-100">{quality.forbidden.oneof.quality.join(', ')}</span>
                      </div>
                    )}
                    {quality.forbidden.oneof.bioware && quality.forbidden.oneof.bioware.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-400">Bioware: </span>
                        <span className="text-gray-100">{quality.forbidden.oneof.bioware.join(', ')}</span>
                      </div>
                    )}
                    {quality.forbidden.oneof.power && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-400">Power: </span>
                        <span className="text-gray-100">{quality.forbidden.oneof.power}</span>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Bonuses */}
              {quality.bonus != null && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Bonuses</h2>
                  <BonusDisplay bonus={quality.bonus} />
                </section>
              )}

              {/* Additional Information */}
              {(quality.addweapon || quality.chargenlimit || quality.costdiscount) && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-3">Additional Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quality.addweapon && (
                      <div>
                        <label className="text-sm text-gray-400">Add Weapon</label>
                        <p className="text-gray-100 mt-1">{quality.addweapon}</p>
                      </div>
                    )}
                    {quality.chargenlimit && (
                      <div>
                        <label className="text-sm text-gray-400">Character Generation Limit</label>
                        <p className="text-gray-100 mt-1">{quality.chargenlimit}</p>
                      </div>
                    )}
                    {quality.costdiscount && (
                      <div>
                        <label className="text-sm text-gray-400">Cost Discount</label>
                        <p className="text-gray-100 mt-1">{quality.costdiscount}</p>
                      </div>
                    )}
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
    </Modal>
  );
}

