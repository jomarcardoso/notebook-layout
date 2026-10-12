'use client';
// notebook-layout/components/sidebar/sidebar-fold.ts

import { useSyncExternalStore } from 'react';

/**
 * Whether the desktop rail is folded, kept outside the pages: every page
 * mounts its own navigation, and a state born inside it would open again on
 * each one. Folded until the window says it is wide enough; then the reader's
 * own choice, for every page.
 */
const WIDE_QUERY = '(min-width: 1024px)';
const listeners = new Set<() => void>();
const state = { known: false, folded: true };

function readFolded(): boolean {
  if (!state.known) {
    state.known = true;
    state.folded = !window.matchMedia(WIDE_QUERY).matches;
  }

  return state.folded;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

export function toggleSidebarFold(): void {
  state.folded = !readFolded();
  listeners.forEach((listener) => listener());
}

export function useSidebarFolded(): boolean {
  return useSyncExternalStore(subscribe, readFolded, () => true);
}
