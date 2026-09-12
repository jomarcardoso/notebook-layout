// notebook-layout/components/atoms/icon.tsx
import { type FC } from 'react';
import { type IconType } from 'react-icons';

export interface IconProps {
  icon: IconType;
  iconMarked?: IconType;
  marked?: boolean;
  label?: string;
  className?: string;
}

export const Icon: FC<IconProps> = ({
  icon,
  iconMarked,
  marked = false,
  label = '',
  className = '',
}) => {
  const Glyph = marked && iconMarked ? iconMarked : icon;
  const a11y = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const };

  return (
    <Glyph
      {...a11y}
      className={className ? `app-icon ${className}` : 'app-icon'}
    />
  );
};
