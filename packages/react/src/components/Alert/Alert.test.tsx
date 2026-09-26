import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders lt-alert', () => {
    const { container } = render(<Alert>Message</Alert>);
    expect(container.querySelector('lt-alert')).toBeTruthy();
  });

  it('passes variant as attribute', () => {
    const { container } = render(<Alert variant="success">Message</Alert>);
    expect(container.querySelector('lt-alert')?.getAttribute('variant')).toBe('success');
  });

  it('passes title as attribute', () => {
    const { container } = render(<Alert title="Heads up">Message</Alert>);
    expect(container.querySelector('lt-alert')?.getAttribute('title')).toBe('Heads up');
  });

  it('passes closable as attribute', () => {
    const { container } = render(<Alert closable>Message</Alert>);
    expect(container.querySelector('lt-alert')).toHaveAttribute('closable');
  });

  it('forwards ref to lt-alert element', () => {
    const ref = createRef<any>();
    render(<Alert ref={ref}>Message</Alert>);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-alert');
  });

  it('calls onClose when close event fires', () => {
    const onClose = vi.fn();
    const { container } = render(<Alert onClose={onClose}>Message</Alert>);
    container.querySelector('lt-alert')!.dispatchEvent(new CustomEvent('close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('removes close listener on unmount', () => {
    const onClose = vi.fn();
    const { container, unmount } = render(<Alert onClose={onClose}>Message</Alert>);
    const el = container.querySelector('lt-alert')!;
    unmount();
    el.dispatchEvent(new CustomEvent('close'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('passes the event to onClose, so a cancelable close can be cancelled from React', () => {
    const onClose = vi.fn((e: CustomEvent) => e.preventDefault());
    const { container } = render(<Alert onClose={onClose}>Body</Alert>);
    const notCancelled = container
      .querySelector('lt-alert')!
      .dispatchEvent(new CustomEvent('close', { cancelable: true }));

    expect(onClose).toHaveBeenCalledOnce();
    expect(onClose.mock.calls[0][0]).toBeInstanceOf(CustomEvent);
    expect(notCancelled).toBe(false);
  });
});
