// notebook-layout/components/atoms/tag.tsx
import { type FC, type ReactNode } from 'react';

export interface TagProps {
  children: ReactNode;
  status?: 'success' | 'warning' | 'danger';
  count?: boolean;
  className?: string;
}

/**
 * UM MARCADOR ESTATICO.
 */
export const Tag: FC<TagProps> = ({
  children,
  status,
  count = false,
  className = '',
}) => (
  <span
    className={['badge', className].filter(Boolean).join(' ')}
    data-status={status}
    data-count={count || undefined}
  >
    {children}
  </span>
);
