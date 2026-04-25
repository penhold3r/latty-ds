import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Chip } from '../chip';
import '../chip';

describe('<lt-chip>', () => {
  let el: Chip;

  beforeEach(async () => {
    el = document.createElement('lt-chip') as Chip;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => { el.remove(); });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('projects slot content', () => {
    el.textContent = 'Hello';
    expect(el.shadowRoot!.querySelector('slot')).toBeTruthy();
  });

  it('has default appearance of filled', () => {
    expect(el.appearance).toBe('filled');
    expect(el.getAttribute('appearance')).toBe('filled');
  });

  it('supports outlined appearance', async () => {
    el.appearance = 'outlined';
    await el.updateComplete;
    expect(el.getAttribute('appearance')).toBe('outlined');
  });

  it('has default variant of primary', () => {
    expect(el.variant).toBe('primary');
    expect(el.getAttribute('variant')).toBe('primary');
  });

  it('supports all variants', async () => {
    const variants = ['primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info'] as const;
    for (const variant of variants) {
      el.variant = variant;
      await el.updateComplete;
      expect(el.getAttribute('variant')).toBe(variant);
    }
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it('supports all sizes', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      el.size = size;
      await el.updateComplete;
      expect(el.getAttribute('size')).toBe(size);
    }
  });

  it('is not disabled by default', () => {
    expect(el.disabled).toBe(false);
    expect(el.hasAttribute('disabled')).toBe(false);
  });

  it('can be disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute('disabled')).toBe(true);
  });

  it('does not show delete button by default', () => {
    expect(el.shadowRoot!.querySelector('.delete')).toBeNull();
  });

  it('shows delete button when deletable', async () => {
    el.deletable = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.delete')).toBeTruthy();
  });

  it('dispatches lt-delete event when delete button clicked', async () => {
    el.deletable = true;
    await el.updateComplete;
    let fired = false;
    el.addEventListener('lt-delete', () => { fired = true; });
    el.shadowRoot!.querySelector<HTMLButtonElement>('.delete')!.click();
    expect(fired).toBe(true);
  });

  it('dispatches lt-delete event via internal handler', () => {
    let fired = false;
    el.addEventListener('lt-delete', () => { fired = true; });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (el as any)._handleDelete();
    expect(fired).toBe(true);
  });
});
