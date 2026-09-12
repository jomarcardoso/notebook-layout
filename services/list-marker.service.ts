// notebook-layout/services/list-marker.service.ts

import { toAlpha, toRoman } from './number.service';

/**
 * O marcador de uma posicao, escrito como TEXTO.
 */
export function formatListMarker(style: string, position: number): string {
  switch (style.trim().toLowerCase()) {
    case 'none':
      return '';
    case 'circle':
      return '○';
    case 'square':
      return '■';
    case 'decimal':
      return `${position}.`;
    case 'decimal-leading-zero':
      return `${position < 10 ? `0${position}` : position}.`;
    case 'lower-alpha':
    case 'lower-latin':
      return `${toAlpha(position)}.`;
    case 'upper-alpha':
    case 'upper-latin':
      return `${toAlpha(position).toUpperCase()}.`;
    case 'lower-roman':
      return `${toRoman(position).toLowerCase()}.`;
    case 'upper-roman':
      return `${toRoman(position)}.`;
    default:
      return '◆';
  }
}
