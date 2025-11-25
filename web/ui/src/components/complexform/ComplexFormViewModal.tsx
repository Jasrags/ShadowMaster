import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';
import type { ComplexForm } from '../../lib/types';

interface ComplexFormViewModalProps {
  complexForm: ComplexForm | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ComplexFormViewModal({ complexForm, isOpen, onOpenChange }: ComplexFormViewModalProps) {
  if (!complexForm) return null;

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
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">{complexForm.name || 'Unknown Complex Form'}</h2>
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
                  {complexForm.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">{complexForm.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Details</h3>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      {complexForm.target && (
                        <div>
                          <dt className="text-gray-400">Target</dt>
                          <dd className="text-gray-200">{complexForm.target.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</dd>
                        </div>
                      )}
                      {complexForm.duration && (
                        <div>
                          <dt className="text-gray-400">Duration</dt>
                          <dd className="text-gray-200">{complexForm.duration.description || complexForm.duration.type || '-'}</dd>
                        </div>
                      )}
                      {complexForm.fading && (
                        <div>
                          <dt className="text-gray-400">Fading</dt>
                          <dd className="text-gray-200">{complexForm.fading.formula || '-'}</dd>
                        </div>
                      )}
                      {complexForm.source?.source && (
                        <div>
                          <dt className="text-gray-400">Source</dt>
                          <dd className="text-gray-200">{complexForm.source.source}</dd>
                        </div>
                      )}
                      {complexForm.source?.page && (
                        <div>
                          <dt className="text-gray-400">Page</dt>
                          <dd className="text-gray-200">{complexForm.source.page}</dd>
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

