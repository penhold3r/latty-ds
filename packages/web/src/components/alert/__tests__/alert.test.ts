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

  it('defaults: variant=default, appearance=filled, withIcon=false, closable=false, title=""', () => {
    expect(el.variant).toBe('default');
    expect(el.appearance).toBe('filled');
    expect(el.withIcon).toBe(false);
    expect(el.closable).toBe(false);
    expect(el.title).toBe('');
  });

  it('defaults: appearance=filled', () => {
    expect(el.appearance).toBe('filled');
    expect(el.getAttribute('appearance')).toBe('filled');
  });

  it('supports all appearances', async () => {
    const appearances = ['filled', 'outlined', 'solid'] as const;
    for (const appearance of appearances) {
      el.appearance = appearance;
      await el.updateComplete;
      expect(el.getAttribute('appearance')).toBe(appearance);
    }
  });

  it('supports all variants', async () => {
    const variants = ['default', 'success', 'warning', 'error', 'info'] as const;
    for (const variant of variants) {
      el.variant = variant;
      await el.updateComplete;
      expect(el.getAttribute('variant')).toBe(variant);
    }
  });

  it('renders slot for body content', () => {
    expect(el.shadowRoot!.querySelector('slot')).toBeTruthy();
  });

  it('does not render icon by default', async () => {
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.icon')).toBeNull();
  });

  it('renders icon when with-icon is true', async () => {
    el.withIcon = true;
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
