import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Slider } from './Slider';

describe('Slider', () => {
  it('renders lt-slider', () => {
    const { container } = render(<Slider />);
    expect(container.querySelector('lt-slider')).toBeTruthy();
  });

  it('passes value as attribute', () => {
    const { container } = render(<Slider value={40} />);
    expect(container.querySelector('lt-slider')?.getAttribute('value')).toBe('40');
  });

  it('passes min and max as attributes', () => {
    const { container } = render(<Slider min={10} max={90} />);
    const el = container.querySelector('lt-slider')!;
    expect(el.getAttribute('min')).toBe('10');
    expect(el.getAttribute('max')).toBe('90');
  });

  it('passes step as attribute', () => {
    const { container } = render(<Slider step={5} />);
    expect(container.querySelector('lt-slider')?.getAttribute('step')).toBe('5');
  });

  it('passes size as attribute', () => {
    const { container } = render(<Slider size="lg" />);
    expect(container.querySelector('lt-slider')?.getAttribute('size')).toBe('lg');
  });

  it('passes label as attribute', () => {
    const { container } = render(<Slider label="Volume" />);
    expect(container.querySelector('lt-slider')?.getAttribute('label')).toBe('Volume');
  });

  it('passes disabled as attribute', () => {
    const { container } = render(<Slider disabled />);
    expect(container.querySelector('lt-slider')).toHaveAttribute('disabled');
  });

  it('passes tooltip as attribute', () => {
    const { container } = render(<Slider tooltip />);
    expect(container.querySelector('lt-slider')).toHaveAttribute('tooltip');
  });

  it('forwards ref to lt-slider element', () => {
    const ref = createRef<any>();
    render(<Slider ref={ref} />);
    expect(ref.current?.tagName.toLowerCase()).toBe('lt-slider');
  });

  it('wires onLtInput event handler', () => {
    const handler = vi.fn();
    const { container } = render(<Slider onLtInput={handler} />);
    const el = container.querySelector('lt-slider')!;
    el.dispatchEvent(new CustomEvent('lt-input', { bubbles: true }));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('wires onLtChange event handler', () => {
    const handler = vi.fn();
    const { container } = render(<Slider onLtChange={handler} />);
    const el = container.querySelector('lt-slider')!;
    el.dispatchEvent(new CustomEvent('lt-change', { bubbles: true }));
    expect(handler).toHaveBeenCalledOnce();
  });
});
