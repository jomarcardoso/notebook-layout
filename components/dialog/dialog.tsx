'use client';
import {
  DialogHTMLAttributes,
  type FC,
  type HTMLProps,
  type ReactNode,
  useEffect,
  useRef,
} from 'react';
import {
  blockScroll,
  generateClasses,
  getOrientation,
  scrollToTop,
} from '../../utils/utils';
import { isMobile } from '../../utils/media';
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

export interface DialogProps extends Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  'title'
> {
  title?: ReactNode;
  titleProps?: HTMLProps<HTMLHeadingElement>;
  subtitle?: ReactNode;
  subtitleProps?: HTMLProps<HTMLParagraphElement>;
  indicator?: ReactNode;
  indicatorProps?: HTMLProps<HTMLDivElement>;
  header?: ReactNode;
  headerProps?: HTMLProps<HTMLHeadingElement>;

  children?: ReactNode;
  bodyProps?: HTMLProps<HTMLDivElement>;

  footer?: ReactNode;
  footerProps?: HTMLProps<HTMLDivElement>;

  noPadding?: boolean;
  dense?: boolean;

  blank?: boolean;
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
  noPadding,
  dense,
  className = '',
  open: openProp,
  blank = false,
  ...props
}) => {
  const modalProps = {
    title,
    titleProps,
    subtitle,
    subtitleProps,
    indicator,
    indicatorProps,
    header,
    headerProps,
    children,
    bodyProps,
    footer,
    footerProps,
  };

  const { onClose } = props as any;
  const ref = useRef<HTMLDialogElement>(null);
  const historyMarkerIdRef = useRef(
    `dialog-${Math.random().toString(36).slice(2, 10)}`,
  );
  const hasHistoryEntryRef = useRef(false);
  const closingFromHistoryRef = useRef(false);

  useDialogCloseGesture({ dialogRef: ref, open: openProp });
  useDialogFieldReveal({ dialogRef: ref, open: openProp });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (openProp) {
      if (!dialog.open) {
        if (getOrientation() === 'landscape') {
          dialog.show();
        } else {
          dialog.showModal();
        }
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [openProp]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !openProp) return;
    if (typeof window === 'undefined') return;

    const markerId = historyMarkerIdRef.current;
    const currentState =
      typeof window.history.state === 'object' && window.history.state !== null
        ? (window.history.state as Record<string, unknown>)
        : {};

    if (!hasHistoryEntryRef.current) {
      window.history.pushState(
        {
          ...currentState,
          [DIALOG_HISTORY_STATE_KEY]: { id: markerId },
        },
        '',
      );
      hasHistoryEntryRef.current = true;
      closingFromHistoryRef.current = false;
    }

    const handlePopState = () => {
      if (!dialog.open || !hasHistoryEntryRef.current) return;
      const activeMarkerId = readDialogHistoryMarkerId(window.history.state);
      if (activeMarkerId === markerId) return;
      closingFromHistoryRef.current = true;
      hasHistoryEntryRef.current = false;
      dialog.close();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [openProp]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !openProp) return;
    if (typeof window === 'undefined') return;

    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;

    const frame = window.requestAnimationFrame(() => {
      const rect = dialog.getBoundingClientRect();

      scrollToTop({
        top: window.scrollY + rect.top,
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [openProp]);

  useEffect(() => {
    if (!openProp) return;
    if (!isMobile()) return;

    return blockScroll();
  }, [openProp]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = (ev: Event) => {
      if (typeof window !== 'undefined' && hasHistoryEntryRef.current) {
        if (closingFromHistoryRef.current) {
          closingFromHistoryRef.current = false;
          hasHistoryEntryRef.current = false;
        } else {
          const markerId = readDialogHistoryMarkerId(window.history.state);

          hasHistoryEntryRef.current = false;
          if (markerId === historyMarkerIdRef.current) {
            window.history.back();
          }
        }
      } else {
        closingFromHistoryRef.current = false;
      }

      if (typeof onClose === 'function') onClose(ev);
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const classes = generateClasses({
    dialog: true,
    '-no-padding': noPadding,
    '-dense': dense,
    [className]: className,
  });
  return (
    <dialog
      ref={ref}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={classes}
      role="dialog"
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      {...props}
    >
      {!blank ? <Modal {...modalProps} /> : children}
    </dialog>
  );
};
