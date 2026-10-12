// notebook-layout/components/atoms/tag.tsx
import { type ComponentProps, type FC } from 'react';
import { generateClasses } from '../../utils/utils';

export interface TagProps extends ComponentProps<'span'> {
  status?: 'success' | 'warning' | 'danger' | '';
  count?: boolean;
}

/**
 * UM MARCADOR ESTATICO.
 */
export const Tag: FC<TagProps> = ({
  status = '',
  count = false,
  className = '',
  children,
  ...props
}) => (
  <span
    {...props}
    className={generateClasses({
      badge: true,
      [className]: Boolean(className),
    })}
    data-status={status || undefined}
    data-count={count || undefined}
  >
    {children}
  </span>
);
