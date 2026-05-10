import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  it('renders lt-dropdown', () => {
    const { container } = render(<Dropdown />);
    expect(container.querySelector('lt-dropdown')).toBeTruthy();
  });

  it('passes open as attribute', () => {
    const { container } = render(<Dropdown open />);
    expect(container.querySelector('lt-dropdown')).toHaveAttribute('open');
  });

  it('passes placement as attribute', () => {
    const { container } = render(<Dropdown placement="top-start" />);
    expect(container.querySelector('lt-dropdown')?.getAttribute('placement')).toBe('top-start');
  });

  it('renders children', () => {
    const { getByText } = render(<Dropdown>Menu content</Dropdown>);
    expect(getByText('Menu content')).toBeTruthy();
  });

  it('forwards ref to lt-dropdown element', () => {
    const ref = createRef<any>();
    render(<Dropdown ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-dropdown');
  });

  it('wires onLtOpen event handler', () => {
    const handler = vi.fn();
    const { container } = render(<Dropdown onLtOpen={handler} />);
    const el = container.querySelector('lt-dropdown')!;
    el.dispatchEvent(new CustomEvent('lt-open', { bubbles: true }));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('wires onLtClose event handler', () => {
    const handler = vi.fn();
    const { container } = render(<Dropdown onLtClose={handler} />);
    const el = container.querySelector('lt-dropdown')!;
    el.dispatchEvent(new CustomEvent('lt-close', { bubbles: true }));
    expect(handler).toHaveBeenCalledOnce();
  });
});
