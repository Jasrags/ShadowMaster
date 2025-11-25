import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';
import type { Metatype } from '../../lib/types';

interface MetatypeViewModalProps {
  metatype: Metatype | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function MetatypeViewModal({ metatype, isOpen, onOpenChange }: MetatypeViewModalProps) {
  if (!metatype) return null;

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
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">{metatype.name || 'Unknown Metatype'}</h2>
                    {metatype.category && (
                      <p className="text-gray-400 capitalize">{metatype.category}</p>
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
                  {metatype.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">{metatype.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Details</h3>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      {metatype.category && (
                        <div>
                          <dt className="text-gray-400">Category</dt>
                          <dd className="text-gray-200 capitalize">{metatype.category}</dd>
                        </div>
                      )}
                      {metatype.base_race && (
                        <div>
                          <dt className="text-gray-400">Base Race</dt>
                          <dd className="text-gray-200">{metatype.base_race}</dd>
                        </div>
                      )}
                      {metatype.essence !== undefined && (
                        <div>
                          <dt className="text-gray-400">Essence</dt>
                          <dd className="text-gray-200">{metatype.essence}</dd>
                        </div>
                      )}
                      {metatype.body && (
                        <div>
                          <dt className="text-gray-400">Body</dt>
                          <dd className="text-gray-200">
                            {metatype.body.min !== undefined && metatype.body.max !== undefined
                              ? `${metatype.body.min}-${metatype.body.max}`
                              : metatype.body.min !== undefined
                              ? `${metatype.body.min}+`
                              : '-'}
                          </dd>
                        </div>
                      )}
                      {metatype.source?.source && (
                        <div>
                          <dt className="text-gray-400">Source</dt>
                          <dd className="text-gray-200">{metatype.source.source}</dd>
                        </div>
                      )}
                      {metatype.source?.page && (
                        <div>
                          <dt className="text-gray-400">Page</dt>
                          <dd className="text-gray-200">{metatype.source.page}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {metatype.racial_traits && metatype.racial_traits.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Racial Traits</h3>
                      <div className="space-y-2">
                        {metatype.racial_traits.map((trait, index) => (
                          <div key={index} className="bg-sr-dark border border-sr-light-gray rounded p-3">
                            <div className="font-medium text-gray-200">{trait.name}</div>
                            {trait.description && (
                              <div className="text-sm text-gray-300 mt-1">{trait.description}</div>
                            )}
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

