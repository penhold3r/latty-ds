import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Snackbar } from '../snackbar';
import '../snackbar';

describe('<lt-snackbar>', () => {
  let el: Snackbar;

  beforeEach(async () => {
    el = document.createElement('lt-snackbar') as Snackbar;
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

  it('defaults: open=false, closable=true, duration=4000, variant=default', () => {
    expect(el.open).toBe(false);
    expect(el.closable).toBe(true);
    expect(el.duration).toBe(4000);
    expect(el.variant).toBe('default');
  });

  it('reflects variant attribute', async () => {
    el.variant = 'success';
    await el.updateComplete;
    expect(el.getAttribute('variant')).toBe('success');
  });

  it('show() sets open to true', async () => {
    el.show();
    await el.updateComplete;
    expect(el.open).toBe(true);
  });

  it('hide() sets open to false', async () => {
    el.show();
    await el.updateComplete;
    el.hide();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('dispatches lt-show event on show()', async () => {
    const handler = vi.fn();
    el.addEventListener('lt-show', handler);
    el.show();
    await el.updateComplete;
    expect(handler).toHaveBeenCalledOnce();
  });

  it('dispatches lt-hide event on hide()', async () => {
    const handler = vi.fn();
    el.show();
    await el.updateComplete;
    el.addEventListener('lt-hide', handler);
    el.hide();
    await el.updateComplete;
    expect(handler).toHaveBeenCalledOnce();
  });

  it('renders action button when action-label is set', async () => {
    el.setAttribute('action-label', 'Undo');
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector('.action');
    expect(btn).toBeTruthy();
    expect(btn!.textContent!.trim()).toBe('Undo');
  });

  it('dispatches lt-action and hides on action button click', async () => {
    const handler = vi.fn();
    el.addEventListener('lt-action', handler);
    el.setAttribute('action-label', 'Undo');
    el.show();
    await el.updateComplete;
    (el.shadowRoot!.querySelector('.action') as HTMLElement).click();
    await el.updateComplete;
    expect(handler).toHaveBeenCalledOnce();
    expect(el.open).toBe(false);
  });

  it('renders close button by default', async () => {
    expect(el.shadowRoot!.querySelector('.close')).toBeTruthy();
  });

  it('hides close button when closable=false', async () => {
    el.closable = false;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.close')).toBeNull();
  });

  it('auto-dismisses after duration', async () => {
    vi.useFakeTimers();
    el.duration = 1000;
    el.show();
    await el.updateComplete;
    expect(el.open).toBe(true);
    vi.advanceTimersByTime(1000);
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('does not auto-dismiss when duration=0', async () => {
    vi.useFakeTimers();
    el.duration = 0;
    el.show();
    await el.updateComplete;
    vi.advanceTimersByTime(10000);
    await el.updateComplete;
    expect(el.open).toBe(true);
  });
});
