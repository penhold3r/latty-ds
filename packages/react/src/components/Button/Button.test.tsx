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

  // Regression guard for a bug found 2026-10-19 (a friend dogfooding @latty-ds/react in Next.js): for a custom
  // element, React stringifies `false` into the attribute instead of omitting it like it does for a recognized
  // attribute on a real HTML element — `disabled={false}` left `disabled="false"` on the element, which Lit's
  // boolean converter (presence-based, like the platform's own) still read as true, so the button never
  // re-enabled. Fixed in scripts/codegen-wrappers.mjs by coercing every boolean field to `value || undefined`
  // before it reaches the element, so `false` omits the attribute entirely, the same as never setting it.
  it('re-enables when disabled goes from true to false', () => {
    const { container, rerender } = render(<Button disabled>Click</Button>);
    const el = container.querySelector('lt-button')!;
    expect(el.hasAttribute('disabled')).toBe(true);
    rerender(<Button disabled={false}>Click</Button>);
    expect(el.hasAttribute('disabled')).toBe(false);
  });

  // Regression guard for the same report: for a custom element, React never maps a camelCase JSX prop to its real
  // kebab-case HTML attribute the way it does for a real HTML element — it writes the prop name verbatim, which
  // the HTML parser then lowercases with the word boundary lost ("iconStart" -> "iconstart", not "icon-start"),
  // so the actual component (which only watches for `icon-start`) never saw the value — most visible under SSR,
  // where the attribute string is all a server ever has to work with (no live property to fall back on).
  it('sets icon-start (not iconstart/iconStart) so the inner lt-icon actually renders', () => {
    const { container } = render(<Button iconStart="home">Click</Button>);
    const el = container.querySelector('lt-button')!;
    expect(el.getAttribute('icon-start')).toBe('home');
    expect(el.getAttribute('iconStart')).toBeNull();
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
