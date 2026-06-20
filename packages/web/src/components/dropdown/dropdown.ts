import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { dropdownStyles } from './dropdown.styles';
import type { DropdownPlacement } from './dropdown.types';
import { dispatch, createClickOutsideHandler } from '../../utils';
import './dropdown-item';
import '../surface/surface';
import { openFloating, closeFloating } from '../shared/floating';

/**
 * A floating menu anchored to a trigger element.
 *
 * @element lt-dropdown
 * @slot trigger - The element that opens/closes the menu (e.g. lt-button)
 * @slot - Menu items (lt-dropdown-item elements)
 * @fires {CustomEvent} open - Fired when the menu opens
 * @fires {CustomEvent} close - Fired when the menu closes
 */
@customElement('lt-dropdown')
export class Dropdown extends ThemeableElement {
  static styles = dropdownStyles;

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ reflect: true }) placement: DropdownPlacement = 'bottom-start';

  private _cleanupClickOutside: (() => void) | null = null;
  private _floatingCleanup: (() => void) | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('select', this.hide);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('select', this.hide);
    this._cleanupClickOutside?.();
    this._cleanupClickOutside = null;
    this._floatingCleanup?.();
    this._floatingCleanup = null;
  }

  updated(changed: Map<string, unknown>) {
    if (!changed.has('open')) return;
    if (this.open) {
      this._cleanupClickOutside = createClickOutsideHandler(this, () => this.hide(), { event: 'click', capture: true });
      const triggerEl = this._triggerEl() ?? this;
      const menu = this.shadowRoot!.querySelector<HTMLElement>('lt-surface.menu')!;
      if (menu) {
        openFloating(triggerEl, menu, { placement: this.placement }).then((cleanup) => {
          // Guard against a close that happened while openFloating was resolving —
          // otherwise the autoUpdate cleanup is orphaned and runs forever on a hidden menu.
          if (this.open) this._floatingCleanup = cleanup;
          else cleanup();
        });
      }
      requestAnimationFrame(() => this._items()[0]?.focus());
      dispatch(this, 'open');
    } else {
      this._cleanupClickOutside?.();
      this._cleanupClickOutside = null;
      const menu = this.shadowRoot?.querySelector<HTMLElement>('lt-surface.menu');
      if (menu) closeFloating(menu, this._floatingCleanup);
      this._floatingCleanup = null;
      this._triggerEl()?.focus();
      dispatch(this, 'close');
    }
  }

  show() {
    this.open = true;
  }

  hide() {
    this.open = false;
  }

  toggle() {
    this.open = !this.open;
  }

  private _triggerEl(): HTMLElement | null {
    const slot = this.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="trigger"]');
    return (slot?.assignedElements()[0] as HTMLElement) ?? null;
  }

  private _items(): HTMLElement[] {
    return Array.from(this.querySelectorAll('lt-dropdown-item')).filter(
      (el) => !(el as HTMLElement & { disabled: boolean }).disabled
    ) as HTMLElement[];
  }

  private _onKeydown = (e: KeyboardEvent) => {
    if (!this.open) return;

    const items = this._items();
    const focused = items.indexOf(document.activeElement as HTMLElement);

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.hide();
        break;
      case 'ArrowDown':
        e.preventDefault();
        items[Math.min(focused + 1, items.length - 1)]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        items[Math.max(focused - 1, 0)]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        items[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        items[items.length - 1]?.focus();
        break;
    }
  };

  render() {
    return html`
      <div class="trigger-wrap" @click=${this.toggle}>
        <slot name="trigger"></slot>
      </div>
      <lt-surface
        class="menu"
        popover="manual"
        appearance="outlined"
        elevation="2"
        background="--lt-bg-default"
        role="menu"
        aria-hidden=${this.open ? 'false' : 'true'}
      >
        <slot></slot>
      </lt-surface>
    `;
  }
}
