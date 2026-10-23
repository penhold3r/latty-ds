import { describe, it, expect } from 'vitest';
import { getRowKey, nextRowSelection, nextSelectAllSelection, getSelectAllState } from '../table-selection';

describe('getRowKey', () => {
  it('returns the row field value when row-key names an existing field', () => {
    expect(getRowKey({ id: 'a1', name: 'Ada' }, 0, 'id')).toBe('a1');
  });

  it('falls back to the index when row-key is empty', () => {
    expect(getRowKey({ id: 'a1' }, 7, '')).toBe(7);
  });

  it('returns undefined when row-key names a missing field, rather than throwing', () => {
    expect(getRowKey({ id: 'a1' }, 0, 'missing')).toBeUndefined();
  });
});

describe('nextRowSelection', () => {
  it('single mode always replaces the selection with just the clicked key', () => {
    expect(nextRowSelection(['a', 'b'], 'b', 'single')).toEqual(['b']);
  });

  it('multiple mode adds an unselected key', () => {
    expect(nextRowSelection(['a'], 'b', 'multiple')).toEqual(['a', 'b']);
  });

  it('multiple mode removes an already-selected key', () => {
    expect(nextRowSelection(['a', 'b'], 'a', 'multiple')).toEqual(['b']);
  });

  it('never mutates the input array', () => {
    const current = ['a'];
    nextRowSelection(current, 'b', 'multiple');
    expect(current).toEqual(['a']);
  });
});

describe('nextSelectAllSelection', () => {
  it('selects every key when at least one is unselected', () => {
    expect(nextSelectAllSelection(['a'], ['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('clears the selection when every key is already selected', () => {
    expect(nextSelectAllSelection(['a', 'b'], ['a', 'b'])).toEqual([]);
  });

  it('clears rather than selects when the key list is empty', () => {
    expect(nextSelectAllSelection(['a'], [])).toEqual([]);
  });
});

describe('getSelectAllState', () => {
  it('is checked only when every key is selected', () => {
    expect(getSelectAllState(['a', 'b'], ['a', 'b'])).toEqual({ checked: true, indeterminate: false });
  });

  it('is indeterminate when only some keys are selected', () => {
    expect(getSelectAllState(['a'], ['a', 'b'])).toEqual({ checked: false, indeterminate: true });
  });

  it('is neither checked nor indeterminate when nothing is selected', () => {
    expect(getSelectAllState([], ['a', 'b'])).toEqual({ checked: false, indeterminate: false });
  });

  it('is neither checked nor indeterminate when there are no rows', () => {
    expect(getSelectAllState([], [])).toEqual({ checked: false, indeterminate: false });
  });
});
