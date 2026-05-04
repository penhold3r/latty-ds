import { render } from '@testing-library/react';
import { createRef } from 'react';
import { RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  it('renders lt-radio-group', () => {
    const { container } = render(<RadioGroup />);
    expect(container.querySelector('lt-radio-group')).toBeTruthy();
  });

  it('passes label as attribute', () => {
    const { container } = render(<RadioGroup label="Pick one" />);
    expect(container.querySelector('lt-radio-group')?.getAttribute('label')).toBe('Pick one');
  });

  it('passes orientation as attribute', () => {
    const { container } = render(<RadioGroup orientation="horizontal" />);
    expect(container.querySelector('lt-radio-group')?.getAttribute('orientation')).toBe('horizontal');
  });

  it('passes required as attribute', () => {
    const { container } = render(<RadioGroup required />);
    expect(container.querySelector('lt-radio-group')).toHaveAttribute('required');
  });

  it('forwards ref to lt-radio-group element', () => {
    const ref = createRef<any>();
    render(<RadioGroup ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-radio-group');
  });

  it('calls onChange when change event fires', () => {
    const onChange = vi.fn();
    const { container } = render(<RadioGroup onChange={onChange} />);
    container.querySelector('lt-radio-group')!.dispatchEvent(new CustomEvent('change'));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('removes change listener on unmount', () => {
    const onChange = vi.fn();
    const { container, unmount } = render(<RadioGroup onChange={onChange} />);
    const el = container.querySelector('lt-radio-group')!;
    unmount();
    el.dispatchEvent(new CustomEvent('change'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
