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

  it('calls onShow when show event fires', () => {
    const onShow = vi.fn();
    const { container } = render(<Snackbar onShow={onShow}>Message</Snackbar>);
    container.querySelector('lt-snackbar')!.dispatchEvent(new CustomEvent('show'));
    expect(onShow).toHaveBeenCalledOnce();
  });

  it('calls onHide when hide event fires', () => {
    const onHide = vi.fn();
    const { container } = render(<Snackbar onHide={onHide}>Message</Snackbar>);
    container.querySelector('lt-snackbar')!.dispatchEvent(new CustomEvent('hide'));
    expect(onHide).toHaveBeenCalledOnce();
  });

  it('calls onAction when action event fires', () => {
    const onAction = vi.fn();
    const { container } = render(<Snackbar onAction={onAction}>Message</Snackbar>);
    container.querySelector('lt-snackbar')!.dispatchEvent(new CustomEvent('action'));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it('removes event listeners on unmount', () => {
    const onShow = vi.fn();
    const { container, unmount } = render(<Snackbar onShow={onShow}>Message</Snackbar>);
    const el = container.querySelector('lt-snackbar')!;
    unmount();
    el.dispatchEvent(new CustomEvent('show'));
    expect(onShow).not.toHaveBeenCalled();
  });
});
