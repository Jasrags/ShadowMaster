import { Dialog, DialogTrigger, Modal, Heading, Button } from 'react-aria-components';
import { ReactNode, useState } from 'react';

interface DeleteConfirmationDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  trigger: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function DeleteConfirmationDialog({
  title,
  message,
  onConfirm,
  trigger,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
}: DeleteConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      {trigger}
      <Modal className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <Dialog className="relative bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl max-w-md w-full p-6 outline-none">
          <Heading
            slot="title"
            className="text-xl font-semibold text-gray-100 mb-4"
          >
            {title}
          </Heading>
          <p className="text-gray-300 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <Button
              onPress={() => setIsOpen(false)}
              className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors"
            >
              {cancelLabel}
            </Button>
            <Button
              onPress={handleConfirm}
              className="px-4 py-2 bg-sr-danger border border-sr-danger rounded-md text-gray-100 hover:bg-sr-danger/80 focus:outline-none focus:ring-2 focus:ring-sr-danger focus:border-transparent transition-colors"
              autoFocus
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}

