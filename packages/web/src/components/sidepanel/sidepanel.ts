import { LitElement, html, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { sidepanelStyles } from './sidepanel.styles';
import { backdropFeatureStyles } from '../shared/backdrop.styles';
import type { SidePanelAnchor } from './sidepanel.types';

import '@latty/icons';
import '../text/text';

/**
 * A slide-in panel anchored to any edge of the viewport, with a backdrop overlay.
 *
 * @element lt-sidepanel
 * @slot - Content rendered inside the panel body
 * @fires lt-close - Fired when the user requests close (backdrop click, Escape key, or close button)
 * @part overlay - The backdrop scrim behind the panel
 * @part panel - The sliding panel container
 * @part header - The header bar (contains label and close button)
 * @part close-button - The close button inside the header
 * @part body - The scrollable content area wrapping the default slot
 */
@customElement('lt-sidepanel')
export class SidePanel extends LitElement {
  static styles = [sidepanelStyles, backdropFeatureStyles];

  /** Whether the panel is visible. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Edge from which the panel slides in. */
  @property({ reflect: true }) anchor: SidePanelAnchor = 'left';

  /** Panel width (left/right anchors) or height (top/bottom anchors). */
  @property() size = '320px';

  /** Title shown in the panel header. When empty, the header is hidden. */
  @property() label = '';

  /** Suppress the built-in close button. */
  @property({ type: Boolean, attribute: 'no-close-button' }) noCloseButton = false;

  /** Apply a frosted-glass blur effect to the backdrop. */
  @property({ type: Boolean, reflect: true, attribute: 'backdrop-blur' }) backdropBlur = false;

  /** Backdrop darkness as an alpha value from 0 (transparent) to 1 (opaque). */
  @property({ type: Number, attribute: 'overlay-opacity' }) overlayOpacity = 0.45;

  /** Open the panel. */
  public show() {
    this.open = true;
  }

  /** Close the panel. */
  public hide() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('lt-close', { bubbles: true, composed: true }));
  }

  /** Toggle the panel open/closed. */
  public toggle() {
    if (this.open) this.hide();
    else this.show();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this._handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._handleKeyDown);
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.open) this.hide();
  };

  protected updated(changed: PropertyValues): void {
    if (!changed.has('anchor')) return;
    const panel = this.shadowRoot?.querySelector('[part="panel"]') as HTMLElement | null;
    if (!panel) return;

    // Disable transition and snap to the new anchor's off-screen start position.
    // Handles both anchor-only changes and anchor + open changing simultaneously.
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

  private get _offScreenTransform(): string {
    switch (this.anchor) {
      case 'right': return 'translateX(100%)';
      case 'top': return 'translateY(-100%)';
      case 'bottom': return 'translateY(100%)';
      default: return 'translateX(-100%)';
    }
  }

  private get _panelStyle(): string {
    return this.anchor === 'left' || this.anchor === 'right'
      ? `width: ${this.size}`
      : `height: ${this.size}`;
  }

  private _renderHeader() {
    const hasLabel = this.label.trim().length > 0;
    if (!hasLabel && this.noCloseButton) return '';
    return html`
      <div part="header" class="header">
        ${hasLabel ? html`<lt-text variant="h6" class="panel-label">${this.label}</lt-text>` : ''}
        ${!this.noCloseButton
          ? html`
              <button
                part="close-button"
                class="close-button"
                @click=${this.hide}
                aria-label="Close panel"
              >
                <lt-icon name="xmark"></lt-icon>
              </button>
            `
          : ''}
      </div>
    `;
  }

  render() {
    return html`
      <div part="overlay" style="--_overlay-opacity: ${this.overlayOpacity}" @click=${this.hide}></div>
      <div part="panel" style=${this._panelStyle} role="dialog" aria-modal="true">
        ${this._renderHeader()}
        <div part="body" class="body">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
