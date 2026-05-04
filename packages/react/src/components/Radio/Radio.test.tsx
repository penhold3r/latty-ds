import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Radio } from './Radio';

describe('Radio', () => {
  it('renders lt-radio', () => {
    const { container } = render(<Radio />);
    expect(container.querySelector('lt-radio')).toBeTruthy();
  });

  it('passes label as attribute', () => {
    const { container } = render(<Radio label="Option A" />);
    expect(container.querySelector('lt-radio')?.getAttribute('label')).toBe('Option A');
  });

  it('passes checked as attribute', () => {
    const { container } = render(<Radio checked />);
    expect(container.querySelector('lt-radio')).toHaveAttribute('checked');
  });

  it('passes disabled as attribute', () => {
    const { container } = render(<Radio disabled />);
    expect(container.querySelector('lt-radio')).toHaveAttribute('disabled');
  });

  it('forwards ref to lt-radio element', () => {
    const ref = createRef<any>();
    render(<Radio ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-radio');
  });

  it('calls onChange when change event fires', () => {
    const onChange = vi.fn();
    const { container } = render(<Radio onChange={onChange} />);
    container.querySelector('lt-radio')!.dispatchEvent(new CustomEvent('change'));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('removes change listener on unmount', () => {
    const onChange = vi.fn();
    const { container, unmount } = render(<Radio onChange={onChange} />);
    const el = container.querySelector('lt-radio')!;
    unmount();
    el.dispatchEvent(new CustomEvent('change'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
