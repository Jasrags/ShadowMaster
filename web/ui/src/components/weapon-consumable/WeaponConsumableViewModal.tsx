import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';
import type { WeaponConsumable } from '../../lib/types';
import { formatCost } from '../../lib/formatUtils';

interface WeaponConsumableViewModalProps {
  consumable: WeaponConsumable | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function WeaponConsumableViewModal({ consumable, isOpen, onOpenChange }: WeaponConsumableViewModalProps) {
  if (!consumable) return null;

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
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">{consumable.name}</h2>
                    <p className="text-gray-400">Source: {consumable.source} • Category: {consumable.category}</p>
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
                        <dd className="text-gray-200 font-mono text-xs">{consumable.id}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Category</dt>
                        <dd className="text-gray-200">{consumable.category}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Cost</dt>
                        <dd className="text-gray-200">{formatCost(consumable.cost)}</dd>
                      </div>
                      {consumable.quantity_per_purchase && (
                        <div>
                          <dt className="text-gray-400">Quantity per Purchase</dt>
                          <dd className="text-gray-200">{consumable.quantity_per_purchase} {consumable.unit_type || 'units'}</dd>
                        </div>
                      )}
                      {consumable.availability && (
                        <div>
                          <dt className="text-gray-400">Availability</dt>
                          <dd className="text-gray-200">{consumable.availability}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-gray-400">Source</dt>
                        <dd className="text-gray-200">{consumable.source}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Base Stats (for ammunition that replaces weapon stats) */}
                  {(consumable.base_dv || consumable.base_ap || consumable.base_acc) && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Base Stats</h3>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        {consumable.base_dv && (
                          <div>
                            <dt className="text-gray-400">Damage Value</dt>
                            <dd className="text-gray-200">{consumable.base_dv}</dd>
                          </div>
                        )}
                        {consumable.base_ap && (
                          <div>
                            <dt className="text-gray-400">Armor Penetration</dt>
                            <dd className="text-gray-200">{consumable.base_ap}</dd>
                          </div>
                        )}
                        {consumable.base_acc && (
                          <div>
                            <dt className="text-gray-400">Accuracy</dt>
                            <dd className="text-gray-200">{consumable.base_acc}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}

                  {/* Modifier Stats (for ammunition that modifies weapon stats) */}
                  {(consumable.modifier_dv || consumable.modifier_ap || consumable.modifier_acc) && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Modifiers</h3>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        {consumable.modifier_dv && (
                          <div>
                            <dt className="text-gray-400">Damage Value Modifier</dt>
                            <dd className="text-gray-200">{consumable.modifier_dv}</dd>
                          </div>
                        )}
                        {consumable.modifier_ap && (
                          <div>
                            <dt className="text-gray-400">Armor Penetration Modifier</dt>
                            <dd className="text-gray-200">{consumable.modifier_ap}</dd>
                          </div>
                        )}
                        {consumable.modifier_acc && (
                          <div>
                            <dt className="text-gray-400">Accuracy Modifier</dt>
                            <dd className="text-gray-200">{consumable.modifier_acc}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}

                  {/* Direct Stats (for grenades, rockets, missiles) */}
                  {(consumable.dv || consumable.ap || consumable.blast) && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Stats</h3>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        {consumable.dv && (
                          <div>
                            <dt className="text-gray-400">Damage Value</dt>
                            <dd className="text-gray-200">{consumable.dv}</dd>
                          </div>
                        )}
                        {consumable.ap && (
                          <div>
                            <dt className="text-gray-400">Armor Penetration</dt>
                            <dd className="text-gray-200">{consumable.ap}</dd>
                          </div>
                        )}
                        {consumable.blast && (
                          <div>
                            <dt className="text-gray-400">Blast</dt>
                            <dd className="text-gray-200">{consumable.blast}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}

                  {consumable.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {consumable.description}
                      </p>
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

