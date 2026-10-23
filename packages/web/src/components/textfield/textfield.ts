import { html, nothing, PropertyValues } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormControlElement } from '../../base';
import { customElement, property, state } from 'lit/decorators.js';

import { textfieldStyles } from './textfield.styles';
import { HelperText, TextfieldSize, TextfieldType, TextfieldVariant, type TextfieldLabels } from './textfield.types';
import { NativeAttrsController } from '../shared/native-attrs';
import { renderFieldLabel, renderHelperText } from '../shared/form-field';
import { toValidityFlags } from '../../base';
import '@latty-ds/icons';
import '../text/text';

let textfieldCount = 0;

const DEFAULT_LABELS: TextfieldLabels = {
  validationMessage: 'Please match the requested format',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  clear: 'Clear'
};

/**
 * A customizable text input component with support for multiple variants, sizes, and input types.
 * Supports both single-line inputs and multi-line textareas, and automatically forwards native
 * `<input>` / `<textarea>` HTML attributes onto the inner control.
 * @element lt-textfield
 * @fires {CustomEvent<{value: string}>} input - Dispatched when the input value changes
 * @fires {CustomEvent<{value: string}>} change - Dispatched when the input loses focus after a value change
 * @example
 * ```html
 * <lt-textfield
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   required
 * ></lt-textfield>
 * ```
 * @example
 * ```html
 * <lt-textfield
 *   variant="error"
 *   label="Password"
 *   type="password"
 *   helper-text="Password must be at least 8 characters"
 * ></lt-textfield>
 * ```
 * @example
 * ```html
 * <lt-textfield
 *   type="multiline"
 *   label="Description"
 *   placeholder="Enter description..."
 *   rows="5"
 * ></lt-textfield>
 * ```
 */
@customElement('lt-textfield')
export class Textfield extends FormControlElement {
  static styles = textfieldStyles;

  private _nativeAttrs = new NativeAttrsController(this, () => this.shadowRoot?.querySelector('input, textarea'), {
    exclude: ['aria-label', 'aria-invalid', 'aria-describedby'],
    aliases: { 'input-mode': 'inputmode' },
    filter: (attr, target) => {
      if (target.tagName === 'TEXTAREA') return attr !== 'pattern' && attr !== 'min' && attr !== 'max';
      if (this.type === 'number') return attr !== 'minlength' && attr !== 'maxlength' && attr !== 'pattern';
      return attr !== 'min' && attr !== 'max';
    },
    onSync: () => this._syncValidity()
  });
  // Stable per-instance ids for `label for` and `aria-describedby` — not the host's own `id` attribute,
  // which a consumer may set for their own purposes (or leave unset).
  private readonly _uid = `lt-textfield-${textfieldCount++}`;
  private readonly _inputId = `${this._uid}-input`;
  private readonly _helperId = `${this._uid}-helper`;

  /**
   * Visual variant that determines styling and automatic end icon.
   * @default 'default'
   */
  @property({ reflect: true }) variant: TextfieldVariant = 'default';

  /**
   * Size of the textfield (affects height, font size, and padding).
   * @default 'md'
   */
  @property({ reflect: true }) size: TextfieldSize = 'md';

  /**
   * HTML input type. Password type includes automatic visibility toggle.
   * @default 'text'
   */
  @property({ reflect: true }) type: TextfieldType = 'text';

  /**
   * Current value of the input. Not reflected as an attribute: for `type="password"` that would put whatever
   * the user types in plain text in the DOM (`outerHTML`, DevTools, session-replay/DOM-mutation recorders) —
   * visible via `getAttribute('value')`/`[value]` regardless of input type. Read the property, or the
   * `input`/`change` event's `detail.value`, instead of an attribute selector.
   * @default ''
   */
  @property() value = '';

  /**
   * Label text displayed above the input.
   * @default ''
   */
  @property({ reflect: true }) label = '';

  /**
   * Helper text displayed below the input. Can be a static string or a function
   * that receives the current error state and returns the string to display.
   * Color changes based on variant or auto-error state.
   * @default ''
   */
  @property({ attribute: 'helper-text' }) helperText: HelperText = '';

  /**
   * Whether the input is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Whether the input is required. Shows asterisk in label when true.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) required = false;

  /**
   * Icon name to display at the start of the input.
   * @default ''
   */
  @property({ attribute: 'icon-start' }) iconStart = '';

  /**
   * Number of visible text lines for multiline type (textarea). Also the minimum height while `autosize` is
   * set — autosize only ever grows the textarea beyond this, never shrinks it below.
   * Only applies when type="multiline".
   * @default 3
   */
  @property({ type: Number }) rows = 3;

  /**
   * Grows the textarea's height to fit its content as the user types, instead of a fixed `rows`-tall box with a
   * manual resize handle (which this disables, since a manual drag would just get overwritten by the next
   * keystroke's auto-grow). Unbounded — there's currently no built-in way to cap the grown height. Only applies
   * when `type="multiline"`.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) autosize = false;

  /**
   * Renders the label in small caps with wider letter spacing.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) uppercase = false;

  /** Shows a clear button while the field has a value. Not shown for password fields, which have their own toggle. */
  @property({ type: Boolean, reflect: true }) clearable = false;

  /** Shows the character count as `length / maxLength` below the field. Uses the native `maxlength` attribute as the limit, which is also enforced natively. */
  @property({ type: Boolean, reflect: true }) counter = false;

  /**
   * Plain text shown before the input, inside the field's own border (e.g. A currency symbol). Deliberately a
   * string, not a slot — arbitrary slotted markup could vary in height/width enough to break the field's fixed
   * row layout, which a plain text label can't. Rendered via an explicit `String()` coercion rather than
   * interpolated directly, so a consumer bypassing the type system (plain JS, an `as any` cast) and assigning a
   * real DOM node can't get it inserted live either — Lit's child-position bindings accept any `Node` value and
   * insert it as-is, not just strings. No effect on `type="multiline"`, the same way `pattern` has none there —
   * prepending a short label in front of a multi-line paragraph doesn't read as a unit/symbol the way it does
   * for a single value.
   * @default ''
   */
  @property({ reflect: true }) prefix = '';

  /** Plain text shown after the input, inside the field's own border (e.g. A unit like "kg"). Same reasoning
   * and `type="multiline"` exception as `prefix`.
   * @default ''
   */
  @property({ reflect: true }) suffix = '';

  /** Overridable UI text (format validation message, password-toggle button labels), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<TextfieldLabels> = {};

  private get _labels(): TextfieldLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

  @state() private isPasswordVisible = false;
  @state() private _touched = false;
  @state() private _autoError = false;

  private _onBlur = (e: Event) => {
    const native = e.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = native.value;
    this._touched = true;
    this._autoError = !this._validate();
  };

  /**
   * Validates the current value against format and constraint rules.
   * @private
   */
  private _validate(): boolean {
    const v = this.value;
    if (!v) return true;
    if (this.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return false;
    if (this.type === 'url') {
      try {
        new URL(v);
      } catch {
        return false;
      }
    }
    if (this.type === 'tel' && !/^[+\d][\d\s()\-.]{2,}$/.test(v)) return false;
    if (this.type === 'number') {
      const n = Number(v);
      if (isNaN(n)) return false;
      const minAttr = this.getAttribute('min');
      const maxAttr = this.getAttribute('max');
      if (minAttr !== null && minAttr !== '' && n < Number(minAttr)) return false;
      if (maxAttr !== null && maxAttr !== '' && n > Number(maxAttr)) return false;
    } else {
      const minLenAttr = this.getAttribute('minlength');
      const maxLenAttr = this.getAttribute('maxlength');
      if (minLenAttr !== null && minLenAttr !== '' && v.length < Number(minLenAttr)) return false;
      if (maxLenAttr !== null && maxLenAttr !== '' && v.length > Number(maxLenAttr)) return false;
    }
    return true;
  }

  private handleInput(e: Event) {
    // The native input/change event is composed, so it would otherwise keep
    // bubbling past the shadow boundary after we re-dispatch our own —
    // double-firing the same event name on the host with the wrong detail shape.
    e.stopPropagation();
    const input = e.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = input.value;
    if (this._touched) this._autoError = !this._validate();
    // Called directly here (not just in updated()) for instant autosize — Lit's update cycle is async,
    // so waiting would show a one-frame lag between keystroke and textarea growing.
    // The double call from updated() is a cheap, idempotent no-op.
    if (this.autosize && this.type === 'multiline') this._resizeTextarea(input as HTMLTextAreaElement);
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }

  /**
   * Grows `textarea` to fit its current content, for `autosize`. Collapsing to `height: auto` first (rather than
   * reading `scrollHeight` against whatever height is already set) is required for the textarea to ever shrink
   * back down, not just grow — `scrollHeight` on an element with an explicit fixed height reports at least that
   * height regardless of how little content is actually in it.
   */
  private _resizeTextarea(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  private get _showClear(): boolean {
    return (
      this.clearable && !!this.value && !this._isDisabled && !this.hasAttribute('readonly') && this.type !== 'password'
    );
  }

  private _clear() {
    this.value = '';
    if (this._touched) this._autoError = !this._validate();
    const detail = { value: '' };
    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
    this.updateComplete.then(() => {
      this.shadowRoot?.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea')?.focus();
    });
  }

  private handleChange(e: Event) {
    e.stopPropagation();
    const input = e.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = input.value;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }

  // A native single-line <input> inside a <form> implicitly submits on Enter; the inner input here is
  // in the shadow DOM, so the browser never wires that up on its own. Not on the multiline textarea —
  // a native <textarea> never implicit-submits on Enter either, since Enter there means "new line".
  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' || e.isComposing || this._isDisabled) return;
    const form = this.closest('form') as HTMLFormElement | null;
    form?.requestSubmit();
  };

  /**
   * Toggles password visibility for password-type inputs.
   * Switches between showing plain text and masked password.
   * @private
   */
  private togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // Clicking the toggle would otherwise focus the button first (the default mousedown action), moving the
  // caret out of the field. Suppressing just that default action leaves the click itself untouched, and the
  // input stays focused throughout.
  private _preventFocusSteal(e: MouseEvent) {
    e.preventDefault();
  }

  /**
   * Determines the appropriate end icon based on input type and variant.
   *
   * Password inputs show eye/eye-off toggle icon.
   * Non-default variants show their respective state icons.
   * Default variant shows no end icon.
   * @returns The icon name to display, or empty string if no icon should be shown.
   * @private
   */
  private getEndIconName(): string {
    if (this.type === 'password') return this.isPasswordVisible ? 'eye-off' : 'eye';
    const effectiveVariant = this._autoError ? 'error' : this.variant;
    switch (effectiveVariant) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'warning-triangle';
      case 'error':
        return 'xmark-circle';
      default:
        return '';
    }
  }

  override firstUpdated(changed: PropertyValues) {
    super.firstUpdated(changed);
    if (this.autofocus || this.hasAttribute('autofocus')) {
      this.shadowRoot!.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea')?.focus();
    }
  }

  private _syncValidity() {
    const inner = (this.shadowRoot?.querySelector('input') ?? this.shadowRoot?.querySelector('textarea')) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
    if (!inner) return;
    // The native `type`/`min`/`max`/`minlength`/`maxlength`/`required` attributes are forwarded onto
    // the inner control, so its own `validity` already covers valueMissing, typeMismatch (email/url),
    // rangeUnderflow/Overflow (number), and tooShort/tooLong for free — mirror that first.
    // `_validate()`'s extra rules (such as the `tel` format, which HTML has no native constraint for) become `customError`.
    if (!inner.validity.valid) {
      this._internals.setValidity(toValidityFlags(inner.validity), inner.validationMessage, inner);
    } else if (!this._validate()) {
      this._internals.setValidity({ customError: true }, this._labels.validationMessage, inner);
    } else {
      this._internals.setValidity({});
    }
  }

  override updated(changed: PropertyValues) {
    super.updated(changed);
    this.toggleAttribute('data-invalid', this._autoError);
    this._internals.setFormValue(this.value);
    const inner = (this.shadowRoot!.querySelector('input') ?? this.shadowRoot!.querySelector('textarea')) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
    if (!inner) return;
    // Covers every autosize-relevant change NOT already handled by handleInput()'s own direct call: the initial
    // render with a pre-filled value, and value/rows/autosize changed from outside the user's own typing (e.g. a
    // consumer sets `el.value` programmatically). No ResizeObserver, no guessed-at `changed.has(...)` gating on
    // specific props — just unconditionally re-measure on every update while autosize+multiline are both active,
    // since the call itself is cheap and idempotent; when either is off, clear any leftover inline height
    // instead, so toggling autosize off restores plain CSS-driven sizing rather than leaving it stuck at
    // whatever height it last grew to.
    if (this.type === 'multiline') {
      if (this.autosize) this._resizeTextarea(inner as HTMLTextAreaElement);
      else inner.style.height = '';
    }
    this._syncValidity();
  }

  /**
   * A text-like control's value is its `value` — what a form reset restores and what a browser
   * state-restore repopulates.
   */
  protected override get _formValue(): string {
    return this.value;
  }

  protected override set _formValue(value: unknown) {
    this.value = value == null ? '' : String(value);
  }

  /**
   * Restores the textfield's value *and* the interaction state that goes with it — a reset puts the
   * field back to its pristine state, so the touched flag and any auto-shown error have to go too.
   */
  override formResetCallback(): void {
    super.formResetCallback();
    this._touched = false;
    this._autoError = false;
  }

  render() {
    const hasStartIcon = Boolean(this.iconStart);
    const isPasswordField = this.type === 'password';
    const isMultiline = this.type === 'multiline';
    const isNumber = this.type === 'number';
    const endIconName = this.getEndIconName();
    const showClear = this._showClear;
    const hasEndIcon = Boolean(endIconName) || showClear;
    const hasPrefix = !isMultiline && Boolean(this.prefix);
    const hasSuffix = !isMultiline && Boolean(this.suffix);
    const actualInputType = isPasswordField && this.isPasswordVisible ? 'text' : this.type;
    const isInvalid = this._autoError || this.variant === 'error';
    const resolvedHelperText = typeof this.helperText === 'function' ? this.helperText(isInvalid) : this.helperText;
    const placeholder = this.getAttribute('placeholder') ?? '';
    const maxLengthAttr = this.getAttribute('maxlength');
    // A real `<label for>` already gives the input its accessible name — an `aria-label` alongside it would
    // override that (aria-label always wins accessible-name computation) and hide the visible label text from
    // screen readers instead. Only fall back to `aria-label` when there's no visible label to associate.
    const ariaLabel = this.label ? undefined : this.getAttribute('aria-label') || placeholder || undefined;

    return html`
      <div class="wrapper">
        ${this.label
          ? html` <label for=${this._inputId}> ${renderFieldLabel(this.label, this.required)} </label> `
          : ''}
        <div class=${classMap({ 'input-container': true, 'has-start-icon': hasStartIcon, 'has-end-icon': hasEndIcon })}>
          ${hasStartIcon ? html`<lt-icon class="icon-start" name=${this.iconStart}></lt-icon>` : ''}
          ${hasPrefix ? html`<span class="prefix">${String(this.prefix)}</span>` : ''}
          ${isMultiline
            ? html`
                <textarea
                  id=${this._inputId}
                  .value=${this.value}
                  rows=${this.rows}
                  ?disabled=${this._isDisabled}
                  ?required=${this.required}
                  @input=${this.handleInput}
                  @change=${this.handleChange}
                  @blur=${this._onBlur}
                  aria-label=${ifDefined(ariaLabel)}
                  aria-invalid=${isInvalid ? 'true' : 'false'}
                  aria-describedby=${resolvedHelperText ? this._helperId : nothing}
                  class=${classMap({
                    'has-start-icon': hasStartIcon,
                    'has-end-icon': hasEndIcon,
                    autosize: this.autosize
                  })}
                ></textarea>
              `
            : html`
                <input
                  id=${this._inputId}
                  type=${actualInputType}
                  .value=${this.value}
                  ?disabled=${this._isDisabled}
                  ?required=${this.required}
                  @input=${this.handleInput}
                  @change=${this.handleChange}
                  @blur=${this._onBlur}
                  @keydown=${this._onKeydown}
                  aria-label=${ifDefined(ariaLabel)}
                  aria-invalid=${isInvalid ? 'true' : 'false'}
                  aria-describedby=${resolvedHelperText ? this._helperId : nothing}
                  class="field"
                />
              `}
          ${hasSuffix ? html`<span class="suffix">${String(this.suffix)}</span>` : ''}
          ${showClear
            ? html`<button
                type="button"
                class="icon-end clear-button"
                aria-label=${this._labels.clear}
                @mousedown=${this._preventFocusSteal}
                @click=${this._clear}
              >
                <lt-icon name="xmark"></lt-icon>
              </button>`
            : ''}
          ${endIconName
            ? isPasswordField
              ? html`
                  <button
                    type="button"
                    class="icon-end password-toggle"
                    ?disabled=${this._isDisabled}
                    aria-label=${this.isPasswordVisible ? this._labels.hidePassword : this._labels.showPassword}
                    aria-pressed=${this.isPasswordVisible ? 'true' : 'false'}
                    @mousedown=${this._preventFocusSteal}
                    @click=${this.togglePasswordVisibility}
                  >
                    <lt-icon name=${endIconName}></lt-icon>
                  </button>
                `
              : html`<lt-icon class="icon-end variant-icon" name=${endIconName}></lt-icon>`
            : ''}
        </div>
        ${renderHelperText(this._helperId, resolvedHelperText)}
        ${this.counter && !isNumber && maxLengthAttr !== null && maxLengthAttr !== ''
          ? html`<lt-text variant="caption" as="span" class="counter">${this.value.length} / ${maxLengthAttr}</lt-text>`
          : ''}
      </div>
    `;
  }
}
