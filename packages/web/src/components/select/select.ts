import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { selectStyles } from './select.styles';
import { SelectOption, SelectSize, SelectVariant } from './select.types';
import '@latty/icons';
import '../surface/';

/**
 * A customizable select dropdown component with support for multiple variants and sizes.
 *
 * @element lt-select
 *
 * @fires {CustomEvent<{value: string}>} change - Dispatched when the selected value changes
 *
 * @example
 * ```html
 * <lt-select
 *   label="Country"
 *   placeholder="Select a country"
 *   .options=${[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' },
 *     { value: 'mx', label: 'Mexico' }
 *   ]}
 * ></lt-select>
 * ```
 *
 * @example
 * ```html
 * <lt-select
 *   variant="error"
 *   label="Language"
 *   helper-text="Please select a language"
 *   required
 *   .options=${languages}
 * ></lt-select>
 * ```
 */
@customElement('lt-select')
export class Select extends LitElement {
  static styles = selectStyles;

  /**
   * Visual variant that determines styling.
   * @default 'default'
   */
  @property({ reflect: true }) variant: SelectVariant = 'default';

  /**
   * Size of the select (affects height, font size, and padding).
   * @default 'md'
   */
  @property({ reflect: true }) size: SelectSize = 'md';

  /**
   * Current selected value.
   * @default ''
   */
  @property() value = '';

  /**
   * Placeholder text shown when no option is selected.
   * @default 'Select an option'
   */
  @property() placeholder = 'Select an option';

  /**
   * Label text displayed above the select.
   * @default ''
   */
  @property() label = '';

  /**
   * Helper text displayed below the select. Color changes based on variant.
   * @default ''
   */
  @property({ attribute: 'helper-text' }) helperText = '';

  /**
   * Whether the select is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Whether the select is required. Shows asterisk in label when true.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) required = false;

  /**
   * Array of options to display in the dropdown.
   * @default []
   */
  @property({ type: Array }) options: SelectOption[] = [];

  /**
   * Internal state tracking whether the dropdown is open.
   * @private
   */
  @state() private isOpen = false;

  /**
   * Toggles the dropdown open/closed state.
   * @private
   */
  private toggleDropdown() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  /**
   * Closes the dropdown.
   * @private
   */
  private closeDropdown() {
    this.isOpen = false;
  }

  /**
   * Handles option selection.
   * Updates the value, dispatches change event, and closes dropdown.
   *
   * @param option - The selected option
   * @private
   */
  private selectOption(option: SelectOption) {
    if (option.disabled) return;

    this.value = option.value;
    this.closeDropdown();

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }

  /**
   * Handles keyboard navigation in the dropdown.
   * Supports Arrow Up/Down for navigation, Enter/Space for selection, and Escape to close.
   *
   * @param e - The keyboard event
   * @private
   */
  private handleKeydown(e: KeyboardEvent) {
    if (this.disabled) return;

    const { key } = e;

    if (!this.isOpen && (key === 'Enter' || key === ' ' || key === 'ArrowDown' || key === 'ArrowUp')) {
      e.preventDefault();
      this.isOpen = true;
      return;
    }

    if (this.isOpen) {
      if (key === 'Escape') {
        e.preventDefault();
        this.closeDropdown();
        return;
      }

      if (key === 'ArrowDown' || key === 'ArrowUp') {
        e.preventDefault();
        const options = this.shadowRoot?.querySelectorAll('.option:not([disabled])') as NodeListOf<HTMLButtonElement>;
        if (!options || options.length === 0) return;

        const currentIndex = Array.from(options).findIndex((opt) => opt === this.shadowRoot?.activeElement);
        let nextIndex = currentIndex;

        if (key === 'ArrowDown') {
          nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        }

        options[nextIndex]?.focus();
      }
    }
  }

  /**
   * Handles clicks outside the component to close the dropdown.
   * @private
   */
  private handleDocumentClick = (e: Event) => {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.closeDropdown();
    }
  };

  /**
   * Lifecycle method - sets up document click listener.
   */
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleDocumentClick);
  }

  /**
   * Lifecycle method - removes document click listener.
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleDocumentClick);
  }

  /**
   * Gets the display label for the currently selected value.
   * @private
   */
  private getSelectedLabel(): string {
    const selected = this.options.find((opt) => opt.value === this.value);
    return selected ? selected.label : '';
  }

  /**
   * Reflects the open state as an attribute for CSS styling.
   */
  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('isOpen')) {
      if (this.isOpen) {
        this.setAttribute('open', '');
      } else {
        this.removeAttribute('open');
      }
    }
  }

  render() {
    const selectedLabel = this.getSelectedLabel();
    const hasValue = Boolean(this.value && selectedLabel);

    return html`
      <div class="wrapper">
        ${this.label
          ? html`
              <label>
                ${this.label}
                ${this.required ? html`<span class="required-indicator">*</span>` : ''}
              </label>
            `
          : ''}
        <div class="select-container">
          <div
            class="select-trigger"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded=${this.isOpen}
            aria-disabled=${this.disabled}
            aria-label=${this.label || this.placeholder}
            tabindex=${this.disabled ? '-1' : '0'}
            @click=${this.toggleDropdown}
            @keydown=${this.handleKeydown}
          >
            <span class="select-value ${hasValue ? '' : 'placeholder'}">
              ${hasValue ? selectedLabel : this.placeholder}
            </span>
            <lt-icon class="icon-end" name="caret-down"></lt-icon>
          </div>
          <lt-surface class="dropdown" elevation="2" role="listbox">
            <div class="options-container">
              ${this.options.map(
                (option) => html`
                  <button
                    class="option"
                    role="option"
                    aria-selected=${option.value === this.value}
                    ?disabled=${option.disabled}
                    @click=${() => this.selectOption(option)}
                    @keydown=${(e: KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.selectOption(option);
                      }
                    }}
                  >
                    ${option.label}
                  </button>
                `
              )}
            </div>
          </lt-surface>
        </div>
        ${this.helperText ? html`<div class="helper-text">${this.helperText}</div>` : ''}
      </div>
    `;
  }
}
