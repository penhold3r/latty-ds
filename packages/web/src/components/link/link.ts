import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import '@latty-ds/icons';

import { linkStyles } from './link.styles';
import type { LinkUnderline, LinkLabels } from './link.types';
import { NativeAttrsController } from '../shared/native-attrs';

const DEFAULT_LABELS: LinkLabels = {
  external: 'opens in a new tab'
};

/**
 * A styled anchor element. Uses the primary color by default with an underline on hover.
 * Set `external` to open in a new tab and display a trailing external-link icon.
 * Automatically forwards native `<a>` attributes (`target`, `rel`, `download`, `hreflang`, `referrerpolicy`, etc.)
 * onto the underlying `<a>` element.
 * @element lt-link
 * @example
 * ```html
 * <lt-link href="https://example.com">Visit site</lt-link>
 * <lt-link href="https://example.com" external>Open in new tab</lt-link>
 * <lt-link href="https://example.com" target="_blank">New tab, no icon</lt-link>
 * <lt-link href="/report.pdf" download>Download report</lt-link>
 * <lt-link href="/doc" underline="always">Always underlined</lt-link>
 * ```
 */
@customElement('lt-link')
export class Link extends ThemeableElement {
  static styles = linkStyles;

  private _nativeAttrs = new NativeAttrsController(this, () => this.shadowRoot?.querySelector('a'), {
    exclude: ['target', 'rel']
  });

  /** Destination URL forwarded to the underlying `<a>` element. */
  @property({ reflect: true }) href = '';

  /** Opens the link in a new tab and appends an external-link icon. Equivalent to `target="_blank"` with safe
   * `rel` defaults, plus the icon — set `target` directly for a new tab without the icon. */
  @property({ type: Boolean, reflect: true }) external = false;

  /** Controls when the underline shows. @default 'hover'. */
  @property({ reflect: true }) underline: LinkUnderline = 'hover';

  /** Overridable UI text, for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<LinkLabels> = {};

  private get _labels(): LinkLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

  private get _target(): string {
    return this.getAttribute('target') || (this.external ? '_blank' : '');
  }

  private get _rel(): string {
    const rel = this.getAttribute('rel');
    if (rel !== null) return rel;
    return this._target === '_blank' ? 'noopener noreferrer' : '';
  }

  render() {
    return html`
      <a part="base" href=${this.href || nothing} target=${this._target || nothing} rel=${this._rel || nothing}>
        <slot></slot>
        ${this.external
          ? html`<lt-icon name="external" size="xs" part="icon" aria-hidden="true"></lt-icon
              ><span class="sr-only">(${this._labels.external})</span>`
          : nothing}
      </a>
    `;
  }
}
