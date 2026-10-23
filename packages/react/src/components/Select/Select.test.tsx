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

  /*
   * React 18 (the version actually installed here, the repo's declared peer floor) stringifies non-primitive
   * JSX props into DOM attributes for unknown elements instead of setting the property — `options={[...]}`
   * became `attribute options="[object Object]"`, the real `options` property left undefined (X7).
   */
  it('sets options as a real property, not a stringified attribute (X7)', () => {
    const options = [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' }
    ];
    const { container } = render(<Select options={options} />);
    const el = container.querySelector('lt-select') as HTMLElement & { options: typeof options };
    expect(el.options).toBe(options);
    expect(el.getAttribute('options')).toBeNull();
  });

  it('updates the options property when the prop changes', () => {
    const first = [{ value: 'a', label: 'A' }];
    const second = [{ value: 'b', label: 'B' }];
    const { container, rerender } = render(<Select options={first} />);
    const el = container.querySelector('lt-select') as HTMLElement & { options: typeof first };
    expect(el.options).toBe(first);
    rerender(<Select options={second} />);
    expect(el.options).toBe(second);
  });

  it('does not assign options onto the element at all when the prop is omitted', () => {
    const { container } = render(<Select />);
    const el = container.querySelector('lt-select') as HTMLElement & { options?: unknown[] };
    expect(el.options).toBeUndefined();
  });
});
