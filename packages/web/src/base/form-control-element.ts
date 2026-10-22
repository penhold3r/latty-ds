import { ThemeableElement } from './themeable-element';
import { FormDefaultController } from './form-default';
import { FormDisabledController } from './form-disabled';

/**
 * Base class for every form-associated Latty control (`lt-textfield`, `lt-checkbox`, `lt-select`,
 * `lt-button`, …).
 *
 * It owns the `ElementInternals` plumbing that the eleven controls used to re-implement one by one:
 *
 * - `attachInternals()` plus the `formAssociated` static, so the browser wires the element into the
 *   surrounding `<form>` exactly the way it wires up a native control.
 * - `formDisabledCallback` → the `<fieldset disabled>` inheritance, tracked separately from the
 *   control's own `disabled` property (see `FormDisabledController`).
 * - `formResetCallback` → restores the value the markup asked for, captured on first connect by
 *   `FormDefaultController`.
 * - `formStateRestoreCallback` → repopulates the control from browser-restored state (back/forward-cache
 *   restore, autofill), which no control implemented before.
 * - `checkValidity()` / `reportValidity()` → delegated to the internals.
 *
 * A subclass supplies only what genuinely differs between controls: its *value*, through the
 * `_formValue` accessor pair. A text-like control's value is its `value` string; a toggleable
 * control's is its `checked` state expressed the way the form sees it (`this.value` when checked,
 * `null` when not) — the same shape `setFormValue()` publishes.
 *
 * @example
 * ```ts
 * @customElement('lt-example')
 * export class Example extends FormControlElement {
 *   @property() value = '';
 *
 *   protected override get _formValue(): string {
 *     return this.value;
 *   }
 *
 *   protected override set _formValue(value: unknown) {
 *     this.value = value == null ? '' : String(value);
 *   }
 * }
 * ```
 */
export abstract class FormControlElement extends ThemeableElement {
  /**
   * Marks the element as a form-associated custom element, which is what lets the browser give it a
   * place in the surrounding form's data, validity, reset, and disabled state.
   *
   * Declared here so every control inherits it (a static is inherited through the prototype chain, so
   * `attachInternals()` below can never fail on a subclass that forgot to opt in). It is deliberately
   * *not* relied on for the manifest: `cem analyze` only lists members declared on a component's own
   * class, so a control that wanted `formAssociated` in its manifest entry would still have to declare
   * it there.
   */
  static formAssociated = true;

  /**
   * The element's form-associated internals — the platform API for a custom element's participation in
   * a form (its owner form, its submitted value, its validity, and the reset/restore callbacks).
   */
  protected readonly _internals: ElementInternals;

  /**
   * The control's value as it was when it first connected — what a form reset restores.
   */
  protected readonly _default: FormDefaultController<unknown>;

  /**
   * Tracks the disabled state inherited from an ancestor `<fieldset>`, kept separate from the
   * control's own explicit `disabled` property.
   */
  protected readonly _fieldsetDisabled: FormDisabledController;

  constructor() {
    super();
    this._internals = this.attachInternals();
    this._default = new FormDefaultController(this, () => this._formValue);
    this._fieldsetDisabled = new FormDisabledController(this);
  }

  /**
   * The control's value, in the form's terms: the value it submits, and the value a reset restores.
   *
   * For a text-like control this is its `value`; for a toggleable one it is `this.value` while checked
   * and `null` while not — the exact shape `setFormValue()` publishes, so restoring it means the same
   * thing in both directions.
   */
  protected abstract get _formValue(): unknown;

  /** @see {@link FormControlElement._formValue} */
  protected abstract set _formValue(value: unknown);

  /**
   * The control's own `disabled` property.
   *
   * Read through a cast on purpose. `disabled` has to stay declared on each concrete control, because
   * the custom-elements manifest the docs, the Playground, and the React wrappers are generated from
   * lists only the properties declared on the component's own class (`cem analyze` doesn't inherit
   * base-class members) — a `disabled` that lived only here would silently vanish from all three.
   */
  protected get _ownDisabled(): boolean {
    return (this as unknown as { disabled?: boolean }).disabled ?? false;
  }

  /**
   * Whether the control is disabled — its own `disabled` property combined with an ancestor
   * `<fieldset>`'s disabled state.
   */
  protected get _isDisabled(): boolean {
    return this._ownDisabled || this._fieldsetDisabled.fieldsetDisabled;
  }

  /**
   * The form this control belongs to, or `null` when it isn't associated with one.
   *
   * Mirrors the native `HTMLInputElement.form` property: the owner is the nearest ancestor `<form>`,
   * unless the element carries a `form="id"` attribute pointing at a different one.
   */
  get form(): HTMLFormElement | null {
    return this._internals.form;
  }

  /**
   * Restores the control to the value it had when it first connected.
   *
   * Subclasses that keep extra state alongside their value (the textfield's touched/error flags) override
   * this and call `super.formResetCallback()`.
   */
  formResetCallback(): void {
    this._formValue = this._default.value;
  }

  /**
   * Called by the browser when the control's disabled state changes — its own `disabled` property, or an
   * ancestor `<fieldset>` becoming disabled.
   */
  formDisabledCallback(disabled: boolean): void {
    this._fieldsetDisabled.setFieldsetDisabled(disabled);
  }

  /**
   * Called by the browser when it restores the control's state — after a back/forward-cache restore, or
   * when the browser autofills a form.
   *
   * `state` is the value the control published through `setFormValue()` (a string for a single-value
   * control, a `FormData` for a multi-value one), or `null` when the control had no value to save.
   */
  // The browser always calls this with two arguments — the state and the mode it is restoring in
  // (`'restore'` for a session restore, `'autocomplete'` for autofill). The mode is part of the DOM
  // contract, so the signature keeps it, even though no control needs it yet: it stays available to a
  // subclass that does (a combobox restoring a suggestion list, say) without the base having to change.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formStateRestoreCallback(state: File | string | FormData | null, _mode: 'restore' | 'autocomplete'): void {
    this._restoreFormState(state);
  }

  /**
   * Restores the control from browser-restored form state.
   *
   * The default implementation restores a single value; a multi-value control (a `multiple` select or
   * combobox) overrides it to restore the whole set.
   */
  protected _restoreFormState(state: File | string | FormData | null): void {
    if (state instanceof File) return;
    if (state === null) {
      this._formValue = null;
      return;
    }
    if (state instanceof FormData) {
      const values = [...state.values()];
      if (values.length === 0) return;
      this._formValue = values.length === 1 ? values[0] : values;
      return;
    }
    this._formValue = state;
  }

  /** Whether the control currently satisfies its own constraints. */
  checkValidity(): boolean {
    return this._internals.checkValidity();
  }

  /** Whether the control currently satisfies its own constraints, reporting any failure to the user. */
  reportValidity(): boolean {
    return this._internals.reportValidity();
  }
}
