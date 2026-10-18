// notebook-layout/components/breadcrumbs/breadcrumbs.tsx
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr/CaretLeft';
import { type ComponentProps, type ElementType, type ReactNode } from 'react';
import { generateClasses } from '../../utils/utils';
import { Icon } from '../atoms/icon';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbsProps extends Omit<
  ComponentProps<'ol'>,
  'children'
> {
  items?: BreadcrumbItem[];
  label?: string;
  linkComponent?: ElementType<{ children: ReactNode; href: string }>;
}

export const Breadcrumbs = ({
  items = [],
  label = 'Trilha de navegação',
  linkComponent: Link = 'a',
  className = '',
  ...props
}: BreadcrumbsProps) => (
  <nav aria-label={label}>
    <ol
      {...props}
      className={generateClasses({
        breadcrumb: true,
        [className]: Boolean(className),
      })}
    >
      {items.map((item, index) => {
        const current = index === items.length - 1;
        const content = (
          <>
            {index === items.length - 2 && <Icon icon={CaretLeftIcon} />}
            {item.label}
          </>
        );

        return (
          <li
            key={`${item.href ?? ''}-${index}`}
            className={current ? 'breadcrumb-item active' : 'breadcrumb-item'}
            aria-current={current ? 'page' : undefined}
          >
            {!current && item.href ? (
              <Link className="link" href={item.href}>{content}</Link>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
