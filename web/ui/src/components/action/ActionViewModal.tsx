import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';
import type { Action } from '../../lib/types';

interface ActionViewModalProps {
  action: Action | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ActionViewModal({ action, isOpen, onOpenChange }: ActionViewModalProps) {
  if (!action) return null;

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
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">{action.name || 'Unknown Action'}</h2>
                    {action.type && (
                      <p className="text-gray-400 capitalize">{action.type}</p>
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
                  {action.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">{action.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Details</h3>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      {action.type && (
                        <div>
                          <dt className="text-gray-400">Type</dt>
                          <dd className="text-gray-200 capitalize">{action.type}</dd>
                        </div>
                      )}
                      {action.initiative_cost !== undefined && (
                        <div>
                          <dt className="text-gray-400">Initiative Cost</dt>
                          <dd className="text-gray-200">{action.initiative_cost}</dd>
                        </div>
                      )}
                      {action.source?.source && (
                        <div>
                          <dt className="text-gray-400">Source</dt>
                          <dd className="text-gray-200">{action.source.source}</dd>
                        </div>
                      )}
                      {action.source?.page && (
                        <div>
                          <dt className="text-gray-400">Page</dt>
                          <dd className="text-gray-200">{action.source.page}</dd>
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

