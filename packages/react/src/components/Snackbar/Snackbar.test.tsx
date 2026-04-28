import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Snackbar } from './Snackbar';

describe('Snackbar', () => {
  it('renders lt-snackbar', () => {
    const { container } = render(<Snackbar>Message</Snackbar>);
    expect(container.querySelector('lt-snackbar')).toBeTruthy();
  });

  it('passes variant as attribute', () => {
    const { container } = render(<Snackbar variant="success">Message</Snackbar>);
    expect(container.querySelector('lt-snackbar')?.getAttribute('variant')).toBe('success');
  });

  it('passes open as attribute', () => {
    const { container } = render(<Snackbar open>Message</Snackbar>);
    expect(container.querySelector('lt-snackbar')).toHaveAttribute('open');
  });

  it('forwards ref to lt-snackbar element', () => {
    const ref = createRef<any>();
    render(<Snackbar ref={ref}>Message</Snackbar>);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-snackbar');
  });

  it('calls onLtShow when lt-show event fires', () => {
    const onLtShow = vi.fn();
    const { container } = render(<Snackbar onLtShow={onLtShow}>Message</Snackbar>);
    container.querySelector('lt-snackbar')!.dispatchEvent(new CustomEvent('lt-show'));
    expect(onLtShow).toHaveBeenCalledOnce();
  });

  it('calls onLtHide when lt-hide event fires', () => {
    const onLtHide = vi.fn();
    const { container } = render(<Snackbar onLtHide={onLtHide}>Message</Snackbar>);
    container.querySelector('lt-snackbar')!.dispatchEvent(new CustomEvent('lt-hide'));
    expect(onLtHide).toHaveBeenCalledOnce();
  });

  it('calls onLtAction when lt-action event fires', () => {
    const onLtAction = vi.fn();
    const { container } = render(<Snackbar onLtAction={onLtAction}>Message</Snackbar>);
    container.querySelector('lt-snackbar')!.dispatchEvent(new CustomEvent('lt-action'));
    expect(onLtAction).toHaveBeenCalledOnce();
  });

  it('removes event listeners on unmount', () => {
    const onLtShow = vi.fn();
    const { container, unmount } = render(<Snackbar onLtShow={onLtShow}>Message</Snackbar>);
    const el = container.querySelector('lt-snackbar')!;
    unmount();
    el.dispatchEvent(new CustomEvent('lt-show'));
    expect(onLtShow).not.toHaveBeenCalled();
  });
});
