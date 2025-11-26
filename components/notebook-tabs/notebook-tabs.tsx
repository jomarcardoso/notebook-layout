import type { FC, HTMLProps } from 'react';
import './notebook-tabs.scss';
import { generateClasses } from '../../utils/utils';

export interface NotebookTabsProps extends HTMLProps<HTMLDivElement> {
  tabs: HTMLProps<HTMLAnchorElement>[];
}

export const NotebookTabs: FC<NotebookTabsProps> = ({
  tabs = [],
  className = '',
  ...props
}) => {
  function handleClick(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href?: string,
  ) {
    if (!href || !href.startsWith('#')) return;
    // Ignore empty hash to avoid invalid selector errors
    if (href === '#') return;

    const target = document.querySelector(href) as HTMLElement | null;
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
