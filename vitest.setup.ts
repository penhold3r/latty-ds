/// <reference types="vitest-axe/extend-expect" />
import '@testing-library/jest-dom';
import { expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';
expect.extend(axeMatchers);

// Register all icons for tests — components no longer auto-register them
import { iconRegistry } from './packages/icons/src/registry/icon-registry';
import { lattyIcons } from './packages/icons/src/icons';
iconRegistry.registerIcons(lattyIcons);

// jsdom's ElementInternals is a partial stub — patch the form-association methods
// so tests don't blow up on components that use static formAssociated = true.
if (typeof ElementInternals !== 'undefined') {
  const p = ElementInternals.prototype as Record<string, unknown>;
  if (typeof p['setFormValue'] !== 'function') p['setFormValue'] = () => {};
  if (typeof p['setValidity'] !== 'function') p['setValidity'] = () => {};
  if (typeof p['checkValidity'] !== 'function') p['checkValidity'] = () => true;
  if (typeof p['reportValidity'] !== 'function') p['reportValidity'] = () => true;

  // jsdom doesn't implement the `.form` getter at all (always undefined) — real browsers resolve it to the
  // element referenced by the host's own `form="id"` attribute, or else the closest ancestor <form> (BTN-3
  // needs this: `this.closest('form')` can never see the `form="id"` case on its own). ElementInternals has no
  // public way back to its host element, so this wraps attachInternals() to remember the association.
  if (!Object.getOwnPropertyDescriptor(p, 'form')) {
    const hostFor = new WeakMap<ElementInternals, HTMLElement>();
    const originalAttachInternals = HTMLElement.prototype.attachInternals;
    HTMLElement.prototype.attachInternals = function (this: HTMLElement) {
      const internals = originalAttachInternals.call(this);
      hostFor.set(internals, this);
      return internals;
    };
    Object.defineProperty(p, 'form', {
      configurable: true,
      get(this: ElementInternals) {
        const host = hostFor.get(this);
        if (!host) return null;
        const formId = host.getAttribute('form');
        if (formId) {
          const root = host.getRootNode() as Document | ShadowRoot;
          const byId = 'getElementById' in root ? root.getElementById(formId) : null;
          if (byId instanceof HTMLFormElement) return byId;
        }
        return host.closest('form');
      }
    });
  }
}
