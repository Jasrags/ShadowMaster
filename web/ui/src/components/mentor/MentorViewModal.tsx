import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';
import type { Mentor } from '../../lib/types';

interface MentorViewModalProps {
  mentor: Mentor | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function MentorViewModal({ mentor, isOpen, onOpenChange }: MentorViewModalProps) {
  if (!mentor) return null;

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
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">{mentor.name || 'Unknown Mentor'}</h2>
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
                  {mentor.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">{mentor.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Details</h3>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      {mentor.similar_archetypes && mentor.similar_archetypes.length > 0 && (
                        <div className="col-span-2">
                          <dt className="text-gray-400">Similar Archetypes</dt>
                          <dd className="text-gray-200">{mentor.similar_archetypes.join(', ')}</dd>
                        </div>
                      )}
                      {mentor.source?.source && (
                        <div>
                          <dt className="text-gray-400">Source</dt>
                          <dd className="text-gray-200">{mentor.source.source}</dd>
                        </div>
                      )}
                      {mentor.source?.page && (
                        <div>
                          <dt className="text-gray-400">Page</dt>
                          <dd className="text-gray-200">{mentor.source.page}</dd>
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

