import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Table } from './Table';

describe('Table', () => {
  it('renders lt-table', () => {
    const { container } = render(<Table />);
    expect(container.querySelector('lt-table')).toBeTruthy();
  });

  it('passes density as attribute', () => {
    const { container } = render(<Table density="compact" />);
    expect(container.querySelector('lt-table')?.getAttribute('density')).toBe('compact');
  });

  it('passes loading as attribute', () => {
    const { container } = render(<Table loading />);
    expect(container.querySelector('lt-table')).toHaveAttribute('loading');
  });

  it('passes striped as attribute', () => {
    const { container } = render(<Table striped />);
    expect(container.querySelector('lt-table')).toHaveAttribute('striped');
  });

  it('forwards ref to lt-table element', () => {
    const ref = createRef<any>();
    render(<Table ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-table');
  });

  it('calls onLtSortChange when lt-sort-change event fires', () => {
    const onLtSortChange = vi.fn();
    const { container } = render(<Table onLtSortChange={onLtSortChange} />);
    container.querySelector('lt-table')!.dispatchEvent(new CustomEvent('lt-sort-change'));
    expect(onLtSortChange).toHaveBeenCalledOnce();
  });

  it('removes lt-sort-change listener on unmount', () => {
    const onLtSortChange = vi.fn();
    const { container, unmount } = render(<Table onLtSortChange={onLtSortChange} />);
    const el = container.querySelector('lt-table')!;
    unmount();
    el.dispatchEvent(new CustomEvent('lt-sort-change'));
    expect(onLtSortChange).not.toHaveBeenCalled();
  });
});
