import { render } from '@testing-library/react';
import { createRef } from 'react';
import { BreadcrumbItem } from './BreadcrumbItem';

describe('BreadcrumbItem', () => {
  it('renders lt-breadcrumb-item', () => {
    const { container } = render(<BreadcrumbItem>Home</BreadcrumbItem>);
    expect(container.querySelector('lt-breadcrumb-item')).toBeTruthy();
  });

  it('passes href as attribute', () => {
    const { container } = render(<BreadcrumbItem href="/home">Home</BreadcrumbItem>);
    expect(container.querySelector('lt-breadcrumb-item')?.getAttribute('href')).toBe('/home');
  });

  it('passes current as attribute', () => {
    const { container } = render(<BreadcrumbItem current>Settings</BreadcrumbItem>);
    expect(container.querySelector('lt-breadcrumb-item')).toHaveAttribute('current');
  });

  it('renders children', () => {
    const { getByText } = render(<BreadcrumbItem>Products</BreadcrumbItem>);
    expect(getByText('Products')).toBeTruthy();
  });

  it('forwards ref to lt-breadcrumb-item element', () => {
    const ref = createRef<any>();
    render(<BreadcrumbItem ref={ref}>Home</BreadcrumbItem>);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-breadcrumb-item');
  });
});
