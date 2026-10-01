import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { snackbarStyles } from './snackbar.styles';
import type { SnackbarVariant, SnackbarLabels } from './snackbar.types';
import type { SurfaceElevation, SurfaceAppearance } from '../surface/surface.types';
import { dispatch } from '../../utils';

import '@latty-ds/icons';
import '../surface/surface';

const DEFAULT_LABELS: SnackbarLabels = {
  dismiss: 'Dismiss'
};

/**
 * Brief notification that appears temporarily at the bottom of the viewport.
 *
 * Renders as a native "manual" popover on its own host, so it always appears in the top layer — above an open
 * `lt-dialog`/`lt-sidepanel`, regardless of z-index, since top-layer content always wins over non-top-layer
 * content no matter how high (SNK-companion to §6.1's `<dialog>` migration). Confirmed live: fully visible and
 * readable above an open modal. One narrower, unavoidable limitation (confirmed live too, not fixable from this
 * component's side): a native `showModal()` makes everything **outside the dialog's own subtree** inert,
 * including a sibling popover — explicitly setting `inert = false` on the snackbar does not override it. A
 * snackbar shown while a dialog is open is visible but not clickable until the dialog closes; its own
 * `duration` timer still fires normally regardless (a plain `setTimeout`, unaffected by inertness), so only a
 * `duration="0"` snackbar with a close/action button would be briefly stuck non-interactive in that scenario.
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

  /**
   * Elevation level of the internal surface, matching `lt-surface`'s scale.
   * @default '5'
   */
  @property({ reflect: true }) elevation: SurfaceElevation = '5';

  /**
   * Visual appearance of the internal surface, matching `lt-surface`'s vocabulary.
   * @default 'filled'
   */
  @property({ reflect: true }) appearance: SurfaceAppearance = 'filled';

  /** Overridable UI text (the close button's accessible name), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<SnackbarLabels> = {};

  private get _labels(): SnackbarLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

  private _timer?: ReturnType<typeof setTimeout>;
  // `updated()` also runs after the very first render, where `changed.has('open')` is true even though nothing
  // was ever shown — `open` starts false, so the else branch ran, dispatching a `hide` for a snackbar that was
  // never visible (SNK-1). Same fix and reasoning as lt-dropdown's `_skipNextOpenChange` (DDN-1). This guards
  // only the timer/event side effects, not the popover sync below — a snackbar mounted already open (markup
  // `open=""`) still needs `showPopover()` called once, or it stays in the native `display: none` state despite
  // `open` being true.
  private _skipNextOpenChange = true;

  /** Shows the snackbar and starts the auto-dismiss timer. */
  public show() {
    this.open = true;
  }

  /** Dismisses the snackbar. */
  public hide() {
    this.open = false;
  }

  connectedCallback() {
    super.connectedCallback();
    // `lt-snackbar` is a "manual" popover on its own host (not a wrapped child, unlike lt-dialog/lt-sidepanel's
    // inner <dialog>) so it renders in the top layer, above an open modal dialog regardless of z-index — the
    // whole reason for this migration (§6.1: a snackbar shown while a dialog is open would otherwise be hidden
    // behind it, since top-layer content always wins). "manual" means nothing native can show or dismiss it —
    // no light-dismiss on outside click, no Escape — only our own show()/hide() can, matching the existing
    // behavior (duration timer + explicit close button) exactly.
    this.setAttribute('popover', 'manual');
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('open')) {
      this._syncPopoverState();
      if (this._skipNextOpenChange) {
        this._skipNextOpenChange = false;
      } else if (this.open) {
        this._startTimer();
        dispatch(this, 'show');
      } else {
        this._clearTimer();
        dispatch(this, 'hide');
      }
    }
  }

  private _syncPopoverState() {
    if (this.open) {
      if (!this.matches(':popover-open')) this.showPopover();
    } else if (this.matches(':popover-open')) {
      this.hidePopover();
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
      <lt-surface elevation=${this.elevation} appearance=${this.appearance} background=${Snackbar._bgMap[this.variant]}>
        <div class="inner" role="status" aria-live="polite" part="base">
          ${iconName ? html`<lt-icon class="variant-icon" name=${iconName} part="icon"></lt-icon>` : ''}
          <span class="message" part="message">
            <slot></slot>
          </span>
          ${this.actionLabel
            ? html`<button class="action" @click=${this._handleAction} part="action">${this.actionLabel}</button>`
            : ''}
          ${this.closable
            ? html`<button class="close" @click=${this._handleClose} aria-label=${this._labels.dismiss} part="close">
                <lt-icon name="xmark"></lt-icon>
              </button>`
            : ''}
        </div>
      </lt-surface>
    `;
  }
}
