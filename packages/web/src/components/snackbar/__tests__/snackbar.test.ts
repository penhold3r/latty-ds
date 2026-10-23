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

  describe('pause on hover/focus (SNK-3)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('pauses the countdown while hovered and resumes with the remaining time on leave', async () => {
      el.duration = 1000;
      el.show();
      await el.updateComplete;

      vi.advanceTimersByTime(400);
      el.dispatchEvent(new Event('pointerenter'));
      vi.advanceTimersByTime(1000); // well past the original 1000ms duration — paused, so no dismissal yet
      await el.updateComplete;
      expect(el.open).toBe(true);

      el.dispatchEvent(new Event('pointerleave'));
      vi.advanceTimersByTime(599); // 1000 - 400 - 1 = 599ms remaining; not quite there yet
      await el.updateComplete;
      expect(el.open).toBe(true);

      vi.advanceTimersByTime(1);
      await el.updateComplete;
      expect(el.open).toBe(false);
    });

    it('pauses on focus the same way as hover', async () => {
      el.duration = 1000;
      el.show();
      await el.updateComplete;

      vi.advanceTimersByTime(500);
      el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      vi.advanceTimersByTime(1000);
      await el.updateComplete;
      expect(el.open).toBe(true);

      el.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
      vi.advanceTimersByTime(500);
      await el.updateComplete;
      expect(el.open).toBe(false);
    });

    it('stays paused until both hover and focus have ended', async () => {
      el.duration = 1000;
      el.show();
      await el.updateComplete;

      el.dispatchEvent(new Event('pointerenter'));
      el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      el.dispatchEvent(new Event('pointerleave'));
      vi.advanceTimersByTime(2000);
      await el.updateComplete;
      expect(el.open).toBe(true); // still focused

      el.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
      vi.advanceTimersByTime(1000);
      await el.updateComplete;
      expect(el.open).toBe(false);
    });

    it('stays open on focusout when focus moves to another element inside the snackbar', async () => {
      el.actionLabel = 'Undo';
      await el.updateComplete;
      const actionBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('.action')!;

      el.duration = 1000;
      el.show();
      await el.updateComplete;
      el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      el.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: actionBtn }));
      vi.advanceTimersByTime(2000);
      await el.updateComplete;
      expect(el.open).toBe(true);
    });

    it('has no pause effect when duration=0 (auto-dismiss already disabled)', async () => {
      el.duration = 0;
      el.show();
      await el.updateComplete;
      el.dispatchEvent(new Event('pointerenter'));
      el.dispatchEvent(new Event('pointerleave'));
      vi.advanceTimersByTime(10000);
      await el.updateComplete;
      expect(el.open).toBe(true);
    });

    it('does not schedule a stray timer from a pointerleave that outlives a manual hide()', async () => {
      el.duration = 1000;
      el.show();
      await el.updateComplete;
      el.dispatchEvent(new Event('pointerenter'));
      el.hide();
      await el.updateComplete;

      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
      /*
       * The close transition can leave the pointer appearing to "leave" an already-closed snackbar — this must
       * not schedule a hide() timer that nothing will ever clear (open won't change again to trigger cleanup).
       */
      el.dispatchEvent(new Event('pointerleave'));
      expect(setTimeoutSpy).not.toHaveBeenCalled();
    });

    it('starts already paused if shown while the pointer is already hovering it', async () => {
      el.duration = 1000;
      el.dispatchEvent(new Event('pointerenter'));
      el.show();
      await el.updateComplete;

      vi.advanceTimersByTime(1000);
      await el.updateComplete;
      expect(el.open).toBe(true); // never started, since it opened already-hovered

      el.dispatchEvent(new Event('pointerleave'));
      vi.advanceTimersByTime(1000);
      await el.updateComplete;
      expect(el.open).toBe(false);
    });

    it('does not restart an already-paused timer on a redundant pointerenter', async () => {
      el.duration = 1000;
      el.show();
      await el.updateComplete;
      vi.advanceTimersByTime(100); // 900ms remaining at the pause below
      el.dispatchEvent(new Event('pointerenter'));
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

      /*
       * Real time passes before the redundant pointerenter — if it re-ran the pause logic (clearTimeout on
       * nothing + decrementing _remainingMs a second time using a stale _timerStartedAt), the eventual resume
       * below would fire too early.
       */
      vi.advanceTimersByTime(300);
      el.dispatchEvent(new Event('pointerenter'));
      expect(setTimeoutSpy).not.toHaveBeenCalled(); // no new timer scheduled — nothing restarted

      el.dispatchEvent(new Event('pointerleave'));
      vi.advanceTimersByTime(899); // the original 900ms remaining, minus 1
      await el.updateComplete;
      expect(el.open).toBe(true);

      vi.advanceTimersByTime(1);
      await el.updateComplete;
      expect(el.open).toBe(false);
    });

    it('does not reschedule an already-running timer on a redundant pointerleave', async () => {
      el.duration = 1000;
      el.show();
      await el.updateComplete;
      vi.advanceTimersByTime(300); // 700ms remaining once paused below
      el.dispatchEvent(new Event('pointerenter'));
      el.dispatchEvent(new Event('pointerleave')); // resumes with 700ms remaining
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

      /*
       * A second, redundant pointerleave (e.g. a stray duplicate) must not reschedule the already-running
       * timer — doing so would leak the original one (never cleared) and could fire the second with slightly
       * skewed timing.
       */
      el.dispatchEvent(new Event('pointerleave'));
      expect(setTimeoutSpy).not.toHaveBeenCalled();

      vi.advanceTimersByTime(699);
      await el.updateComplete;
      expect(el.open).toBe(true);

      vi.advanceTimersByTime(1);
      await el.updateComplete;
      expect(el.open).toBe(false);
    });

    it('resets hover/focus state on disconnect', async () => {
      el.duration = 1000;
      el.show();
      await el.updateComplete;
      el.dispatchEvent(new Event('pointerenter'));
      el.remove();

      /*
       * If hover state leaked across a disconnect, a later show() on a fresh connection would start paused
       * (per the "starts already paused if shown while hovering" behavior above) even though the pointer was
       * never actually over the reconnected element.
       */
      document.body.appendChild(el);
      el.hide();
      await el.updateComplete;
      el.show();
      await el.updateComplete;
      vi.advanceTimersByTime(1000);
      await el.updateComplete;
      expect(el.open).toBe(false);
    });
  });

  /*
   * §6.1's companion migration: lt-snackbar renders as a "manual" popover on its own host so it stays above an
   * open lt-dialog/lt-sidepanel regardless of z-index (top-layer content always wins). jsdom has no real Popover
   * API (vitest.setup.ts stubs it), so these verify the component calls the right methods at the right times,
   * not the actual top-layer rendering itself (that's a live-Chromium concern).
   */
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

  describe('labels (i18n, X5)', () => {
    it('defaults the close button label to English', () => {
      const btn = el.shadowRoot!.querySelector('.close');
      expect(btn?.getAttribute('aria-label')).toBe('Dismiss');
    });

    it('overrides the close button label via labels', async () => {
      el.labels = { dismiss: 'Fermer' };
      await el.updateComplete;
      const btn = el.shadowRoot!.querySelector('.close');
      expect(btn?.getAttribute('aria-label')).toBe('Fermer');
    });
  });
});
