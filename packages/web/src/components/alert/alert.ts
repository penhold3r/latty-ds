import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { alertStyles } from './alert.styles';
import type { AlertVariant, AlertAppearance } from './alert.types';
import { resolveColorValue, dispatch } from '../../utils';

import '../icon-button/icon-button';
import '../text/text';

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
 * <lt-alert variant="error" closable>
 *   Failed to save — <a href="#">retry</a>
 * </lt-alert>
 * ```
 */
@customElement('lt-alert')
export class Alert extends ThemeableElement {
  static styles = alertStyles;

  /** Visual style. */
  @property({ reflect: true }) variant: AlertVariant = 'default';

  /** Visual treatment. `filled` uses a tinted background with border, `outlined` uses a white background with border, `solid` uses a solid color background with no border. */
  @property({ reflect: true }) appearance: AlertAppearance = 'filled';

  /** Optional bold heading above the body content. */
  @property({ reflect: true }) title = '';

  /**
   * Icon to show before the body. Leave empty for auto (shows variant icon for status variants),
   * set to `"none"` to suppress, or pass any icon name to override.
   */
  @property({ reflect: true }) icon = '';

  /** Show a dismiss button. Clicking it fires lt-close and removes the element. */
  @property({ type: Boolean, reflect: true }) closable = false;

  /** Background color override. Accepts a hex value (#1a1a2e) or a CSS token name (--lt-color-primary-600). */
  @property({ reflect: true }) background = '';

  /** Renders the title in small caps with wider letter spacing. */
  @property({ type: Boolean, reflect: true }) uppercase = false;

  private static readonly _iconMap: Record<AlertVariant, string> = {
    default: 'info-circle',
    success: 'check-circle',
    warning: 'warning-triangle',
    error: 'xmark-circle',
    info: 'info-circle'
  };

  private _handleClose() {
    const cancelled = !dispatch(this, 'lt-close', undefined, { cancelable: true });
    if (cancelled) return;
    this.setAttribute('dismissed', '');
    setTimeout(() => this.remove(), 200);
  }

  private get _resolvedIcon(): string {
    if (this.icon === 'none') return '';
    if (this.icon) return this.icon;
    if (this.variant === 'default') return '';
    return Alert._iconMap[this.variant] ?? '';
  }

  render() {
    const iconName = this._resolvedIcon;
    const bgStyle = styleMap(this.background ? { background: resolveColorValue(this.background) } : {});
    return html`
      <div class="inner" part="base" role="alert" style=${bgStyle}>
        ${iconName ? html`<lt-icon class="icon" name=${iconName} part="icon"></lt-icon>` : ''}
        <div class="body">
          ${this.title ? html`<lt-text variant="h6" as="p" class="title" part="title">${this.title}</lt-text>` : ''}
          <div class="content" part="content"><slot></slot></div>
        </div>
        ${this.closable
          ? html`<lt-icon-button
              class="close"
              part="close"
              icon="xmark"
              label="Dismiss"
              size="sm"
              @click=${this._handleClose}
            ></lt-icon-button>`
          : ''}
      </div>
    `;
  }
}
