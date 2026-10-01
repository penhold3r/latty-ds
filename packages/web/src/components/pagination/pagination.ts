import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { paginationStyles } from './pagination.styles';
import type { PaginationSize, PaginationLabels } from './pagination.types';
import { dispatch } from '../../utils';
import '@latty-ds/icons';

const DEFAULT_LABELS: PaginationLabels = {
  navigation: 'Pagination',
  firstPage: 'First page',
  previousPage: 'Previous page',
  page: (n) => `Page ${n}`,
  nextPage: 'Next page',
  lastPage: 'Last page'
};

/**
 * Page navigation control for paged data sets.
 *
 * @element lt-pagination
 *
 * @fires {CustomEvent<{page: number}>} change - Fired when the user navigates to a different page.
 *
 * @example
 * ```html
 * <lt-pagination page="1" total-pages="10"></lt-pagination>
 * ```
 *
 * @example
 * ```html
 * <lt-pagination page="5" total-pages="20" size="sm"></lt-pagination>
 * ```
 */
@customElement('lt-pagination')
export class Pagination extends ThemeableElement {
  static styles = paginationStyles;

  /** Currently active page (1-indexed). */
  @property({ type: Number, reflect: true }) page = 1;

  /** Total number of pages. */
  @property({ type: Number, attribute: 'total-pages', reflect: true }) totalPages = 1;

  /** Visual size. */
  @property({ reflect: true }) size: PaginationSize = 'md';

  /** Disable all controls. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Overridable UI text (nav landmark label, control button labels), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<PaginationLabels> = {};

  private get _labels(): PaginationLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

  /** `total-pages` as a whole number >= 1: NaN, zero and negatives collapse to a single page. */
  private get _total(): number {
    const total = Math.floor(Number(this.totalPages));
    return Number.isFinite(total) && total >= 1 ? total : 1;
  }

  /** `page` clamped into 1.._total, so `page="99"` on a 10-page set is the last page, not "no page selected". */
  private get _current(): number {
    const page = Math.floor(Number(this.page));
    return Number.isFinite(page) ? Math.min(Math.max(page, 1), this._total) : 1;
  }

  private _go(page: number) {
    if (this.disabled || page < 1 || page > this._total || page === this._current) return;
    this.page = page;
    dispatch(this, 'change', { page });
  }

  private _pages(): (number | '…')[] {
    const total = this._total;
    const current = this._current;

    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | '…')[] = [1];

    if (current > 3) pages.push('…');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push('…');

    pages.push(total);
    return pages;
  }

  render() {
    const pages = this._pages();
    const atFirst = this._current <= 1;
    const atLast = this._current >= this._total;

    return html`
      <nav aria-label=${this._labels.navigation}>
        <button aria-label=${this._labels.firstPage} ?disabled=${atFirst || this.disabled} @click=${() => this._go(1)}>
          <lt-icon name="double-caret-left" size="sm"></lt-icon>
        </button>
        <button
          aria-label=${this._labels.previousPage}
          ?disabled=${atFirst || this.disabled}
          @click=${() => this._go(this._current - 1)}
        >
          <lt-icon name="caret-left" size="sm"></lt-icon>
        </button>

        ${pages.map((p) =>
          p === '…'
            ? html`<button class="ellipsis" aria-hidden="true" tabindex="-1">…</button>`
            : html`<button
                aria-label=${this._labels.page(p as number)}
                aria-current=${p === this._current ? 'page' : nothing}
                ?disabled=${this.disabled}
                @click=${() => this._go(p as number)}
              >
                ${p}
              </button>`
        )}

        <button
          aria-label=${this._labels.nextPage}
          ?disabled=${atLast || this.disabled}
          @click=${() => this._go(this._current + 1)}
        >
          <lt-icon name="caret-right" size="sm"></lt-icon>
        </button>
        <button
          aria-label=${this._labels.lastPage}
          ?disabled=${atLast || this.disabled}
          @click=${() => this._go(this._total)}
        >
          <lt-icon name="double-caret-right" size="sm"></lt-icon>
        </button>
      </nav>
    `;
  }
}
