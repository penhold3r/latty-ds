import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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

  it.each(['top', 'bottom', 'left', 'right'] as const)('reflects %s placement to attribute', async (placement) => {
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
});
