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
 * Alignment for cell content.
 */
export type CellAlign = 'left' | 'center' | 'right';

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
   * @default 'left'
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
