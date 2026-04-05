'use client';

import { type RefObject, useEffect } from 'react';

const CARET_MIRROR_STYLE_PROPERTIES = [
  'box-sizing',
  'width',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'font-family',
  'font-size',
  'font-style',
  'font-variant',
  'font-weight',
  'font-stretch',
  'letter-spacing',
  'line-height',
  'text-transform',
  'text-indent',
  'text-align',
  'direction',
  'white-space',
  'word-spacing',
  'overflow-wrap',
  'word-break',
  'tab-size',
] as const;

interface VerticalViewportRect {
  top: number;
  bottom: number;
}

interface UseDialogFieldRevealOptions {
  dialogRef: RefObject<HTMLDialogElement | null>;
  open?: boolean;
}

const scrollRectIntoContainerView = (
  container: HTMLElement,
  rect: VerticalViewportRect,
  margin = 20,
) => {
  const containerRect = container.getBoundingClientRect();
  const overflowBottom = rect.bottom - (containerRect.bottom - margin);

  if (overflowBottom > 0) {
    container.scrollBy({ top: overflowBottom, behavior: 'auto' });
    return;
  }

  const overflowTop = rect.top - (containerRect.top + margin);

  if (overflowTop < 0) {
    container.scrollBy({ top: overflowTop, behavior: 'auto' });
  }
};

const getElementViewportRect = (element: HTMLElement): VerticalViewportRect => {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    bottom: rect.bottom,
  };
};

const isTextEntryElement = (
  element: HTMLElement | null,
): element is HTMLTextAreaElement | HTMLInputElement =>
  element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement;

const getEditableCaretViewportRect = (
  element: HTMLTextAreaElement | HTMLInputElement,
): VerticalViewportRect | null => {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return null;
  }

  const selectionStart = element.selectionStart;
  if (selectionStart === null || selectionStart < 0) return null;

  const elementRect = element.getBoundingClientRect();
  if (elementRect.width <= 0 || elementRect.height <= 0) return null;

  const mirror = document.createElement('div');
  const marker = document.createElement('span');
  const computedStyle = window.getComputedStyle(element);
  const prefix = element.value.slice(0, selectionStart);
  const suffix = element.value.slice(selectionStart) || '\u200b';
  const isTextarea = element instanceof HTMLTextAreaElement;
  const normalizeText = (value: string) =>
    isTextarea ? value : value.replace(/ /g, '\u00a0');

  mirror.setAttribute('aria-hidden', 'true');
  mirror.style.position = 'fixed';
  mirror.style.left = '-9999px';
  mirror.style.top = '0';
  mirror.style.visibility = 'hidden';
  mirror.style.pointerEvents = 'none';
  mirror.style.overflow = 'hidden';

  CARET_MIRROR_STYLE_PROPERTIES.forEach((property) => {
    const value = computedStyle.getPropertyValue(property);
    if (value) mirror.style.setProperty(property, value);
  });

  mirror.style.whiteSpace = isTextarea ? 'pre-wrap' : 'pre';
  mirror.style.wordBreak = 'break-word';
  mirror.style.overflowWrap = 'break-word';

  mirror.textContent = normalizeText(prefix);

  if (isTextarea && prefix.endsWith('\n')) {
    mirror.textContent += '\u200b';
  }

  marker.textContent = normalizeText(suffix);
  mirror.appendChild(marker);

  document.body.appendChild(mirror);

  try {
    const mirrorRect = mirror.getBoundingClientRect();
    const markerRect = marker.getBoundingClientRect();
    const parsedLineHeight = parseFloat(computedStyle.lineHeight || '0');
    const caretHeight =
      (Number.isFinite(parsedLineHeight) && parsedLineHeight > 0
        ? parsedLineHeight
        : 0) ||
      markerRect.height ||
      elementRect.height;
    const top =
      elementRect.top + (markerRect.top - mirrorRect.top) - element.scrollTop;

    return {
      top,
      bottom: top + Math.max(1, caretHeight),
    };
  } finally {
    mirror.remove();
  }
};

const getFocusableViewportRect = (
  element: HTMLElement,
): VerticalViewportRect => {
  if (!isTextEntryElement(element)) {
    return getElementViewportRect(element);
  }

  return getEditableCaretViewportRect(element) ?? getElementViewportRect(element);
};

export function useDialogFieldReveal({
  dialogRef,
  open,
}: UseDialogFieldRevealOptions) {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    if (typeof window === 'undefined') return;

    const modalBody = dialog.querySelector<HTMLElement>('.modal__body');
    if (!modalBody) return;

    const frames: number[] = [];
    const timers: number[] = [];
    const viewport = window.visualViewport;
    const getActiveElementInsideDialog = () => {
      const activeElement =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

      return activeElement && dialog.contains(activeElement)
        ? activeElement
        : null;
    };

    const clearScheduled = () => {
      frames.splice(0).forEach((frame) => window.cancelAnimationFrame(frame));
      timers.splice(0).forEach((timer) => window.clearTimeout(timer));
    };

    const updateViewportVars = () => {
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const keyboardInset = Math.max(
        0,
        window.innerHeight - viewportHeight - (viewport?.offsetTop ?? 0),
      );

      dialog.style.setProperty(
        '--dialog-visual-viewport-height',
        `${viewportHeight}px`,
      );
      dialog.style.setProperty(
        '--dialog-keyboard-inset',
        `${keyboardInset}px`,
      );
    };

    const revealTarget = (target: HTMLElement) => {
      scrollRectIntoContainerView(modalBody, getFocusableViewportRect(target), 24);
    };

    const scheduleFieldReveal = (candidate?: HTMLElement | null) => {
      const target =
        candidate && modalBody.contains(candidate)
          ? candidate
          : getActiveElementInsideDialog();

      if (!target || !modalBody.contains(target)) return;

      clearScheduled();

      frames.push(
        window.requestAnimationFrame(() => {
          revealTarget(target);
        }),
      );
      frames.push(
        window.requestAnimationFrame(() => {
          frames.push(
            window.requestAnimationFrame(() => {
              revealTarget(target);
            }),
          );
        }),
      );
      timers.push(
        window.setTimeout(() => {
          revealTarget(target);
        }, 220),
      );
    };

    const handleViewportChange = () => {
      updateViewportVars();
      scheduleFieldReveal();
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      scheduleFieldReveal(target);
    };

    const handleInput = (event: Event) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      scheduleFieldReveal(target);
    };

    const handleSelectionChange = () => {
      scheduleFieldReveal();
    };

    handleViewportChange();

    viewport?.addEventListener('resize', handleViewportChange);
    viewport?.addEventListener('scroll', handleViewportChange);
    dialog.addEventListener('focusin', handleFocusIn);
    dialog.addEventListener('input', handleInput);
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      clearScheduled();
      viewport?.removeEventListener('resize', handleViewportChange);
      viewport?.removeEventListener('scroll', handleViewportChange);
      dialog.removeEventListener('focusin', handleFocusIn);
      dialog.removeEventListener('input', handleInput);
      document.removeEventListener('selectionchange', handleSelectionChange);
      dialog.style.removeProperty('--dialog-visual-viewport-height');
      dialog.style.removeProperty('--dialog-keyboard-inset');
    };
  }, [dialogRef, open]);
}
