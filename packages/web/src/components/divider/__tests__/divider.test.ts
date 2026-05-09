import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Divider } from '../divider';
import '../divider';

describe('<lt-divider>', () => {
  let el: Divider;

  beforeEach(async () => {
    el = document.createElement('lt-divider') as Divider;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => { el.remove(); });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('defaults to horizontal orientation', () => {
    expect(el.orientation).toBe('horizontal');
    expect(el.getAttribute('orientation')).toBe('horizontal');
  });

  it('defaults to solid appearance', () => {
    expect(el.appearance).toBe('solid');
    expect(el.getAttribute('appearance')).toBe('solid');
  });

  it('renders label when provided', async () => {
    el.label = 'or';
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector('[part="label"]');
    expect(label?.textContent).toBe('or');
  });

  it('does not render label span when label is empty', () => {
    const label = el.shadowRoot!.querySelector('[part="label"]');
    expect(label).toBeNull();
  });

  it('supports all orientations', async () => {
    const orientations = ['horizontal', 'vertical'] as const;
    for (const o of orientations) {
      el.orientation = o;
      await el.updateComplete;
      expect(el.getAttribute('orientation')).toBe(o);
    }
  });

  it.each(['solid', 'dashed', 'dotted'] as const)('reflects %s appearance to attribute', async (appearance) => {
    el.appearance = appearance;
    await el.updateComplete;
    expect(el.getAttribute('appearance')).toBe(appearance);
  });
});
