import './notebook-tabs.container.scss';
import { FC } from 'react';
import { generateClasses } from '../../utils/utils';
import { NotebookTabs, NotebookTabsProps } from './notebook-tabs';

export interface NotebookTabsContainerProps extends NotebookTabsProps {
  /** A lombada so entra na tela estreita. */
  narrowOnly?: boolean;
}

export const NotebookTabsContainer: FC<NotebookTabsContainerProps> = ({
  className = '',
  narrowOnly = false,
  children,
  ...props
}) => {
  const classes = generateClasses({
    'notebook-tabs-container': true,
    'notebook-tabs-container--narrow': narrowOnly,
    [className]: className,
  });

  return (
    <div className={classes}>
      <NotebookTabs {...props} />

      <div className="notebook-tabs-container__content">{children}</div>
    </div>
  );
};
