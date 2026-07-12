// notebook-layout/utils/auto-resize-textarea.tsx
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type FC,
  type TextareaHTMLAttributes,
} from 'react';

const useBrowserLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

export type AutoResizeTextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    minRows?: number | string;
  };

export const AutoResizeTextarea: FC<AutoResizeTextareaProps> = (props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Filter non-DOM prop `minRows` to avoid React warning
  const { minRows, style, onInput, ...rest } = props as AutoResizeTextareaProps & {
    minRows?: number | string;
  };

  const resize = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // reset before measuring
      const nextHeight = textarea.scrollHeight;
      if (nextHeight > 0) {
        textarea.style.height = `${nextHeight}px`;
      } else if (textarea.style.height === '' || textarea.style.height === '0px') {
        textarea.style.height = `${textarea.rows * 1.25 * 16}px`;
      }
    }
  }, []);

  useBrowserLayoutEffect(() => {
    resize();
  }, [resize, props.value, props.defaultValue, minRows]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const frame = requestAnimationFrame(resize);
    const resizeObserver =
      typeof ResizeObserver === 'function'
        ? new ResizeObserver(() => resize())
        : null;
    let disposed = false;
    resizeObserver?.observe(textarea);
    document.fonts?.ready.then(() => {
      if (!disposed) resize();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
    };
  }, [resize]);

  const initialRows =
    typeof minRows === 'string'
      ? parseInt(minRows, 10) || 1
      : minRows ?? 1;

  return (
    <textarea
      {...rest}
      ref={textareaRef}
      rows={initialRows}
      onInput={(e) => {
        resize();
        onInput?.(e);
      }}
      style={{
        resize: 'none',
        overflow: 'hidden',
        minHeight: `${initialRows * 1.25}em`,
        ...(style || {}),
      }}
    />
  );
};
