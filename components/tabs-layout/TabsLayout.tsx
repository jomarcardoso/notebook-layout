'use client';
import type { FC, HTMLProps, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { decorateSections, generateClasses } from '../../utils/utils';
import {
  NotebookTabs,
  type NotebookTabsProps,
} from '../notebook-tabs/notebook-tabs';
import { Tabs, type TabsProps } from '../tabs/Tabs';
import './tabs-layout.scss';
import { useSectionsChildren } from '../../hooks/use-sections-children';

type NotebookTabsBaseProps = Omit<NotebookTabsProps, 'tabs' | 'className'>;
type TabsBaseProps = Omit<TabsProps, 'tabs' | 'className'>;

export interface TabsLayoutProps extends HTMLProps<HTMLDivElement> {
  mobileTabs?: NotebookTabsProps['tabs'];
  desktopTabs?: TabsProps['tabs'];
  mobileProps?: NotebookTabsBaseProps;
  desktopProps?: TabsBaseProps;
  mobileClassName?: string;
  desktopClassName?: string;
}

export const TabsLayout: FC<TabsLayoutProps> = ({
  mobileTabs = [],
  desktopTabs = [],
  children,
  mobileProps,
  desktopProps,
  mobileClassName = '',
  desktopClassName = '',
  className = '',
  ...props
}) => {
  const {
    value: desktopValue,
    defaultValue: desktopDefaultValue,
    onChange: desktopOnChange,
    ...desktopRestProps
  } = desktopProps ?? {};

  const sectionTabs = useSectionsChildren(children);
  const hasAutoSections = sectionTabs.length > 0;
  const sectionIds = sectionTabs.map(({ id }) => id);
  const sectionIdsKey = sectionIds.join('|');

  const [autoDesktopValue, setAutoDesktopValue] = useState<string>(() => {
    if (!sectionIds.length) return '';
    if (
      typeof desktopDefaultValue === 'string' &&
      sectionIds.includes(desktopDefaultValue)
    ) {
      return desktopDefaultValue;
    }

    return sectionIds[0] ?? '';
  });

  useEffect(() => {
    if (!hasAutoSections) return;

    const fallbackValue =
      typeof desktopDefaultValue === 'string' &&
      sectionIds.includes(desktopDefaultValue)
        ? desktopDefaultValue
        : (sectionIds[0] ?? '');

    setAutoDesktopValue((currentValue) => {
      if (currentValue && sectionIds.includes(currentValue)) {
        return currentValue;
      }

      return fallbackValue;
    });
  }, [hasAutoSections, desktopDefaultValue, sectionIdsKey, sectionIds]);

  const activeDesktopSection = hasAutoSections
    ? typeof desktopValue === 'string' && sectionIds.includes(desktopValue)
      ? desktopValue
      : autoDesktopValue
    : desktopValue;

  const generatedMobileTabs: NotebookTabsProps['tabs'] = sectionTabs.map(
    ({ id, safeId, label }) => ({
      children: label,
      href: `#${id}`,
      id: `to-${safeId}`,
    }),
  );

  const generatedDesktopTabs: TabsProps['tabs'] = sectionTabs.map(
    ({ id, safeId, label }) => ({
      label,
      value: id,
      id: `tab-${safeId}`,
    }),
  );

  const resolvedMobileTabs = hasAutoSections ? generatedMobileTabs : mobileTabs;
  const resolvedDesktopTabs = hasAutoSections
    ? generatedDesktopTabs
    : desktopTabs;
  const shouldRenderMobileTabs = resolvedMobileTabs.length > 1;
  const shouldRenderDesktopTabs = resolvedDesktopTabs.length > 1;

  const classes = generateClasses({
    'tabs-layout': true,
    [className]: Boolean(className),
  });

  const mobileClasses = generateClasses({
    'tabs-layout__mobile': true,
    [mobileClassName]: Boolean(mobileClassName),
  });

  const desktopClasses = generateClasses({
    'tabs-layout__desktop': true,
    [desktopClassName]: Boolean(desktopClassName),
  });

  const contentClasses = generateClasses({
    'tabs-layout__content': true,
  });

  const contentNode = hasAutoSections
    ? decorateSections(
        children,
        new Set(sectionIds),
        String(activeDesktopSection ?? ''),
      )
    : children;

  function handleDesktopChange(nextValue: string): void {
    if (hasAutoSections && typeof desktopValue !== 'string') {
      setAutoDesktopValue(nextValue);
    }

    desktopOnChange?.(nextValue);
  }

  return (
    <div className={classes} {...props}>
      {shouldRenderMobileTabs && (
        <NotebookTabs
          tabs={resolvedMobileTabs}
          className={mobileClasses}
          {...mobileProps}
        />
      )}

      {shouldRenderDesktopTabs && (
        <Tabs
          {...desktopRestProps}
          tabs={resolvedDesktopTabs}
          className={desktopClasses}
          value={activeDesktopSection}
          defaultValue={hasAutoSections ? undefined : desktopDefaultValue}
          onChange={handleDesktopChange}
        />
      )}

      <div className={contentClasses}>{contentNode}</div>
    </div>
  );
};

export default TabsLayout;
