import { HTMLProps, ReactElement, ReactNode, useMemo } from 'react';
import { filterElementsByTagName, sanitizeId } from '../utils/utils';

interface SectionTab {
  id: string;
  safeId: string;
  label: string;
}

interface SectionLikeProps extends HTMLProps<HTMLElement> {
  id?: string;
  children?: ReactNode;
  'data-tabs-layout-active'?: string;
}

export function useSectionsChildren(children: ReactNode) {
  const sectionTabs = useMemo<SectionTab[]>(() => {
    return filterElementsByTagName(children, 'section')
      .map((section) => {
        const sectionWithProps = section as ReactElement<SectionLikeProps>;
        const sectionId = String(sectionWithProps.props.id ?? '').trim();
        if (!sectionId) return null;
        const sectionLabel =
          String(sectionWithProps.props['aria-label'] ?? '').trim() ||
          sectionId;

        return {
          id: sectionId,
          safeId: sanitizeId(sectionId),
          label: sectionLabel,
        };
      })
      .filter((section): section is SectionTab => Boolean(section));
  }, [children]);

  return sectionTabs;
}
