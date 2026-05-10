import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Nav } from './Nav';

describe('Nav', () => {
  it('renders lt-nav', () => {
    const { container } = render(<Nav />);
    expect(container.querySelector('lt-nav')).toBeTruthy();
  });

  it('passes orientation as attribute', () => {
    const { container } = render(<Nav orientation="horizontal" />);
    expect(container.querySelector('lt-nav')?.getAttribute('orientation')).toBe('horizontal');
  });

  it('renders children', () => {
    const { getByText } = render(<Nav>Nav content</Nav>);
    expect(getByText('Nav content')).toBeTruthy();
  });

  it('forwards ref to lt-nav element', () => {
    const ref = createRef<any>();
    render(<Nav ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-nav');
  });
});
