'use client';
import {
  DialogHTMLAttributes,
  type FC,
  type HTMLProps,
  type ReactNode,
  useEffect,
  useRef,
} from 'react';
import { generateClasses, getOrientation, scrollToTop } from '../../utils/utils';
import { isMobile } from '../../utils/media';
import { Modal } from '../modal';

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
    const dialog = ref.current;
    if (!dialog || !openProp) return;
    if (typeof window === 'undefined') return;

    const isTouchDevice = isMobile();
    if (!isTouchDevice) return;

    const modal =
      dialog.querySelector<HTMLElement>('.modal') ??
      (dialog.firstElementChild instanceof HTMLElement
        ? dialog.firstElementChild
        : null);
    if (!modal) return;

    let startY = 0;
    let offsetY = 0;
    let canDrag = false;
    let dragging = false;
    let startedInsideBody = false;
    let resetTimer: number | undefined;

    const clearResetTimer = () => {
      if (typeof resetTimer === 'number') {
        window.clearTimeout(resetTimer);
        resetTimer = undefined;
      }
    };

    const resetModalStyles = () => {
      clearResetTimer();
      modal.style.transition = '';
      modal.style.transform = '';
      modal.style.willChange = '';
    };

    const restoreModalPosition = () => {
      modal.style.transition = 'transform 180ms ease-out';
      modal.style.transform = 'translateY(0)';
      resetTimer = window.setTimeout(() => {
        resetModalStyles();
      }, 200);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const target = event.target instanceof Element ? event.target : null;
      const body = target?.closest('.modal__body') as HTMLElement | null;
      startedInsideBody = Boolean(body);

      if (body && body.scrollTop > 0) {
        canDrag = false;
        dragging = false;
        return;
      }

      canDrag = true;
      dragging = false;
      startY = event.touches[0].clientY;
      offsetY = 0;
      clearResetTimer();
      modal.style.transition = 'none';
      modal.style.willChange = 'transform';
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!canDrag || event.touches.length !== 1) return;
      const currentY = event.touches[0].clientY;
      const nextOffset = Math.max(0, currentY - startY);
      if (nextOffset <= 0) return;

      const target = event.target instanceof Element ? event.target : null;
      const body = target?.closest('.modal__body') as HTMLElement | null;
      if (startedInsideBody && body && body.scrollTop > 0) return;

      dragging = true;
      offsetY = nextOffset;
      modal.style.transform = `translateY(${Math.round(nextOffset * 0.95)}px)`;
      if (event.cancelable) event.preventDefault();
    };

    const finishDrag = () => {
      if (!canDrag) return;

      canDrag = false;
      const threshold = Math.min(180, modal.clientHeight * 0.22);

      if (dragging && offsetY >= threshold) {
        resetModalStyles();
        dialog.close();
      } else if (dragging) {
        restoreModalPosition();
      } else {
        resetModalStyles();
      }

      dragging = false;
      offsetY = 0;
      startedInsideBody = false;
    };

    dialog.addEventListener('touchstart', handleTouchStart, { passive: true });
    dialog.addEventListener('touchmove', handleTouchMove, { passive: false });
    dialog.addEventListener('touchend', finishDrag);
    dialog.addEventListener('touchcancel', finishDrag);

    return () => {
      dialog.removeEventListener('touchstart', handleTouchStart);
      dialog.removeEventListener('touchmove', handleTouchMove);
      dialog.removeEventListener('touchend', finishDrag);
      dialog.removeEventListener('touchcancel', finishDrag);
      resetModalStyles();
    };
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
    'theme-small': true,
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
