'use client';
// notebook-layout/components/dialog/dialog.tsx
import {
  type ComponentProps,
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { blockScroll, generateClasses } from '../../utils/utils';
import { Modal } from '../modal';
import { useDialogCloseGesture } from './use-dialog-close-gesture';
import { useDialogFieldReveal } from './use-dialog-field-reveal';

const DIALOG_HISTORY_STATE_KEY = '__dialogHistory';

const readDialogHistoryMarkerId = (state: unknown): string | null => {
  if (typeof state !== 'object' || state === null) return null;

  const value = (state as Record<string, unknown>)[DIALOG_HISTORY_STATE_KEY];

  if (typeof value !== 'object' || value === null) return null;

  const markerId = (value as Record<string, unknown>).id;

  return typeof markerId === 'string' ? markerId : null;
};

const waitForExit = (dialog: HTMLDialogElement) => {
  if (typeof dialog.getAnimations !== 'function') return Promise.resolve();

  getComputedStyle(dialog).getPropertyValue('display');

  return Promise.all(
    dialog
      .getAnimations({ subtree: true })
      .map((animation) => animation.finished.catch(() => animation)),
  ).then(() => undefined);
};

export interface DialogProps extends Omit<
  ComponentProps<'dialog'>,
  'title' | 'onClose'
> {
  title?: ReactNode;
  titleProps?: ComponentProps<'h2'>;
  subtitle?: ReactNode;
  subtitleProps?: ComponentProps<'p'>;
  indicator?: ReactNode;
  indicatorProps?: ComponentProps<'div'>;
  header?: ReactNode;
  headerProps?: ComponentProps<'h2'>;

  children?: ReactNode;
  bodyProps?: ComponentProps<'div'>;

  footer?: ReactNode;
  footerProps?: ComponentProps<'div'>;

  dense?: boolean;
  wide?: boolean;
  blank?: boolean;
  onClose?: () => void;
}

export const Dialog: FC<DialogProps> = ({
  title = '',
  titleProps,
  subtitle = '',
  subtitleProps,
  indicator = '',
  indicatorProps,
  header = '',
  headerProps,
  children = '',
  bodyProps,
  footer = '',
  footerProps,
  dense,
  wide = false,
  className = '',
  open: openProp = false,
  onClose,
  onCancel,
  blank = false,
  ...props
}) => {
  const titleId = useId();
  const descriptionId = useId();
  // Ids per dialog: a confirmation opened over another dialog must not borrow its name.
  const labelling = blank
    ? {}
    : { 'aria-labelledby': titleId, 'aria-describedby': descriptionId };
  const modalProps = {
    title,
    titleProps: { id: titleId, ...titleProps },
    subtitle,
    subtitleProps,
    indicator,
    indicatorProps,
    header,
    headerProps,
    children,
    bodyProps: { id: descriptionId, ...bodyProps },
    footer,
    footerProps,
  };

  const ref = useRef<HTMLDialogElement>(null);
  const [present, setPresent] = useState(openProp);
  const closing = present && !openProp;

  if (openProp && !present) setPresent(true);

  const unblockScrollRef = useRef<(() => void) | null>(null);
  const historyMarkerIdRef = useRef(
    `dialog-${Math.random().toString(36).slice(2, 10)}`,
  );
  const hasHistoryEntryRef = useRef(false);
  const closingFromHistoryRef = useRef(false);

  const releaseScroll = useCallback(() => {
    const release = unblockScrollRef.current;

    unblockScrollRef.current = null;
    release?.();
  }, []);

  const requestClose = useCallback(() => onClose?.(), [onClose]);

  useDialogCloseGesture({
    dialogRef: ref,
    open: openProp,
    onClose: requestClose,
  });
  useDialogFieldReveal({ dialogRef: ref, open: openProp });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (openProp) {
      if (dialog.open) return;

      dialog.showModal();
      releaseScroll();
      unblockScrollRef.current = blockScroll();
      return;
    }

    let active = true;

    void waitForExit(dialog).then(() => {
      if (!active) return;

      if (dialog.open) dialog.close();
      releaseScroll();

      if (hasHistoryEntryRef.current) {
        hasHistoryEntryRef.current = false;

        if (closingFromHistoryRef.current) {
          closingFromHistoryRef.current = false;
        } else if (
          readDialogHistoryMarkerId(window.history.state) ===
          historyMarkerIdRef.current
        ) {
          window.history.back();
        }
      }

      setPresent(false);
    });

    return () => {
      active = false;
    };
  }, [openProp, releaseScroll]);

  useEffect(() => {
    return () => {
      releaseScroll();
    };
  }, [releaseScroll]);

  useEffect(() => {
    if (!openProp || typeof window === 'undefined') return;

    const markerId = historyMarkerIdRef.current;

    if (!hasHistoryEntryRef.current) {
      const currentState =
        typeof window.history.state === 'object' &&
        window.history.state !== null
          ? (window.history.state as Record<string, unknown>)
          : {};

      window.history.pushState(
        { ...currentState, [DIALOG_HISTORY_STATE_KEY]: { id: markerId } },
        '',
      );
      hasHistoryEntryRef.current = true;
      closingFromHistoryRef.current = false;
    }

    const handlePopState = () => {
      if (readDialogHistoryMarkerId(window.history.state) === markerId) return;

      closingFromHistoryRef.current = true;
      requestClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [openProp, requestClose]);

  const classes = generateClasses({
    dialog: true,
    'dialog--closing': closing,
    'dialog--dense': dense,
    'dialog--wide': wide,
    [className]: className,
  });

  return (
    <dialog
      ref={ref}
      {...labelling}
      {...props}
      className={classes}
      role="dialog"
      onCancel={(event) => {
        onCancel?.(event);
        const prevented = event.defaultPrevented;

        event.preventDefault();
        if (!prevented) requestClose();
      }}
      onClose={() => {
        if (openProp) requestClose();
      }}
      onClick={(event) => {
        if (event.target !== ref.current) return;

        ref.current.dispatchEvent(new Event('cancel', { cancelable: true }));
      }}
    >
      {present && (blank ? children : <Modal {...modalProps} />)}
    </dialog>
  );
};
