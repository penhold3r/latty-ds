import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, state } from 'lit/decorators.js';

import { comboboxStyles } from './combobox.styles';
import type { ComboboxOption, ComboboxSize, ComboboxVariant } from './combobox.types';
import { dispatch, createClickOutsideHandler } from '../../utils';
import '@latty-ds/icons';
import '../text/text';
import { openFloating, closeFloating } from '../shared/floating';

/**
 * Searchable single-select combobox. The user types to filter options; selecting an option sets the value.
 *
 * @element lt-combobox
 *
 * @fires {CustomEvent<{value: string, label: string}>} change - Fired when the selected value changes.
 *
 * @example
 * ```html
 * <lt-combobox
 *   label="Country"
 *   placeholder="Search countries…"
 *   .options=${[{ value: 'us', label: 'United States' }, { value: 'ca', label: 'Canada' }]}
 * ></lt-combobox>
 * ```
 */
@customElement('lt-combobox')
export class Combobox extends ThemeableElement {
  static styles = comboboxStyles;

  /** Array of selectable options. Set as a JS property (`.options`). */
  @property({ type: Array }) options: ComboboxOption[] = [];

  /** Currently selected value. */
  @property() value = '';

  /** Field label displayed above the input. */
  @property() label = '';

  /** Placeholder text shown when nothing is typed. */
  @property() placeholder = 'Search…';

  /** Helper or error text displayed below the input. */
  @property({ attribute: 'helper-text' }) helperText = '';

  /** Visual state variant. */
  @property({ reflect: true }) variant: ComboboxVariant = 'default';

  /** Visual size. */
  @property({ reflect: true }) size: ComboboxSize = 'md';

  /** Whether the field is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Whether the field is required. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Name used in form submission. */
  @property() name = '';

  @state() private query = '';
  @state() private open = false;
  @state() private activeIndex = -1;

  private _cleanupClickOutside: (() => void) | null = null;
  private _floatingCleanup: (() => void) | null = null;

  private get selectedLabel(): string {
    return this.options.find((o) => o.value === this.value)?.label ?? '';
  }

  private get filtered(): ComboboxOption[] {
    const q = this.query.toLowerCase();
    return this.options.filter((o) => o.label.toLowerCase().includes(q));
  }

  private async openDropdown() {
    if (this.disabled) return;
    this.open = true;
    this.setAttribute('open', '');
    this.query = '';
    this.activeIndex = -1;
    await this.updateComplete;
    const inputWrap = this.shadowRoot!.querySelector<HTMLElement>('.input-wrap')!;
    const dropdown = this.shadowRoot!.querySelector<HTMLElement>('.dropdown')!;
    if (inputWrap && dropdown) {
      this._floatingCleanup = await openFloating(inputWrap, dropdown, { matchWidth: true });
    }
  }

  private closeDropdown() {
    const dropdown = this.shadowRoot?.querySelector<HTMLElement>('.dropdown');
    if (dropdown) closeFloating(dropdown, this._floatingCleanup);
    this._floatingCleanup = null;
    this.open = false;
    this.removeAttribute('open');
  }

  private selectOption(opt: ComboboxOption) {
    if (opt.disabled) return;
    this.value = opt.value;
    this.closeDropdown();
    dispatch(this, 'change', { value: opt.value, label: opt.label });
  }

  private handleInput(e: Event) {
    this.query = (e.target as HTMLInputElement).value;
    this.activeIndex = -1;
    if (!this.open) this.openDropdown();
  }

  private handleFocus() {
    this.openDropdown();
  }

  private handleKeydown(e: KeyboardEvent) {
    const opts = this.filtered.filter((o) => !o.disabled);
    if (e.key === 'Escape') {
      this.closeDropdown();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.activeIndex = Math.min(this.activeIndex + 1, opts.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.activeIndex = Math.max(this.activeIndex - 1, 0);
    } else if (e.key === 'Enter' && this.activeIndex >= 0) {
      e.preventDefault();
      this.selectOption(opts[this.activeIndex]);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._cleanupClickOutside = createClickOutsideHandler(this, () => this.closeDropdown(), { event: 'click' });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupClickOutside?.();
    this._cleanupClickOutside = null;
    this._floatingCleanup?.();
    this._floatingCleanup = null;
  }

  render() {
    const opts = this.filtered;
    const displayValue = this.open ? this.query : this.selectedLabel;

    const inputRow = html`
      <div class="input-wrap" @click=${this.openDropdown}>
        <input
          id="combobox-input"
          role="combobox"
          aria-expanded=${this.open}
          aria-autocomplete="list"
          aria-required=${this.required}
          autocomplete="off"
          name=${this.name || nothing}
          placeholder=${this.open ? this.placeholder : this.selectedLabel || this.placeholder}
          .value=${displayValue}
          ?disabled=${this.disabled}
          @focus=${this.handleFocus}
          @input=${this.handleInput}
          @keydown=${this.handleKeydown}
        />
        <lt-icon class="chevron" name="nav-arrow-down" size="sm"></lt-icon>
      </div>
    `;

    return html`
      <div class="wrapper">
        ${this.label
          ? html`<label for="combobox-input">
              <lt-text variant="label" as="span">${this.label}</lt-text>
              ${this.required ? html`<span class="required-indicator">*</span>` : nothing}
            </label>`
          : nothing}
        ${inputRow}
        ${this.open
          ? html`
              <div class="dropdown" popover="manual" role="listbox">
                ${opts.length > 0
                  ? opts.map(
                      (opt, i) => html`
                        <button
                          class="option"
                          role="option"
                          aria-selected=${opt.value === this.value}
                          ?disabled=${opt.disabled}
                          data-active=${i === this.activeIndex}
                          @click=${() => this.selectOption(opt)}
                        >
                          ${opt.label}
                        </button>
                      `
                    )
                  : html`<p class="no-results">No results</p>`}
              </div>
            `
          : nothing}
        ${this.helperText ? html`<span class="helper-text">${this.helperText}</span>` : nothing}
      </div>
    `;
  }
}
