// notebook-layout/components/confirm-dialog/confirm-dialog.tsx
'use client';
import {
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { Button } from '../atoms/button';
import { Dialog } from '../dialog/dialog';

export type ConfirmOptions = {
  title: ReactNode;
  message?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type Confirm = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm>(async () => false);

const EMPTY_CONFIRM_OPTIONS: ConfirmOptions = {
  title: '',
  message: '',
  confirmLabel: '',
  cancelLabel: 'Cancelar',
  destructive: false,
};

export interface ConfirmProviderProps {
  children?: ReactNode;
}

export const ConfirmProvider: FC<ConfirmProviderProps> = ({
  children = null,
}) => {
  const [options, setOptions] = useState(EMPTY_CONFIRM_OPTIONS);
  const [open, setOpen] = useState(false);
  const resolveRef = useRef<(answer: boolean) => void>(() => {});

  const settle = useCallback((answer: boolean) => {
    setOpen(false);
    resolveRef.current(answer);
    resolveRef.current = () => {};
  }, []);

  const confirm = useCallback<Confirm>(
    (next) =>
      new Promise<boolean>((resolve) => {
        resolveRef.current(false);
        resolveRef.current = resolve;
        setOptions({ ...EMPTY_CONFIRM_OPTIONS, ...next });
        setOpen(true);
      }),
    [],
  );

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog
        className="confirm-dialog"
        open={open}
        title={options.title}
        onClose={() => settle(false)}
        footer={
          <>
            <Button weight="estruturante" onClick={() => settle(false)}>
              {options.cancelLabel}
            </Button>
            <Button
              weight={
                options.destructive ? 'confirmacao-destrutiva' : 'compromisso'
              }
              onClick={() => settle(true)}
            >
              {options.confirmLabel}
            </Button>
          </>
        }
      >
        {options.message}
      </Dialog>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): Confirm => useContext(ConfirmContext);
