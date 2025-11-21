import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';
import type { Lifestyle } from '../../lib/types';

interface LifestyleViewModalProps {
  lifestyle: Lifestyle | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function LifestyleViewModal({ lifestyle, isOpen, onOpenChange }: LifestyleViewModalProps) {
  if (!lifestyle) return null;

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        isDismissable
      >
        <Modal className="bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <Dialog className="p-6">
            {({ close }) => (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">{lifestyle.name}</h2>
                    <p className="text-gray-400">Source: {lifestyle.source} (p. {lifestyle.page})</p>
                  </div>
                  <button
                    onClick={close}
                    className="text-gray-400 hover:text-gray-200 text-2xl leading-none"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Details</h3>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <dt className="text-gray-400">ID</dt>
                        <dd className="text-gray-200 font-mono text-xs">{lifestyle.id}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Cost</dt>
                        <dd className="text-gray-200">{lifestyle.cost}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Dice</dt>
                        <dd className="text-gray-200">{lifestyle.dice}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Lifestyle Points (LP)</dt>
                        <dd className="text-gray-200">{lifestyle.lp}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Multiplier</dt>
                        <dd className="text-gray-200">{lifestyle.multiplier}</dd>
                      </div>
                      {lifestyle.costforarea !== undefined && (
                        <div>
                          <dt className="text-gray-400">Cost for Area</dt>
                          <dd className="text-gray-200">{lifestyle.costforarea}</dd>
                        </div>
                      )}
                      {lifestyle.costforcomforts !== undefined && (
                        <div>
                          <dt className="text-gray-400">Cost for Comforts</dt>
                          <dd className="text-gray-200">{lifestyle.costforcomforts}</dd>
                        </div>
                      )}
                      {lifestyle.costforsecurity !== undefined && (
                        <div>
                          <dt className="text-gray-400">Cost for Security</dt>
                          <dd className="text-gray-200">{lifestyle.costforsecurity}</dd>
                        </div>
                      )}
                      {lifestyle.increment && (
                        <div>
                          <dt className="text-gray-400">Increment</dt>
                          <dd className="text-gray-200">{lifestyle.increment}</dd>
                        </div>
                      )}
                      {lifestyle.allowbonuslp && (
                        <div>
                          <dt className="text-gray-400">Allow Bonus LP</dt>
                          <dd className="text-gray-200">{lifestyle.allowbonuslp}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {lifestyle.freegrids?.freegrid && lifestyle.freegrids.freegrid.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">
                        Free Grids ({lifestyle.freegrids.freegrid.length})
                      </h3>
                      <div className="space-y-2">
                        {lifestyle.freegrids.freegrid.map((grid, index) => (
                          <div
                            key={index}
                            className="bg-sr-dark border border-sr-light-gray rounded p-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-300">
                                {grid.select || 'Grid Subscription'}
                              </span>
                              {grid.content && (
                                <span className="text-xs text-gray-400">{grid.content}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

