import { createFieldIds, renderFieldLabel, renderHelperText } from '../shared/form-field';
import { html, nothing, type PropertyValues } from 'lit';
import { FormControlElement } from '../../base';
import { customElement, property, state } from 'lit/decorators.js';

import { selectStyles } from './select.styles';
import { SelectOption, SelectSize, SelectVariant, type SelectLabels } from './select.types';
import { dispatch } from '../../utils';
import '@latty-ds/icons';
import '../surface/';
import '../text/text';
import '../spinner/';
import { PopupController } from '../shared/popup';
import { NativeAttrsController } from '../shared/native-attrs';
import { nextListboxIndex, ListboxTypeahead } from '../shared/listbox-nav';
import { preventFocusSteal } from '../shared/focus';
import { renderListboxGroups, renderListboxLoading, renderListboxOption } from '../shared/listbox-option';
import {
  clearValue,
  coerceListboxValue,
  normalizeSelection,
  selectionFormData,
  shouldShowClear,
  toggleSelected
} from '../shared/listbox-selection';

let selectCount = 0;

const DEFAULT_LABELS: SelectLabels = {
  validationMessage: 'Please select an option',
  clear: 'Clear',
  loading: 'Loading…'
};

/**
 * A customizable select dropdown component with support for multiple variants and sizes.
 * @element lt-select
 * @fires {CustomEvent<{value: string | string[]}>} change - Dispatched when the selected value changes. With `multiple`,
 *   `value` is the array of selected values.
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
export class Select extends FormControlElement {
  static styles = selectStyles;

  private _nativeAttrs = new NativeAttrsController(this, () => this.shadowRoot?.querySelector('.select-trigger'), {
    exclude: [
      'aria-haspopup',
      'aria-expanded',
      'aria-disabled',
      'aria-required',
      'aria-invalid',
      'aria-label',
      'aria-describedby',
      'aria-controls',
      'aria-activedescendant',
      'open'
    ]
  });

  private readonly _uid = `lt-select-${selectCount++}`;

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
    return normalizeSelection(this.value);
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

  private readonly _popup: PopupController = new PopupController(this, {
    panel: () => this.shadowRoot?.querySelector<HTMLElement>('lt-surface.dropdown') ?? null,
    reference: () => this.shadowRoot?.querySelector<HTMLElement>('.select-trigger') ?? null,
    floating: () => ({ matchWidth: true }),
    outsideEvent: 'click',
    onOutside: () => this.closeDropdown()
  });

  private readonly _typeahead = new ListboxTypeahead();

  private readonly _fieldIds = createFieldIds();

  private get enabledOptions(): SelectOption[] {
    return this.options.filter((o) => !o.disabled);
  }

  private _idFor(option: SelectOption): string {
    return `${this._uid}-option-${this.options.indexOf(option)}`;
  }

  private get _showClear(): boolean {
    return shouldShowClear(this.clearable, this._selected, this._isDisabled);
  }

  private _clear(e: MouseEvent) {
    e.stopPropagation();
    this.value = clearValue(this.multiple);
    dispatch(this, 'change', { value: this.value });
  }

  /*
   * SEL-4: the trigger is a <div role="combobox">, not a real labelable element (<input>/<button>/<select>/
   * <textarea>) — a native <label for="..."> only auto-forwards a click to one of those, so pointing `for` at
   * this div would silently do nothing. Forwarding the click by hand is the standard workaround for a custom
   * ARIA widget's own label.
   */
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
   * @param option - The selected option.
   * @private
   */
  private selectOption(option: SelectOption) {
    if (option.disabled) return;

    if (this.multiple) {
      this.value = toggleSelected(this._selected, option.value);
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
   * @param e - The keyboard event.
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

  disconnectedCallback() {
    super.disconnectedCallback();
    this._popup.destroy();
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
    if (this.multiple && !Array.isArray(this.value)) this.value = normalizeSelection(this.value);
    const changedAny = changed as ReadonlyMap<PropertyKey, unknown>;
    if (changedAny.has('isOpen') && this.isOpen) {
      this.activeIndex = this.enabledOptions.findIndex((o) => this._selected.includes(o.value));
    }
  }

  updated(changedProperties: Map<string, unknown>) {
    if (this.multiple) {
      this._internals.setFormValue(selectionFormData(this.getAttribute('name'), this._selected));
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
      void this._popup.open();
    } else {
      this.removeAttribute('open');
      this._popup.close();
    }
  }

  /**
   * A select's value is its `value` — a string for a single select, an array of the selected values for
   * a `multiple` one. It's what a form reset restores and what a browser state-restore repopulates.
   */
  protected override get _formValue(): string | string[] {
    return this.value;
  }

  protected override set _formValue(value: unknown) {
    this.value = coerceListboxValue(value);
  }

  private _renderOption(option: SelectOption, activeOption: SelectOption | undefined) {
    return renderListboxOption({
      id: this._idFor(option),
      label: option.label,
      description: option.description,
      icon: option.icon,
      selected: this._selected.includes(option.value),
      disabled: option.disabled,
      active: option === activeOption,
      onSelect: () => this.selectOption(option)
    });
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
          ? html` <label @click=${this._focusTrigger}> ${renderFieldLabel(this.label, this.required)} </label> `
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
            aria-label=${this.label || this.getAttribute('aria-label') || this.placeholder}
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
                  @mousedown=${preventFocusSteal}
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
                ? renderListboxLoading(this._labels.loading)
                : renderListboxGroups(this.options, (option) => this._renderOption(option, activeOption))}
            </div>
          </lt-surface>
        </div>
        ${renderHelperText(this._fieldIds.helper, this.helperText)}
      </div>
    `;
  }
}
