import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { axe } from 'vitest-axe';
import type { Alert } from '../alert';
import '../alert';

describe('<lt-alert>', () => {
  let el: Alert;

  beforeEach(async () => {
    el = document.createElement('lt-alert') as Alert;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
    vi.restoreAllMocks();
  });

  it('renders shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('defaults: variant=default, appearance=filled, icon="", closable=false, heading="", open=true', () => {
    expect(el.variant).toBe('default');
    expect(el.appearance).toBe('filled');
    expect(el.icon).toBe('');
    expect(el.closable).toBe(false);
    expect(el.heading).toBe('');
    expect(el.open).toBe(true);
  });

  it.each([
    ['default', 'status'],
    ['success', 'status'],
    ['info', 'status'],
    ['warning', 'alert'],
    ['error', 'alert']
  ] as const)('uses role=%s -> %s so error/warning interrupt and the rest announce politely', async (variant, role) => {
    el.variant = variant;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.inner')!.getAttribute('role')).toBe(role);
  });

  it('defaults: appearance=filled', () => {
    expect(el.appearance).toBe('filled');
    expect(el.getAttribute('appearance')).toBe('filled');
  });

  it.each(['filled', 'outlined', 'solid'] as const)('reflects %s appearance to attribute', async (appearance) => {
    el.appearance = appearance;
    await el.updateComplete;
    expect(el.getAttribute('appearance')).toBe(appearance);
  });

  it.each(['default', 'success', 'warning', 'error', 'info'] as const)(
    'reflects %s variant to attribute',
    async (variant) => {
      el.variant = variant;
      await el.updateComplete;
      expect(el.getAttribute('variant')).toBe(variant);
    }
  );

  it('renders slot for body content', () => {
    expect(el.shadowRoot!.querySelector('slot')).toBeTruthy();
  });

  it('does not render icon by default', async () => {
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.icon')).toBeNull();
  });

  it('renders icon automatically for status variants', async () => {
    el.variant = 'success';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.icon')).toBeTruthy();
  });

  it('suppresses icon when icon="none"', async () => {
    el.variant = 'success';
    el.icon = 'none';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.icon')).toBeNull();
  });

  it('uses custom icon when icon is set', async () => {
    el.icon = 'check';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.icon')).toBeTruthy();
  });

  it('does not render heading when heading is empty', async () => {
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.title')).toBeNull();
  });

  it('renders heading when heading is set', async () => {
    el.heading = 'Heads up';
    await el.updateComplete;
    const title = el.shadowRoot!.querySelector('.title');
    expect(title).toBeTruthy();
    expect(title!.textContent).toBe('Heads up');
  });

  it('does not render close button by default', async () => {
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.close')).toBeNull();
  });

  it('renders close button when closable is true', async () => {
    el.closable = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.close')).toBeTruthy();
  });

  it('dispatches lt-close when close button is clicked', async () => {
    vi.useFakeTimers();
    el.closable = true;
    await el.updateComplete;
    const handler = vi.fn();
    el.addEventListener('close', handler);
    (el.shadowRoot!.querySelector('.close') as HTMLElement).click();
    expect(handler).toHaveBeenCalledOnce();
  });

  it('hides via `open` after close with animation delay, without removing itself from the DOM', async () => {
    vi.useFakeTimers();
    el.closable = true;
    await el.updateComplete;
    (el.shadowRoot!.querySelector('.close') as HTMLElement).click();
    expect(el.open).toBe(true);
    vi.advanceTimersByTime(200);
    expect(el.open).toBe(false);
    expect(document.body.contains(el)).toBe(true);
  });

  it('does not hide when lt-close is cancelled via preventDefault', async () => {
    vi.useFakeTimers();
    el.closable = true;
    await el.updateComplete;
    el.addEventListener('close', (e) => e.preventDefault());
    (el.shadowRoot!.querySelector('.close') as HTMLElement).click();
    vi.advanceTimersByTime(200);
    expect(el.open).toBe(true);
  });

  it('moves focus to the host when dismissed, instead of losing it to <body>', async () => {
    vi.useFakeTimers();
    el.closable = true;
    await el.updateComplete;
    (el.shadowRoot!.querySelector('.close') as HTMLElement).click();
    expect(document.activeElement).toBe(el);
  });

  it('clears the exit animation when reopened', async () => {
    vi.useFakeTimers();
    el.closable = true;
    await el.updateComplete;
    (el.shadowRoot!.querySelector('.close') as HTMLElement).click();
    vi.advanceTimersByTime(200);
    el.open = true;
    await el.updateComplete;
    expect(el.hasAttribute('dismissed')).toBe(false);
  });

  it('has no axe violations', async () => {
    vi.useRealTimers();
    expect(await axe(el)).toHaveNoViolations();
  });

  it('sets [dismissed] attribute during exit animation', async () => {
    vi.useFakeTimers();
    el.closable = true;
    await el.updateComplete;
    (el.shadowRoot!.querySelector('.close') as HTMLElement).click();
    expect(el.hasAttribute('dismissed')).toBe(true);
  });

  describe('heading, and the deprecated title alias (ALR-3)', () => {
    it('setting heading directly works, and reflects as an attribute', async () => {
      const fresh = document.createElement('lt-alert') as Alert;
      fresh.heading = 'Upload complete';
      document.body.appendChild(fresh);
      await fresh.updateComplete;
      expect(fresh.heading).toBe('Upload complete');
      expect(fresh.getAttribute('heading')).toBe('Upload complete');
      fresh.remove();
    });

    it('the title JS property alias forwards to heading and never leaves a title attribute', async () => {
      const fresh = document.createElement('lt-alert') as Alert;
      fresh.title = 'Payment failed';
      document.body.appendChild(fresh);
      await fresh.updateComplete;
      expect(fresh.heading).toBe('Payment failed');
      expect(fresh.title).toBe('Payment failed');
      expect(fresh.hasAttribute('title')).toBe(false);
      fresh.remove();
    });

    it('a title="…" markup attribute is converted to heading, and the native attribute is stripped so no browser tooltip shows', async () => {
      const fresh = document.createElement('lt-alert') as Alert;
      fresh.setAttribute('title', 'Payment failed');
      document.body.appendChild(fresh);
      await fresh.updateComplete;
      expect(fresh.heading).toBe('Payment failed');
      expect(fresh.hasAttribute('title')).toBe(false);
      fresh.remove();
    });

    it('heading wins if both heading and the deprecated title attribute are given in markup', async () => {
      const fresh = document.createElement('lt-alert') as Alert;
      fresh.setAttribute('heading', 'Real Heading');
      fresh.setAttribute('title', 'Deprecated Alias');
      document.body.appendChild(fresh);
      await fresh.updateComplete;
      expect(fresh.heading).toBe('Real Heading');
      expect(fresh.hasAttribute('title')).toBe(false);
      fresh.remove();
    });
  });
});
