import { render } from '@testing-library/react';
import { createRef } from 'react';
import { TabGroup } from './TabGroup';

describe('TabGroup', () => {
  it('renders lt-tab-group', () => {
    const { container } = render(<TabGroup />);
    expect(container.querySelector('lt-tab-group')).toBeTruthy();
  });

  it('passes value as attribute', () => {
    const { container } = render(<TabGroup value="settings" />);
    expect(container.querySelector('lt-tab-group')?.getAttribute('value')).toBe('settings');
  });

  it('passes variant as attribute', () => {
    const { container } = render(<TabGroup variant="pills" />);
    expect(container.querySelector('lt-tab-group')?.getAttribute('variant')).toBe('pills');
  });

  it('forwards ref to lt-tab-group element', () => {
    const ref = createRef<any>();
    render(<TabGroup ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-tab-group');
  });

  it('calls onChange when change event fires', () => {
    const onChange = vi.fn();
    const { container } = render(<TabGroup onChange={onChange} />);
    container.querySelector('lt-tab-group')!.dispatchEvent(new CustomEvent('change'));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('removes change listener on unmount', () => {
    const onChange = vi.fn();
    const { container, unmount } = render(<TabGroup onChange={onChange} />);
    const el = container.querySelector('lt-tab-group')!;
    unmount();
    el.dispatchEvent(new CustomEvent('change'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
