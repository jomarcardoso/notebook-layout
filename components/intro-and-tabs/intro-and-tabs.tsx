'use client';

import type { FC, ReactNode } from 'react';
import { generateClasses } from '../../utils/utils';
import { Intro, type IntroProps } from '../intro';
import { TabsLayout, type TabsLayoutProps } from '../tabs-layout';
import './intro-and-tabs.scss';

export interface IntroAndTabsProps extends Omit<IntroProps, 'children'> {
  children?: ReactNode;
  tabsProps?: TabsLayoutProps;
  tabsClassName?: string;
}

export const IntroAndTabs: FC<IntroAndTabsProps> = ({
  title,
  intro,
  titleAs,
  className = '',
  children,
  tabsProps,
  tabsClassName = '',
  ...props
}) => {
  const classes = generateClasses({
    'intro-and-tabs': true,
    [className]: Boolean(className),
  });

  return (
    <div className={classes}>
      <Intro title={title} intro={intro} titleAs={titleAs} {...props} />
      <TabsLayout className={tabsClassName} {...tabsProps}>
        {children}
      </TabsLayout>
    </div>
  );
};
