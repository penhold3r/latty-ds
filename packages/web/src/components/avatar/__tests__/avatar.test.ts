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

  afterEach(() => {
    el.remove();
  });

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

  describe('initials', () => {
    it.each([
      ['Ada Lovelace', 'AL'],
      ['  Ada   Lovelace  ', 'AL'],
      ['ada', 'A'],
      ['Ada Byron Lovelace', 'AB'],
      ['👩‍💻 Ana', '👩A']
    ])('derives %j → %j', async (name, initials) => {
      el.name = name;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.initials')!.textContent).toBe(initials);
    });

    it.each(['', '   ', '\n\t'])('falls back to the icon, without throwing, for the name %j', async (name) => {
      el.name = name;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.initials')).toBeNull();
      expect(el.shadowRoot!.querySelector('lt-icon')).toBeTruthy();
    });
  });

  describe('image errors', () => {
    it('shows the fallback after a failed load, then retries when src changes', async () => {
      el.src = 'broken.png';
      el.name = 'Ada Lovelace';
      await el.updateComplete;
      el.shadowRoot!.querySelector('img')!.dispatchEvent(new Event('error'));
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('img')).toBeNull();
      expect(el.shadowRoot!.querySelector('.initials')).toBeTruthy();

      el.src = 'good.png';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('img')).toBeTruthy();
    });
  });

  describe('accessible name', () => {
    it('is the alt text, or the name when there is no alt', async () => {
      el.name = 'Ada Lovelace';
      await el.updateComplete;
      const base = () => el.shadowRoot!.querySelector('[part="base"]')!;
      expect(base().getAttribute('role')).toBe('img');
      expect(base().getAttribute('aria-label')).toBe('Ada Lovelace');
      el.alt = 'Portrait of Ada';
      await el.updateComplete;
      expect(base().getAttribute('aria-label')).toBe('Portrait of Ada');
    });

    it('is decorative, not the literal "avatar", when there is neither alt nor a name', () => {
      const base = el.shadowRoot!.querySelector('[part="base"]')!;
      expect(base.getAttribute('role')).toBe('presentation');
      expect(base.hasAttribute('aria-label')).toBe(false);
    });
  });
});
