// notebook-layout/components/notebook-tabs/notebook-tabs.container.tsx
import './notebook-tabs.container.scss';
import { type FC } from 'react';
import { generateClasses } from '../../utils/utils';
import { NotebookTabs, NotebookTabsProps } from './notebook-tabs';

export interface NotebookTabsContainerProps extends NotebookTabsProps {
  /** The spine only enters on the narrow screen. */
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

      <div className="notebook-tabs-container__content l-stack -container">
        {children}
      </div>
    </div>
  );
};
