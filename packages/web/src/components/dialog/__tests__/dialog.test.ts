import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { axe } from 'vitest-axe';
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

  it('the native <dialog> is always in the DOM, closed by default (page-behind inert now comes from showModal() itself, not a JS attribute — Chromium-only, see the native-dialog spike)', async () => {
    const dialog = el.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
    expect(dialog).toBeTruthy();
    expect(dialog.open).toBe(false);

    el.open = true;
    await el.updateComplete;

    expect(dialog.open).toBe(true);
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it('is closed by default', () => {
    expect(el.open).toBe(false);
  });

  it('has default elevation of 4', () => {
    expect(el.elevation).toBe('4');
    const surface = el.shadowRoot!.querySelector('lt-surface');
    expect(surface?.getAttribute('elevation')).toBe('4');
  });

  it('has default appearance of filled', () => {
    expect(el.appearance).toBe('filled');
    const surface = el.shadowRoot!.querySelector('lt-surface');
    expect(surface?.getAttribute('appearance')).toBe('filled');
  });

  it.each(['0', '1', '2', '3', '4', '5'] as const)('forwards elevation %s to the internal surface', async (level) => {
    el.elevation = level;
    await el.updateComplete;
    const surface = el.shadowRoot!.querySelector('lt-surface');
    expect(surface?.getAttribute('elevation')).toBe(level);
  });

  it('forwards appearance to the internal surface', async () => {
    el.appearance = 'outlined';
    await el.updateComplete;
    const surface = el.shadowRoot!.querySelector('lt-surface');
    expect(surface?.getAttribute('appearance')).toBe('outlined');
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

  it('renders heading in header (set here via the deprecated title alias — see beforeEach)', async () => {
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

  it('hides close button when noCloseButton is true', async () => {
    el.open = true;
    el.noCloseButton = true;
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

  it('has no axe violations when open', async () => {
    el.open = true;
    await el.updateComplete;
    expect(await axe(el)).toHaveNoViolations();
  });

  it('has proper accessibility attributes (role/aria-modal are now implicit on the native <dialog>, not set explicitly — verified in Chromium via the native-dialog spike, not here)', async () => {
    el.open = true;
    await el.updateComplete;

    const dialog = el.shadowRoot!.querySelector('dialog');
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

  it('dispatches open event when opened', async () => {
    const handler = vi.fn();
    el.addEventListener('open', handler);

    el.open = true;
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('dispatches close event when closed', async () => {
    const handler = vi.fn();
    el.addEventListener('close', handler);

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

    // Clicking the native <dialog> element itself (not a descendant) is exactly what a real backdrop click
    // resolves to (::backdrop isn't a real node and can't be an event target — confirmed in the spike).
    const dialog = el.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
    dialog.click();
    await el.updateComplete;

    expect(el.open).toBe(false);
  });

  it('does not close when clicking backdrop if closeOnBackdropClick is false', async () => {
    el.open = true;
    el.closeOnBackdropClick = false;
    await el.updateComplete;

    const dialog = el.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
    dialog.click();
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

  // A real Escape press is handled entirely by the platform now (the native <dialog>'s own CloseWatcher-driven
  // cancel->close sequence), not by a keydown listener this component owns — jsdom doesn't implement that
  // sequence at all, so these dispatch the 'cancel' event directly (what the browser fires first) to exercise
  // _handleCancel's actual logic, and simulate the browser's own follow-up close() for the "stays open" case
  // would be wrong to call, matching what really happens when cancel isn't prevented.
  it('does not prevent the native cancel event if closeOnEscape is true, so a real dialog closes itself', async () => {
    el.open = true;
    el.closeOnEscape = true;
    await el.updateComplete;

    const dialog = el.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
    const cancelEvent = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(cancelEvent);

    expect(cancelEvent.defaultPrevented).toBe(false);

    // A real dialog closes itself right after an unprevented cancel and fires 'close' — simulate that step,
    // which jsdom's stub only does when explicitly told to (see vitest.setup.ts).
    dialog.close();
    await el.updateComplete;

    expect(el.open).toBe(false);
  });

  it('prevents the native cancel event if closeOnEscape is false, so a real dialog stays open', async () => {
    el.open = true;
    el.closeOnEscape = false;
    await el.updateComplete;

    const dialog = el.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
    const cancelEvent = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(cancelEvent);
    await el.updateComplete;

    expect(cancelEvent.defaultPrevented).toBe(true);
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

  it('has default noCloseButton of false', () => {
    expect(el.noCloseButton).toBe(false);
  });

  describe('heading, and the deprecated title alias (DLG-6)', () => {
    it('setting heading directly works', async () => {
      const fresh = document.createElement('lt-dialog') as Dialog;
      fresh.heading = 'Settings';
      document.body.appendChild(fresh);
      await fresh.updateComplete;
      expect(fresh.heading).toBe('Settings');
      const title = fresh.shadowRoot!.querySelector('.title');
      expect(title?.textContent).toBe('Settings');
      fresh.remove();
    });

    it('the title JS property alias forwards to heading and never leaves a title attribute', async () => {
      const fresh = document.createElement('lt-dialog') as Dialog;
      fresh.title = 'Confirm Action';
      document.body.appendChild(fresh);
      await fresh.updateComplete;
      expect(fresh.heading).toBe('Confirm Action');
      expect(fresh.title).toBe('Confirm Action');
      expect(fresh.hasAttribute('title')).toBe(false);
      fresh.remove();
    });

    it('a title="…" markup attribute is converted to heading, and the native attribute is stripped so no browser tooltip shows', async () => {
      const fresh = document.createElement('lt-dialog') as Dialog;
      fresh.setAttribute('title', 'Confirm Action');
      document.body.appendChild(fresh);
      await fresh.updateComplete;
      expect(fresh.heading).toBe('Confirm Action');
      expect(fresh.hasAttribute('title')).toBe(false);
      fresh.remove();
    });

    it('heading wins if both heading and the deprecated title attribute are given in markup', async () => {
      const fresh = document.createElement('lt-dialog') as Dialog;
      fresh.setAttribute('heading', 'Real Heading');
      fresh.setAttribute('title', 'Deprecated Alias');
      document.body.appendChild(fresh);
      await fresh.updateComplete;
      expect(fresh.heading).toBe('Real Heading');
      expect(fresh.hasAttribute('title')).toBe(false);
      fresh.remove();
    });
  });

  describe('native <dialog>: showModal()/close() and no spurious close on mount (DLG-1, DLG-2)', () => {
    it('calls showModal() on the native element when opened', async () => {
      el.open = true;
      await el.updateComplete;
      const dialog = el.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
      expect(dialog.open).toBe(true);
    });

    it('calls close() on the native element when closed', async () => {
      el.open = true;
      await el.updateComplete;
      el.open = false;
      await el.updateComplete;
      const dialog = el.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
      expect(dialog.open).toBe(false);
    });

    it('does not fire close, or touch body scroll, just from mounting already open (DLG-2)', async () => {
      const handler = vi.fn();
      const fresh = document.createElement('lt-dialog') as Dialog;
      fresh.setAttribute('open', '');
      fresh.addEventListener('close', handler);
      document.body.appendChild(fresh);
      await fresh.updateComplete;

      expect(handler).not.toHaveBeenCalled();
      expect(document.body.style.overflow).toBe('');
      fresh.remove();
    });

    it('a real dialog closing itself (e.g. via Escape) is synced back onto the open property', async () => {
      el.open = true;
      await el.updateComplete;
      const dialog = el.shadowRoot!.querySelector('dialog') as HTMLDialogElement;

      // Simulate the native element closing itself, the way a real Escape press would — not via el.hide().
      dialog.close();
      await el.updateComplete;

      expect(el.open).toBe(false);
      expect(el.hasAttribute('open')).toBe(false);
    });

    it('a native close fires our own close event too (side effects — scroll unlock, focus restore — still run)', async () => {
      el.open = true;
      await el.updateComplete;
      const handler = vi.fn();
      el.addEventListener('close', handler);

      const dialog = el.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
      dialog.close();
      await el.updateComplete;

      expect(handler).toHaveBeenCalledOnce();
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('scroll lock is ref-counted across multiple open dialogs (DLG-3)', () => {
    it('stays locked while a second dialog is still open', async () => {
      const second = document.createElement('lt-dialog') as Dialog;
      document.body.appendChild(second);
      await second.updateComplete;

      el.open = true;
      await el.updateComplete;
      second.open = true;
      await second.updateComplete;
      expect(document.body.style.overflow).toBe('hidden');

      el.open = false;
      await el.updateComplete;
      expect(document.body.style.overflow).toBe('hidden'); // second is still open

      second.open = false;
      await second.updateComplete;
      expect(document.body.style.overflow).toBe('');

      second.remove();
    });

    it('releases its lock if removed from the DOM while still open, instead of leaving the page permanently unscrollable', async () => {
      el.open = true;
      await el.updateComplete;
      expect(document.body.style.overflow).toBe('hidden');

      el.remove();

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('focus restoration to a shadow-rooted opener (DLG-4)', () => {
    // jsdom doesn't implement delegatesFocus at all (confirmed empirically elsewhere this session), so
    // document.activeElement never actually moves into a shadow-rooted custom element's shadow root here —
    // that part of DLG-4 (lt-button's own delegatesFocus, BTN-4) is verified in Chromium, not jsdom. What this
    // checks is dialog.ts's own half: that it captures document.activeElement at open time (whatever it is —
    // BTN-4 already made that the shadow-rooted host itself, not BODY) and calls .focus() on that exact
    // reference to restore it, once, on close.
    it('calls .focus() on whatever was document.activeElement when opened, exactly once, on close', async () => {
      const opener = document.createElement('button');
      document.body.appendChild(opener);
      opener.focus();
      expect(document.activeElement).toBe(opener);
      const focusSpy = vi.spyOn(opener, 'focus');

      el.open = true;
      await el.updateComplete;
      el.hide();
      await el.updateComplete;

      expect(focusSpy).toHaveBeenCalledOnce();
      opener.remove();
    });
  });

  describe('labels (i18n, X5)', () => {
    it('defaults the close button label to English', async () => {
      el.open = true;
      await el.updateComplete;
      const btn = el.shadowRoot!.querySelector('.close-button');
      expect(btn?.getAttribute('label')).toBe('Close dialog');
    });

    it('overrides the close button label via labels', async () => {
      el.labels = { close: 'Fermer la boîte de dialogue' };
      el.open = true;
      await el.updateComplete;
      const btn = el.shadowRoot!.querySelector('.close-button');
      expect(btn?.getAttribute('label')).toBe('Fermer la boîte de dialogue');
    });
  });
});
