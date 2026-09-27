import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Dropdown } from '../dropdown';
import '../dropdown';
import '../dropdown-item';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 0, y: 0 }),
  autoUpdate: vi.fn().mockReturnValue(vi.fn()),
  offset: vi.fn(),
  flip: vi.fn(),
  shift: vi.fn()
}));

describe('<lt-dropdown>', () => {
  let el: Dropdown;

  beforeEach(async () => {
    el = document.createElement('lt-dropdown') as Dropdown;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('is closed by default', () => {
    expect(el.open).toBe(false);
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('open reflects to attribute', async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.hasAttribute('open')).toBe(true);
    el.open = false;
    await el.updateComplete;
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('show() opens the menu and sets display:block inline', async () => {
    const menu = el.shadowRoot!.querySelector<HTMLElement>('lt-surface.menu')!;
    el.show();
    await el.updateComplete;
    await Promise.resolve(); // flush openFloating
    expect(el.open).toBe(true);
    expect(menu.style.display).toBe('block');
  });

  it('hide() closes the menu and resets display', async () => {
    const menu = el.shadowRoot!.querySelector<HTMLElement>('lt-surface.menu')!;
    el.open = true;
    await el.updateComplete;
    await Promise.resolve();
    el.hide();
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(menu.style.display).toBe('');
  });

  it('toggle() flips open state', async () => {
    el.toggle();
    await el.updateComplete;
    expect(el.open).toBe(true);
    el.toggle();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('does not dispatch close or move focus on first render, since it never opened', async () => {
    const fresh = document.createElement('lt-dropdown') as Dropdown;
    fresh.innerHTML = '<button slot="trigger">Menu</button>';
    const spy = vi.fn();
    fresh.addEventListener('close', spy);
    document.body.appendChild(fresh);
    await fresh.updateComplete;
    expect(spy).not.toHaveBeenCalled();
    expect(document.activeElement).not.toBe(fresh.querySelector('button'));
    fresh.remove();
  });

  it('dispatches lt-open when opened', async () => {
    const spy = vi.fn();
    el.addEventListener('open', spy);
    el.show();
    await el.updateComplete;
    expect(spy).toHaveBeenCalledOnce();
  });

  it('dispatches lt-close when closed', async () => {
    el.open = true;
    await el.updateComplete;
    const spy = vi.fn();
    el.addEventListener('close', spy);
    el.hide();
    await el.updateComplete;
    expect(spy).toHaveBeenCalledOnce();
  });

  it('default placement is bottom-start', () => {
    expect(el.placement).toBe('bottom-start');
    expect(el.getAttribute('placement')).toBe('bottom-start');
  });

  it('placement reflects to attribute', async () => {
    el.placement = 'top-end';
    await el.updateComplete;
    expect(el.getAttribute('placement')).toBe('top-end');
  });

  it('menu has role=menu', () => {
    const menu = el.shadowRoot!.querySelector('.menu');
    expect(menu?.getAttribute('role')).toBe('menu');
  });

  it('menu is aria-hidden when closed', () => {
    const menu = el.shadowRoot!.querySelector('.menu');
    expect(menu?.getAttribute('aria-hidden')).toBe('true');
  });

  it('menu is not aria-hidden when open', async () => {
    el.open = true;
    await el.updateComplete;
    const menu = el.shadowRoot!.querySelector('.menu');
    expect(menu?.getAttribute('aria-hidden')).toBe('false');
  });

  it('closes on Escape key', async () => {
    el.open = true;
    await el.updateComplete;
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('closes when a lt-select event bubbles up from an item', async () => {
    el.open = true;
    await el.updateComplete;
    el.dispatchEvent(new CustomEvent('select', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('has a trigger slot', () => {
    const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="trigger"]');
    expect(slot).toBeTruthy();
  });

  it('renders lt-surface as the menu panel', () => {
    expect(el.shadowRoot!.querySelector('lt-surface.menu')).toBeTruthy();
  });

  describe('trigger ARIA and focusout (DDN-2)', () => {
    let fresh: Dropdown;
    let trigger: HTMLButtonElement;
    let item: HTMLElement;

    beforeEach(async () => {
      fresh = document.createElement('lt-dropdown') as Dropdown;
      fresh.innerHTML = '<button slot="trigger">Menu</button><lt-dropdown-item>One</lt-dropdown-item>';
      document.body.appendChild(fresh);
      await fresh.updateComplete;
      trigger = fresh.querySelector('button')!;
      item = fresh.querySelector('lt-dropdown-item')!;
    });

    afterEach(() => {
      fresh.remove();
    });

    it('marks the trigger as a menu button', () => {
      expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('reflects aria-expanded when the menu opens and closes', async () => {
      fresh.open = true;
      await fresh.updateComplete;
      expect(trigger.getAttribute('aria-expanded')).toBe('true');

      fresh.open = false;
      await fresh.updateComplete;
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('closes when focus moves to something outside the dropdown', async () => {
      const outside = document.createElement('button');
      document.body.appendChild(outside);
      fresh.open = true;
      await fresh.updateComplete;

      item.dispatchEvent(new FocusEvent('focusout', { relatedTarget: outside, bubbles: true, composed: true }));
      await fresh.updateComplete;

      expect(fresh.open).toBe(false);
      outside.remove();
    });

    it('stays open when focus moves between the trigger and an item', async () => {
      fresh.open = true;
      await fresh.updateComplete;

      trigger.dispatchEvent(new FocusEvent('focusout', { relatedTarget: item, bubbles: true, composed: true }));
      await fresh.updateComplete;

      expect(fresh.open).toBe(true);
    });

    it('closes when relatedTarget is null (e.g. Tab past the last focusable element on the page)', async () => {
      fresh.open = true;
      await fresh.updateComplete;

      item.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null, bubbles: true, composed: true }));
      await fresh.updateComplete;

      expect(fresh.open).toBe(false);
    });
  });
});
