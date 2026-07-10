import type { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * Host `aria-*` attributes forwarded onto the internal native control.
 *
 * Interactive components render their semantics on a native element inside the
 * shadow DOM, so ARIA attributes set on the host (`<lt-button aria-pressed="true">`)
 * never reach the element screen readers actually interact with. Components that
 * install an {@link AriaForwardingController} mirror this documented subset onto
 * their internal control and keep it in sync as the host attributes change.
 *
 * Note: `aria-controls` contains an idref — it can only resolve when the referenced
 * element lives in the same tree as the internal control, so cross-shadow references
 * are forwarded but may be ignored by assistive technology.
 */
export const FORWARDED_ARIA_ATTRIBUTES = [
  'aria-pressed',
  'aria-expanded',
  'aria-haspopup',
  'aria-controls',
  'aria-current'
] as const;

type AriaForwardingHost = ReactiveControllerHost & Element;

/**
 * Reactive controller that forwards {@link FORWARDED_ARIA_ATTRIBUTES} from the
 * host element onto an internal target element (typically the native `<button>`
 * or `<a>` rendered in the shadow DOM).
 *
 * A `MutationObserver` watches the host so dynamic changes (e.g. a framework
 * toggling `aria-pressed`) are re-forwarded after every update. Attributes
 * removed from the host are removed from the target — components should not
 * render any of the forwarded attributes themselves.
 *
 * @example
 * ```ts
 * class Button extends LitElement {
 *   private _aria = new AriaForwardingController(this, () => this.shadowRoot?.querySelector('[part="base"]'));
 * }
 * ```
 */
export class AriaForwardingController implements ReactiveController {
  private _host: AriaForwardingHost;
  private _getTarget: () => Element | null | undefined;
  private _observer: MutationObserver;

  constructor(host: AriaForwardingHost, getTarget: () => Element | null | undefined) {
    this._host = host;
    this._getTarget = getTarget;
    this._observer = new MutationObserver(() => this._host.requestUpdate());
    host.addController(this);
  }

  hostConnected() {
    this._observer.observe(this._host, { attributes: true, attributeFilter: [...FORWARDED_ARIA_ATTRIBUTES] });
    this._host.requestUpdate();
  }

  hostDisconnected() {
    this._observer.disconnect();
  }

  hostUpdated() {
    const target = this._getTarget();
    if (!target) return;
    for (const attr of FORWARDED_ARIA_ATTRIBUTES) {
      const value = this._host.getAttribute(attr);
      if (value === null) target.removeAttribute(attr);
      else if (target.getAttribute(attr) !== value) target.setAttribute(attr, value);
    }
  }
}
