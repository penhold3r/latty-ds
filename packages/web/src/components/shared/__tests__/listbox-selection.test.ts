import { describe, expect, it } from 'vitest';
import {
  clearValue,
  coerceListboxValue,
  normalizeSelection,
  selectionFormData,
  shouldShowClear,
  toggleSelected
} from '../listbox-selection';

describe('normalizeSelection', () => {
  it('wraps a non-empty string in an array', () => {
    expect(normalizeSelection('a')).toEqual(['a']);
  });
  it('returns an empty array for empty string', () => {
    expect(normalizeSelection('')).toEqual([]);
  });
  it('returns arrays as-is', () => {
    expect(normalizeSelection(['a', 'b'])).toEqual(['a', 'b']);
  });
});

describe('shouldShowClear', () => {
  it('shows clear only when clearable, has a selection, and not disabled', () => {
    expect(shouldShowClear(true, ['a'], false)).toBe(true);
    expect(shouldShowClear(false, ['a'], false)).toBe(false);
    expect(shouldShowClear(true, [], false)).toBe(false);
    expect(shouldShowClear(true, ['a'], true)).toBe(false);
  });
});

describe('toggleSelected', () => {
  it('adds an unselected value', () => {
    expect(toggleSelected(['a'], 'b')).toEqual(['a', 'b']);
  });
  it('removes a selected value', () => {
    expect(toggleSelected(['a', 'b'], 'a')).toEqual(['b']);
  });
  it('never mutates the input array', () => {
    const input = ['a'];
    const result = toggleSelected(input, 'b');
    expect(input).toEqual(['a']);
    expect(result).not.toBe(input);
  });
});

describe('clearValue', () => {
  it('returns an empty array for multiple', () => {
    expect(clearValue(true)).toEqual([]);
  });
  it('returns an empty string for single', () => {
    expect(clearValue(false)).toBe('');
  });
});

describe('coerceListboxValue', () => {
  it('maps array values to strings', () => {
    expect(coerceListboxValue([1, 'a'])).toEqual(['1', 'a']);
  });
  it('returns empty string for null and undefined', () => {
    expect(coerceListboxValue(null)).toBe('');
    expect(coerceListboxValue(undefined)).toBe('');
  });
  it('coerces other values to strings', () => {
    expect(coerceListboxValue(5)).toBe('5');
  });
});

describe('selectionFormData', () => {
  it('appends one entry per selected value', () => {
    const data = selectionFormData('fruit', ['a', 'b']);
    expect(data.getAll('fruit')).toEqual(['a', 'b']);
  });
  it('appends nothing when name is null', () => {
    const data = selectionFormData(null, ['a']);
    expect(data.getAll('fruit')).toEqual([]);
  });
});
