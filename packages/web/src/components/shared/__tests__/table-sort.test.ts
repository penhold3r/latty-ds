import { describe, it, expect } from 'vitest';
import { compareValues, getCellValue, sortData, nextSortState, createSortChangeDetail } from '../table-sort';
import type { TableColumn } from '../../table/table.types';

describe('compareValues', () => {
  it('compares numbers numerically, not lexically', () => {
    expect(compareValues(2, 10)).toBeLessThan(0);
  });

  it('compares dates by time', () => {
    expect(compareValues(new Date('2024-01-02'), new Date('2024-01-05'))).toBeLessThan(0);
  });

  it('compares strings with natural ordering so "2" precedes "10"', () => {
    expect(compareValues('2', '10')).toBeLessThan(0);
  });

  it('compares bigints without losing precision', () => {
    expect(compareValues(2n, 10n)).toBeLessThan(0);
    expect(compareValues(10n, 2n)).toBeGreaterThan(0);
  });
});

describe('getCellValue', () => {
  it('reads a top-level key', () => {
    expect(getCellValue({ name: 'Ada' }, 'name')).toBe('Ada');
  });

  it('reads a dot-separated nested key', () => {
    expect(getCellValue({ user: { address: { city: 'Bogotá' } } }, 'user.address.city')).toBe('Bogotá');
  });
});

describe('sortData', () => {
  const columns: TableColumn<Record<string, unknown>>[] = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' }
  ];
  const data = [
    { name: 'Zoe', age: 30 },
    { name: 'Ada', age: 25 },
    { name: 'Mia', age: 30 }
  ];

  it('returns a copy when there is no sort state', () => {
    const result = sortData(data, columns, null);
    expect(result).toEqual(data);
    expect(result).not.toBe(data);
  });

  it('sorts ascending by the active column', () => {
    expect(sortData(data, columns, { key: 'name', direction: 'asc' }).map((r) => r.name)).toEqual([
      'Ada',
      'Mia',
      'Zoe'
    ]);
  });

  it('reverses for descending', () => {
    expect(sortData(data, columns, { key: 'name', direction: 'desc' }).map((r) => r.name)).toEqual([
      'Zoe',
      'Mia',
      'Ada'
    ]);
  });

  it('never mutates the input array', () => {
    const original = [...data];
    sortData(data, columns, { key: 'name', direction: 'asc' });
    expect(data).toEqual(original);
  });

  it('sorts nullish values last regardless of direction', () => {
    const rows = [{ v: 2 }, { v: null }, { v: 1 }];
    const cols: TableColumn<{ v: number | null }>[] = [{ key: 'v', label: 'V' }];
    for (const direction of ['asc', 'desc'] as const) {
      const result = sortData(rows, cols, { key: 'v', direction });
      expect(result[result.length - 1].v).toBeNull();
    }
  });

  it('uses a column sortFn when provided, instead of the default comparison', () => {
    const cols: TableColumn<Record<string, unknown>>[] = [
      { key: 'name', label: 'Name', sortFn: (a, b) => String(b.name).localeCompare(String(a.name)) }
    ];
    expect(sortData(data, cols, { key: 'name', direction: 'asc' }).map((r) => r.name)).toEqual(['Zoe', 'Mia', 'Ada']);
  });

  it('returns an unsorted copy when the sorted column is missing', () => {
    expect(sortData(data, columns, { key: 'missing', direction: 'asc' })).toEqual(data);
  });
});

describe('nextSortState', () => {
  const column: TableColumn<unknown> = { key: 'name', label: 'Name', sortable: true };

  it('starts ascending on a new column', () => {
    expect(nextSortState(column, null)).toEqual({ key: 'name', direction: 'asc' });
    expect(nextSortState(column, { key: 'age', direction: 'desc' })).toEqual({ key: 'name', direction: 'asc' });
  });

  it('toggles to descending when re-activating the same ascending column', () => {
    expect(nextSortState(column, { key: 'name', direction: 'asc' })).toEqual({ key: 'name', direction: 'desc' });
  });

  it('returns to ascending when re-activating the same descending column', () => {
    expect(nextSortState(column, { key: 'name', direction: 'desc' })).toEqual({ key: 'name', direction: 'asc' });
  });
});

describe('createSortChangeDetail', () => {
  it('carries the new key/direction and the previous sort', () => {
    const previous = { key: 'age', direction: 'desc' } as const;
    expect(createSortChangeDetail({ key: 'name', label: 'Name' }, 'asc', previous)).toEqual({
      key: 'name',
      direction: 'asc',
      previousSort: previous
    });
  });
});
