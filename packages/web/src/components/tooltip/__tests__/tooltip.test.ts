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

  afterEach(() => { el.remove(); });

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

  it('has default position of top', () => {
    expect(el.position).toBe('top');
    expect(el.getAttribute('position')).toBe('top');
  });

  it('supports all positions', async () => {
    const positions = ['top', 'bottom', 'left', 'right'] as const;
    for (const p of positions) {
      el.position = p;
      await el.updateComplete;
      expect(el.getAttribute('position')).toBe(p);
    }
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

  it('links trigger to tooltip via aria-describedby', async () => {
    const wrapper = document.createElement('lt-tooltip') as Tooltip;
    wrapper.content = 'Tip';
    const btn = document.createElement('button');
    btn.textContent = 'Trigger';
    wrapper.appendChild(btn);
    document.body.appendChild(wrapper);
    await wrapper.updateComplete;

    const tooltipId = wrapper.shadowRoot!.querySelector('[role="tooltip"]')!.id;
    expect(btn.getAttribute('aria-describedby')).toBe(tooltipId);
    wrapper.remove();
  });
});
