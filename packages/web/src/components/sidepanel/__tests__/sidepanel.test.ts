import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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
    document.body.style.overflow = '';
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

  it('defaults anchor to start', () => {
    expect(el.anchor).toBe('start');
    expect(el.getAttribute('anchor')).toBe('start');
  });

  it.each(['start', 'end', 'top', 'bottom'] as const)('reflects %s anchor to attribute', async (anchor) => {
    el.anchor = anchor;
    await el.updateComplete;
    expect(el.getAttribute('anchor')).toBe(anchor);
  });

  it('dispatches close when hide() is called', async () => {
    el.open = true;
    await el.updateComplete;
    let fired = false;
    el.addEventListener('close', () => {
      fired = true;
    });
    el.hide();
    await el.updateComplete;
    expect(fired).toBe(true);
  });

  it('dispatches close when open is set to false directly, not just via hide() (SPL-3)', async () => {
    el.open = true;
    await el.updateComplete;
    let fired = false;
    el.addEventListener('close', () => {
      fired = true;
    });
    el.open = false;
    await el.updateComplete;
    expect(fired).toBe(true);
  });

  it('dispatches open when open is set to true directly', async () => {
    let fired = false;
    el.addEventListener('open', () => {
      fired = true;
    });
    el.open = true;
    await el.updateComplete;
    expect(fired).toBe(true);
  });

  // A real Escape press closes only the panel that's actually focused now (the platform's own per-<dialog>
  // handling), not every open panel on the page via a window-level listener (SPL-3) — jsdom doesn't implement
  // that native mechanism at all, so this dispatches the native element's own 'close' event directly, the way a
  // real Escape press would eventually produce, to verify it's synced back onto `open` (and dispatches our own
  // `close`) correctly.
  it('a native close (e.g. from Escape) is synced back onto open and dispatches close', async () => {
    el.open = true;
    await el.updateComplete;
    let fired = false;
    el.addEventListener('close', () => {
      fired = true;
    });

    const dialog = el.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
    dialog.close();
    await el.updateComplete;

    expect(el.open).toBe(false);
    expect(fired).toBe(true);
  });

  it('does not fire close, or lock body scroll, just from mounting already open (same first-update guard as lt-dialog, DLG-2)', async () => {
    const handler = vi.fn();
    const fresh = document.createElement('lt-sidepanel') as SidePanel;
    fresh.setAttribute('open', '');
    fresh.addEventListener('close', handler);
    document.body.appendChild(fresh);
    await fresh.updateComplete;

    expect(handler).not.toHaveBeenCalled();
    expect(document.body.style.overflow).toBe('');
    fresh.remove();
  });

  it('locks body scroll when open and releases it when closed', async () => {
    expect(document.body.style.overflow).toBe('');
    el.open = true;
    await el.updateComplete;
    expect(document.body.style.overflow).toBe('hidden');

    el.open = false;
    await el.updateComplete;
    expect(document.body.style.overflow).toBe('');
  });

  it('releases its scroll lock if removed from the DOM while still open', async () => {
    el.open = true;
    await el.updateComplete;
    expect(document.body.style.overflow).toBe('hidden');

    el.remove();

    expect(document.body.style.overflow).toBe('');
  });

  it('calls showModal()/close() on the native element', async () => {
    el.open = true;
    await el.updateComplete;
    const dialog = el.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
    expect(dialog.open).toBe(true);

    el.open = false;
    await el.updateComplete;
    expect(dialog.open).toBe(false);
  });

  it('is labelled by its own label text (SPL-3 — role=dialog previously had no accessible name)', async () => {
    el.label = 'Filters';
    el.open = true;
    await el.updateComplete;
    const dialog = el.shadowRoot!.querySelector('dialog')!;
    const labelId = dialog.getAttribute('aria-labelledby');
    expect(labelId).toBeTruthy();
    expect(el.shadowRoot!.getElementById(labelId!)?.textContent).toBe('Filters');
  });

  it('has no aria-labelledby when there is no label', async () => {
    el.open = true;
    await el.updateComplete;
    const dialog = el.shadowRoot!.querySelector('dialog')!;
    expect(dialog.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('uses one consistent overlay-opacity custom property between the property and the CSS that reads it (SPL-2)', async () => {
    el.overlayOpacity = 0.9;
    await el.updateComplete;
    const dialog = el.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
    expect(dialog.style.getPropertyValue('--lt-sidepanel-overlay-opacity')).toBe('0.9');
  });
});
