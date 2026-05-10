import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { SidePanel } from '../sidepanel';
import '../sidepanel';

describe('<lt-sidepanel>', () => {
  let el: SidePanel;

  beforeEach(async () => {
    el = document.createElement('lt-sidepanel') as SidePanel;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('defaults to closed', () => {
    expect(el.open).toBe(false);
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('reflects open attribute', async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('defaults anchor to left', () => {
    expect(el.anchor).toBe('left');
    expect(el.getAttribute('anchor')).toBe('left');
  });

  it.each(['left', 'right', 'top', 'bottom'] as const)('reflects %s anchor to attribute', async (anchor) => {
    el.anchor = anchor;
    await el.updateComplete;
    expect(el.getAttribute('anchor')).toBe(anchor);
  });

  it('dispatches lt-close when hide() is called', () => {
    let fired = false;
    el.addEventListener('lt-close', () => {
      fired = true;
    });
    el.hide();
    expect(fired).toBe(true);
  });

  it('dispatches lt-close on Escape key when open', async () => {
    el.open = true;
    await el.updateComplete;
    let fired = false;
    el.addEventListener('lt-close', () => {
      fired = true;
    });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(fired).toBe(true);
  });

  it('does not dispatch lt-close on Escape key when closed', () => {
    let fired = false;
    el.addEventListener('lt-close', () => {
      fired = true;
    });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(fired).toBe(false);
  });
});
