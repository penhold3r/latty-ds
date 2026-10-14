import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { SnackbarGroup } from '../snackbar-group';
import type { Snackbar } from '../../snackbar/snackbar';
import '../snackbar-group';

describe('<lt-snackbar-group>', () => {
  let el: SnackbarGroup;

  beforeEach(async () => {
    el = document.createElement('lt-snackbar-group') as SnackbarGroup;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
    vi.restoreAllMocks();
  });

  const exitTransition = (sb: Snackbar) => {
    sb.dispatchEvent(new TransitionEvent('transitionend', { propertyName: 'opacity' }));
  };

  it('renders shadow DOM and is a manual popover', () => {
    expect(el.shadowRoot).toBeTruthy();
    expect(el.getAttribute('popover')).toBe('manual');
  });

  it('defaults max-visible to 1', () => {
    expect(el.maxVisible).toBe(1);
  });

  it('show() creates a managed lt-snackbar with the message set, and opens the group popover', async () => {
    const sb = el.show({ message: 'Saved!' });
    expect(sb.tagName).toBe('LT-SNACKBAR');
    expect(sb.managed).toBe(true);
    expect(sb.textContent).toBe('Saved!');
    await sb.updateComplete;
    await sb.updateComplete; // one extra tick past the internal await before show() is called
    expect(sb.open).toBe(true);
    expect(el.matches(':popover-open')).toBe(true);
  });

  it('forwards all optional fields to the created snackbar', async () => {
    const onAction = vi.fn();
    const sb = el.show({
      message: 'Deleted',
      variant: 'error',
      duration: 1234,
      closable: false,
      actionLabel: 'Undo',
      icon: 'trash',
      labels: { dismiss: 'Close it' },
      onAction
    });
    expect(sb.variant).toBe('error');
    expect(sb.duration).toBe(1234);
    expect(sb.closable).toBe(false);
    expect(sb.actionLabel).toBe('Undo');
    expect(sb.icon).toBe('trash');
    expect(sb.labels).toEqual({ dismiss: 'Close it' });

    sb.dispatchEvent(new CustomEvent('action'));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it('actually dispatches show (not swallowed by the mount-already-open guard)', async () => {
    const showHandler = vi.fn();
    const sb = el.show({ message: 'Saved!' });
    sb.addEventListener('show', showHandler);
    await sb.updateComplete;
    await sb.updateComplete;
    expect(showHandler).toHaveBeenCalledOnce();
  });

  it('queues a second show() past max-visible=1, presenting it once the first is dismissed', async () => {
    const first = el.show({ message: 'First' });
    const second = el.show({ message: 'Second' });
    await first.updateComplete;
    await first.updateComplete;

    expect(first.isConnected).toBe(true);
    expect(first.open).toBe(true);
    expect(second.isConnected).toBe(false); // queued, not yet in the DOM at all

    first.hide();
    await first.updateComplete;
    exitTransition(first);
    await second.updateComplete;
    await second.updateComplete;

    expect(first.isConnected).toBe(false); // removed once its exit transition finished
    expect(second.isConnected).toBe(true);
    expect(second.open).toBe(true);
  });

  it('shows up to max-visible simultaneously before queueing', async () => {
    el.maxVisible = 2;
    const a = el.show({ message: 'A' });
    const b = el.show({ message: 'B' });
    const c = el.show({ message: 'C' });
    await a.updateComplete;
    await a.updateComplete;
    await b.updateComplete;
    await b.updateComplete;

    expect(a.isConnected).toBe(true);
    expect(b.isConnected).toBe(true);
    expect(c.isConnected).toBe(false);
  });

  it('closes the group popover once nothing is visible, before the exit transition even finishes', async () => {
    const sb = el.show({ message: 'Saved!' });
    await sb.updateComplete;
    await sb.updateComplete;
    expect(el.matches(':popover-open')).toBe(true);

    sb.hide();
    await sb.updateComplete;
    expect(el.matches(':popover-open')).toBe(false); // popover state is logical, not tied to the DOM-removal delay
  });

  it('does not remove the node immediately on hide — waits for the exit transition', async () => {
    const sb = el.show({ message: 'Saved!' });
    await sb.updateComplete;
    await sb.updateComplete;

    sb.hide();
    await sb.updateComplete;
    expect(sb.isConnected).toBe(true); // still there — transition hasn't "finished" yet

    exitTransition(sb);
    expect(sb.isConnected).toBe(false);
  });

  it('ignores an unrelated bubbled transitionend (e.g. from a descendant), only reacting to its own', async () => {
    const sb = el.show({ message: 'Saved!' });
    await sb.updateComplete;
    await sb.updateComplete;
    sb.hide();
    await sb.updateComplete;

    const descendant = sb.shadowRoot!.querySelector('.inner')!;
    descendant.dispatchEvent(
      new TransitionEvent('transitionend', { propertyName: 'opacity', bubbles: true, composed: true })
    );
    expect(sb.isConnected).toBe(true); // target wasn't the host itself — must not have been removed
  });

  it("ignores the host's own non-opacity transitionend (e.g. display/overlay, which also transition)", async () => {
    const sb = el.show({ message: 'Saved!' });
    await sb.updateComplete;
    await sb.updateComplete;
    sb.hide();
    await sb.updateComplete;

    // The same CSS also transitions display/overlay (for allow-discrete) — a real browser may fire their own
    // transitionend events too, not necessarily after opacity's. Only opacity should trigger removal.
    sb.dispatchEvent(new TransitionEvent('transitionend', { propertyName: 'display' }));
    expect(sb.isConnected).toBe(true);

    sb.dispatchEvent(new TransitionEvent('transitionend', { propertyName: 'opacity' }));
    expect(sb.isConnected).toBe(false);
  });

  it('removes immediately when the user prefers reduced motion (no transitionend would ever fire)', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) => ({ matches: query === '(prefers-reduced-motion: reduce)' }) as MediaQueryList
    );
    const sb = el.show({ message: 'Saved!' });
    await sb.updateComplete;
    await sb.updateComplete;

    sb.hide();
    await sb.updateComplete;
    expect(sb.isConnected).toBe(false);
  });

  it("the returned instance's own hide() dismisses it and promotes the queue, same as auto-dismiss would", async () => {
    const first = el.show({ message: 'First' });
    const second = el.show({ message: 'Second' });
    await first.updateComplete;
    await first.updateComplete;

    first.hide();
    await first.updateComplete;
    exitTransition(first);
    await second.updateComplete;
    await second.updateComplete;

    expect(second.open).toBe(true);
  });
});
