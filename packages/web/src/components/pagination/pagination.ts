import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { paginationStyles } from './pagination.styles';
import type { PaginationSize } from './pagination.types';
import '@latty/icons';

/**
 * Page navigation control for paged data sets.
 *
 * @element lt-pagination
 *
 * @fires {CustomEvent<{page: number}>} lt-change - Fired when the user navigates to a different page.
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

  private _go(page: number) {
    if (this.disabled || page < 1 || page > this.totalPages || page === this.page) return;
    this.page = page;
    this.dispatchEvent(new CustomEvent('lt-change', { detail: { page }, bubbles: true, composed: true }));
  }

  private _pages(): (number | '…')[] {
    const total = this.totalPages;
    const current = this.page;

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
    const atFirst = this.page <= 1;
    const atLast = this.page >= this.totalPages;

    return html`
      <nav aria-label="Pagination">
        <button aria-label="First page" ?disabled=${atFirst || this.disabled} @click=${() => this._go(1)}>
          <lt-icon name="double-nav-arrow-left" size="sm"></lt-icon>
        </button>
        <button
          aria-label="Previous page"
          ?disabled=${atFirst || this.disabled}
          @click=${() => this._go(this.page - 1)}
        >
          <lt-icon name="nav-arrow-left" size="sm"></lt-icon>
        </button>

        ${pages.map((p) =>
          p === '…'
            ? html`<button class="ellipsis" aria-hidden="true" tabindex="-1">…</button>`
            : html`<button
                aria-label="Page ${p}"
                aria-current=${p === this.page ? 'page' : nothing}
                ?disabled=${this.disabled}
                @click=${() => this._go(p as number)}
              >
                ${p}
              </button>`
        )}

        <button aria-label="Next page" ?disabled=${atLast || this.disabled} @click=${() => this._go(this.page + 1)}>
          <lt-icon name="nav-arrow-right" size="sm"></lt-icon>
        </button>
        <button aria-label="Last page" ?disabled=${atLast || this.disabled} @click=${() => this._go(this.totalPages)}>
          <lt-icon name="double-nav-arrow-right" size="sm"></lt-icon>
        </button>
      </nav>
    `;
  }
}
