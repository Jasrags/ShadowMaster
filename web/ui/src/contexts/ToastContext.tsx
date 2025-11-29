import { createContext, useContext, ReactNode, useState } from 'react';
import { Button } from 'react-aria-components';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'success' | 'error' | 'info' | 'warning';
  timeout?: number;
}

interface Toast extends ToastOptions {
  id: string;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
  showInfo: (title: string, description?: string) => void;
  showWarning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (options: ToastOptions) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = {
      ...options,
      id,
      timeout: options.timeout ?? 5000,
    };

    setToasts((prev) => [...prev, toast]);

    // Auto-dismiss after timeout
    if (toast.timeout && toast.timeout > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, toast.timeout);
    }
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showSuccess = (title: string, description?: string) => {
    showToast({ title, description, variant: 'success' });
  };

  const showError = (title: string, description?: string) => {
    showToast({ title, description, variant: 'error', timeout: 7000 });
  };

  const showInfo = (title: string, description?: string) => {
    showToast({ title, description, variant: 'info' });
  };

  const showWarning = (title: string, description?: string) => {
    showToast({ title, description, variant: 'warning' });
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  const getVariantStyles = (variant?: string) => {
    switch (variant) {
      case 'success':
        return 'border-green-500/70 bg-green-900/80';
      case 'error':
        return 'border-red-500/70 bg-red-900/80';
      case 'warning':
        return 'border-yellow-500/70 bg-yellow-900/80';
      case 'info':
        return 'border-blue-500/70 bg-blue-900/80';
      default:
        return 'border-sr-light-gray bg-sr-gray/90';
    }
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const variant = toast.variant || 'info';
        return (
          <div
            key={toast.id}
            className={`min-w-[300px] max-w-md border rounded-lg shadow-lg p-4 flex items-start gap-3 pointer-events-auto animate-in ${getVariantStyles(variant)}`}
            role="alert"
            aria-live={variant === 'error' ? 'assertive' : 'polite'}
          >
            <div className="flex-1">
              <div className="font-semibold text-gray-100 text-sm">
                {toast.title}
              </div>
              {toast.description && (
                <div className="text-gray-400 text-sm mt-1">
                  {toast.description}
                </div>
              )}
            </div>
            <Button
              onPress={() => onDismiss(toast.id)}
              className="text-gray-400 hover:text-gray-100 transition-colors p-1 rounded hover:bg-sr-light-gray flex-shrink-0"
              aria-label="Close notification"
            >
              <svg
                className="w-4 h-4"
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
          </div>
        );
      })}
    </div>
  );
}

// Custom hook export - intentionally not a component
// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
