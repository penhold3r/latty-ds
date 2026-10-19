import { createFieldIds } from '../shared/form-field';
import { html, nothing, type PropertyValues } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, state } from 'lit/decorators.js';

import { selectStyles } from './select.styles';
import { SelectOption, SelectSize, SelectVariant, type SelectLabels } from './select.types';
import { dispatch, createClickOutsideHandler } from '../../utils';
import '@latty-ds/icons';
import '../surface/';
import '../text/text';
import '../spinner/';
import { openFloating, closeFloating } from '../shared/floating';
import { FormDefaultController } from '../shared/form-default';
import { FormDisabledController } from '../shared/form-disabled';
import { groupConsecutive } from '../shared/option-groups';
import { nextListboxIndex, ListboxTypeahead } from '../shared/listbox-nav';

let selectCount = 0;

const DEFAULT_LABELS: SelectLabels = {
  validationMessage: 'Please select an option',
  clear: 'Clear',
  loading: 'Loading…'
};

/**
 * A customizable select dropdown component with support for multiple variants and sizes.
 *
 * @element lt-select
 *
 * @fires {CustomEvent<{value: string | string[]}>} change - Dispatched when the selected value changes. With `multiple`,
 *   `value` is the array of selected values.
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
   * Current selected value. A string for a single select; with `multiple`, an array of the selected values. Not
   * reflected as an attribute — read the property, or the `change` event's `detail.value`, instead of
   * `getAttribute('value')`/`[value]` (consistent with the rest of the form controls; see `lt-textfield`'s
   * equivalent doc comment for why).
   * @default ''
   */
  @property() value: string | string[] = '';

  /**
   * Allow more than one option to be selected. The option list stays open while picking, and `value` becomes an
   * array of the selected values.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) multiple = false;

  private get _selected(): string[] {
    if (Array.isArray(this.value)) return this.value;
    return this.value ? [this.value] : [];
  }

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

  /** Shows a clear button while a value is selected, resetting to no selection. */
  @property({ type: Boolean, reflect: true }) clearable = false;

  /** Shows a loading indicator in place of the option list — for options fetched asynchronously. Purely a
   * rendering concern: it doesn't touch `options` itself, so a consumer typically clears/leaves `options` empty
   * while a fetch is in flight and populates it once the loading indicator is no longer needed. */
  @property({ type: Boolean, reflect: true }) loading = false;

  /** Overridable UI text (the required-field validation message), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<SelectLabels> = {};

  private get _labels(): SelectLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

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
  private readonly _typeahead = new ListboxTypeahead();

  private readonly _fieldIds = createFieldIds();

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

  private get _showClear(): boolean {
    return this.clearable && this._selected.length > 0 && !this._isDisabled;
  }

  // Stops propagation so clicking clear doesn't also toggle the dropdown open — the trigger's own click handler
  // would otherwise fire right after this one, since the clear button lives inside it.
  private _clear(e: MouseEvent) {
    e.stopPropagation();
    this.value = this.multiple ? [] : '';
    dispatch(this, 'change', { value: this.value });
  }

  // SEL-4: the trigger is a <div role="combobox">, not a real labelable element (<input>/<button>/<select>/
  // <textarea>) — a native <label for="..."> only auto-forwards a click to one of those, so pointing `for` at
  // this div would silently do nothing. Forwarding the click by hand is the standard workaround for a custom
  // ARIA widget's own label.
  private _focusTrigger() {
    this.shadowRoot?.querySelector<HTMLElement>('.select-trigger')?.focus();
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

    if (this.multiple) {
      const current = this._selected;
      this.value = current.includes(option.value)
        ? current.filter((v) => v !== option.value)
        : [...current, option.value];
      dispatch(this, 'change', { value: this.value });
      return;
    }

    this.value = option.value;
    this.closeDropdown();

    dispatch(this, 'change', { value: this.value });
  }

  /**
   * Handles keyboard navigation in the dropdown.
   * Supports Arrow Up/Down/Home/End/Page Up/Page Down for navigation, typeahead, Enter/Space for selection,
   * and Escape to close.
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

    if (
      key === 'ArrowDown' ||
      key === 'ArrowUp' ||
      key === 'Home' ||
      key === 'End' ||
      key === 'PageDown' ||
      key === 'PageUp'
    ) {
      e.preventDefault();
      this.activeIndex = nextListboxIndex(key, this.activeIndex, enabled.length);
      return;
    }

    switch (key) {
      case 'Escape':
        e.preventDefault();
        this.closeDropdown();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (enabled[this.activeIndex]) this.selectOption(enabled[this.activeIndex]);
        break;
      default:
        // Typeahead: a single printable character (no modifier combo) jumps to the next option whose label
        // starts with what's been typed so far.
        if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const match = this._typeahead.match(
            key,
            enabled.map((o) => o.label),
            this.activeIndex
          );
          if (match !== null) {
            e.preventDefault();
            this.activeIndex = match;
          }
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
    this._typeahead.dispose();
  }

  /**
   * Gets the display label for the currently selected value.
   * @private
   */
  private getSelectedLabel(): string {
    if (this.multiple) {
      return this._selected
        .map((v) => this.options.find((opt) => opt.value === v)?.label)
        .filter((label): label is string => Boolean(label))
        .join(', ');
    }
    const selected = this.options.find((opt) => opt.value === this._selected[0]);
    return selected ? selected.label : '';
  }

  override willUpdate(changed: PropertyValues<this>) {
    super.willUpdate(changed);
    if (this.multiple && !Array.isArray(this.value)) this.value = this._selected;
    // Start the active option at whichever one is already selected (if any), not always the top — so Arrow
    // keys move relative to the real selection on reopen, matching a native <select> (SEL-5). Set here, not in
    // updated(), so it lands in the SAME render pass as `isOpen` flipping, rather than scheduling a second one.
    // `isOpen` is a private @state field — PropertyValues<this>.has() only accepts public property keys, same
    // cast table.ts's own willUpdate already uses for its own private state.
    const changedAny = changed as ReadonlyMap<PropertyKey, unknown>;
    if (changedAny.has('isOpen') && this.isOpen) {
      this.activeIndex = this.enabledOptions.findIndex((o) => this._selected.includes(o.value));
    }
  }

  updated(changedProperties: Map<string, unknown>) {
    if (this.multiple) {
      const formData = new FormData();
      if (this.name) for (const v of this._selected) formData.append(this.name, v);
      this._internals.setFormValue(formData);
    } else {
      this._internals.setFormValue(this._selected[0] || null);
    }
    const trigger = this.shadowRoot?.querySelector<HTMLElement>('.select-trigger');
    if (this.required && this._selected.length === 0 && trigger) {
      this._internals.setValidity({ valueMissing: true }, this._labels.validationMessage, trigger);
    } else {
      this._internals.setValidity({});
    }

    if (changedProperties.has('activeIndex') && this.isOpen) {
      this.shadowRoot?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
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

  private _renderOption(option: SelectOption, activeOption: SelectOption | undefined) {
    return html`
      <button
        id=${this._idFor(option)}
        class="option"
        role="option"
        tabindex="-1"
        aria-selected=${this._selected.includes(option.value)}
        ?disabled=${option.disabled}
        data-active=${option === activeOption}
        @mousedown=${this._preventFocusSteal}
        @click=${() => this.selectOption(option)}
      >
        ${option.icon ? html`<lt-icon class="option-icon" name=${option.icon} size="sm"></lt-icon>` : nothing}
        <span class="option-content">
          <span class="option-label">${option.label}</span>
          ${option.description ? html`<span class="option-description">${option.description}</span>` : nothing}
        </span>
      </button>
    `;
  }

  render() {
    const selectedLabel = this.getSelectedLabel();
    const hasValue = Boolean(this._selected.length && selectedLabel);
    const activeOption = this.enabledOptions[this.activeIndex];
    const listboxId = `${this._uid}-listbox`;
    const triggerId = `${this._uid}-trigger`;
    const showClear = this._showClear;

    return html`
      <div class="wrapper">
        ${this.label
          ? html`
              <label @click=${this._focusTrigger}>
                <lt-text variant="label" as="span">${this.label}</lt-text>
                ${this.required ? html`<span class="required-indicator">*</span>` : ''}
              </label>
            `
          : ''}
        <div class="select-container">
          <div
            id=${triggerId}
            class="select-trigger"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded=${this.isOpen}
            aria-disabled=${this._isDisabled}
            aria-required=${this.required}
            aria-invalid=${this.variant === 'error' ? 'true' : nothing}
            aria-label=${this.label || this.placeholder}
            aria-describedby=${this.helperText ? this._fieldIds.helper : nothing}
            aria-controls=${this.isOpen ? listboxId : nothing}
            aria-activedescendant=${this.isOpen && activeOption ? this._idFor(activeOption) : nothing}
            tabindex=${this._isDisabled ? '-1' : '0'}
            @click=${this.toggleDropdown}
            @keydown=${this.handleKeydown}
          >
            <span class="select-value ${hasValue ? '' : 'placeholder'}">
              ${hasValue ? selectedLabel : this.placeholder}
            </span>
            ${showClear
              ? html`<button
                  type="button"
                  class="clear-button"
                  aria-label=${this._labels.clear}
                  @mousedown=${this._preventFocusSteal}
                  @click=${this._clear}
                >
                  <lt-icon name="xmark" size="sm"></lt-icon>
                </button>`
              : ''}
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
            aria-multiselectable=${this.multiple ? 'true' : nothing}
            aria-busy=${this.loading ? 'true' : nothing}
            part="listbox"
          >
            <div class="options-container">
              ${this.loading
                ? html`<div class="loading-state">
                    <lt-spinner size="sm"></lt-spinner>
                    <lt-text variant="caption" as="span">${this._labels.loading}</lt-text>
                  </div>`
                : groupConsecutive(this.options).map((run) =>
                    run.group
                      ? html`<div class="option-group" role="group" aria-label=${run.group}>
                          <div class="option-group-label" aria-hidden="true">${run.group}</div>
                          ${run.items.map((option) => this._renderOption(option, activeOption))}
                        </div>`
                      : run.items.map((option) => this._renderOption(option, activeOption))
                  )}
            </div>
          </lt-surface>
        </div>
        ${this.helperText
          ? html`<lt-text id=${this._fieldIds.helper} variant="caption" as="span" class="helper-text"
              >${this.helperText}</lt-text
            >`
          : ''}
      </div>
    `;
  }
}
