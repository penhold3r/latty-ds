import type { RowKey } from '../table/table.types';

/** How row selection behaves — mirrors `TableSelectionMode`, redeclared here to avoid a cycle. */
export type SelectionMode = 'none' | 'single' | 'multiple';

/**
 * Resolves a row's selection/rendering identity key: the `row-key` field's value when
 * `row-key` is set, otherwise the row's index within the sorted data.
 * @param {T} row - The row data.
 * @param {number} index - The row index.
 * @param {string} rowKey - The row key property name.
 * @returns {RowKey} The row key.
 */
export function getRowKey<T>(row: T, index: number, rowKey: string): RowKey {
  return rowKey ? ((row as Record<string, unknown>)[rowKey] as RowKey) : index;
}

/**
 * Computes the next selection after toggling one row. In `single` mode this always replaces
 * the selection (matching native radio behavior — clicking the already-selected one is a
 * no-op, not a way to clear it); in `multiple` mode it adds or removes just that row's key.
 * @param {readonly RowKey[]} currentSelected - The currently selected keys.
 * @param {RowKey} key - The key to toggle.
 * @param {SelectionMode} selectionMode - The selection mode.
 * @returns {RowKey[]} The next selection.
 */
export function nextRowSelection(
  currentSelected: readonly RowKey[],
  key: RowKey,
  selectionMode: SelectionMode
): RowKey[] {
  if (selectionMode === 'single') return [key];
  return currentSelected.includes(key) ? currentSelected.filter((k) => k !== key) : [...currentSelected, key];
}

/**
 * Computes the next selection after toggling "select all" over the given keys. Selects all
 * when any are unselected, otherwise clears the selection entirely.
 * @param {readonly RowKey[]} currentSelected - The currently selected keys.
 * @param {readonly RowKey[]} allKeys - All keys on the current page.
 * @returns {RowKey[]} The next selection.
 */
export function nextSelectAllSelection(currentSelected: readonly RowKey[], allKeys: readonly RowKey[]): RowKey[] {
  const allSelected = allKeys.length > 0 && allKeys.every((key) => currentSelected.includes(key));
  return allSelected ? [] : [...allKeys];
}

/**
 * The select-all checkbox state — `checked` when every key is selected, `indeterminate` when
 * only some are.
 * @param {readonly RowKey[]} currentSelected - The currently selected keys.
 * @param {readonly RowKey[]} allKeys - All keys on the current page.
 * @returns {{ checked: boolean; indeterminate: boolean }} The select-all state.
 */
export function getSelectAllState(
  currentSelected: readonly RowKey[],
  allKeys: readonly RowKey[]
): { checked: boolean; indeterminate: boolean } {
  const selectedCount = allKeys.filter((key) => currentSelected.includes(key)).length;
  return {
    checked: selectedCount > 0 && selectedCount === allKeys.length,
    indeterminate: selectedCount > 0 && selectedCount < allKeys.length
  };
}
