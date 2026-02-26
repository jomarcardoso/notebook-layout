export const COARSE_POINTER_NO_HOVER_MEDIA_QUERY =
  '(hover: none) and (pointer: coarse)';
export const FINE_POINTER_HOVER_MEDIA_QUERY =
  '(hover: hover) and (pointer: fine)';

const matchesMediaQuery = (query: string): boolean => {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return false;
  }

  return window.matchMedia(query).matches;
};

export const isMobile = (): boolean =>
  matchesMediaQuery(COARSE_POINTER_NO_HOVER_MEDIA_QUERY);

export const isDesktop = (): boolean =>
  matchesMediaQuery(FINE_POINTER_HOVER_MEDIA_QUERY);
