import type { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * Captures a form-associated control's initial value the first time it connects — before any user interaction,
 * or the control's own reflection, can overwrite it — so `formResetCallback` can restore what the markup
 * actually asked for, the way a native `<input>`/`<select>` resets to its `defaultValue`/`defaultChecked`
 * instead of a hard-coded empty one.
 *
 * A reconnect (an already-upgraded element moved in the DOM) does not recapture: only the very first connect
 * counts as "the default", matching a real form control, which keeps its `defaultValue` fixed for its whole
 * lifetime regardless of how many times it's detached and reattached.
 *
 * @example
 * ```ts
 * class Textfield extends ThemeableElement {
 *   private _default = new FormDefaultController(this, () => this.value);
 *
 *   formResetCallback() {
 *     this.value = this._default.value;
 *   }
 * }
 * ```
 */
export class FormDefaultController<T> implements ReactiveController {
  private _get: () => T;
  private _captured = false;

  /** The captured default. Only meaningful once the host has connected at least once. */
  value!: T;

  constructor(host: ReactiveControllerHost, get: () => T) {
    this._get = get;
    host.addController(this);
  }

  hostConnected() {
    if (this._captured) return;
    this._captured = true;
    this.value = this._get();
  }
}
