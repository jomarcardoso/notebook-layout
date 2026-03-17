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
