import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Textfield } from './Textfield';
// Registers the real <lt-textfield> class, needed for the helperText test below to exercise its actual
// `helperText` accessor rather than a plain, un-upgraded HTMLUnknownElement.
import '@latty-ds/web';

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

  // Regression guard for a bug found 2026-10-19: helperText's type (`string | ((error: boolean) => string)`)
  // means a consumer can pass a function, and a function value can't safely go through a JSX attribute under any
  // React version (React 18 always stringifies it via setAttribute for a custom element; React 19 only property-
  // assigns when the *exact* JSX key already exists on the DOM node, which a kebab-cased key like `helper-text`
  // never does). scripts/codegen-wrappers.mjs lists `helperText` in FUNCTION_CAPABLE_FIELDS so it's always
  // assigned as a real property through the ref-based effect instead, bypassing JSX attributes entirely.
  it('assigns a function helperText as a real property, not a stringified attribute', () => {
    const fn = (error: boolean) => (error ? 'Invalid' : 'Looks good');
    const { container } = render(<Textfield helperText={fn} />);
    const el = container.querySelector('lt-textfield') as HTMLElement & { helperText: unknown };
    expect(el.helperText).toBe(fn);
    expect(el.getAttribute('helper-text')).toBeNull();
  });

  // Companion to Button's icon-start test — same bug, different field name on a different component.
  it('sets icon-start (not iconstart/iconStart) so the inner lt-icon actually renders', () => {
    const { container } = render(<Textfield iconStart="search" />);
    const el = container.querySelector('lt-textfield')!;
    expect(el.getAttribute('icon-start')).toBe('search');
    expect(el.getAttribute('iconStart')).toBeNull();
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
