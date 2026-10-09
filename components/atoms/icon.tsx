// notebook-layout/components/atoms/icon.tsx
import type { IconWeight } from '@phosphor-icons/react';
import { type ComponentType, type FC } from 'react';

export type IconGlyphProps = {
  className?: string;
  role?: 'img';
  'aria-label'?: string;
  'aria-hidden'?: boolean;
};

export type IconGlyph = ComponentType<IconGlyphProps>;

type PhosphorGlyph = ComponentType<IconGlyphProps & { weight?: IconWeight }>;

export function withWeight(Glyph: PhosphorGlyph, weight: IconWeight): IconGlyph {
  const Weighted: FC<IconGlyphProps> = (props) => (
    <Glyph {...props} weight={weight} />
  );

  return Weighted;
}

export interface IconProps {
  icon: IconGlyph;
  iconMarked?: IconGlyph;
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
