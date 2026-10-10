import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Badge } from '../badge';
import '../badge';

describe('<lt-badge>', () => {
  let el: Badge;

  beforeEach(async () => {
    el = document.createElement('lt-badge') as Badge;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renders content attribute as text', async () => {
    el.content = 'Active';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('span[part="base"]')!.textContent!.trim()).toBe('Active');
    expect(el.getAttribute('content')).toBe('Active');
  });

  it('has no content by default (circle mode)', () => {
    expect(el.content).toBe('');
    expect(el.getAttribute('content')).toBe('');
  });

  it('has default variant of primary', () => {
    expect(el.variant).toBe('primary');
    expect(el.getAttribute('variant')).toBe('primary');
  });

  it.each(['primary', 'secondary', 'success', 'warning', 'error', 'neutral'] as const)(
    'reflects %s variant to attribute',
    async (variant) => {
      el.variant = variant;
      await el.updateComplete;
      expect(el.getAttribute('variant')).toBe(variant);
    }
  );

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it.each(['sm', 'md', 'lg'] as const)('reflects %s size to attribute', async (size) => {
    el.size = size;
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe(size);
  });
});

describe('max (count overflow)', () => {
  let el: Badge;

  const base = () => el.shadowRoot!.querySelector('span[part="base"]')!;

  beforeEach(async () => {
    el = document.createElement('lt-badge') as Badge;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('caps a numeric content above max as "${max}+"', async () => {
    el.content = '150';
    el.max = 99;
    await el.updateComplete;
    expect(base().textContent!.trim()).toBe('99+');
  });

  it('leaves content unchanged at exactly max', async () => {
    el.content = '99';
    el.max = 99;
    await el.updateComplete;
    expect(base().textContent!.trim()).toBe('99');
  });

  it('leaves content unchanged below max', async () => {
    el.content = '42';
    el.max = 99;
    await el.updateComplete;
    expect(base().textContent!.trim()).toBe('42');
  });

  it('ignores max when content is not a plain non-negative integer', async () => {
    el.content = 'New';
    el.max = 99;
    await el.updateComplete;
    expect(base().textContent!.trim()).toBe('New');
  });

  it('ignores max for a negative numeric string', async () => {
    el.content = '-5';
    el.max = 99;
    await el.updateComplete;
    expect(base().textContent!.trim()).toBe('-5');
  });

  it('ignores max for a fractional numeric string, even one that would exceed it', async () => {
    el.content = '150.5';
    el.max = 99;
    await el.updateComplete;
    expect(base().textContent!.trim()).toBe('150.5');
  });

  it('does not truncate when max is unset', async () => {
    el.content = '150';
    await el.updateComplete;
    expect(base().textContent!.trim()).toBe('150');
  });
});

describe('slot content', () => {
  let el: Badge;

  const base = () => el.shadowRoot!.querySelector('span[part="base"]')!;

  afterEach(() => {
    el.remove();
  });

  it('renders slotted content in place of the content attribute', async () => {
    el = document.createElement('lt-badge') as Badge;
    el.innerHTML = '<strong>5 new</strong>';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.querySelector('strong')).toBeTruthy();
    const slot = base().querySelector('slot')!;
    expect(slot.assignedElements({ flatten: true })[0]?.tagName).toBe('STRONG');
    expect(base().classList.contains('empty')).toBe(false);
  });

  it('falls back to the content attribute when nothing is slotted', async () => {
    el = document.createElement('lt-badge') as Badge;
    el.content = 'Active';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(base().textContent!.trim()).toBe('Active');
  });

  it('does not collapse into circle mode when only slotted content is present', async () => {
    el = document.createElement('lt-badge') as Badge;
    el.innerHTML = 'Online';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(base().classList.contains('empty')).toBe(false);
  });

  it('is in circle mode when neither content nor a slot is set', async () => {
    el = document.createElement('lt-badge') as Badge;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(base().classList.contains('empty')).toBe(true);
  });

  it('picks up slotted content added after construction (slotchange)', async () => {
    el = document.createElement('lt-badge') as Badge;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(base().classList.contains('empty')).toBe(true);

    el.textContent = 'Added later';
    el.shadowRoot!.querySelector('slot')!.dispatchEvent(new Event('slotchange'));
    await el.updateComplete;
    expect(base().classList.contains('empty')).toBe(false);
  });
});
