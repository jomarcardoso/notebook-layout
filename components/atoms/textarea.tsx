// notebook-layout/components/atoms/textarea.tsx
import { type ComponentProps, type CSSProperties, type FC } from 'react';
import { generateClasses } from '../../utils/utils';

export interface TextareaProps extends Omit<
  ComponentProps<'textarea'>,
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
      className={generateClasses({
        'form-control': true,
        [className]: Boolean(className),
      })}
      style={{ '--field-min-rows': lines, ...(style || {}) } as CSSProperties}
    />
  );
};
