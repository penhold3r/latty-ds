import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import '@latty-ds/icons';

import { linkStyles } from './link.styles';

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
 * ```
 */
@customElement('lt-link')
export class Link extends ThemeableElement {
  static styles = linkStyles;

  /** Destination URL forwarded to the underlying `<a>` element. */
  @property({ reflect: true }) href = '';

  /** Opens the link in a new tab and appends an external-link icon. */
  @property({ type: Boolean, reflect: true }) external = false;

  render() {
    return html`
      <a
        part="base"
        href=${this.href || nothing}
        target=${this.external ? '_blank' : nothing}
        rel=${this.external ? 'noopener noreferrer' : nothing}
      >
        <slot></slot>
        ${this.external ? html`<lt-icon name="external" size="xs" part="icon"></lt-icon>` : nothing}
      </a>
    `;
  }
}
