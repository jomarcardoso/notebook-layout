'use client';
// notebook-layout/components/breadcrumbs/breadcrumbs.tsx
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr/CaretLeft';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../atoms/icon';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbsProps extends Omit<
  HTMLAttributes<HTMLOListElement>,
  'children'
> {
  items?: BreadcrumbItem[];
  linkComponent?: ElementType<{ children: ReactNode; href: string }>;
}

export const Breadcrumbs = ({
  items = [],
  linkComponent = 'a',
  ...props
}: BreadcrumbsProps) => (
  <CBreadcrumb {...props}>
    {items.map((item, index) => {
      const current = index === items.length - 1;
      const link =
        !current && item.href
          ? { as: linkComponent, href: item.href }
          : { as: undefined, href: undefined };

      return (
        <CBreadcrumbItem
          key={`${item.href ?? ''}-${index}`}
          active={current}
          {...link}
        >
          {index === items.length - 2 && <Icon icon={CaretLeftIcon} />}
          {item.label}
        </CBreadcrumbItem>
      );
    })}
  </CBreadcrumb>
);
