import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, query, state } from 'lit/decorators.js';

import { navItemStyles } from './nav.styles';
import { NavOrientation } from './nav.types';
import { NativeAttrsController } from '../shared/native-attrs';

import '@latty-ds/icons';

/**
 * A single navigation item. Can render as an anchor link or a collapsible group header
 * when children are slotted.
 *
 * When slotted inside `<lt-nav orientation="horizontal">`, top-level items lay out in a row
 * and nested children appear as a dropdown panel. In vertical mode, nested children
 * collapse/expand inline.
 *
 * SPA router integration: items use the native `click` — listen for it on the `<lt-nav>` (or the item),
 * call `event.preventDefault()` to stop the anchor's native navigation, and read the item from
 * `event.target.closest('lt-nav-item')` (its `href` and `label`). Modifier keys (`event.metaKey`, …) come
 * through as on any link. Drive the highlighted item via the `active` property (which also sets
 * `aria-current="page"`).
 * @element lt-nav-item
 * @fires {CustomEvent<{ open: boolean }>} toggle - Fired when a collapsible item is opened or
 *   closed, like the native `toggle` of `<details>`.
 * @slot - Nested `<lt-nav-item>` children (makes this item a collapsible group)
 * @example
 * ```html
 * <!-- Simple link -->
 * <lt-nav-item href="/dashboard" label="Dashboard" icon-start="home"></lt-nav-item>
 * ```
 * @example
 * ```html
 * <!-- Collapsible group -->
 * <lt-nav-item label="Settings" icon-start="settings">
 *   <lt-nav-item href="/settings/profile" label="Profile"></lt-nav-item>
 *   <lt-nav-item href="/settings/security" label="Security"></lt-nav-item>
 * </lt-nav-item>
 * ```
 */
@customElement('lt-nav-item')
export class NavItem extends ThemeableElement {
  static styles = navItemStyles;

  private _nativeAttrs = new NativeAttrsController(this, () => this.shadowRoot?.querySelector('.item-trigger'), {
    exclude: ['aria-current', 'aria-disabled', 'aria-expanded', 'aria-controls', 'target', 'rel']
  });

  /** Destination URL. If omitted, the item acts as a group header. */
  @property() href = '';

  /** Label text shown in the item. */
  @property({ reflect: true }) label = '';

  /**
   * Icon name (from the built-in Latty icon set) shown before the label.
   * @default ''
   */
  @property({ attribute: 'icon-start' }) iconStart = '';

  /**
   * Whether this item is currently the active/selected page.
   * Sets `aria-current="page"` on the internal trigger.
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

  @state() private _hasChildren = false;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._onDocKeydown);
    document.addEventListener('click', this._onDocClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._onDocKeydown);
    document.removeEventListener('click', this._onDocClick);
  }

  private _onDocKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.open && this.orientation === 'horizontal') {
      this.open = false;
      this.dispatchEvent(new CustomEvent('toggle', { detail: { open: false }, bubbles: true, composed: true }));
      (this.shadowRoot?.querySelector('.item-trigger') as HTMLElement)?.focus();
    }
  };

  private _onDocClick = (e: MouseEvent) => {
    if (this.open && this.orientation === 'horizontal' && !this.contains(e.target as Node)) {
      this.open = false;
      this.dispatchEvent(new CustomEvent('toggle', { detail: { open: false }, bubbles: true, composed: true }));
    }
  };

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
    /*
     * A group that starts `open` renders its children container only now (after this first slotchange), so
     * `updated()` never got to size it for the `open` it was created with, and it stayed collapsed at height 0.
     */
    void this.updateComplete.then(() => this._syncInitialHeight());
  }

  private _syncInitialHeight() {
    if (this.open && this.orientation === 'vertical' && this._childrenEl) this._childrenEl.style.height = 'auto';
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
    // A disabled link must not navigate (an <a> has no native `disabled`), whether clicked or activated with Enter.
    if (this.disabled) {
      e.preventDefault();
      return;
    }

    if (this._hasChildren) {
      e.preventDefault();
      this.open = !this.open;
      this.dispatchEvent(
        new CustomEvent('toggle', {
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
      ${this.iconStart ? html`<lt-icon class="icon-start" name=${this.iconStart} size="sm"></lt-icon>` : nothing}
      <span class="label">${this.label}</span>
      ${showChevron ? html`<lt-icon class="chevron" name="caret-down" size="sm"></lt-icon>` : nothing}
    `;

    const ariaCurrent = this.active ? 'page' : nothing;

    if (this.href && !this._hasChildren) {
      const target = this.getAttribute('target') || '';
      const rel = this.getAttribute('rel') || (target === '_blank' ? 'noopener noreferrer' : '');
      return html`<a
        class="item-trigger"
        href=${this.href}
        target=${target || nothing}
        rel=${rel || nothing}
        aria-current=${ariaCurrent}
        aria-disabled=${this.disabled ? 'true' : nothing}
        tabindex=${this.disabled ? '-1' : nothing}
        @click=${this._handleTriggerClick}
        >${inner}</a
      >`;
    }

    return html`<button
      class="item-trigger"
      aria-current=${ariaCurrent}
      aria-expanded=${showChevron ? this.open : nothing}
      aria-controls=${showChevron ? 'children' : nothing}
      @click=${this._handleTriggerClick}
      ?disabled=${this.disabled}
    >
      ${inner}
    </button>`;
  }

  render() {
    return html`
      <div class="item-root">
        ${this._renderTrigger()}
        ${this._hasChildren
          ? html`
              <div id="children" class="children" @transitionend=${this._handleTransitionEnd}>
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
