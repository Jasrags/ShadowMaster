import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';
import type { Power } from '../../lib/types';

interface PowerViewModalProps {
  power: Power | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function PowerViewModal({ power, isOpen, onOpenChange }: PowerViewModalProps) {
  if (!power) return null;

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
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">{power.name || 'Unknown Power'}</h2>
                    {power.activation_description && (
                      <p className="text-gray-400">{power.activation_description}</p>
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
                  {power.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">{power.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Details</h3>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      {power.activation && (
                        <div>
                          <dt className="text-gray-400">Activation</dt>
                          <dd className="text-gray-200">{power.activation_description || power.activation.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</dd>
                        </div>
                      )}
                      {power.cost && (
                        <div>
                          <dt className="text-gray-400">Cost</dt>
                          <dd className="text-gray-200">{power.cost.formula || '-'}</dd>
                        </div>
                      )}
                      {power.prerequisite && (
                        <div>
                          <dt className="text-gray-400">Prerequisite</dt>
                          <dd className="text-gray-200">{power.prerequisite}</dd>
                        </div>
                      )}
                      {power.parameter && (
                        <div>
                          <dt className="text-gray-400">Parameter</dt>
                          <dd className="text-gray-200">{power.parameter}</dd>
                        </div>
                      )}
                      {power.source?.source && (
                        <div>
                          <dt className="text-gray-400">Source</dt>
                          <dd className="text-gray-200">{power.source.source}</dd>
                        </div>
                      )}
                      {power.source?.page && (
                        <div>
                          <dt className="text-gray-400">Page</dt>
                          <dd className="text-gray-200">{power.source.page}</dd>
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

