import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Dialog } from '../dialog';
import '../dialog';

describe('<lt-dialog>', () => {
  let el: Dialog;

  beforeEach(async () => {
    el = document.createElement('lt-dialog') as Dialog;
    el.title = 'Test Dialog';
    el.textContent = 'Dialog content';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
    // Reset body overflow in case dialog was open
    document.body.style.overflow = '';
  });

  it('renders when open', async () => {
    expect(el.shadowRoot!.querySelector('lt-surface')).toBeFalsy();

    el.open = true;
    await el.updateComplete;

    const dialog = el.shadowRoot!.querySelector('lt-surface');
    expect(dialog).toBeTruthy();
  });

  it('does not render when closed', () => {
    el.open = false;
    const dialog = el.shadowRoot!.querySelector('.dialog');
    expect(dialog).toBeFalsy();
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it('is closed by default', () => {
    expect(el.open).toBe(false);
  });

  it('can change size', async () => {
    el.size = 'lg';
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe('lg');
  });

  it('supports all sizes', async () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'fullscreen'] as const;

    for (const size of sizes) {
      el.size = size;
      await el.updateComplete;
      expect(el.getAttribute('size')).toBe(size);
    }
  });

  it('renders title in header', async () => {
    el.open = true;
    await el.updateComplete;

    const title = el.shadowRoot!.querySelector('.title');
    expect(title).toBeTruthy();
    expect(title!.textContent).toBe('Test Dialog');
  });

  it('renders close button by default', async () => {
    el.open = true;
    await el.updateComplete;

    const closeButton = el.shadowRoot!.querySelector('.close-button');
    expect(closeButton).toBeTruthy();
  });

  it('hides close button when hideCloseButton is true', async () => {
    el.open = true;
    el.hideCloseButton = true;
    await el.updateComplete;

    const closeButton = el.shadowRoot!.querySelector('.close-button');
    expect(closeButton).toBeFalsy();
  });

  it('projects content into the default slot', async () => {
    el.open = true;
    await el.updateComplete;

    const slot = el.shadowRoot!.querySelector('.body slot:not([name])');
    expect(slot).toBeTruthy();
  });

  it('has proper accessibility attributes', async () => {
    el.open = true;
    await el.updateComplete;

    const dialog = el.shadowRoot!.querySelector('lt-surface');
    expect(dialog?.getAttribute('role')).toBe('dialog');
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    expect(dialog?.getAttribute('aria-labelledby')).toBe('dialog-title');
  });

  it('opens via show() method', async () => {
    expect(el.open).toBe(false);

    el.show();
    await el.updateComplete;

    expect(el.open).toBe(true);
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('closes via hide() method', async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.open).toBe(true);

    el.hide();
    await el.updateComplete;

    expect(el.open).toBe(false);
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('toggles via toggle() method', async () => {
    expect(el.open).toBe(false);

    el.toggle();
    await el.updateComplete;
    expect(el.open).toBe(true);

    el.toggle();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('dispatches lt-dialog-open event when opened', async () => {
    const handler = vi.fn();
    el.addEventListener('lt-dialog-open', handler);

    el.open = true;
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('dispatches lt-dialog-close event when closed', async () => {
    const handler = vi.fn();
    el.addEventListener('lt-dialog-close', handler);

    el.open = true;
    await el.updateComplete;

    el.open = false;
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('closes when clicking close button', async () => {
    el.open = true;
    await el.updateComplete;

    const closeButton = el.shadowRoot!.querySelector('.close-button') as HTMLButtonElement;
    closeButton.click();
    await el.updateComplete;

    expect(el.open).toBe(false);
  });

  it('closes when clicking backdrop if closeOnBackdropClick is true', async () => {
    el.open = true;
    el.closeOnBackdropClick = true;
    await el.updateComplete;

    const backdrop = el.shadowRoot!.querySelector('.backdrop') as HTMLElement;
    backdrop.click();
    await el.updateComplete;

    expect(el.open).toBe(false);
  });

  it('does not close when clicking backdrop if closeOnBackdropClick is false', async () => {
    el.open = true;
    el.closeOnBackdropClick = false;
    await el.updateComplete;

    const backdrop = el.shadowRoot!.querySelector('.backdrop') as HTMLElement;
    backdrop.click();
    await el.updateComplete;

    expect(el.open).toBe(true);
  });

  it('does not close when clicking dialog content', async () => {
    el.open = true;
    await el.updateComplete;

    const dialog = el.shadowRoot!.querySelector('lt-surface') as HTMLElement;
    dialog.click();
    await el.updateComplete;

    expect(el.open).toBe(true);
  });

  it('closes on Escape key if closeOnEscape is true', async () => {
    el.open = true;
    el.closeOnEscape = true;
    await el.updateComplete;

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    el.dispatchEvent(event);
    await el.updateComplete;

    expect(el.open).toBe(false);
  });

  it('does not close on Escape key if closeOnEscape is false', async () => {
    el.open = true;
    el.closeOnEscape = false;
    await el.updateComplete;

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    el.dispatchEvent(event);
    await el.updateComplete;

    expect(el.open).toBe(true);
  });

  it('prevents body scroll when open', async () => {
    expect(document.body.style.overflow).toBe('');

    el.open = true;
    await el.updateComplete;

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', async () => {
    el.open = true;
    await el.updateComplete;
    expect(document.body.style.overflow).toBe('hidden');

    el.open = false;
    await el.updateComplete;

    expect(document.body.style.overflow).toBe('');
  });

  it('has default closeOnBackdropClick of true', () => {
    expect(el.closeOnBackdropClick).toBe(true);
  });

  it('has default closeOnEscape of true', () => {
    expect(el.closeOnEscape).toBe(true);
  });

  it('has default hideCloseButton of false', () => {
    expect(el.hideCloseButton).toBe(false);
  });
});
