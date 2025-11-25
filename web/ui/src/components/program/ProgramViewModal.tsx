import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';
import type { Program } from '../../lib/types';

interface ProgramViewModalProps {
  program: Program | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ProgramViewModal({ program, isOpen, onOpenChange }: ProgramViewModalProps) {
  if (!program) return null;

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
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">{program.name || 'Unknown Program'}</h2>
                    {program.type && (
                      <p className="text-gray-400">{program.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
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
                  {program.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">{program.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Details</h3>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      {program.type && (
                        <div>
                          <dt className="text-gray-400">Type</dt>
                          <dd className="text-gray-200">{program.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</dd>
                        </div>
                      )}
                      {program.action_effect && (
                        <div>
                          <dt className="text-gray-400">Action/Effect</dt>
                          <dd className="text-gray-200">{program.action_effect}</dd>
                        </div>
                      )}
                      {program.rating_range && (
                        <div>
                          <dt className="text-gray-400">Rating Range</dt>
                          <dd className="text-gray-200">
                            {program.rating_range.min_rating !== undefined && program.rating_range.max_rating !== undefined
                              ? `${program.rating_range.min_rating}-${program.rating_range.max_rating}`
                              : '-'}
                          </dd>
                        </div>
                      )}
                      {program.cost && (
                        <div>
                          <dt className="text-gray-400">Cost</dt>
                          <dd className="text-gray-200">{program.cost.formula || '-'}</dd>
                        </div>
                      )}
                      {program.source?.source && (
                        <div>
                          <dt className="text-gray-400">Source</dt>
                          <dd className="text-gray-200">{program.source.source}</dd>
                        </div>
                      )}
                      {program.source?.page && (
                        <div>
                          <dt className="text-gray-400">Page</dt>
                          <dd className="text-gray-200">{program.source.page}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {program.effects && program.effects.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Effects</h3>
                      <div className="space-y-2">
                        {program.effects.map((effect, index) => (
                          <div key={index} className="bg-sr-dark border border-sr-light-gray rounded p-3">
                            {effect.action && (
                              <div className="font-medium text-gray-200">{effect.action}</div>
                            )}
                            {effect.effect && (
                              <div className="text-sm text-gray-300 mt-1">{effect.effect}</div>
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

