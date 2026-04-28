import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders lt-checkbox', () => {
    const { container } = render(<Checkbox />);
    expect(container.querySelector('lt-checkbox')).toBeTruthy();
  });

  it('passes label as attribute', () => {
    const { container } = render(<Checkbox label="Accept terms" />);
    expect(container.querySelector('lt-checkbox')?.getAttribute('label')).toBe('Accept terms');
  });

  it('passes checked as attribute', () => {
    const { container } = render(<Checkbox checked />);
    expect(container.querySelector('lt-checkbox')).toHaveAttribute('checked');
  });

  it('passes disabled as attribute', () => {
    const { container } = render(<Checkbox disabled />);
    expect(container.querySelector('lt-checkbox')).toHaveAttribute('disabled');
  });

  it('forwards ref to lt-checkbox element', () => {
    const ref = createRef<any>();
    render(<Checkbox ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-checkbox');
  });

  it('calls onChange when change event fires', () => {
    const onChange = vi.fn();
    const { container } = render(<Checkbox onChange={onChange} />);
    container.querySelector('lt-checkbox')!.dispatchEvent(new CustomEvent('change'));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('removes change listener on unmount', () => {
    const onChange = vi.fn();
    const { container, unmount } = render(<Checkbox onChange={onChange} />);
    const el = container.querySelector('lt-checkbox')!;
    unmount();
    el.dispatchEvent(new CustomEvent('change'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
