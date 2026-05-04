import { LitElement, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { navItemStyles } from './nav.styles';
import { NavOrientation } from './nav.types';

import '@latty/icons';

/**
 * A single navigation item. Can render as an anchor link or a collapsible group header
 * when children are slotted.
 *
 * When slotted inside `<lt-nav orientation="horizontal">`, top-level items lay out in a row
 * and nested children appear as a dropdown panel. In vertical mode, nested children
 * collapse/expand inline.
 *
 * @element lt-nav-item
 *
 * @fires {CustomEvent<{ href: string; label: string }>} lt-nav-item-click - Fired when the item
 *   is clicked (even when it has no href).
 * @fires {CustomEvent<{ open: boolean }>} lt-nav-collapse - Fired when a collapsible item
 *   is opened or closed.
 *
 * @slot - Nested `<lt-nav-item>` children (makes this item a collapsible group)
 *
 * @example
 * ```html
 * <!-- Simple link -->
 * <lt-nav-item href="/dashboard" label="Dashboard" icon="home"></lt-nav-item>
 * ```
 *
 * @example
 * ```html
 * <!-- Collapsible group -->
 * <lt-nav-item label="Settings" icon="settings">
 *   <lt-nav-item href="/settings/profile" label="Profile"></lt-nav-item>
 *   <lt-nav-item href="/settings/security" label="Security"></lt-nav-item>
 * </lt-nav-item>
 * ```
 */
@customElement('lt-nav-item')
export class NavItem extends LitElement {
  static styles = navItemStyles;

  /** Destination URL. If omitted, the item acts as a group header. */
  @property() href = '';

  /** Label text shown in the item. */
  @property() label = '';

  /**
   * Icon name (from the built-in Latty icon set) shown before the label.
   * @default ''
   */
  @property() icon = '';

  /**
   * Whether this item is currently the active/selected page.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) active = false;

  /**
   * Whether the item is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Whether nested children are expanded. Only relevant when children are slotted.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Set by the parent `<lt-nav>` — do not set manually. */
  @property({ reflect: true }) orientation: NavOrientation = 'vertical';

  @query('.children') private _childrenEl?: HTMLElement;
  @query('.children-inner') private _childrenInnerEl?: HTMLElement;

  private _hasChildren = false;

  private _onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedElements();
    this._hasChildren = nodes.length > 0;

    // Propagate orientation to child items
    nodes.forEach((el) => {
      if (el.tagName.toLowerCase() === 'lt-nav-item') {
        (el as HTMLElement).removeAttribute('orientation');
      }
    });

    this.requestUpdate();
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('open') && this._childrenEl && this._childrenInnerEl && this.orientation === 'vertical') {
      const inner = this._childrenInnerEl;
      const container = this._childrenEl;
      if (this.open) {
        container.style.height = `${inner.offsetHeight}px`;
      } else {
        container.style.height = `${inner.offsetHeight}px`;
        requestAnimationFrame(() => {
          container.style.height = '0px';
        });
      }
    }
  }

  private _handleTransitionEnd() {
    if (this.open && this._childrenEl) {
      this._childrenEl.style.height = 'auto';
    }
  }

  private _handleTriggerClick(e: MouseEvent) {
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent('lt-nav-item-click', {
        detail: { href: this.href, label: this.label },
        bubbles: true,
        composed: true
      })
    );

    if (this._hasChildren) {
      e.preventDefault();
      this.open = !this.open;
      this.dispatchEvent(
        new CustomEvent('lt-nav-collapse', {
          detail: { open: this.open },
          bubbles: true,
          composed: true
        })
      );
    }
  }

  private _renderTrigger() {
    const showChevron = this._hasChildren;

    const inner = html`
      ${this.icon ? html`<lt-icon class="icon-start" name=${this.icon} size="sm"></lt-icon>` : nothing}
      <span class="label">${this.label}</span>
      ${showChevron ? html`<lt-icon class="chevron" name="caret-down" size="sm"></lt-icon>` : nothing}
    `;

    if (this.href && !this._hasChildren) {
      return html`<a class="item-trigger" href=${this.href} @click=${this._handleTriggerClick}>${inner}</a>`;
    }

    return html`<button class="item-trigger" @click=${this._handleTriggerClick} ?disabled=${this.disabled}>${inner}</button>`;
  }

  render() {
    return html`
      <div class="item-root">
        ${this._renderTrigger()}
        ${this._hasChildren
          ? html`
              <div class="children" @transitionend=${this._handleTransitionEnd}>
                <div class="children-inner">
                  <slot @slotchange=${this._onSlotChange}></slot>
                </div>
              </div>
            `
          : html`<slot @slotchange=${this._onSlotChange} style="display:none"></slot>`}
      </div>
    `;
  }
}
