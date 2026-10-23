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

import '@latty-ds/icons';
import { NativeAttrsController } from '../shared/native-attrs';
import {
  getPageRange,
  getPagedEntries,
  getVisibleEntries,
  getVirtualSpacers,
  virtualizationWarning,
  DEFAULT_ROW_HEIGHT,
  type RowEntry,
  type VirtualizationConfig
} from '../shared/table-virtualization';
import { sortData, nextSortState, createSortChangeDetail, getCellValue } from '../shared/table-sort';
import { getTotalPages, getCurrentPage } from '../shared/table-pagination';
import { getRowKey, nextRowSelection, nextSelectAllSelection, getSelectAllState } from '../shared/table-selection';
import { startColumnResize, handleColumnResizeKeydown, type ColumnResizeHandlers } from '../shared/column-resize';

const DEFAULT_LABELS: TableLabels<unknown> = {
  selectRow: (_row, index) => `Select row ${index + 1}`,
  selectAll: 'Select all rows',
  resizeColumn: (column) => `Resize ${column.label} column`
};

let selectionGroupCounter = 0;

/**
 * TBL-4: a malformed `columns`/`data` JSON-string attribute (the SSR/no-JS-property path, see this class's own
 * JSDoc) used to fail silently — invalid JSON, or valid JSON that isn't an array, both collapsed to `[]` with no
 * signal at all that the markup was wrong, not just empty. `attrName` is baked in per property so the warning
 * names which one actually failed, since both share this same converter.
 */
const createJsonArrayConverter = (attrName: string) => ({
  fromAttribute(value: string | null): unknown[] {
    if (value === null) return [];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
      devWarn('lt-table', `\`${attrName}\` attribute is valid JSON but not an array — ignoring it`);
      return [];
    } catch (e) {
      devWarn('lt-table', `\`${attrName}\` attribute isn't valid JSON (${(e as Error).message}) — ignoring it`);
      return [];
    }
  }
});

/**
 * Table component with sorting, responsive modes, and extensive customization.
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
 * @fires sortchange - Fired when sort changes
 * @fires rowclick - Fired when a body row is clicked, with `{ row, index }` detail
 * @fires selectionchange - Fired when row selection changes, with `{ selected, previousSelected }` detail
 * @fires columnresize - Fired when a column's width changes via its resize handle, with `{ key, width }` detail
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

  private _nativeAttrs = new NativeAttrsController(this, () => this.shadowRoot?.querySelector('table'), {
    exclude: ['aria-label', 'aria-rowcount']
  });

  /**
   * Column definitions for the table.
   * Accepts a JS array (`.columns = [...]`) or a JSON string attribute (`columns='[...]'`).
   * When passed as JSON, only serializable fields are supported (no `render` or `sortFn`).
   * @default []
   */
  @property({ converter: createJsonArrayConverter('columns') }) columns: TableColumn<T>[] = [];

  /**
   * Data rows for the table.
   * Accepts a JS array (`.data = [...]`) or a JSON string attribute (`data='[...]'`).
   * @default []
   */
  @property({ converter: createJsonArrayConverter('data') }) data: T[] = [];

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
   * rows and leaving the ambient page to scroll past it. General-purpose (e.g. Pairs well with `sticky-header`
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
   * this table and writing its own `change` event's `page` back onto `this.page`:.
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
   * I18n overrides for the row-selection controls' accessible labels.
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

  /** Resize handlers routed into this instance's own state + `columnresize` event. */
  private readonly _resizeHandlers: ColumnResizeHandlers = {
    update: (key, width) => {
      this.columnWidthOverrides = { ...this.columnWidthOverrides, [key]: width };
    },
    commit: (key, width) => this.dispatchColumnResize(key, width)
  };

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
   * A column's effective width: a live resize override when one exists, otherwise its configured `width`.
   */
  private getColumnWidth(column: TableColumn<T>): string | undefined {
    return this.columnWidthOverrides[column.key] ?? column.width;
  }

  /**
   * Total number of pages given the current sorted data and `pageSize`. `1` whenever pagination is disabled
   * (`pageSize` unset or less than 1). Public so a consumer can feed it straight into `lt-pagination`'s own
   * `total-pages`.
   */
  get totalPages(): number {
    return getTotalPages({ pageSize: this.pageSize, page: this.page, sortedDataLength: this.sortedData.length });
  }

  /** `page`, clamped into `1..totalPages`. */
  private get currentPage(): number {
    return getCurrentPage({ pageSize: this.pageSize, page: this.page, sortedDataLength: this.sortedData.length });
  }

  /**
   * The current page's row range as plain indices into `sortedData` — computed without materializing any rows,
   * so callers that only need the count (e.g. A virtualized render's spacer-row math) stay O(1).
   */
  private get pageRange(): { start: number; end: number } {
    return getPageRange(this.sortedData.length, this.pageSize, this.currentPage);
  }

  /** Every row on the current page, paired with its index within `sortedData`. */
  private get pagedEntries(): RowEntry<T>[] {
    return getPagedEntries(this.sortedData, this.pageRange);
  }

  /** The rows actually rendered into the DOM: the current page, further windowed when virtualized. */
  private get visibleEntries(): RowEntry<T>[] {
    return getVisibleEntries(this.sortedData, this.pageRange, this._virtualizationConfig);
  }

  private get _virtualizationConfig(): VirtualizationConfig {
    return {
      virtualized: this.virtualized,
      height: this.height,
      rowHeight: this.rowHeight,
      scrollTop: this._scrollTop,
      viewportHeight: this._viewportHeight
    };
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
    if (changedProperties.has('virtualized') || changedProperties.has('height')) {
      const warning = virtualizationWarning({ virtualized: this.virtualized, height: this.height });
      if (warning) devWarn('lt-table', warning);
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
    this.sortedData = sortData(this.data ?? [], this.columns ?? [], this.currentSort);
  }

  /**
   * Handles header click for sorting.
   */
  private handleHeaderClick(column: TableColumn<T>) {
    if (!column.sortable) return;

    const previousSort = this.currentSort;
    const newSort = nextSortState(column, previousSort);

    // Update internal state if not controlled
    if (this.sort === undefined) {
      this.internalSort = newSort;
    }

    this.dispatchEvent(
      new CustomEvent<SortChangeDetail>('sortchange', {
        bubbles: true,
        composed: true,
        detail: createSortChangeDetail(column, newSort.direction, previousSort)
      })
    );
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
   * Starts a pointer-drag resize of a column. Delegates the whole gesture to `startColumnResize`, which tracks
   * start position/width as closure state and pushes live/committed widths back through `_resizeHandlers`.
   */
  private handleResizeStart(e: PointerEvent, column: TableColumn<T>) {
    startColumnResize(e, column, this._resizeHandlers);
  }

  /**
   * Keyboard alternative to dragging (WCAG 2.5.1 — a pointer-only drag gesture needs a non-pointer equivalent).
   */
  private handleResizeKeydown(e: KeyboardEvent, column: TableColumn<T>) {
    const th = (e.currentTarget as HTMLElement).closest('th') as HTMLElement;
    const currentWidth = th.getBoundingClientRect().width;
    handleColumnResizeKeydown(e, column, currentWidth, this._resizeHandlers);
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
    const key = getRowKey(row, index, this.rowKey);
    const previousSelected = this.currentSelected;
    const next = nextRowSelection(previousSelected, key, this.selectionMode);

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
    const allKeys = this.pagedEntries.map(({ row, index }) => getRowKey(row, index, this.rowKey));
    const previousSelected = this.currentSelected;
    const next = nextSelectAllSelection(previousSelected, allKeys);

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
   * Renders a cell's content.
   */
  private renderCell(column: TableColumn<T>, row: T, rowIndex: number): unknown {
    const value = getCellValue(row, column.key);

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
   *
   * TBL-4: every table/rowgroup/row/columnheader/cell element below carries its matching ARIA role explicitly,
   * not just the real tag name — `responsive-mode="stack"` sets `display: block` on all of them (table.styles.ts),
   * and Safari computes a cell's accessibility role from its *rendered display value*, not its tag name, so it
   * silently drops the whole table's semantics the instant that CSS applies (Chrome/Firefox use the tag name
   * regardless of display and are unaffected). An explicit role isn't subject to that at all. Stack mode also sets
   * `thead { display: none }`, which removes the header row from every browser's accessibility tree, not just
   * Safari's — renderBody()'s per-cell `aria-label` (column label only, not the value) is the companion fix for
   * that, so stacked cells don't lose their column context entirely once sighted users can no longer see it either.
   */
  private renderHeader() {
    const allKeys = this.pagedEntries.map(({ row, index }) => getRowKey(row, index, this.rowKey));
    const selectAll = getSelectAllState(this.currentSelected, allKeys);

    const isVirtualized = this.virtualized && !!this.height;

    return html`
      <thead role="rowgroup">
        <tr role="row" aria-rowindex=${isVirtualized ? 1 : nothing}>
          ${this.selectionMode === 'multiple'
            ? html`
                <th role="columnheader" class="selection-cell">
                  <input
                    type="checkbox"
                    aria-label=${this._labels.selectAll}
                    .checked=${selectAll.checked}
                    .indeterminate=${selectAll.indeterminate}
                    @click=${(e: Event) => e.stopPropagation()}
                    @change=${() => this.toggleSelectAll()}
                  />
                </th>
              `
            : this.selectionMode === 'single'
              ? html`<th role="columnheader" class="selection-cell"></th>`
              : nothing}
          ${(this.columns ?? []).map(
            (column) => html`
              <th
                role="columnheader"
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
        <tbody role="rowgroup">
          <tr role="row">
            <td role="cell" colspan=${Math.max(columns.length + selectionColumnCount, 1)} class="empty-state">
              ${this.emptyMessage}
            </td>
          </tr>
        </tbody>
      `;
    }

    const isVirtualized = this.virtualized && !!this.height;
    const { start: pageStart } = this.pageRange;

    const renderRow = (row: T, index: number) => {
      const key = getRowKey(row, index, this.rowKey);
      const selected = this.currentSelected.includes(key);
      // +2, not +1: row-index 1 is the header, matching the ARIA Grid pattern's row numbering, so a row's own
      // position within the page (0-based) needs to shift by one more than usual to land after it.
      const ariaRowIndex = isVirtualized ? index - pageStart + 2 : nothing;

      return html`
        <tr
          role="row"
          @click=${() => this.handleRowClick(row, index)}
          class=${classMap({ selected })}
          aria-rowindex=${ariaRowIndex}
        >
          ${this.selectionMode === 'none'
            ? nothing
            : html`
                <td role="cell" class="selection-cell" data-label="">
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
                role="cell"
                class=${classMap({
                  sticky: !!column.sticky,
                  'hide-on-mobile': !!column.hideOnMobile
                })}
                data-align=${column.align || 'start'}
                data-label=${column.label}
                aria-label=${this.responsiveMode === 'stack' ? column.label : nothing}
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
          ({ row, index }) => getRowKey(row, index, this.rowKey),
          ({ row, index }) => renderRow(row, index)
        )
      : entries.map(({ row, index }) => renderRow(row, index));

    if (!isVirtualized) {
      return html`
        <tbody role="rowgroup">
          ${rows}
        </tbody>
      `;
    }

    // Rows scrolled out of view above/below still need to occupy their own vertical space, or the scrollbar's
    // range (and the position everything else lands at while scrolling) would be wrong — two plain spacer rows,
    // sized to stand in for however many rows aren't currently rendered on each side, do that without needing
    // any non-table layout. aria-hidden since they carry no real content, just filler height.
    const rowHeightPx = this.rowHeight > 0 ? this.rowHeight : DEFAULT_ROW_HEIGHT;
    const { topSpacerRows, bottomSpacerRows } = getVirtualSpacers(entries, this.pageRange);
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
      <tbody role="rowgroup">
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
          role="table"
          aria-label=${this.label || this.getAttribute('aria-label') || nothing}
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
