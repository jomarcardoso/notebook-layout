// notebook-layout/components/atoms/icon-button.tsx
import { type ComponentProps, type FC } from 'react';
import { generateClasses } from '../../utils/utils';
import { Icon, type IconGlyph } from './icon';

export interface IconButtonProps extends Omit<
  ComponentProps<'button'>,
  'className'
> {
  icon: IconGlyph;
  iconMarked?: IconGlyph;
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
    className={generateClasses({
      'btn btn-ghost-secondary btn-icon': true,
      [className]: Boolean(className),
    })}
    aria-label={label}
    aria-pressed={pressed}
  >
    <Icon icon={icon} iconMarked={iconMarked} marked={pressed} />
  </button>
);
