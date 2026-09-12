// notebook-layout/components/atoms/textarea.tsx
import {
  type CSSProperties,
  type FC,
  type TextareaHTMLAttributes,
} from 'react';

export interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'className'
> {
  className?: string;
  minRows?: number | string;
}

/**
 * O INPUT E UMA LINHA, A TEXTAREA E UMA FOLHA.
 */
export const Textarea: FC<TextareaProps> = ({
  className = '',
  rows = 3,
  minRows,
  style,
  ...props
}) => {
  const lines = Number(minRows ?? rows) || 1;

  return (
    <textarea
      {...props}
      rows={lines}
      className={['form-control', className].filter(Boolean).join(' ')}
      style={{ '--field-min-rows': lines, ...(style || {}) } as CSSProperties}
    />
  );
};
