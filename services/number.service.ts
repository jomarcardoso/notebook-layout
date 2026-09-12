// notebook-layout/services/number.service.ts

const ROMAN = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
] as const;

export function toRoman(value: number): string {
  let rest = Math.floor(value);
  let result = '';

  for (const [amount, symbol] of ROMAN) {
    while (rest >= amount) {
      result += symbol;
      rest -= amount;
    }
  }

  return result || 'I';
}

/**
 * A posicao em letras, em caixa baixa: a, b, ... z, aa, ab.
 */
export function toAlpha(value: number): string {
  let rest = Math.floor(value);
  let result = '';

  while (rest > 0) {
    rest -= 1;
    result = String.fromCharCode(97 + (rest % 26)) + result;
    rest = Math.floor(rest / 26);
  }

  return result || 'a';
}
