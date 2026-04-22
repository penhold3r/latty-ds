import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Avatar } from '../avatar';
import '../avatar';

describe('<lt-avatar>', () => {
  let el: Avatar;

  beforeEach(async () => {
    el = document.createElement('lt-avatar') as Avatar;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => { el.remove(); });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it('supports all sizes', async () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    for (const size of sizes) {
      el.size = size;
      await el.updateComplete;
      expect(el.getAttribute('size')).toBe(size);
    }
  });

  it('has default shape of circle', () => {
    expect(el.shape).toBe('circle');
    expect(el.getAttribute('shape')).toBe('circle');
  });

  it('supports square shape', async () => {
    el.shape = 'square';
    await el.updateComplete;
    expect(el.getAttribute('shape')).toBe('square');
  });

  it('renders an image when src is set', async () => {
    el.src = 'https://example.com/avatar.jpg';
    el.name = 'Jane Doe';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('img')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.initials')).toBeNull();
  });

  it('renders initials when name is set and no src', async () => {
    el.name = 'Jane Doe';
    await el.updateComplete;
    const initials = el.shadowRoot!.querySelector('.initials');
    expect(initials).toBeTruthy();
    expect(initials!.textContent).toBe('JD');
  });

  it('renders single initial for single-word name', async () => {
    el.name = 'Jane';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.initials')!.textContent).toBe('J');
  });

  it('renders icon fallback when no src and no name', async () => {
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('lt-icon')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.initials')).toBeNull();
  });
});
