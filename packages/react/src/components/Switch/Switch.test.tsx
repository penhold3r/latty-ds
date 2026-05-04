import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders lt-switch', () => {
    const { container } = render(<Switch />);
    expect(container.querySelector('lt-switch')).toBeTruthy();
  });

  it('passes label as attribute', () => {
    const { container } = render(<Switch label="Enable" />);
    expect(container.querySelector('lt-switch')?.getAttribute('label')).toBe('Enable');
  });

  it('passes checked as attribute', () => {
    const { container } = render(<Switch checked />);
    expect(container.querySelector('lt-switch')).toHaveAttribute('checked');
  });

  it('passes disabled as attribute', () => {
    const { container } = render(<Switch disabled />);
    expect(container.querySelector('lt-switch')).toHaveAttribute('disabled');
  });

  it('forwards ref to lt-switch element', () => {
    const ref = createRef<any>();
    render(<Switch ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-switch');
  });

  it('calls onChange when change event fires', () => {
    const onChange = vi.fn();
    const { container } = render(<Switch onChange={onChange} />);
    container.querySelector('lt-switch')!.dispatchEvent(new CustomEvent('change'));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('removes change listener on unmount', () => {
    const onChange = vi.fn();
    const { container, unmount } = render(<Switch onChange={onChange} />);
    const el = container.querySelector('lt-switch')!;
    unmount();
    el.dispatchEvent(new CustomEvent('change'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
