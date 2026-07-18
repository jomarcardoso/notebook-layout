// components/breadcrumbs/breadcrumbs.tsx
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { generateClasses } from '../../utils/utils';
import './breadcrumbs.scss';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbsProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items?: BreadcrumbItem[];
  label?: string;
  linkComponent?: ElementType<{ children: ReactNode; href: string }>;
}

export const Breadcrumbs = ({
  items = [],
  label = 'Breadcrumb',
  linkComponent = 'a',
  className = '',
  ...props
}: BreadcrumbsProps) => {
  const LinkComponent = linkComponent;
  const classes = generateClasses({
    breadcrumbs: true,
    [className]: Boolean(className),
  });

  return (
    <nav aria-label={label} className={classes} {...props}>
      <ol className="breadcrumb">
        {items.map((item, index) => {
          const isActive = index === items.length - 1;

          return (
            <li
              aria-current={isActive ? 'page' : undefined}
              className={generateClasses({
                'breadcrumb-item': true,
                active: isActive,
              })}
              key={`${item.href ?? ''}-${index}`}
            >
              {!isActive && item.href ? (
                <LinkComponent href={item.href}>{item.label}</LinkComponent>
              ) : (
                item.label
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
