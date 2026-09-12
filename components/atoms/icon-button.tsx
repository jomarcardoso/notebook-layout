// notebook-layout/components/atoms/icon-button.tsx
import { type ButtonHTMLAttributes, type FC } from 'react';
import { type IconType } from 'react-icons';
import { Icon } from './icon';

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className'
> {
  icon: IconType;
  iconMarked?: IconType;
  label: string;
  pressed?: boolean;
  className?: string;
}

export const IconButton: FC<IconButtonProps> = ({
  icon,
  iconMarked,
  label,
  pressed,
  className = '',
  type = 'button',
  ...props
}) => (
  <button
    {...props}
    type={type}
    className={['btn', 'btn-ghost-secondary', 'btn-icon', className]
      .filter(Boolean)
      .join(' ')}
    aria-label={label}
    aria-pressed={pressed}
  >
    <Icon icon={icon} iconMarked={iconMarked} marked={pressed} />
  </button>
);
