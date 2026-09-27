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

  it('defaults: variant=default, appearance=filled, icon="", closable=false, title="", open=true', () => {
    expect(el.variant).toBe('default');
    expect(el.appearance).toBe('filled');
    expect(el.icon).toBe('');
    expect(el.closable).toBe(false);
    expect(el.title).toBe('');
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

  it('does not render title when title is empty', async () => {
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.title')).toBeNull();
  });

  it('renders title when title is set', async () => {
    el.title = 'Heads up';
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
});
