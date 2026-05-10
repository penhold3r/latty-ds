import { render } from '@testing-library/react';
import { createRef } from 'react';
import { SidePanel } from './SidePanel';

describe('SidePanel', () => {
  it('renders lt-sidepanel', () => {
    const { container } = render(<SidePanel />);
    expect(container.querySelector('lt-sidepanel')).toBeTruthy();
  });

  it('passes open as attribute', () => {
    const { container } = render(<SidePanel open />);
    expect(container.querySelector('lt-sidepanel')).toHaveAttribute('open');
  });

  it('passes anchor as attribute', () => {
    const { container } = render(<SidePanel anchor="right" />);
    expect(container.querySelector('lt-sidepanel')?.getAttribute('anchor')).toBe('right');
  });

  it('passes size as attribute', () => {
    const { container } = render(<SidePanel size="320px" />);
    expect(container.querySelector('lt-sidepanel')?.getAttribute('size')).toBe('320px');
  });

  it('passes label as attribute', () => {
    const { container } = render(<SidePanel label="Navigation" />);
    expect(container.querySelector('lt-sidepanel')?.getAttribute('label')).toBe('Navigation');
  });

  it('passes no-close-button as attribute', () => {
    const { container } = render(<SidePanel noCloseButton />);
    expect(container.querySelector('lt-sidepanel')).toHaveAttribute('no-close-button');
  });

  it('renders children', () => {
    const { getByText } = render(<SidePanel>Panel content</SidePanel>);
    expect(getByText('Panel content')).toBeTruthy();
  });

  it('forwards ref to lt-sidepanel element', () => {
    const ref = createRef<any>();
    render(<SidePanel ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-sidepanel');
  });

  it('wires onLtClose event handler', () => {
    const handler = vi.fn();
    const { container } = render(<SidePanel onLtClose={handler} />);
    const el = container.querySelector('lt-sidepanel')!;
    el.dispatchEvent(new CustomEvent('lt-close', { bubbles: true }));
    expect(handler).toHaveBeenCalledOnce();
  });
});
