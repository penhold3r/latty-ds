import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Snackbar } from '../snackbar';
import '../snackbar';

describe('<lt-snackbar>', () => {
  let el: Snackbar;

  beforeEach(async () => {
    el = document.createElement('lt-snackbar') as Snackbar;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
    vi.restoreAllMocks();
  });

  it('renders shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('defaults: open=false, closable=true, duration=4000, variant=default', () => {
    expect(el.open).toBe(false);
    expect(el.closable).toBe(true);
    expect(el.duration).toBe(4000);
    expect(el.variant).toBe('default');
  });

  it('reflects variant attribute', async () => {
    el.variant = 'success';
    await el.updateComplete;
    expect(el.getAttribute('variant')).toBe('success');
  });

  it('has default elevation of 5 and appearance of filled, forwarded to the internal surface', () => {
    expect(el.elevation).toBe('5');
    expect(el.appearance).toBe('filled');
    const surface = el.shadowRoot!.querySelector('lt-surface');
    expect(surface?.getAttribute('elevation')).toBe('5');
    expect(surface?.getAttribute('appearance')).toBe('filled');
  });

  it('forwards elevation and appearance changes to the internal surface', async () => {
    el.elevation = '2';
    el.appearance = 'outlined';
    await el.updateComplete;
    const surface = el.shadowRoot!.querySelector('lt-surface');
    expect(surface?.getAttribute('elevation')).toBe('2');
    expect(surface?.getAttribute('appearance')).toBe('outlined');
  });

  describe('does not emit hide on mount (SNK-1)', () => {
    it('does not dispatch hide just from connecting — it was never shown', async () => {
      const handler = vi.fn();
      const fresh = document.createElement('lt-snackbar') as Snackbar;
      fresh.addEventListener('hide', handler);
      document.body.appendChild(fresh);
      await fresh.updateComplete;
      expect(handler).not.toHaveBeenCalled();
      fresh.remove();
    });

    it('still dispatches hide normally on a later, real hide()', async () => {
      const handler = vi.fn();
      el.addEventListener('hide', handler);
      el.show();
      await el.updateComplete;
      el.hide();
      await el.updateComplete;
      expect(handler).toHaveBeenCalledOnce();
    });

    it('does not dispatch show just from mounting already open (markup open="")', async () => {
      const handler = vi.fn();
      const fresh = document.createElement('lt-snackbar') as Snackbar;
      fresh.setAttribute('open', '');
      fresh.addEventListener('show', handler);
      document.body.appendChild(fresh);
      await fresh.updateComplete;
      expect(handler).not.toHaveBeenCalled();
      fresh.remove();
    });
  });

  it('show() sets open to true', async () => {
    el.show();
    await el.updateComplete;
    expect(el.open).toBe(true);
  });

  it('hide() sets open to false', async () => {
    el.show();
    await el.updateComplete;
    el.hide();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('dispatches lt-show event on show()', async () => {
    const handler = vi.fn();
    el.addEventListener('show', handler);
    el.show();
    await el.updateComplete;
    expect(handler).toHaveBeenCalledOnce();
  });

  it('dispatches lt-hide event on hide()', async () => {
    const handler = vi.fn();
    el.show();
    await el.updateComplete;
    el.addEventListener('hide', handler);
    el.hide();
    await el.updateComplete;
    expect(handler).toHaveBeenCalledOnce();
  });

  it('renders action button when action-label is set', async () => {
    el.setAttribute('action-label', 'Undo');
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector('.action');
    expect(btn).toBeTruthy();
    expect(btn!.textContent!.trim()).toBe('Undo');
  });

  it('dispatches lt-action and hides on action button click', async () => {
    const handler = vi.fn();
    el.addEventListener('action', handler);
    el.setAttribute('action-label', 'Undo');
    el.show();
    await el.updateComplete;
    (el.shadowRoot!.querySelector('.action') as HTMLElement).click();
    await el.updateComplete;
    expect(handler).toHaveBeenCalledOnce();
    expect(el.open).toBe(false);
  });

  it('renders close button by default', async () => {
    expect(el.shadowRoot!.querySelector('.close')).toBeTruthy();
  });

  it('hides close button when closable=false', async () => {
    el.closable = false;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.close')).toBeNull();
  });

  it('auto-dismisses after duration', async () => {
    vi.useFakeTimers();
    el.duration = 1000;
    el.show();
    await el.updateComplete;
    expect(el.open).toBe(true);
    vi.advanceTimersByTime(1000);
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('does not auto-dismiss when duration=0', async () => {
    vi.useFakeTimers();
    el.duration = 0;
    el.show();
    await el.updateComplete;
    vi.advanceTimersByTime(10000);
    await el.updateComplete;
    expect(el.open).toBe(true);
  });

  // §6.1's companion migration: lt-snackbar renders as a "manual" popover on its own host so it stays above an
  // open lt-dialog/lt-sidepanel regardless of z-index (top-layer content always wins). jsdom has no real Popover
  // API (vitest.setup.ts stubs it), so these verify the component calls the right methods at the right times,
  // not the actual top-layer rendering itself (that's a live-Chromium concern).
  describe('popover (SNK-companion to §6.1)', () => {
    it('is a manual popover', () => {
      expect(el.getAttribute('popover')).toBe('manual');
    });

    it('calls showPopover() on show() and hidePopover() on hide()', async () => {
      const showSpy = vi.spyOn(el, 'showPopover');
      const hideSpy = vi.spyOn(el, 'hidePopover');
      el.show();
      await el.updateComplete;
      expect(showSpy).toHaveBeenCalledOnce();
      expect(hideSpy).not.toHaveBeenCalled();

      el.hide();
      await el.updateComplete;
      expect(hideSpy).toHaveBeenCalledOnce();
    });

    it('calls showPopover() even when mounted already open (skip guard covers only timer/event side effects)', async () => {
      const fresh = document.createElement('lt-snackbar') as Snackbar;
      fresh.setAttribute('open', '');
      document.body.appendChild(fresh);
      // Lit's first update is deferred to a microtask, so the spy attaches before it runs.
      const showSpy = vi.spyOn(fresh, 'showPopover');
      await fresh.updateComplete;
      expect(showSpy).toHaveBeenCalledOnce();
      expect(fresh.matches(':popover-open')).toBe(true);
      fresh.remove();
    });

    it('stays open and keeps :popover-open matching through a later unrelated property change', async () => {
      el.show();
      await el.updateComplete;
      el.duration = 5000;
      await el.updateComplete;
      expect(el.open).toBe(true);
      expect(el.matches(':popover-open')).toBe(true);
    });
  });
});
