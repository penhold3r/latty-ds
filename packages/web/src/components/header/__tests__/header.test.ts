import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Header } from '../header';
import '../header';

describe('<lt-header>', () => {
  let el: Header;

  beforeEach(async () => {
    el = document.createElement('lt-header') as Header;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('projects slot content', () => {
    el.textContent = 'Hello';
    expect(el.shadowRoot!.querySelector('slot')).toBeTruthy();
  });

  it('has default background of primary', () => {
    expect(el.background).toBe('primary');
    expect(el.getAttribute('background')).toBe('primary');
  });

  it.each(['primary', 'surface'] as const)('reflects %s background to attribute', async (background) => {
    el.background = background;
    await el.updateComplete;
    expect(el.getAttribute('background')).toBe(background);
  });
});
