import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Tooltip } from '../tooltip';
import '../tooltip';

describe('<lt-tooltip>', () => {
  let el: Tooltip;

  beforeEach(async () => {
    el = document.createElement('lt-tooltip') as Tooltip;
    el.content = 'Hello';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renders tooltip text', () => {
    const tooltip = el.shadowRoot!.querySelector('[role="tooltip"]')!;
    expect(tooltip.textContent!.trim()).toContain('Hello');
  });

  it('reflects content attribute', async () => {
    el.content = 'Updated';
    await el.updateComplete;
    expect(el.getAttribute('content')).toBe('Updated');
  });

  it('has default placement of top', () => {
    expect(el.placement).toBe('top');
    expect(el.getAttribute('placement')).toBe('top');
  });

  it.each(['top', 'bottom', 'start', 'end'] as const)('reflects %s placement to attribute', async (placement) => {
    el.placement = placement;
    await el.updateComplete;
    expect(el.getAttribute('placement')).toBe(placement);
  });

  it('disabled is false by default', () => {
    expect(el.disabled).toBe(false);
    expect(el.hasAttribute('disabled')).toBe(false);
  });

  it('reflects disabled attribute', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute('disabled')).toBe(true);
  });

  describe('describing the trigger (TTP-1)', () => {
    let wrapper: Tooltip;
    let btn: HTMLButtonElement;

    beforeEach(async () => {
      wrapper = document.createElement('lt-tooltip') as Tooltip;
      wrapper.content = 'Tip';
      btn = document.createElement('button');
      btn.textContent = 'Trigger';
      wrapper.appendChild(btn);
      document.body.appendChild(wrapper);
      await wrapper.updateComplete;
    });

    afterEach(() => {
      wrapper.remove();
    });

    it('sets aria-description on the trigger with the tooltip text', () => {
      // Not aria-describedby: its id lookup can't cross from the trigger (light DOM) into the tooltip bubble
      // (this element's own shadow root), so no AT ever actually resolves it — verified: it announces nothing.
      expect(btn.getAttribute('aria-description')).toBe('Tip');
      expect(btn.hasAttribute('aria-describedby')).toBe(false);
    });

    it('keeps the trigger in sync when content changes later', async () => {
      wrapper.content = 'Updated tip';
      await wrapper.updateComplete;
      expect(btn.getAttribute('aria-description')).toBe('Updated tip');
    });
  });

  describe('showing and hiding (popover)', () => {
    let wrap: Tooltip;
    let btn: HTMLButtonElement;

    const bubble = () => wrap.shadowRoot!.querySelector<HTMLElement>('.tooltip')!;

    beforeEach(async () => {
      wrap = document.createElement('lt-tooltip') as Tooltip;
      wrap.content = 'Tip';
      btn = document.createElement('button');
      wrap.appendChild(btn);
      document.body.appendChild(wrap);
      await wrap.updateComplete;
    });

    afterEach(() => {
      wrap.remove();
    });

    it('is a manual popover so it renders in the top layer', () => {
      expect(bubble().getAttribute('popover')).toBe('manual');
    });

    it('opens on pointerenter and closes on pointerleave', async () => {
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(true);

      wrap.dispatchEvent(new Event('pointerleave'));
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(false);
    });

    it('opens on focusin and closes when focus leaves the tooltip entirely', async () => {
      wrap.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(true);

      wrap.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(false);
    });

    it('stays open on focusout when focus moves to another element inside the tooltip', async () => {
      wrap.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      wrap.dispatchEvent(new Event('pointerenter'));
      wrap.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: btn }));
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(true);
    });

    it('stays open after pointerleave while still focused, closing only once both have ended', async () => {
      wrap.dispatchEvent(new Event('pointerenter'));
      wrap.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      wrap.dispatchEvent(new Event('pointerleave'));
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(true);

      wrap.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(false);
    });

    it('never opens while disabled', async () => {
      wrap.disabled = true;
      await wrap.updateComplete;
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(false);
    });

    it('never opens with empty content', async () => {
      wrap.content = '';
      await wrap.updateComplete;
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(false);
    });

    it('closes an open tooltip when it becomes disabled', async () => {
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      wrap.disabled = true;
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(false);
    });
  });

  describe('delay', () => {
    let wrap: Tooltip;
    let btn: HTMLButtonElement;

    const bubble = () => wrap.shadowRoot!.querySelector<HTMLElement>('.tooltip')!;

    beforeEach(async () => {
      vi.useFakeTimers();
      wrap = document.createElement('lt-tooltip') as Tooltip;
      wrap.content = 'Tip';
      btn = document.createElement('button');
      wrap.appendChild(btn);
      document.body.appendChild(wrap);
      await wrap.updateComplete;
    });

    afterEach(() => {
      wrap.remove();
      vi.useRealTimers();
    });

    it('defaults to 0 (shows immediately, unchanged prior behavior)', async () => {
      expect(wrap.delay).toBe(0);
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(true);
    });

    it('waits the configured delay before showing', async () => {
      wrap.delay = 500;
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(false);

      vi.advanceTimersByTime(499);
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(false);

      vi.advanceTimersByTime(1);
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(true);
    });

    it('never shows if the hover ends before the delay elapses', async () => {
      wrap.delay = 500;
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;

      vi.advanceTimersByTime(300);
      wrap.dispatchEvent(new Event('pointerleave'));
      await wrap.updateComplete;

      vi.advanceTimersByTime(500);
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(false);
    });

    it('does not restart the delay clock on a second sync while already waiting', async () => {
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
      wrap.delay = 500;
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      expect(setTimeoutSpy).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(300);
      // A second pointerenter-driven sync while already waiting (e.g. a stray duplicate event) must not
      // schedule a second timer — only one wait should ever be running at a time.
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      expect(setTimeoutSpy).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(200);
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(true);
    });

    it('hides immediately regardless of delay', async () => {
      wrap.delay = 500;
      wrap.dispatchEvent(new Event('pointerenter'));
      vi.advanceTimersByTime(500);
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(true);

      wrap.dispatchEvent(new Event('pointerleave'));
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(false);
    });

    it('shows without waiting again if content changes while already shown', async () => {
      wrap.delay = 500;
      wrap.dispatchEvent(new Event('pointerenter'));
      vi.advanceTimersByTime(500);
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(true);

      wrap.content = 'Updated tip';
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(true);
    });

    it('clears a pending delay on disconnect', async () => {
      wrap.delay = 500;
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      wrap.remove();

      // If the timer weren't cleared, this would throw trying to show a popover on a disconnected element.
      expect(() => vi.advanceTimersByTime(500)).not.toThrow();
    });
  });

  describe('hoverable', () => {
    let wrap: Tooltip;
    let btn: HTMLButtonElement;

    const bubble = () => wrap.shadowRoot!.querySelector<HTMLElement>('.tooltip')!;

    beforeEach(async () => {
      vi.useFakeTimers();
      wrap = document.createElement('lt-tooltip') as Tooltip;
      wrap.content = 'Tip';
      btn = document.createElement('button');
      wrap.appendChild(btn);
      document.body.appendChild(wrap);
      await wrap.updateComplete;
    });

    afterEach(() => {
      wrap.remove();
      vi.useRealTimers();
    });

    it('defaults to false', () => {
      expect(wrap.hoverable).toBe(false);
      expect(wrap.hasAttribute('hoverable')).toBe(false);
    });

    it('hides immediately on pointerleave when hoverable is false (unchanged prior behavior)', async () => {
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      wrap.dispatchEvent(new Event('pointerleave'));
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(false);
    });

    it('hovering the bubble has no effect when hoverable is false', async () => {
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      wrap.dispatchEvent(new Event('pointerleave'));
      bubble().dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(false);
    });

    it('does not hide immediately on pointerleave when hoverable is true — grants a grace period', async () => {
      wrap.hoverable = true;
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      wrap.dispatchEvent(new Event('pointerleave'));
      await wrap.updateComplete;
      // Still open immediately after leaving — the grace period hasn't elapsed yet.
      expect(bubble().matches(':popover-open')).toBe(true);
    });

    it('hides after the grace period if the bubble is never reached', async () => {
      wrap.hoverable = true;
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      wrap.dispatchEvent(new Event('pointerleave'));
      await wrap.updateComplete;

      vi.advanceTimersByTime(149);
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(true);

      vi.advanceTimersByTime(1);
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(false);
    });

    it('stays open if the bubble is hovered before the grace period elapses, even well past it', async () => {
      wrap.hoverable = true;
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      wrap.dispatchEvent(new Event('pointerleave'));
      await wrap.updateComplete;

      vi.advanceTimersByTime(100);
      bubble().dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;

      vi.advanceTimersByTime(1000);
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(true);
    });

    it('hides once the bubble is also left', async () => {
      wrap.hoverable = true;
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      wrap.dispatchEvent(new Event('pointerleave'));
      bubble().dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;

      bubble().dispatchEvent(new Event('pointerleave'));
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(true); // grace period just started

      vi.advanceTimersByTime(150);
      await wrap.updateComplete;
      expect(bubble().matches(':popover-open')).toBe(false);
    });

    it('does not schedule a second hide timer while one is already pending', async () => {
      wrap.hoverable = true;
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;

      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
      wrap.dispatchEvent(new Event('pointerleave'));
      await wrap.updateComplete;
      expect(setTimeoutSpy).toHaveBeenCalledTimes(1);

      // A redundant pointerleave-driven sync (e.g. a stray duplicate event) must not restart the grace period.
      wrap.dispatchEvent(new Event('pointerleave'));
      await wrap.updateComplete;
      expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    });

    it('clears a pending grace-period hide on disconnect', async () => {
      wrap.hoverable = true;
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
      wrap.dispatchEvent(new Event('pointerleave'));
      await wrap.updateComplete;
      wrap.remove();

      // If the timer weren't cleared, this would throw trying to hide a popover on a disconnected element.
      expect(() => vi.advanceTimersByTime(150)).not.toThrow();
    });
  });

  describe('placement', () => {
    let wrap: Tooltip;

    const bubble = () => wrap.shadowRoot!.querySelector<HTMLElement>('.tooltip')!;

    const rect = (left: number, top: number, width: number, height: number): DOMRect =>
      ({
        left,
        top,
        width,
        height,
        right: left + width,
        bottom: top + height,
        x: left,
        y: top,
        toJSON: () => ({})
      }) as DOMRect;

    beforeEach(async () => {
      wrap = document.createElement('lt-tooltip') as Tooltip;
      wrap.content = 'Tip';
      wrap.appendChild(document.createElement('button'));
      document.body.appendChild(wrap);
      await wrap.updateComplete;
      // Host at (200, 100) 100x40; bubble 60x20; offset defaults to 8px.
      vi.spyOn(wrap, 'getBoundingClientRect').mockReturnValue(rect(200, 100, 100, 40));
      vi.spyOn(bubble(), 'getBoundingClientRect').mockReturnValue(rect(0, 0, 60, 20));
    });

    afterEach(() => {
      wrap.remove();
      vi.restoreAllMocks();
    });

    const openAndPosition = async (placement: Tooltip['placement']) => {
      wrap.placement = placement;
      await wrap.updateComplete;
      wrap.dispatchEvent(new Event('pointerenter'));
      await wrap.updateComplete;
    };

    it('places top: centered horizontally, above the host with the offset', async () => {
      await openAndPosition('top');
      expect(bubble().style.left).toBe('220px'); // 200 + 50 - 30
      expect(bubble().style.top).toBe('72px'); // 100 - 8 - 20
    });

    it('places bottom: centered horizontally, below the host with the offset', async () => {
      await openAndPosition('bottom');
      expect(bubble().style.left).toBe('220px');
      expect(bubble().style.top).toBe('148px'); // 140 + 8
    });

    it('places start on the left side in LTR, vertically centered', async () => {
      await openAndPosition('start');
      expect(bubble().style.left).toBe('132px'); // 200 - 8 - 60
      expect(bubble().style.top).toBe('110px'); // 100 + 20 - 10
    });

    it('places end on the right side in LTR', async () => {
      await openAndPosition('end');
      expect(bubble().style.left).toBe('308px'); // 300 + 8
    });

    it('flips start and end in RTL', async () => {
      wrap.style.direction = 'rtl';
      await openAndPosition('start');
      expect(bubble().style.left).toBe('308px');

      await wrap.updateComplete;
      wrap.placement = 'end';
      await wrap.updateComplete;
      expect(bubble().style.left).toBe('132px');
    });
  });
});
