import type { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * Tracks whether this form control is disabled because it's a descendant of a disabled `<fieldset>` — kept
 * separate from the component's own explicit `disabled` property/attribute, which a consumer controls directly
 * and which the fieldset toggling on or off must never overwrite in either direction. This mirrors how a native
 * `<input>`'s `.disabled` IDL property only ever reflects its own attribute: a disabled fieldset makes it match
 * `:disabled` and stop responding, but never touches the attribute itself, so re-enabling the fieldset can't
 * accidentally un-disable an input the page explicitly disabled.
 *
 * The browser already makes the host match the `:disabled`/`:enabled` CSS pseudo-classes automatically for any
 * form-associated custom element the moment a fieldset ancestor's `disabled` changes — nothing has to be done
 * for that (verified in Chromium). This controller is for the *functional* side, which the platform does not
 * wire up on its own: call {@link setFieldsetDisabled} from the component's own `formDisabledCallback`, and
 * combine {@link fieldsetDisabled} with the component's own `disabled` wherever that gates interaction or the
 * inner native control's own `disabled`.
 *
 * @example
 * ```ts
 * class Textfield extends ThemeableElement {
 *   private _fieldsetDisabled = new FormDisabledController(this);
 *
 *   formDisabledCallback(disabled: boolean) {
 *     this._fieldsetDisabled.setFieldsetDisabled(disabled);
 *   }
 *
 *   private get _isDisabled(): boolean {
 *     return this.disabled || this._fieldsetDisabled.fieldsetDisabled;
 *   }
 * }
 * ```
 */
export class FormDisabledController implements ReactiveController {
  private _host: ReactiveControllerHost;
  private _fieldsetDisabled = false;

  constructor(host: ReactiveControllerHost) {
    this._host = host;
    host.addController(this);
  }

  // No-op — this controller has no connect-time work of its own (formDisabledCallback drives it instead), but
  // ReactiveController's members are all optional, and a class satisfying an all-optional interface with no
  // members in common is a TS error (TS2559); this gives it one.
  hostConnected() {}

  /** Whether an ancestor `<fieldset>` is currently disabled. */
  get fieldsetDisabled(): boolean {
    return this._fieldsetDisabled;
  }

  setFieldsetDisabled(disabled: boolean) {
    if (this._fieldsetDisabled === disabled) return;
    this._fieldsetDisabled = disabled;
    this._host.requestUpdate();
  }
}
