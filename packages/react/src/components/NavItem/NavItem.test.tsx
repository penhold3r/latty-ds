import { render } from '@testing-library/react';
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

  it('wires onNavItemClick event handler', () => {
    const handler = vi.fn();
    const { container } = render(<NavItem onNavItemClick={handler} />);
    const el = container.querySelector('lt-nav-item')!;
    el.dispatchEvent(new CustomEvent('nav-item-click', { bubbles: true }));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('wires onNavCollapse event handler', () => {
    const handler = vi.fn();
    const { container } = render(<NavItem onNavCollapse={handler} />);
    const el = container.querySelector('lt-nav-item')!;
    el.dispatchEvent(new CustomEvent('nav-collapse', { bubbles: true }));
    expect(handler).toHaveBeenCalledOnce();
  });
});
