import { useEffect } from 'react';
import { CloseIcon } from './icons';

export interface ToastMessage {
  id: number;
  message: string;
  tone?: 'info' | 'error';
  action?: { label: string; onClick: () => void };
}

const AUTO_DISMISS_MS = 7000;

/** One toast at a time, announced politely to screen readers. */
const Toast = ({ toast, onDismiss }: { toast: ToastMessage | null; onDismiss: () => void }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className={`toast${toast.tone === 'error' ? ' toast-error' : ''}`}>
          <span>{toast.message}</span>
          {toast.action && (
            <button
              type="button"
              className="toast-action"
              onClick={() => {
                toast.action?.onClick();
                onDismiss();
              }}
            >
              {toast.action.label}
            </button>
          )}
          <button type="button" className="toast-close" onClick={onDismiss} aria-label="Dismiss">
            <CloseIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default Toast;
