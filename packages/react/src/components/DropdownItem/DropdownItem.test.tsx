import { render } from '@testing-library/react';
import { createRef } from 'react';
import { DropdownItem } from './DropdownItem';

describe('DropdownItem', () => {
  it('renders lt-dropdown-item', () => {
    const { container } = render(<DropdownItem>Action</DropdownItem>);
    expect(container.querySelector('lt-dropdown-item')).toBeTruthy();
  });

  it('passes disabled as attribute', () => {
    const { container } = render(<DropdownItem disabled>Action</DropdownItem>);
    expect(container.querySelector('lt-dropdown-item')).toHaveAttribute('disabled');
  });

  it('passes selected as attribute', () => {
    const { container } = render(<DropdownItem selected>Action</DropdownItem>);
    expect(container.querySelector('lt-dropdown-item')).toHaveAttribute('selected');
  });

  it('passes href as attribute', () => {
    const { container } = render(<DropdownItem href="/path">Link</DropdownItem>);
    expect(container.querySelector('lt-dropdown-item')?.getAttribute('href')).toBe('/path');
  });

  it('renders children', () => {
    const { getByText } = render(<DropdownItem>Delete</DropdownItem>);
    expect(getByText('Delete')).toBeTruthy();
  });

  it('forwards ref to lt-dropdown-item element', () => {
    const ref = createRef<any>();
    render(<DropdownItem ref={ref}>Action</DropdownItem>);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-dropdown-item');
  });

  it('wires onSelect event handler', () => {
    const handler = vi.fn();
    const { container } = render(<DropdownItem onSelect={handler}>Action</DropdownItem>);
    const el = container.querySelector('lt-dropdown-item')!;
    el.dispatchEvent(new CustomEvent('select', { bubbles: true }));
    expect(handler).toHaveBeenCalledOnce();
  });
});
