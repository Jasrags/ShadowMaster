import { useEffect } from 'react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'rgba(0, 255, 136, 0.35)',
          borderColor: 'var(--sr-success)',
          textColor: 'var(--sr-success)',
          glow: '0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.3)',
        };
      case 'warning':
        return {
          bgColor: 'rgba(255, 170, 0, 0.35)',
          borderColor: 'var(--sr-warning)',
          textColor: 'var(--sr-warning)',
          glow: '0 0 10px rgba(255, 170, 0, 0.5), 0 0 20px rgba(255, 170, 0, 0.3)',
        };
      case 'error':
        return {
          bgColor: 'rgba(255, 51, 102, 0.35)',
          borderColor: 'var(--sr-danger)',
          textColor: 'var(--sr-danger)',
          glow: '0 0 10px rgba(255, 51, 102, 0.5), 0 0 20px rgba(255, 51, 102, 0.3)',
        };
      default:
        return {
          bgColor: 'rgba(0, 212, 255, 0.35)',
          borderColor: 'var(--sr-accent)',
          textColor: 'var(--sr-accent)',
          glow: '0 0 10px rgba(0, 212, 255, 0.5), 0 0 20px rgba(0, 212, 255, 0.3)',
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className="border rounded-lg px-4 py-3 shadow-lg flex items-center justify-between gap-4 min-w-[300px] max-w-md animate-in slide-in-from-top-5 fade-in"
      style={{
        backgroundColor: styles.bgColor,
        borderColor: styles.borderColor,
        color: styles.textColor,
        boxShadow: styles.glow,
      }}
    >
      <p className="font-body text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="hover:opacity-70 transition-opacity focus:outline-none"
        style={{ color: styles.textColor }}
        aria-label="Close toast"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  );
}

