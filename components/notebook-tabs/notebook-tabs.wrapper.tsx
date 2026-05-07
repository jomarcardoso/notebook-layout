import { FC } from 'react';
import {
  NotebookTabsContainer,
  NotebookTabsContainerProps,
} from './notebook-tabs.container';
import { useSectionsChildren } from '../../hooks/use-sections-children';
import { decorateSections } from '../../utils/utils';

export type NotebookTabsWrapperProps = Partial<NotebookTabsContainerProps>;

export const NotebookTabsWrapper: FC<NotebookTabsWrapperProps> = ({
  children,
  ...props
}) => {
  const sectionTabs = useSectionsChildren(children);
  const sectionIds = sectionTabs.map(({ id }) => id);

  const tabs: NotebookTabsWrapperProps['tabs'] = sectionTabs.map(
    ({ id, safeId, label }) => ({
      children: label,
      href: `#${id}`,
      id: `to-${safeId}`,
    }),
  );

  const contentNode = decorateSections(children, new Set(sectionIds));

  return (
    <NotebookTabsContainer tabs={tabs} {...props}>
      {contentNode}
    </NotebookTabsContainer>
  );
};
