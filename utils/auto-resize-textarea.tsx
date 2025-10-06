import { useRef, useEffect, useCallback, TextareaHTMLAttributes } from 'react';

type AutoResizeTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = (
  props,
) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

  return (
    <textarea
      {...props}
      ref={textareaRef}
      rows={1}
      onInput={(e) => {
        resize();
        props.onInput?.(e);
      }}
      style={{ resize: 'none', overflow: 'hidden', ...props.style }}
    />
  );
};
