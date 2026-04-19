/**
 * Recursive helper to generate a union of numbers from 0 to N.
 * It builds an array until its length reaches N,
 * then returns the union of the array's elements plus N itself.
 */
export type EnumerateInclusive<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? [...Acc, N][number]
  : EnumerateInclusive<N, [...Acc, Acc['length']]>;
