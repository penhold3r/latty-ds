import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, state } from 'lit/decorators.js';

import { selectStyles } from './select.styles';
import { SelectOption, SelectSize, SelectVariant } from './select.types';
import { dispatch, createClickOutsideHandler } from '../../utils';
import '@latty-ds/icons';
import '../surface/';
import '../text/text';
import { openFloating, closeFloating } from '../shared/floating';
import { FormDefaultController } from '../shared/form-default';
import { FormDisabledController } from '../shared/form-disabled';

let selectCount = 0;

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
  private _default = new FormDefaultController(this, () => this.value);
  private _fieldsetDisabled = new FormDisabledController(this);

  // Scopes generated option/listbox ids to this instance, so two selects on the same page don't collide.
  private readonly _uid = `lt-select-${selectCount++}`;

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
   * Current selected value. Not reflected as an attribute — read the property, or the `change` event's
   * `detail.value`, instead of `getAttribute('value')`/`[value]` (consistent with the rest of the form controls;
   * see `lt-textfield`'s equivalent doc comment for why).
   * @default ''
   */
  @property() value = '';

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

  /**
   * Index of the highlighted option, into `enabledOptions` below (not `options`) — the same list the render
   * and the keyboard handler both use, so they can never disagree about which option is highlighted (they used
   * to: the index came from the enabled-only list, but the previous focus-based highlight came from whichever
   * option actually held DOM focus, decided independently).
   * @private
   */
  @state() private activeIndex = -1;

  private _cleanupClickOutside: (() => void) | null = null;
  private _floatingCleanup: (() => void) | null = null;

  private get enabledOptions(): SelectOption[] {
    return this.options.filter((o) => !o.disabled);
  }

  // Ids are derived from position in the full option list (disabled options included), since that's what's
  // actually rendered.
  private _idFor(option: SelectOption): string {
    return `${this._uid}-option-${this.options.indexOf(option)}`;
  }

  // Clicking an option button would otherwise focus it first (the default mousedown action) — a button that
  // momentarily takes focus, then vanishes as the dropdown closes, drops focus to nothing sensible. Suppressing
  // just that default action leaves the click itself (and selectOption) untouched, and the trigger — which
  // never lost focus to begin with — stays the active element throughout.
  private _preventFocusSteal(e: MouseEvent) {
    e.preventDefault();
  }

  /**
   * Toggles the dropdown open/closed state.
   * @private
   */
  private toggleDropdown() {
    if (!this._isDisabled) {
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
    if (this._isDisabled) return;

    const { key } = e;

    if (!this.isOpen) {
      if (key === 'Enter' || key === ' ' || key === 'ArrowDown' || key === 'ArrowUp') {
        e.preventDefault();
        this.isOpen = true;
      }
      return;
    }

    const enabled = this.enabledOptions;
    switch (key) {
      case 'Escape':
        e.preventDefault();
        this.closeDropdown();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (enabled.length > 0) this.activeIndex = this.activeIndex < enabled.length - 1 ? this.activeIndex + 1 : 0;
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (enabled.length > 0) this.activeIndex = this.activeIndex > 0 ? this.activeIndex - 1 : enabled.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (enabled[this.activeIndex]) this.selectOption(enabled[this.activeIndex]);
        break;
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
      this.activeIndex = -1;
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
    this.value = this._default.value;
  }

  formDisabledCallback(disabled: boolean) {
    this._fieldsetDisabled.setFieldsetDisabled(disabled);
  }

  /** `this.disabled` combined with an ancestor `<fieldset>`'s own disabled state (see `FormDisabledController`). */
  private get _isDisabled(): boolean {
    return this.disabled || this._fieldsetDisabled.fieldsetDisabled;
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
    const activeOption = this.enabledOptions[this.activeIndex];
    const listboxId = `${this._uid}-listbox`;

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
            aria-disabled=${this._isDisabled}
            aria-label=${this.label || this.placeholder}
            aria-controls=${this.isOpen ? listboxId : nothing}
            aria-activedescendant=${this.isOpen && activeOption ? this._idFor(activeOption) : nothing}
            tabindex=${this._isDisabled ? '-1' : '0'}
            @click=${this.toggleDropdown}
            @keydown=${this.handleKeydown}
          >
            <span class="select-value ${hasValue ? '' : 'placeholder'}">
              ${hasValue ? selectedLabel : this.placeholder}
            </span>
            <lt-icon class="icon-end" name="caret-down"></lt-icon>
          </div>
          <lt-surface
            id=${listboxId}
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
                    id=${this._idFor(option)}
                    class="option"
                    role="option"
                    tabindex="-1"
                    aria-selected=${option.value === this.value}
                    ?disabled=${option.disabled}
                    data-active=${option === activeOption}
                    @mousedown=${this._preventFocusSteal}
                    @click=${() => this.selectOption(option)}
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
