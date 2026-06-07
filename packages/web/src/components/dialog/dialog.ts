import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, query } from 'lit/decorators.js';

import { dialogStyles } from './dialog.styles';
import { backdropFeatureStyles } from '../shared/backdrop.styles';
import { DialogSize } from './dialog.types';

import '../icon-button/icon-button';
import '../surface/surface';
import '../text/text';

/**
 * Dialog component (modal) with backdrop, animations, and accessibility features.
 *
 * @element lt-dialog
 *
 * Features:
 * - Multiple size options (sm, md, lg, xl, fullscreen)
 * - Backdrop overlay with configurable click-to-close
 * - Close on Escape key
 * - Header with optional title and close button
 * - Scrollable body content
 * - Optional footer for actions
 * - Focus trap and restoration
 * - Custom open/close events
 * - Accessible with aria-modal and role="dialog"
 *
 * @slot - Dialog body content
 * @slot header - Custom header content (overrides title prop)
 * @slot footer - Footer content (typically for action buttons)
 *
 * @fires open - Fired when dialog opens
 * @fires close - Fired when dialog closes
 * @fires dialog-open - Fired when dialog opens (deprecated, use `open`)
 * @fires dialog-close - Fired when dialog closes (deprecated, use `close`)
 *
 * @example
 * ```html
 * <lt-dialog open title="Confirm Action">
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
 * <lt-dialog size="lg" open title="Settings" no-close-button>
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
   * Dialog title displayed in the header.
   * @default ''
   */
  @property() title = '';

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
   * Renders the dialog title in small caps with wider letter spacing.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) uppercase = false;

  /**
   * Apply a frosted-glass blur effect to the backdrop.
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'backdrop-blur' }) backdropBlur = false;

  @query('lt-surface') private dialogElement?: HTMLElement;
  private previouslyFocusedElement?: HTMLElement;

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
    this.addEventListener('keydown', this.handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.handleKeydown);
    this.restoreFocus();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('open')) {
      if (this.open) {
        this.handleOpen();
      } else {
        this.handleClose();
      }
    }
  }

  private handleOpen() {
    // Store currently focused element to restore later
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Focus the dialog
    this.updateComplete.then(() => {
      this.dialogElement?.focus();
    });

    // Dispatch open events (dialog-open kept for backward compat)
    const openEvent = new CustomEvent('open', { bubbles: true, composed: true });
    this.dispatchEvent(openEvent);
    this.dispatchEvent(new CustomEvent('dialog-open', { bubbles: true, composed: true }));
  }

  private handleClose() {
    // Restore body scroll
    document.body.style.overflow = '';

    // Restore focus to previously focused element
    this.restoreFocus();

    // Dispatch close events (dialog-close kept for backward compat)
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('dialog-close', { bubbles: true, composed: true }));
  }

  private restoreFocus() {
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = undefined;
    }
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (this.open && this.closeOnEscape && event.key === 'Escape') {
      event.preventDefault();
      this.hide();
    }
  };

  private handleBackdropClick(event: MouseEvent) {
    if (this.closeOnBackdropClick && event.target === event.currentTarget) {
      this.hide();
    }
  }

  private handleCloseClick() {
    this.hide();
  }

  render() {
    return html`
      <div class="backdrop" ?inert=${!this.open} @click=${this.handleBackdropClick} part="backdrop">
        <lt-surface
          elevation="4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          tabindex="-1"
          part="dialog"
        >
          <div class="header" part="header">
            <div class="header-content">
              <slot name="header">
                ${this.title
                  ? html`<lt-text variant="h4" as="h2" id="dialog-title" class="title">${this.title}</lt-text>`
                  : ''}
              </slot>
            </div>
            ${!this.noCloseButton
              ? html`
                  <lt-icon-button
                    class="close-button"
                    part="close-button"
                    icon="xmark"
                    label="Close dialog"
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
      </div>
    `;
  }

  private hasSlot(name: string): boolean {
    return !!this.querySelector(`[slot="${name}"]`);
  }
}
