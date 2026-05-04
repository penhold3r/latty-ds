import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('renders lt-dialog', () => {
    const { container } = render(<Dialog>Content</Dialog>);
    expect(container.querySelector('lt-dialog')).toBeTruthy();
  });

  it('passes title as attribute', () => {
    const { container } = render(<Dialog title="Confirm">Content</Dialog>);
    expect(container.querySelector('lt-dialog')?.getAttribute('title')).toBe('Confirm');
  });

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

  it('calls onLtDialogOpen when lt-dialog-open fires', () => {
    const onLtDialogOpen = vi.fn();
    const { container } = render(<Dialog onLtDialogOpen={onLtDialogOpen}>Content</Dialog>);
    container.querySelector('lt-dialog')!.dispatchEvent(new CustomEvent('lt-dialog-open'));
    expect(onLtDialogOpen).toHaveBeenCalledOnce();
  });

  it('calls onLtDialogClose when lt-dialog-close fires', () => {
    const onLtDialogClose = vi.fn();
    const { container } = render(<Dialog onLtDialogClose={onLtDialogClose}>Content</Dialog>);
    container.querySelector('lt-dialog')!.dispatchEvent(new CustomEvent('lt-dialog-close'));
    expect(onLtDialogClose).toHaveBeenCalledOnce();
  });

  it('removes event listeners on unmount', () => {
    const onLtDialogOpen = vi.fn();
    const { container, unmount } = render(<Dialog onLtDialogOpen={onLtDialogOpen}>Content</Dialog>);
    const el = container.querySelector('lt-dialog')!;
    unmount();
    el.dispatchEvent(new CustomEvent('lt-dialog-open'));
    expect(onLtDialogOpen).not.toHaveBeenCalled();
  });
});
