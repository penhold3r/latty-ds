import { describe, it, expect } from 'vitest';
import { enabledItems, rovingTargetOf, stepIndex } from '../roving';

type Item = { value: string; disabled: boolean };
const a: Item = { value: 'a', disabled: false };
const b: Item = { value: 'b', disabled: true };
const c: Item = { value: 'c', disabled: false };

describe('enabledItems', () => {
  it('drops disabled items and keeps order', () => {
    expect(enabledItems([a, b, c])).toEqual([a, c]);
  });

  it('returns an empty list when everything is disabled', () => {
    expect(enabledItems([b])).toEqual([]);
  });
});

describe('rovingTargetOf', () => {
  it('picks the item matching the value', () => {
    expect(rovingTargetOf([a, c], 'c')).toBe(c);
  });

  it('falls back to the first enabled item when nothing matches', () => {
    expect(rovingTargetOf([a, c], 'missing')).toBe(a);
  });

  it('is undefined when there are no enabled items', () => {
    expect(rovingTargetOf([], 'a')).toBeUndefined();
  });
});

describe('stepIndex', () => {
  it('steps forward and back', () => {
    expect(stepIndex(0, 3, 1)).toBe(1);
    expect(stepIndex(2, 3, -1)).toBe(1);
  });

  it('wraps at both ends', () => {
    expect(stepIndex(2, 3, 1)).toBe(0);
    expect(stepIndex(0, 3, -1)).toBe(2);
  });

  it('steps from the start when the index is -1 (the item is not in the list)', () => {
    expect(stepIndex(-1, 3, 1)).toBe(1);
    expect(stepIndex(-1, 3, -1)).toBe(2);
  });

  // The helper replaced inline formulas in radio-group and tab-group, so it must match them everywhere they run.
  it.each([1, 2, 3, 4, 5, 6])('matches the original inline wrap formulas for length %s', (length) => {
    for (let index = -1; index < length; index++) {
      expect(stepIndex(index, length, 1)).toBe((Math.max(index, 0) + 1) % length);
      expect(stepIndex(index, length, -1)).toBe((Math.max(index, 0) - 1 + length) % length);
    }
  });
});
