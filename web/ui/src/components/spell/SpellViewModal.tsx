import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';
import type { Spell } from '../../lib/types';

interface SpellViewModalProps {
  spell: Spell | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SpellViewModal({ spell, isOpen, onOpenChange }: SpellViewModalProps) {
  if (!spell) return null;

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
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">{spell.name || 'Unknown Spell'}</h2>
                    {spell.category && (
                      <p className="text-gray-400 capitalize">{spell.category}</p>
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
                  {spell.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">{spell.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Details</h3>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      {spell.category && (
                        <div>
                          <dt className="text-gray-400">Category</dt>
                          <dd className="text-gray-200 capitalize">{spell.category}</dd>
                        </div>
                      )}
                      {spell.type && (
                        <div>
                          <dt className="text-gray-400">Type</dt>
                          <dd className="text-gray-200 capitalize">{spell.type}</dd>
                        </div>
                      )}
                      {spell.range && (
                        <div>
                          <dt className="text-gray-400">Range</dt>
                          <dd className="text-gray-200">{spell.range}</dd>
                        </div>
                      )}
                      {spell.duration && (
                        <div>
                          <dt className="text-gray-400">Duration</dt>
                          <dd className="text-gray-200 capitalize">{spell.duration}</dd>
                        </div>
                      )}
                      {spell.drain && (
                        <div>
                          <dt className="text-gray-400">Drain</dt>
                          <dd className="text-gray-200">{spell.drain.formula || '-'}</dd>
                        </div>
                      )}
                      {spell.damage && (
                        <div>
                          <dt className="text-gray-400">Damage</dt>
                          <dd className="text-gray-200 capitalize">{spell.damage}</dd>
                        </div>
                      )}
                      {spell.source?.source && (
                        <div>
                          <dt className="text-gray-400">Source</dt>
                          <dd className="text-gray-200">{spell.source.source}</dd>
                        </div>
                      )}
                      {spell.source?.page && (
                        <div>
                          <dt className="text-gray-400">Page</dt>
                          <dd className="text-gray-200">{spell.source.page}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {spell.effects && (spell.effects.keywords || spell.effects.description) && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Effects</h3>
                      {spell.effects.keywords && spell.effects.keywords.length > 0 && (
                        <div className="mb-2">
                          <div className="text-xs text-gray-400 mb-1">Keywords</div>
                          <div className="flex flex-wrap gap-2">
                            {spell.effects.keywords.map((keyword, index) => (
                              <span key={index} className="px-2 py-1 bg-sr-accent/20 text-sr-accent rounded text-xs">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {spell.effects.description && (
                        <p className="text-sm text-gray-200">{spell.effects.description}</p>
                      )}
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

