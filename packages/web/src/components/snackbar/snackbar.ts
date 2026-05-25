import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { snackbarStyles } from './snackbar.styles';
import type { SnackbarVariant } from './snackbar.types';
import { dispatch } from '../../utils';

import '@latty/icons';
import '../surface/surface';

/**
 * Brief notification that appears temporarily at the bottom of the viewport.
 *
 * @element lt-snackbar
 *
 * @slot - Notification content. Accepts any HTML — bold, links, etc.
 *
 * @fires show - Fired when the snackbar becomes visible.
 * @fires hide - Fired when the snackbar is dismissed.
 * @fires action - Fired when the action button is clicked.
 *
 * @example
 * ```html
 * <lt-snackbar id="sb" variant="success">Changes saved</lt-snackbar>
 * <script type="module">
 *   document.getElementById('sb').show();
 * </script>
 * ```
 *
 * @example
 * ```html
 * <lt-snackbar action-label="Undo" duration="6000">
 *   File <strong>report.pdf</strong> deleted
 * </lt-snackbar>
 * ```
 */
@customElement('lt-snackbar')
export class Snackbar extends ThemeableElement {
  static styles = snackbarStyles;

  /** Visual style. */
  @property({ reflect: true }) variant: SnackbarVariant = 'default';

  /** Auto-dismiss delay in milliseconds. Set to 0 to disable auto-dismiss. */
  @property({ type: Number, reflect: true }) duration = 4000;

  /** Whether the snackbar is visible. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Show a dismiss button. */
  @property({ type: Boolean, reflect: true }) closable = true;

  /** Label for the optional action button. */
  @property({ attribute: 'action-label', reflect: true }) actionLabel = '';

  /**
   * Icon to show before the message. Leave empty for auto (shows variant icon for status variants),
   * set to `"none"` to suppress, or pass any icon name to override.
   */
  @property({ reflect: true }) icon = '';

  private _timer?: ReturnType<typeof setTimeout>;

  /** Shows the snackbar and starts the auto-dismiss timer. */
  public show() {
    this.open = true;
  }

  /** Dismisses the snackbar. */
  public hide() {
    this.open = false;
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('open')) {
      if (this.open) {
        this._startTimer();
        dispatch(this, 'show');
      } else {
        this._clearTimer();
        dispatch(this, 'hide');
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearTimer();
  }

  private _startTimer() {
    this._clearTimer();
    if (this.duration > 0) {
      this._timer = setTimeout(() => this.hide(), this.duration);
    }
  }

  private _clearTimer() {
    if (this._timer !== undefined) {
      clearTimeout(this._timer);
      this._timer = undefined;
    }
  }

  private _handleClose() {
    this.hide();
  }

  private _handleAction() {
    dispatch(this, 'action');
    this.hide();
  }

  private static readonly _iconMap: Partial<Record<SnackbarVariant, string>> = {
    success: 'check-circle',
    warning: 'warning-triangle',
    error: 'xmark-circle',
    info: 'info-circle'
  };

  private static readonly _bgMap: Record<SnackbarVariant, string> = {
    default: '--lt-bg-inverse',
    success: '--lt-interactive-success-bg',
    warning: '--lt-interactive-warning-bg',
    error: '--lt-interactive-error-bg',
    info: '--lt-interactive-info-bg'
  };

  private get _resolvedIcon(): string {
    if (this.icon === 'none') return '';
    if (this.icon) return this.icon;
    if (this.variant === 'default') return '';
    return Snackbar._iconMap[this.variant] ?? '';
  }

  render() {
    const iconName = this._resolvedIcon;
    return html`
      <lt-surface elevation="5" background=${Snackbar._bgMap[this.variant]}>
        <div class="inner" role="status" aria-live="polite" part="base">
          ${iconName ? html`<lt-icon class="variant-icon" name=${iconName} part="icon"></lt-icon>` : ''}
          <span class="message" part="message">
            <slot></slot>
          </span>
          ${this.actionLabel
            ? html`<button class="action" @click=${this._handleAction} part="action">${this.actionLabel}</button>`
            : ''}
          ${this.closable
            ? html`<button class="close" @click=${this._handleClose} aria-label="Dismiss" part="close">
                <lt-icon name="xmark"></lt-icon>
              </button>`
            : ''}
        </div>
      </lt-surface>
    `;
  }
}
