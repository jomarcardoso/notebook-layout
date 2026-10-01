// notebook-layout/components/toast/toast.tsx
'use client';
import {
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from '../atoms/button';

export type ToastTone = 'neutral' | 'danger';

export type ToastOptions = { tone?: ToastTone };

type ToastEntry = { id: number; message: ReactNode; tone: ToastTone };

type Notify = (message: ReactNode, options?: ToastOptions) => void;

const ToastContext = createContext<Notify>(() => {});

export interface ToastProviderProps {
  children?: ReactNode;
  duration?: number;
  closeLabel?: string;
}

const ToastItem: FC<{
  entry: ToastEntry;
  duration: number;
  closeLabel: string;
  onDismiss: (id: number) => void;
}> = ({ entry, duration, closeLabel, onDismiss }) => {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(entry.id), duration);

    return () => window.clearTimeout(timer);
  }, [duration, entry.id, onDismiss]);

  return (
    <div className={entry.tone === 'danger' ? 'toast -danger' : 'toast'}>
      <p className="toast__message">{entry.message}</p>
      <Button
        weight="texto"
        className="toast__close"
        onClick={() => onDismiss(entry.id)}
      >
        {closeLabel}
      </Button>
    </div>
  );
};

// The live regions stay in the page so a screen reader is already listening when a notice arrives.
export const ToastProvider: FC<ToastProviderProps> = ({
  children = null,
  duration = 6000,
  closeLabel = 'Fechar',
}) => {
  const [entries, setEntries] = useState<ToastEntry[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const notify = useCallback<Notify>((message, options = {}) => {
    nextId.current += 1;
    const entry = {
      id: nextId.current,
      message,
      tone: options.tone ?? 'neutral',
    };

    setEntries((current) => [...current, entry]);
  }, []);

  const renderTone = (tone: ToastTone) =>
    entries
      .filter((entry) => entry.tone === tone)
      .map((entry) => (
        <ToastItem
          key={entry.id}
          entry={entry}
          duration={duration}
          closeLabel={closeLabel}
          onDismiss={dismiss}
        />
      ));

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="toast-region">
        <div role="status" aria-live="polite" className="toast-region__live">
          {renderTone('neutral')}
        </div>
        <div role="alert" aria-live="assertive" className="toast-region__live">
          {renderTone('danger')}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): Notify => useContext(ToastContext);
