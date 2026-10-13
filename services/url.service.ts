// notebook-layout/services/url.service.ts

export function unwrapUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return '';

  const match = trimmed.match(/^url\((.*)\)$/i);

  if (!match) return trimmed;

  return match[1].trim().replace(/^['"]|['"]$/g, '');
}
