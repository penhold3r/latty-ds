import { render } from '@testing-library/react';
import { createRef } from 'react';
import { List } from './List';

describe('List', () => {
  it('renders lt-list', () => {
    const { container } = render(<List />);
    expect(container.querySelector('lt-list')).toBeTruthy();
  });

  it('passes type as attribute', () => {
    const { container } = render(<List type="ordered" />);
    expect(container.querySelector('lt-list')?.getAttribute('type')).toBe('ordered');
  });

  it('passes size as attribute', () => {
    const { container } = render(<List size="lg" />);
    expect(container.querySelector('lt-list')?.getAttribute('size')).toBe('lg');
  });

  it('renders children', () => {
    const { getByText } = render(<List>item</List>);
    expect(getByText('item')).toBeTruthy();
  });

  it('forwards ref to lt-list element', () => {
    const ref = createRef<any>();
    render(<List ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-list');
  });
});
