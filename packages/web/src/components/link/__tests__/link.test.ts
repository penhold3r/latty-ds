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

  afterEach(() => {
    el.remove();
  });

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

describe('target', () => {
  let el: Link;

  beforeEach(async () => {
    el = document.createElement('lt-link') as Link;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('forwards an explicit target', async () => {
    el.setAttribute('target', '_parent');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('a')!.getAttribute('target')).toBe('_parent');
  });

  it('an explicit target wins over external', async () => {
    el.external = true;
    el.setAttribute('target', '_self');
    await el.updateComplete;
    const a = el.shadowRoot!.querySelector('a')!;
    expect(a.getAttribute('target')).toBe('_self');
    // Still shows the icon and the safe rel — external's own effects aren't suppressed, only the target value.
    expect(el.shadowRoot!.querySelector('lt-icon')).toBeTruthy();
  });

  it('does not default rel to noopener noreferrer for a non-_blank explicit target', async () => {
    el.setAttribute('target', '_parent');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('a')!.hasAttribute('rel')).toBe(false);
  });

  it('applies the safe rel default for an explicit target="_blank" too, not just external', async () => {
    el.setAttribute('target', '_blank');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('a')!.getAttribute('rel')).toBe('noopener noreferrer');
  });
});

describe('rel override', () => {
  let el: Link;

  beforeEach(async () => {
    el = document.createElement('lt-link') as Link;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('overrides the computed rel', async () => {
    el.external = true;
    el.setAttribute('rel', 'nofollow sponsor');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('a')!.getAttribute('rel')).toBe('nofollow sponsor');
  });

  it('an explicit empty-string rel suppresses the safe default entirely', async () => {
    el.external = true;
    el.setAttribute('rel', '');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('a')!.hasAttribute('rel')).toBe(false);
  });
});

describe('download and native anchor attributes', () => {
  let el: Link;

  beforeEach(async () => {
    el = document.createElement('lt-link') as Link;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('omits download by default', () => {
    expect(el.shadowRoot!.querySelector('a')!.hasAttribute('download')).toBe(false);
  });

  it('sets a boolean-style download with an empty value', async () => {
    el.setAttribute('download', '');
    await el.updateComplete;
    const a = el.shadowRoot!.querySelector('a')!;
    expect(a.hasAttribute('download')).toBe(true);
    expect(a.getAttribute('download')).toBe('');
  });

  it('sets a suggested filename', async () => {
    el.setAttribute('download', 'report.pdf');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('a')!.getAttribute('download')).toBe('report.pdf');
  });

  it('forwards arbitrary native anchor attributes (hreflang, referrerpolicy, ping)', async () => {
    el.setAttribute('hreflang', 'es');
    el.setAttribute('referrerpolicy', 'origin');
    el.setAttribute('ping', 'https://example.com/track');
    await el.updateComplete;
    const a = el.shadowRoot!.querySelector('a')!;
    expect(a.getAttribute('hreflang')).toBe('es');
    expect(a.getAttribute('referrerpolicy')).toBe('origin');
    expect(a.getAttribute('ping')).toBe('https://example.com/track');
  });
});

describe('underline', () => {
  let el: Link;

  beforeEach(async () => {
    el = document.createElement('lt-link') as Link;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('defaults to hover', () => {
    expect(el.underline).toBe('hover');
    expect(el.getAttribute('underline')).toBe('hover');
  });

  it.each(['always', 'hover', 'none'] as const)('reflects %s to attribute', async (underline) => {
    el.underline = underline;
    await el.updateComplete;
    expect(el.getAttribute('underline')).toBe(underline);
  });
});
