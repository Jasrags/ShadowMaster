import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';
import type { Book } from '../../lib/types';

interface BookViewModalProps {
  book: Book | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function BookViewModal({ book, isOpen, onOpenChange }: BookViewModalProps) {
  if (!book) return null;

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
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">{book.name}</h2>
                    <p className="text-gray-400">Code: {book.code}</p>
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
                      <div>
                        <dt className="text-gray-400">ID</dt>
                        <dd className="text-gray-200 font-mono text-xs">{book.id}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Code</dt>
                        <dd className="text-gray-200">{book.code}</dd>
                      </div>
                      {book.permanent && (
                        <div>
                          <dt className="text-gray-400">Permanent</dt>
                          <dd className="text-gray-200">Yes</dd>
                        </div>
                      )}
                      {book.hide && (
                        <div>
                          <dt className="text-gray-400">Hide</dt>
                          <dd className="text-gray-200">{book.hide}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {book.matches?.match && book.matches.match.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">
                        Text Matches ({book.matches.match.length})
                      </h3>
                      <div className="space-y-2">
                        {book.matches.match.map((match, index) => (
                          <div
                            key={index}
                            className="bg-sr-dark border border-sr-light-gray rounded p-3"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-sr-accent uppercase">
                                {match.language}
                              </span>
                              <span className="text-xs text-gray-400">Page {match.page}</span>
                            </div>
                            <p className="text-sm text-gray-300 italic">{match.text}</p>
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

