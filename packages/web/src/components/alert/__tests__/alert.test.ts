import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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

  it('defaults: variant=default, appearance=filled, icon="", closable=false, title=""', () => {
    expect(el.variant).toBe('default');
    expect(el.appearance).toBe('filled');
    expect(el.icon).toBe('');
    expect(el.closable).toBe(false);
    expect(el.title).toBe('');
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
    el.addEventListener('lt-close', handler);
    (el.shadowRoot!.querySelector('.close') as HTMLElement).click();
    expect(handler).toHaveBeenCalledOnce();
  });

  it('removes itself after close with animation delay', async () => {
    vi.useFakeTimers();
    el.closable = true;
    await el.updateComplete;
    (el.shadowRoot!.querySelector('.close') as HTMLElement).click();
    expect(document.body.contains(el)).toBe(true);
    vi.advanceTimersByTime(200);
    expect(document.body.contains(el)).toBe(false);
  });

  it('does not remove when lt-close is cancelled via preventDefault', async () => {
    vi.useFakeTimers();
    el.closable = true;
    await el.updateComplete;
    el.addEventListener('lt-close', (e) => e.preventDefault());
    (el.shadowRoot!.querySelector('.close') as HTMLElement).click();
    vi.advanceTimersByTime(200);
    expect(document.body.contains(el)).toBe(true);
  });

  it('sets [dismissed] attribute during exit animation', async () => {
    vi.useFakeTimers();
    el.closable = true;
    await el.updateComplete;
    (el.shadowRoot!.querySelector('.close') as HTMLElement).click();
    expect(el.hasAttribute('dismissed')).toBe(true);
  });
});
