import './notebook-tabs.container.scss';
import { FC } from 'react';
import { generateClasses } from '../../utils/utils';
import { NotebookTabs, NotebookTabsProps } from './notebook-tabs';

export interface NotebookTabsContainerProps extends NotebookTabsProps {}

export const NotebookTabsContainer: FC<NotebookTabsContainerProps> = ({
  className = '',
  children,
  ...props
}) => {
  const classes = generateClasses({
    'notebook-tabs-container': true,
    [className]: className,
  });

  return (
    <div className={classes}>
      <NotebookTabs {...props} />

      <div className="notebook-tabs-container__content">{children}</div>
    </div>
  );
};
