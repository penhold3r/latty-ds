import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders lt-chip', () => {
    const { container } = render(<Chip>Label</Chip>);
    expect(container.querySelector('lt-chip')).toBeTruthy();
  });

  it('passes appearance as attribute', () => {
    const { container } = render(<Chip appearance="outlined">Label</Chip>);
    expect(container.querySelector('lt-chip')?.getAttribute('appearance')).toBe('outlined');
  });

  it('passes deletable as attribute', () => {
    const { container } = render(<Chip deletable>Label</Chip>);
    expect(container.querySelector('lt-chip')).toHaveAttribute('deletable');
  });

  it('passes disabled as attribute', () => {
    const { container } = render(<Chip disabled>Label</Chip>);
    expect(container.querySelector('lt-chip')).toHaveAttribute('disabled');
  });

  it('forwards ref to lt-chip element', () => {
    const ref = createRef<any>();
    render(<Chip ref={ref}>Label</Chip>);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-chip');
  });

  it('calls onLtDelete when lt-delete event fires', () => {
    const onLtDelete = vi.fn();
    const { container } = render(<Chip onLtDelete={onLtDelete}>Label</Chip>);
    container.querySelector('lt-chip')!.dispatchEvent(new CustomEvent('lt-delete'));
    expect(onLtDelete).toHaveBeenCalledOnce();
  });

  it('removes lt-delete listener on unmount', () => {
    const onLtDelete = vi.fn();
    const { container, unmount } = render(<Chip onLtDelete={onLtDelete}>Label</Chip>);
    const el = container.querySelector('lt-chip')!;
    unmount();
    el.dispatchEvent(new CustomEvent('lt-delete'));
    expect(onLtDelete).not.toHaveBeenCalled();
  });
});
