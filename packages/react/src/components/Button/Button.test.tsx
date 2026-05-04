import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Button } from './Button';

describe('Button', () => {
  it('renders lt-button', () => {
    const { container } = render(<Button>Click</Button>);
    expect(container.querySelector('lt-button')).toBeTruthy();
  });

  it('passes variant as attribute', () => {
    const { container } = render(<Button variant="secondary">Click</Button>);
    expect(container.querySelector('lt-button')?.getAttribute('variant')).toBe('secondary');
  });

  it('passes size as attribute', () => {
    const { container } = render(<Button size="lg">Click</Button>);
    expect(container.querySelector('lt-button')?.getAttribute('size')).toBe('lg');
  });

  it('passes disabled as attribute', () => {
    const { container } = render(<Button disabled>Click</Button>);
    expect(container.querySelector('lt-button')).toHaveAttribute('disabled');
  });

  it('renders children', () => {
    const { getByText } = render(<Button>Submit</Button>);
    expect(getByText('Submit')).toBeTruthy();
  });

  it('forwards ref to lt-button element', () => {
    const ref = createRef<any>();
    render(<Button ref={ref}>Click</Button>);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-button');
  });
});
