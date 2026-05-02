import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { dropdownStyles } from './dropdown.styles';
import type { DropdownPlacement } from './dropdown.types';
import './dropdown-item';
import '../surface/surface';

/**
 * A floating menu anchored to a trigger element.
 *
 * @element lt-dropdown
 * @slot trigger - The element that opens/closes the menu (e.g. lt-button)
 * @slot - Menu items (lt-dropdown-item elements)
 * @fires {CustomEvent} lt-open - Fired when the menu opens
 * @fires {CustomEvent} lt-close - Fired when the menu closes
 */
@customElement('lt-dropdown')
export class Dropdown extends LitElement {
  static styles = dropdownStyles;

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ reflect: true }) placement: DropdownPlacement = 'bottom-start';

  private _boundDocClick = (e: MouseEvent) => {
    if (!e.composedPath().includes(this)) {
      this.hide();
    }
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('lt-select', this.hide);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('lt-select', this.hide);
    document.removeEventListener('click', this._boundDocClick, { capture: true });
  }

  updated(changed: Map<string, unknown>) {
    if (!changed.has('open')) return;
    if (this.open) {
      document.addEventListener('click', this._boundDocClick, { capture: true });
      requestAnimationFrame(() => this._items()[0]?.focus());
      this.dispatchEvent(new CustomEvent('lt-open', { bubbles: true, composed: true }));
    } else {
      document.removeEventListener('click', this._boundDocClick, { capture: true });
      this._triggerEl()?.focus();
      this.dispatchEvent(new CustomEvent('lt-close', { bubbles: true, composed: true }));
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
      <lt-surface class="menu" variant="outlined" elevation="2" background-color="--lt-bg-default" role="menu" aria-hidden=${this.open ? 'false' : 'true'}>
        <slot></slot>
      </lt-surface>
    `;
  }
}
