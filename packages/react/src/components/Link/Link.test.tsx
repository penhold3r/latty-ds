import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Link } from './Link';

describe('Link', () => {
  it('renders lt-link', () => {
    const { container } = render(<Link href="/home">Home</Link>);
    expect(container.querySelector('lt-link')).toBeTruthy();
  });

  it('passes href as attribute', () => {
    const { container } = render(<Link href="/about">About</Link>);
    expect(container.querySelector('lt-link')?.getAttribute('href')).toBe('/about');
  });

  it('passes external as attribute', () => {
    const { container } = render(
      <Link href="https://example.com" external>
        External
      </Link>
    );
    expect(container.querySelector('lt-link')).toHaveAttribute('external');
  });

  it('renders children', () => {
    const { getByText } = render(<Link href="/home">Go home</Link>);
    expect(getByText('Go home')).toBeTruthy();
  });

  it('forwards ref to lt-link element', () => {
    const ref = createRef<any>();
    render(
      <Link href="/home" ref={ref}>
        Home
      </Link>
    );
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-link');
  });
});
