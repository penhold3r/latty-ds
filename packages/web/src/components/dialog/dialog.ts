import { html, type PropertyValues } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, query } from 'lit/decorators.js';

import { dialogStyles } from './dialog.styles';
import { backdropFeatureStyles } from '../shared/backdrop.styles';
import { DialogSize, type DialogLabels } from './dialog.types';
import type { SurfaceElevation, SurfaceAppearance } from '../surface/surface.types';
import { lockBodyScroll, unlockBodyScroll } from '../shared/scroll-lock';

const DEFAULT_LABELS: DialogLabels = {
  close: 'Close dialog'
};

import '../icon-button/icon-button';
import '../surface/surface';
import '../text/text';

/**
 * Dialog component (modal) built on the native `<dialog>` element, with a backdrop, animations, and full
 * accessibility features for free — top-layer stacking, a real focus trap, an inert page background, and
 * Escape-to-close all come from the platform (`showModal()`), not from anything this component builds itself
 * (DLG-1). Body scroll locking is the one thing native `<dialog>` doesn't do on its own — this component keeps
 * its own ref-counted lock for that (DLG-3, see `shared/scroll-lock.ts`).
 *
 * @element lt-dialog
 *
 * Features:
 * - Multiple size options (sm, md, lg, xl, fullscreen)
 * - Backdrop overlay with configurable click-to-close
 * - Close on Escape key (native; `close-on-escape="false"` prevents it)
 * - Header with optional heading and close button
 * - Scrollable body content
 * - Optional footer for actions
 * - Native focus trap and restoration
 * - `open` / `close` events
 * - Accessible via the native `<dialog>` element's own implicit modal semantics
 *
 * @slot - Dialog body content
 * @slot header - Custom header content (overrides heading prop)
 * @slot footer - Footer content (typically for action buttons)
 *
 * @fires open - Fired when dialog opens
 * @fires close - Fired when dialog closes (however it closed — the close button, Escape, a backdrop click, or
 * setting `open` to `false` directly)
 *
 * @example
 * ```html
 * <lt-dialog open heading="Confirm Action">
 *   <p>Are you sure you want to proceed?</p>
 *   <div slot="footer">
 *     <lt-button variant="neutral">Cancel</lt-button>
 *     <lt-button variant="primary">Confirm</lt-button>
 *   </div>
 * </lt-dialog>
 * ```
 *
 * @example
 * ```html
 * <lt-dialog size="lg" open heading="Settings" no-close-button>
 *   <p>Dialog content here...</p>
 * </lt-dialog>
 * ```
 */
@customElement('lt-dialog')
export class Dialog extends ThemeableElement {
  static styles = [dialogStyles, backdropFeatureStyles];

  /**
   * Size of the dialog (affects max width).
   * @default 'md'
   */
  @property({ reflect: true }) size: DialogSize = 'md';

  /**
   * Whether the dialog is open.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) open = false;

  /**
   * Dialog heading displayed in the header.
   * @default ''
   */
  @property() heading = '';

  /**
   * @deprecated Use `heading` instead. `title` collides with the browser's own native tooltip attribute — every
   * HTML element has one regardless of custom-element status, so `<lt-dialog title="…">` made hovering anywhere
   * over the dialog show a browser tooltip, and assistive tech could read it as a duplicate description (DLG-6).
   * This alias keeps existing markup/JS working; the native `title` attribute is always stripped as soon as
   * it's read, so the tooltip never appears.
   */
  get title(): string {
    return this.heading;
  }
  set title(value: string) {
    this.heading = value;
  }

  /**
   * Suppress the built-in close button in the header.
   * @default false
   */
  @property({ type: Boolean, attribute: 'no-close-button' }) noCloseButton = false;

  /**
   * Whether clicking the backdrop closes the dialog.
   * @default true
   */
  @property({ type: Boolean, attribute: 'close-on-backdrop-click' }) closeOnBackdropClick = true;

  /**
   * Whether pressing Escape closes the dialog.
   * @default true
   */
  @property({ type: Boolean, attribute: 'close-on-escape' }) closeOnEscape = true;

  /**
   * Renders the dialog heading in small caps with wider letter spacing.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) uppercase = false;

  /**
   * Apply a frosted-glass blur effect to the backdrop.
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'backdrop-blur' }) backdropBlur = false;

  /**
   * Elevation level of the internal surface, matching `lt-surface`'s scale.
   * @default '4'
   */
  @property({ reflect: true }) elevation: SurfaceElevation = '4';

  /**
   * Visual appearance of the internal surface, matching `lt-surface`'s vocabulary.
   * @default 'filled'
   */
  @property({ reflect: true }) appearance: SurfaceAppearance = 'filled';

  /** Overridable UI text (the close button's accessible name), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<DialogLabels> = {};

  private get _labels(): DialogLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

  @query('dialog') private dialogElement?: HTMLDialogElement;
  private previouslyFocusedElement?: HTMLElement;
  private _scrollLocked = false;
  // `updated()` also runs after the very first render, where `changed.has('open')` is true even though nothing
  // was ever shown — `open` starts false, so the else branch ran, firing a spurious `close` and clobbering
  // `document.body.style.overflow` on page load (DLG-2). Same fix as lt-dropdown's `_skipNextOpenChange` (DDN-1)
  // and lt-snackbar's (SNK-1).
  private _skipNextOpenChange = true;

  /**
   * Opens the dialog.
   */
  public show() {
    this.open = true;
  }

  /**
   * Closes the dialog.
   */
  public hide() {
    this.open = false;
  }

  /**
   * Toggles the dialog open/closed state.
   */
  public toggle() {
    this.open = !this.open;
  }

  connectedCallback() {
    super.connectedCallback();
    // Markup never goes through the `title` accessor above — the attribute is just present on the node from
    // HTML parsing. `heading` wins if both are somehow given.
    if (this.hasAttribute('title')) {
      if (!this.heading) this.heading = this.getAttribute('title')!;
      this.removeAttribute('title');
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // A dialog removed from the DOM while still open (rather than closed first) must still release its lock —
    // otherwise the page is left permanently unscrollable (DLG-3's other half).
    if (this._scrollLocked) {
      unlockBodyScroll();
      this._scrollLocked = false;
    }
    this.restoreFocus();
  }

  updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('open')) {
      if (this._skipNextOpenChange) {
        this._skipNextOpenChange = false;
      } else if (this.open) {
        this.handleOpen();
      } else {
        this.handleClose();
      }
    }
  }

  private handleOpen() {
    // Store currently focused element to restore later. This is the shadow-rooted host itself when the opener
    // delegates focus (e.g. lt-button, BTN-4) — its own .focus() now correctly moves focus back into its shadow
    // root on restore, which is what fixed DLG-4 (no dialog-side change needed for that part).
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    if (!this._scrollLocked) {
      lockBodyScroll();
      this._scrollLocked = true;
    }

    // Guard against calling showModal() on an already-open dialog — throws InvalidStateError (confirmed in
    // Chromium/Firefox/WebKit, _agent-plans/component-audit-probes/native-dialog-spike.mjs). Shouldn't happen in
    // practice, since this only runs on a genuine false->true transition of `open`, but costs nothing to guard.
    if (this.dialogElement && !this.dialogElement.open) {
      this.dialogElement.showModal();
    }

    this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
  }

  private handleClose() {
    if (this._scrollLocked) {
      unlockBodyScroll();
      this._scrollLocked = false;
    }

    // The native element may already be closed here (this runs for both "we closed it" and "it closed itself,
    // e.g. via Escape" — see _handleNativeClose below), so guard against calling close() twice.
    if (this.dialogElement?.open) {
      this.dialogElement.close();
    }

    this.restoreFocus();

    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private restoreFocus() {
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = undefined;
    }
  }

  // Native <dialog> fires 'cancel' (cancelable) on Escape before it closes itself — preventDefault() here is
  // how close-on-escape="false" is implemented now, instead of an old keydown listener racing the platform's
  // own handling (confirmed working in the spike across all three engines).
  private _handleCancel = (e: Event) => {
    if (!this.closeOnEscape) {
      e.preventDefault();
    }
  };

  // The native element's own 'close' event fires whenever IT closes, for any reason — our own close() call
  // above, but also Escape (which closes it directly; nothing else tells us). Sync `open` back so the two never
  // drift apart. If we're the ones who just called close() (inside handleClose(), above), `open` is already
  // false and this is a no-op — Lit ignores a property set to its current value.
  private _handleNativeClose = () => {
    this.open = false;
  };

  // The clicked-outside-the-content area of a shown <dialog> resolves e.target to the <dialog> element itself
  // (::backdrop isn't a real node and can't be an event target) — clicking any actual descendant instead
  // targets that descendant, so this only ever fires for a genuine backdrop click (confirmed in the spike).
  private _handleDialogClick = (e: MouseEvent) => {
    if (this.closeOnBackdropClick && e.target === this.dialogElement) {
      this.hide();
    }
  };

  private handleCloseClick() {
    this.hide();
  }

  render() {
    return html`
      <dialog
        part="dialog"
        aria-labelledby="dialog-title"
        @cancel=${this._handleCancel}
        @close=${this._handleNativeClose}
        @click=${this._handleDialogClick}
      >
        <lt-surface elevation=${this.elevation} appearance=${this.appearance} part="surface">
          <div class="header" part="header">
            <div class="header-content">
              <slot name="header">
                ${this.heading
                  ? html`<lt-text variant="h4" as="h2" id="dialog-title" class="title">${this.heading}</lt-text>`
                  : ''}
              </slot>
            </div>
            ${!this.noCloseButton
              ? html`
                  <lt-icon-button
                    class="close-button"
                    part="close-button"
                    icon="xmark"
                    label=${this._labels.close}
                    size="sm"
                    @click=${this.handleCloseClick}
                  ></lt-icon-button>
                `
              : ''}
          </div>

          <div class="body" part="body">
            <slot></slot>
          </div>

          ${this.hasSlot('footer')
            ? html`
                <div class="footer" part="footer">
                  <slot name="footer"></slot>
                </div>
              `
            : ''}
        </lt-surface>
      </dialog>
    `;
  }

  private hasSlot(name: string): boolean {
    return !!this.querySelector(`[slot="${name}"]`);
  }
}
