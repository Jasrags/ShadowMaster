import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components';

interface DeleteConfirmModalProps<T> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: T | null;
  itemName: string | ((item: T) => string);
  title: string;
  message?: string;
  onConfirm: () => void | Promise<void>;
  isDeleting?: boolean;
  deleteLabel?: string;
  cancelLabel?: string;
}

export function DeleteConfirmModal<T>({
  isOpen,
  onOpenChange,
  item,
  itemName,
  title,
  message,
  onConfirm,
  isDeleting = false,
  deleteLabel = 'Delete',
  cancelLabel = 'Cancel',
}: DeleteConfirmModalProps<T>) {
  const displayName = item
    ? typeof itemName === 'function'
      ? itemName(item)
      : itemName
    : '';

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        isDismissable
      >
        <Modal className="bg-sr-gray border border-sr-light-gray rounded-lg p-6 max-w-md w-full mx-4">
          <Dialog>
            {({ close }) => (
              <>
                <Heading
                  slot="title"
                  className="text-2xl font-bold text-gray-100 mb-4"
                >
                  {title}
                </Heading>
                <div className="text-gray-300 mb-6">
                  <p>
                    Are you sure you want to delete{' '}
                    <strong className="text-gray-100">{displayName}</strong>?
                  </p>
                  {message ? (
                    <p className="mt-2 text-sm text-gray-400">{message}</p>
                  ) : (
                    <p className="mt-2 text-sm text-gray-400">
                      This action cannot be undone.
                    </p>
                  )}
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    onPress={() => {
                      onOpenChange(false);
                    }}
                    className="px-4 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 
                               data-[hovered]:bg-sr-darker/80 
                               data-[pressed]:bg-sr-light-gray
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                               data-[focus-visible]:ring-sr-accent data-[focus-visible]:border-transparent 
                               transition-colors font-medium"
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    onPress={async () => {
                      await onConfirm();
                    }}
                    isDisabled={isDeleting}
                    className="px-4 py-2 bg-sr-danger border border-sr-danger rounded-md text-gray-100 
                               data-[hovered]:bg-sr-danger/80 
                               data-[pressed]:bg-sr-danger-dark
                               data-[focus-visible]:outline-none data-[focus-visible]:ring-2 
                               data-[focus-visible]:ring-sr-danger data-[focus-visible]:border-transparent 
                               data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
                               transition-colors font-medium"
                  >
                    {isDeleting ? 'Deleting...' : deleteLabel}
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

