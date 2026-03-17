'use client';

import type { FC, HTMLProps } from 'react';
import { useEffect } from 'react';
import './notebook-tabs.scss';
import { generateClasses, scrollToTop } from '../../utils/utils';
import { scrollspy } from 'ovos';

export type NotebookTabProps = HTMLProps<HTMLAnchorElement>;

export interface NotebookTabsProps extends HTMLProps<HTMLDivElement> {
  tabs: NotebookTabProps[];
  useScrollspy?: boolean;
}

function getVisibleElementByHash(href: string): HTMLElement | null {
  if (!href.startsWith('#') || href === '#') return null;

  const rawId = href.slice(1);
  if (!rawId) return null;

  const escapedId =
    typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
      ? CSS.escape(rawId)
      : rawId.replace(/([^a-zA-Z0-9_-])/g, '\\$1');

  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>(`#${escapedId}`),
  );

  if (!nodes.length) return null;

  const visibleNode = nodes.find((node) =>
    Boolean(node.offsetParent || node.getClientRects().length),
  );

  return visibleNode ?? nodes[0] ?? null;
}

export const NotebookTabs: FC<NotebookTabsProps> = ({
  tabs = [],
  useScrollspy = true,
  className = '',
  ...props
}) => {
  useEffect(() => {
    if (!useScrollspy || !tabs.length) return;

    const list = tabs
      .map(({ id, href = '#' }) => {
        if (!id || !href.startsWith('#') || href === '#') return null;

        const menuId = String(id);
        const elMenu = document.getElementById(menuId);
        const elContent = getVisibleElementByHash(href);
        if (!elMenu || !elContent) return null;

        return { elMenu, elContent };
      })
      .filter((item): item is { elMenu: HTMLElement; elContent: HTMLElement } =>
        Boolean(item),
      );

    if (!list.length) return;

    const controller = scrollspy({ list });
    return () => controller.destroy();
  }, [tabs, useScrollspy]);

  function handleClick(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href?: string,
  ) {
    if (!href || !href.startsWith('#')) return;
    // Ignore empty hash to avoid invalid selector errors
    if (href === '#') return;

    const target = getVisibleElementByHash(href);
    if (!target) return;

    event.preventDefault();
    // target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    scrollToTop({
      top: target.offsetTop,
    });
  }

  const classes = generateClasses({
    'notebook-tabs': true,
    [className]: className,
  });

  return (
    <nav className={classes} {...props}>
      <ul>
        {tabs.map(({ children, href = '#', ...tabProps }) => (
          <li key={String(children)}>
            <a
              {...tabProps}
              href={href}
              onClick={(ev) => handleClick(ev, href)}
            >
              {children}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NotebookTabs;
