import { render } from '@testing-library/react';
import { createRef } from 'react';
import { ListItem } from './ListItem';

describe('ListItem', () => {
  it('renders lt-list-item', () => {
    const { container } = render(<ListItem />);
    expect(container.querySelector('lt-list-item')).toBeTruthy();
  });

  it('renders children', () => {
    const { getByText } = render(<ListItem>Item text</ListItem>);
    expect(getByText('Item text')).toBeTruthy();
  });

  it('forwards ref to lt-list-item element', () => {
    const ref = createRef<any>();
    render(<ListItem ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-list-item');
  });
});
