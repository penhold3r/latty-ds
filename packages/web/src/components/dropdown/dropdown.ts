import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { dropdownStyles } from './dropdown.styles';
import type { DropdownPlacement } from './dropdown.types';
import { dispatch } from '../../utils';
import './dropdown-item';
import '../surface/surface';
import { PopupController } from '../shared/popup';

/**
 * A floating menu anchored to a trigger element.
 *
 * @element lt-dropdown
 * @slot trigger - The element that opens/closes the menu (e.g. lt-button)
 * @slot - Menu items (lt-dropdown-item elements)
 * @fires {CustomEvent} open - Fired when the menu opens
 * @fires {CustomEvent} close - Fired when the menu closes
 *
 * @cssprop [--lt-dropdown-menu-padding] - Overrides the menu surface's default vertical padding.
 * @cssprop [--lt-dropdown-max-height=min(24rem, 60vh)] - Tallest the menu grows before it scrolls.
 */
@customElement('lt-dropdown')
export class Dropdown extends ThemeableElement {
  static styles = dropdownStyles;

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ reflect: true }) placement: DropdownPlacement = 'bottom-start';

  private readonly _popup: PopupController = new PopupController(this, {
    panel: () => this.shadowRoot?.querySelector<HTMLElement>('lt-surface.menu') ?? null,
    reference: () => this._triggerEl() ?? this,
    floating: () => ({ placement: this.placement }),
    outsideEvent: 'click',
    outsideCapture: true,
    onOutside: () => this.hide()
  });

  // `updated()` also runs after the very first render, where `changed.has('open')` is true even though nothing
  // ever opened. Without this, mounting a closed dropdown fired `close` and moved focus to the trigger on page
  // load (verified: activeElement jumped to a native <button> trigger). Ships with lt-button's `delegatesFocus`
  // (BTN-4) — before that, the same first-update run was a no-op for an `lt-button` trigger anyway, since its
  // `.focus()` did nothing.
  private _skipNextOpenChange = true;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('select', this.hide);
    this.addEventListener('focusout', this._onFocusOut);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('select', this.hide);
    this.removeEventListener('focusout', this._onFocusOut);
    this._popup.destroy();
  }

  // The slotted trigger otherwise has no indication it opens a menu, or whether that menu is currently open.
  private _syncTriggerAria() {
    const trigger = this._triggerEl();
    if (!trigger) return;
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', this.open ? 'true' : 'false');
  }

  // Tab away from the trigger/menu (as opposed to Escape, or a click outside, which are already handled) left
  // the menu open — nothing closed it once focus moved on. relatedTarget is the element focus is moving *to*;
  // if that's still somewhere inside this dropdown (the trigger, or an item — both light DOM children of this
  // element), there's nothing to do.
  private _onFocusOut = (e: FocusEvent) => {
    if (!this.open) return;
    const next = e.relatedTarget as Node | null;
    if (next && this.contains(next)) return;
    this.hide();
  };

  updated(changed: Map<string, unknown>) {
    this._syncTriggerAria();
    if (!changed.has('open')) return;
    if (this._skipNextOpenChange) {
      this._skipNextOpenChange = false;
      return;
    }
    if (this.open) {
      void this._popup.open();
      requestAnimationFrame(() => this._items()[0]?.focus());
      dispatch(this, 'open');
    } else {
      this._popup.close();
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
        <slot name="trigger" @slotchange=${this._syncTriggerAria}></slot>
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
