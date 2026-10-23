import { html, nothing, type PropertyValues } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, query } from 'lit/decorators.js';

import { sidepanelStyles } from './sidepanel.styles';
import { backdropFeatureStyles } from '../shared/backdrop.styles';
import type { SidePanelAnchor, SidePanelLabels } from './sidepanel.types';
import { dispatch } from '../../utils';
import { lockBodyScroll, unlockBodyScroll } from '../shared/scroll-lock';
import { NativeAttrsController } from '../shared/native-attrs';

import '../icon-button/icon-button';
import '../text/text';

const DEFAULT_LABELS: SidePanelLabels = {
  close: 'Close panel'
};

/**
 * A slide-in panel anchored to any edge of the viewport, built on the native `<dialog>` element — the same
 * migration `lt-dialog` went through applied here to fix equivalent gaps: a closed
 * panel is no longer just transformed off-screen while staying focusable and exposed to assistive tech
 * (`display: none` when closed is native, automatic, and absolute); focus trap and restore on close both come
 * from `showModal()`/`close()` for free — no manual focus-tracking code needed here at all; Escape closes only the panel that was
 * actually focused, not every open panel on the page (no more `window`-level keydown listener); and `close`
 * fires consistently from `updated()` whenever `open` becomes `false`, however it happened — not only when
 * `hide()` was called directly.
 * @element lt-sidepanel
 * @slot - Content rendered inside the panel body
 * @fires open - Fired when the panel opens
 * @fires close - Fired when the panel closes (however it closed — the close button, Escape, a backdrop click,
 * or setting `open` to `false` directly)
 * @part overlay - The backdrop scrim behind the panel (the native `<dialog>`'s own `::backdrop`, exposed as a
 * part so consumers can still target it, even though it's not a real light-DOM-visible element)
 * @part panel - The sliding panel container (the `<dialog>` element itself)
 * @part header - The header bar (contains label and close button)
 * @part close-button - The close button inside the header
 * @part body - The scrollable content area wrapping the default slot
 * @cssprop [--lt-sidepanel-shadow] - Overrides the panel's box-shadow, for all anchor positions.
 * @cssprop [--lt-sidepanel-overlay-opacity] - Backdrop darkness. Set via the `overlay-opacity` property/attribute
 * instead of this custom property directly, unless you're overriding it from outside the component.
 */
@customElement('lt-sidepanel')
export class SidePanel extends ThemeableElement {
  static styles = [sidepanelStyles, backdropFeatureStyles];

  /** Whether the panel is visible. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Edge from which the panel slides in. `'start'`/`'end'` flip with reading direction. */
  @property({ reflect: true }) anchor: SidePanelAnchor = 'start';

  /** Panel width (start/end anchors) or height (top/bottom anchors). */
  @property() size = '320px';

  /** Title shown in the panel header. When empty, the header is hidden. */
  @property({ reflect: true }) label = '';

  /** Suppress the built-in close button. */
  @property({ type: Boolean, attribute: 'no-close-button' }) noCloseButton = false;

  /** Apply a frosted-glass blur effect to the backdrop. */
  @property({ type: Boolean, reflect: true, attribute: 'backdrop-blur' }) backdropBlur = false;

  /** Backdrop darkness as an alpha value from 0 (transparent) to 1 (opaque). */
  @property({ type: Number, attribute: 'overlay-opacity' }) overlayOpacity = 0.45;

  /** Overridable UI text (the close button's accessible name), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<SidePanelLabels> = {};

  private get _labels(): SidePanelLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

  @query('dialog') private dialogElement?: HTMLDialogElement;
  private _nativeAttrs = new NativeAttrsController(this, () => this.dialogElement, {
    exclude: ['aria-labelledby']
  });
  private _scrollLocked = false;
  /*
   * Same first-update guard as lt-dialog, lt-dropdown, and lt-snackbar: `updated()` runs after the very first
   * render where `changed.has('open')` is true even though nothing was ever shown.
   */
  private _skipNextOpenChange = true;

  /** Open the panel. */
  public show() {
    this.open = true;
  }

  /** Close the panel. */
  public hide() {
    this.open = false;
  }

  /** Toggle the panel open/closed. */
  public toggle() {
    this.open = !this.open;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // A panel removed from the DOM while still open must still release its scroll lock.
    if (this._scrollLocked) {
      unlockBodyScroll();
      this._scrollLocked = false;
    }
  }

  updated(changed: PropertyValues<this>): void {
    if (changed.has('open')) {
      if (this._skipNextOpenChange) {
        this._skipNextOpenChange = false;
      } else if (this.open) {
        this._handleOpen();
      } else {
        this._handleClose();
      }
    }

    if (!changed.has('anchor')) return;
    const panel = this.dialogElement;
    if (!panel) return;

    /*
     * Disable transition and snap to the new anchor's off-screen start position.
     * Handles both anchor-only changes and anchor + open changing simultaneously.
     */
    panel.style.transition = 'none';
    if (this.open) {
      panel.style.transform = this._offScreenTransform;
    }
    void panel.getBoundingClientRect(); // force style recalculation to commit position

    requestAnimationFrame(() => {
      panel.style.transition = '';
      panel.style.transform = '';
    });
  }

  private _handleOpen() {
    if (!this._scrollLocked) {
      lockBodyScroll();
      this._scrollLocked = true;
    }
    /*
     * Guard against calling showModal() on an already-open dialog — throws InvalidStateError. Initial focus placement and, on close, focus restoration to whatever had focus beforehand are both
     * native showModal()/close() behavior — nothing to implement here for either (confirmed in the investigation's
     * spike: "Focus returns to a shadow-rooted opener on close" works with no manual tracking at all).
     */
    if (this.dialogElement && !this.dialogElement.open) {
      this.dialogElement.showModal();
    }
    dispatch(this, 'open');
  }

  private _handleClose() {
    if (this._scrollLocked) {
      unlockBodyScroll();
      this._scrollLocked = false;
    }
    /*
     * The native element may already be closed here (this runs for both "we closed it" and "it closed itself,
     * e.g. via Escape" — see _handleNativeClose below), so guard against calling close() twice.
     */
    if (this.dialogElement?.open) {
      this.dialogElement.close();
    }
    dispatch(this, 'close');
  }

  /*
   * Unlike lt-dialog, this has no close-on-escape toggle, so there's nothing to preventDefault() on 'cancel' —
   * Escape is left entirely to the native element, now scoped to whichever panel actually has focus, not a
   * window-level listener that closed every open panel on one keypress regardless of which was focused.
   */

  /*
   * The native element's own 'close' event fires whenever IT closes, for any reason — sync `open` back so the
   * two never drift apart. If we're the ones who just called close() (inside _handleClose(), above), `open` is
   * already false and this is a no-op.
   */
  private _handleNativeClose = () => {
    this.open = false;
  };

  /*
   * The clicked-outside-the-content area of a shown <dialog> resolves e.target to the <dialog> element itself
   * (::backdrop isn't a real node and can't be an event target) — clicking any actual descendant instead
   * targets that descendant (same mechanism as lt-dialog's backdrop-click detection, confirmed in the spike).
   */
  private _handleDialogClick = (e: MouseEvent) => {
    if (e.target === this.dialogElement) {
      this.hide();
    }
  };

  /*
   * translateX has no logical/direction-aware equivalent in CSS, unlike the positioning below (inset-inline-*
   * resolves automatically) — var(--_start-x)/var(--_end-x) carry the direction-dependent sign instead (defined
   * in the stylesheet, flipped under :host(:dir(rtl))), so this stays correct under RTL without reading
   * getComputedStyle(this).direction here at all.
   */
  private get _offScreenTransform(): string {
    switch (this.anchor) {
      case 'end':
        return 'translateX(var(--_end-x, 100%))';
      case 'top':
        return 'translateY(-100%)';
      case 'bottom':
        return 'translateY(100%)';
      default:
        return 'translateX(var(--_start-x, -100%))';
    }
  }

  private get _panelStyle(): string {
    const sizeStyle = this.anchor === 'start' || this.anchor === 'end' ? `width: ${this.size}` : `height: ${this.size}`;
    return `${sizeStyle}; --lt-sidepanel-overlay-opacity: ${this.overlayOpacity}`;
  }

  private get _hasLabel(): boolean {
    return this.label.trim().length > 0;
  }

  private _renderHeader() {
    if (!this._hasLabel && this.noCloseButton) return '';
    return html`
      <div part="header" class="header">
        ${this._hasLabel
          ? html`<lt-text variant="h6" class="panel-label" id="sidepanel-label">${this.label}</lt-text>`
          : ''}
        ${!this.noCloseButton
          ? html`
              <lt-icon-button
                part="close-button"
                class="close-button"
                icon="xmark"
                label=${this._labels.close}
                size="sm"
                @click=${this.hide}
              ></lt-icon-button>
            `
          : ''}
      </div>
    `;
  }

  render() {
    return html`
      <dialog
        part="panel"
        style=${this._panelStyle}
        aria-labelledby=${this._hasLabel ? 'sidepanel-label' : this.getAttribute('aria-labelledby') || nothing}
        @close=${this._handleNativeClose}
        @click=${this._handleDialogClick}
      >
        ${this._renderHeader()}
        <div part="body" class="body">
          <slot></slot>
        </div>
      </dialog>
    `;
  }
}
