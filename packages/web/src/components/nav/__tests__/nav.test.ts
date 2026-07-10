import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../nav';
import '../nav-item';
import type { Nav } from '../nav';
import type { NavItem } from '../nav-item';

describe('<lt-nav>', () => {
  let el: Nav;

  beforeEach(async () => {
    el = document.createElement('lt-nav') as Nav;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => el.remove());

  it('renders a nav element in shadow DOM', () => {
    expect(el.shadowRoot!.querySelector('nav')).toBeTruthy();
  });

  it('defaults to vertical orientation', () => {
    expect(el.orientation).toBe('vertical');
  });

  it('reflects horizontal orientation', async () => {
    el.orientation = 'horizontal';
    await el.updateComplete;
    expect(el.getAttribute('orientation')).toBe('horizontal');
  });

  it('propagates orientation to slotted lt-nav-item children', async () => {
    const item = document.createElement('lt-nav-item') as NavItem;
    item.setAttribute('label', 'Home');
    el.appendChild(item);
    el.orientation = 'horizontal';
    await el.updateComplete;
    expect(item.getAttribute('orientation')).toBe('horizontal');
  });
});

describe('<lt-nav-item>', () => {
  let el: NavItem;

  afterEach(() => el?.remove());

  it('renders a button trigger when no href is set', async () => {
    el = document.createElement('lt-nav-item') as NavItem;
    el.setAttribute('label', 'Settings');
    document.body.appendChild(el);
    await el.updateComplete;
    const trigger = el.shadowRoot!.querySelector('.item-trigger');
    expect(trigger?.tagName.toLowerCase()).toBe('button');
  });

  it('renders an anchor trigger when href is set', async () => {
    el = document.createElement('lt-nav-item') as NavItem;
    el.setAttribute('label', 'Home');
    el.setAttribute('href', '/');
    document.body.appendChild(el);
    await el.updateComplete;
    const trigger = el.shadowRoot!.querySelector('.item-trigger');
    expect(trigger?.tagName.toLowerCase()).toBe('a');
  });

  it('toggles open when clicked and children are slotted', async () => {
    el = document.createElement('lt-nav-item') as NavItem;
    el.setAttribute('label', 'Group');
    const child = document.createElement('lt-nav-item') as NavItem;
    child.setAttribute('label', 'Child');
    child.setAttribute('href', '/child');
    el.appendChild(child);
    document.body.appendChild(el);
    await el.updateComplete;
    // wait a tick for slotchange
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    expect(el.open).toBe(false);
    el.shadowRoot!.querySelector<HTMLElement>('.item-trigger')!.click();
    await el.updateComplete;
    expect(el.open).toBe(true);
  });

  it('fires lt-nav-item-click on trigger click', async () => {
    el = document.createElement('lt-nav-item') as NavItem;
    el.setAttribute('label', 'Home');
    el.setAttribute('href', '/');
    document.body.appendChild(el);
    await el.updateComplete;

    let fired = false;
    el.addEventListener('nav-item-click', () => (fired = true));
    el.shadowRoot!.querySelector<HTMLElement>('.item-trigger')!.click();
    expect(fired).toBe(true);
  });

  it('fires lt-nav-collapse when a group is toggled', async () => {
    el = document.createElement('lt-nav-item') as NavItem;
    el.setAttribute('label', 'Group');
    const child = document.createElement('lt-nav-item') as NavItem;
    child.setAttribute('label', 'Child');
    el.appendChild(child);
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    let detail: { open: boolean } | null = null;
    el.addEventListener('nav-collapse', (e) => (detail = (e as CustomEvent).detail));
    el.shadowRoot!.querySelector<HTMLElement>('.item-trigger')!.click();
    await el.updateComplete;

    expect(detail).toEqual({ open: true });
  });

  it('sets aria-current="page" on the anchor when active', async () => {
    el = document.createElement('lt-nav-item') as NavItem;
    el.setAttribute('label', 'Home');
    el.setAttribute('href', '/');
    el.active = true;
    document.body.appendChild(el);
    await el.updateComplete;

    const trigger = el.shadowRoot!.querySelector('.item-trigger')!;
    expect(trigger.getAttribute('aria-current')).toBe('page');
  });

  it('sets aria-current="page" on the button trigger when active without href', async () => {
    el = document.createElement('lt-nav-item') as NavItem;
    el.setAttribute('label', 'Home');
    el.active = true;
    document.body.appendChild(el);
    await el.updateComplete;

    const trigger = el.shadowRoot!.querySelector('button.item-trigger')!;
    expect(trigger.getAttribute('aria-current')).toBe('page');
  });

  it('omits aria-current when not active', async () => {
    el = document.createElement('lt-nav-item') as NavItem;
    el.setAttribute('label', 'Home');
    el.setAttribute('href', '/');
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.item-trigger')!.hasAttribute('aria-current')).toBe(false);
  });

  it('prevents native navigation when nav-item-click is canceled', async () => {
    el = document.createElement('lt-nav-item') as NavItem;
    el.setAttribute('label', 'Home');
    el.setAttribute('href', '/somewhere');
    document.body.appendChild(el);
    await el.updateComplete;

    el.addEventListener('nav-item-click', (e) => e.preventDefault());

    const anchor = el.shadowRoot!.querySelector<HTMLAnchorElement>('a.item-trigger')!;
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    anchor.dispatchEvent(clickEvent);

    expect(clickEvent.defaultPrevented).toBe(true);
  });

  it('does not prevent navigation when nav-item-click is not canceled', async () => {
    el = document.createElement('lt-nav-item') as NavItem;
    el.setAttribute('label', 'Home');
    el.setAttribute('href', '/somewhere');
    document.body.appendChild(el);
    await el.updateComplete;

    const anchor = el.shadowRoot!.querySelector<HTMLAnchorElement>('a.item-trigger')!;
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    anchor.dispatchEvent(clickEvent);

    expect(clickEvent.defaultPrevented).toBe(false);
  });

  it('does not respond to clicks when disabled', async () => {
    el = document.createElement('lt-nav-item') as NavItem;
    el.setAttribute('label', 'Locked');
    el.setAttribute('disabled', '');
    document.body.appendChild(el);
    await el.updateComplete;

    let fired = false;
    el.addEventListener('nav-item-click', () => (fired = true));
    el.shadowRoot!.querySelector<HTMLElement>('.item-trigger')!.click();
    expect(fired).toBe(false);
  });
});
