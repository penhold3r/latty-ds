import { createFieldIds, renderFieldLabel, renderHelperText } from '../shared/form-field';
import { html, nothing, type PropertyValues } from 'lit';
import { FormControlElement } from '../../base';
import { customElement, property, state } from 'lit/decorators.js';

import { comboboxStyles } from './combobox.styles';
import type { ComboboxOption, ComboboxSize, ComboboxVariant, ComboboxLabels } from './combobox.types';
import { dispatch } from '../../utils';
import '@latty-ds/icons/caret-down';
import '@latty-ds/icons/xmark';
import '../text/text';
import '../chip/';
import '../spinner/';
import { PopupController } from '../shared/popup';
import { NativeAttrsController } from '../shared/native-attrs';
import { nextListboxIndex, normalizeSearchText } from '../shared/listbox-nav';
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

let comboboxCount = 0;

const DEFAULT_LABELS: ComboboxLabels = {
  validationMessage: 'Please select an option',
  noResults: 'No results',
  clear: 'Clear',
  loading: 'Loading…',
  create: (query) => `Create "${query}"`
};

/**
 * Searchable single-select combobox. The user types to filter options; selecting an option sets the value.
 * @element lt-combobox
 * @fires {CustomEvent<{value: string | string[]}>} change - Fired when the selected value changes. With
 *   `multiple`, `value` is the array of selected values.
 * @fires {CustomEvent<{value: string}>} create - Fired when `creatable` is set and the user selects the
 *   "create new" row for free-text that matches no existing option. Does not modify `options` itself — the
 *   consumer decides whether/how to persist the new option.
 * @example
 * ```html
 * <lt-combobox
 *   label="Country"
 *   placeholder="Search countries…"
 *   .options=${[{ value: 'us', label: 'United States' }, { value: 'ca', label: 'Canada' }]}
 * ></lt-combobox>
 * ```
 * @example
 * ```html
 * <lt-combobox
 *   multiple
 *   label="Skills"
 *   placeholder="Search skills…"
 *   .options=${skills}
 * ></lt-combobox>
 * ```
 */
@customElement('lt-combobox')
export class Combobox extends FormControlElement {
  static styles = comboboxStyles;

  private _nativeAttrs = new NativeAttrsController(this, () => this.shadowRoot?.querySelector('#combobox-input'), {
    exclude: [
      'aria-expanded',
      'aria-autocomplete',
      'aria-describedby',
      'aria-required',
      'aria-invalid',
      'aria-controls',
      'aria-activedescendant',
      'autocomplete',
      'open'
    ]
  });

  private readonly _uid = `lt-combobox-${comboboxCount++}`;

  /** Array of selectable options. Set as a JS property (`.options`). */
  @property({ type: Array }) options: ComboboxOption[] = [];

  /** Shows a clear-all button while a value is selected, resetting to no selection (all tags, in `multiple`
   * mode). */
  @property({ type: Boolean, reflect: true }) clearable = false;

  /** Shows a loading indicator in place of the option list — for options fetched asynchronously as the user
   * types. Purely a rendering concern: it doesn't touch `options` or the search `query` itself, so a consumer
   * typically clears/leaves `options` empty while a fetch for the current query is in flight. */
  @property({ type: Boolean, reflect: true }) loading = false;

  /** Allows creating a new option from free text when nothing in `options` matches the typed text (case- and
   * diacritic-insensitively) — shows an extra "create" row at the end of the dropdown. Selecting it fires a
   * `create` event with the typed text and sets `value` to it, but does not modify `options` itself: the
   * selected/tag display falls back to the raw value when it isn't found in `options`, so persisting the new
   * option (or not) is entirely up to the consumer. */
  @property({ type: Boolean, reflect: true }) creatable = false;

  /** Currently selected value. A string for a single combobox; with `multiple`, an array of the selected values.
   * Not reflected as an attribute — read the property, or the `change` event's `detail.value`, instead of
   * `getAttribute('value')`/`[value]` (consistent with the rest of the form controls; see `lt-textfield`'s
   * equivalent doc comment for why). */
  @property() value: string | string[] = '';

  /**
   * Allow more than one option to be selected. The dropdown stays open while picking, selections render as
   * removable tags in the field, and `value` becomes an array of the selected values.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) multiple = false;

  private get _selected(): string[] {
    return normalizeSelection(this.value);
  }

  private _labelFor(value: string): string {
    return this.options.find((o) => o.value === value)?.label ?? value;
  }

  /** Field label displayed above the input. */
  @property({ reflect: true }) label = '';

  /** Placeholder text shown when nothing is typed. */
  @property({ reflect: true }) placeholder = 'Search…';

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

  /** Overridable UI text (validation message, "no results" text), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<ComboboxLabels> = {};

  private get _labels(): ComboboxLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

  @state() private query = '';
  @state() private open = false;
  @state() private activeIndex = -1;

  private readonly _popup: PopupController = new PopupController(this, {
    panel: () => this.shadowRoot?.querySelector<HTMLElement>('.dropdown') ?? null,
    reference: () => this.shadowRoot?.querySelector<HTMLElement>('.input-wrap') ?? null,
    floating: () => ({ matchWidth: true }),
    outsideEvent: 'click',
    onOutside: () => this.closeDropdown()
  });

  private readonly _fieldIds = createFieldIds();

  private get selectedLabel(): string {
    if (Array.isArray(this.value) || !this.value) return '';
    return this.options.find((o) => o.value === this.value)?.label ?? this.value;
  }

  private get filtered(): ComboboxOption[] {
    const q = normalizeSearchText(this.query);
    return this.options.filter((o) => normalizeSearchText(o.label).includes(q));
  }

  private get enabledOpts(): ComboboxOption[] {
    return this.filtered.filter((o) => !o.disabled);
  }

  private _idFor(opt: ComboboxOption): string {
    return `${this._uid}-option-${this.filtered.indexOf(opt)}`;
  }

  private get _showCreate(): boolean {
    if (!this.creatable || this._isDisabled) return false;
    const q = this.query.trim();
    if (!q) return false;
    const qn = normalizeSearchText(q);
    if (this.options.some((o) => normalizeSearchText(o.label) === qn)) return false;
    if (this.multiple && this._selected.some((v) => normalizeSearchText(v) === qn)) return false;
    return true;
  }

  private _createOption() {
    const value = this.query.trim();
    if (!value) return;
    dispatch(this, 'create', { value });
    if (this.multiple) {
      this.value = [...this._selected, value];
      this.query = '';
      this.activeIndex = -1;
      dispatch(this, 'change', { value: this.value });
      return;
    }
    this.value = value;
    this.closeDropdown();
    dispatch(this, 'change', { value });
  }

  private get _showClear(): boolean {
    return shouldShowClear(this.clearable, this._selected, this._isDisabled);
  }

  private _clear(e: MouseEvent) {
    e.stopPropagation();
    this.value = clearValue(this.multiple);
    this.query = '';
    dispatch(this, 'change', { value: this.value });
  }

  private async openDropdown() {
    if (this._isDisabled || this.open) return;
    this.open = true;
    this.setAttribute('open', '');
    this.query = '';
    this.activeIndex = -1;
    await this.updateComplete;
    if (!this.open) return;
    await this._popup.open();
  }

  private closeDropdown() {
    this._popup.close();
    this.open = false;
    this.removeAttribute('open');
  }

  private selectOption(opt: ComboboxOption) {
    if (opt.disabled) return;
    if (this.multiple) {
      this.value = toggleSelected(this._selected, opt.value);
      this.query = '';
      this.activeIndex = -1;
      dispatch(this, 'change', { value: this.value });
      return;
    }
    this.value = opt.value;
    this.closeDropdown();
    dispatch(this, 'change', { value: opt.value });
  }

  private _removeTag(value: string) {
    this.value = toggleSelected(this._selected, value);
    dispatch(this, 'change', { value: this.value });
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
    if (this.multiple && e.key === 'Backspace' && this.query === '' && this._selected.length > 0) {
      e.preventDefault();
      this._removeTag(this._selected[this._selected.length - 1]);
      return;
    }
    if (e.key === 'Escape') {
      if (this.open) {
        e.preventDefault();
        this.closeDropdown();
      }
      return;
    }
    if (!this.open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.openDropdown();
      }
      return;
    }

    const opts = this.enabledOpts;
    const showCreate = this._showCreate;
    const maxIndex = showCreate ? opts.length : opts.length - 1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.activeIndex = Math.min(this.activeIndex + 1, maxIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.activeIndex = Math.max(this.activeIndex - 1, 0);
    } else if (e.key === 'Home' || e.key === 'End' || e.key === 'PageDown' || e.key === 'PageUp') {
      if (maxIndex >= 0) {
        e.preventDefault();
        this.activeIndex = nextListboxIndex(e.key, this.activeIndex, maxIndex + 1);
      }
    } else if (e.key === 'Enter' && this.activeIndex >= 0) {
      e.preventDefault();
      if (showCreate && this.activeIndex === opts.length) {
        this._createOption();
      } else if (opts[this.activeIndex]) {
        this.selectOption(opts[this.activeIndex]);
      }
    }
  }

  private _isWithin(node: Node): boolean {
    let current: Node | null = node;
    while (current) {
      if (current === this) return true;
      current = current instanceof ShadowRoot ? current.host : current.parentNode;
    }
    return false;
  }

  private _onFocusOut = (e: FocusEvent) => {
    if (!this.open) return;
    const next = e.relatedTarget as Node | null;
    if (next && this._isWithin(next)) return;
    this.closeDropdown();
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('focusout', this._onFocusOut);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('focusout', this._onFocusOut);
    this._popup.destroy();
  }

  override willUpdate(changed: PropertyValues<this>) {
    super.willUpdate(changed);
    if (this.multiple && !Array.isArray(this.value)) this.value = normalizeSelection(this.value);
  }

  updated(changedProperties: Map<string, unknown>) {
    if (this.multiple) {
      this._internals.setFormValue(selectionFormData(this.getAttribute('name'), this._selected));
    } else {
      this._internals.setFormValue(this.value as string);
    }
    const input = this.shadowRoot?.querySelector<HTMLElement>('input');
    if (this.required && this._selected.length === 0 && input) {
      this._internals.setValidity({ valueMissing: true }, this._labels.validationMessage, input);
    } else {
      this._internals.setValidity({});
    }

    if (changedProperties.has('activeIndex') && this.open) {
      this.shadowRoot?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
    }
  }

  /**
   * A select's value is its `value` — a string for a single select, an array of the selected values for
   * a `multiple` one. It's what a form reset restores and what a browser state-restore repopulates.
   * @returns {string | string[]} The form value.
   */
  protected override get _formValue(): string | string[] {
    return this.value;
  }

  protected override set _formValue(value: unknown) {
    this.value = coerceListboxValue(value);
  }

  private _renderOption(opt: ComboboxOption, activeOption: ComboboxOption | undefined) {
    return renderListboxOption({
      id: this._idFor(opt),
      label: opt.label,
      description: opt.description,
      icon: opt.icon,
      selected: this._selected.includes(opt.value),
      disabled: opt.disabled,
      active: opt === activeOption,
      onSelect: () => this.selectOption(opt)
    });
  }

  private _renderCreateRow() {
    const onCreateRow = this.activeIndex === this.enabledOpts.length;
    return renderListboxOption({
      id: `${this._uid}-create`,
      label: this._labels.create(this.query.trim()),
      icon: 'plus',
      selected: false,
      disabled: false,
      active: onCreateRow,
      create: true,
      onSelect: () => this._createOption()
    });
  }

  render() {
    const opts = this.filtered;
    const activeOption = this.enabledOpts[this.activeIndex];
    const showClear = this._showClear;
    const showCreate = this._showCreate;
    const onCreateRow = showCreate && this.activeIndex === this.enabledOpts.length;
    const displayValue = this.open ? this.query : this.multiple ? '' : this.selectedLabel;
    const placeholderText = this.multiple
      ? this.placeholder
      : this.open
        ? this.placeholder
        : this.selectedLabel || this.placeholder;

    const tags = this.multiple
      ? this._selected.map(
          (v) => html`
            <lt-chip
              size="sm"
              variant="neutral"
              deletable
              ?disabled=${this._isDisabled}
              @delete=${() => this._removeTag(v)}
              >${this._labelFor(v)}</lt-chip
            >
          `
        )
      : nothing;

    const inputRow = html`
      <div class="input-wrap" @click=${this.openDropdown}>
        ${tags}
        <input
          id="combobox-input"
          role="combobox"
          aria-expanded=${this.open}
          aria-autocomplete="list"
          aria-describedby=${this.helperText ? this._fieldIds.helper : nothing}
          aria-required=${this.required}
          aria-invalid=${this.variant === 'error' ? 'true' : nothing}
          aria-controls=${this.open ? `${this._uid}-listbox` : nothing}
          aria-activedescendant=${this.open && activeOption
            ? this._idFor(activeOption)
            : this.open && onCreateRow
              ? `${this._uid}-create`
              : nothing}
          autocomplete="off"
          placeholder=${placeholderText}
          .value=${displayValue}
          ?disabled=${this._isDisabled}
          @focus=${this.handleFocus}
          @input=${this.handleInput}
          @keydown=${this.handleKeydown}
        />
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
          : nothing}
        <lt-icon class="chevron" name="caret-down" size="sm"></lt-icon>
      </div>
    `;

    return html`
      <div class="wrapper">
        ${this.label
          ? html`<label for="combobox-input"> ${renderFieldLabel(this.label, this.required)} </label>`
          : nothing}
        ${inputRow}
        ${this.open
          ? html`
              <div
                class="dropdown"
                id=${`${this._uid}-listbox`}
                popover="manual"
                role="listbox"
                aria-multiselectable=${this.multiple ? 'true' : nothing}
                aria-busy=${this.loading ? 'true' : nothing}
              >
                ${this.loading
                  ? renderListboxLoading(this._labels.loading)
                  : html`
                      ${opts.length > 0
                        ? renderListboxGroups(opts, (opt) => this._renderOption(opt, activeOption))
                        : showCreate
                          ? nothing
                          : html`<p class="no-results">${this._labels.noResults}</p>`}
                      ${showCreate ? this._renderCreateRow() : nothing}
                    `}
              </div>
            `
          : nothing}
        ${renderHelperText(this._fieldIds.helper, this.helperText)}
      </div>
    `;
  }
}
