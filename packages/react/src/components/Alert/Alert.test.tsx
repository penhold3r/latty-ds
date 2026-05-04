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

  it('calls onLtClose when lt-close event fires', () => {
    const onLtClose = vi.fn();
    const { container } = render(<Alert onLtClose={onLtClose}>Message</Alert>);
    container.querySelector('lt-alert')!.dispatchEvent(new CustomEvent('lt-close'));
    expect(onLtClose).toHaveBeenCalledOnce();
  });

  it('removes lt-close listener on unmount', () => {
    const onLtClose = vi.fn();
    const { container, unmount } = render(<Alert onLtClose={onLtClose}>Message</Alert>);
    const el = container.querySelector('lt-alert')!;
    unmount();
    el.dispatchEvent(new CustomEvent('lt-close'));
    expect(onLtClose).not.toHaveBeenCalled();
  });
});
