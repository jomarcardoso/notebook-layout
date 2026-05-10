import {
  Children,
  cloneElement,
  HTMLProps,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react';

export function generateClasses(
  object: Record<string, boolean | string | undefined | null>,
): string {
  return Object.entries(object)
    .reduce((classes, [className, statement]) => {
      if (statement) {
        return `${classes} ${className}`;
      }

      return classes;
    }, '')
    .trim();
}

export function getOrientation() {
  // If width > height, it is landscape, otherwise portrait or square
  return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
}

export interface ScrollToTopOptions {
  top?: number;
  behavior?: ScrollBehavior;
}

export function scrollToTop({
  top = 0,
  behavior = 'smooth',
}: ScrollToTopOptions = {}) {
  if (typeof window === 'undefined') return;

  window.scrollTo({
    top,
    behavior,
  });
}

const BLOCK_SCROLL_CLASS = 'scroll-blocked';

interface BlockScrollState {
  count: number;
  scrollX: number;
  scrollY: number;
  htmlHeight: string;
  htmlOverflow: string;
  htmlOverscrollBehavior: string;
  bodyHeight: string;
  bodyLeft: string;
  bodyOverflow: string;
  bodyOverscrollBehavior: string;
  bodyPaddingRight: string;
  bodyPosition: string;
  bodyRight: string;
  bodyTop: string;
  bodyWidth: string;
}

const blockScrollState: BlockScrollState = {
  count: 0,
  scrollX: 0,
  scrollY: 0,
  htmlHeight: '',
  htmlOverflow: '',
  htmlOverscrollBehavior: '',
  bodyHeight: '',
  bodyLeft: '',
  bodyOverflow: '',
  bodyOverscrollBehavior: '',
  bodyPaddingRight: '',
  bodyPosition: '',
  bodyRight: '',
  bodyTop: '',
  bodyWidth: '',
};

const getScrollbarWidth = (): number => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 0;
  }

  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
};

export const getBlockScrollClassName = (): string => BLOCK_SCROLL_CLASS;

export function blockScroll(): () => void {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return () => undefined;
  }

  const { body, documentElement } = document;

  if (blockScrollState.count === 0) {
    const scrollbarWidth = getScrollbarWidth();
    const computedBodyStyle = window.getComputedStyle(body);
    const computedPaddingRight =
      parseFloat(computedBodyStyle.paddingRight || '0') || 0;

    blockScrollState.scrollX = window.scrollX;
    blockScrollState.scrollY = window.scrollY;
    blockScrollState.htmlHeight = documentElement.style.height;
    blockScrollState.htmlOverflow = documentElement.style.overflow;
    blockScrollState.htmlOverscrollBehavior =
      documentElement.style.overscrollBehavior;
    blockScrollState.bodyHeight = body.style.height;
    blockScrollState.bodyLeft = body.style.left;
    blockScrollState.bodyOverflow = body.style.overflow;
    blockScrollState.bodyOverscrollBehavior = body.style.overscrollBehavior;
    blockScrollState.bodyPaddingRight = body.style.paddingRight;
    blockScrollState.bodyPosition = body.style.position;
    blockScrollState.bodyRight = body.style.right;
    blockScrollState.bodyTop = body.style.top;
    blockScrollState.bodyWidth = body.style.width;

    documentElement.classList.add(BLOCK_SCROLL_CLASS);
    body.classList.add(BLOCK_SCROLL_CLASS);

    documentElement.style.height = '100%';
    documentElement.style.overflow = 'hidden';
    documentElement.style.overscrollBehavior = 'none';

    body.style.left = `${-blockScrollState.scrollX}px`;
    body.style.overscrollBehavior = 'none';
    body.style.position = 'fixed';
    body.style.right = '0';
    body.style.top = `${-blockScrollState.scrollY}px`;
    body.style.width = '100%';

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
    }
  }

  blockScrollState.count += 1;

  let released = false;

  return () => {
    if (released) return;
    released = true;

    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }
    if (blockScrollState.count === 0) return;

    blockScrollState.count -= 1;

    if (blockScrollState.count > 0) return;

    const { body, documentElement } = document;

    documentElement.classList.remove(BLOCK_SCROLL_CLASS);
    body.classList.remove(BLOCK_SCROLL_CLASS);

    documentElement.style.height = blockScrollState.htmlHeight;
    documentElement.style.overflow = blockScrollState.htmlOverflow;
    documentElement.style.overscrollBehavior =
      blockScrollState.htmlOverscrollBehavior;

    body.style.height = blockScrollState.bodyHeight;
    body.style.left = blockScrollState.bodyLeft;
    body.style.overflow = blockScrollState.bodyOverflow;
    body.style.overscrollBehavior = blockScrollState.bodyOverscrollBehavior;
    body.style.paddingRight = blockScrollState.bodyPaddingRight;
    body.style.position = blockScrollState.bodyPosition;
    body.style.right = blockScrollState.bodyRight;
    body.style.top = blockScrollState.bodyTop;
    body.style.width = blockScrollState.bodyWidth;

    window.scrollTo(blockScrollState.scrollX, blockScrollState.scrollY);
  };
}

export function filterElementsByTagName(
  allElements: ReactNode,
  elementName: keyof HTMLElementTagNameMap,
): ReactElement[] {
  const filteredElements: ReactElement[] = [];

  function traverse(nodes: ReactNode): void {
    Children.forEach(nodes, (node) => {
      if (!isValidElement(node)) return;

      if (
        typeof node.type === 'string' &&
        node.type.toLowerCase() === elementName
      ) {
        filteredElements.push(node);
        return;
      }

      if ((node.props as any)?.children) {
        traverse((node.props as any).children);
      }
    });
  }

  traverse(allElements);
  return filteredElements;
}

export function sanitizeId(value: string): string {
  return value.trim().replace(/\s+/g, '-').toLowerCase();
}

export function checkNodeTagName(
  node: ReactElement<HTMLElement, string | React.JSXElementConstructor<any>>,
  elementName: keyof HTMLElementTagNameMap,
) {
  return (
    typeof node.type === 'string' && node.type.toLowerCase() === elementName
  );
}

function joinClasses(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(' ').trim();
}

export interface SectionLikeProps extends HTMLProps<HTMLElement> {
  id?: string;
  children?: ReactNode;
  'data-tabs-layout-active'?: string;
}

export function decorateSections(
  nodes: ReactNode,
  sectionIds: Set<string>,
  activeSectionId?: string,
): ReactNode {
  const shouldTrackActiveSection = typeof activeSectionId === 'string';

  return Children.map(nodes, (node) => {
    if (!isValidElement<SectionLikeProps>(node)) return node;

    if (checkNodeTagName(node as any, 'section')) {
      const sectionId = String(node.props.id ?? '').trim();
      if (!sectionIds.has(sectionId)) return node;

      if (!shouldTrackActiveSection) return node;

      return cloneElement(node, {
        className: joinClasses(node.props.className, 'tabs-layout__section'),
        'data-tabs-layout-active': String(sectionId === activeSectionId),
      });
    }

    if (!node.props?.children) return node;

    return cloneElement(node, {
      children: decorateSections(
        node.props.children,
        sectionIds,
        activeSectionId,
      ),
    });
  });
}
