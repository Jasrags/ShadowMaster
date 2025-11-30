import { ReactNode } from 'react';
import { Dialog, Modal, Heading, Button } from 'react-aria-components';

export interface ViewModalSection {
  title: string;
  content: ReactNode;
  condition?: boolean;
}

export interface ViewModalProps<T extends { name?: string } = { name?: string }> {
  /** The item being displayed (used for title) */
  item: T | null;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal open state changes */
  onOpenChange: (isOpen: boolean) => void;
  /** Optional subtitle to display below title */
  subtitle?: ReactNode;
  /** Sections to display in the modal */
  sections?: ViewModalSection[];
  /** Custom content (alternative to sections) */
  children?: ReactNode;
  /** Whether to show footer with close button */
  showFooter?: boolean;
  /** Custom footer content */
  footerContent?: ReactNode;
  /** Maximum width of the modal */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
  /** Custom header content (replaces default title/subtitle) */
  headerContent?: ReactNode;
  /** Additional class names */
  className?: string;
  /** Nested modals to render (e.g., for related items) */
  nestedModals?: ReactNode;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-full',
};

export function ViewModal<T extends { name?: string } = { name?: string }>({
  item,
  isOpen,
  onOpenChange,
  subtitle,
  sections = [],
  children,
  showFooter = true,
  footerContent,
  maxWidth = '4xl',
  headerContent,
  className = '',
  nestedModals,
}: ViewModalProps<T>) {
  const handleClose = () => {
    onOpenChange(false);
  };

  if (!item || !isOpen) {
    return null;
  }

  const itemName = item.name || 'Unknown Item';
  const displaySections = sections.filter(section => section.condition !== false);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ zIndex: 50 }}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={handleClose} />
        <Dialog 
          className={`relative bg-sr-gray border border-sr-light-gray rounded-lg shadow-xl ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-hidden outline-none flex flex-col ${className}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-sr-light-gray">
            {headerContent ? (
              headerContent
            ) : (
              <>
                <div>
                  <Heading
                    slot="title"
                    className="text-2xl font-semibold text-gray-100"
                  >
                    {itemName}
                  </Heading>
                  {subtitle && (
                    <div className="mt-1 text-gray-400">
                      {subtitle}
                    </div>
                  )}
                </div>
                <Button
                  onPress={handleClose}
                  aria-label="Close modal"
                  className="p-2 text-gray-400 hover:text-gray-100 hover:bg-sr-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-sr-accent transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {children ? (
              children
            ) : (
              <div className="space-y-6">
                {displaySections.map((section, index) => (
                  <section key={index}>
                    <h2 className="text-lg font-semibold text-gray-200 mb-3">{section.title}</h2>
                    {section.content}
                  </section>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {showFooter && (
            <div className="p-6 border-t border-sr-light-gray flex justify-end">
              {footerContent ? (
                footerContent
              ) : (
                <Button
                  onPress={handleClose}
                  className="px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 hover:bg-sr-light-gray focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors"
                >
                  Close
                </Button>
              )}
            </div>
          )}
        </Dialog>
      </div>
      {nestedModals}
    </Modal>
  );
}
