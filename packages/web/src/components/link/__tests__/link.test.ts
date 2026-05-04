import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Link } from '../link';
import '../link';

describe('<lt-link>', () => {
  let el: Link;

  beforeEach(async () => {
    el = document.createElement('lt-link') as Link;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => { el.remove(); });

  it('renders a shadow root', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renders an <a> element', () => {
    expect(el.shadowRoot!.querySelector('a')).toBeTruthy();
  });

  it('forwards href to the anchor', async () => {
    el.href = 'https://example.com';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('a')?.getAttribute('href')).toBe('https://example.com');
  });

  it('omits href when empty', async () => {
    el.href = '';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('a')?.hasAttribute('href')).toBe(false);
  });

  it('adds target and rel when external', async () => {
    el.external = true;
    await el.updateComplete;
    const a = el.shadowRoot!.querySelector('a')!;
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('omits target and rel by default', async () => {
    const a = el.shadowRoot!.querySelector('a')!;
    expect(a.hasAttribute('target')).toBe(false);
    expect(a.hasAttribute('rel')).toBe(false);
  });

  it('shows the external icon when external is set', async () => {
    el.external = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('lt-icon')).toBeTruthy();
  });

  it('hides the external icon by default', async () => {
    expect(el.shadowRoot!.querySelector('lt-icon')).toBeNull();
  });

  it('projects slot content', () => {
    el.textContent = 'Visit site';
    expect(el.shadowRoot!.querySelector('slot')).toBeTruthy();
  });
});
