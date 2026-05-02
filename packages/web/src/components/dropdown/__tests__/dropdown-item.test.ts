import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { DropdownItem } from '../dropdown-item';
import '../dropdown-item';

describe('<lt-dropdown-item>', () => {
  let el: DropdownItem;

  beforeEach(async () => {
    el = document.createElement('lt-dropdown-item') as DropdownItem;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => { el.remove(); });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renders a button by default', () => {
    expect(el.shadowRoot!.querySelector('button')).toBeTruthy();
  });

  it('button has role=menuitem', () => {
    const btn = el.shadowRoot!.querySelector('button');
    expect(btn?.getAttribute('role')).toBe('menuitem');
  });

  it('is not disabled by default', () => {
    expect(el.disabled).toBe(false);
    expect(el.hasAttribute('disabled')).toBe(false);
  });

  it('disabled reflects to attribute and disables the button', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute('disabled')).toBe(true);
    expect(el.shadowRoot!.querySelector('button')?.disabled).toBe(true);
  });

  it('is not selected by default', () => {
    expect(el.selected).toBe(false);
  });

  it('selected reflects to attribute', async () => {
    el.selected = true;
    await el.updateComplete;
    expect(el.hasAttribute('selected')).toBe(true);
  });

  it('renders an anchor when href is set', async () => {
    el.href = '/profile';
    await el.updateComplete;
    const a = el.shadowRoot!.querySelector('a');
    expect(a).toBeTruthy();
    expect(a?.getAttribute('href')).toBe('/profile');
    expect(el.shadowRoot!.querySelector('button')).toBeNull();
  });

  it('dispatches lt-select on click', async () => {
    const spy = vi.fn();
    el.addEventListener('lt-select', spy);
    el.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('does not dispatch lt-select when disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    const spy = vi.fn();
    el.addEventListener('lt-select', spy);
    // pointer-events: none prevents real clicks, but we test the guard directly
    el.shadowRoot!.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(spy).not.toHaveBeenCalled();
  });

  it('lt-select event bubbles and is composed', async () => {
    const spy = vi.fn();
    document.addEventListener('lt-select', spy);
    el.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click();
    document.removeEventListener('lt-select', spy);
    expect(spy).toHaveBeenCalledOnce();
  });

  it('has a default slot', () => {
    expect(el.shadowRoot!.querySelector('slot:not([name])')).toBeTruthy();
  });
});
