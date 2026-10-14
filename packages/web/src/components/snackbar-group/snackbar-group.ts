import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { snackbarGroupStyles } from './snackbar-group.styles';
import type { SnackbarShowOptions } from './snackbar-group.types';
import type { Snackbar } from '../snackbar/snackbar';

import '../snackbar/snackbar';

/**
 * Coordinates multiple `lt-snackbar`s shown imperatively: queues excess ones past `max-visible` instead of
 * letting them overlap at the same spot, and stacks simultaneously-visible ones vertically. Place one instance
 * once (e.g. at the end of `<body>`); every other part of the app calls its `show()` method.
 *
 * Renders as a native "manual" popover on its own host (same reasoning as `lt-snackbar` itself used to have
 * alone, before this component existed) so the whole stack always appears in the top layer, above an open
 * `lt-dialog`/`lt-sidepanel` regardless of z-index — shown only while at least one snackbar is actually visible,
 * so it has zero top-layer presence otherwise.
 *
 * @element lt-snackbar-group
 *
 * @example
 * ```html
 * <lt-snackbar-group id="snackbars"></lt-snackbar-group>
 * <script type="module">
 *   const group = document.getElementById('snackbars');
 *   document.getElementById('delete-btn').addEventListener('click', () => {
 *     group.show({ message: 'File deleted', variant: 'success', actionLabel: 'Undo', onAction: () => restore() });
 *   });
 * </script>
 * ```
 *
 * @example
 * ```html
 * <!-- Shows up to 3 at once; a 4th show() call queues until one of the first 3 closes -->
 * <lt-snackbar-group max-visible="3"></lt-snackbar-group>
 * ```
 */
@customElement('lt-snackbar-group')
export class SnackbarGroup extends ThemeableElement {
  static styles = snackbarGroupStyles;

  /**
   * How many snackbars can be visible at once. Calls to `show()` past this limit queue instead of overlapping,
   * and are presented automatically as earlier ones close.
   * @default 1
   */
  @property({ type: Number, attribute: 'max-visible' }) maxVisible = 1;

  private _visible: Snackbar[] = [];
  private _queue: Snackbar[] = [];

  /**
   * Creates and shows a snackbar (or queues it if `max-visible` is already reached). Returns the created
   * `lt-snackbar` instance — call `.hide()` on it directly to dismiss early, or listen for its own events.
   */
  public show(options: SnackbarShowOptions): Snackbar {
    const sb = this._build(options);
    if (this._visible.length < this.maxVisible) {
      this._present(sb);
    } else {
      this._queue.push(sb);
    }
    return sb;
  }

  private _build(options: SnackbarShowOptions): Snackbar {
    const sb = document.createElement('lt-snackbar') as Snackbar;
    sb.managed = true;
    sb.textContent = options.message;
    if (options.variant !== undefined) sb.variant = options.variant;
    if (options.duration !== undefined) sb.duration = options.duration;
    if (options.closable !== undefined) sb.closable = options.closable;
    if (options.actionLabel !== undefined) sb.actionLabel = options.actionLabel;
    if (options.icon !== undefined) sb.icon = options.icon;
    if (options.labels !== undefined) sb.labels = options.labels;
    if (options.onAction) sb.addEventListener('action', options.onAction, { once: true });
    sb.addEventListener('hide', () => this._onHide(sb), { once: true });
    return sb;
  }

  private async _present(sb: Snackbar) {
    this._visible.push(sb);
    this.appendChild(sb);
    // Lit's very first update on a freshly-connected element always treats `open` as "changed" — calling
    // show() before that first (still-closed) render settles would make lt-snackbar's own mount-already-open
    // guard (SNK-1) swallow this as if it had been declared open from the start: no `show` event, no
    // auto-dismiss timer ever starting. Awaiting updateComplete first lets that initial cycle pass harmlessly,
    // so the real open transition below is a genuinely new, correctly-handled update.
    await sb.updateComplete;
    sb.show();
    this._syncPopoverState();
  }

  private _onHide(sb: Snackbar) {
    this._visible = this._visible.filter((s) => s !== sb);
    this._syncPopoverState();
    this._promoteFromQueue();
    this._removeAfterExit(sb);
  }

  // Removing the node immediately would cut its own fade/slide-out transition short (the same display-cuts-the-
  // transition-off-partway-through class of bug `allow-discrete` exists to prevent in the first place) — wait
  // for the host's own opacity transition to actually finish first. prefers-reduced-motion disables transitions
  // entirely (no transitionend would ever fire), so that case removes immediately instead of waiting forever.
  private _removeAfterExit(sb: Snackbar) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sb.remove();
      return;
    }
    // Not { once: true }: the same CSS also transitions display/overlay (for allow-discrete) alongside
    // opacity/transform, each potentially firing its own transitionend — `once` would consume the listener on
    // whichever of those fires first, regardless of whether it was the one this code actually cares about,
    // silently breaking removal if opacity's doesn't happen to be first. Removed manually instead, only once
    // the real match is found.
    const onTransitionEnd = (e: Event) => {
      const te = e as TransitionEvent;
      // A composed transitionend from inside sb's own shadow tree (e.g. lt-surface) gets retargeted to report
      // `e.target` as sb itself once it bubbles past the shadow boundary — composedPath()[0] is the only
      // reliable way to tell "this host's own transition" apart from a descendant's.
      if (te.propertyName !== 'opacity' || te.composedPath()[0] !== sb) return;
      sb.removeEventListener('transitionend', onTransitionEnd);
      sb.remove();
    };
    sb.addEventListener('transitionend', onTransitionEnd);
  }

  private _promoteFromQueue() {
    while (this._queue.length > 0 && this._visible.length < this.maxVisible) {
      const next = this._queue.shift()!;
      this._present(next);
    }
  }

  private _syncPopoverState() {
    const hasVisible = this._visible.length > 0;
    if (hasVisible && !this.matches(':popover-open')) this.showPopover();
    else if (!hasVisible && this.matches(':popover-open')) this.hidePopover();
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('popover', 'manual');
  }

  render() {
    return html`<slot></slot>`;
  }
}
