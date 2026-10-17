import { html, nothing, type PropertyValues } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { devWarn } from '../../utils';

import { tableStyles } from './table.styles';
import {
  TableColumn,
  TableDensity,
  TableResponsiveMode,
  SortState,
  SortChangeDetail,
  RowClickDetail,
  TableSelectionMode,
  RowKey,
  SelectionChangeDetail,
  TableLabels,
  ColumnResizeDetail
} from './table.types';

const DEFAULT_LABELS: TableLabels<unknown> = {
  selectRow: (_row, index) => `Select row ${index + 1}`,
  selectAll: 'Select all rows',
  resizeColumn: (column) => `Resize ${column.label} column`
};

/** Smallest width a column can be dragged/keyed down to, when it has no explicit `minWidth` of its own. */
const DEFAULT_MIN_COLUMN_WIDTH = 40;

/** Pixels a keyboard arrow-key press grows/shrinks a resizable column by. */
const RESIZE_KEY_STEP = 10;

/** `rowHeight` fallback when `virtualized` is set but `rowHeight` itself is unset or not a positive number. */
const DEFAULT_ROW_HEIGHT = 44;

/** Extra rows rendered beyond the strictly-visible range on each side, so a fast scroll doesn't flash blank. */
const VIRTUAL_OVERSCAN = 4;

let selectionGroupCounter = 0;

/**
 * Default sort comparison. Dates compare by time (their string form sorts "Fri Jan 02" before "Mon Jan 05" but after
 * "Fri Jan 30"), numbers numerically, and everything else as text with natural ordering so "2" precedes "10".
 */
const compareValues = (a: unknown, b: unknown): number => {
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'bigint' && typeof b === 'bigint') return a < b ? -1 : a > b ? 1 : 0;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
};

const jsonArrayConverter = {
  fromAttribute(value: string | null): unknown[] {
    if (value === null) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
};

import '@latty-ds/icons';

/**
 * Table component with sorting, responsive modes, and extensive customization.
 *
 * @element lt-table
 *
 * Features:
 * - Sortable columns with visual indicators
 * - Two responsive modes: scroll (horizontal) and stack (cards on mobile)
 * - Three density options: compact, normal, comfortable
 * - Sticky columns support
 * - Custom cell renderers
 * - Hover and stripe effects
 * - Loading and empty states
 * - Column alignment and sizing
 * - Hide columns on mobile
 * - Accessible with keyboard navigation
 * - Visible caption via the `caption` property
 * - Sticky header via `sticky-header`
 * - `rowclick` event for custom row interactions (navigation, custom selection, etc.)
 * - Row selection via `selection-mode` (`single` radio buttons or `multiple` checkboxes + select-all)
 * - Pagination coupling via `page-size`/`page`/`totalPages`, for pairing with a standalone `lt-pagination`
 * - Per-column resize (`column.resizable`) via pointer drag or, for keyboard users, arrow keys on the same handle
 * - Row virtualization (`virtualized` + `height`) for rendering only the visible rows of a large dataset
 *
 * @fires sortchange - Fired when sort changes
 * @fires rowclick - Fired when a body row is clicked, with `{ row, index }` detail
 * @fires selectionchange - Fired when row selection changes, with `{ selected, previousSelected }` detail
 * @fires columnresize - Fired when a column's width changes via its resize handle, with `{ key, width }` detail
 *
 * @example
 * ```typescript
 * const columns = [
 *   { key: 'name', label: 'Name', sortable: true },
 *   { key: 'email', label: 'Email', sortable: true },
 *   { key: 'age', label: 'Age', sortable: true, align: 'end' }
 * ];
 *
 * const data = [
 *   { name: 'John Doe', email: 'john@example.com', age: 30 },
 *   { name: 'Jane Smith', email: 'jane@example.com', age: 25 }
 * ];
 * ```
 *
 * Via JS property assignment (supports `render` and `sortFn`):
 * ```javascript
 * const table = document.querySelector('lt-table');
 * table.columns = columns;
 * table.data = data;
 * ```
 *
 * Via JSON string attributes (SSR / Astro templates, no render/sortFn):
 * ```html
 * <lt-table
 *   columns='[{"key":"name","label":"Name","sortable":true}]'
 *   data='[{"name":"John Doe"}]'
 *   density="normal"
 *   responsive-mode="scroll"
 *   hoverable
 *   striped
 * ></lt-table>
 * ```
 */
@customElement('lt-table')
export class Table<T = Record<string, unknown>> extends ThemeableElement {
  static styles = tableStyles;

  /**
   * Column definitions for the table.
   * Accepts a JS array (`.columns = [...]`) or a JSON string attribute (`columns='[...]'`).
   * When passed as JSON, only serializable fields are supported (no `render` or `sortFn`).
   * @default []
   */
  @property({ converter: jsonArrayConverter }) columns: TableColumn<T>[] = [];

  /**
   * Data rows for the table.
   * Accepts a JS array (`.data = [...]`) or a JSON string attribute (`data='[...]'`).
   * @default []
   */
  @property({ converter: jsonArrayConverter }) data: T[] = [];

  /**
   * Density/spacing of the table.
   * @default 'normal'
   */
  @property({ reflect: true }) density: TableDensity = 'normal';

  /**
   * Responsive behavior on small screens.
   * @default 'scroll'
   */
  @property({ reflect: true, attribute: 'responsive-mode' }) responsiveMode: TableResponsiveMode = 'scroll';

  /**
   * Whether rows have a hover effect.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) hoverable = false;

  /**
   * Whether to show alternating row colors.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) striped = false;

  /**
   * Whether to show borders around cells.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) bordered = false;

  /**
   * Whether the table is in a loading state.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) loading = false;

  /**
   * Message to display when there is no data.
   * @default 'No data available'
   */
  @property({ attribute: 'empty-message' }) emptyMessage = 'No data available';

  /**
   * Accessible name for the table. Required when a page has more than one table, since column labels alone
   * don't tell assistive tech which table it's in. Renders as `aria-label`, so it isn't visible on screen —
   * for a visible title, use `caption` instead.
   * @default ''
   */
  @property({ reflect: true }) label = '';

  /**
   * Visible caption describing the table's contents, rendered as a native `<caption>` element. Unlike `label`,
   * this text is shown on screen, and it becomes the table's accessible name natively (the HTML accessible-name
   * algorithm prefers a present `<caption>` over nothing) — though an explicit `label` still wins over it, since
   * `aria-label` takes precedence over `<caption>` in that algorithm. Omitted entirely when empty.
   * @default ''
   */
  @property() caption = '';

  /**
   * Which edge of the table the caption renders against.
   * @default 'top'
   */
  @property({ reflect: true, attribute: 'caption-side' }) captionSide: 'top' | 'bottom' = 'top';

  /**
   * Keeps the header row pinned to the top of the nearest scrolling ancestor while the body scrolls past it —
   * that ancestor is `.table-container` itself when it has its own bounded height and vertical overflow (not
   * set by this component), or the page otherwise.
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'sticky-header' }) stickyHeader = false;

  /**
   * Bounds `.table-container` to this fixed height with its own vertical scroll, instead of growing to fit all
   * rows and leaving the ambient page to scroll past it. General-purpose (e.g. pairs well with `sticky-header`
   * even without `virtualized`), but `virtualized` requires it — windowing needs a known viewport size to compute
   * which rows are actually visible.
   * @default ''
   */
  @property({ reflect: true }) height = '';

  /**
   * Renders only the body rows currently scrolled into view (plus a small overscan buffer) instead of every row,
   * for datasets too large to put every row in the DOM at once. Requires `height` — without it there's no bounded
   * viewport to compute visibility against, so this silently has no effect (and logs a dev-mode warning) rather
   * than erroring. Assumes every row renders at the same height (`row-height`); not supported together with
   * `responsive-mode="stack"`, whose card-style rows have no uniform height to assume.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) virtualized = false;

  /**
   * Fixed pixel height every row renders at, used only to compute the visible window when `virtualized` is set.
   * @default 44
   */
  @property({ type: Number, reflect: true, attribute: 'row-height' }) rowHeight = DEFAULT_ROW_HEIGHT;

  /**
   * Field name to use as a stable row identity key for efficient DOM reuse during sorts/updates.
   * When omitted, falls back to the row's JSON representation.
   * @default ''
   */
  @property({ attribute: 'row-key' }) rowKey = '';

  /**
   * How row selection behaves: `'none'` (no selection UI), `'single'` (one row at a time, radio buttons), or
   * `'multiple'` (any number of rows, checkboxes plus a "select all" control in the header).
   * @default 'none'
   */
  @property({ reflect: true, attribute: 'selection-mode' }) selectionMode: TableSelectionMode = 'none';

  /**
   * Number of rows to show per page. `0` disables pagination (every row renders, the default). The table renders
   * no pagination controls itself — pair it with a standalone `lt-pagination`, reading `page`/`totalPages` from
   * this table and writing its own `change` event's `page` back onto `this.page`:
   * ```js
   * pager.totalPages = table.totalPages;
   * pager.addEventListener('change', (e) => (table.page = e.detail.page));
   * ```
   * @default 0
   */
  @property({ type: Number, reflect: true, attribute: 'page-size' }) pageSize = 0;

  /**
   * Current page (1-indexed). Out-of-range values clamp into `1..totalPages`, matching `lt-pagination`'s own
   * clamping. Unlike `sort`/`selected`, this is a plain consumer-driven property, not controlled/uncontrolled —
   * the table has no page-navigation UI of its own to ever change it internally.
   * @default 1
   */
  @property({ type: Number, reflect: true }) page = 1;

  /**
   * Current selection (controlled externally), as an array of row keys — the `row-key` field's value for each
   * selected row when `row-key` is set, otherwise its index within the sorted data. If not provided, selection
   * is managed internally.
   */
  @property({ type: Array }) selected?: RowKey[];

  /**
   * i18n overrides for the row-selection controls' accessible labels.
   * @default {}
   */
  @property({ type: Object }) labels: Partial<TableLabels<T>> = {};

  private get _labels(): TableLabels<T> {
    return { ...(DEFAULT_LABELS as TableLabels<T>), ...this.labels };
  }

  /**
   * Current sort state (controlled externally).
   * If not provided, sorting is managed internally.
   */
  @property({ type: Object }) sort?: SortState;

  /**
   * Internal sort state (when not controlled externally).
   */
  @state() private internalSort: SortState | null = null;

  /**
   * Internal selection state (when not controlled externally).
   */
  @state() private internalSelected: RowKey[] = [];

  /**
   * Unique `name` for this instance's `single`-mode radio inputs, so multiple tables on the same page don't
   * group their radios together.
   */
  private readonly _selectionGroupName = `lt-table-selection-${++selectionGroupCounter}`;

  /**
   * Live, self-managed column widths from resizing, keyed by `column.key`. Always wins over `column.width` when
   * present — survives a `columns` re-render (keyed by `key`, not array identity) until the page reloads.
   * `columnresize` gives the consumer a hook to persist a resize if they want it to survive that too.
   */
  @state() private columnWidthOverrides: Record<string, string> = {};

  @query('.table-container') private _containerEl?: HTMLDivElement;

  /** Current scroll offset of `.table-container`, tracked only while `virtualized` is set. */
  @state() private _scrollTop = 0;

  /** Measured rendered height of `.table-container`, tracked only while `virtualized` is set. */
  @state() private _viewportHeight = 0;

  private _containerResizeObserver?: ResizeObserver;

  /**
   * Sorted data based on current sort state.
   */
  @state() private sortedData: T[] = [];

  /**
   * Gets the current effective sort state.
   */
  private get currentSort(): SortState | null {
    return this.sort ?? this.internalSort;
  }

  /**
   * Gets the current effective selection.
   */
  private get currentSelected(): RowKey[] {
    return this.selected ?? this.internalSelected;
  }

  /**
   * Resolves a row's selection/rendering identity key: the `row-key` field's value when `row-key` is set,
   * otherwise the row's index within the sorted data.
   */
  private getRowKey(row: T, index: number): RowKey {
    return this.rowKey ? ((row as Record<string, unknown>)[this.rowKey] as RowKey) : index;
  }

  /**
   * A column's effective width: a live resize override when one exists, otherwise its configured `width`.
   */
  private getColumnWidth(column: TableColumn<T>): string | undefined {
    return this.columnWidthOverrides[column.key] ?? column.width;
  }

  /**
   * A column's minimum width in pixels, as a plain number — its own `minWidth` when it parses as one, otherwise
   * the shared floor every resizable column gets regardless.
   */
  private getColumnMinWidthPx(column: TableColumn<T>): number {
    const parsed = column.minWidth ? parseFloat(column.minWidth) : NaN;
    return Number.isFinite(parsed) ? Math.max(parsed, DEFAULT_MIN_COLUMN_WIDTH) : DEFAULT_MIN_COLUMN_WIDTH;
  }

  /**
   * Total number of pages given the current sorted data and `pageSize`. `1` whenever pagination is disabled
   * (`pageSize` unset or less than 1). Public so a consumer can feed it straight into `lt-pagination`'s own
   * `total-pages`.
   */
  get totalPages(): number {
    if (!this.pageSize || this.pageSize < 1) return 1;
    return Math.max(1, Math.ceil(this.sortedData.length / this.pageSize));
  }

  /**
   * `page`, clamped into `1..totalPages` — matches `lt-pagination`'s own `_current` clamping, so an out-of-range
   * `page` (e.g. the data shrank after a fetch) never renders an empty page.
   */
  private get currentPage(): number {
    const raw = Math.floor(Number(this.page));
    return Number.isFinite(raw) ? Math.min(Math.max(raw, 1), this.totalPages) : 1;
  }

  /**
   * The current page's row range as plain indices into `sortedData` — computed without materializing any rows,
   * so callers that only need the count (e.g. a virtualized render's spacer-row math) stay O(1).
   */
  private get pageRange(): { start: number; end: number } {
    if (!this.pageSize || this.pageSize < 1) return { start: 0, end: this.sortedData.length };
    const start = (this.currentPage - 1) * this.pageSize;
    return { start, end: Math.min(start + this.pageSize, this.sortedData.length) };
  }

  /**
   * Every row on the current page, paired with its index within `sortedData` — the index is preserved (not
   * re-based to the page) so `rowIndex` in `column.render`, `rowclick`'s detail, and row-selection keys all keep
   * meaning "position within the full sorted data", not "position within this page". Slices `sortedData` before
   * mapping (not after), so this costs O(page size), not O(total rows), regardless of dataset size.
   */
  private get pagedEntries(): Array<{ row: T; index: number }> {
    const { start, end } = this.pageRange;
    return this.sortedData.slice(start, end).map((row, i) => ({ row, index: start + i }));
  }

  /**
   * The rows actually rendered into the DOM: `pagedEntries` as-is, unless `virtualized` (with `height` set) further
   * windows it down to just the current page's visible range plus a small overscan buffer. Unlike `pagedEntries`,
   * this slices `sortedData` directly for the visible window rather than materializing the whole page first, so
   * scrolling a virtualized table costs O(visible rows), never O(page size) or O(total rows) — the entire point,
   * since a scroll event recomputes this on every tick.
   */
  private get visibleEntries(): Array<{ row: T; index: number }> {
    const { start: pageStart, end: pageEnd } = this.pageRange;
    if (!this.virtualized || !this.height) return this.pagedEntries;

    const pageRowCount = pageEnd - pageStart;
    const rowHeightPx = this.rowHeight > 0 ? this.rowHeight : DEFAULT_ROW_HEIGHT;
    const windowStart = Math.max(0, Math.floor(this._scrollTop / rowHeightPx) - VIRTUAL_OVERSCAN);
    const windowEnd = Math.min(
      pageRowCount,
      Math.ceil((this._scrollTop + this._viewportHeight) / rowHeightPx) + VIRTUAL_OVERSCAN
    );
    const absoluteStart = pageStart + windowStart;
    const absoluteEnd = pageStart + windowEnd;
    return this.sortedData.slice(absoluteStart, absoluteEnd).map((row, i) => ({ row, index: absoluteStart + i }));
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);
    const changed = changedProperties as ReadonlyMap<PropertyKey, unknown>;
    if (changed.has('data') || changed.has('sort') || changed.has('columns') || changed.has('internalSort')) {
      this.updateSortedData();
    }
  }

  override firstUpdated(changedProperties: PropertyValues<this>) {
    super.firstUpdated(changedProperties);
    // Measures .table-container whenever its rendered size changes (a height change, a window resize, a
    // sidebar collapsing elsewhere on the page — anything), not just once on mount, so a virtualized table
    // keeps computing its visible window correctly if its viewport is ever resized after the fact.
    this._containerResizeObserver = new ResizeObserver((entries) => {
      this._viewportHeight = entries[0]?.contentRect.height ?? 0;
    });
    if (this._containerEl) this._containerResizeObserver.observe(this._containerEl);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._containerResizeObserver?.disconnect();
  }

  override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if ((changedProperties.has('virtualized') || changedProperties.has('height')) && this.virtualized && !this.height) {
      devWarn(
        'lt-table',
        '`virtualized` has no effect without `height` — give the table a bounded height so there is a viewport to compute visible rows against'
      );
    }
  }

  /**
   * Tracks `.table-container`'s scroll position while virtualized, driving `visibleEntries`'s windowing math.
   */
  private handleScroll(e: Event) {
    if (!this.virtualized) return;
    this._scrollTop = (e.currentTarget as HTMLElement).scrollTop;
  }

  /**
   * Updates the sorted data based on current sort state.
   */
  private updateSortedData() {
    const data = this.data ?? [];
    if (!this.currentSort) {
      this.sortedData = [...data];
      return;
    }

    const columns = this.columns ?? [];
    const column = columns.find((col) => col.key === this.currentSort!.key);
    if (!column) {
      this.sortedData = [...data];
      return;
    }

    const sorted = [...data].sort((a, b) => {
      // Use custom sort function if provided
      if (column.sortFn) {
        return column.sortFn(a, b, this.currentSort!.direction);
      }

      // Default sorting
      const aValue = this.getCellValue(a, column.key);
      const bValue = this.getCellValue(b, column.key);

      // Handle null/undefined
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      const comparison = compareValues(aValue, bValue);

      return this.currentSort!.direction === 'asc' ? comparison : -comparison;
    });

    this.sortedData = sorted;
  }

  /**
   * Handles header click for sorting.
   */
  private handleHeaderClick(column: TableColumn<T>) {
    if (!column.sortable) return;

    const previousSort = this.currentSort;
    let newDirection: 'asc' | 'desc' = 'asc';

    // Toggle sort direction
    if (previousSort?.key === column.key) {
      newDirection = previousSort.direction === 'asc' ? 'desc' : 'asc';
    }

    const newSort: SortState = {
      key: column.key,
      direction: newDirection
    };

    // Update internal state if not controlled
    if (this.sort === undefined) {
      this.internalSort = newSort;
    }

    // Dispatch event
    this.dispatchEvent(
      new CustomEvent<SortChangeDetail>('sortchange', {
        bubbles: true,
        composed: true,
        detail: {
          key: column.key,
          direction: newDirection,
          previousSort
        }
      })
    );
  }

  /**
   * Updates a column's width live, without telling the consumer yet — used for every step of an in-progress
   * drag, where firing `columnresize` on each pixel of movement would be excessive. Returns the applied width.
   */
  private updateColumnWidth(column: TableColumn<T>, widthPx: number): string {
    const width = `${Math.round(widthPx)}px`;
    this.columnWidthOverrides = { ...this.columnWidthOverrides, [column.key]: width };
    return width;
  }

  /**
   * Tells the consumer a column's width change is final — once per drag (on release), or once per keyboard step
   * (each press is already a discrete, complete action with no "in progress" state to speak of).
   */
  private dispatchColumnResize(key: string, width: string) {
    this.dispatchEvent(
      new CustomEvent<ColumnResizeDetail>('columnresize', {
        bubbles: true,
        composed: true,
        detail: { key, width }
      })
    );
  }

  /**
   * Starts a pointer-drag resize of a column. The handle captures the pointer for the whole drag (so a fast
   * movement past the handle's own bounds doesn't drop the gesture) and tracks start position/width as plain
   * closure state — simpler than threading per-drag fields through the instance for something this self-contained.
   */
  private handleResizeStart(e: PointerEvent, column: TableColumn<T>) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();

    const handle = e.currentTarget as HTMLElement;
    const th = handle.closest('th') as HTMLElement;
    const startX = e.clientX;
    const startWidth = th.getBoundingClientRect().width;
    const minWidth = this.getColumnMinWidthPx(column);
    // A physical drag must track the cursor correctly regardless of reading direction: the handle sits at the
    // column's trailing (inset-inline-end) edge, which is the column's *left* edge under RTL — so "dragging
    // further away from the column" is a *negative* clientX delta there, the opposite of LTR.
    const isRtl = getComputedStyle(this).direction === 'rtl';

    handle.setPointerCapture(e.pointerId);

    const onMove = (moveEvent: PointerEvent) => {
      const rawDelta = moveEvent.clientX - startX;
      const delta = isRtl ? -rawDelta : rawDelta;
      this.updateColumnWidth(column, Math.max(minWidth, startWidth + delta));
    };

    const onUp = (upEvent: PointerEvent) => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.releasePointerCapture(upEvent.pointerId);
      const width = this.columnWidthOverrides[column.key];
      if (width) this.dispatchColumnResize(column.key, width);
    };

    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
  }

  /**
   * Keyboard alternative to dragging (WCAG 2.5.1 — a pointer-only drag gesture needs a non-pointer equivalent).
   * Arrow-right always grows and arrow-left always shrinks, the same as a native `<input type="range">`'s own
   * increment keys — unlike the mouse drag, this doesn't flip for RTL, since "right arrow increases" is the
   * more universally understood convention for a plain magnitude control.
   */
  private handleResizeKeydown(e: KeyboardEvent, column: TableColumn<T>) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();

    const th = (e.currentTarget as HTMLElement).closest('th') as HTMLElement;
    const currentWidth = th.getBoundingClientRect().width;
    const minWidth = this.getColumnMinWidthPx(column);
    const step = e.key === 'ArrowRight' ? RESIZE_KEY_STEP : -RESIZE_KEY_STEP;
    const width = this.updateColumnWidth(column, Math.max(minWidth, currentWidth + step));
    this.dispatchColumnResize(column.key, width);
  }

  /**
   * Handles a click on a body row.
   */
  private handleRowClick(row: T, index: number) {
    this.dispatchEvent(
      new CustomEvent<RowClickDetail<T>>('rowclick', {
        bubbles: true,
        composed: true,
        detail: { row, index }
      })
    );
  }

  /**
   * Toggles a single row's selection. In `single` mode this always replaces the selection (matching native radio
   * behavior — clicking the already-selected one is a no-op, not a way to clear it); in `multiple` mode it adds
   * or removes just that row's key.
   */
  private toggleRowSelection(row: T, index: number) {
    const key = this.getRowKey(row, index);
    const previousSelected = this.currentSelected;
    const next =
      this.selectionMode === 'single'
        ? [key]
        : previousSelected.includes(key)
          ? previousSelected.filter((k) => k !== key)
          : [...previousSelected, key];

    if (this.selected === undefined) this.internalSelected = next;
    this.dispatchEvent(
      new CustomEvent<SelectionChangeDetail>('selectionchange', {
        bubbles: true,
        composed: true,
        detail: { selected: next, previousSelected }
      })
    );
  }

  /**
   * Toggles selection of every currently visible row (the current page, when paginated) — selects all if any
   * are unselected, otherwise clears the selection. Multiple mode only.
   */
  private toggleSelectAll() {
    const allKeys = this.pagedEntries.map(({ row, index }) => this.getRowKey(row, index));
    const previousSelected = this.currentSelected;
    const allSelected = allKeys.length > 0 && allKeys.every((key) => previousSelected.includes(key));
    const next = allSelected ? [] : allKeys;

    if (this.selected === undefined) this.internalSelected = next;
    this.dispatchEvent(
      new CustomEvent<SelectionChangeDetail>('selectionchange', {
        bubbles: true,
        composed: true,
        detail: { selected: next, previousSelected }
      })
    );
  }

  /**
   * Gets a cell value from a row using a key (supports nested keys).
   */
  private getCellValue(row: unknown, key: string): unknown {
    return key
      .split('.')
      .reduce((obj: Record<string, unknown>, k) => obj?.[k] as Record<string, unknown>, row as Record<string, unknown>);
  }

  /**
   * Renders a cell's content.
   */
  private renderCell(column: TableColumn<T>, row: T, rowIndex: number): unknown {
    const value = this.getCellValue(row, column.key);

    if (column.render) {
      return column.render(value, row, rowIndex);
    }

    return value ?? '';
  }

  /**
   * Renders the sort icon for a column header.
   */
  private renderSortIcon(column: TableColumn<T>) {
    if (!column.sortable) return nothing;

    const isCurrentSort = this.currentSort?.key === column.key;
    const direction = isCurrentSort ? this.currentSort!.direction : 'asc';
    const iconName = direction === 'asc' ? 'arrow-up' : 'arrow-down';

    return html` <lt-icon class="sort-icon" name=${iconName}></lt-icon> `;
  }

  /**
   * Renders the table header.
   */
  private renderHeader() {
    const allKeys = this.pagedEntries.map(({ row, index }) => this.getRowKey(row, index));
    const selectedCount = allKeys.filter((key) => this.currentSelected.includes(key)).length;

    const isVirtualized = this.virtualized && !!this.height;

    return html`
      <thead>
        <tr aria-rowindex=${isVirtualized ? 1 : nothing}>
          ${this.selectionMode === 'multiple'
            ? html`
                <th class="selection-cell">
                  <input
                    type="checkbox"
                    aria-label=${this._labels.selectAll}
                    .checked=${selectedCount > 0 && selectedCount === allKeys.length}
                    .indeterminate=${selectedCount > 0 && selectedCount < allKeys.length}
                    @click=${(e: Event) => e.stopPropagation()}
                    @change=${() => this.toggleSelectAll()}
                  />
                </th>
              `
            : this.selectionMode === 'single'
              ? html`<th class="selection-cell"></th>`
              : nothing}
          ${(this.columns ?? []).map(
            (column) => html`
              <th
                class=${classMap({
                  sortable: !!column.sortable,
                  sorted: this.currentSort?.key === column.key,
                  sticky: !!column.sticky,
                  resizable: !!column.resizable,
                  'hide-on-mobile': !!column.hideOnMobile
                })}
                data-align=${column.align || 'start'}
                aria-sort=${column.sortable
                  ? this.currentSort?.key === column.key
                    ? this.currentSort.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                  : nothing}
                style=${styleMap({
                  ...(this.getColumnWidth(column) ? { width: this.getColumnWidth(column) } : {}),
                  ...(column.minWidth ? { minWidth: column.minWidth } : {})
                })}
              >
                ${column.sortable
                  ? html`
                      <button
                        type="button"
                        class="header-content"
                        @click=${() => this.handleHeaderClick(column)}
                        @keydown=${(e: KeyboardEvent) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            this.handleHeaderClick(column);
                          }
                        }}
                      >
                        <span>${column.label}</span>
                        ${this.renderSortIcon(column)}
                      </button>
                    `
                  : column.label}
                ${column.resizable
                  ? html`
                      <div
                        class="resize-handle"
                        role="separator"
                        aria-label=${this._labels.resizeColumn(column)}
                        aria-orientation="vertical"
                        tabindex="0"
                        @pointerdown=${(e: PointerEvent) => this.handleResizeStart(e, column)}
                        @keydown=${(e: KeyboardEvent) => this.handleResizeKeydown(e, column)}
                      ></div>
                    `
                  : nothing}
              </th>
            `
          )}
        </tr>
      </thead>
    `;
  }

  /**
   * Renders the table body.
   */
  private renderBody() {
    const columns = this.columns ?? [];
    const selectionColumnCount = this.selectionMode === 'none' ? 0 : 1;
    if (this.sortedData.length === 0) {
      return html`
        <tbody>
          <tr>
            <td colspan=${Math.max(columns.length + selectionColumnCount, 1)} class="empty-state">
              ${this.emptyMessage}
            </td>
          </tr>
        </tbody>
      `;
    }

    const isVirtualized = this.virtualized && !!this.height;
    const { start: pageStart, end: pageEnd } = this.pageRange;
    const pageRowCount = pageEnd - pageStart;

    const renderRow = (row: T, index: number) => {
      const key = this.getRowKey(row, index);
      const selected = this.currentSelected.includes(key);
      // +2, not +1: row-index 1 is the header, matching the ARIA Grid pattern's row numbering, so a row's own
      // position within the page (0-based) needs to shift by one more than usual to land after it.
      const ariaRowIndex = isVirtualized ? index - pageStart + 2 : nothing;

      return html`
        <tr
          @click=${() => this.handleRowClick(row, index)}
          class=${classMap({ selected })}
          aria-rowindex=${ariaRowIndex}
        >
          ${this.selectionMode === 'none'
            ? nothing
            : html`
                <td class="selection-cell" data-label="">
                  <input
                    type=${this.selectionMode === 'single' ? 'radio' : 'checkbox'}
                    name=${this.selectionMode === 'single' ? this._selectionGroupName : nothing}
                    aria-label=${this._labels.selectRow(row, index)}
                    .checked=${selected}
                    @click=${(e: Event) => e.stopPropagation()}
                    @change=${() => this.toggleRowSelection(row, index)}
                  />
                </td>
              `}
          ${columns.map(
            (column) => html`
              <td
                class=${classMap({
                  sticky: !!column.sticky,
                  'hide-on-mobile': !!column.hideOnMobile
                })}
                data-align=${column.align || 'start'}
                data-label=${column.label}
                style=${styleMap({
                  ...(this.getColumnWidth(column) ? { width: this.getColumnWidth(column) } : {}),
                  ...(column.minWidth ? { minWidth: column.minWidth } : {})
                })}
              >
                ${this.renderCell(column, row, index)}
              </td>
            `
          )}
        </tr>
      `;
    };

    // Keyed rendering only makes sense with a real key. Without `row-key` the old fallback (JSON.stringify(row)) was
    // O(n) per render, threw on circular data and BigInt, and gave identical rows identical keys; index-based
    // rendering has none of those problems. Iterates `visibleEntries` (not `sortedData` directly) so each entry's
    // preserved global index — not its position within this page, let alone this scroll window — is what
    // `renderRow` ultimately uses.
    const entries = this.visibleEntries;
    const rows = this.rowKey
      ? repeat(
          entries,
          ({ row, index }) => this.getRowKey(row, index),
          ({ row, index }) => renderRow(row, index)
        )
      : entries.map(({ row, index }) => renderRow(row, index));

    if (!isVirtualized) {
      return html`
        <tbody>
          ${rows}
        </tbody>
      `;
    }

    // Rows scrolled out of view above/below still need to occupy their own vertical space, or the scrollbar's
    // range (and the position everything else lands at while scrolling) would be wrong — two plain spacer rows,
    // sized to stand in for however many rows aren't currently rendered on each side, do that without needing
    // any non-table layout. aria-hidden since they carry no real content, just filler height.
    const rowHeightPx = this.rowHeight > 0 ? this.rowHeight : DEFAULT_ROW_HEIGHT;
    const firstRenderedOffset = entries.length ? entries[0].index - pageStart : 0;
    const lastRenderedOffset = entries.length ? entries[entries.length - 1].index - pageStart : -1;
    const topSpacerRows = firstRenderedOffset;
    const bottomSpacerRows = pageRowCount - 1 - lastRenderedOffset;
    const colCount = Math.max(columns.length + selectionColumnCount, 1);
    const spacerRow = (rowCount: number) =>
      rowCount > 0
        ? html`
            <tr class="virtual-spacer" aria-hidden="true" style=${styleMap({ height: `${rowCount * rowHeightPx}px` })}>
              <td colspan=${colCount}></td>
            </tr>
          `
        : nothing;

    return html`
      <tbody>
        ${spacerRow(topSpacerRows)} ${rows} ${spacerRow(bottomSpacerRows)}
      </tbody>
    `;
  }

  render() {
    const isVirtualized = this.virtualized && !!this.height;
    return html`
      <div
        class="table-container"
        style=${styleMap(this.height ? { height: this.height, overflowY: 'auto' } : {})}
        @scroll=${this.handleScroll}
        tabindex="0"
      >
        <table
          aria-label=${this.label || nothing}
          aria-rowcount=${isVirtualized ? this.pageRange.end - this.pageRange.start + 1 : nothing}
        >
          ${this.caption
            ? html`<caption>
                ${this.caption}
              </caption>`
            : nothing}
          ${this.renderHeader()} ${this.renderBody()}
        </table>
        ${this.loading
          ? html`
              <div class="loading-overlay">
                <lt-spinner></lt-spinner>
              </div>
            `
          : nothing}
      </div>
    `;
  }
}
