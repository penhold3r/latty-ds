import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, state } from 'lit/decorators.js';

import { selectStyles } from './select.styles';
import { SelectOption, SelectSize, SelectVariant } from './select.types';
import { dispatch, createClickOutsideHandler } from '../../utils';
import '@latty-ds/icons';
import '../surface/';
import '../text/text';
import { openFloating, closeFloating } from '../shared/floating';

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
export class Select extends ThemeableElement {
  static styles = selectStyles;
  static formAssociated = true;

  private _internals!: ElementInternals;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

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
  @property({ reflect: true }) value = '';

  /**
   * Placeholder text shown when no option is selected.
   * @default 'Select an option'
   */
  @property({ reflect: true }) placeholder = 'Select an option';

  /**
   * Label text displayed above the select.
   * @default ''
   */
  @property({ reflect: true }) label = '';

  /**
   * Name used when submitting a form.
   * @default ''
   */
  @property({ reflect: true }) name = '';

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

  private _cleanupClickOutside: (() => void) | null = null;
  private _floatingCleanup: (() => void) | null = null;

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

    dispatch(this, 'change', { value: this.value });
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

  /**
   * Gets the display label for the currently selected value.
   * @private
   */
  private getSelectedLabel(): string {
    const selected = this.options.find((opt) => opt.value === this.value);
    return selected ? selected.label : '';
  }

  updated(changedProperties: Map<string, unknown>) {
    this._internals.setFormValue(this.value || null);
    const trigger = this.shadowRoot?.querySelector<HTMLElement>('.select-trigger');
    if (this.required && !this.value && trigger) {
      this._internals.setValidity({ valueMissing: true }, 'Please select an option', trigger);
    } else {
      this._internals.setValidity({});
    }

    if (!changedProperties.has('isOpen')) return;
    if (this.isOpen) {
      this.setAttribute('open', '');
      const selectTrigger = this.shadowRoot!.querySelector<HTMLElement>('.select-trigger')!;
      const listbox = this.shadowRoot!.querySelector<HTMLElement>('lt-surface.dropdown')!;
      openFloating(selectTrigger, listbox, { matchWidth: true }).then((cleanup) => {
        // Guard against a close that happened while openFloating was resolving —
        // otherwise the autoUpdate cleanup is orphaned and runs forever on a hidden listbox.
        if (this.isOpen) this._floatingCleanup = cleanup;
        else cleanup();
      });
    } else {
      this.removeAttribute('open');
      const listbox = this.shadowRoot?.querySelector<HTMLElement>('lt-surface.dropdown');
      if (listbox) closeFloating(listbox, this._floatingCleanup);
      this._floatingCleanup = null;
    }
  }

  formResetCallback() {
    this.value = '';
  }

  checkValidity() {
    return this._internals.checkValidity();
  }

  reportValidity() {
    return this._internals.reportValidity();
  }

  render() {
    const selectedLabel = this.getSelectedLabel();
    const hasValue = Boolean(this.value && selectedLabel);

    return html`
      <div class="wrapper">
        ${this.label
          ? html`
              <label>
                <lt-text variant="label" as="span">${this.label}</lt-text>
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
          <lt-surface
            class="dropdown"
            popover="manual"
            elevation="2"
            appearance="outlined"
            background="--lt-bg-default"
            role="listbox"
            part="listbox"
          >
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
        ${this.helperText
          ? html`<lt-text variant="caption" as="span" class="helper-text">${this.helperText}</lt-text>`
          : ''}
      </div>
    `;
  }
}
