'use client';

import { type RefObject, useEffect } from 'react';
import { isMobile } from '../../utils/media';

const DRAG_INTERACTIVE_SELECTOR =
  'button, a, input, textarea, select, option, label, [role="button"], [role="link"]';

interface UseDialogCloseGestureOptions {
  dialogRef: RefObject<HTMLDialogElement | null>;
  open?: boolean;
}

const shouldStartDrag = (
  dialog: HTMLDialogElement,
  target: Element | null,
): boolean => {
  if (!target) return false;
  if (target === dialog) return true;
  if (target.closest('.modal__body')) return false;
  if (target.closest(DRAG_INTERACTIVE_SELECTOR)) return false;
  return true;
};

export function useDialogCloseGesture({
  dialogRef,
  open,
}: UseDialogCloseGestureOptions) {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
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
      if (!shouldStartDrag(dialog, target)) {
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
  }, [dialogRef, open]);
}
