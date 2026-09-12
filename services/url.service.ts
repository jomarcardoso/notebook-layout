// notebook-layout/services/url.service.ts

/**
 * Tira o embrulho `url(...)` de um valor de CSS e devolve o endereco cru.
 */
export function unwrapUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return '';

  const match = trimmed.match(/^url\((.*)\)$/i);

  if (!match) return trimmed;

  return match[1].trim().replace(/^['"]|['"]$/g, '');
}
