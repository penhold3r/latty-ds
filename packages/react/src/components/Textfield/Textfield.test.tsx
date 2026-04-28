import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Textfield } from './Textfield';

describe('Textfield', () => {
  it('renders lt-textfield', () => {
    const { container } = render(<Textfield />);
    expect(container.querySelector('lt-textfield')).toBeTruthy();
  });

  it('passes label as attribute', () => {
    const { container } = render(<Textfield label="Email" />);
    expect(container.querySelector('lt-textfield')?.getAttribute('label')).toBe('Email');
  });

  it('passes placeholder as attribute', () => {
    const { container } = render(<Textfield placeholder="Enter value" />);
    expect(container.querySelector('lt-textfield')?.getAttribute('placeholder')).toBe('Enter value');
  });

  it('passes disabled as attribute', () => {
    const { container } = render(<Textfield disabled />);
    expect(container.querySelector('lt-textfield')).toHaveAttribute('disabled');
  });

  it('forwards ref to lt-textfield element', () => {
    const ref = createRef<any>();
    render(<Textfield ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-textfield');
  });

  it('calls onInput when input event fires', () => {
    const onInput = vi.fn();
    const { container } = render(<Textfield onInput={onInput} />);
    container.querySelector('lt-textfield')!.dispatchEvent(new CustomEvent('input'));
    expect(onInput).toHaveBeenCalledOnce();
  });

  it('calls onChange when change event fires', () => {
    const onChange = vi.fn();
    const { container } = render(<Textfield onChange={onChange} />);
    container.querySelector('lt-textfield')!.dispatchEvent(new CustomEvent('change'));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('removes event listeners on unmount', () => {
    const onInput = vi.fn();
    const { container, unmount } = render(<Textfield onInput={onInput} />);
    const el = container.querySelector('lt-textfield')!;
    unmount();
    el.dispatchEvent(new CustomEvent('input'));
    expect(onInput).not.toHaveBeenCalled();
  });
});
