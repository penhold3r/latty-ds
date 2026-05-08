import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Image } from '../image';
import '../image';

describe('<lt-image>', () => {
  let el: Image;

  beforeEach(async () => {
    el = document.createElement('lt-image') as Image;
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
});
