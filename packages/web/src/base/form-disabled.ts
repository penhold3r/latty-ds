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
 * **`formDisabledCallback` also fires for the component's own `disabled`, not only an ancestor `<fieldset>`**
 * (confirmed in Chromium — the spec's form-associated "disabled state" is the union of both, not fieldset-only
 * as this controller originally assumed). That firing is always redundant with the reactive update the host's
 * own `disabled` property change already schedules — but the *order* it happens in is the real hazard: setting
 * `host.disabled = false` triggers Lit's reflection of the now-missing attribute, which synchronously fires this
 * callback *from inside* that same update's commit phase, calling {@link setFieldsetDisabled} while the update
 * that's supposed to pick up the new value is still in the middle of applying its previous one — a same-cycle
 * `requestUpdate()` that reliably got dropped instead of scheduling a fresh pass, leaving a stale `disabled` on
 * the rendered inner control after `host.disabled` had already flipped back to `false` (confirmed in Chromium: a
 * button disabled then re-enabled right after stayed unclickable, its inner `<button disabled>` never cleared).
 * Deferring to a microtask moves the request *after* the current update fully commits, so it always starts a
 * genuinely new cycle instead of colliding with the one in flight.
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

  /*
   * No-op — this controller has no connect-time work of its own (formDisabledCallback drives it instead), but
   * ReactiveController's members are all optional, and a class satisfying an all-optional interface with no
   * members in common is a TS error (TS2559); this gives it one.
   */
  hostConnected() {}

  /** Whether an ancestor `<fieldset>` is currently disabled. */
  get fieldsetDisabled(): boolean {
    return this._fieldsetDisabled;
  }

  setFieldsetDisabled(disabled: boolean) {
    if (this._fieldsetDisabled === disabled) return;
    this._fieldsetDisabled = disabled;
    /*
     * Deferred — see the class doc comment. Must never be called synchronously here: `formDisabledCallback` can
     * (and, for the component's own `disabled`, reliably does) fire from inside the host's own in-progress update.
     */
    queueMicrotask(() => this._host.requestUpdate());
  }
}
