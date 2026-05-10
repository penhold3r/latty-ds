import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
  it('renders lt-breadcrumb', () => {
    const { container } = render(<Breadcrumb />);
    expect(container.querySelector('lt-breadcrumb')).toBeTruthy();
  });

  it('renders children', () => {
    const { getByText } = render(<Breadcrumb>Home</Breadcrumb>);
    expect(getByText('Home')).toBeTruthy();
  });

  it('forwards ref to lt-breadcrumb element', () => {
    const ref = createRef<any>();
    render(<Breadcrumb ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-breadcrumb');
  });
});
