/**
 * Responsive behavior of the table on small screens.
 *
 * - `scroll`: Horizontal scroll (default)
 * - `stack`: Stack columns vertically as cards
 */
export type TableResponsiveMode = 'scroll' | 'stack';

/**
 * Density/size variant of the table.
 *
 * - `compact`: Reduced padding for dense data
 * - `normal`: Standard padding (default)
 * - `comfortable`: Increased padding for better readability
 */
export type TableDensity = 'compact' | 'normal' | 'comfortable';

/**
 * Sort direction for a column.
 */
export type SortDirection = 'asc' | 'desc' | null;

/**
 * Alignment for cell content. Logical, not physical — `'end'` means "the trailing edge of the reading
 * direction" (right in LTR, left in RTL), matching CSS `text-align: end` rather than `text-align: right`.
 */
export type CellAlign = 'start' | 'center' | 'end';

/**
 * Configuration for a table column.
 */
export interface TableColumn<T = Record<string, unknown>> {
  /**
   * Unique key for this column (used to access data).
   */
  key: string;

  /**
   * Header label displayed in the table header.
   */
  label: string;

  /**
   * Whether this column is sortable.
   * @default false
   */
  sortable?: boolean;

  /**
   * Custom sort function for this column.
   * If not provided, default sorting (string/number comparison) is used.
   */
  sortFn?: (a: T, b: T, direction: 'asc' | 'desc') => number;

  /**
   * Width of the column (e.g., '200px', '20%', 'auto').
   * @default 'auto'
   */
  width?: string;

  /**
   * Minimum width of the column (e.g., '100px').
   */
  minWidth?: string;

  /**
   * Text alignment for this column.
   * @default 'start'
   */
  align?: CellAlign;

  /**
   * Whether to hide this column on mobile devices.
   * @default false
   */
  hideOnMobile?: boolean;

  /**
   * Custom renderer function for cell content.
   * Return a Lit TemplateResult (html`...`) or an HTMLElement for safe rendering.
   * If not provided, the value is displayed as-is.
   */
  render?: (value: unknown, row: T, index: number) => unknown;

  /**
   * Whether this column should be sticky (fixed) when scrolling.
   * @default false
   */
  sticky?: boolean;

  /**
   * Whether this column's width can be adjusted by dragging a handle at its trailing edge (or, for keyboard
   * users, by focusing that handle and pressing the arrow keys).
   * @default false
   */
  resizable?: boolean;
}

/**
 * Event detail for column resize events.
 */
export interface ColumnResizeDetail {
  /**
   * Key of the column that was resized.
   */
  key: string;

  /**
   * The new width, as a CSS length (e.g. `'182px'`).
   */
  width: string;
}

/**
 * Current sort state of the table.
 */
export interface SortState {
  /**
   * Key of the column being sorted.
   */
  key: string;

  /**
   * Direction of the sort.
   */
  direction: 'asc' | 'desc';
}

/**
 * Event detail for row click events.
 */
export interface RowClickDetail<T = Record<string, unknown>> {
  /**
   * The row data that was clicked.
   */
  row: T;

  /**
   * Index of the row within the currently sorted/rendered data.
   */
  index: number;
}

/**
 * How row selection behaves.
 *
 * - `none`: no selection UI (default)
 * - `single`: one row selectable at a time, rendered as a radio button per row
 * - `multiple`: any number of rows selectable, rendered as a checkbox per row plus a "select all" checkbox
 */
export type TableSelectionMode = 'none' | 'single' | 'multiple';

/**
 * A row's selection key — the `row-key` field's value when `row-key` is set, otherwise the row's index.
 */
export type RowKey = string | number;

/**
 * Event detail for selection change events.
 */
export interface SelectionChangeDetail {
  /**
   * The new selection, as an array of row keys.
   */
  selected: RowKey[];

  /**
   * The selection before this change.
   */
  previousSelected: RowKey[];
}

/**
 * Labels for row-selection controls, overridable for i18n.
 */
export interface TableLabels<T = Record<string, unknown>> {
  /**
   * Accessible label for an individual row's selection control.
   * @default (row, index) => `Select row ${index + 1}`
   */
  selectRow: (row: T, index: number) => string;

  /**
   * Accessible label for the "select all" control in the header (multiple mode only).
   * @default 'Select all rows'
   */
  selectAll: string;

  /**
   * Accessible label for a resizable column's drag handle.
   * @default (column) => `Resize ${column.label} column`
   */
  resizeColumn: (column: TableColumn<T>) => string;
}

/**
 * Event detail for sort change events.
 */
export interface SortChangeDetail {
  /**
   * Key of the column being sorted.
   */
  key: string;

  /**
   * New sort direction.
   */
  direction: 'asc' | 'desc';

  /**
   * Previous sort state (null if no previous sort).
   */
  previousSort: SortState | null;
}
