import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders lt-spinner', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('lt-spinner')).toBeTruthy();
  });

  it('passes size as attribute', () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.querySelector('lt-spinner')?.getAttribute('size')).toBe('lg');
  });

  it('passes variant as attribute', () => {
    const { container } = render(<Spinner variant="secondary" />);
    expect(container.querySelector('lt-spinner')?.getAttribute('variant')).toBe('secondary');
  });

  it('forwards ref to lt-spinner element', () => {
    const ref = createRef<any>();
    render(<Spinner ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-spinner');
  });
});
