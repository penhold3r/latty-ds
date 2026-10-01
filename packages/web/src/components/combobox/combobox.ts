import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, state } from 'lit/decorators.js';

import { comboboxStyles } from './combobox.styles';
import type { ComboboxOption, ComboboxSize, ComboboxVariant, ComboboxLabels } from './combobox.types';
import { dispatch, createClickOutsideHandler } from '../../utils';
import '@latty-ds/icons';
import '../text/text';
import { openFloating, closeFloating } from '../shared/floating';
import { FormDefaultController } from '../shared/form-default';
import { FormDisabledController } from '../shared/form-disabled';

let comboboxCount = 0;

const DEFAULT_LABELS: ComboboxLabels = {
  validationMessage: 'Please select an option',
  noResults: 'No results'
};

/**
 * Searchable single-select combobox. The user types to filter options; selecting an option sets the value.
 *
 * @element lt-combobox
 *
 * @fires {CustomEvent<{value: string}>} change - Fired when the selected value changes.
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
  static formAssociated = true;

  private _internals!: ElementInternals;
  private _default = new FormDefaultController(this, () => this.value);
  private _fieldsetDisabled = new FormDisabledController(this);

  // Scopes generated option/listbox ids to this instance, so two comboboxes on the same page don't collide.
  private readonly _uid = `lt-combobox-${comboboxCount++}`;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  /** Array of selectable options. Set as a JS property (`.options`). */
  @property({ type: Array }) options: ComboboxOption[] = [];

  /** Currently selected value. Not reflected as an attribute — read the property, or the `change` event's
   * `detail.value`, instead of `getAttribute('value')`/`[value]` (consistent with the rest of the form
   * controls; see `lt-textfield`'s equivalent doc comment for why). */
  @property() value = '';

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

  /** Name used in form submission. */
  @property({ reflect: true }) name = '';

  /** Overridable UI text (validation message, "no results" text), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<ComboboxLabels> = {};

  private get _labels(): ComboboxLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

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

  // Clicking an option button would otherwise focus it first (the default mousedown action) — a button that
  // momentarily takes focus, then vanishes as the dropdown closes, drops focus off the input. Suppressing just
  // that default action leaves the click itself (and selectOption) untouched, and the input stays focused.
  private _preventFocusSteal(e: MouseEvent) {
    e.preventDefault();
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
    const inputWrap = this.shadowRoot!.querySelector<HTMLElement>('.input-wrap')!;
    const dropdown = this.shadowRoot!.querySelector<HTMLElement>('.dropdown')!;
    if (inputWrap && dropdown) {
      const cleanup = await openFloating(inputWrap, dropdown, { matchWidth: true });
      // Guard against a close during the await — otherwise the autoUpdate cleanup is orphaned.
      if (this.open) this._floatingCleanup = cleanup;
      else cleanup();
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
    dispatch(this, 'change', { value: opt.value });
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

  // Now that options are tabindex="-1" (see SEL-3/CMB-1), the input is the only focusable thing in this
  // component's shadow root — so any focusout while open means focus is leaving the combobox entirely, unlike
  // lt-dropdown, which has to check where focus actually went.
  private _onFocusOut = () => {
    if (this.open) this.closeDropdown();
  };

  connectedCallback() {
    super.connectedCallback();
    this._cleanupClickOutside = createClickOutsideHandler(this, () => this.closeDropdown(), { event: 'click' });
    this.addEventListener('focusout', this._onFocusOut);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('focusout', this._onFocusOut);
    this._cleanupClickOutside?.();
    this._cleanupClickOutside = null;
    this._floatingCleanup?.();
    this._floatingCleanup = null;
  }

  updated() {
    this._internals.setFormValue(this.value || null);
    const input = this.shadowRoot?.querySelector<HTMLElement>('input');
    if (this.required && !this.value && input) {
      this._internals.setValidity({ valueMissing: true }, this._labels.validationMessage, input);
    } else {
      this._internals.setValidity({});
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
    const opts = this.filtered;
    const activeOption = this.enabledOpts[this.activeIndex];
    const displayValue = this.open ? this.query : this.selectedLabel;

    const inputRow = html`
      <div class="input-wrap" @click=${this.openDropdown}>
        <input
          id="combobox-input"
          role="combobox"
          aria-expanded=${this.open}
          aria-autocomplete="list"
          aria-required=${this.required}
          aria-controls=${this.open ? `${this._uid}-listbox` : nothing}
          aria-activedescendant=${this.open && activeOption ? this._idFor(activeOption) : nothing}
          autocomplete="off"
          placeholder=${this.open ? this.placeholder : this.selectedLabel || this.placeholder}
          .value=${displayValue}
          ?disabled=${this._isDisabled}
          @focus=${this.handleFocus}
          @input=${this.handleInput}
          @keydown=${this.handleKeydown}
        />
        <lt-icon class="chevron" name="caret-down" size="sm"></lt-icon>
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
              <div class="dropdown" id=${`${this._uid}-listbox`} popover="manual" role="listbox">
                ${opts.length > 0
                  ? opts.map(
                      (opt) => html`
                        <button
                          id=${this._idFor(opt)}
                          class="option"
                          role="option"
                          tabindex="-1"
                          aria-selected=${opt.value === this.value}
                          ?disabled=${opt.disabled}
                          data-active=${opt === activeOption}
                          @mousedown=${this._preventFocusSteal}
                          @click=${() => this.selectOption(opt)}
                        >
                          ${opt.label}
                        </button>
                      `
                    )
                  : html`<p class="no-results">${this._labels.noResults}</p>`}
              </div>
            `
          : nothing}
        ${this.helperText ? html`<span class="helper-text">${this.helperText}</span>` : nothing}
      </div>
    `;
  }
}
