'use client';
import type { FC, HTMLProps, ReactElement, ReactNode } from 'react';
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { generateClasses } from '../../utils/utils';
import {
  NotebookTabs,
  type NotebookTabsProps,
} from '../notebook-tabs/notebook-tabs';
import { Tabs, type TabsProps } from '../tabs/Tabs';
import './tabs-layout.scss';

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

interface SectionLikeProps extends HTMLProps<HTMLElement> {
  id?: string;
  children?: ReactNode;
  'data-tabs-layout-active'?: string;
}

interface SectionTab {
  id: string;
  safeId: string;
}

function sanitizeId(value: string): string {
  return value.trim().replace(/\s+/g, '-').toLowerCase();
}

function joinClasses(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(' ').trim();
}

function getSectionElements(
  children: ReactNode,
): ReactElement<SectionLikeProps>[] {
  const sections: ReactElement<SectionLikeProps>[] = [];

  function traverse(nodes: ReactNode): void {
    Children.forEach(nodes, (node) => {
      if (!isValidElement<SectionLikeProps>(node)) return;

      if (
        typeof node.type === 'string' &&
        node.type.toLowerCase() === 'section'
      ) {
        sections.push(node);
        return;
      }

      if (node.props?.children) {
        traverse(node.props.children);
      }
    });
  }

  traverse(children);
  return sections;
}

function decorateSections(
  nodes: ReactNode,
  sectionIds: Set<string>,
  activeSectionId: string,
): ReactNode {
  return Children.map(nodes, (node) => {
    if (!isValidElement<SectionLikeProps>(node)) return node;

    const isSectionTag =
      typeof node.type === 'string' && node.type.toLowerCase() === 'section';

    if (isSectionTag) {
      const sectionId = String(node.props.id ?? '').trim();
      if (!sectionIds.has(sectionId)) return node;

      return cloneElement(node, {
        className: joinClasses(node.props.className, 'tabs-layout__section'),
        'data-tabs-layout-active': String(sectionId === activeSectionId),
      });
    }

    if (!node.props?.children) return node;

    return cloneElement(node, {
      children: decorateSections(node.props.children, sectionIds, activeSectionId),
    });
  });
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

  const sectionTabs = useMemo<SectionTab[]>(() => {
    return getSectionElements(children)
      .map((section) => {
        const sectionId = String(section.props.id ?? '').trim();
        if (!sectionId) return null;

        return {
          id: sectionId,
          safeId: sanitizeId(sectionId),
        };
      })
      .filter((section): section is SectionTab => Boolean(section));
  }, [children]);

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
    ({ id, safeId }) => ({
      children: id,
      href: `#${id}`,
      id: `to-${safeId}`,
    }),
  );

  const generatedDesktopTabs: TabsProps['tabs'] = sectionTabs.map(
    ({ id, safeId }) => ({
      label: id,
      value: id,
      id: `tab-${safeId}`,
    }),
  );

  const resolvedMobileTabs = hasAutoSections ? generatedMobileTabs : mobileTabs;
  const resolvedDesktopTabs = hasAutoSections
    ? generatedDesktopTabs
    : desktopTabs;

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
    ? decorateSections(children, new Set(sectionIds), String(activeDesktopSection ?? ''))
    : children;

  function handleDesktopChange(nextValue: string): void {
    if (hasAutoSections && typeof desktopValue !== 'string') {
      setAutoDesktopValue(nextValue);
    }

    desktopOnChange?.(nextValue);
  }

  return (
    <div className={classes} {...props}>
      {resolvedMobileTabs.length > 0 && (
        <NotebookTabs
          tabs={resolvedMobileTabs}
          className={mobileClasses}
          {...mobileProps}
        />
      )}

      {resolvedDesktopTabs.length > 0 && (
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
