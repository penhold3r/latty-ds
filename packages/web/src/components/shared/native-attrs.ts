import type { ReactiveController, ReactiveControllerHost, ReactiveElement } from 'lit';

/**
 * Global attributes that belong strictly to the `<lt-*>` host element itself
 * and must never be copied onto an inner shadow element:
 * - `id`: copying would create a duplicate ID and clobber internal `<label for>` wiring
 * - `class`, `style`, `part`, `exportparts`, `theme`: host styling/layout concerns
 * - `slot`, `hidden`, `inert`, `popover`, `dir`, `lang`, `tabindex`: host-level DOM/focus semantics
 * - `role`: host-level ARIA role when explicitly set on a host (e.g. `lt-breadcrumb-item`)
 */
export const HOST_ONLY_ATTRIBUTES = new Set([
  'id',
  'class',
  'style',
  'slot',
  'part',
  'exportparts',
  'hidden',
  'dir',
  'lang',
  'inert',
  'popover',
  'tabindex',
  'theme',
  'role'
]);

export interface NativeAttrsOptions {
  /** Additional host attribute names managed directly by the component's own template. */
  exclude?: Iterable<string>;
  /** Legacy host attribute aliases mapped to canonical inner attribute names (e.g. `{ 'input-mode': 'inputmode' }`). */
  aliases?: Record<string, string>;
  /** Optional predicate to filter which attributes apply to the current inner target element. */
  filter?: (attr: string, target: Element) => boolean;
  /** Optional hook called after attributes are synced onto the target element (e.g. to re-check `inner.validity`). */
  onSync?: (target: Element) => void;
}

type NativeAttrsHost = ReactiveControllerHost & Element;

/**
 * Collects the HTML attribute names owned by `@property()` declarations on a
 * Lit `ReactiveElement` class so `NativeAttrsController` never overwrites or
 * duplicates attributes the component already manages in its own template.
 */
function getDeclaredPropertyAttributes(host: Element): Set<string> {
  const ctor = host.constructor as typeof ReactiveElement | undefined;
  const map = ctor?.elementProperties;
  const owned = new Set<string>();
  if (!map) return owned;

  for (const [propKey, options] of map.entries()) {
    if (options?.attribute === false) continue;
    if (typeof options?.attribute === 'string') {
      owned.add(options.attribute.toLowerCase());
    } else {
      const key = String(propKey);
      owned.add(key.toLowerCase());
      owned.add(key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase());
    }
  }
  return owned;
}

/**
 * Reactive controller that automatically forwards native HTML attributes and
 * `aria-*` attributes from the `<lt-*>` custom element host onto its internal
 * shadow DOM control (`<input>`, `<textarea>`, `<button>`, `<a>`, `<img>`,
 * `<dialog>`, `<details>`, `<table>`, etc.).
 *
 * Only attributes that `NativeAttrsController` itself set on a given target
 * element are ever removed when removed from the host — attributes bound by
 * the component's own Lit `render()` template (`id`, `class`, `part`, `type`,
 * `aria-invalid`, etc.) are never clobbered.
 */
export class NativeAttrsController implements ReactiveController {
  private _host: NativeAttrsHost;
  private _getTarget: () => Element | null | undefined;
  private _options: NativeAttrsOptions;
  private _exclude: Set<string>;
  private _ownedAttrs: Set<string> | null = null;
  private _forwardedByTarget = new WeakMap<Element, Set<string>>();
  private _observer: MutationObserver;

  constructor(host: NativeAttrsHost, getTarget: () => Element | null | undefined, options: NativeAttrsOptions = {}) {
    this._host = host;
    this._getTarget = getTarget;
    this._options = options;
    this._exclude = new Set(Array.from(options.exclude ?? [], (a) => a.toLowerCase()));
    this._observer = new MutationObserver((records) => {
      // Request a Lit update so any host getter reading `getAttribute(...)` / `hasAttribute(...)`
      // (such as `placeholder`, `readonly`, `maxlength`, `target`, `rel`) re-renders, and sync
      // the inner target immediately if it already exists.
      const relevant = records.some((r) => r.attributeName && !this._isIgnoredHostAttr(r.attributeName.toLowerCase()));
      if (relevant) {
        this._sync();
        this._host.requestUpdate();
      }
    });
    this._patchAttributeMethods(host);
    host.addController(this);
  }

  private _patchAttributeMethods(host: NativeAttrsHost) {
    const origSet = host.setAttribute;
    const origRemove = host.removeAttribute;
    const origToggle = host.toggleAttribute;

    host.setAttribute = (qualifiedName: string, value: string) => {
      origSet.call(host, qualifiedName, value);
      if (host.isConnected && !this._isIgnoredHostAttr(qualifiedName.toLowerCase())) {
        this._sync();
        this._host.requestUpdate();
      }
    };

    host.removeAttribute = (qualifiedName: string) => {
      origRemove.call(host, qualifiedName);
      if (host.isConnected && !this._isIgnoredHostAttr(qualifiedName.toLowerCase())) {
        this._sync();
        this._host.requestUpdate();
      }
    };

    if (typeof origToggle === 'function') {
      host.toggleAttribute = (qualifiedName: string, force?: boolean) => {
        const result = origToggle.call(host, qualifiedName, force);
        if (host.isConnected && !this._isIgnoredHostAttr(qualifiedName.toLowerCase())) {
          this._sync();
          this._host.requestUpdate();
        }
        return result;
      };
    }
  }

  private _getOwned(): Set<string> {
    if (!this._ownedAttrs) {
      this._ownedAttrs = getDeclaredPropertyAttributes(this._host);
    }
    return this._ownedAttrs;
  }

  private _isIgnoredHostAttr(attr: string): boolean {
    if (HOST_ONLY_ATTRIBUTES.has(attr)) return true;
    if (attr.startsWith('data-')) return true;
    if (this._getOwned().has(attr)) return true;
    return false;
  }

  hostConnected() {
    this._observer.observe(this._host, { attributes: true });
    this._host.requestUpdate();
  }

  hostDisconnected() {
    this._observer.disconnect();
  }

  hostUpdated() {
    this._sync();
  }

  private _sync() {
    const target = this._getTarget();
    if (!target) return;

    let forwarded = this._forwardedByTarget.get(target);
    if (!forwarded) {
      forwarded = new Set<string>();
      this._forwardedByTarget.set(target, forwarded);
    }

    const aliases = this._options.aliases;
    const filter = this._options.filter;
    const nextAttrs = new Map<string, string>();

    for (const rawAttr of this._host.getAttributeNames()) {
      const attr = rawAttr.toLowerCase();
      if (this._isIgnoredHostAttr(attr) || this._exclude.has(attr)) continue;
      const targetAttr = aliases?.[attr] ?? attr;
      if (filter && !filter(targetAttr, target)) continue;
      const value = this._host.getAttribute(rawAttr);
      if (value !== null) {
        // Canonical attribute name wins over a legacy alias if both are present
        if (!nextAttrs.has(targetAttr) || attr === targetAttr) {
          nextAttrs.set(targetAttr, value);
        }
      }
    }

    // Remove attributes previously forwarded onto this target that are no longer active
    for (const prevAttr of Array.from(forwarded)) {
      if (!nextAttrs.has(prevAttr)) {
        target.removeAttribute(prevAttr);
        forwarded.delete(prevAttr);
      }
    }

    // Apply current forwarded attributes
    for (const [targetAttr, value] of nextAttrs.entries()) {
      if (target.getAttribute(targetAttr) !== value) {
        target.setAttribute(targetAttr, value);
      }
      forwarded.add(targetAttr);
    }

    this._options.onSync?.(target);
  }
}
