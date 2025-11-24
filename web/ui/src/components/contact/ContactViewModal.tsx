import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';
import type { Contact } from '../../lib/types';

interface ContactViewModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ContactViewModal({ contact, isOpen, onOpenChange }: ContactViewModalProps) {
  if (!contact) return null;

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        isDismissable
      >
        <Modal className="bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <Dialog className="p-6">
            {({ close }) => (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">{contact.name || 'Unknown Contact'}</h2>
                    {contact.source && (
                      <p className="text-gray-400">Source: {contact.source}</p>
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
                  {contact.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">{contact.description}</p>
                    </div>
                  )}

                  {contact.uses && contact.uses.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Uses</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {contact.uses.map((use, index) => (
                          <li key={index} className="text-sm text-gray-200">
                            {use}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {contact.places_to_meet && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Places to Meet</h3>
                      <p className="text-sm text-gray-200">{contact.places_to_meet}</p>
                    </div>
                  )}

                  {contact.similar_contacts && contact.similar_contacts.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Similar Contacts</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {contact.similar_contacts.map((similar, index) => (
                          <li key={index} className="text-sm text-gray-200">
                            {similar}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {contact.id && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Details</h3>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <dt className="text-gray-400">ID</dt>
                          <dd className="text-gray-200 font-mono text-xs">{contact.id}</dd>
                        </div>
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

