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

  it('calls onDialogOpen when dialog-open fires', () => {
    const onDialogOpen = vi.fn();
    const { container } = render(<Dialog onDialogOpen={onDialogOpen}>Content</Dialog>);
    container.querySelector('lt-dialog')!.dispatchEvent(new CustomEvent('dialog-open'));
    expect(onDialogOpen).toHaveBeenCalledOnce();
  });

  it('calls onDialogClose when dialog-close fires', () => {
    const onDialogClose = vi.fn();
    const { container } = render(<Dialog onDialogClose={onDialogClose}>Content</Dialog>);
    container.querySelector('lt-dialog')!.dispatchEvent(new CustomEvent('dialog-close'));
    expect(onDialogClose).toHaveBeenCalledOnce();
  });

  it('removes event listeners on unmount', () => {
    const onDialogOpen = vi.fn();
    const { container, unmount } = render(<Dialog onDialogOpen={onDialogOpen}>Content</Dialog>);
    const el = container.querySelector('lt-dialog')!;
    unmount();
    el.dispatchEvent(new CustomEvent('dialog-open'));
    expect(onDialogOpen).not.toHaveBeenCalled();
  });
});
