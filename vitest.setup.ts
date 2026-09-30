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

// jsdom (27.4, checked) implements none of HTMLDialogElement's own API — no showModal/show/close, no `inert`
// (confirmed via the native-dialog investigation, _agent-plans/COMPONENT-AUDIT.md §6.1). The behaviors jsdom
// genuinely can't model (focus trap, page-behind inert, top-layer stacking, real Escape-driven close) are
// verified in Chromium instead (the investigation's own spike already did, for the general pattern); this stub
// only needs to make `open` respond correctly and `close()` fire a real `close` event, so lt-dialog's own logic
// (which listens for that event to sync back) is exercised faithfully in jsdom tests.
if (typeof HTMLDialogElement !== 'undefined' && typeof HTMLDialogElement.prototype.showModal !== 'function') {
  const d = HTMLDialogElement.prototype as unknown as {
    showModal: () => void;
    show: () => void;
    close: (returnValue?: string) => void;
    returnValue: string;
  };
  d.returnValue = '';
  d.showModal = function (this: HTMLDialogElement) {
    if (this.open)
      throw new DOMException(
        "Failed to execute 'showModal': the element already has an 'open' attribute",
        'InvalidStateError'
      );
    this.open = true;
  };
  d.show = function (this: HTMLDialogElement) {
    this.open = true;
  };
  d.close = function (this: HTMLDialogElement & { returnValue: string }, returnValue?: string) {
    if (returnValue !== undefined) this.returnValue = returnValue;
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
}

// jsdom (27.4, checked) implements none of the Popover API — no showPopover/hidePopover/togglePopover on
// HTMLElement, and `:popover-open` never matches. lt-snackbar (§6.1's companion migration to the dialog work)
// uses the host itself as a "manual" popover so it renders in the top layer, above an open <dialog>, no matter
// what z-index says. This stub tracks open state per-element and patches Element.prototype.matches so
// `this.matches(':popover-open')` — the guard lt-snackbar's own code uses — behaves correctly in jsdom tests
// too, instead of diverging between the test and production code paths.
//
// Unlike showModal()/close() on <dialog> (which DO throw on redundant calls, confirmed in §6.1's spike),
// showPopover()/hidePopover() on a redundant call are silent no-ops in real Chrome — confirmed empirically
// (a manual popover tolerates a second showPopover() or an initial hidePopover() with no exception). This stub
// is intentionally lenient the same way, including for an element with no `popover` attribute at all (real
// browsers throw NotSupportedError there; several existing floating.ts call sites rely on a no-op instead,
// and none of this codebase's real consumers call these methods on a non-popover element anyway).
if (typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover !== 'function') {
  const openPopovers = new WeakSet<Element>();
  const h = HTMLElement.prototype as unknown as {
    showPopover: () => void;
    hidePopover: () => void;
    togglePopover: (force?: boolean) => boolean;
  };
  h.showPopover = function (this: HTMLElement) {
    openPopovers.add(this);
  };
  h.hidePopover = function (this: HTMLElement) {
    openPopovers.delete(this);
  };
  h.togglePopover = function (this: HTMLElement, force?: boolean) {
    const shouldShow = force ?? !openPopovers.has(this);
    if (shouldShow) openPopovers.add(this);
    else openPopovers.delete(this);
    return shouldShow;
  };

  const originalMatches = Element.prototype.matches;
  Element.prototype.matches = function (this: Element, selector: string) {
    if (selector === ':popover-open') return openPopovers.has(this);
    return originalMatches.call(this, selector);
  };
}
