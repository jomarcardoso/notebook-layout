'use client';
// notebook-layout/components/sidebar/sidebar.tsx
import {
  CNavItem,
  CNavLink,
  CSidebar,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarNav,
  CSidebarToggler,
} from '@coreui/react';
import {
  type ComponentProps,
  type ElementType,
  type FC,
  type ReactNode,
} from 'react';
import { generateClasses } from '../../utils/utils';
import { Icon, type IconGlyph } from '../atoms/icon';
import { toggleSidebarFold, useSidebarFolded } from './sidebar-fold';

export interface SidebarItem {
  href: string;
  label: string;
  icon: IconGlyph;
  iconMarked?: IconGlyph;
  current: boolean;
}

export interface SidebarProps extends ComponentProps<'div'> {
  items?: SidebarItem[];
  header?: ReactNode;
  foldLabel?: string;
  unfoldLabel?: string;
  linkComponent?: ElementType;
}

/**
 * O trilho de navegacao do app. Recolhe para os icones, e a escolha do leitor
 * vale para todas as paginas.
 */
export const Sidebar: FC<SidebarProps> = ({
  items = [],
  header = '',
  foldLabel = 'Recolher o menu',
  unfoldLabel = 'Fixar o menu aberto',
  linkComponent = 'a',
  className = '',
  ...props
}) => {
  const folded = useSidebarFolded();

  return (
    <CSidebar
      {...props}
      className={generateClasses({ [className]: Boolean(className) })}
      unfoldable={folded}
    >
      {header && (
        <CSidebarHeader>
          <div className="d-sidebar-narrow-none">{header}</div>
        </CSidebarHeader>
      )}

      <CSidebarNav>
        {items.map((item) => (
          <CNavItem key={item.href}>
            <CNavLink
              as={linkComponent}
              href={item.href}
              active={item.current}
              title={item.label}
            >
              <Icon
                icon={item.icon}
                iconMarked={item.iconMarked}
                marked={item.current}
                className="nav-icon"
              />
              {item.label}
            </CNavLink>
          </CNavItem>
        ))}
      </CSidebarNav>

      <CSidebarFooter>
        <CSidebarToggler
          aria-label={folded ? unfoldLabel : foldLabel}
          aria-expanded={!folded}
          onClick={toggleSidebarFold}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};
