import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationDescriptor {
  id?: string;
  type?: NotificationType;
  title: string;
  description?: string;
  durationMs?: number;
}

export interface Notification extends Required<Omit<NotificationDescriptor, 'durationMs'>> {
  durationMs: number;
  createdAt: number;
}

interface NotificationContextValue {
  pushNotification: (descriptor: NotificationDescriptor) => string;
  dismissNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

function ensureContainer(id: string): { node: Element | null; created: boolean } {
  if (typeof document === 'undefined') {
    return { node: null, created: false };
  }
  let node = document.getElementById(id);
  const created = !node;
  if (!node) {
    node = document.createElement('div');
    node.id = id;
    document.body.appendChild(node);
  }
  return { node, created };
}

const DEFAULT_DURATION = 6000;

function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `notification-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

interface ProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: ProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    const { node, created } = ensureContainer('shadowmaster-notifications');
    setContainer(node);
    const timersMap = timersRef.current;

    return () => {
      timersMap.forEach((timer) => window.clearTimeout(timer));
      timersMap.clear();
      if (created && node?.parentNode) {
        node.parentNode.removeChild(node);
      }
    };
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    const timerId = timersRef.current.get(id);
    if (timerId) {
      window.clearTimeout(timerId);
      timersRef.current.delete(id);
    }
  }, []);

  const pushNotification = useCallback(
    ({ id, type = 'info', title, description, durationMs = DEFAULT_DURATION }: NotificationDescriptor) => {
      const notificationId = id ?? generateId();
      const next: Notification = {
        id: notificationId,
        type,
        title,
        description: description ?? '',
        durationMs,
        createdAt: Date.now(),
      };
      setNotifications((prev) => [...prev, next]);

      if (durationMs > 0) {
        const timerId = window.setTimeout(() => {
          dismissNotification(notificationId);
        }, durationMs);
        timersRef.current.set(notificationId, timerId);
      }

      return notificationId;
    },
    [dismissNotification],
  );

  const value = useMemo(
    () => ({
      pushNotification,
      dismissNotification,
    }),
    [dismissNotification, pushNotification],
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<NotificationDescriptor>;
      if (customEvent.detail) {
        pushNotification(customEvent.detail);
      }
    };

    window.addEventListener('shadowmaster:notify', handler as EventListener);
    window.ShadowmasterNotify = pushNotification;

    return () => {
      window.removeEventListener('shadowmaster:notify', handler as EventListener);
      if (window.ShadowmasterNotify === pushNotification) {
        delete window.ShadowmasterNotify;
      }
    };
  }, [pushNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {container &&
        createPortal(
          <div className="notification-stack" role="status" aria-live="polite">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-toast notification-toast--${notification.type}`}
                data-notification-type={notification.type}
              >
                <div className="notification-toast__content">
                  <strong>{notification.title}</strong>
                  {notification.description && (
                    <p dangerouslySetInnerHTML={{ __html: notification.description.replace(/\n/g, '<br />') }} />
                  )}
                </div>
                <button
                  type="button"
                  className="notification-toast__close"
                  aria-label="Dismiss notification"
                  onClick={() => dismissNotification(notification.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>,
          container,
        )}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

declare global {
  interface Window {
    ShadowmasterNotify?: (descriptor: NotificationDescriptor) => string;
  }
}

