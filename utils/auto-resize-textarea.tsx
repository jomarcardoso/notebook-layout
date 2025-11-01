import { useRef, useEffect, useCallback, TextareaHTMLAttributes } from 'react';

type AutoResizeTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = (
  props,
) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Filter non-DOM prop `minRows` to avoid React warning
  const { minRows, style, onInput, ...rest } = props as AutoResizeTextareaProps & {
    minRows?: number | string;
  };

  const resize = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // reset before measuring
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    resize();
  }, [props.value, resize]);

  const initialRows = typeof minRows === 'string' ? parseInt(minRows, 10) || 1 : (minRows ?? 1);

  return (
    <textarea
      {...rest}
      ref={textareaRef}
      rows={initialRows}
      onInput={(e) => {
        resize();
        onInput?.(e);
      }}
      style={{ resize: 'none', overflow: 'hidden', ...(style || {}) }}
    />
  );
};
