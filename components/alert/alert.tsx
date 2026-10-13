// notebook-layout/components/alert/alert.tsx
import { type ComponentProps, type FC } from 'react';
import { generateClasses } from '../../utils/utils';

export interface AlertProps extends ComponentProps<'div'> {
  status: 'success' | 'warning' | 'danger';
}

/**
 * A notice that interrupts: status wash, no border and no radius.
 */
export const Alert: FC<AlertProps> = ({
  status,
  className = '',
  children,
  ...props
}) => (
  <div
    role={status === 'success' ? 'status' : 'alert'}
    {...props}
    className={generateClasses({
      alert: true,
      [`alert-${status}`]: true,
      [className]: Boolean(className),
    })}
  >
    {children}
  </div>
);
