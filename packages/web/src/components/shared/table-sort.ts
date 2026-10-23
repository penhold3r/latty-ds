import type { TableColumn, SortState, SortChangeDetail } from '../table/table.types';

/**
 * Default sort comparison. Dates compare by time (their string form sorts "Fri Jan 02" before
 * "Mon Jan 05" but after "Fri Jan 30"), numbers numerically, and everything else as text
 * with natural ordering so "2" precedes "10".
 * @param {unknown} a - The first value to compare.
 * @param {unknown} b - The second value to compare.
 * @returns {number} Negative if a < b, positive if a > b, 0 if equal.
 */
export function compareValues(a: unknown, b: unknown): number {
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'bigint' && typeof b === 'bigint') return a < b ? -1 : a > b ? 1 : 0;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

/**
 * Gets a cell value from a row using a (possibly nested, dot-separated) key.
 * @param {unknown} row - The row object.
 * @param {string} key - The dot-separated key path.
 * @returns {unknown} The cell value.
 */
export function getCellValue(row: unknown, key: string): unknown {
  return key
    .split('.')
    .reduce((obj: Record<string, unknown>, k) => obj?.[k] as Record<string, unknown>, row as Record<string, unknown>);
}

/**
 * Returns a sorted copy of `data` for the given sort state. Falls back to a shallow copy when
 * there's no active sort, or the sorted column is missing — never mutates the input.
 * @param {readonly T[]} data - The data to sort.
 * @param {readonly TableColumn<T>[]} columns - The column definitions.
 * @param {SortState | null} sort - The current sort state.
 * @returns {T[]} The sorted data.
 */
export function sortData<T>(data: readonly T[], columns: readonly TableColumn<T>[], sort: SortState | null): T[] {
  if (!sort) return [...data];

  const column = columns.find((col) => col.key === sort.key);
  if (!column) return [...data];

  return [...data].sort((a, b) => {
    if (column.sortFn) return column.sortFn(a, b, sort.direction);

    const aValue = getCellValue(a, column.key);
    const bValue = getCellValue(b, column.key);

    // Nullish values sort last regardless of direction.
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    const comparison = compareValues(aValue, bValue);
    return sort.direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Computes the next sort state when a sortable header is activated: toggles direction when the
 * same column is re-activated, otherwise starts ascending on the new column.
 * @param {TableColumn<T>} column - The column that was activated.
 * @param {SortState | null} currentSort - The current sort state.
 * @returns {SortState} The next sort state.
 */
export function nextSortState<T>(column: TableColumn<T>, currentSort: SortState | null): SortState {
  const direction: 'asc' | 'desc' = currentSort?.key === column.key && currentSort.direction === 'asc' ? 'desc' : 'asc';
  return { key: column.key, direction };
}

/**
 * Builds the `sortchange` event detail for a header activation.
 * @param {TableColumn<T>} column - The column that was activated.
 * @param {'asc' | 'desc'} direction - The sort direction.
 * @param {SortState | null} previousSort - The previous sort state.
 * @returns {SortChangeDetail} The sort change detail.
 */
export function createSortChangeDetail<T>(
  column: TableColumn<T>,
  direction: 'asc' | 'desc',
  previousSort: SortState | null
): SortChangeDetail {
  return { key: column.key, direction, previousSort };
}
