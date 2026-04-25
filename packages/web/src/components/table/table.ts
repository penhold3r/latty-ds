import { LitElement, html, nothing } from 'lit';
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
} from './table.types';

import '@latty/icons';

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
 *
 * @fires lt-sort-change - Fired when sort changes
 *
 * @example
 * ```typescript
 * const columns = [
 *   { key: 'name', label: 'Name', sortable: true },
 *   { key: 'email', label: 'Email', sortable: true },
 *   { key: 'age', label: 'Age', sortable: true, align: 'right' }
 * ];
 *
 * const data = [
 *   { name: 'John Doe', email: 'john@example.com', age: 30 },
 *   { name: 'Jane Smith', email: 'jane@example.com', age: 25 }
 * ];
 * ```
 *
 * ```html
 * <lt-table
 *   .columns=${columns}
 *   .data=${data}
 *   density="normal"
 *   responsive-mode="scroll"
 *   hoverable
 *   striped
 * ></lt-table>
 * ```
 */
@customElement('lt-table')
export class Table<T = Record<string, unknown>> extends LitElement {
  static styles = tableStyles;

  /**
   * Column definitions for the table.
   * @default []
   */
  @property({ type: Array }) columns: TableColumn<T>[] = [];

  /**
   * Data rows for the table.
   * @default []
   */
  @property({ type: Array }) data: T[] = [];

  /**
   * Density/spacing of the table.
   * @default 'normal'
   */
  @property({ reflect: true }) density: TableDensity = 'normal';

  /**
   * Responsive behavior on small screens.
   * @default 'scroll'
   */
  @property({ reflect: true, attribute: 'responsive-mode' }) responsiveMode: TableResponsiveMode =
    'scroll';

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

  willUpdate(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('data') ||
      changedProperties.has('sort') ||
      changedProperties.has('columns') ||
      changedProperties.has('internalSort')
    ) {
      this.updateSortedData();
    }
  }

  /**
   * Updates the sorted data based on current sort state.
   */
  private updateSortedData() {
    if (!this.currentSort) {
      this.sortedData = [...this.data];
      return;
    }

    const column = this.columns.find((col) => col.key === this.currentSort!.key);
    if (!column) {
      this.sortedData = [...this.data];
      return;
    }

    const sorted = [...this.data].sort((a, b) => {
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

      // Compare values
      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

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
      direction: newDirection,
    };

    // Update internal state if not controlled
    if (this.sort === undefined) {
      this.internalSort = newSort;
    }

    // Dispatch event
    this.dispatchEvent(
      new CustomEvent<SortChangeDetail>('lt-sort-change', {
        bubbles: true,
        composed: true,
        detail: {
          key: column.key,
          direction: newDirection,
          previousSort,
        },
      })
    );
  }

  /**
   * Gets a cell value from a row using a key (supports nested keys).
   */
  private getCellValue(row: unknown, key: string): unknown {
    return key.split('.').reduce((obj: Record<string, unknown>, k) => obj?.[k] as Record<string, unknown>, row as Record<string, unknown>);
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

    return html`
      <lt-icon class="sort-icon" name=${iconName}></lt-icon>
    `;
  }

  /**
   * Renders the table header.
   */
  private renderHeader() {
    return html`
      <thead>
        <tr>
          ${this.columns.map(
            (column) => html`
              <th
                class=${classMap({
                  sortable: !!column.sortable,
                  sorted: this.currentSort?.key === column.key,
                  sticky: !!column.sticky,
                  'hide-on-mobile': !!column.hideOnMobile,
                })}
                data-align=${column.align || 'left'}
                @click=${() => this.handleHeaderClick(column)}
                @keydown=${(e: KeyboardEvent) => {
                  if (column.sortable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    this.handleHeaderClick(column);
                  }
                }}
                tabindex=${column.sortable ? '0' : '-1'}
                aria-sort=${column.sortable
                  ? this.currentSort?.key === column.key
                    ? this.currentSort.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                  : nothing}
                style=${styleMap({
                  ...(column.width ? { width: column.width } : {}),
                  ...(column.minWidth ? { minWidth: column.minWidth } : {}),
                })}
              >
                ${column.sortable
                  ? html`
                      <div class="header-content">
                        <span>${column.label}</span>
                        ${this.renderSortIcon(column)}
                      </div>
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
    if (this.sortedData.length === 0) {
      return html`
        <tbody>
          <tr>
            <td colspan=${this.columns.length} class="empty-state">
              ${this.emptyMessage}
            </td>
          </tr>
        </tbody>
      `;
    }

    return html`
      <tbody>
        ${repeat(
          this.sortedData,
          (row) => this.rowKey
            ? (row as Record<string, unknown>)[this.rowKey]
            : JSON.stringify(row),
          (row, index) => html`
            <tr>
              ${this.columns.map(
                (column) => html`
                  <td
                    class=${classMap({
                      sticky: !!column.sticky,
                      'hide-on-mobile': !!column.hideOnMobile,
                    })}
                    data-align=${column.align || 'left'}
                    data-label=${column.label}
                    style=${styleMap({
                      ...(column.width ? { width: column.width } : {}),
                      ...(column.minWidth ? { minWidth: column.minWidth } : {}),
                    })}
                  >
                    ${this.renderCell(column, row, index)}
                  </td>
                `
              )}
            </tr>
          `
        )}
      </tbody>
    `;
  }

  render() {
    return html`
      <div class="table-container">
        <table>
          ${this.renderHeader()}
          ${this.renderBody()}
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
