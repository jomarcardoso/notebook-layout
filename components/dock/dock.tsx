// notebook-layout/components/dock/dock.tsx
import { type ComponentProps, type ElementType, type FC, type ReactNode } from 'react';
import { generateClasses } from '../../utils/utils';
import { Icon, type IconGlyph } from '../atoms/icon';

export interface DockItem {
  href: string;
  label: string;
  icon: IconGlyph;
  iconMarked?: IconGlyph;
  current: boolean;
}

export interface DockProps extends ComponentProps<'nav'> {
  items?: DockItem[];
  linkComponent?: ElementType<{
    children: ReactNode;
    href: string;
    className: string;
    'aria-current'?: 'page';
  }>;
}

/**
 * The main destinations in a row pinned to the screen edge, for the thumb:
 * icon and short label. The current one is in full ink with the filled icon.
 */
export const Dock: FC<DockProps> = ({
  items = [],
  linkComponent: Link = 'a',
  className = '',
  ...props
}) => (
  <nav
    {...props}
    className={generateClasses({ dock: true, [className]: Boolean(className) })}
  >
    <ul className="dock__list">
      {items.map((item) => (
        <li key={item.href} className="dock__entry">
          <Link
            className="dock__item"
            href={item.href}
            aria-current={item.current ? 'page' : undefined}
          >
            <Icon
              icon={item.icon}
              iconMarked={item.iconMarked}
              marked={item.current}
            />
            <span className="dock__label">{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);
