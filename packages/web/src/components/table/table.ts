import { html, nothing, type PropertyValues } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { repeat } from 'lit/directives/repeat.js';

import { tableStyles } from './table.styles';
import {
  TableColumn,
  TableDensity,
  TableResponsiveMode,
  SortState,
  SortChangeDetail,
  RowClickDetail
} from './table.types';

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
 *
 * @fires sortchange - Fired when sort changes
 * @fires rowclick - Fired when a body row is clicked, with `{ row, index }` detail
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
   * Field name to use as a stable row identity key for efficient DOM reuse during sorts/updates.
   * When omitted, falls back to the row's JSON representation.
   * @default ''
   */
  @property({ attribute: 'row-key' }) rowKey = '';

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
   * Sorted data based on current sort state.
   */
  @state() private sortedData: T[] = [];

  /**
   * Gets the current effective sort state.
   */
  private get currentSort(): SortState | null {
    return this.sort ?? this.internalSort;
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);
    const changed = changedProperties as ReadonlyMap<PropertyKey, unknown>;
    if (changed.has('data') || changed.has('sort') || changed.has('columns') || changed.has('internalSort')) {
      this.updateSortedData();
    }
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
    return html`
      <thead>
        <tr>
          ${(this.columns ?? []).map(
            (column) => html`
              <th
                class=${classMap({
                  sortable: !!column.sortable,
                  sorted: this.currentSort?.key === column.key,
                  sticky: !!column.sticky,
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
                  ...(column.width ? { width: column.width } : {}),
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
    if (this.sortedData.length === 0) {
      return html`
        <tbody>
          <tr>
            <td colspan=${Math.max(columns.length, 1)} class="empty-state">${this.emptyMessage}</td>
          </tr>
        </tbody>
      `;
    }

    const renderRow = (row: T, index: number) => html`
      <tr @click=${() => this.handleRowClick(row, index)}>
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
                ...(column.width ? { width: column.width } : {}),
                ...(column.minWidth ? { minWidth: column.minWidth } : {})
              })}
            >
              ${this.renderCell(column, row, index)}
            </td>
          `
        )}
      </tr>
    `;

    // Keyed rendering only makes sense with a real key. Without `row-key` the old fallback (JSON.stringify(row)) was
    // O(n) per render, threw on circular data and BigInt, and gave identical rows identical keys; index-based
    // rendering has none of those problems.
    const rows = this.rowKey
      ? repeat(this.sortedData, (row) => (row as Record<string, unknown>)[this.rowKey], renderRow)
      : this.sortedData.map(renderRow);

    return html`
      <tbody>
        ${rows}
      </tbody>
    `;
  }

  render() {
    return html`
      <div class="table-container">
        <table aria-label=${this.label || nothing}>
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
