import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Surface } from '../surface';
import '../surface';

describe('<lt-surface>', () => {
  let el: Surface;

  beforeEach(async () => {
    el = document.createElement('lt-surface') as Surface;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a surface container in shadow DOM', () => {
    const surface = el.shadowRoot!.querySelector('.surface');
    expect(surface).toBeTruthy();
  });

  it('has default elevation of 1', () => {
    expect(el.elevation).toBe('1');
    expect(el.getAttribute('elevation')).toBe('1');
  });

  it('has default appearance of filled', () => {
    expect(el.appearance).toBe('filled');
    expect(el.getAttribute('appearance')).toBe('filled');
  });

  it('can change elevation', async () => {
    el.elevation = '3';
    await el.updateComplete;
    expect(el.getAttribute('elevation')).toBe('3');
  });

  it('can change appearance', async () => {
    el.appearance = 'outlined';
    await el.updateComplete;
    expect(el.getAttribute('appearance')).toBe('outlined');
  });

  it('supports all elevation levels', async () => {
    const elevations = ['0', '1', '2', '3', '4', '5'] as const;

    for (const elevation of elevations) {
      el.elevation = elevation;
      await el.updateComplete;
      expect(el.getAttribute('elevation')).toBe(elevation);
    }
  });

  it.each(['filled', 'outlined'] as const)('reflects %s appearance to attribute', async (appearance) => {
    el.appearance = appearance;
    await el.updateComplete;
    expect(el.getAttribute('appearance')).toBe(appearance);
  });

  it('renders slotted content', async () => {
    el.textContent = 'Test content';
    await el.updateComplete;

    const slot = el.shadowRoot!.querySelector('slot')!;
    const assigned = slot.assignedNodes({ flatten: true });
    expect(assigned.map((n) => n.textContent).join('')).toContain('Test content');
  });

  it('applies correct CSS class', () => {
    const surface = el.shadowRoot!.querySelector('.surface');
    expect(surface).toBeTruthy();
  });

  describe('background override', () => {
    it('sets --lt-surface-bg (the property the stylesheet consumes) from a token name', async () => {
      el.background = '--lt-interactive-success-bg';
      await el.updateComplete;

      const surface = el.shadowRoot!.querySelector<HTMLElement>('.surface')!;
      expect(surface.style.getPropertyValue('--lt-surface-bg')).toBe('var(--lt-interactive-success-bg)');
    });

    it('sets --lt-surface-bg from a raw color value', async () => {
      el.background = '#1a1a2e';
      await el.updateComplete;

      const surface = el.shadowRoot!.querySelector<HTMLElement>('.surface')!;
      expect(surface.style.getPropertyValue('--lt-surface-bg')).toBe('#1a1a2e');
    });

    it('sets no inline background when the prop is empty', () => {
      const surface = el.shadowRoot!.querySelector<HTMLElement>('.surface')!;
      expect(surface.style.getPropertyValue('--lt-surface-bg')).toBe('');
    });
  });
});
