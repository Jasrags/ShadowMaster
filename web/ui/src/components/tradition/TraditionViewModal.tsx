import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';
import type { Tradition } from '../../lib/types';

interface TraditionViewModalProps {
  tradition: Tradition | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function TraditionViewModal({ tradition, isOpen, onOpenChange }: TraditionViewModalProps) {
  if (!tradition) return null;

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
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">{tradition.name || 'Unknown Tradition'}</h2>
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
                  {tradition.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">{tradition.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Details</h3>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      {tradition.drain_formula && (
                        <div>
                          <dt className="text-gray-400">Drain Formula</dt>
                          <dd className="text-gray-200">{tradition.drain_formula}</dd>
                        </div>
                      )}
                      {tradition.drain_attributes && tradition.drain_attributes.length > 0 && (
                        <div>
                          <dt className="text-gray-400">Drain Attributes</dt>
                          <dd className="text-gray-200">{tradition.drain_attributes.join(', ')}</dd>
                        </div>
                      )}
                      {tradition.source?.source && (
                        <div>
                          <dt className="text-gray-400">Source</dt>
                          <dd className="text-gray-200">{tradition.source.source}</dd>
                        </div>
                      )}
                      {tradition.source?.page && (
                        <div>
                          <dt className="text-gray-400">Page</dt>
                          <dd className="text-gray-200">{tradition.source.page}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {(tradition.combat_element || tradition.detection_element || tradition.health_element || tradition.illusion_element || tradition.manipulation_element) && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Elements</h3>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        {tradition.combat_element && (
                          <div>
                            <dt className="text-gray-400">Combat</dt>
                            <dd className="text-gray-200">{tradition.combat_element}</dd>
                          </div>
                        )}
                        {tradition.detection_element && (
                          <div>
                            <dt className="text-gray-400">Detection</dt>
                            <dd className="text-gray-200">{tradition.detection_element}</dd>
                          </div>
                        )}
                        {tradition.health_element && (
                          <div>
                            <dt className="text-gray-400">Health</dt>
                            <dd className="text-gray-200">{tradition.health_element}</dd>
                          </div>
                        )}
                        {tradition.illusion_element && (
                          <div>
                            <dt className="text-gray-400">Illusion</dt>
                            <dd className="text-gray-200">{tradition.illusion_element}</dd>
                          </div>
                        )}
                        {tradition.manipulation_element && (
                          <div>
                            <dt className="text-gray-400">Manipulation</dt>
                            <dd className="text-gray-200">{tradition.manipulation_element}</dd>
                          </div>
                        )}
                      </dl>
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

