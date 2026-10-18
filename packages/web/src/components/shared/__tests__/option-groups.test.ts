import { describe, it, expect } from 'vitest';
import { groupConsecutive } from '../option-groups';

describe('groupConsecutive', () => {
  it('returns one ungrouped run for a flat list with no group field', () => {
    const items: { value: string; group?: string }[] = [{ value: 'a' }, { value: 'b' }, { value: 'c' }];
    expect(groupConsecutive(items)).toEqual([{ group: null, items }]);
  });

  it('groups a contiguous run of items sharing the same group', () => {
    const items = [
      { value: 'a', group: 'Fruit' },
      { value: 'b', group: 'Fruit' },
      { value: 'c', group: 'Veg' }
    ];
    expect(groupConsecutive(items)).toEqual([
      { group: 'Fruit', items: [items[0], items[1]] },
      { group: 'Veg', items: [items[2]] }
    ]);
  });

  it('keeps grouped and ungrouped items in separate runs, preserving order', () => {
    const items = [{ value: 'a', group: 'Fruit' }, { value: 'b' }, { value: 'c', group: 'Fruit' }];
    expect(groupConsecutive(items)).toEqual([
      { group: 'Fruit', items: [items[0]] },
      { group: null, items: [items[1]] },
      { group: 'Fruit', items: [items[2]] }
    ]);
  });

  it('does not merge two same-named groups separated by a different group', () => {
    const items = [
      { value: 'a', group: 'Fruit' },
      { value: 'b', group: 'Veg' },
      { value: 'c', group: 'Fruit' }
    ];
    expect(groupConsecutive(items)).toEqual([
      { group: 'Fruit', items: [items[0]] },
      { group: 'Veg', items: [items[1]] },
      { group: 'Fruit', items: [items[2]] }
    ]);
  });

  it('returns an empty array for an empty list', () => {
    expect(groupConsecutive([])).toEqual([]);
  });
});
