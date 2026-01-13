"use client";

/**
 * BaseModal
 *
 * Accessible modal foundation using react-aria-components.
 * Provides automatic focus trapping, Escape key handling, and
 * click-outside-to-close functionality.
 *
 * Replaces raw div-based modals throughout the creation flow.
 *
 * @see https://react-spectrum.adobe.com/react-aria/Modal.html
 */

import { ReactNode } from "react";
import {
  Dialog,
  DialogProps,
  Heading,
  Modal,
  ModalOverlay,
  ModalOverlayProps,
} from "react-aria-components";
import { X } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

export type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface BaseModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title (displayed in header) */
  title: string;
  /** Modal content */
  children: ReactNode;
  /** Modal size preset */
  size?: ModalSize;
  /** Whether clicking outside closes the modal (default: true) */
  isDismissable?: boolean;
  /** Whether to show the close button (default: true) */
  showCloseButton?: boolean;
  /** Additional className for the modal container */
  className?: string;
  /** Z-index level for stacking modals */
  zIndex?: number;
}

export interface ModalHeaderProps {
  /** Title text */
  title: string;
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Close handler */
  onClose: () => void;
  /** Optional additional content in header */
  children?: ReactNode;
}

export interface ModalBodyProps {
  /** Body content */
  children: ReactNode;
  /** Additional className */
  className?: string;
  /** Whether body should scroll independently */
  scrollable?: boolean;
}

export interface ModalFooterProps {
  /** Footer content */
  children: ReactNode;
  /** Additional className */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-4xl",
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Modal header with title and optional close button
 */
export function ModalHeader({
  title,
  showCloseButton = true,
  onClose,
  children,
}: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
      <div className="flex items-center gap-3">
        <Heading slot="title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </Heading>
        {children}
      </div>
      {showCloseButton && (
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/**
 * Scrollable modal body
 */
export function ModalBody({ children, className = "", scrollable = true }: ModalBodyProps) {
  return (
    <div
      className={`min-h-0 flex-1 ${scrollable ? "overflow-y-auto" : "flex flex-col"} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Modal footer for actions
 */
export function ModalFooter({ children, className = "" }: ModalFooterProps) {
  return (
    <div
      className={`flex items-center justify-between border-t border-zinc-200 px-6 py-4 dark:border-zinc-700 ${className}`}
    >
      {children}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Accessible modal component with focus trapping and keyboard handling.
 *
 * Features:
 * - Focus is automatically trapped inside the modal
 * - Escape key closes the modal
 * - Click outside closes the modal (configurable)
 * - Focus is restored to trigger element on close
 * - Proper ARIA attributes for screen readers
 *
 * @example
 * ```tsx
 * <BaseModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Add Skill"
 *   size="lg"
 * >
 *   <ModalBody className="p-6">
 *     <p>Modal content here</p>
 *   </ModalBody>
 *   <ModalFooter>
 *     <button onClick={handleClose}>Cancel</button>
 *     <button onClick={handleConfirm}>Confirm</button>
 *   </ModalFooter>
 * </BaseModal>
 * ```
 */
export function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  size = "lg",
  isDismissable = true,
  showCloseButton = true,
  className = "",
  zIndex = 50,
}: BaseModalProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable={isDismissable}
      className={`fixed inset-0 z-${zIndex} flex items-center justify-center bg-black/50 p-4`}
      style={{ zIndex }}
    >
      <Modal
        className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900 ${SIZE_CLASSES[size]} ${className}`}
      >
        <Dialog className="flex max-h-[90vh] flex-col outline-none">
          {({ close }) => (
            <>
              <ModalHeader title={title} showCloseButton={showCloseButton} onClose={close} />
              {children}
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

// =============================================================================
// COMPOUND COMPONENT PATTERN
// =============================================================================

/**
 * Alternative compound component API for more control
 *
 * @example
 * ```tsx
 * <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="xl">
 *   {({ close }) => (
 *     <>
 *       <ModalHeader title="Custom Modal" onClose={close} />
 *       <ModalBody className="p-6">
 *         <p>Content</p>
 *       </ModalBody>
 *       <ModalFooter>
 *         <button onClick={close}>Done</button>
 *       </ModalFooter>
 *     </>
 *   )}
 * </BaseModalRoot>
 * ```
 */
export interface BaseModalRootProps {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  isDismissable?: boolean;
  className?: string;
  zIndex?: number;
  children: (props: { close: () => void }) => ReactNode;
}

export function BaseModalRoot({
  isOpen,
  onClose,
  size = "lg",
  isDismissable = true,
  className = "",
  zIndex = 50,
  children,
}: BaseModalRootProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable={isDismissable}
      className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
      style={{ zIndex }}
    >
      <Modal
        className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900 ${SIZE_CLASSES[size]} ${className}`}
      >
        <Dialog className="flex max-h-[90vh] flex-col outline-none">
          {({ close }) => <>{children({ close })}</>}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default BaseModal;
