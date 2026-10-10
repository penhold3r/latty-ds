import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import '@latty-ds/icons';

import { linkStyles } from './link.styles';
import type { LinkTarget, LinkUnderline } from './link.types';

/**
 * A styled anchor element. Uses the primary color by default with an underline on hover.
 * Set `external` to open in a new tab and display a trailing external-link icon.
 *
 * @element lt-link
 *
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

  /** Destination URL forwarded to the underlying `<a>` element. */
  @property({ reflect: true }) href = '';

  /** Opens the link in a new tab and appends an external-link icon. Equivalent to `target="_blank"` with safe
   * `rel` defaults, plus the icon — set `target` directly for a new tab without the icon. */
  @property({ type: Boolean, reflect: true }) external = false;

  /** Explicit `target` for the underlying `<a>`. Defaults to `_blank` when `external` is set, otherwise the
   * native default (same tab). */
  @property({ reflect: true }) target?: LinkTarget;

  /** Overrides the computed `rel`. By default, `rel="noopener noreferrer"` is applied whenever the resolved
   * target is `_blank` (security best practice for new-tab links), and omitted otherwise. */
  @property({ reflect: true }) rel?: string;

  /** Marks the link for download instead of navigation, forwarded to the native `download` attribute. An empty
   * string (`<lt-link download>`) downloads with the browser's default suggested filename; a non-empty string
   * sets the suggested filename. */
  @property({ reflect: true }) download?: string;

  /** Controls when the underline shows. @default 'hover' */
  @property({ reflect: true }) underline: LinkUnderline = 'hover';

  private get _target(): string {
    return this.target || (this.external ? '_blank' : '');
  }

  private get _rel(): string {
    if (this.rel !== undefined) return this.rel;
    return this._target === '_blank' ? 'noopener noreferrer' : '';
  }

  render() {
    return html`
      <a
        part="base"
        href=${this.href || nothing}
        target=${this._target || nothing}
        rel=${this._rel || nothing}
        download=${this.download ?? nothing}
      >
        <slot></slot>
        ${this.external ? html`<lt-icon name="external" size="xs" part="icon"></lt-icon>` : nothing}
      </a>
    `;
  }
}
