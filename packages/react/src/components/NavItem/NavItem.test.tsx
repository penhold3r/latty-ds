import { fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';
import { NavItem } from './NavItem';

describe('NavItem', () => {
  it('renders lt-nav-item', () => {
    const { container } = render(<NavItem label="Home" />);
    expect(container.querySelector('lt-nav-item')).toBeTruthy();
  });

  it('passes label as attribute', () => {
    const { container } = render(<NavItem label="Settings" />);
    expect(container.querySelector('lt-nav-item')?.getAttribute('label')).toBe('Settings');
  });

  it('passes href as attribute', () => {
    const { container } = render(<NavItem href="/home" />);
    expect(container.querySelector('lt-nav-item')?.getAttribute('href')).toBe('/home');
  });

  it('passes iconStart as attribute', () => {
    const { container } = render(<NavItem iconStart="home" />);
    expect(container.querySelector('lt-nav-item')?.getAttribute('icon-start')).toBe('home');
  });

  it('passes active as attribute', () => {
    const { container } = render(<NavItem active />);
    expect(container.querySelector('lt-nav-item')).toHaveAttribute('active');
  });

  it('passes disabled as attribute', () => {
    const { container } = render(<NavItem disabled />);
    expect(container.querySelector('lt-nav-item')).toHaveAttribute('disabled');
  });

  it('renders children (sub-items)', () => {
    const { getByText } = render(<NavItem label="Parent">Child item</NavItem>);
    expect(getByText('Child item')).toBeTruthy();
  });

  it('forwards ref to lt-nav-item element', () => {
    const ref = createRef<any>();
    render(<NavItem ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-nav-item');
  });

  it('wires onToggle with the open state from the toggle event', () => {
    const handler = vi.fn();
    const { container } = render(<NavItem onToggle={handler} />);
    const el = container.querySelector('lt-nav-item')!;
    el.dispatchEvent(new CustomEvent('toggle', { detail: { open: true }, bubbles: true }));
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail).toEqual({ open: true });
  });

  it('lets React onClick handle the native click (no custom nav click event)', () => {
    const handler = vi.fn();
    const { container } = render(<NavItem onClick={handler} />);
    fireEvent.click(container.querySelector('lt-nav-item')!);
    expect(handler).toHaveBeenCalledOnce();
  });
});
