import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';
import type { Cyberware } from '../../lib/types';

interface CyberwareViewModalProps {
  cyberware: Cyberware | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function CyberwareViewModal({ cyberware, isOpen, onOpenChange }: CyberwareViewModalProps) {
  if (!cyberware) return null;

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
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">{cyberware.device || 'Unknown Cyberware'}</h2>
                    {cyberware.part && <p className="text-gray-400">{cyberware.part}</p>}
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
                      {cyberware.part && (
                        <div>
                          <dt className="text-gray-400">Part</dt>
                          <dd className="text-gray-200">{cyberware.part}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-gray-400">Essence</dt>
                        <dd className="text-gray-200">{cyberware.essence || cyberware.essence_formula?.formula || '-'}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Capacity</dt>
                        <dd className="text-gray-200">{cyberware.capacity || cyberware.capacity_formula?.formula || '-'}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Cost</dt>
                        <dd className="text-gray-200">{cyberware.cost || cyberware.cost_formula?.formula || '-'}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Availability</dt>
                        <dd className="text-gray-200">{cyberware.availability || cyberware.availability_formula?.formula || '-'}</dd>
                      </div>
                      {cyberware.source?.source && (
                        <div>
                          <dt className="text-gray-400">Source</dt>
                          <dd className="text-gray-200">{cyberware.source.source}</dd>
                        </div>
                      )}
                      {cyberware.source?.page && (
                        <div>
                          <dt className="text-gray-400">Page</dt>
                          <dd className="text-gray-200">{cyberware.source.page}</dd>
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

