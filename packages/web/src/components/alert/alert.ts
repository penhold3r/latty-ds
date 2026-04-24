import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { alertStyles } from './alert.styles';
import type { AlertVariant, AlertAppearance } from './alert.types';

import '@latty/icons';

/**
 * Inline notification for persistent contextual feedback.
 *
 * @element lt-alert
 *
 * @slot - Alert body. Accepts any HTML — bold, links, lists, etc.
 *
 * @fires lt-close - Fired when the dismiss button is clicked, just before the element is removed.
 *
 * @example
 * ```html
 * <lt-alert variant="success" title="Upload complete">
 *   Your file has been processed and is ready to download.
 * </lt-alert>
 * ```
 *
 * @example
 * ```html
 * <lt-alert variant="error" with-icon closable>
 *   Failed to save — <a href="#">retry</a>
 * </lt-alert>
 * ```
 */
@customElement('lt-alert')
export class Alert extends LitElement {
  static styles = alertStyles;

  /** Visual style. */
  @property({ reflect: true }) variant: AlertVariant = 'default';

  /** Visual treatment. `filled` uses a tinted background with border, `outlined` uses a white background with border, `solid` uses a solid color background with no border. */
  @property({ reflect: true }) appearance: AlertAppearance = 'filled';

  /** Optional bold heading above the body content. */
  @property({ reflect: true }) title = '';

  /** Show a leading icon matching the variant. */
  @property({ attribute: 'with-icon', type: Boolean, reflect: true }) withIcon = false;

  /** Show a dismiss button. Clicking it fires lt-close and removes the element. */
  @property({ type: Boolean, reflect: true }) closable = false;

  private static readonly _iconMap: Record<AlertVariant, string> = {
    default: 'info-circle',
    success: 'check-circle',
    warning: 'warning-triangle',
    error: 'xmark-circle',
    info: 'info-circle',
  };

  private _handleClose() {
    const cancelled = !this.dispatchEvent(
      new CustomEvent('lt-close', { bubbles: true, composed: true, cancelable: true }),
    );
    if (cancelled) return;
    this.setAttribute('dismissed', '');
    setTimeout(() => this.remove(), 200);
  }

  render() {
    return html`
      <div class="inner" part="base" role="alert">
        ${this.withIcon
          ? html`<lt-icon
              class="icon"
              name=${Alert._iconMap[this.variant]}
              part="icon"
            ></lt-icon>`
          : ''}
        <div class="body">
          ${this.title ? html`<p class="title" part="title">${this.title}</p>` : ''}
          <div class="content" part="content"><slot></slot></div>
        </div>
        ${this.closable
          ? html`<button
              class="close"
              @click=${this._handleClose}
              aria-label="Dismiss"
              part="close"
            >
              <lt-icon name="xmark"></lt-icon>
            </button>`
          : ''}
      </div>
    `;
  }
}
