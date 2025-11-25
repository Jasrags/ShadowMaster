import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';
import type { VehicleModification } from '../../lib/types';

interface VehicleModificationViewModalProps {
  modification: VehicleModification | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function VehicleModificationViewModal({ modification, isOpen, onOpenChange }: VehicleModificationViewModalProps) {
  if (!modification) return null;

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
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">{modification.name || 'Unknown Modification'}</h2>
                    {modification.type && (
                      <p className="text-gray-400">{modification.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    )}
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
                  {modification.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">{modification.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Details</h3>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      {modification.type && (
                        <div>
                          <dt className="text-gray-400">Type</dt>
                          <dd className="text-gray-200">{modification.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</dd>
                        </div>
                      )}
                      {modification.slots && (
                        <div>
                          <dt className="text-gray-400">Slots</dt>
                          <dd className="text-gray-200">{modification.slots.description || '-'}</dd>
                        </div>
                      )}
                      {modification.cost && (
                        <div>
                          <dt className="text-gray-400">Cost</dt>
                          <dd className="text-gray-200">{modification.cost.formula || '-'}</dd>
                        </div>
                      )}
                      {modification.availability && (
                        <div>
                          <dt className="text-gray-400">Availability</dt>
                          <dd className="text-gray-200">
                            {modification.availability.value !== undefined
                              ? `${modification.availability.value}${modification.availability.restricted ? 'R' : ''}${modification.availability.forbidden ? 'F' : ''}`
                              : modification.availability.formula || '-'}
                          </dd>
                        </div>
                      )}
                      {modification.tools && (
                        <div>
                          <dt className="text-gray-400">Tools</dt>
                          <dd className="text-gray-200 capitalize">{modification.tools}</dd>
                        </div>
                      )}
                      {modification.skill && (
                        <div>
                          <dt className="text-gray-400">Skill</dt>
                          <dd className="text-gray-200 capitalize">{modification.skill}</dd>
                        </div>
                      )}
                      {modification.source?.source && (
                        <div>
                          <dt className="text-gray-400">Source</dt>
                          <dd className="text-gray-200">{modification.source.source}</dd>
                        </div>
                      )}
                      {modification.source?.page && (
                        <div>
                          <dt className="text-gray-400">Page</dt>
                          <dd className="text-gray-200">{modification.source.page}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

