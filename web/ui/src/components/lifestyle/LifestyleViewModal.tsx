import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components';
import type { Lifestyle } from '../../lib/types';
import { formatCost } from '../../lib/formatUtils';

interface LifestyleViewModalProps {
  lifestyle: Lifestyle | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function LifestyleViewModal({ lifestyle, isOpen, onOpenChange }: LifestyleViewModalProps) {
  if (!lifestyle) return null;

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
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">{lifestyle.name}</h2>
                    <p className="text-gray-400">Source: {lifestyle.source} • Cost: {formatCost(lifestyle.cost)}</p>
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
                        <dd className="text-gray-200 font-mono text-xs">{lifestyle.id}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Cost</dt>
                        <dd className="text-gray-200">{formatCost(lifestyle.cost)}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Source</dt>
                        <dd className="text-gray-200">{lifestyle.source}</dd>
                      </div>
                    </dl>
                  </div>

                  {lifestyle.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {lifestyle.description}
                      </p>
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

