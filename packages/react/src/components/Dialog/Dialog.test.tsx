import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Alert } from '../Alert/Alert';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('renders lt-dialog', () => {
    const { container } = render(<Dialog>Content</Dialog>);
    expect(container.querySelector('lt-dialog')).toBeTruthy();
  });

  it('passes heading as attribute', () => {
    const { container } = render(<Dialog heading="Confirm">Content</Dialog>);
    expect(container.querySelector('lt-dialog')?.getAttribute('heading')).toBe('Confirm');
  });

  // The deprecated `title` alias's actual behavior (forwarding to `heading`, stripping the native attribute so
  // no tooltip shows) is @latty-ds/web's own runtime logic, not this wrapper's — verified end to end against the
  // real element in packages/web/src/components/dialog/__tests__/dialog.test.ts (DLG-6), not here. This wrapper
  // is a thin prop-forwarder; registering the real element in this shared test file would risk leaking its
  // side effects (e.g. document.body.style.overflow while "open") into sibling tests below.

  it('passes open as attribute', () => {
    const { container } = render(<Dialog open>Content</Dialog>);
    expect(container.querySelector('lt-dialog')).toHaveAttribute('open');
  });

  it('passes size as attribute', () => {
    const { container } = render(<Dialog size="lg">Content</Dialog>);
    expect(container.querySelector('lt-dialog')?.getAttribute('size')).toBe('lg');
  });

  it('forwards ref to lt-dialog element', () => {
    const ref = createRef<any>();
    render(<Dialog ref={ref}>Content</Dialog>);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-dialog');
  });

  it('calls onOpen when open fires', () => {
    const onOpen = vi.fn();
    const { container } = render(<Dialog onOpen={onOpen}>Content</Dialog>);
    container.querySelector('lt-dialog')!.dispatchEvent(new CustomEvent('open'));
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it('calls onClose when close fires', () => {
    const onClose = vi.fn();
    const { container } = render(<Dialog onClose={onClose}>Content</Dialog>);
    container.querySelector('lt-dialog')!.dispatchEvent(new CustomEvent('close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('removes event listeners on unmount', () => {
    const onOpen = vi.fn();
    const { container, unmount } = render(<Dialog onOpen={onOpen}>Content</Dialog>);
    const el = container.querySelector('lt-dialog')!;
    unmount();
    el.dispatchEvent(new CustomEvent('open'));
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('lets a nested component stop its own event from reaching the outer onClose', () => {
    const outer = vi.fn();
    const inner = vi.fn((e: CustomEvent) => e.stopPropagation());
    const { container } = render(
      <Dialog onClose={outer}>
        <Alert onClose={inner}>Body</Alert>
      </Dialog>
    );

    // Events bubble like native ones, so without stopPropagation the dialog would hear the alert's close.
    container.querySelector('lt-alert')!.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));

    expect(inner).toHaveBeenCalledOnce();
    expect(outer).not.toHaveBeenCalled();
  });

  it('without stopPropagation the outer onClose does hear the nested close (consumer composes)', () => {
    const outer = vi.fn();
    const { container } = render(
      <Dialog onClose={outer}>
        <Alert onClose={() => {}}>Body</Alert>
      </Dialog>
    );

    container.querySelector('lt-alert')!.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));

    expect(outer).toHaveBeenCalledOnce();
  });
});
