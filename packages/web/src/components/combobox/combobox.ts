import { createFieldIds, renderFieldLabel, renderHelperText } from '../shared/form-field';
import { html, nothing, type PropertyValues } from 'lit';
import { FormControlElement } from '../../base';
import { customElement, property, state } from 'lit/decorators.js';

import { comboboxStyles } from './combobox.styles';
import type { ComboboxOption, ComboboxSize, ComboboxVariant, ComboboxLabels } from './combobox.types';
import { dispatch } from '../../utils';
import '@latty-ds/icons';
import '../text/text';
import '../chip/';
import '../spinner/';
import { PopupController } from '../shared/popup';
import { NativeAttrsController } from '../shared/native-attrs';
import { groupConsecutive } from '../shared/option-groups';
import { nextListboxIndex } from '../shared/listbox-nav';

let comboboxCount = 0;

// Case- and diacritic-insensitive comparison key for the search filter below — "café" should match a query of
// "cafe". NFD decomposes a combined character (e.g. "é") into its base letter plus a separate combining mark,
// which the Unicode range ̀-ͯ then strips; toLowerCase() runs first so a combining mark's own casing
// (irrelevant, marks have none) never factors in.
function normalizeForSearch(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

const DEFAULT_LABELS: ComboboxLabels = {
  validationMessage: 'Please select an option',
  noResults: 'No results',
  clear: 'Clear',
  loading: 'Loading…',
  create: (query) => `Create "${query}"`
};

/**
 * Searchable single-select combobox. The user types to filter options; selecting an option sets the value.
 *
 * @element lt-combobox
 *
 * @fires {CustomEvent<{value: string | string[]}>} change - Fired when the selected value changes. With
 *   `multiple`, `value` is the array of selected values.
 * @fires {CustomEvent<{value: string}>} create - Fired when `creatable` is set and the user selects the
 *   "create new" row for free-text that matches no existing option. Does not modify `options` itself — the
 *   consumer decides whether/how to persist the new option.
 *
 * @example
 * ```html
 * <lt-combobox
 *   label="Country"
 *   placeholder="Search countries…"
 *   .options=${[{ value: 'us', label: 'United States' }, { value: 'ca', label: 'Canada' }]}
 * ></lt-combobox>
 * ```
 *
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

  // Scopes generated option/listbox ids to this instance, so two comboboxes on the same page don't collide.
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
    if (Array.isArray(this.value)) return this.value;
    return this.value ? [this.value] : [];
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

  // Falls back to the raw value when it isn't found in `options` (e.g. a `creatable` value the consumer hasn't
  // added to `options`) — same fallback `_labelFor` already uses for multiple mode's tags, kept consistent here.
  private get selectedLabel(): string {
    if (Array.isArray(this.value) || !this.value) return '';
    return this.options.find((o) => o.value === this.value)?.label ?? this.value;
  }

  private get filtered(): ComboboxOption[] {
    const q = normalizeForSearch(this.query);
    return this.options.filter((o) => normalizeForSearch(o.label).includes(q));
  }

  // `activeIndex` counts positions in this list (enabled options only) — using the same list here and in
  // handleKeydown for both is what keeps the highlighted option and the one Enter selects in agreement (they
  // used to disagree once any option was disabled: the index came from this list, but the id/highlight below
  // used to come from the unfiltered one).
  private get enabledOpts(): ComboboxOption[] {
    return this.filtered.filter((o) => !o.disabled);
  }

  // Ids are derived from position in the unfiltered (but query-filtered) list, since that's what's actually
  // rendered — every option, enabled or not, gets one.
  private _idFor(opt: ComboboxOption): string {
    return `${this._uid}-option-${this.filtered.indexOf(opt)}`;
  }

  // Shown only when the typed text would actually create something new — not already a real option's label,
  // and (in `multiple` mode) not already one of the selected tags, so re-typing an already-created ad hoc tag
  // doesn't offer to "create" a duplicate of itself.
  private get _showCreate(): boolean {
    if (!this.creatable || this._isDisabled) return false;
    const q = this.query.trim();
    if (!q) return false;
    const qn = normalizeForSearch(q);
    if (this.options.some((o) => normalizeForSearch(o.label) === qn)) return false;
    if (this.multiple && this._selected.some((v) => normalizeForSearch(v) === qn)) return false;
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

  // Clicking an option button would otherwise focus it first (the default mousedown action) — a button that
  // momentarily takes focus, then vanishes as the dropdown closes, drops focus off the input. Suppressing just
  // that default action leaves the click itself (and selectOption) untouched, and the input stays focused.
  private _preventFocusSteal(e: MouseEvent) {
    e.preventDefault();
  }

  private get _showClear(): boolean {
    return this.clearable && this._selected.length > 0 && !this._isDisabled;
  }

  // Stops propagation so clicking clear doesn't also open the dropdown via .input-wrap's own click handler.
  private _clear(e: MouseEvent) {
    e.stopPropagation();
    this.value = this.multiple ? [] : '';
    this.query = '';
    dispatch(this, 'change', { value: this.value });
  }

  private async openDropdown() {
    // A click on the field fires both `focus` and `click`; a second call would start a second floating autoUpdate
    // and overwrite the first one's cleanup, leaking a scroll/resize listener pair on every open.
    if (this._isDisabled || this.open) return;
    this.open = true;
    this.setAttribute('open', '');
    this.query = '';
    this.activeIndex = -1;
    await this.updateComplete;
    // Escape (or a selection) can close the dropdown while the render it asked for was still pending —
    // opening it now would leave a panel on screen that nothing owns.
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
      const current = this._selected;
      this.value = current.includes(opt.value) ? current.filter((v) => v !== opt.value) : [...current, opt.value];
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
    this.value = this._selected.filter((v) => v !== value);
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
    // Backspace in an empty field removes the last tag — the same affordance `lt-chip` itself just gained,
    // and the standard tag-input convention (Gmail's "To" field, GitHub's label picker). Guarded on an empty
    // query so backspacing through typed text never also eats a tag.
    if (this.multiple && e.key === 'Backspace' && this.query === '' && this._selected.length > 0) {
      e.preventDefault();
      this._removeTag(this._selected[this._selected.length - 1]);
      return;
    }
    if (e.key === 'Escape') {
      // Only claim the keypress if there's actually something here to close — otherwise an ancestor (an open
      // <lt-dialog>, which closes itself on Escape unless something else already prevented the keydown's
      // default) should still see it and close on its own.
      if (this.open) {
        e.preventDefault();
        this.closeDropdown();
      }
      return;
    }
    // Closed, arrow keys only ever reopen it — the list itself only opened on focus/click/typing, so once
    // Escape closed it, arrowing (a natural first instinct) silently did nothing.
    if (!this.open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.openDropdown();
      }
      return;
    }

    const opts = this.enabledOpts;
    const showCreate = this._showCreate;
    // The create row, when shown, is one extra nav position past the last real option — so Up/Down treat it
    // as just one more item to land on, and Enter branches on whether that's where the index landed.
    const maxIndex = showCreate ? opts.length : opts.length - 1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.activeIndex = Math.min(this.activeIndex + 1, maxIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.activeIndex = Math.max(this.activeIndex - 1, 0);
    } else if (e.key === 'Home' || e.key === 'End' || e.key === 'PageDown' || e.key === 'PageUp') {
      // Arrow Up/Down deliberately clamp at the edges rather than wrap (a text-input-first component, unlike
      // lt-select) — these follow the same convention, so `nextListboxIndex`'s own clamping for these four
      // keys already matches without needing anything extra here.
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

  // `Node.contains()` is plain tree order, not shadow-including — it doesn't cross into a descendant's own
  // shadow root. A removable tag's delete button lives inside `lt-chip`'s own shadow root, nested inside this
  // component's, so checking containment means walking up through each shadow root's host in turn.
  private _isWithin(node: Node): boolean {
    let current: Node | null = node;
    while (current) {
      if (current === this) return true;
      current = current instanceof ShadowRoot ? current.host : current.parentNode;
    }
    return false;
  }

  // Options are tabindex="-1" (see SEL-3/CMB-1), but `multiple`'s removable tags are real focusable buttons —
  // so focus can legitimately move within the component without leaving it, the same check `lt-dropdown`
  // needs for its own (light DOM) children. relatedTarget is the element focus is moving *to*.
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
    if (this.multiple && !Array.isArray(this.value)) this.value = this._selected;
  }

  updated(changedProperties: Map<string, unknown>) {
    if (this.multiple) {
      const formData = new FormData();
      const name = this.getAttribute('name');
      if (name) for (const v of this._selected) formData.append(name, v);
      this._internals.setFormValue(formData);
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
   */
  protected override get _formValue(): string | string[] {
    return this.value;
  }

  protected override set _formValue(value: unknown) {
    this.value = Array.isArray(value) ? value.map(String) : value == null ? '' : String(value);
  }

  private _renderOption(opt: ComboboxOption, activeOption: ComboboxOption | undefined) {
    return html`
      <button
        id=${this._idFor(opt)}
        class="option"
        role="option"
        tabindex="-1"
        aria-selected=${this._selected.includes(opt.value)}
        ?disabled=${opt.disabled}
        data-active=${opt === activeOption}
        @mousedown=${this._preventFocusSteal}
        @click=${() => this.selectOption(opt)}
      >
        ${opt.icon ? html`<lt-icon class="option-icon" name=${opt.icon} size="sm"></lt-icon>` : nothing}
        <span class="option-content">
          <span class="option-label">${opt.label}</span>
          ${opt.description ? html`<span class="option-description">${opt.description}</span>` : nothing}
        </span>
      </button>
    `;
  }

  private _renderCreateRow() {
    const onCreateRow = this.activeIndex === this.enabledOpts.length;
    return html`
      <button
        id=${`${this._uid}-create`}
        class="option option-create"
        role="option"
        tabindex="-1"
        aria-selected="false"
        data-active=${onCreateRow}
        @mousedown=${this._preventFocusSteal}
        @click=${() => this._createOption()}
      >
        <lt-icon class="option-icon" name="plus" size="sm"></lt-icon>
        <span class="option-content">
          <span class="option-label">${this._labels.create(this.query.trim())}</span>
        </span>
      </button>
    `;
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
              @mousedown=${this._preventFocusSteal}
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
                  ? html`<div class="loading-state">
                      <lt-spinner size="sm"></lt-spinner>
                      <lt-text variant="caption" as="span">${this._labels.loading}</lt-text>
                    </div>`
                  : html`
                      ${opts.length > 0
                        ? groupConsecutive(opts).map((run) =>
                            run.group
                              ? html`<div class="option-group" role="group" aria-label=${run.group}>
                                  <div class="option-group-label" aria-hidden="true">${run.group}</div>
                                  ${run.items.map((opt) => this._renderOption(opt, activeOption))}
                                </div>`
                              : run.items.map((opt) => this._renderOption(opt, activeOption))
                          )
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
