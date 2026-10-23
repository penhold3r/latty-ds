import { html, type PropertyValues } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { alertStyles } from './alert.styles';
import type { AlertVariant, AlertAppearance, AlertLabels } from './alert.types';
import { resolveColorValue, dispatch } from '../../utils';

import '../icon-button/icon-button';
import '../text/text';

const DEFAULT_LABELS: AlertLabels = {
  dismiss: 'Dismiss'
};

/**
 * Inline notification for persistent contextual feedback.
 * @element lt-alert
 * @slot - Alert body. Accepts any HTML — bold, links, lists, etc.
 * @fires close - Fired when the dismiss button is clicked, just before the element is hidden. Cancelable.
 * @example
 * ```html
 * <lt-alert variant="success" heading="Upload complete">
 *   Your file has been processed and is ready to download.
 * </lt-alert>
 * ```
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
  @property({ reflect: true }) heading = '';

  /**
   * Alias for `heading`.
   * @deprecated Use `heading` instead. `title` collides with the browser's own native tooltip attribute — every
   * HTML element has one regardless of custom-element status, so `<lt-alert title="…">` made hovering anywhere
   * over the alert show a browser tooltip, and assistive tech could read it as a duplicate description (ALR-3).
   * This alias keeps existing markup/JS working; the native `title` attribute is always stripped as soon as
   * it's read, so the tooltip never appears.
   * @returns The current heading value.
   */
  get title(): string {
    return this.heading;
  }
  set title(value: string) {
    this.heading = value;
  }

  /**
   * Icon to show before the body. Leave empty for auto (shows variant icon for status variants),
   * set to `"none"` to suppress, or pass any icon name to override.
   */
  @property({ reflect: true }) icon = '';

  /** Show a dismiss button. Clicking it fires `close` and hides the element (sets `open` to false). */
  @property({ type: Boolean, reflect: true }) closable = false;

  /**
   * Whether the alert is visible. Defaults to true, so existing markup with no attribute keeps showing.
   * Dismissing (or setting this to false directly) hides the alert but does not remove it from the DOM —
   * that choice is left to the consumer, since a framework that owns this node would otherwise fight the
   * alert over removing it out from under its own reconciliation.
   */
  @property({ type: Boolean, reflect: true }) open = true;

  /** Background color override. Accepts a hex value (#1a1a2e) or a CSS token name (--lt-color-primary-600). */
  @property({ reflect: true }) background = '';

  /** Renders the heading in small caps with wider letter spacing. */
  @property({ type: Boolean, reflect: true }) uppercase = false;

  /** Overridable UI text (the dismiss button's accessible name), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<AlertLabels> = {};

  private get _labels(): AlertLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

  connectedCallback() {
    super.connectedCallback();
    /*
     * Markup never goes through the `title` accessor above — the attribute is just present on the node from
     * HTML parsing. `heading` wins if both are somehow given.
     */
    if (this.hasAttribute('title')) {
      if (!this.heading) this.heading = this.getAttribute('title')!;
      this.removeAttribute('title');
    }
  }

  private static readonly _iconMap: Record<AlertVariant, string> = {
    default: 'info-circle',
    success: 'check-circle',
    warning: 'warning-triangle',
    error: 'xmark-circle',
    info: 'info-circle'
  };

  private _handleClose() {
    const cancelled = !dispatch(this, 'close', undefined, { cancelable: true });
    if (cancelled) return;
    /*
     * The close button is about to disappear from under the user's focus. Move focus to the host (still
     * visible for the fade below) now, rather than leaving it on the button and letting the browser drop
     * focus to <body> with no warning once the alert is actually hidden.
     */
    this.tabIndex = -1;
    this.focus();
    this.setAttribute('dismissed', '');
    setTimeout(() => {
      this.open = false;
    }, 200);
  }

  override updated(changed: PropertyValues<this>) {
    super.updated(changed);
    // Reopening a previously dismissed alert should replay the entrance, not stay mid-exit-animation.
    if (changed.has('open') && this.open) this.removeAttribute('dismissed');
  }

  /*
   * Error/warning alerts are urgent enough to interrupt the screen reader (`alert`, assertive); the rest are
   * informational and should announce without cutting off whatever the user was already hearing (`status`, polite).
   */
  private get _role(): 'alert' | 'status' {
    return this.variant === 'error' || this.variant === 'warning' ? 'alert' : 'status';
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
      <div class="inner" part="base" role=${this._role} style=${bgStyle}>
        ${iconName ? html`<lt-icon class="icon" name=${iconName} part="icon"></lt-icon>` : ''}
        <div class="body">
          ${this.heading ? html`<lt-text variant="h6" as="p" class="title" part="title">${this.heading}</lt-text>` : ''}
          <div class="content" part="content"><slot></slot></div>
        </div>
        ${this.closable
          ? html`<lt-icon-button
              class="close"
              part="close"
              icon="xmark"
              label=${this._labels.dismiss}
              size="sm"
              @click=${this._handleClose}
            ></lt-icon-button>`
          : ''}
      </div>
    `;
  }
}
