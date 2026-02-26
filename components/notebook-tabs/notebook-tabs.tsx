import type { FC, HTMLProps } from 'react';
import { useEffect } from 'react';
import './notebook-tabs.scss';
import { generateClasses } from '../../utils/utils';
import { scrollspy } from 'ovos';

export type NotebookTabProps = HTMLProps<HTMLAnchorElement>;

export interface NotebookTabsProps extends HTMLProps<HTMLDivElement> {
  tabs: NotebookTabProps[];
  useScrollspy?: boolean;
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
        const contentId = href.slice(1);
        if (!contentId) return null;

        const elMenu = document.getElementById(menuId);
        const elContent = document.getElementById(contentId);
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

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();
    // target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.scrollingElement?.scrollTo({
      top: target.offsetTop,
      behavior: 'smooth',
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
