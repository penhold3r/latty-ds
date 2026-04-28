import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Select } from './Select';

describe('Select', () => {
  it('renders lt-select', () => {
    const { container } = render(<Select />);
    expect(container.querySelector('lt-select')).toBeTruthy();
  });

  it('passes label as attribute', () => {
    const { container } = render(<Select label="Country" />);
    expect(container.querySelector('lt-select')?.getAttribute('label')).toBe('Country');
  });

  it('passes placeholder as attribute', () => {
    const { container } = render(<Select placeholder="Choose..." />);
    expect(container.querySelector('lt-select')?.getAttribute('placeholder')).toBe('Choose...');
  });

  it('passes disabled as attribute', () => {
    const { container } = render(<Select disabled />);
    expect(container.querySelector('lt-select')).toHaveAttribute('disabled');
  });

  it('forwards ref to lt-select element', () => {
    const ref = createRef<any>();
    render(<Select ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-select');
  });

  it('calls onChange when change event fires', () => {
    const onChange = vi.fn();
    const { container } = render(<Select onChange={onChange} />);
    container.querySelector('lt-select')!.dispatchEvent(new CustomEvent('change'));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('removes change listener on unmount', () => {
    const onChange = vi.fn();
    const { container, unmount } = render(<Select onChange={onChange} />);
    const el = container.querySelector('lt-select')!;
    unmount();
    el.dispatchEvent(new CustomEvent('change'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
