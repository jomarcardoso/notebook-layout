import type { FC, HTMLProps } from 'react';
import './notebook-tabs.scss';
import { generateClasses } from '../../utils/utils';

export interface NotebookTabProps extends HTMLProps<HTMLLIElement> {
  link?: string;
}

export interface NotebookTabsProps extends HTMLProps<HTMLDivElement> {
  tabs: NotebookTabProps[];
}

export const NotebookTabs: FC<NotebookTabsProps> = ({
  tabs = [],
  className = '',
  ...props
}) => {
  const classes = generateClasses({
    'notebook-tabs': true,
    [className]: className,
  });

  return (
    <nav className={classes} {...props}>
      <ul>
        {tabs.map(({ children, link = '#', ...tabProps }, index) => (
          <li key={String(children)} {...tabProps}>
            <a href={link}>{children}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NotebookTabs;
